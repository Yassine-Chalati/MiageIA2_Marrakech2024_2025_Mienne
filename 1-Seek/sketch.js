let vehicles = [];
let target;
let sliderSpeed;
let sliderForce;
let isSeek = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createVehicles(1);
  createSliders();
  target = new Target(random(width), random(height));
}

function draw() {
  background(0);
  frameRate(300);

  target.show();

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

  let sliderSpeedValue = createP(sliderSpeed.value());
  sliderSpeedValue.style('color', 'white');
  sliderSpeedValue.position(250, 5);
  sliderSpeed.input(() => {
    sliderSpeedValue.html(sliderSpeed.value());
  });

  let sliderForceValue = createP(sliderForce.value());
  sliderForceValue.style('color', 'white');
  sliderForceValue.position(250, 35);
  sliderForce.input(() => {
    sliderForceValue.html(sliderForce.value());
  });

}