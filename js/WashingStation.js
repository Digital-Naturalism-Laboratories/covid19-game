class WashingStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
    }

    draw() {
        canvasContext.drawImage(soap, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

}