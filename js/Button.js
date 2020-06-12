class Button{
    constructor(x, y, emoji, radius){
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.radius = radius;
    }

    draw(){
        canvasContext.font = "100px Arial";
        canvasContext.fillText(this.emoji, this.x - (this.radius * 1.33), this.y + (this.radius * 0.66));
    }

    handleClick(xClick, yClick){
        if (DistanceBetweenTwoPixelCoords(xClick, yClick, this.x, this.y) < this.radius){
            gameState = gameStates.MAIN;
            resetGame();
        }
    }
}
