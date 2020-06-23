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

var framesPerGraphIncrement = 15;
var graphIncrementTimer = framesPerGraphIncrement;

var isOverCapacity = false;
var positiveGraphColor = 'green';
var graphPanelHeight = 100;
var emojiKeyPanelWidth = 70;
var emojiKeyPanelHeight = graphPanelHeight / 4;

function updateGraphData() {

    //calculate condition percentages
    percentTestingNegative = Math.floor(((negativeCount) / simCount) * 100);
    percentTestingPositive = Math.floor((positiveCount / simCount) * 100);
    percentRecovered = Math.floor((recoveredCount / simCount) * 100);
    percentDead = Math.floor((deadCount / simCount) * 100);

    isOverCapacity = percentTestingPositive + percentDead >= capacityThreshold * 100 ? true : false;
    deathRateMultiplier = isOverCapacity ? overCapacityDeathRateMultiplier : 1;

    if (positiveGraphColor == 'green') {
        positiveGraphColor = isOverCapacity ? 'red' : 'green';
    }

    graphIncrementTimer--;

    //save each slice of the graph each time the increment timer reaches 0
    if (graphIncrementTimer <= 0) {
        negativeGraphData.push(percentTestingNegative);
        positiveGraphData.push(percentTestingPositive);
        recoveredGraphData.push(percentRecovered);
        deadGraphData.push(percentDead);
        graphIncrementTimer = framesPerGraphIncrement;
    }

    //save all graph data and go to the results screen when the graph reaches the edge of the window
    if (positiveGraphData.length >= canvas.width - emojiKeyPanelWidth) {

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

    //reset condition counts after each frame
    negativeCount = 0;
    positiveCount = 0;
    recoveredCount = 0;
    deadCount = 0;

}

function drawGraph() {

    for (var i = 0; i < negativeGraphData.length; i++) {

        var deadLineStart = canvas.height;
        var deadLineEnd = deadLineStart - deadGraphData[i];
        var posLineStart = deadLineEnd;
        var posLineEnd = posLineStart - positiveGraphData[i];
        var negLineStart = posLineEnd;
        var negLineEnd = negLineStart - negativeGraphData[i];
        var recLineStart = negLineEnd;
        var recLineEnd = recLineStart - recoveredGraphData[i];

        //draw graph
        colorLine(i + emojiKeyPanelWidth, deadLineStart, i + emojiKeyPanelWidth, deadLineEnd, "black");
        colorLine(i + emojiKeyPanelWidth, posLineStart, i + emojiKeyPanelWidth, posLineEnd, positiveGraphColor);
        colorLine(i + emojiKeyPanelWidth, negLineStart, i + emojiKeyPanelWidth, negLineEnd, "yellow");
        colorLine(i + emojiKeyPanelWidth, recLineStart, i + emojiKeyPanelWidth, recLineEnd, "yellow");

    }

    canvasContext.textAlign = 'left';
    canvasContext.font = "12px Arial";
    canvasContext.fillStyle = "black";

    canvasContext.fillText("Capacidad Hospitalaria", emojiKeyPanelWidth + 3, canvas.height - (graphPanelHeight * capacityThreshold) - 2);

    if (isOverCapacity) {
        canvasContext.fillText("⚠️ PELIGRO ⚠️", emojiKeyPanelWidth + 3, canvas.height - (graphPanelHeight * capacityThreshold) - 16);
        canvasContext.fillText("Excedida!", emojiKeyPanelWidth + 3, canvas.height - (graphPanelHeight * capacityThreshold) + 12);
    }

    //draw hospital capacity threshold line
    canvasContext.lineWidth = 1;
    colorLine(emojiKeyPanelWidth, canvas.height - (graphPanelHeight * capacityThreshold), canvas.width, canvas.height - (graphPanelHeight * capacityThreshold), 'darkred');



    //draw emoji color key backgrounds
    colorRect(0, canvas.height - (emojiKeyPanelHeight * 4), emojiKeyPanelWidth, emojiKeyPanelHeight, 'yellow');
    colorRect(0, canvas.height - (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, emojiKeyPanelHeight, 'yellow');
    colorRect(0, canvas.height - (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, emojiKeyPanelHeight, positiveGraphColor);
    colorRect(0, canvas.height - (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black');

    drawRect(0, canvas.height - (emojiKeyPanelHeight * 4), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);
    drawRect(0, canvas.height - (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);
    drawRect(0, canvas.height - (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);
    drawRect(0, canvas.height - (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);

    canvasContext.font = "16px Arial";
    canvasContext.textAlign = 'left';

    canvasContext.fillStyle = "black";
    canvasContext.fillText("😁 " + percentRecovered + "%", 5, canvas.height - (emojiKeyPanelHeight * 3.3));
    canvasContext.fillText("🙂 " + percentTestingNegative + "%", 5, canvas.height - (emojiKeyPanelHeight * 2.3));
    canvasContext.fillStyle = "white";
    canvasContext.fillText("🤢 " + percentTestingPositive + "%", 5, canvas.height - (emojiKeyPanelHeight * 1.3));
    canvasContext.fillText("💀 " + percentDead + "%", 5, canvas.height - (emojiKeyPanelHeight * 0.3));

    drawRect(0, canvas.height - graphPanelHeight, canvas.width, canvas.height, 'black', 2.5);
}

function drawAllGraphs() {

    for (var j = allNegativeGraphData.length; j >= 1; j--) {
        for (var i = 0; i < negativeGraphData.length; i++) {

            var length = allNegativeGraphData.length;

            var deadLineStart = graphPanelHeight * j;
            var deadLineEnd = deadLineStart - allDeadGraphData[length - j][i];
            var posLineStart = deadLineEnd;
            var posLineEnd = posLineStart - allPositiveGraphData[length - j][i];
            var negLineStart = posLineEnd;
            var negLineEnd = negLineStart - allNegativeGraphData[length - j][i];
            var recLineStart = negLineEnd;
            var recLineEnd = recLineStart - allRecoveredGraphData[length - j][i];

            positiveGraphColor = allPercentTestingPositive[length - j] + allPercentDead[length - j] >= capacityThreshold * 100 ? 'red' : 'green';

            //draw each graph
            colorLine(i + emojiKeyPanelWidth, deadLineStart, i + emojiKeyPanelWidth, deadLineEnd, "black");
            colorLine(i + emojiKeyPanelWidth, posLineStart, i + emojiKeyPanelWidth, posLineEnd, positiveGraphColor);
            colorLine(i + emojiKeyPanelWidth, negLineStart, i + emojiKeyPanelWidth, negLineEnd, "yellow");
            colorLine(i + emojiKeyPanelWidth, recLineStart, i + emojiKeyPanelWidth, recLineEnd, "yellow");

            colorRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 0), emojiKeyPanelWidth, emojiKeyPanelHeight, 'yellow');
            colorRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, emojiKeyPanelHeight, 'yellow');
            colorRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, emojiKeyPanelHeight, positiveGraphColor);
            colorRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black');

            drawRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 0), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);
            drawRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);
            drawRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);
            drawRect(0, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, emojiKeyPanelHeight, 'black', 1);

            canvasContext.font = "16px Arial";
            canvasContext.textAlign = 'left';

            //write attempt number on each graph
            canvasContext.fillStyle = "black";
            canvasContext.fillText(allNegativeGraphData.length - (j - 1), emojiKeyPanelWidth + 8, 20 + ((j - 1) * graphPanelHeight));

            //write percentage stats to each graph
            canvasContext.fillText("🙂 " + allPercentTestingNegative[length - j] + "%", 5, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 0.66));
            canvasContext.fillText("🤢 " + allPercentTestingPositive[length - j] + "%", 5, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 1.66));
            canvasContext.fillStyle = "white";
            canvasContext.fillText("😁 " + allPercentRecovered[length - j] + "%", 5, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 2.66));
            canvasContext.fillText("💀 " + allPercentDead[length - j] + "%", 5, graphPanelHeight * (j - 1) + (emojiKeyPanelHeight * 3.66));

            //draw line to seperate graphs
            canvasContext.lineWidth = 1;
            colorLine(0, j * graphPanelHeight, canvas.width, j * graphPanelHeight, 'black');

        }

    }

    colorRect(0, graphPanelHeight * 5, canvas.width, canvas.height - (graphPanelHeight * 5), 'white');

}