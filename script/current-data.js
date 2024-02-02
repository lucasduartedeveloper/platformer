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
    titleView.style.userSelect = "none";
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

    plateView = document.createElement("span");
    plateView.style.position = "absolute";
    plateView.style.userSelect = "none";
    plateView.style.background = "#fff";
    plateView.style.color = "#000";
    plateView.innerText = "YBX-4728";
    plateView.style.fontFamily = "Khand";
    plateView.style.fontSize = "15px";
    plateView.style.fontWeight = 900;
    plateView.style.lineHeight = "30px";
    plateView.style.textAlign = "center";
    plateView.style.left = ((sw/2)-25)+"px";
    plateView.style.top = ((sh/2)+200)+"px";
    plateView.style.width = (50)+"px";
    plateView.style.height = (25)+"px";
    //waterHeightView.style.border = "1px solid white";
    plateView.style.borderRadius = "5px";
    plateView.style.zIndex = "15";
    document.body.appendChild(plateView);

    invertMode = 1;
    plateView.onclick = function() {
        invertMode = invertMode == 0 ? 
        1 : 0;

        if (invertMode == 0)
        invertDevice = !invertDevice;
        else
        invertImage = !invertImage;

        plateView.style.transform = 
        !invertDevice ? "rotateY(-180deg)" : "";

        if (invertDevice) {
            //mirrorView.style.opacity = 1;
            leftView.style.left = ((sw/2)-150)+"px";
            rightView.style.left = ((sw/2)+100)+"px";
        }
        else {
            //mirrorView.style.opacity = 0;
            leftView.style.left = ((sw/2)+100)+"px";
            rightView.style.left = ((sw/2)-150)+"px";
        }

        updateBaseImage();
    };

    accView = document.createElement("div");
    accView.style.position = "absolute";
    accView.style.userSelect = "none";
    accView.style.background = "#fff";
    accView.style.color = "#000";
    accView.style.fontFamily = "Khand";
    accView.style.fontSize = "15px";
    accView.style.fontWeight = 900;
    accView.style.lineHeight = "30px";
    accView.style.textAlign = "center";
    accView.style.left = ((sw/2)+50)+"px";
    accView.style.top = ((sh/2)+187.5)+"px";
    accView.style.width = (25)+"px";
    accView.style.height = (50)+"px";
    //waterHeightView.style.border = "1px solid white";
    accView.style.borderRadius = "5px";
    accView.style.zIndex = "15";
    document.body.appendChild(accView);

    offsetY = 0;
    speedY = 0;
    accView.ontouchstart = function(e) {
        speedY = 1;
        oscillator.start();
    };

    accView.ontouchend = function(e) {
        offsetY = 0;
        speedY = 0;
        oscillator.frequency.value = 0;
    };

    waterHeightView = document.createElement("span");
    waterHeightView.style.position = "absolute";
    waterHeightView.style.userSelect = "none";
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
    windVelocityView.style.userSelect = "none";
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
    timerView.style.userSelect = "none";
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

    invertImage = false;
    invertDevice = false;

    mirrorView = document.createElement("img");
    mirrorView.style.position = "absolute";
    //mirrorView.style.opacity = 0;
    mirrorView.style.objectFit = "cover";
    mirrorView.style.left = ((sw/2)-100)+"px";
    mirrorView.style.top = ((sh/2)+37.5)+"px";
    mirrorView.style.width = (50)+"px";
    mirrorView.style.height = (50)+"px";
    //waterHeightView.style.border = "1px solid white";
    mirrorView.style.borderRadius = "25px";
    mirrorView.style.transform = 
    invertDevice ? "rotateY(-180deg)" : "";
    mirrorView.style.filter = "invert(1)";
    mirrorView.style.zIndex = "15";
    document.body.appendChild(mirrorView);

    var rnd = Math.random();
    mirrorView.src = "img/steering-wheel-0.png?rnd="+rnd;

    var startX = 0;
    var startY = 0;
    var moveX = 0;
    var moveY = 0;

    var startRotation = 0;

    mirrorView.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;

        startRotation = rotation;

        console.log(startX, startY, rotation);
    };

    mirrorView.ontouchmove = function(e) {
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;

        var offsetX = (1/sw)*(moveX-startX);
        offsetX = offsetX < 0 ? offsetX*2 : offsetX;

        rotation = startRotation+(offsetX*(Math.PI));

        mirrorView.style.transform = "rotateZ("+
        ((180/Math.PI)*rotation)+"deg)";
    };

    mirrorView.ontouchend = function(e) {
        if (moveX == startX)
        rotation = 0;

        mirrorView.style.transform = "rotateZ("+
        ((180/Math.PI)*rotation)+"deg)";
    }

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

    previousToNext = 1;
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

    frequencyPath = [];
    frequencyView = document.createElement("canvas");
    frequencyView.style.position = "absolute";
    frequencyView.style.imageRendering = "pixelated";
    //frequencyView.style.background = "#fff";
    frequencyView.style.fontFamily = "Khand";
    frequencyView.style.fontSize = "15px";
    frequencyView.style.textAlign = "center";
    frequencyView.width = (100);
    frequencyView.height = (100);
    frequencyView.style.left = (0)+"px";
    frequencyView.style.top = ((sh/2)+125)+"px";
    frequencyView.style.width = (100)+"px";
    frequencyView.style.height = (100)+"px";
    //mapView.style.borderRadius = "25px";
    frequencyView.style.zIndex = "15";
    document.body.appendChild(frequencyView);

    previous1MapStoreView = document.createElement("canvas");
    previous1MapStoreView.style.position = "absolute";
    previous1MapStoreView.style.imageRendering = "pixelated";
    previous1MapStoreView.style.background = "#fff";
    previous1MapStoreView.style.fontFamily = "Khand";
    previous1MapStoreView.style.fontSize = "15px";
    previous1MapStoreView.style.textAlign = "center";
    previous1MapStoreView.width = (201);
    previous1MapStoreView.height = (201);
    previous1MapStoreView.style.left = ((sw/2)-100)+"px";
    previous1MapStoreView.style.top = ((sh/2)-275)+"px";
    previous1MapStoreView.style.width = (200)+"px";
    previous1MapStoreView.style.height = (200)+"px";
    //mapView.style.borderRadius = "25px";
    previous1MapStoreView.style.zIndex = "15";
    document.body.appendChild(previous1MapStoreView);

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
    leftView.style.left = ((sw/2)+100)+"px";
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
    rightView.style.left = ((sw/2)-150)+"px";
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
        drawPreviousBaseImage(
        img_list[1], img_list[1].naturalWidth, img_list[1].naturalHeight);
        drawBaseImage(
        img_list[0], img_list[0].naturalWidth, img_list[0].naturalHeight);
    });

    $("*").css("user-select", "none");

    oscillator = createOscillator();

    audio = new Audio("audio/stuck-audio-0.wav");

    threshold = 1;
    limitReached = false;
    motion = true;
    lastState = { x: 0, y: 0, z: 0 };
    gyroUpdated = function(e) {
        var diffX = Math.abs(e.accX - lastState.x);
        var diffY = Math.abs(e.accY - lastState.y);
        var diffZ = Math.abs(e.accZ - lastState.z);

        var diff = (diffX+diffY+diffZ);
        //console.log(diff);

        if (diff >= threshold && !limitReached) {
            //setTorch("toggle");
            //sfxPool.play("audio/stuck-audio-0.wav");
            audio.play();
            limitReached = true;
        }
        else if (diff < threshold && audio.paused)
        limitReached = false

        lastState = { x: e.accX, y: e.accY, z: e.accZ };
    };

    recordedFrequencyPath = [];
    recordedFrequencyView = document.createElement("canvas");
    recordedFrequencyView.style.position = "absolute";
    recordedFrequencyView.style.imageRendering = "pixelated";
    recordedFrequencyView.style.fontFamily = "Khand";
    recordedFrequencyView.style.fontSize = "15px";
    recordedFrequencyView.style.textAlign = "center";
    recordedFrequencyView.width = (sw);
    recordedFrequencyView.height = (50);
    recordedFrequencyView.style.left = (0)+"px";
    recordedFrequencyView.style.top = (sh-50)+"px";
    recordedFrequencyView.style.width = (sw)+"px";
    recordedFrequencyView.style.height = (50)+"px";
    recordedFrequencyView.style.zIndex = "15";
    document.body.appendChild(recordedFrequencyView);

    recordedTextView = document.createElement("span");
    recordedTextView.style.position = "absolute";
    recordedTextView.style.imageRendering = "pixelated";
    recordedTextView.style.color = "#fff";
    recordedTextView.innerText = "OI";
    recordedTextView.style.fontFamily = "Khand";
    recordedTextView.style.fontSize = "15px";
    recordedTextView.style.lineHeight = "25px";
    recordedTextView.style.textAlign = "left";
    recordedTextView.style.left = ((sw/2)+10)+"px";
    recordedTextView.style.top = (sh-37.5)+"px";
    recordedTextView.style.width = (50)+"px";
    recordedTextView.style.height = (25)+"px";
    recordedTextView.style.zIndex = "15";
    document.body.appendChild(recordedTextView);

    recordedTextView.onclick = function() {
        if (mic.closed)
        mic.open();
    };

    var frequencyArr = [
       { value: 100, char: "A" },
       { value: 100, char: "B" }
    ];

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        console.log("mic open");
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        micAvgValue = avgValue;

        var value = ((1/250)*reachedFreq)/2;
        recordedFrequencyPath.splice(0, 0, value);
    };
    mic.onclose = function() { 
        console.log("mic closed");
    };

    media = new MediaAnalyser(audio, false, 1);
    media.onstart =function() {
        recordedFrequencyPath = [];
    };
    media.onupdate = function(freqArray, reachedFreq, avgValue) {
        micAvgValue = avgValue;

        var value = ((1/250)*reachedFreq)/2;
        recordedFrequencyPath.splice(0, 0, value);
    };
    media.onstop = function() {
        this.closed = true;
    };

    drawImage();
    animate();
});

var img_list = [
    "img/picture-0.png",
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

var hasNewData = false;
var drawImage = function() {
    var ctx = mapView.getContext("2d");
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
        0, 0, mapView.width, mapView.height);
    }

    ctx.restore();

    if (hasNewData) {
        drawBaseImage(
        mapView, mapView.width, mapView.height);
        hasNewData = false;
    }

    if (imagesLoaded) combineImageData();
    setShape(mapView);

    speedY = speedY > 0 ? (speedY+1) : 0;
    speedY = speedY > 201 ? 201 : speedY;

    offsetY += speedY;
    if (offsetY >= mapView.height)
    frameOrder = frameOrder == 0 ? 1 : 0;
    offsetY = offsetY >= mapView.height ? 0 : offsetY;

    var rnd = -0.005+(Math.random()*0.01);
    var acc = ((-0.5+((1/mapView.height)*offsetY))+rnd);
    //console.log(acc);

    var frequency = (50+(speedY/2))+(acc*(10-(speedY/20)));
    if (audio.paused)
    frequencyPath.splice(0, 0, frequency);

    if (speedY > 0)
    oscillator.frequency.value = frequency;

    var tempCanvas = motionBlur();
    ctx.clearRect(0, 0, mapView.width, mapView.height);

    ctx.drawImage(tempCanvas, 0, mapView.height, 
    mapView.width, mapView.height, 
    0, 0, mapView.width, mapView.height);

    var pos = { x: 85, y: 130, width: 31, height: 50 };

    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = pos.width;
    tempCanvas.height = pos.height;

    var tempCtx = tempCanvas.getContext("2d");

    tempCtx.drawImage(mapView, 
    pos.x, pos.y, pos.width, pos.height,
    0, 0, pos.width, pos.height);

    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.rect(pos.x, pos.y, pos.width, pos.height);
    ctx.fill();

    if (recordedFrequencyPath.length > 0)
    ctx.drawImage(tempCanvas, 
    pos.x, pos.y+
    (recordedFrequencyPath[0]*(pos.height/2)), 
    pos.width, pos.height);
    else
    ctx.drawImage(tempCanvas, 
    pos.x, pos.y, pos.width, pos.height);

    var frequenctCtx = frequencyView.getContext("2d");
    frequenctCtx.clearRect(0, 0, 100, 100);

    frequenctCtx.lineWidth = 1;
    frequenctCtx.strokeStyle = "#fff";

    frequenctCtx.beginPath();
    frequenctCtx.moveTo(50, 
    50-((-0.5+((1/150)*frequencyPath[0]))*50));
    for (var n = 1;  n < frequencyPath.length; n++) {
        frequenctCtx.lineTo(50-n, 
        50-((-0.5+((1/150)*frequencyPath[n]))*50));
    }
    frequenctCtx.stroke();

    var recordedCtx = recordedFrequencyView.getContext("2d");
    recordedCtx.clearRect(0, 0, sw, 50);

    recordedCtx.lineWidth = 1;
    recordedCtx.strokeStyle = "#fff";

    recordedCtx.beginPath();
    recordedCtx.moveTo((sw/2), 
    25-((-0.5+recordedFrequencyPath[0])*25));
    for (var n = 1; n < recordedFrequencyPath.length; n++) {
        recordedCtx.lineTo((sw/2)-n, 
        25-((-0.5+recordedFrequencyPath[n])*25));
    }
    recordedCtx.stroke();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";

    ctx.beginPath();
    ctx.moveTo(0, (201/2));
    ctx.lineTo((201/4), (201/2));
    //ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((201/4)*3, (201/2));
    ctx.lineTo(201, (201/2));
    //ctx.stroke();
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