var deathRateMultiplier = 1;

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
        this.speedMultiplier = 1;
        this.xSpeed = speed * Math.random() < 0.5 ? (-1 * Math.random()) : (1 * Math.random());
        this.ySpeed = speed * Math.random() < 0.5 ? (-1 * Math.random()) : (1 * Math.random());
        this.radius = 8;
        this.transmissionRadius = baseTransmissionRadius;
        this.condition = conditions.NEGATIVE;
        this.isMasking = false;
        this.isWashing = false;
        this.timeToRecovery = (Math.random() * 1000) + (60 * 30); //measured in frames
        this.percentChanceToTransmit = basePercentChanceToTransmit;
        this.collitionTimeDuration = 20; //measured in frames
        this.collisionTimer = this.collitionTimeDuration; //measured in frames
        this.asymptomatic = Math.random() < 0.05 ? true : false;
    }

    draw() {

        //draw sim emoji
        canvasContext.font = "16px Arial";
        canvasContext.textAlign = 'center';
        canvasContext.fillText(this.emoji, this.x, this.y + (this.radius * 0.75));

        //draw masks and/or soap icon on top of sim emoji
        if (this.isMasking && !this.condition.DEAD) {
            canvasContext.drawImage(maskImage, this.x - 7.8, this.y - 0.9, maskImage.width * 0.13, maskImage.height * 0.13);
        }
        if (this.isWashing && !this.condition.DEAD) {
            canvasContext.font = "10px Arial";
            canvasContext.textAlign = 'center';
            canvasContext.fillText('🧼', this.x + 10, this.y + 10);
        }

    }

    drawTransmissionRadius() {

        //draw the transmission radius if the sim is positive
        if (this.condition == conditions.POSITIVE) {
            colorCircle(this.x, this.y, this.transmissionRadius, 'green');
        }

    }

    update() {

        switch (this.condition) {
            case "negative":

                this.emoji = "🙂";
                negativeCount++;

                //chance for recovered sims to die if hospitials over capacity
                if (isOverCapacity) {
                    if (Math.random() < 0.00005  * deathRateMultiplier) {
                        this.condition = conditions.DEAD;
                    }
                }
                break;

            case "positive":

                this.emoji = this.asymptomatic ? "🙂" : "🤢";
                positiveCount++;

                //countdown until a positive sim is recovered
                this.timeToRecovery--
                if (this.timeToRecovery <= 0) {
                    this.condition = conditions.RECOVERED;
                }

                //chance each frame of a positive sim dying before recovering
                if (Math.random() < 0.00005  * deathRateMultiplier) {
                    this.condition = conditions.DEAD;
                }
                break;

            case "recovered":

                this.emoji = "😁";
                recoveredCount++;

                //chance for recovered sims to die if hospitials over capacity
                if (isOverCapacity) {
                    if (Math.random() < 0.00005  * deathRateMultiplier) {
                        this.condition = conditions.DEAD;
                    }
                }

                break;

            case "dead":

                this.emoji = "💀";
                this.isMasking = false;
                this.isWashing = false;
                deadCount++;
                return; //exits update function if the sim is dead

        }

        this.detectCollision();

        //update sim position
        this.x += this.xSpeed * this.speedMultiplier;
        this.y += this.ySpeed * this.speedMultiplier;
    }

    detectCollision() {

        //set transmission radius based on isMasking and isWashing
        this.transmissionRadius = this.isMasking ? baseTransmissionRadius * 0.40 : baseTransmissionRadius;
        this.transmissionRadius = this.isWashing ? this.transmissionRadius * 0.80 : this.transmissionRadius

        //save the position of where the sim will be next frame for collision calculations
        this.xNextFrame = this.x + this.xSpeed;
        this.yNextFrame = this.y + this.ySpeed;

        //bounce the sim off the left and right walls on collision
        if (this.xNextFrame - (this.radius) < 0 || this.xNextFrame + (this.radius) > width) {
            this.xSpeed *= -1;
        }

        //bounce the sim off the top and bottom walls on collision
        if (this.yNextFrame - (this.radius) < 0 || this.yNextFrame + (this.radius) > height - graphPanelHeight - buttonPanelHeight - bannerHeight) {
            this.ySpeed *= -1;
        }

        this.collisionTimer--;

        //cycle through all other sims to test for collisions
        for (var sim of sims) {
            if (sim.condition == conditions.DEAD) continue;

            //check if this sim is within another's transmission radius
            if (DistanceBetweenTwoObjectsNextFrame(this, sim) < (this.radius + sim.transmissionRadius)) {

                //chance for virus to tranmit from a positive sim to this sim
                if (this.condition == conditions.NEGATIVE && sim.condition == conditions.POSITIVE) {
                    this.condition = Math.random() < (this.percentChanceToTransmit / 100) ? conditions.POSITIVE : conditions.NEGATIVE;
                }

                //if distancing mode is enabled, change direction when when in a sims transmission radius
                if (interactionMode == interactionModes.DISTANCING) {
                    this.randomizeDirection();
                }
            }

            //modify distancing radius and sim speed when distancing mode is enabled
            if (buttonDistancing.isEnabled) {
                var distancingRadius = this.radius * 2;
                this.speedMultiplier = 0.5;
            } else {
                distancingRadius = this.radius;
                this.speedMultiplier = 1;
            }

            //detect collision with another sim and change direction
            if (DistanceBetweenTwoObjectsNextFrame(this, sim) < (distancingRadius + sim.radius) && DistanceBetweenTwoObjectsNextFrame(this, sim) != 0) {
                this.randomizeDirection();
            }

        }

        //detect proximity to washing stations
        for (var washingStation of washingStations) {
            if (DistanceBetweenTwoObjects(this, washingStation) < (this.radius + washingStation.radius)) {
                this.isWashing = true;
            }
        }
    }

    randomizeDirection() {

        if (this.collisionTimer > 0) return;

        this.ySpeed = Math.random() < 0.5 ? (Math.random() * -this.speed) : (Math.random() * this.speed);
        this.xSpeed = Math.random() < 0.5 ? (Math.random() * -this.speed) : (Math.random() * this.speed);
        
        //reset collision timer
        this.collisionTimer = this.collitionTimeDuration;

    }

}