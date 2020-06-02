var canvas;
var canvasContext;

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = 800;
    canvasContext.canvas.height = 600;

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
    
}