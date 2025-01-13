let vehicles = [];
let target;
let sliderSpeed;
let sliderForce;
let isSeek = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createVehicles(1);
  createSliders();
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

  vehicles.forEach(vehicle => {
    vehicle.maxSpeed = sliderSpeed.value();
    vehicle.maxForce = sliderForce.value();
    if(isSeek){
      vehicle.seek(target);
    } else {
      vehicle.flee(target);
    }
    vehicle.update();
    vehicle.edges();
    vehicle.show();
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
  if (key === 'c') {
    isSeek = !isSeek;
  }
}

function createSliders(){
  sliderSpeed = createSlider(0, 100, 7, 1);
  sliderForce = createSlider(0, 10, 0.05, 0.01);

  sliderSpeed.position(30, 20);
  sliderSpeed.size(200);
  sliderForce.position(30, 50);
  sliderForce.size(200);

}