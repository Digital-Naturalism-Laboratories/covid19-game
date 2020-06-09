var percentTestingNegative = 100;
var percentTestingPositive = 0;
var percentRecovered = 0;

var negativeCount = 0;
var positveCount = 0;
var recoveredCount = 0;

var negativeGraphData = []
var positiveGraphData = []
var recoveredGraphData = []

var graphXPos = 0;
var graphTimeIncrement = 30 //frames
var graphIncrementTimer = graphTimeIncrement;

function updateGraphData() {

    negativeCount = 0;
    positiveCount = 0;
    recoveredCount = 0;

    for (node of nodes) {
        if (node.testsPositive) {
            positiveCount++;
        }
        if (node.recovered) {
            recoveredCount++;
        }
    }

    negativeCount = nodeCount - positiveCount - recoveredCount;

    percentTestingNegative = Math.floor((negativeCount / nodeCount) * 100);
    percentTestingPositive = Math.floor((positiveCount / nodeCount) * 100);
    percentRecovered = Math.floor((recoveredCount / nodeCount) * 100);

    percentTestingNegative += percentRecovered;

    graphIncrementTimer--;
    if (graphIncrementTimer <= 0){
        negativeGraphData.push(percentTestingNegative);
        positiveGraphData.push(percentTestingPositive);
        recoveredGraphData.push(percentRecovered);
        graphIncrementTimer = graphTimeIncrement;
    }

}

function drawGraph() {

    for (var i = 0; i < negativeGraphData.length; i++){
        colorLine(i, canvas.height, i, canvas.height - positiveGraphData[i], "red");
        colorLine(i, canvas.height - positiveGraphData[i], i, canvas.height - positiveGraphData[i] - negativeGraphData[i], "yellow");
        //colorLine(i, canvas.height - positiveGraphData[i] - negativeGraphData[i], i, canvas.height - positiveGraphData[i] - negativeGraphData[i] - recoveredGraphData[i], "yellow");
        
    }

    canvasContext.font = "16px Arial";
    canvasContext.fillStyle = "white";
    //canvasContext.fillText("Recovered " + percentRecovered + "%", canvas.width - 125, canvas.height - 70);
    canvasContext.fillText("\ud83d\ude00 " + percentTestingNegative + "%", canvas.width - 125, canvas.height - 40);
    canvasContext.fillText("🤢 " + percentTestingPositive + "%", canvas.width - 125, canvas.height - 10);
}