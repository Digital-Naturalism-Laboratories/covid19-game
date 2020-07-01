var toggleButtons = []

class Button {
    constructor(x, y, emoji, radius, fontSize, isToggle, startsEnabled) {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.radius = radius;
        this.fontSize = fontSize;
        this.isToggle = isToggle;
        this.isEnabled = startsEnabled;
        this.bgColor = 'blue';

        if (this.isToggle) {
            toggleButtons.push(this);
        }
    }

    update() {
        this.bgColor = this.isEnabled ? 'DarkOrange' : 'blue';

        //the social distancing button is always blue
        if (this == buttonDistancing) {
            this.bgColor = 'blue';
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
            drawRect(this.x - (buttonPanelWidth / 2), this.y - (buttonPanelHeight / 2), buttonPanelWidth, buttonPanelHeight, 'black');
        }


        canvasContext.font = this.fontSize + "px Arial";
        canvasContext.textAlign = 'center';

        if (this == buttonDistancing) {
            canvasContext.fillText(this.emoji, this.x - 25, this.y + (this.radius * 0.17));

            if (this.isEnabled) { //draw social distancing "On" indicator

                colorRect(this.x + 10, this.y - 8, 30, 20, "darkgreen");
                colorCircle(this.x + 10, this.y + 2, 10, "darkgreen");
                colorCircle(this.x + 10 + 30, this.y + 2, 10, "darkgreen");

                canvasContext.font = "14px Arial";
                canvasContext.fillStyle = "white";

                //canvasContext.fillText("En", this.x + 17, this.y + 8);
                colorCircle(this.x + 10 + 30, this.y + 2, 10, "lightgreen");

            } else { //draw social distancing "Off" indicator

                colorRect(this.x + 10, this.y - 8, 30, 20, "lightslategrey");
                colorCircle(this.x + 10, this.y + 2, 10, "lightslategrey");
                colorCircle(this.x + 10 + 30, this.y + 2, 10, "lightslategrey");

                canvasContext.font = "10px Arial";
                canvasContext.fillStyle = "white";

                //canvasContext.fillText("Apagada", this.x + 32, this.y + 8);
                colorCircle(this.x + 10, this.y + 2, 10, "lightsteelblue");
            }

        } else {
            canvasContext.fillText(this.emoji, this.x, this.y + (this.radius * 0.17));
        }

    }

    handleClick(xClick, yClick) {
        if (DistanceBetweenTwoPixelCoords(xClick, yClick, this.x, this.y) < this.radius) {

            if (this.isToggle) {

                if (yClick > canvas.height - (graphPanelHeight + bannerHeight + buttonPanelHeight) &&
                    yClick <  canvas.height - (graphPanelHeight + bannerHeight)) {

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