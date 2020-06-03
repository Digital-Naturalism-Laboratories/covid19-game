var canvas;
var canvasContext;
var nodeCount = 100
var nodes = [];

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = 800;
    canvasContext.canvas.height = 600;

    for (i = 0; i < nodeCount; i++){
        nodes[i] = new GameObject(Math.random() * canvasContext.canvas.width, Math.random() * canvasContext.canvas.height, 10)
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
  
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    for (var n of nodes){
        n.draw();
    }


}