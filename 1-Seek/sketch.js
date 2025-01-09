let vehicles = [];
let target;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
  vehicles.
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

  vehicles.forEach(vehicule => {
    vehicule.seek(target);
    vehicule.update();
    vehicule.show();
  });

}