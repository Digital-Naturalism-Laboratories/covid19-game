document.addEventListener('touchstart', handleClick);
document.addEventListener("mousedown", handleClick);

function handleClick(evt) {

    var xPos = evt.clientX - canvas.getBoundingClientRect().left;
    var yPos = evt.clientY - canvas.getBoundingClientRect().top;

    var closestNode = null;
    var distClosestNode = null;
    
    for (node of nodes){
        var distThisNode = DistanceBetweenTwoPixelCoords(xPos, yPos, node.x, node.y);
        if (distThisNode < distClosestNode || distClosestNode == null){
            closestNode = node;
            distClosestNode = distThisNode;
        }
    }

    if (distClosestNode <= baseTransmissionRadius){
        closestNode.isMasking = true;
    }
    
    switch (gameState) {
        case 'start':
            buttonPlay.handleClick(xPos, yPos);
            break;
        case 'main':
            break;
        case 'end':
            buttonReplay.handleClick(xPos, yPos);
            break;
    }

}