class WashingStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;

    }

    draw() {
        canvasContext.font = "30px Arial";
        canvasContext.textAlign = 'center';
        canvasContext.fillText('🧼', this.x, this.y);
    }
}