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
      this.drawSteeringForce(steeringForce);
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
    //rotate(createVector(this.radius, 0).heading());

    rotate(this.velocity.heading());
    let pt1 = createVector(this.radius * this.velocity.mag(), 0 * this.velocity.mag());
    // pt1.limit(this.maxSpeed);
    // pt1.x *= 10;
    // pt1.y *= 10;
    let pt2 = createVector(0, 0)
    line(pt2.x , pt2.y, pt1.x, pt1.y);
    this.drawArrow(pt2, pt1, 'lightGreen');
    pop();
  }

  drawDesiredVelocityVector(desiredVelocity) {
    push();
    stroke(255, 0, 0)
    strokeWeight(3);
    fill(255, 0, 0);
    translate(this.position.x, this.position.y);
    let pt1 = createVector(desiredVelocity.x * desiredVelocity.mag() * 2 * 10, desiredVelocity.y * desiredVelocity.mag() * 2 * 10);
    pt1.limit(this.maxSpeed)
    pt1.x *= 10;
    pt1.y *= 10;
    let pt2 = createVector(0, 0);
    this.drawArrow(pt2, pt1, 'red');
    pop();
  }

  drawSteeringForce(steeringForce) {
    push();
    stroke(255, 0, 0)
    strokeWeight(3);
    fill(255, 0, 0);
    translate(this.position.x, this.position.y);
    let pt1 = createVector(steeringForce.x * steeringForce.mag() * 1000, steeringForce.y * steeringForce.mag() * 1000);
    //pt1.limit(this.maxSpeed)
    pt1.x *= 10 + 50;
    pt1.y *= 10 + 50;
    let pt2 = createVector(0, 0);
    this.drawArrow(pt2, pt1, 'blue');
    pop();
  }

  drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
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
