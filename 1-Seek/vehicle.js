class Vehicle {
  static debug = false;
  constructor(x, y) {
    // position du véhicule
    this.position = createVector(x, y);
    // vitesse du véhicule
    this.velocity = createVector(0, 0);
    // accélération du véhicule
    this.acceleration = createVector(0, 0);
    // vitesse maximale du véhicule
    this.maxSpeed = 7;
    // force maximale appliquée au véhicule
    this.maxForce = 0.05;
    // rayon du véhicule
    this.radius = 16;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    push();
    fill(255);
    stroke(255);
    strokeWeight(2);
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.radius, -this.radius, -this.radius, this.radius, this.radius, 0);
    fill(255, 0, 0);
    stroke(255, 255, 255);
    triangle(-this.radius / 2, -this.radius / 2, -this.radius / 2, this.radius / 2, this.radius / 2, 0);
    fill(255, 0, 0);
    square(-this.radius - 7, -this.radius / 2 - 3, 7);
    square(-this.radius - 7, this.radius / 2 - 4, 7);
    pop();
  }

  seek(target) {
    let desiredVelocity = p5.Vector.sub(target, this.position);
    desiredVelocity.limit(this.maxSpeed);
    let steeringForce = p5.Vector.sub(desiredVelocity, this.velocity);
    steeringForce.limit(this.maxForce);
    this.applyForce(steeringForce);
    if(Vehicle.debug) {
      this.drawVelocityVector();
      this.drawDesiredVelocityVector(desiredVelocity);
    }
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  drawVelocityVector() {
    push();
    stroke(0, 255, 0);
    strokeWeight(3);
    fill(0, 255, 0);
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    let point = createVector(this.velocity.mag(), 0 * this.velocity.mag());
    line(0 , 0, point.x * 20, point.y * 20);
    line(point.x * 20, 0 * this.velocity.mag() * 2, point.x * 20 - 13, 5)
    line(point.x * 20, 0 * this.velocity.mag() * 2, point.x * 20 - 13, -5)
    pop();
  }

  drawDesiredVelocityVector(desiredVelocity) {
    push();
    stroke(255, 0, 0)
    strokeWeight(3);
    fill(255, 0, 0);
    translate(this.position.x, this.position.y);
    let point = createVector(desiredVelocity.x, desiredVelocity.y);
    point.limit(this.maxSpeed)
    line(0, 0, point.x * 20, point.y * 20 );
    rotate(createVector(0, 0).heading());
    line(point.x * 20, point.y * 20, point.x * 20 - 13, point.y * 20 + 5);
    line(point.x * 20, point.y * 20, point.x * 20 - 13, point.y * 20 - 5);
    pop();
  }

  drawSteeringForce() {
    
  }

  drawCirlce() {
    push();
    stroke(255, 255, 255);
    strokeWeight(3);
    fill(0, 0, 0, 0);
    translate(this.position.x, this.position.y);
    circle(0, 0, this.radius * 2)
    pop();
  }


}
