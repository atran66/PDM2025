function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 225);
}

function draw() {
  background(0, 0, 50);

  // Example 1:
  noStroke(0);
  fill(118, 118, 90);
  rect(90, 40, 220, 110);

  stroke('black');
  strokeWeight(1);
  fill(0, 0, 100);
  circle(145, 95, 90);
  square(210, 50, 90);

  // Example 2:
  noStroke(0);
  square(90, 180, 220);

  fill(0, 60, 120, 150);
  circle(200, 250, 110);

  fill(240, 60, 120, 150);
  circle(160, 320, 110);

  fill(100, 60, 100, 150);
  circle(240, 320, 110); 

  // Example 3:
  fill(0, 0, 0);
  rect(90, 430, 220, 110);

  fill(60, 100, 100);
  arc(145, 485, 90, 90, radians(220), radians(140), PIE);
  fill(15, 120, 90); 
  rect(205, 485, 90, 45); 
  circle(250, 485, 90); 
  fill (0,0,100)
  circle(230, 485, 25);
  circle(270, 485, 25);
  fill (225,120,100)
  circle(230, 485, 15);
  circle(270, 485, 15);

  //Example 4:
  fill(220, 200, 55);
  rect(90, 570, 220, 220);  

  stroke('white');
  strokeWeight(3);
  fill(110,100, 50);
  circle(200, 685, 110);

  fill(0, 100, 100);
  beginShape();
  vertex(200, 630); 
  vertex(215, 670);
  vertex(255, 670);
  vertex(220, 695);
  vertex(235, 735);
  vertex(200, 710);
  vertex(165, 735);
  vertex(180, 695);
  vertex(145, 670);
  vertex(185, 670);
  endShape(CLOSE);
}



