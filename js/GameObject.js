class GameObject {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.xNextFrame;
        this.yNextFrame;
        this.speed = speed;
        this.xSpeed = speed * Math.random() < 0.5 ? (-1 * Math.random()) : (1 * Math.random());
        this.ySpeed = speed * Math.random() < 0.5 ? (-1 * Math.random()) : (1 * Math.random());
        this.radius = 10;
        this.testsPositive = Math.random() < 0.1 ? true : false;
        this.recovered = false;
        this.timeToRecovery = (Math.random() * 10000);
        this.color = this.testsPositive ? 'red' : 'yellow';
    }

    draw() {
        colorCircle(this.x, this.y, this.radius, this.color);
    }

    update() {
        this.color = this.testsPositive ? 'red' : 'yellow';
        if (this.recovered) {this.color = 'green';}

        this.xNextFrame = this.x + this.xSpeed;
        this.yNextFrame = this.y + this.ySpeed;

        if (this.xNextFrame - (this.radius) < 0 || this.xNextFrame + (this.radius) > width) {
            this.xSpeed *= -1;
        }
        if (this.yNextFrame - (this.radius) < 0 || this.yNextFrame + (this.radius) > height - bottomPanelHeight) {
            this.ySpeed *= -1;
        }

        for (var node of nodes) {
            if (DistanceBetweenTwoObjectsNextFrame(this, node) < (this.radius + node.radius) && DistanceBetweenTwoObjects(this, node) != 0) {
                this.ySpeed *= -1;
                this.xSpeed *= -1;

                if (!this.recovered && !this.testsPositive && node.testsPositive){
                    this.testsPositive = Math.random() < (percentChanceToTransmit/100) ? true : false;
                }
            }
        }

        if (this.testsPositive){
            this.timeToRecovery--
            if(this.timeToRecovery <= 0) {
                this.testsPositive = false;
                this.recovered = true;
            }
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.x = this.xNextFrame;
        this.y = this.yNextFrame;
    }

}