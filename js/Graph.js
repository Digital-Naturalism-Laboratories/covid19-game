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

var framesPerGraphIncrement = 8; //15
var graphIncrementTimer = framesPerGraphIncrement;

var isOverCapacity = false;
var positiveGraphColor = 'green';
var positiveGraphColors = [];
var graphPanelHeight = 100;
var emojiKeyPanelWidth = 115;
var emojiKeyPanelHeight = graphPanelHeight / 4;
var graphPanelWidth = width - emojiKeyPanelWidth;
var bannerHeight = 25;

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
    if (positiveGraphData.length >= graphPanelWidth) {

        allNegativeGraphData.push(negativeGraphData);
        allPositiveGraphData.push(positiveGraphData);
        allRecoveredGraphData.push(recoveredGraphData);
        allDeadGraphData.push(deadGraphData);

        allPercentTestingNegative.push(percentTestingNegative);
        allPercentTestingPositive.push(percentTestingPositive);
        allPercentRecovered.push(percentRecovered);
        allPercentDead.push(percentDead);

        positiveGraphColors.push(positiveGraphColor);

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

        var thresholdLineY = height - (graphPanelHeight * capacityThreshold);
        var posLineEnd = height - deadGraphData[i] - positiveGraphData[i];

        //Draw line graph
        if (canvas.height - (graphPanelHeight * capacityThreshold) > posLineEnd) {
            colorLine(i + emojiKeyPanelWidth, canvas.height - graphPanelHeight * capacityThreshold, i + emojiKeyPanelWidth, posLineEnd, '#ff451a');
        } else {
            colorCircle(i + emojiKeyPanelWidth, posLineEnd + 2, 2, '#ffe31a');
        }

    }

    //Draw hospital capacity threshold line
    canvasContext.lineWidth = 1;
    colorLine(emojiKeyPanelWidth, thresholdLineY, width, thresholdLineY, '#009ada');

    //Write Capacidad Hospitalaria on capacity threshold line
    canvasContext.textAlign = 'left';
    canvasContext.font = "10px Bogle";
    canvasContext.fillStyle = "#1055b7";
    canvasContext.fillText("Capacidad", emojiKeyPanelWidth + 3, thresholdLineY - 2);
    canvasContext.fillText("Hospitalaria", emojiKeyPanelWidth + 3, thresholdLineY + 8);

    //Draw emoji color key panel backgrounds
    colorRect(0, height - (emojiKeyPanelHeight * 4), emojiKeyPanelWidth, emojiKeyPanelHeight, '#ed8300');
    colorRect(0, height - (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, emojiKeyPanelHeight, '#ffe31a');
    colorRect(0, height - (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, emojiKeyPanelHeight, '#cae952');
    colorRect(0, height - (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, emojiKeyPanelHeight, '#12305c');

    //Draw lines seperating emoji key panels
    canvasContext.lineWidth = 2;
    colorLine(0, height - (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, height - (emojiKeyPanelHeight * 3), "white");
    colorLine(0, height - (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, height - (emojiKeyPanelHeight * 2), "white");
    colorLine(0, height - (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, height - (emojiKeyPanelHeight * 1), "white");

    //Draw face icons for each graph
    canvasContext.drawImage(cured_face, 5, height - (emojiKeyPanelHeight * 3.4) - 10, cured_face.width * 0.08, cured_face.height * 0.08);
    canvasContext.drawImage(healthy_face, 5, height - (emojiKeyPanelHeight * 2.4) - 10, healthy_face.width * 0.08, healthy_face.height * 0.08);
    canvasContext.drawImage(sick_face, 5, height - (emojiKeyPanelHeight * 1.4) - 10, sick_face.width * 0.08, sick_face.height * 0.08);
    canvasContext.drawImage(skull, 5, height - (emojiKeyPanelHeight * 0.4) - 10, skull.width * 0.08, skull.height * 0.08);

    //Write percentage stats to each graph
    canvasContext.font = "11px Bogle";
    canvasContext.fillStyle = "#1055b7";
    canvasContext.fillText(percentTestingNegative + "% Saludable", 30, height - (emojiKeyPanelHeight * 2.35));
    canvasContext.fillText(percentTestingPositive + "% Enfermos", 30, height - (emojiKeyPanelHeight * 1.35));
    canvasContext.fillStyle = "white";
    canvasContext.fillText(percentRecovered + "% Recuperado", 30, height - (emojiKeyPanelHeight * 3.35));
    canvasContext.fillText(percentDead + "% Fallecido", 30, height - (emojiKeyPanelHeight * 0.35));

}

function drawAllGraphs() {

    for (var j = allNegativeGraphData.length; j >= 1; j--) {
        for (var i = 0; i < negativeGraphData.length; i++) {

            var length = allNegativeGraphData.length;

            var posLineEnd = graphPanelHeight * (j + 1) - allDeadGraphData[length - j][i] - allPositiveGraphData[length - j][i];
            var thresholdLineY = ((j + 1) * graphPanelHeight) - (graphPanelHeight * capacityThreshold);
            var graphBottomY = (j + 1) * graphPanelHeight;

            //Draw line graph
            if (((j + 1) * graphPanelHeight) - (graphPanelHeight * capacityThreshold) > posLineEnd) {
                colorLine(i + emojiKeyPanelWidth, thresholdLineY, i + emojiKeyPanelWidth, posLineEnd, '#ff451a'); //(graphPanelHeight * (j)) +
            } else {
                colorCircle(i + emojiKeyPanelWidth, posLineEnd, 2, '#ffe31a');
            }

            //Draw emoji color key panel backgrounds
            colorRect(0, graphPanelHeight * (j) + (emojiKeyPanelHeight * 0), emojiKeyPanelWidth, emojiKeyPanelHeight, '#ed8300');
            colorRect(0, graphPanelHeight * (j) + (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, emojiKeyPanelHeight, '#ffe31a');
            colorRect(0, graphPanelHeight * (j) + (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, emojiKeyPanelHeight, '#cae952');
            colorRect(0, graphPanelHeight * (j) + (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, emojiKeyPanelHeight, '#12305c');

            //Draw lines seperating emoji key panels
            canvasContext.lineWidth = 2;
            colorLine(0, graphPanelHeight * (j) + (emojiKeyPanelHeight * 1), emojiKeyPanelWidth, graphPanelHeight * (j) + (emojiKeyPanelHeight * 1), "white");
            colorLine(0, graphPanelHeight * (j) + (emojiKeyPanelHeight * 2), emojiKeyPanelWidth, graphPanelHeight * (j) + (emojiKeyPanelHeight * 2), "white");
            colorLine(0, graphPanelHeight * (j) + (emojiKeyPanelHeight * 3), emojiKeyPanelWidth, graphPanelHeight * (j) + (emojiKeyPanelHeight * 3), "white");

            //Draw hospital capacity threshold line
            canvasContext.lineWidth = 1;
            colorLine(emojiKeyPanelWidth, thresholdLineY, width, thresholdLineY, '#009ada');

            //Write Capacidad Hospitalaria on capacity threshold line
            canvasContext.textAlign = 'left';
            canvasContext.font = "10px Bogle";
            canvasContext.fillStyle = "#1055b7";
            //canvasContext.fillText("Capacidad", emojiKeyPanelWidth + 3, thresholdLineY - 2);
            //canvasContext.fillText("Hospitalaria", emojiKeyPanelWidth + 3, thresholdLineY + 8);

            //Write attempt number on each graph
            canvasContext.font = "16px Bogle";
            canvasContext.textAlign = 'left';
            canvasContext.fillStyle = "black";
            canvasContext.fillText(allNegativeGraphData.length - (j - 1), emojiKeyPanelWidth + 8, 20 + ((j) * graphPanelHeight));

            //Draw face icons for each graph
            canvasContext.drawImage(cured_face, 5, graphPanelHeight * (j) + (emojiKeyPanelHeight * 0.125), cured_face.width * 0.08, cured_face.height * 0.08);
            canvasContext.drawImage(healthy_face, 5, graphPanelHeight * (j) + (emojiKeyPanelHeight * 1.125), healthy_face.width * 0.08, healthy_face.height * 0.08);
            canvasContext.drawImage(sick_face, 5, graphPanelHeight * (j) + (emojiKeyPanelHeight * 2.125), sick_face.width * 0.08, sick_face.height * 0.08);
            canvasContext.drawImage(skull, 5, graphPanelHeight * (j) + (emojiKeyPanelHeight * 3.125), skull.width * 0.08, skull.height * 0.08);

            //Write percentage stats to each graph
            canvasContext.font = "11px Bogle";
            canvasContext.fillStyle = "black";
            canvasContext.fillText(allPercentTestingNegative[length - j] + "% Saludable", 30, graphPanelHeight * (j) + (emojiKeyPanelHeight * 1.66));
            canvasContext.fillText(allPercentTestingPositive[length - j] + "% Enfermos", 30, graphPanelHeight * (j) + (emojiKeyPanelHeight * 2.66));
            canvasContext.fillStyle = "white";
            canvasContext.fillText(allPercentRecovered[length - j] + "% Recuperado", 30, graphPanelHeight * (j) + (emojiKeyPanelHeight * 0.66));
            canvasContext.fillText(allPercentDead[length - j] + "% Muerto", 30, graphPanelHeight * (j) + (emojiKeyPanelHeight * 3.66));

            //Draw lines to seperate graphs
            canvasContext.lineWidth = 1;
            colorLine(0, graphBottomY, width, graphBottomY, 'black');

            //Draw TOTAL Header
            colorRect(0, 0, canvas.width, graphPanelHeight, '#0643b4');
            canvasContext.font = "24px Bogle";
            canvasContext.fillStyle = 'white';
            canvasContext.textAlign = 'center';
            canvasContext.fillText("TOTAL", canvas.width / 2, graphPanelHeight / 2);

        }

    }

    //Draw white rectangle to block out all but the top four most recent graphs
    colorRect(0, graphPanelHeight * 5, width, height - (graphPanelHeight * 5), 'white');

    //Write "Intentar otra vez" under restart button
    canvasContext.font = "20px Bogle";
    canvasContext.fillStyle = '#1055b7';
    canvasContext.textAlign = 'center';
    canvasContext.fillText("Intentar otra vez", canvas.width / 2, canvas.height - 20);

}

function drawBanner() {

    if (isOverCapacity) {
        colorRect(0, height - graphPanelHeight - bannerHeight, width, bannerHeight, '#ff451a');
        canvasContext.textAlign = 'center';
        canvasContext.font = "16px Bogle";
        canvasContext.fillStyle = "white";
        canvasContext.fillText("⚠️ PELIGRO: ¡Capacidad Hospitalaria Excedida! ⚠️", width / 2, height - graphPanelHeight - (bannerHeight * 0.25));
    } else {
        colorRect(0, height - graphPanelHeight - bannerHeight, width, bannerHeight, '#45bcd8');
        canvasContext.textAlign = 'center';
        canvasContext.font = "14px Bogle";
        canvasContext.fillStyle = "white";
        canvasContext.fillText("¡Aplane la curva enmascarando, lavando y distanciando!", width / 2, height - graphPanelHeight - (bannerHeight * 0.30));
    }
}