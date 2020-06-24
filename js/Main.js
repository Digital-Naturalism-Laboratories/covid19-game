//Variables that can be adjusted to tune the game as desired
var simCount = 100;
var simSpeed = 0.65;
var basePercentChanceToTransmit = 0.15;
var baseTransmissionRadius = 40;
var overCapacityDeathRateMultiplier = 5;
var initialPositiveSimCount = 1;
var capacityThreshold = 0.6;
var maxWashingStations = 3;
//var lengthOfRound = 60;

var canvas;
var canvasContext;
var width = 400;
var height = 640;
var sims = [];
var washingStations = [];
var buttonPanelHeight = 50;
var buttonPanelWidth = width / 3;
var maskImage = document.createElement('img');

var gameStates = {
    START: "start",
    INSTRUCTIONS: 'instructions',
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

    buttonNext = new Button(width / 2, height - 75, '▶️', 50, 100, false, true);
    buttonPlay = new Button(width / 2, height - 75, '▶️', 50, 100, false, true);
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
        case 'instructions':
            break;
        case 'main':
            for (var sim of sims) {
                sim.update();
            }
            updateGraphData();
            buttonMasking.update();
            buttonWashing.update();
            buttonDistancing.update();

            if (washingStations.length > maxWashingStations) {
                washingStations.shift();
            }

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

            canvasContext.font = "36px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.fillText("APLANA LA CURVA:", canvas.width * 0.5, canvas.height * 0.25);
            canvasContext.fillText("UNA CARITA A LA VEZ", canvas.width * 0.5, canvas.height * 0.25 + 40);

            buttonNext.draw();

            break;
        case 'instructions':
            canvasContext.font = "12px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';

            //draw instructions for clicking on sick sims.
            canvasContext.fillText("Haz click sobre la carita enferma para", canvas.width * 0.50, canvas.height * 0.03);
            canvasContext.fillText("ponerle mascarilla y evitar el contagio.", canvas.width * 0.50, canvas.height * 0.06);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("🤢", canvas.width * 0.30, canvas.height * 0.18);
            canvasContext.fillText("🤢", canvas.width * 0.70, canvas.height * 0.18);
            canvasContext.drawImage(maskImage, (canvas.width * 0.73) - (maskImage.width / 2), (canvas.height * 0.12), maskImage.width * 0.8, maskImage.height * 0.8);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", canvas.width * 0.50, canvas.height * 0.14);

            //draw instructions for clicking on healthy sims.
            canvasContext.font = "12px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';
            canvasContext.fillText("Haz click sobre la carita saludable para", canvas.width * 0.50, canvas.height * 0.23);
            canvasContext.fillText("ponerle mascarilla y protegerla del contagio.", canvas.width * 0.50, canvas.height * 0.26);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("🙂", canvas.width * 0.30, canvas.height * 0.38);
            canvasContext.fillText("🙂", canvas.width * 0.70, canvas.height * 0.38);
            canvasContext.drawImage(maskImage, (canvas.width * 0.73) - (maskImage.width / 2), (canvas.height * 0.32), maskImage.width * 0.8, maskImage.height * 0.8);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", canvas.width * 0.50, canvas.height * 0.34);

            //draw instructions for clicking on washing stations.
            canvasContext.font = "14px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';
            canvasContext.fillText("Haz click sobre el jabón para introducir estaciones", canvas.width * 0.50, canvas.height * 0.43);
            canvasContext.fillText("de lavado para que las caritas se laven las manos.", canvas.width * 0.50, canvas.height * 0.46);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("🧼", canvas.width * 0.70, canvas.height * 0.58);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", canvas.width * 0.50, canvas.height * 0.54);

            //draw instructions for clicking on social distancing.
            canvasContext.font = "14px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';
            canvasContext.fillText("Haz click en el símbolo de la regla para introducirla entre las", canvas.width * 0.50, canvas.height * 0.63);
            canvasContext.fillText("caritas y así mantengan una distancia de 2 m entre cada una.", canvas.width * 0.50, canvas.height * 0.66);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("📏", canvas.width * 0.70, canvas.height * 0.78);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", canvas.width * 0.50, canvas.height * 0.74);

            buttonPlay.draw();
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

            colorRect(emojiKeyPanelWidth, canvas.height - graphPanelHeight, canvas.width, canvas.height, 'grey');
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
    for (var i = 0; i < initialPositiveSimCount; i++) {
        sims[i].condition = conditions.POSITIVE;
    }
}