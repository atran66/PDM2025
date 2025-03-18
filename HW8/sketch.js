let GameStates = Object.freeze({ 
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START;
let score = 0;
let highScore = 0;
let time = 30;
let textPadding = 15;
let gameFont;
let bugs = [];
let bugSpeed = 1;
let bugSpriteSheet, squishedBugImage;
let bugFrames = [];
let frameCount = 4; // Number of frames in sprite sheet
let frameIndex = 0;
let frameDelay = 5;
let frameTimer = 0;

function preload() {
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  bugSpriteSheet = loadImage("media/Bug.png.png");
  squishedBugImage = loadImage("media/SquishedBug.png");

  // Load sound files
  bugSquishSound = loadSound("media/squish.mp3.mp3");
  missClickSound = loadSound("media/miss.mp3.mp3");
  skitteringSound = loadSound("media/skitter.mp3.mp3");
  bgMusic = loadSound("media/gameMusic.mp3.mp3");
}

function setup() {
  createCanvas(600, 600);
  textFont(gameFont);
  
  // Extract frames from sprite sheet
  let frameWidth = bugSpriteSheet.width / frameCount;
  let frameHeight = bugSpriteSheet.height;
  for (let i = 0; i < frameCount; i++) {
    bugFrames.push(bugSpriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight));
  }
  
  spawnBugs(5);

  // Play background music and skittering sounds
    bgMusic.loop();
    skitteringSound.loop();
    skitteringSound.setVolume(0.3);
}

function draw() {
  background(0, 255, 0);

  switch(gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER)
      textSize(18);
      text("Ant Killer \n", width / 2, height / 2 -20);
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2 + 20);
      bgMusic.rate(1); // Normal speed at start
      break;
    
    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);
      
      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }
      
      frameTimer++;
      if (frameTimer >= frameDelay) {
        frameIndex = (frameIndex + 1) % frameCount;
        frameTimer = 0;
      }
      
      for (let bug of bugs) {
        bug.move();
        bug.display();
      }
      
      bugs = bugs.filter(bug => !bug.shouldRemove());
      bgMusic.rate(1 + (30 - time) / 60); // Speed up music as time decreases
      break;
    
    case GameStates.END:
      textAlign(CENTER, CENTER);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      if (score > highScore) highScore = score;
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      text("Press ENTER to Restart", width / 2, height / 2 + 40);
      bgMusic.stop(); // Stop music on game over
      break;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === GameStates.START || gameState === GameStates.END) {
      gameState = GameStates.PLAY;
      score = 0;
      time = 30;
      bugSpeed = 1;
      bugs = [];
      spawnBugs(5);

      // Restart background music if it's not playing
      if (!bgMusic.isPlaying()) {
        bgMusic.loop();
      }
    }
  }
}

function mousePressed() {
  if (gameState === GameStates.PLAY) {
    let bugHit = false;
    for (let bug of bugs) {
      if (bug.clicked(mouseX, mouseY)) {
        bug.squish();
        score++;
        bugSpeed += 0.2; 
        spawnBugs(1); 
        
        // Play bug squish sound
        bugSquishSound.play();
        bugHit = true;
      }
    }
    
    // If no bugs were hit, play a "missed click" sound
    if (!bugHit) {
      missClickSound.play();
    }
  }
}


function spawnBugs(count) {
  for (let i = 0; i < count; i++) {
    bugs.push(new Bug());
  }
}

class Bug {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = 40;
    this.speed = bugSpeed;
    this.angle = random(TWO_PI);
    this.alive = true;
    this.squishTimer = 0;
  }
  
  move() {
    if (this.alive) {
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;
      
      if (this.x < 0 || this.x > width) {
        this.angle = PI - this.angle;
      }
      if (this.y < 0 || this.y > height) {
        this.angle = -this.angle;
      }
    }
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + PI / 2); 
    imageMode(CENTER);
    if (this.alive) {
      image(bugFrames[frameIndex], 0, 0, this.size, this.size);
    } else {
      image(squishedBugImage, 0, 0, this.size, this.size);
    }
    pop();
  }
  
  clicked(mx, my) {
    return dist(mx, my, this.x, this.y) < this.size / 2;
  }
  
  squish() {
    this.alive = false;
    this.speed = 0;
    this.squishTimer = millis();
  }
  
  shouldRemove() {
    return !this.alive && millis() - this.squishTimer > 500; 
  }
}
