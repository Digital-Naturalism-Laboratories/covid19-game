class WashingStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.xNextFrame = this.x;
        this.yNextFrame = this.y;

    }
    draw() {
        canvasContext.font = "16px Arial";
        canvasContext.textAlign = 'center';
        colorCircle(this.x, this.y, this.radius, "blue");
        canvasContext.fillText('🧼', this.x, this.y + 5);
    }
}