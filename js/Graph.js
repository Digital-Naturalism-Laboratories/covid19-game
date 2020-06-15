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
var positiveGraphColor = 'green';

function updateGraphData() {

    //negativeCount = nodeCount - positiveCount - recoveredCount;

    percentTestingNegative = Math.floor(((negativeCount + recoveredCount) / nodeCount) * 100);
    percentTestingPositive = Math.floor((positiveCount / nodeCount) * 100);
    percentRecovered = Math.floor((recoveredCount / nodeCount) * 100);
    percentDead = Math.floor((deadCount / nodeCount) * 100);

    if (positiveGraphColor == 'green') {
        positiveGraphColor = percentTestingPositive >= capacityThreshold * 100 ? 'red' : 'green';
    }

    deathRateMultiplier = percentTestingPositive >= capacityThreshold * 100 ? 5 : 1;

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

    canvasContext.fillText("🙂 " + percentTestingNegative + "%", 10, canvas.height - 60);
    canvasContext.fillText("🤢 " + percentTestingPositive + "%", 10, canvas.height - 40);
    canvasContext.fillText("💀 " + percentDead + "%", 10, canvas.height - 20);

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
            canvasContext.fillText(allNegativeGraphData.length - (j - 1), 10, 20 + ((j - 1) * graphPanelHeight));

            canvasContext.fillText("🙂 " + allPercentTestingNegative[allNegativeGraphData.length - j] + "%", 20, graphPanelHeight * (j - 1) + 25);
            canvasContext.fillText("🤢 " + allPercentTestingPositive[allNegativeGraphData.length - j] + "%", 20, graphPanelHeight * (j - 1) + 50);
            canvasContext.fillText("💀 " + allPercentDead[allNegativeGraphData.length - j] + "%", 20, graphPanelHeight * (j - 1) + 75);
        }

        //drawRect(0, graphPanelHeight * j, canvas.width, graphPanelHeight * (j - 1), 'black'), 2;

    }

    colorRect(0, graphPanelHeight * 5, canvas.width, canvas.height - (graphPanelHeight * 5), 'white');

}