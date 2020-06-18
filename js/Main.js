//Variables that can be adjusted to tune the game as desired
var simCount = 100;
var simSpeed = 0.65;
var basePercentChanceToTransmit = 0.15;
var baseTransmissionRadius = 40;
var overCapacityDeathRateMultiplier = 5;
var initialPositiveSimCount = 1;
//var lengthOfRound = 60;

var canvas;
var canvasContext;
var width = 400;
var height = 640;
var sims = [];
var washingStations = [];
var graphPanelHeight = 100;
var buttonPanelHeight = 50;
var buttonPanelWidth = width / 3;
var maskImage = document.createElement('img');

var gameStates = {
    START: "start",
    MAIN: "main",
    END: "end",
};

var interactionModes = {
    MASKING: "masking",
    WASHING: "washing",
};

var gameState = gameStates.START;
var interactionMode = interactionModes.MASKING;

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = width;
    canvasContext.canvas.height = height;

    maskImage.src = 'images/mask.png';

    resetGame();

    buttonPlay = new Button(width / 2, height / 2, '▶️', 50, 100, false, true);
    buttonReplay = new Button(width / 2, height - 75, '🔄', 50, 100, false, true);

    buttonMasking = new Button(width * (1 / 6), canvas.height - graphPanelHeight - (buttonPanelHeight / 2), '😷', (buttonPanelHeight / 2), 30, true, true);
    buttonWashing = new Button(width * (3 / 6), canvas.height - graphPanelHeight - (buttonPanelHeight / 2), '🧼', (buttonPanelHeight / 2), 30, true, false);
    buttonDistancing = new Button(width * (5 / 6), canvas.height - graphPanelHeight - (buttonPanelHeight / 2), '📏', (buttonPanelHeight / 2), 30, true, false);

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
            for (var sim of sims) {
                sim.update();
            }
            updateGraphData();
            buttonMasking.update();
            buttonWashing.update();
            buttonDistancing.update();
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
            canvasContext.fillText("🤢", canvas.width * 0.70, canvas.height * 0.80);
            canvasContext.drawImage(maskImage, (canvas.width * 0.73) - (maskImage.width / 2), (canvas.height * 0.74), maskImage.width * 0.8, maskImage.height * 0.8);

            canvasContext.font = "60px Arial";
            canvasContext.fillText("👉", canvas.width * 0.22, canvas.height * 0.72);

            canvasContext.font = "30px Arial";
            canvasContext.fillText("➡️", canvas.width * 0.50, canvas.height * 0.765);

            break;

        case 'main':

            for (var sim of sims) {
                sim.drawTransmissionRadius();
            }
            for (var washingStation of washingStations) {
                washingStation.draw();
            }
            for (var sim of sims) {
                sim.draw();
            }

            colorRect(0, canvas.height - graphPanelHeight, canvas.width, canvas.height, 'grey');
            drawGraph();

            buttonMasking.draw();
            buttonWashing.draw();
            buttonDistancing.draw();

            break;

        case 'end':
            drawAllGraphs();
            buttonReplay.draw();
            break;
    }

    drawRect(0, 0, canvas.width, canvas.height, 'black');

}

function resetGame() {

    sims = [];
    washingStations = [];
    negativeGraphData = [];
    positiveGraphData = [];
    recoveredGraphData = [];
    deadGraphData = [];
    percentTestingPositive = 0;
    positiveGraphColor = 'green';

    for (i = 0; i < simCount; i++) {
        sims[i] = new Sim(Math.random() * width, (Math.random() * height) - graphPanelHeight - buttonPanelHeight - 10, simSpeed);

        //Prevent sims from spawning on top of each other.
        for (var sim of sims) {
            while ((DistanceBetweenTwoObjects(sims[i], sim) < (sims[i].radius + sim.radius) && DistanceBetweenTwoObjects(sims[i], sim) != 0) ||
                sim.x < sim.radius ||
                sim.x > (canvas.width - sim.radius) ||
                sim.y < sim.radius ||
                sim.y > (canvas.height - this.graphPanelHeight - sim.radius)) {
                sims[i].x = Math.random() * width;
                sims[i].y = (Math.random() * height) - graphPanelHeight - buttonPanelHeight - 10;
            }
        }

    }

    //Sets a number of sims to positive at the start of the game. 
    for (var i = 0; i < initialPositiveSimCount; i++){
        sims[i].condition = conditions.POSITIVE;
    }
}