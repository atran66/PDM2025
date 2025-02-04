let selectedColor;
let x = 200, y = 200;
let dragging = false;
let offsetX = 0, offsetY = 0;
let paintPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  selectedColor = color(0, 0, 100);
}

function draw() {
  background(0, 0, 50);
  //Canvas
  fill(0, 0, 93);
  rect(400, 200, 700, 400);

  // Draw stored paint points
  for (let i = 0; i < paintPoints.length; i++) {
    fill(paintPoints[i].color);
    noStroke();
    ellipse(paintPoints[i].x, paintPoints[i].y, 10);
  }

  //Color pallet
  fill(0, 100, 100);
  square(402, 202, 20);
  fill(40, 100, 100);
  square(402, 223, 20); 
  fill(60, 100, 100);
  square(402, 244, 20);
  fill(80, 100, 100);
  square(402, 265, 20);
  fill(180, 100, 100);
  square(402, 286, 20);
  fill(225, 100, 100);
  square(402, 307, 20);
  fill(330, 60, 90);
  square(402, 328, 20);
  fill(30, 80, 40);
  square(402, 349, 20);
  fill(0, 0, 100);
  square(402, 370, 20);
  fill(0, 0, 0);
  square(402, 391, 20);
  
// Coloring square
if (dragging) {
  x += (mouseX - pmouseX);
  y += (mouseY - pmouseY);
}

fill(selectedColor);
noStroke();
square(x, y, 20);
}

function mouseClicked() {
  if (mouseX > 402 && mouseX < 422) {
    let index = Math.floor((mouseY - 202) / 20);
    
    if (index >= 0 && index < 10) {
      let colors = [
            [0, 100, 100],  // Red
            [40, 100, 100], // Orange
            [60, 100, 100], // Yellow
            [80, 100, 100], // Green
            [180, 100, 100], // Cyan
            [225, 100, 100], // Blue
            [330, 60, 90],  // Pink
            [30, 80, 40],   // Brown
            [0, 0, 100],    // White
            [0, 0, 0]       // Black
          ];

      selectedColor = color(colors[index][0], colors[index][1], colors[index][2]);
    }
  }
}

function mousePressed() {
  if (mouseX >= x && mouseX <= x + 20 && mouseY >= y && mouseY <= y + 20) {
    dragging = true;
    offsetX = mouseX - x;
    offsetY = mouseY - y;
  }
}

function mouseDragged() {
  if (dragging) {
    return;
  }

  if (mouseX > 400 && mouseX < 1100 && mouseY > 200 && mouseY < 600) {
    let steps = dist(mouseX, mouseY, pmouseX, pmouseY);
    for (let i = 0; i < steps; i++) {
      let x = lerp(pmouseX, mouseX, i / steps);
      let y = lerp(pmouseY, mouseY, i / steps);
      paintPoints.push({ x: x, y: y, color: selectedColor });
    }
  }
  function mouseReleased() {
    dragging = false; // Stop dragging when mouse is released
  }
} 

