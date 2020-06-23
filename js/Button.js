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
        this.bgColor = this.isEnabled ? 'orange' : 'blue';

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
            drawRect(this.x - (buttonPanelWidth / 2), this.y - (buttonPanelHeight / 2), buttonPanelWidth, buttonPanelHeight, 'black');
        }

        canvasContext.font = this.fontSize + "px Arial";
        canvasContext.textAlign = 'center';
        canvasContext.fillText(this.emoji, this.x, this.y + (this.radius * 0.45));
    }

    handleClick(xClick, yClick) {
        if (DistanceBetweenTwoPixelCoords(xClick, yClick, this.x, this.y) < this.radius) {

            if (this.isToggle) {

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