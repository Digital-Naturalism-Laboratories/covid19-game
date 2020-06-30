document.addEventListener('touchstart', handleClick);
document.addEventListener("mousedown", handleClick);

function handleClick(evt) {

    var xPos = (evt.clientX - canvas.getBoundingClientRect().left) * scaleFactor;
    var yPos = (evt.clientY - canvas.getBoundingClientRect().top) * scaleFactor;

    switch (gameState) {
        case 'start':
            buttonNext.handleClick(xPos, yPos);
            break;

        case 'instructions':
            buttonPlay.handleClick(xPos, yPos);
            break;

        case 'main':
            buttonMasking.handleClick(xPos, yPos);
            buttonWashing.handleClick(xPos, yPos);
            buttonDistancing.handleClick(xPos, yPos);

            if (yPos < height - (graphPanelHeight + buttonPanelHeight + bannerHeight)) {
                switch (interactionMode) {
                    case 'masking':
                        var closestsim = null;
                        var distClosestsim = null;

                        for (sim of sims) {
                            var distThissim = DistanceBetweenTwoPixelCoords(xPos, yPos, sim.x, sim.y);
                            if (distThissim < distClosestsim || distClosestsim == null) {
                                closestsim = sim;
                                distClosestsim = distThissim;
                            }
                        }

                        if (distClosestsim <= baseTransmissionRadius) {
                            closestsim.isMasking = true;
                        }

                        break;
                    case 'washing':
                        washingStations.push(new WashingStation(xPos, yPos));
                        break;
                }
            }

            break;
        case 'end':
            buttonReplay.handleClick(xPos, yPos);
            break;
    }

}