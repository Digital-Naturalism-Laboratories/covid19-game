var title_screen = document.createElement("img");
var instructions_screen = document.createElement("img");
var healthy_face = document.createElement("img");
var cured_face = document.createElement("img");
var healthy_masked_face = document.createElement("img");
var sick_face = document.createElement("img");
var sick_masked_face = document.createElement("img");
var mask = document.createElement('img');
var skull = document.createElement("img");
var soap = document.createElement("img");
var ruler = document.createElement("img");
var restart_icon = document.createElement("img");

var picsToLoad = 11;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) {
        initRenderLoop();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImageAndLaunchIfReady;
    imgVar.src = "images/" + fileName;
}

function loadImages() {

    var imageList = [{
            varName: title_screen,
            fileName: "title_screen.png"
        },
        {
            varName: instructions_screen,
            fileName: "instructions_screen.png"
        },
        {
            varName: healthy_face,
            fileName: "healthy_face.png"
        },
        {
            varName: cured_face,
            fileName: "cured_face.png"
        },
        {
            varName: healthy_masked_face,
            fileName: "healthy_masked_face.png"
        },
        {
            varName: sick_face,
            fileName: "sick_face.png"
        },
        {
            varName: sick_masked_face,
            fileName: "sick_masked_face.png"
        },
        {
            varName: mask,
            fileName: "mask.png"
        },
        {
            varName: skull,
            fileName: "skull.png"
        },
        {
            varName: soap,
            fileName: "soap.png"
        },
        {
            varName: ruler,
            fileName: "ruler.png"
        },
        {
            varName: restart_icon,
            fileName: "restart_icon.png"
        }
    ];

    picsToLoad = imageList.length;

    for (var i = 0; i < imageList.length; i++) {
        beginLoadingImage(imageList[i].varName, imageList[i].fileName);
    }

}