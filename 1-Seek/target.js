class Target {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.radius = 30;
    }

    show() {
        push();
        fill(0, 255, 0);
        stroke(3);
        strokeWeight(1);
        circle(this.position.x, this.position.y, this.radius);
        pop();
    }

    reappear() {
        this.position.x = random(width);
        this.position.y = random(height);
    }
}