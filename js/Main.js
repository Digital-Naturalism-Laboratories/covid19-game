//Variables that can be adjusted to tune the game as desired
var simCount = 100;
var simSpeed = 0.65;
var basePercentChanceToTransmit = 0.15;
var baseTransmissionRadius = 40;
var overCapacityDeathRateMultiplier = 5;
var initialPositiveSimCount = 1;
var capacityThreshold = 0.6;
var maxWashingStations = 3;

var canvas;
var canvasContext;
var width = 400;
var height = 640;
var sims = [];
var washingStations = [];
var buttonPanelHeight = 50;
var buttonPanelWidth = width / 3;
var maskImage = document.createElement('img');
var curveGraphImage = document.createElement('img');
var scaleFactor;
var aspectRatio;

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
    canvas.width = width;
    canvas.height = height;

    //load mask image
    maskImage.src = 'images/mask.png';
    curveGraphImage.src = 'images/curve-graph.png'

    initDisplayDimensions();

    resetGame();

    buttonNext = new Button(width / 2, height * 0.95, '▶️', 50, 100, false, true);
    buttonPlay = new Button(width / 2, height * 0.95, '▶️', 50, 100, false, true);
    buttonReplay = new Button(width / 2, height * 0.95, '🔄', 50, 100, false, true);

    buttonMasking = new Button(width * (1 / 6), height - graphPanelHeight - bannerHeight - (buttonPanelHeight / 2), '😷', (buttonPanelWidth / 2), 30, true, true);
    buttonWashing = new Button(width * (3 / 6), height - graphPanelHeight - bannerHeight - (buttonPanelHeight / 2), '🧼', (buttonPanelWidth / 2), 30, true, false);
    buttonDistancing = new Button(width * (5 / 6), height - graphPanelHeight - bannerHeight - (buttonPanelHeight / 2), '📏', (buttonPanelWidth / 2), 30, true, false);

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
            canvasContext.drawImage(curveGraphImage, 0, height * 0.25, curveGraphImage.width, curveGraphImage.height);
            canvasContext.fillText("APLANA LA CURVA:", width * 0.5, height * 0.27);
            canvasContext.fillText("UNA CARITA A LA VEZ", width * 0.5, height * 0.46);

            buttonNext.draw();

            break;
        case 'instructions':
            canvasContext.font = "12px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';

            //draw instructions for clicking on sick sims.
            canvasContext.fillText("Haz click sobre la carita enferma para", width * 0.50, height * 0.03);
            canvasContext.fillText("ponerle mascarilla y evitar el contagio.", width * 0.50, height * 0.06);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("🤢", width * 0.30, height * 0.18);
            canvasContext.fillText("🤢", width * 0.70, height * 0.18);
            canvasContext.drawImage(maskImage, (width * 0.73) - (maskImage.width / 2), (height * 0.12), maskImage.width * 0.8, maskImage.height * 0.8);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", width * 0.50, height * 0.14);

            //draw instructions for clicking on healthy sims.
            canvasContext.font = "12px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';
            canvasContext.fillText("Haz click sobre la carita saludable para", width * 0.50, height * 0.23);
            canvasContext.fillText("ponerle mascarilla y protegerla del contagio.", width * 0.50, height * 0.26);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("🙂", width * 0.30, height * 0.38);
            canvasContext.fillText("🙂", width * 0.70, height * 0.38);
            canvasContext.drawImage(maskImage, (width * 0.73) - (maskImage.width / 2), (height * 0.32), maskImage.width * 0.8, maskImage.height * 0.8);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", width * 0.50, height * 0.34);

            //draw instructions for clicking on washing stations.
            canvasContext.font = "14px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';
            canvasContext.fillText("Haz click sobre el jabón para introducir estaciones", width * 0.50, height * 0.43);
            canvasContext.fillText("de lavado para que las caritas se laven las manos.", width * 0.50, height * 0.46);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("🧼", width * 0.70, height * 0.58);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", width * 0.50, height * 0.54);

            //draw instructions for clicking on social distancing.
            canvasContext.font = "14px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'center';
            canvasContext.fillText("Haz click en el símbolo de la regla para introducirla entre las", width * 0.50, height * 0.63);
            canvasContext.fillText("caritas y así mantengan una distancia de 2 m entre cada una.", width * 0.50, height * 0.66);
            canvasContext.textAlign = 'center';
            canvasContext.font = "80px Arial";
            canvasContext.fillText("📏", width * 0.70, height * 0.78);
            canvasContext.font = "40px Arial";
            canvasContext.fillText("👉", width * 0.50, height * 0.74);

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

            colorRect(emojiKeyPanelWidth, height - graphPanelHeight, graphPanelWidth, graphPanelHeight, 'Gainsboro');
            drawGraph();
            drawBanner();

            buttonMasking.draw();
            buttonWashing.draw();
            buttonDistancing.draw();

            break;

        case 'end':
            drawAllGraphs();
            buttonReplay.draw();
            buttonDistancing.toggleOff();
            break;
    }

    drawRect(0, 0, width, height, 'black');

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
        sims[i] = new Sim(Math.random() * width, (Math.random() * height) - graphPanelHeight - buttonPanelHeight - bannerHeight - 10, simSpeed);

        //Prevent sims from spawning on top of each other.
        for (var sim of sims) {
            while ((DistanceBetweenTwoObjects(sims[i], sim) < (sims[i].radius + sim.radius) && DistanceBetweenTwoObjects(sims[i], sim) != 0) ||
                sim.x < sim.radius ||
                sim.x > (width - sim.radius) ||
                sim.y < sim.radius ||
                sim.y > (height - this.graphPanelHeight - bannerHeight - sim.radius)) {
                sims[i].x = Math.random() * width;
                sims[i].y = (Math.random() * height) - graphPanelHeight - bannerHeight - buttonPanelHeight - 10;
            }
        }

    }

    //Sets a number of sims to positive at the start of the game. 
    for (var i = 0; i < initialPositiveSimCount; i++) {
        sims[i].condition = conditions.POSITIVE;
    }
}

function initDisplayDimensions() {

    if (window.innerHeight < window.innerWidth) { //if landscape

        scaleFactor = height / window.innerHeight;

        document.documentElement.style.height = window.innerHeight + "px";
        document.body.style.height = window.innerHeight + "px";
        document.getElementById("gameCanvas").style.minHeight = window.innerHeight + "px";
        document.getElementById("gameCanvas").style.maxHeight = window.innerHeight + "px";

    } else { //if portrait

        aspectRatio = window.innerHeight / window.innerWidth;

        if (aspectRatio < (canvas.height / canvas.width)) {
            scaleFactor = height / window.innerHeight;
            document.documentElement.style.height = window.innerHeight + "px";
            document.body.style.height = window.innerHeight + "px";
            document.getElementById("gameCanvas").style.minHeight = window.innerHeight + "px";
            document.getElementById("gameCanvas").style.maxHeight = window.innerHeight + "px";
        } else {
            scaleFactor = width / window.innerWidth;
            document.documentElement.style.width = window.innerWidth + "px";
            document.body.style.width = window.innerwidth + "px";
            document.getElementById("gameCanvas").style.minWidth = window.innerWidth + "px";
            document.getElementById("gameCanvas").style.maxWidth = window.innerWidth + "px";
        }

    }
}