class GameObject{
    constructor (x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.radius = 10
        this.testsPositive = false;
    }

    draw(){
        colorCircle(this.x, this.y, this.radius, 'yellow');
    } 

}