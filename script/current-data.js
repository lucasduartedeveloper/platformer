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

    websocketBot.attachMessageHandler();
    createMap();

    drawImage();
    animate();
});

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
    
};

var getValue = function(x) {
    var co = Math.abs(0-x);
    var ca = Math.abs(0-1);
    var far = Math.sqrt(
    Math.pow(co, 2)+
    Math.pow(ca, 2));

    return far;
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