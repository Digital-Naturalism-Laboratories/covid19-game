var imagesToLoad = 0;

var spriteList = {};

function loadImages() {

	var imageList = [
	    {spriteName: 'image1', fileName: 'image1.png'},
	]
    console.log(imageList.length);
	imagesToLoad = imageList.length;



	for (var i=0; i<imageList.length; i++) {
		let newImage = document.createElement('img');
		beginLoadingImage(newImage, imageList[i].fileName);
        spriteList[imageList[i].spriteName] = newImage;
        console.log("test");
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.src = 'images/'+fileName;
	imgVar.onload = function() {countImagesOrStartGame()};
}

function countImagesOrStartGame() {
    imagesToLoad--;
    console.log(imagesToLoad);
	if (imagesToLoad == 0) {
		initRenderLoop();
	}
}