let vehicles = [];
let target;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createVehicles(1);
  
}

function draw() {
  background(0);
  frameRate(300);
  
  push();
  fill(0, 255, 0);
  noStroke();
  target = createVector(mouseX, mouseY);
  circle(target.x, target.y, 35);
  pop();

  vehicles.forEach(vehicule => {
    vehicule.seek(target);
    vehicule.update();
    vehicule.edges();
    vehicule.show();
  });

}

function createVehicles(number) {
  for(let i = 0; i < number; i++){
    vehicles.push(new Vehicle(random(width), random(height)));
  }
}

function keyPressed() {
  if(key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}