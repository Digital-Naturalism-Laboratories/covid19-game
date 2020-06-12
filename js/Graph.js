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

function updateGraphData() {

    //negativeCount = nodeCount - positiveCount - recoveredCount;

    percentTestingNegative = Math.floor((negativeCount / nodeCount) * 100);
    percentTestingPositive = Math.floor((positiveCount / nodeCount) * 100);
    percentRecovered = Math.floor((recoveredCount / nodeCount) * 100);
    percentDead = Math.floor((deadCount / nodeCount) * 100);

    percentTestingNegative += percentRecovered;

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
        colorLine(i, canvas.height - deadGraphData[i], i, canvas.height - deadGraphData[i] - positiveGraphData[i], "red");
        colorLine(i, canvas.height - deadGraphData[i] - positiveGraphData[i], i, canvas.height - deadGraphData[i] - positiveGraphData[i] - negativeGraphData[i], "yellow");
        //colorLine(i, canvas.height - positiveGraphData[i] - negativeGraphData[i], i, canvas.height - positiveGraphData[i] - negativeGraphData[i] - recoveredGraphData[i], "yellow"); //Recovered data on graph disabled. May add back later.
    }

    canvasContext.font = "16px Arial";
    canvasContext.fillStyle = "black";
    canvasContext.textAlign = 'left';
    //canvasContext.fillText("Recovered " + percentRecovered + "%", canvas.width - 125, canvas.height - 70); //Recovered data on graph disabled. May add back later.
    canvasContext.fillText("🙂 " + percentTestingNegative + "%", 20, canvas.height - 75);
    canvasContext.fillText("🤢 " + percentTestingPositive + "%", 20, canvas.height - 45);
    canvasContext.fillText("💀 " + percentDead + "%", 20, canvas.height - 15);

    drawRect(0, canvas.height - bottomPanelHeight, canvas.width, canvas.height, 'black', 2.5);
}

function drawAllGraphs() {

    for (var j = allNegativeGraphData.length; j >= 1; j--) {
        for (var i = 0; i < negativeGraphData.length; i++) {
            colorLine(i, bottomPanelHeight * j, i, bottomPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i], "black");
            colorLine(i, bottomPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i], i, bottomPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i] - allPositiveGraphData[allNegativeGraphData.length - j][i], "red");
            colorLine(i, bottomPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i] - allPositiveGraphData[allNegativeGraphData.length - j][i], i, bottomPanelHeight * j - allDeadGraphData[allNegativeGraphData.length - j][i] - allPositiveGraphData[allNegativeGraphData.length - j][i] - allNegativeGraphData[allNegativeGraphData.length - j][i], "yellow");
            //colorLine(i, canvas.height - positiveGraphData[i] - negativeGraphData[i], i, canvas.height - positiveGraphData[i] - negativeGraphData[i] - recoveredGraphData[i], "yellow"); //Recovered data on graph disabled. May add back later.
            canvasContext.font = "16px Arial";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = 'left';
            canvasContext.fillText(allNegativeGraphData.length - (j - 1), 10, 20 + ((j - 1) * bottomPanelHeight));

            canvasContext.fillText("🙂 " + allPercentTestingNegative[allNegativeGraphData.length - j] + "%", 20, bottomPanelHeight * (j - 1) + 25);
            canvasContext.fillText("🤢 " + allPercentTestingPositive[allNegativeGraphData.length - j] + "%", 20, bottomPanelHeight * (j - 1) + 50);
            canvasContext.fillText("💀 " + allPercentDead[allNegativeGraphData.length - j] + "%", 20, bottomPanelHeight * (j - 1) + 75);
        }

        //drawRect(0, bottomPanelHeight * j, canvas.width, bottomPanelHeight * (j - 1), 'black'), 2;

    }

    colorRect(0, bottomPanelHeight * 5, canvas.width, canvas.height - (bottomPanelHeight * 5), 'white');

}