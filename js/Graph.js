var negativeCount = 0;
var positiveCount = 0;
var recoveredCount = 0;
var deadCount = 0;

var percentTestingNegative = 100;
var percentTestingPositive = 0;
var percentRecovered = 0;
var percentDead = 0;

var allPercentTestingNegative = [];
var allPercentTestingPositive = [];
var allPercentRecovered = [];
var allPercentDead = [];

var negativeGraphData = [];
var positiveGraphData = [];
var recoveredGraphData = [];
var deadGraphData = [];

var allNegativeGraphData = [];
var allPositiveGraphData = [];
var allRecoveredGraphData = [];
var allDeadGraphData = [];

var framesPerGraphIncrement = 12;
var graphIncrementTimer = framesPerGraphIncrement;

var capacityThreshold = 0.8;
var isOverCapacity = false;
var positiveGraphColor = 'green';

function updateGraphData() {

    percentTestingNegative = Math.floor(((negativeCount) / simCount) * 100);
    percentTestingPositive = Math.floor((positiveCount / simCount) * 100);
    percentRecovered = Math.floor((recoveredCount / simCount) * 100);
    percentDead = Math.floor((deadCount / simCount) * 100);

    isOverCapacity = percentTestingPositive >= capacityThreshold * 100 ? true : false;
    deathRateMultiplier = isOverCapacity ? overCapacityDeathRateMultiplier : 1;

    if (positiveGraphColor == 'green') {
        positiveGraphColor = isOverCapacity ? 'red' : 'green';
    }

    if (isOverCapacity){
        deathRateMultiplier *= 1.01;
    }

    graphIncrementTimer--;
    if (graphIncrementTimer <= 0) {
        negativeGraphData.push(percentTestingNegative);
        positiveGraphData.push(percentTestingPositive);
        recoveredGraphData.push(percentRecovered);
        deadGraphData.push(percentDead);
        graphIncrementTimer = framesPerGraphIncrement;
    }

    if (positiveGraphData.length >= canvas.width) {

        allNegativeGraphData.push(negativeGraphData);
        allPositiveGraphData.push(positiveGraphData);
        allRecoveredGraphData.push(recoveredGraphData);
        allDeadGraphData.push(deadGraphData);

        allPercentTestingNegative.push(percentTestingNegative);
        allPercentTestingPositive.push(percentTestingPositive);
        allPercentRecovered.push(percentRecovered);
        allPercentDead.push(percentDead);

        gameState = gameStates.END;
    }

    negativeCount = 0;
    positiveCount = 0;
    recoveredCount = 0;
    deadCount = 0;

}

function drawGraph() {

    for (var i = 0; i < negativeGraphData.length; i++) {
        colorLine(i, canvas.height, i, canvas.height - deadGraphData[i], "black");
        colorLine(i, canvas.height - deadGraphData[i], i, canvas.height - deadGraphData[i] - positiveGraphData[i], positiveGraphColor);
        colorLine(i, canvas.height - deadGraphData[i] - positiveGraphData[i], i, canvas.height - deadGraphData[i] - positiveGraphData[i] - negativeGraphData[i], "yellow");

        canvasContext.lineWidth = 1;
        colorLine(0, canvas.height - (graphPanelHeight * capacityThreshold), canvas.width, canvas.height - (graphPanelHeight * capacityThreshold), 'darkred');
    }

    canvasContext.font = "16px Arial";
    canvasContext.fillStyle = "black";
    canvasContext.textAlign = 'left';

    canvasContext.fillText("🙂 " + percentTestingNegative + "%", 5, canvas.height - 65);
    canvasContext.fillText("🤢 " + percentTestingPositive + "%", 5, canvas.height - 45);
    canvasContext.fillText("😁 " + percentRecovered + "%", 5, canvas.height - 25);
    canvasContext.fillText("💀 " + percentDead + "%", 5, canvas.height - 5);

    drawRect(0, canvas.height - graphPanelHeight, canvas.width, canvas.height, 'black', 2.5);
}

function drawAllGraphs() {

    for (var j = allNegativeGraphData.length; j >= 1; j--) {
        for (var i = 0; i < negativeGraphData.length; i++) {
            colorLine(i, graphPanelHeight * j, i, graphPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i], "black");
            colorLine(i, graphPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i], i, graphPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i] - allPositiveGraphData[allNegativeGraphData.length - j][i], positiveGraphColor);
            colorLine(i, graphPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i] - allPositiveGraphData[allNegativeGraphData.length - j][i], i, graphPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i] - allPositiveGraphData[allNegativeGraphData.length - j][i] - allNegativeGraphData[allNegativeGraphData.length - j][i], "yellow");

            canvasContext.font = "16px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'left';
            canvasContext.fillText(allNegativeGraphData.length - (j - 1), 8, 20 + ((j - 1) * graphPanelHeight));

            canvasContext.fillText("🙂 " + allPercentTestingNegative[allNegativeGraphData.length - j] + "%", 20, graphPanelHeight * (j - 1) + 18);
            canvasContext.fillText("🤢 " + allPercentTestingPositive[allNegativeGraphData.length - j] + "%", 20, graphPanelHeight * (j - 1) + 40);
            canvasContext.fillText("😁 " + allPercentRecovered[allNegativeGraphData.length - j] + "%", 20, graphPanelHeight * (j - 1) + 62);
            canvasContext.fillText("💀 " + allPercentDead[allNegativeGraphData.length - j] + "%", 20, graphPanelHeight * (j - 1) + 84);
        }

    }

    colorRect(0, graphPanelHeight * 5, canvas.width, canvas.height - (graphPanelHeight * 5), 'white');

}