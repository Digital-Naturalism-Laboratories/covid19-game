function DistanceBetweenTwoPixelCoords(x1, y1, x2, y2) {
    distance = Math.floor(Math.hypot(Math.floor(x1) - Math.floor(x2), Math.floor(y1) - Math.floor(y2)))
    return distance;
}

function DistanceBetweenTwoObjects(o1, o2){
    distance = Math.floor(Math.hypot(Math.floor(o1.x) - Math.floor(o2.x), Math.floor(o1.y) - Math.floor(o2.y)))
    return distance;
}

function DistanceBetweenTwoObjectsNextFrame(o1, o2){
    distance = Math.floor(Math.hypot(Math.floor(o1.xNextFrame) - Math.floor(o2.xNextFrame), Math.floor(o1.yNextFrame) - Math.floor(o2.yNextFrame)))
    return distance;
}