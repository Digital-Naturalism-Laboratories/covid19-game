var toggleButtons = []

class Button {
    constructor(x, y, image, radius, fontSize, isToggle, startsEnabled) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.radius = radius;
        this.fontSize = fontSize;
        this.isToggle = isToggle;
        this.isEnabled = startsEnabled;
        this.bgColor = '#009ada';

        if (this.isToggle) {
            toggleButtons.push(this);
        }
    }

    update() {

        if (this == buttonDistancing) {
            this.bgColor = '#1055b7';
        } else {
            this.bgColor = this.isEnabled ? '#ed8300' : '#009ada';
        }

        if (buttonMasking.isEnabled == true) {
            interactionMode = interactionModes.MASKING;
        }
        if (buttonWashing.isEnabled == true) {
            interactionMode = interactionModes.WASHING;
        }

    }

    draw() {
        if (this.isToggle) {
            colorRect(this.x - (buttonPanelWidth / 2), this.y - (buttonPanelHeight / 2), buttonPanelWidth, buttonPanelHeight, this.bgColor);
            canvasContext.lineWidth = 2;
            colorLine(canvas.width * 0.33, canvas.height - (graphPanelHeight + bannerHeight + buttonPanelHeight), canvas.width * 0.33, canvas.height - (graphPanelHeight + bannerHeight), 'white');
            colorLine(canvas.width * 0.67, canvas.height - (graphPanelHeight + bannerHeight + buttonPanelHeight), canvas.width * 0.67, canvas.height - (graphPanelHeight + bannerHeight), 'white');

            if (this.image == ruler) {
                canvasContext.drawImage(this.image, this.x - 55, this.y - 32, 50, 50);

                canvasContext.fillStyle = "white";
                canvasContext.font = "12px Bogle";
                canvasContext.fillText("Distanciamiento Social", this.x, this.y + 20);

                if (this.isEnabled) { //draw social distancing "On" indicator

                    colorRect(this.x + 12, this.y - 16, 30, 20, "darkgreen");
                    colorCircle(this.x + 12, this.y - 6, 10, "darkgreen");
                    colorCircle(this.x + 12 + 30, this.y - 6, 10, "darkgreen");

                    colorCircle(this.x + 12 + 30, this.y - 5, 8, "lightgreen");

                } else { //draw social distancing "Off" indicator

                    colorRect(this.x + 12, this.y - 16, 30, 20, "darkred");
                    colorCircle(this.x + 12, this.y - 6, 10, "darkred");
                    colorCircle(this.x + 12 + 30, this.y - 6, 10, "darkred");

                    colorCircle(this.x + 12, this.y - 5, 8, "red");
                }
            } else {
                canvasContext.drawImage(this.image, this.x - 18, this.y - 18, 36, 36);
            }

            if (this.image == healthy_face) {
                canvasContext.drawImage(mask, this.x - 18, this.y - 18, 36, 36);
            }

        } else {
            canvasContext.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }

    }

    handleClick(xClick, yClick) {
        if (DistanceBetweenTwoPixelCoords(xClick, yClick, this.x, this.y) < this.radius) {

            if (this.isToggle) {

                if (yClick > canvas.height - (graphPanelHeight + bannerHeight + buttonPanelHeight) &&
                    yClick < canvas.height - (graphPanelHeight + bannerHeight)) {

                    if (this == buttonMasking) {
                        this.isEnabled = true;
                        buttonWashing.toggleOff();
                    }

                    if (this == buttonWashing) {
                        this.isEnabled = true;
                        buttonMasking.toggleOff();
                    }

                    if (this == buttonDistancing) {
                        this.isEnabled = !this.isEnabled;
                    }
                }

            } else {

                if (gameState == gameStates.START) {
                    gameState = gameStates.INSTRUCTIONS;
                } else {
                    gameState = gameStates.MAIN;
                    resetGame();
                }

            }

        }
    }

    toggleOff() {
        this.isEnabled = false;
    }
}