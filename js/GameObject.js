class GameObject {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.xSpeed = speed * Math.random() < 0.5 ? -1 : 1 * Math.random();
        this.ySpeed = speed * Math.random() < 0.5 ? -1 : 1 * Math.random();
        this.radius = 10;
        this.testsPositive = Math.random() < 0.1 ? true : false;
        this.recovered = false;
        this.color = this.testsPositive ? 'red' : 'yellow';
    }

    draw() {
        colorCircle(this.x, this.y, this.radius, this.color);
    }

    update() {
        this.color = this.testsPositive ? 'red' : 'yellow';

        if (this.x - (this.radius/2) < 0 || this.x + (this.radius/2) > width) {
            this.xSpeed *= -1;
        }
        if (this.y - (this.radius/2) < 0 || this.y + (this.radius/2) > height) {
            this.ySpeed *= -1;
        }

        for (var node of nodes) {
            if (DistanceBetweenTwoObjects(this, node) < (this.radius + node.radius) && DistanceBetweenTwoObjects(this, node) != 0) {
                this.ySpeed *= -1;
                this.xSpeed *= -1;

                if (!this.recovered && !this.testsPositive && node.testsPositive){
                    this.testsPositive = Math.random() < 0.2 ? true : false;
                }
            }
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

}