var conditions = {
    NEGATIVE: "negative",
    POSITIVE: "positive",
    RECOVERED: "recovered",
    DEAD: "dead"
};

class Sim {
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
        this.condition = Math.random() < 0.03 ? conditions.POSITIVE : conditions.NEGATIVE;
        this.isMasking = false;
        this.isWashing = false;
        this.timeToRecovery = (Math.random() * 50000);
        this.percentChanceToTransmit = basePercentChanceToTransmit;
        this.collitionTimeDuration = 15;
        this.collisionTimer = this.collitionTimeDuration;
        this.asymptomatic = Math.random() < 0.05 ? true : false;
    }

    draw() {

        //draw emoji
        canvasContext.font = "16px Arial";
        canvasContext.textAlign = 'center';
        canvasContext.fillText(this.emoji, this.x, this.y + (this.radius * 0.75));

        //draw masks and/or soap on top of sim emoji
        if (this.isMasking) {
            canvasContext.drawImage(maskImage, this.x - 7.8, this.y - 0.9, maskImage.width * 0.13, maskImage.height * 0.13);
        }
        if (this.isWashing) {
            canvasContext.font = "10px Arial";
            canvasContext.textAlign = 'center';
            canvasContext.fillText('🧼', this.x + 10, this.y + 10);
        }

    }

    //draw the transmission radius if the sim is positive
    drawTransmissionRadius() {
        if (this.condition == conditions.POSITIVE) {
            colorCircle(this.x, this.y, this.transmissionRadius, 'green');
        }
    }

    update() {

        //increase collission radius when distancing. Graphical bug: Changing the radius affects placement of emoji image. maybe change to speed increase when in transmission radius
        switch (interactionMode) {
            case 'masking':
                this.radius = 8;
                break;
            case 'washing':
                this.radius = 8;
                break;
            case 'distancing':
                this.radius = 12;
                break;
        }

        switch (this.condition) {
            case "negative":
                this.emoji = "🙂";
                negativeCount++;
                break;
            case "positive":
                this.emoji = this.asymptomatic ? "🙂" : "🤢";
                positiveCount++;
                this.timeToRecovery--
                if (this.timeToRecovery <= 0) {
                    this.condition = conditions.RECOVERED;
                }
                if (Math.random() < 0.00005 * deathRateMultiplier) {
                    this.condition = conditions.DEAD;
                }
                break;
            case "recovered":
                this.emoji = "😁";
                recoveredCount++;
                break;
            case "dead":
                this.emoji = "💀";
                deadCount++;
                return;
        }

        this.detectCollision();

        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    detectCollision() {
        this.xNextFrame = this.x + this.xSpeed;
        this.yNextFrame = this.y + this.ySpeed;

        if (this.xNextFrame - (this.radius) < 0 || this.xNextFrame + (this.radius) > width) {
            this.xSpeed *= -1;
        }
        if (this.yNextFrame - (this.radius) < 0 || this.yNextFrame + (this.radius) > height - graphPanelHeight - buttonPanelHeight) {
            this.ySpeed *= -1;
        }

        this.collisionTimer--;

        //detect collisions with other nodes
        for (var node of nodes) {
            if (this.collisionTimer > 0) break;
            if (node.condition == conditions.DEAD) continue;

            if (DistanceBetweenTwoObjectsNextFrame(this, node) < (this.radius + node.radius) && DistanceBetweenTwoObjectsNextFrame(this, node) != 0) {
                this.randomizeDirection()
            }

            //detect collision with transmission radius of other nodes
            this.transmissionRadius = this.isMasking ? baseTransmissionRadius * 0.40 : baseTransmissionRadius;
            this.transmissionRadius = this.isWashing ? this.transmissionRadius * 0.80 : this.transmissionRadius
            if (DistanceBetweenTwoObjectsNextFrame(this, node) < (this.radius + node.transmissionRadius)) {
                if (this.condition == conditions.NEGATIVE && node.condition == conditions.POSITIVE) {
                    this.condition = Math.random() < (this.percentChanceToTransmit / 100) ? conditions.POSITIVE : conditions.NEGATIVE;
                }
            }

        }

        //detect collisions with washing stations
        for (var washingStation of washingStations) {
            if (DistanceBetweenTwoObjectsNextFrame(this, washingStation) < (this.radius + washingStation.radius)) {
                this.isWashing = true;
                this.randomizeDirection();
            }
        }
    }

    randomizeDirection() {
        this.ySpeed = Math.random() < 0.5 ? (Math.random() * -this.speed) : (Math.random() * this.speed);
        this.xSpeed = Math.random() < 0.5 ? (Math.random() * -this.speed) : (Math.random() * this.speed);
        this.collisionTimer = this.collitionTimeDuration;
    }

}