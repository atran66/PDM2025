let Viking, Robot, Eskimo, Hand;
let characters = [];

function preload() {
  Viking = loadImage("Viking.png");
  Robot = loadImage("Robot.png");
  Eskimo = loadImage("Eskimo.png");
  Hand = loadImage("Hand.png");
}

function setup() {
  createCanvas(700, 700);
  imageMode(CENTER);

  let character1 = new Character(random(80, width - 80), random(80, height - 80), Viking);
  let character2 = new Character(random(80, width - 80), random(80, height - 80), Robot);
  let character3 = new Character(random(80, width - 80), random(80, height - 80), Eskimo);
  let character4 = new Character(random(80, width - 80), random(80, height - 80), Hand);

  characters.push(character1, character2, character3, character4);
}

function draw() {
  background(255, 100, 100);
  
  characters.forEach(character => character.draw());
}

function keyPressed() {
  characters.forEach(character => character.keyPressed());
}

function keyReleased() {
  characters.forEach(character => character.keyReleased());
}

class Character {
  constructor(x, y, spriteSheet) {
    this.x = x;
    this.y = y;
    this.currentAnimation = "idle";
    this.animations = {};
    this.spriteSheet = spriteSheet;

    this.addAnimation("moveRight", new SpriteAnimation(spriteSheet, 0, 0, 6));
    let leftAnim = new SpriteAnimation(spriteSheet, 0, 0, 6);
    leftAnim.flipped = true;
    this.addAnimation("moveLeft", leftAnim);
    this.addAnimation("idle", new SpriteAnimation(spriteSheet, 0, 0, 1));
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "moveLeft":
          this.x -= 2.5;
          break;
        case "moveRight":
          this.x += 2.5;
          break;
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }

  keyPressed() {
    switch (keyCode) {
      case LEFT_ARROW:
        this.currentAnimation = "moveLeft";
        break;
      case RIGHT_ARROW:
        this.currentAnimation = "moveRight";
        break;
    }
  }

  keyReleased() {
    this.currentAnimation = "idle";
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {
    let s = this.flipped ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 10 === 0) this.u++;

    if (this.u === this.startU + this.duration) this.u = this.startU;
  }
}