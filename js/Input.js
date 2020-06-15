document.addEventListener('touchstart', handleClick);
document.addEventListener("mousedown", handleClick);

function handleClick(evt) {

    var xPos = evt.clientX - canvas.getBoundingClientRect().left;
    var yPos = evt.clientY - canvas.getBoundingClientRect().top;

    switch (interactionMode) {
        case 'masking':
            var closestNode = null;
            var distClosestNode = null;

            for (node of nodes) {
                var distThisNode = DistanceBetweenTwoPixelCoords(xPos, yPos, node.x, node.y);
                if (distThisNode < distClosestNode || distClosestNode == null) {
                    closestNode = node;
                    distClosestNode = distThisNode;
                }
            }

            if (distClosestNode <= baseTransmissionRadius) {
                closestNode.isMasking = true;
            }
            
            break;
        case 'washing':
            break;
        case 'distancing':
            break;
    }

    switch (gameState) {
        case 'start':
            buttonPlay.handleClick(xPos, yPos);
            break;
        case 'main':
            buttonMasking.handleClick(xPos, yPos);
            buttonWashing.handleClick(xPos, yPos);
            buttonDistancing.handleClick(xPos, yPos);
            break;
        case 'end':
            buttonReplay.handleClick(xPos, yPos);
            break;
    }

}