let vehicule;
let target;

function setup() {
  createCanvas(windowWidth, windowHeight);
  vehicule = new Vehicle(100, 100);
}

function draw() {
  background(0);
  
  push();
  fill(0, 255, 0);
  noStroke();
  target = createVector(mouseX, mouseY);
  circle(target.x, target.y, 35);
  pop();

  vehicule.seek(target)
  vehicule.update();
  vehicule.show();
}