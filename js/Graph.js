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

    percentTestingNegative = (negativeCount / nodeCount) * 100;
    percentTestingPositive = (positiveCount / nodeCount) * 100;
    percentRecovered = (recoveredCount / nodeCount) * 100;

}

function drawGraph() {
    canvasContext.font = "12px Arial";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Testing Negative " + percentTestingNegative, canvas.width - 125, canvas.height - 10);
    canvasContext.fillText("Testing Positive " + percentTestingPositive, canvas.width - 125, canvas.height - 40);
    canvasContext.fillText("Recovered " + percentRecovered, canvas.width - 125, canvas.height - 70);
}