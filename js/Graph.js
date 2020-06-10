var negativeCount = 0;
var positiveCount = 0;
var recoveredCount = 0;
var deadCount = 0;

var percentTestingNegative = 100;
var percentTestingPositive = 0;
var percentRecovered = 0;

var negativeGraphData = []
var positiveGraphData = []
var recoveredGraphData = []

var framesPerGraphIncrement = 30
var graphIncrementTimer = framesPerGraphIncrement;

function updateGraphData() {

    negativeCount = nodeCount - positiveCount - recoveredCount;

    percentTestingNegative = Math.floor((negativeCount / nodeCount) * 100);
    percentTestingPositive = Math.floor((positiveCount / nodeCount) * 100);
    percentRecovered = Math.floor((recoveredCount / nodeCount) * 100);

    percentTestingNegative += percentRecovered;

    graphIncrementTimer--;
    if (graphIncrementTimer <= 0) {
        negativeGraphData.push(percentTestingNegative);
        positiveGraphData.push(percentTestingPositive);
        recoveredGraphData.push(percentRecovered);
        graphIncrementTimer = framesPerGraphIncrement;
    }

    negativeCount = 0;
    positiveCount = 0;
    recoveredCount = 0;
    deadCount = 0;

}

function drawGraph() {

    for (var i = 0; i < negativeGraphData.length; i++) {
        colorLine(i, canvas.height, i, canvas.height - positiveGraphData[i], "red");
        colorLine(i, canvas.height - positiveGraphData[i], i, canvas.height - positiveGraphData[i] - negativeGraphData[i], "yellow");
        //colorLine(i, canvas.height - positiveGraphData[i] - negativeGraphData[i], i, canvas.height - positiveGraphData[i] - negativeGraphData[i] - recoveredGraphData[i], "yellow"); //Recovered data on graph disabled. May add back later.
    }

    canvasContext.font = "16px Arial";
    canvasContext.fillStyle = "white";
    //canvasContext.fillText("Recovered " + percentRecovered + "%", canvas.width - 125, canvas.height - 70); //Recovered data on graph disabled. May add back later.
    canvasContext.fillText("\ud83d\ude00 " + percentTestingNegative + "%", canvas.width - 125, canvas.height - 40);
    canvasContext.fillText("🤢 " + percentTestingPositive + "%", canvas.width - 125, canvas.height - 10);
}