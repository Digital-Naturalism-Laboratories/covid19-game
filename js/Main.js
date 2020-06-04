var canvas;
var canvasContext;
var nodeCount = 100;
var nodeSpeed = 1;
var nodes = [];
var width = 800;
var height = 600;

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = width;
    canvasContext.canvas.height = height;

    for (i = 0; i < nodeCount; i++){
        nodes[i] = new GameObject(Math.random() * width, Math.random() * height, nodeSpeed);
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
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    for (var node of nodes){
        node.draw();
    }


}