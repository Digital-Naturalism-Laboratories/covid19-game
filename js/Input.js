document.addEventListener('touchstart', handleClick, false);
document.addEventListener("mousedown", handleClick);

function handleClick(evt) {

    var xPos = evt.clientX - canvas.getBoundingClientRect().left;
    var yPos = evt.clientY - canvas.getBoundingClientRect().top;

    var distClosestNode = null;
    var closestNode = null;

    for (node of nodes){
        var distThisNode = DistanceBetweenTwoPixelCoords(xPos, yPos, node.x, node.y);
        if (distThisNode < distClosestNode || distClosestNode == null){
            closestNode = node;
            distClosestNode = distThisNode;
        }
    }

    if (distClosestNode <= 10){
        closestNode.masking = true;
    }

    console.log(distClosestNode);

    //addedObject = new GameObject(xPos, yPos, nodeSpeed);
    //nodes.push(addedObject);

  }