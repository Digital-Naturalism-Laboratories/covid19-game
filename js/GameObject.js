var conditions  = {
    NEGATIVE: "negative",
    POSITIVE: "positive",
    RECOVERED: "recovered",
    DEAD: "dead"
};

class GameObject {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.xNextFrame;
        this.yNextFrame;
        this.speed = speed;
        this.xSpeed = speed * Math.random() < 0.5 ? (-1 * Math.random()) : (1 * Math.random());
        this.ySpeed = speed * Math.random() < 0.5 ? (-1 * Math.random()) : (1 * Math.random());
        this.radius = 8;
        this.transmissionRadius = baseTransmissionRadius;
        //this.condition = Math.random() < 0.03 ? conditions.POSITIVE : conditions.NEGATIVE;
        this.testsPositive = Math.random() < 0.03 ? true : false;
        this.recovered = false;
        this.masking = false;
        this.isDead = false;
        this.timeToRecovery = (Math.random() * 50000);
        this.color = this.testsPositive ? 'red' : 'yellow';
        this.emoji = this.testsPositive ? "🤢" : "🙂";
        this.percentChanceToTransmit = basePercentChanceToTransmit;


    }

    draw() {
        colorCircle(this.x, this.y, this.radius, this.color); //Indicated Collision Area
        canvasContext.font = "16px Arial";
        canvasContext.fillText(this.emoji, this.x - (this.radius * 1.33), this.y + (this.radius * 0.66));
    }

    drawTransmissionRadius() {
        if (this.testsPositive){
            colorCircle(this.x, this.y, this.transmissionRadius, "green");
        }
    }

    update() {
        this.emoji = "🙂"

        if (this.isDead) {
            this.emoji = "💀";
            this.testsPositive = false;
            this.recovered = false;
        }

        if (this.testsPositive) {
            this.emoji = "🤢";
        }

        //this.emoji = this.testsPositive ? "🤢" : "🙂";
        if (this.recovered && !this.isDead) {
            this.emoji = "🙂";
        }

        if (this.masking && !this.isDead) {
            this.emoji = "😷";
            //this.percentChanceToTransmit = basePercentChanceToTransmit / 2;
        }
 

        this.xNextFrame = this.x + this.xSpeed;
        this.yNextFrame = this.y + this.ySpeed;

        if (this.xNextFrame - (this.radius) < 0 || this.xNextFrame + (this.radius) > width) {
            this.xSpeed *= -1;
        }
        if (this.yNextFrame - (this.radius) < 0 || this.yNextFrame + (this.radius) > height - bottomPanelHeight) {
            this.ySpeed *= -1;
        }

        for (var node of nodes) {
            if (DistanceBetweenTwoObjectsNextFrame(this, node) < (this.radius + node.radius) && DistanceBetweenTwoObjectsNextFrame(this, node) != 0) {
                this.ySpeed *= -1;
                this.xSpeed *= -1;
            }

            this.transmissionRadius = this.masking ? baseTransmissionRadius * 0.35 : baseTransmissionRadius;
            if (DistanceBetweenTwoObjectsNextFrame(this, node) < (this.radius + node.transmissionRadius)) {
                if (!this.recovered && !this.testsPositive && node.testsPositive) {
                    this.testsPositive = Math.random() < (this.percentChanceToTransmit / 100) ? true : false;
                }
            }

        }

        if (this.testsPositive) {
            this.timeToRecovery--
            if (this.timeToRecovery <= 0) {
                this.testsPositive = false;
                this.recovered = true;
            }

            this.isDead = Math.random() < 0.00001 ? true : false;
        }

        if (!this.isDead) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;

            this.x = this.xNextFrame;
            this.y = this.yNextFrame;
        }

    }

}