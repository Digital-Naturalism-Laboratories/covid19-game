var canvas;
var canvasContext;
var nodeCount = 100;
var nodeSpeed = 0.65;
var nodes = [];
var width = 400;
var height = 640;
var bottomPanelHeight = 100;
var basePercentChanceToTransmit = 0.15;
var baseTransmissionRadius = 40;

var gameStates = {
    START: "start",
    MAIN: "main",
    END: "end",
};

var gameState = gameStates.START;

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = width;
    canvasContext.canvas.height = height;

    resetGame();

    buttonPlay = new Button(width / 2, height / 2, '▶️', 50);
    buttonReplay = new Button(width / 2, height - 75, '🔄', 50);

    initRenderLoop();
}

function initRenderLoop() {
    var framesPerSecond = 60;
    setInterval(function () {

        moveEverything();
        drawEverything();

    }, 1000 / framesPerSecond);
}

function moveEverything() {

    switch (gameState) {
        case 'start':
            break;
        case 'main':
            for (var node of nodes) {
                node.update();
            }
            updateGraphData();
            break;
        case 'end':
            break;
    }

}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'white');

    switch (gameState) {
        case 'start':

            canvasContext.textAlign = 'center';

            canvasContext.font = "40px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.fillText("Aplanar la Curva", canvas.width * 0.5, canvas.height * 0.25);

            buttonPlay.draw();

            canvasContext.font = "100px Arial";
            canvasContext.fillText("🤢", canvas.width * 0.30, canvas.height * 0.80);
            canvasContext.fillText("😷", canvas.width * 0.70, canvas.height * 0.80);

            canvasContext.font = "60px Arial";
            canvasContext.fillText("👉", canvas.width * 0.22, canvas.height * 0.72);

            canvasContext.font = "30px Arial";
            canvasContext.fillText("➡️", canvas.width * 0.50, canvas.height * 0.765);

            break;

        case 'main':

            for (var node of nodes) {
                node.drawTransmissionRadius();
            }
            for (var node of nodes) {
                node.draw();
            }

            colorRect(0, canvas.height - bottomPanelHeight, canvas.width, canvas.height, 'grey');
            drawGraph();
            break;

        case 'end':
            console.log("end")
            drawAllGraphs();
            buttonReplay.draw();
            break;
    }

    drawRect(0, 0, canvas.width, canvas.height, 'black');

}

function resetGame() {

    nodes = [];
    negativeGraphData = [];
    positiveGraphData = [];
    recoveredGraphData = [];
    deadGraphData = [];

    for (i = 0; i < nodeCount; i++) {
        nodes[i] = new GameObject(Math.random() * width, (Math.random() * height) - bottomPanelHeight, nodeSpeed);

        //Prevent nodes from spawning on top of each other.
        for (var node of nodes) {
            while ((DistanceBetweenTwoObjects(nodes[i], node) < (nodes[i].radius + node.radius) && DistanceBetweenTwoObjects(nodes[i], node) != 0) ||
                node.x < node.radius ||
                node.x > (canvas.width - node.radius) ||
                node.y < node.radius ||
                node.y > (canvas.height - this.bottomPanelHeight - node.radius)) {
                nodes[i].x = Math.random() * width;
                nodes[i].y = Math.random() * height;
            }
        }

    }

    //Ensure that at least 2 nodes are positive.
    if (positiveCount < 2) {
        nodes[0].condition = conditions.POSITIVE;
        nodes[1].condition = conditions.POSITIVE;
    }
}