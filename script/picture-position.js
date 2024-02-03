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

    hasNewData = false;
    mapView = document.createElement("canvas");
    mapView.style.position = "absolute";
    mapView.style.imageRendering = "pixelated";
    mapView.style.background = "#fff";
    mapView.style.fontFamily = "Khand";
    mapView.style.fontSize = "15px";
    mapView.style.textAlign = "center";
    mapView.width = (sw);
    mapView.height = (sh);
    mapView.style.left = (0)+"px";
    mapView.style.top = (0)+"px";
    mapView.style.width = (sw)+"px";
    mapView.style.height = (sh)+"px";
    //mapView.style.borderRadius = "25px";
    mapView.style.zIndex = "15";
    document.body.appendChild(mapView);

    mapView.onclick = function() {
        hasNewData = true;
    };

    position = {
       x: (sw/2),
       y: (sh/2)
    };

    tileView = document.createElement("canvas");
    tileView.style.position = "absolute";
    tileView.style.imageRendering = "pixelated";
    tileView.style.background = "#fff";
    tileView.style.fontFamily = "Khand";
    tileView.style.fontSize = "15px";
    tileView.style.textAlign = "center";
    tileView.width = (sw/5);
    tileView.height = (sw/5)
    tileView.style.left = (position.x-(sw/10))+"px";
    tileView.style.top = (position.y-(sw/10))+"px";
    tileView.style.width = (sw/5)+"px";
    tileView.style.height = (sw/5)+"px";
    //mapView.style.borderRadius = "25px";
    tileView.style.border = "1px solid #000";
    tileView.style.zIndex = "15";
    document.body.appendChild(tileView);

    tileView.ontouchstart = function(e) {
        position.x = e.touches[0].clientX;
        position.y = e.touches[0].clientY;

        tileView.style.left = (position.x-(sw/10))+"px";
        tileView.style.top = (position.y-(sw/10))+"px";
    };

    tileView.ontouchmove = function(e) {
        position.x = e.touches[0].clientX;
        position.y = e.touches[0].clientY;

        tileView.style.left = (position.x-(sw/10))+"px";
        tileView.style.top = (position.y-(sw/10))+"px";
    };

    invertImage = false;
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
    tileView.onclick = function() {
        if (!cameraOn) startCamera();
        else hasNewData = true;
    };

    drawImage();
    animate();
});

var img_list = [
    "img/picture-3.png",
    "img/picture-2.png"
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

var drawImage = function() {
    var ctx = tileView.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    ctx.save();
    if (invertImage) {
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
        0, 0, tileView.width, tileView.height);
    }

    if (hasNewData) {
        var mapCtx = mapView.getContext("2d");

        mapCtx.drawImage(tileView,
        position.x-(sw/10), position.y-(sw/10), (sw/5), (sw/5));

        hasNewData= false;
    }

    ctx.restore();
};

var rotation = 0;
var setShape = function(image) {
    var ctx = image.getContext("2d");
    var size = 201;

    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    var centerCtx = canvas.getContext("2d");
    centerCtx.imageSmoothingEnabled = true;

    centerCtx.lineWidth = 0.5;
    centerCtx.strokeStyle = "#fff";

    for (var n = 0; n < 50 ; n++) {
        var radius = (1-((1/50)*n))*(size/2);
        centerCtx.save();
        centerCtx.translate((size/2), (size/2));
        centerCtx.rotate(-n*(rotation/50));
        centerCtx.translate(-(size/2), -(size/2));

        centerCtx.beginPath();
        centerCtx.arc((size/2), (size/2), radius, 0, (Math.PI*2));
        //drawPolygon(centerCtx, 75, 75, radius);
        //centerCtx.stroke();
        centerCtx.clip();

        var scale = 1; //1+(Math.curve((1/50)*n, 1)*0.5);
        //console.log(scale);

        centerCtx.drawImage(image, 
        (size/2)-((size/2)/scale), (size/2)-((size/2)/scale),
        (size/scale), (size/scale),
        0, 0, size, size);

        centerCtx.restore();
    }

    ctx.save();
    //ctx.filter = "blur("+Math.abs((10/Math.PI)*rotation)+"px)";

    ctx.drawImage(canvas, 
    (size/2)-(size/2), (size/2)-(size/2), size, size);

    ctx.restore();
};

var setShape_zoom = function(image) {
    var ctx = image.getContext("2d");
    var size = 201;

    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    var centerCtx = canvas.getContext("2d");
    centerCtx.imageSmoothingEnabled = true;

    centerCtx.lineWidth = 0.5;
    centerCtx.strokeStyle = "#fff";

    for (var n = 0; n < 50 ; n++) {
        var radius = (1-((1/50)*n))*(size/2);
        centerCtx.save();
        centerCtx.beginPath();
        centerCtx.arc((size/2), (size/2), radius, 0, (Math.PI*2));
        //drawPolygon(centerCtx, 75, 75, radius);
        //centerCtx.stroke();
        centerCtx.clip();

        var scale = 1+(Math.curve((1/50)*n, 1)*0.5);
        //console.log(scale);

        centerCtx.drawImage(image, 
        (size/2)-((size/2)/scale), (size/2)-((size/2)/scale),
        (size/scale), (size/scale),
        0, 0, size, size);

        centerCtx.restore();
    }

    ctx.drawImage(canvas, 
    (size/2)-(size/2), (size/2)-(size/2), size, size);
};

var frameOrder = 0;
var motionBlur = function() {
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = mapView.width;
    tempCanvas.height = mapView.height*3;

    var tempCtx = tempCanvas.getContext("2d");

    var diff = ((1/((201/20)-(190/20)))*((speedY/20)-(190/20)));

    tempCtx.filter = speedY < 190 ?
    "blur("+(speedY/20)+"px)" : 
    "blur("+(1-diff)*(speedY/20)+"px)";

    tempCtx.drawImage(frameOrder == 0 ? 
    previous1MapStoreView : mapView,
    0, 0+offsetY,
    mapView.width, mapView.height);

    tempCtx.drawImage(frameOrder == 0 ? 
    mapView : previous1MapStoreView,
    0, mapView.height+offsetY,
    mapView.width, mapView.height);

    tempCtx.drawImage(frameOrder == 0 ? 
    previous1MapStoreView : mapView,
    n, (mapView.height*2)+offsetY,
    mapView.width, mapView.height);

    return tempCanvas;

    for (var n = 0; n < 201; n++) {
        var offset = n % 2 == 0 ? (offsetY/2) : -offsetY;

        tempCtx.drawImage(mapView,
        n, 0, 1, mapView.height,
        n, 0+offset,
        1, mapView.height);

        tempCtx.drawImage(mapView,
        n, 0, 1, mapView.height,
        n, mapView.height+offset,
        1, mapView.height);

        tempCtx.drawImage(mapView,
        n, 0, 1, mapView.height,
        n, (mapView.height*2)+offset,
        1, mapView.height);
    }

    return tempCanvas;
};

Math.curve = function(value, scale) {
    var c = {
        x: 0,
        y: 0
    };
    var p = {
        x: -1,
        y: 0
    };
    var rp = _rotate2d(c, p, (value*90));
    return rp.y*scale;
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

    //draw(baseStoreCtx);

    updateBaseImage();
};

var drawKnownShape = function(ctx) {
    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.arc((201/2), (201/2), 
    (201/2)-5, (Math.PI/2), -(Math.PI/2));
    ctx.fill();

    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.arc((201/2), (201/2), 
    (201/2)-5, -(Math.PI/2), (Math.PI/2));
    ctx.fill();

    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.arc((201/2)-25, (201/2), 5, 0, (Math.PI*2));
    ctx.fill();

    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.arc((201/2)+25, (201/2), 5, 0, (Math.PI*2));
    ctx.fill();
};

var draw = function(ctx) {
    ctx.fillStyle = "orange";

    ctx.beginPath();
    ctx.rect(0, 0, (201/2), 201);
    ctx.fill();

    ctx.fillStyle = "purple";

    ctx.beginPath();
    ctx.rect((201/2), 0, (201/2), 201);
    ctx.fill();
};

var drawPreviousBaseImage = function(image, width, height) {
    var baseStoreCtx = previous1MapStoreView.getContext("2d");
    baseStoreCtx.imageSmoothingEnabled = false;

    //console.log(image, width, height);
    baseStoreCtx.clearRect(
    0, 0, previous1MapStoreView.width, 
    previous1MapStoreView.height);

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
};

var updateBaseImage = function() {
    var baseCtx = previousMapView.getContext("2d");
    baseCtx.imageSmoothingEnabled = false;

    baseCtx.clearRect(
    0, 0, previousMapView.width, previousMapView.height);

    baseCtx.save();
    if (invertImage) {
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