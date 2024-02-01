var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;

var gridSize = 10;

if (window.innerWidth > window.innerHeight) {
    sw = window.innerWidth;
    sh = window.innerHeight;
    gridSize = 20;
}

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
if (urlParams.has("height"))
sh = parseInt(urlParams.get("height"));

var audioBot = true;
var playerId = new Date().getTime();

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

var audioStream = 
new Audio("audio/music/stream-0.wav");

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    $("html, body").css("overflow", "hidden");
    $("html, body").css("background", "#000");

    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");
    $("#title").css("top", "10px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = ""; //"PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    titleView = document.createElement("span");
    titleView.style.position = "absolute";
    titleView.style.color = "#fff";
    titleView.innerText = "CURRENT DATA";
    titleView.style.fontFamily = "Khand";
    titleView.style.fontSize = "15px";
    titleView.style.textAlign = "center";
    titleView.style.left = ((sw/2)-125)+"px";
    titleView.style.top = ((sh/2)-72.5)+"px";
    titleView.style.width = (250)+"px";
    titleView.style.height = (25)+"px";
    //waterHeightView.style.border = "1px solid white";
    titleView.style.borderRadius = "25px";
    titleView.style.zIndex = "15";
    document.body.appendChild(titleView);

    waterHeightView = document.createElement("span");
    waterHeightView.style.position = "absolute";
    waterHeightView.style.color = "#fff";
    waterHeightView.innerText = "Water height: 0 mm";
    waterHeightView.style.fontFamily = "Khand";
    waterHeightView.style.fontSize = "15px";
    waterHeightView.style.textAlign = "center";
    waterHeightView.style.left = ((sw/2)-125)+"px";
    waterHeightView.style.top = ((sh/2)-12.5)+"px";
    waterHeightView.style.width = (250)+"px";
    waterHeightView.style.height = (25)+"px";
    //waterHeightView.style.border = "1px solid white";
    waterHeightView.style.borderRadius = "25px";
    waterHeightView.style.zIndex = "15";
    document.body.appendChild(waterHeightView);

    windVelocityView = document.createElement("span");
    windVelocityView.style.position = "absolute";
    windVelocityView.style.color = "#fff";
    windVelocityView.innerText = "Wind velocity: 0 m/s";
    windVelocityView.style.fontFamily = "Khand";
    windVelocityView.style.fontSize = "15px";
    windVelocityView.style.textAlign = "center";
    windVelocityView.style.left = ((sw/2)-125)+"px";
    windVelocityView.style.top = ((sh/2)+12.5)+"px";
    windVelocityView.style.width = (250)+"px";
    windVelocityView.style.height = (25)+"px";
    //waterHeightView.style.border = "1px solid white";
    windVelocityView.style.borderRadius = "25px";
    windVelocityView.style.zIndex = "15";
    document.body.appendChild(windVelocityView);

    maxCount = 1;
    timerView = document.createElement("span");
    timerView.style.position = "absolute";
    timerView.style.color = "#fff";
    timerView.innerText = "0/"+maxCount;
    timerView.style.fontFamily = "Khand";
    timerView.style.fontSize = "25px";
    timerView.style.textAlign = "center";
    timerView.style.left = ((sw/2)-25)+"px";
    timerView.style.top = ((sh/2)+125)+"px";
    timerView.style.width = (50)+"px";
    timerView.style.height = (25)+"px";
    //waterHeightView.style.border = "1px solid white";
    timerView.style.borderRadius = "25px";
    timerView.style.zIndex = "15";
    document.body.appendChild(timerView);

    timerView.onclick = function() {
        /*
        var value = prompt("Max count: ", maxCount);
        value = parseInt(value);
        if (!value) return;*/

        var value = (maxCount+1);

        maxCount = value;
        timerView.innerText = "0/"+maxCount;
    };

    invertDevice = false;
    mirrorView = document.createElement("img");
    mirrorView.style.position = "absolute";
    mirrorView.style.objectFit = "cover";
    mirrorView.style.left = ((sw/2)-100)+"px";
    mirrorView.style.top = ((sh/2)+37.5)+"px";
    mirrorView.style.width = (50)+"px";
    mirrorView.style.height = (50)+"px";
    //waterHeightView.style.border = "1px solid white";
    mirrorView.style.borderRadius = "25px";
    mirrorView.style.transform = 
    invertDevice ? "rotateY(-180deg)" : "";
    mirrorView.style.zIndex = "15";
    mirrorView.src = "img/José.png";
    document.body.appendChild(mirrorView);

    mirrorView.onclick = function() {
        invertDevice = !invertDevice;
        mirrorView.style.transform = 
        invertDevice ? "rotateY(-180deg)" : "";

        if (invertDevice) {
            leftView.style.left = ((sw/2)+100)+"px";
            rightView.style.left = ((sw/2)-150)+"px";
        }
        else {
            leftView.style.left = ((sw/2)-150)+"px";
            rightView.style.left = ((sw/2)+100)+"px";
        }

        updateBaseImage();
    };

    playView = document.createElement("button");
    playView.style.position = "absolute";
    playView.style.color = "#000";
    playView.innerText = "pause";
    playView.style.fontFamily = "Khand";
    playView.style.fontSize = "15px";
    playView.style.textAlign = "center";
    playView.style.left = ((sw/2)-25)+"px";
    playView.style.top = ((sh/2)+50)+"px";
    playView.style.width = (50)+"px";
    playView.style.height = (25)+"px";
    //waterHeightView.style.border = "1px solid white";
    playView.style.borderRadius = "25px";
    playView.style.zIndex = "15";
    document.body.appendChild(playView);

    timerInterval = 0;
    playView.onclick = function() {
        if (!cameraView.paused) {
            var count = 0;
            timerInterval = setInterval(function() {
                count += 1;
                timerView.innerText = count+ "/" +maxCount;

                if (count == maxCount) {
                    clearInterval(timerInterval);
                    cameraView.pause();
                    playView.innerText = "play";
                }
            }, 1000);
        }
        else {
            clearInterval(timerInterval);
            var count = 0;
            timerView.innerText = count+ "/" +maxCount;

            cameraView.play();
            playView.innerText = "pause";
        }
    };

    previousToNext = 0.5;
    previousToNextView = document.createElement("button");
    previousToNextView.style.position = "absolute";
    previousToNextView.style.color = "#000";
    previousToNextView.innerText = 
    (previousToNext*100)+"%";
    previousToNextView.style.fontFamily = "Khand";
    previousToNextView.style.fontSize = "15px";
    previousToNextView.style.textAlign = "center";
    previousToNextView.style.left = ((sw/2)+35)+"px";
    previousToNextView.style.top = ((sh/2)+50)+"px";
    previousToNextView.style.width = (50)+"px";
    previousToNextView.style.height = (25)+"px";
    //waterHeightView.style.border = "1px solid white";
    previousToNextView.style.borderRadius = "25px";
    previousToNextView.style.zIndex = "15";
    document.body.appendChild(previousToNextView);

    previousToNextView.onclick = function() {
        previousToNext = (previousToNext+0.25) < 1.25 ? 
        (previousToNext+0.25) : 0;
        previousToNextView.innerText = 
        (previousToNext*100)+"%";
    };

    downloadView = document.createElement("button");
    downloadView.style.position = "absolute";
    downloadView.style.background = "#fff";
    downloadView.style.color = "#000";
    downloadView.innerText = "download";
    downloadView.style.fontFamily = "Khand";
    downloadView.style.lineHeight = (25)+"px";
    downloadView.style.fontSize = (15)+"px";
    downloadView.style.left = ((sw/2)+95)+"px";
    downloadView.style.top = ((sh/2)+50)+"px";
    downloadView.style.width = (70)+"px";
    downloadView.style.height = (25)+"px";
    downloadView.style.border = "none";
    downloadView.style.borderRadius = "12.5px";
    downloadView.style.zIndex = "15";
    document.body.appendChild(downloadView);

    downloadView.onclick = function() {
        var name = "download.png";
        var url = mapView.toDataURL();
        var a = document.createElement('a');
        a.style.display = "none";
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    previousMapStoreView = document.createElement("canvas");
    previousMapStoreView.style.position = "absolute";
    previousMapStoreView.style.imageRendering = "pixelated";
    previousMapStoreView.style.background = "#fff";
    previousMapStoreView.style.fontFamily = "Khand";
    previousMapStoreView.style.fontSize = "15px";
    previousMapStoreView.style.textAlign = "center";
    previousMapStoreView.width = (201);
    previousMapStoreView.height = (201);
    previousMapStoreView.style.left = ((sw/2)-100)+"px";
    previousMapStoreView.style.top = ((sh/2)-275)+"px";
    previousMapStoreView.style.width = (200)+"px";
    previousMapStoreView.style.height = (200)+"px";
    //mapView.style.borderRadius = "25px";
    previousMapStoreView.style.zIndex = "15";
    document.body.appendChild(previousMapStoreView);

    previousMapView = document.createElement("canvas");
    previousMapView.style.position = "absolute";
    previousMapView.style.imageRendering = "pixelated";
    previousMapView.style.background = "#fff";
    previousMapView.style.fontFamily = "Khand";
    previousMapView.style.fontSize = "15px";
    previousMapView.style.textAlign = "center";
    previousMapView.width = (201);
    previousMapView.height = (201);
    previousMapView.style.left = ((sw/2)-100)+"px";
    previousMapView.style.top = ((sh/2)-275)+"px";
    previousMapView.style.width = (200)+"px";
    previousMapView.style.height = (200)+"px";
    //mapView.style.borderRadius = "25px";
    previousMapView.style.zIndex = "15";
    document.body.appendChild(previousMapView);

    mapView = document.createElement("canvas");
    mapView.style.position = "absolute";
    mapView.style.imageRendering = "pixelated";
    mapView.style.background = "#fff";
    mapView.style.fontFamily = "Khand";
    mapView.style.fontSize = "15px";
    mapView.style.textAlign = "center";
    mapView.width = previousMapView.width;
    mapView.height = previousMapView.height;
    mapView.style.left = previousMapView.style.left;
    mapView.style.top = previousMapView.style.top;
    mapView.style.width = previousMapView.style.width;
    mapView.style.height = previousMapView.style.height;
    //mapView.style.borderRadius = "25px";
    mapView.style.zIndex = "15";
    document.body.appendChild(mapView);

    leftView = document.createElement("span");
    leftView.style.position = "absolute";
    leftView.innerText = "L";
    leftView.style.color = "#fff";
    leftView.style.fontFamily = "Khand";
    leftView.style.fontSize = "15px";
    leftView.style.textAlign = "center";
    leftView.style.left = ((sw/2)-150)+"px";
    leftView.style.top = ((sh/2)-187.5)+"px";
    leftView.style.width = (50)+"px";
    leftView.style.height = (25)+"px";
    //mapView.style.borderRadius = "25px";
    leftView.style.zIndex = "15";
    document.body.appendChild(leftView);

    rightView = document.createElement("span");
    rightView.style.position = "absolute";
    rightView.innerText = "R";
    rightView.style.color = "#fff";
    rightView.style.fontFamily = "Khand";
    rightView.style.fontSize = "15px";
    rightView.style.textAlign = "center";
    rightView.style.left = ((sw/2)+100)+"px";
    rightView.style.top = ((sh/2)-187.5)+"px";
    rightView.style.width = (50)+"px";
    rightView.style.height = (25)+"px";
    //mapView.style.borderRadius = "25px";
    rightView.style.zIndex = "15";
    document.body.appendChild(rightView);

    cameraView = document.createElement("video");
    cameraView.style.position = "absolute";
    cameraView.autoplay = true;
    cameraView.style.objectFit = "cover";
    cameraView.width = (100);
    cameraView.height = (100);
    cameraView.style.left = ((sw/2)-50)+"px";
    cameraView.style.top = ((sh/2)-175)+"px";
    cameraView.style.width = (100)+"px";
    cameraView.style.height = (100)+"px";
    cameraView.style.zIndex = "15";
    //document.body.appendChild(cameraView);
    cameraElem = cameraView;

    deviceNo = 0;
    mapView.onclick = function() {
        if (!cameraOn) startCamera();
        else hasNewData = true;
    };

    websocketBot.attachMessageHandler();
    loadImages(function() {
        drawBaseImage(
        img_list[0], img_list[0].naturalWidth, img_list[0].naturalHeight);
    });

    drawImage();
    animate();
});

var img_list = [
    "img/picture-0.png"
];

var imagesLoaded = false;
var loadImages = function(callback) {
    var count = 0;
    for (var n = 0; n < img_list.length; n++) {
        var img = document.createElement("img");
        img.n = n;
        img.onload = function() {
            count += 1;
            console.log("loading ("+count+"/"+img_list.length+")");
            img_list[this.n] = this;
            if (count == img_list.length) {
                imagesLoaded = true;
                if (callback) callback();
            }
        };
        var rnd = Math.random();
        img.src = img_list[n].includes("img") ? 
        img_list[n]+"?f="+rnd : 
        img_list[n];
    }
};

document.addEventListener('keydown', (e) => {
    const keyName = e.key;
    switch (e.keyCode) {
        case 37:
            buttonLeftView.click();
            break;
        case 39:
            buttonRightView.click();
            break;
        case 38:
            buttonUpView.click();
            break;
        case 40:
            buttonDownView.click();
            break;
        case 80:
            buttonBuildView.click();
            break;
    }
});

var websocketBot = {
    messageRequested: false,
    lastUpdate: 0,
    sendPosition: function(value) {
        var obj = {
            timestamp: new Date().getTime(),
            helmet: helmet,
            pos: position,
            path: path
        };
        ws.send("PAPER|"+playerId+"|position-data|"+
        JSON.stringify(obj));
        this.messageRequested = false;
    },
    attachMessageHandler: function() {
        ws.onmessage = function(e) {
            var msg = e.data.split("|");
            //console.log(msg[2] + " from " + msg[1]);

            if (msg[0] == "PAPER" &&
                msg[1] != playerId &&
                msg[2] == "position-data") {
                var obj = JSON.parse(msg[3]);

                var currentTime = new Date().getTime();

                if (obj.timestamp < this.lastUpdate) return;

                setHelmet(obj.helmet);
                position = obj.pos;
                path = obj.path;

                this.lastUpdate = currentTime;
                //obj.timestamp;
            }
            else if (msg[0] == "PAPER" &&
                msg[1] != playerId &&
                msg[2] == "map-request") {
                pictureView.style.display = "none";
                buttonLeftView.style.display = "none";
                buttonRightView.style.display = "none";
                buttonUpView.style.display = "none";
                buttonDownView.style.display = "none";

                ws.send("PAPER|"+playerId+"|map-response|"+
                JSON.stringify(maze));
            }
            else if (msg[0] == "PAPER" &&
                msg[1] != playerId &&
                msg[2] == "map-response") {
                var obj = JSON.parse(msg[3]);

                maze = obj;
            }
        }.bind(this);
    }
};

var updateImage = true;

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if ((new Date().getTime() - updateTime) > 1000) {
            updateTime = new Date().getTime();
        }

        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var hasNewData = false;
var drawImage = function() {
    var ctx = mapView.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    ctx.save();
    if (invertDevice) {
        ctx.scale(-1, 1);
        ctx.translate(-201, 0);
    }

    if (cameraOn) {
        var video = {
            width: vw,
            height: vh
        };
        var frame = {
            width: getSquare(video),
            height: getSquare(video)
        };
        var format = fitImageCover(video, frame);

        ctx.drawImage(cameraView,
        -format.left, -format.top, frame.width, frame.height, 
        0, 0, mapView.width, mapView.height);
    }

    ctx.restore();

    if (hasNewData) {
        drawBaseImage(
        mapView, mapView.width, mapView.height);
        hasNewData = false;
    }

    if (imagesLoaded) combineImageData();
};

var drawBaseImage = function(image, width, height) {
    var baseStoreCtx = previousMapStoreView.getContext("2d");
    baseStoreCtx.imageSmoothingEnabled = false;

    //console.log(image, width, height);
    baseStoreCtx.clearRect(
    0, 0, previousMapStoreView.width, previousMapStoreView.height);

    var video = {
        width: width,
        height: height
    };
    var frame = {
        width: getSquare(video),
        height: getSquare(video)
    };
    var format = fitImageCover(video, frame);

    baseStoreCtx.drawImage(image,
    -format.left, -format.top, frame.width, frame.height, 
    0, 0, previousMapView.width, previousMapView.height);

    updateBaseImage();
};

var updateBaseImage = function() {
    var baseCtx = previousMapView.getContext("2d");
    baseCtx.imageSmoothingEnabled = false;

    baseCtx.clearRect(
    0, 0, previousMapView.width, previousMapView.height);

    baseCtx.save();
    if (invertDevice) {
        baseCtx.scale(-1, 1);
        baseCtx.translate(-201, 0);
    }

    baseCtx.drawImage(previousMapStoreView, 
    0, 0, previousMapView.width, previousMapView.height);

    baseCtx.restore();
};

var hasLog = false;
var combineImageData = function() {
    var canvas = mapView;
    var ctx = canvas.getContext("2d");

    var imgData = 
    ctx.getImageData(0, 0, 
    canvas.width, canvas.height);
    var data = imgData.data;

    var baseCanvas = previousMapView;
    var baseCtx = baseCanvas.getContext("2d");

    var baseImgData = 
    baseCtx.getImageData(0, 0, 
    baseCanvas.width, baseCanvas.height);
    var baseData = baseImgData.data;

    var newImageArray = 
    new Uint8ClampedArray(data);

    for (var y = 0; y < canvas.width; y++) {
    for (var x = 0; x < canvas.height; x++) {
        var n = ((y*canvas.width)+x)*4;

        var r0 = previousToNext;
        var r1 = (1-previousToNext);

        newImageArray[n] = 
        ((r0*baseData[n])+(r1*data[n]));
        newImageArray[n+1] = 
        ((r0*baseData[n + 1])+(r1*data[n + 1]));
        newImageArray[n+2] = 
        ((r0*baseData[n + 2])+(r1*data[n + 2]));
        newImageArray[n+3] = 255;
    }
    }

    if (!hasLog) {
        //console.log(baseData, newImageArray);
        hasLog = true;
    }

    var newImageData = new ImageData(newImageArray, canvas.width, canvas.height);

    ctx.putImageData(newImageData, 0, 0);
};

var getSquare = function(item) {
    var width = item.naturalWidth ? 
    item.naturalWidth : item.width;
    var height = item.naturalHeight ? 
    item.naturalHeight : item.height;

    return width < height ? width : height;
};

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  visibilityChange = "webkitvisibilitychange";
}
//^different browsers^

var backgroundMode = false;
document.addEventListener(visibilityChange, function(){
    backgroundMode = !backgroundMode;
    if (backgroundMode) {
        console.log("backgroundMode: "+backgroundMode);
    }
    else {
        console.log("backgroundMode: "+backgroundMode);
    }
}, false);