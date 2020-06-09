var canvas;
var canvasContext;
var nodeCount = 100;
var nodeSpeed = 0.75;
var nodes = [];
var width = 400;
var height = 640;
var bottomPanelHeight = 100;
var basePercentChanceToTransmit = 0.1;
var baseTransmissionRadius = 40;

//var smile = "\ud83d\ude00";

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = width;
    canvasContext.canvas.height = height;

    for (i = 0; i < nodeCount; i++){
        nodes[i] = new GameObject(Math.random() * width, (Math.random() * height) - bottomPanelHeight, nodeSpeed);

        //Prevent nodes from spawning on the edge of the canvas.

        //Prevent nodes from spawning on top of each other.
        for (var node of nodes) {
            while ((DistanceBetweenTwoObjects(nodes[i], node) < (nodes[i].radius + node.radius) && DistanceBetweenTwoObjects(nodes[i], node) != 0) || 
            node.x < node.radius || 
            node.x > (canvas.width - node.radius) ||
            node.y < node.radius || 
            node.y > (canvas.height - this.bottomPanelHeight - node.radius))
            {
                nodes[i].x = Math.random() * width;
                nodes[i].y = Math.random() * height;
            }
        }

    }

    //loadImages();
    initRenderLoop();

}

function initRenderLoop() {
    var framesPerSecond = 60;
    setInterval(function () {
        
        moveEverything();
        drawEverything();
        

    }, 1000 / framesPerSecond);
    //initInput();
}

function moveEverything() {
    for (var node of nodes){
        node.update();
    }
    updateGraphData();
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    for (var node of nodes){
        node.drawTransmissionRadius();
    }
    for (var node of nodes){
        node.draw();
    }
    colorRect(0, canvas.height - bottomPanelHeight, canvas.width, canvas.height, 'grey');
    drawGraph();
}