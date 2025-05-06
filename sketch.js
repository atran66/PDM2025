let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  WIN: "win",
  END: "end"
});
let gameState = GameStates.START;

let score = 0;
let time = 50;
let textPadding = 15;
let lives = 3;

let port;
let connectButton;
let cursorX;
let speed = 5;
let prevSW = 0;

let playerImage, zombieSpritesheet, deadZombieImage, bulletImage;
let bullets = [];
let zombies = [];

let zombieFrames = [];
const ZOMBIE_FRAME_COUNT = 4;

function preload() {
  gameFont = loadFont("https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/pressstart2p/PressStart2P-Regular.ttf");
  playerImage = loadImage("media/player.png");
  zombieSpritesheet = loadImage("media/zombie_spritesheet.png");
  deadZombieImage = loadImage("media/zombie_dead.png");
  bulletImage = loadImage("media/bullet.png");

  gunshotSound = loadSound("media/gunshot.mp3");
  gunshotSound.setVolume(2.5);
  zombiedeadSound = loadSound("media/zombie_dead.mp3");
  zombiedeadSound.setVolume(1.5);
  zombiegrowlSound = loadSound("media/zombie_growl.mp3");
  bgMusic = loadSound("media/gameMusic.mp3");
  bgMusic.setVolume(0.2);
}

function setup() {
  createCanvas(600, 600);
  textFont(gameFont);

  for (let i = 0; i < ZOMBIE_FRAME_COUNT; i++) {
    zombieFrames.push(zombieSpritesheet.get(
      i * zombieSpritesheet.width / ZOMBIE_FRAME_COUNT, 0,
      zombieSpritesheet.width / ZOMBIE_FRAME_COUNT,
      zombieSpritesheet.height
    ));
  }

  port = createSerial();

  connectButton = select('#connectButton');
  connectButton.mousePressed(() => port.open());

  cursorX = width / 2;
}

function draw() {
  background(0, 100, 200);

  let str = port.readUntil('\n');
  let sw = 0;
  if (str !== "") {
    const values = str.trim().split(',');
    if (values.length === 3) {
      sw = Number(values[2]);

      if (gameState === GameStates.PLAY && sw === 1 && prevSW === 0) {
        bullets.push(new Bullet(cursorX, height - 72));
        gunshotSound.play(); 
      }

      prevSW = sw;
    }
  }

  if (keyIsDown(LEFT_ARROW)) cursorX -= speed;
  if (keyIsDown(RIGHT_ARROW)) cursorX += speed;
  cursorX = constrain(cursorX, 20, width - 20);

  switch (gameState) {
    case GameStates.START:
      drawStartScreen();
      break;
    case GameStates.PLAY:
      drawGame();
      break;
    case GameStates.WIN:
      drawWinScreen();
      break;
    case GameStates.END:
      drawEndScreen();
      break;
  }

  drawPlayer();

  fill(255);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text(`Lives: ${lives}`, 10, height - 25);
  text(`Shoot Button: ${sw}`, 10, height - 10);
}

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(255);
  text("Zombie Shooter", width / 2, height / 2 - 20);
  text("Press ENTER to Start", width / 2, height / 2 + 20);
}

function drawGame() {
  textAlign(LEFT, TOP);
  fill(255);
  text("Score: " + score, textPadding, textPadding);
  textAlign(RIGHT, TOP);
  text("Time: " + Math.ceil(time), width - textPadding, textPadding);

  time -= deltaTime / 1000;
  if (time <= 0) gameState = GameStates.END;

  if (random(1) < 0.02) {
    zombies.push(new Zombie());
  }

  for (let b of bullets) b.update();
  bullets = bullets.filter(b => b.y > 0);
  for (let b of bullets) b.display();

  for (let z of zombies) z.update();

  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = zombies.length - 1; j >= 0; j--) {
      if (!zombies[j].dead && bullets[i].hits(zombies[j])) {
        zombies[j].squish();
        bullets.splice(i, 1);
        score++;
        zombiedeadSound.play(); 
        break;
      }
    }
  }

  zombies = zombies.filter(z => !z.shouldRemove());

  for (let z of zombies) {
    if (z.reachedPlayer()) {
      lives--;
      if (lives > 0) {
        zombies = [];
        bullets = [];
        port.write("life\n");
      } else {
        port.write("life\n");
        gameState = GameStates.END;
      }
    }
  }

  if (score >= 20
  ) {
    gameState = GameStates.WIN;
  }

  for (let z of zombies) z.display();
}

function drawWinScreen() {
  textAlign(CENTER, CENTER);
  fill(255);
  text("You Win!", width / 2, height / 2 - 20);
  text("Score: " + score, width / 2, height / 2);
  text("Press ENTER to Restart", width / 2, height / 2 + 40);
}

function drawEndScreen() {
  textAlign(CENTER, CENTER);
  fill(255);
  text("Game Over!", width / 2, height / 2 - 20);
  text("Score: " + score, width / 2, height / 2);
  text("Press ENTER to Restart", width / 2, height / 2 + 40);
}

function drawPlayer() {
  imageMode(CENTER);
  image(playerImage, cursorX, height - 60, 100, 100);
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === GameStates.START || gameState === GameStates.END || gameState === GameStates.WIN) {
      gameState = GameStates.PLAY;
      score = 0;
      time = 35;
      lives = 3;
      bullets = [];
      zombies = [];
      port.write("reset\n");
      bgMusic.play(); 
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.width = 50;
    this.height = 80;
    this.isVisible = true;
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) this.isVisible = false;
  }

  display() {
    if (this.isVisible) {
      imageMode(CENTER);
      image(bulletImage, this.x, this.y, this.width, this.height);
    }
  }

  hits(zombie) {
    return this.isVisible && dist(this.x, this.y, zombie.x, zombie.y) < 25;
  }
}

class Zombie {
  constructor() {
    this.x = random(40, width - 40);
    this.y = -20;
    this.speed = random(1.0, 1.5);
    this.size = 100;
    this.dead = false;
    this.squishTime = 0;
    this.frame = 0;
    this.animSpeed = 0.2;
  }

  update() {
    if (!this.dead) {
      this.y += this.speed;
      this.frame += this.animSpeed;
      if (this.frame >= zombieFrames.length) this.frame = 0;
    }
  }

  display() {
    imageMode(CENTER);
    if (this.dead) {
      image(deadZombieImage, this.x, this.y, this.size, this.size);
    } else {
      let img = zombieFrames[floor(this.frame)];
      image(img, this.x, this.y, this.size, this.size);
    }
  }

  squish() {
    this.dead = true;
    this.squishTime = millis();
  }

  shouldRemove() {
    return this.dead && millis() - this.squishTime > 500;
  }

  reachedPlayer() {
    return !this.dead && this.y > height - 60;
  }
}
