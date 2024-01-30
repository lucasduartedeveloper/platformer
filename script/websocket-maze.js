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

    pictureView = document.createElement("canvas");
    pictureView.style.position = "absolute";
    pictureView.width = (sw/2);
    pictureView.height = (sw/2); 
    pictureView.style.left = ((sw/2)-(sw/4))+"px";
    pictureView.style.top = (((sh/2)-(sw/2))-10)+"px";
    pictureView.style.width = (sw/2)+"px";
    pictureView.style.height = (sw/2)+"px";
    //pictureView.style.border = "1px solid #fff";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

    mapView = document.createElement("canvas");
    mapView.style.position = "absolute";
    mapView.width = (sw/2);
    mapView.height = (sw/2); 
    mapView.style.left = ((sw/2)-(sw/4))+"px";
    mapView.style.top = ((sh/2)+10)+"px";
    mapView.style.width = (sw/2)+"px";
    mapView.style.height = (sw/2)+"px";
    mapView.style.zIndex = "15";
    document.body.appendChild(mapView);

    mapView.onclick = function() {
        mapView.style.display = "none";
        websocketBot.requestActiveMap();
    };

    buttonLeftView = document.createElement("button");
    buttonLeftView.style.position = "absolute";
    buttonLeftView.style.color = "#000";
    buttonLeftView.innerText = "left";
    buttonLeftView.style.fontFamily = "Khand";
    buttonLeftView.style.fontSize = "15px";
    buttonLeftView.style.left = ((sw/2)-165)+"px";
    buttonLeftView.style.top = (sh-35)+"px";
    buttonLeftView.style.width = (75)+"px";
    buttonLeftView.style.height = (25)+"px";
    buttonLeftView.style.border = "1px solid white";
    buttonLeftView.style.borderRadius = "25px";
    buttonLeftView.style.zIndex = "15";
    document.body.appendChild(buttonLeftView);

    buttonLeftView.onclick = function() {
        var step_x = position.x-1;
        var step_y = position.y;

        var hitWall = checkMove(step_x, step_y);
        if (!hitWall) {
            position.x = step_x;
            position.y = step_y;
            websocketBot.sendPosition();
        };
    };

    buttonRightView = document.createElement("button");
    buttonRightView.style.position = "absolute";
    buttonRightView.style.color = "#000";
    buttonRightView.innerText = "right";
    buttonRightView.style.fontFamily = "Khand";
    buttonRightView.style.fontSize = "15px";
    buttonRightView.style.left = ((sw/2)-80)+"px";
    buttonRightView.style.top = (sh-35)+"px";
    buttonRightView.style.width = (75)+"px";
    buttonRightView.style.height = (25)+"px";
    buttonRightView.style.border = "1px solid white";
    buttonRightView.style.borderRadius = "25px";
    buttonRightView.style.zIndex = "15";
    document.body.appendChild(buttonRightView);

    buttonRightView.onclick = function() {
        var step_x = position.x+1;
        var step_y = position.y;

        var hitWall = checkMove(step_x, step_y);
        if (!hitWall) {
            position.x = step_x;
            position.y = step_y;
            websocketBot.sendPosition();
        };
    };

    buttonUpView = document.createElement("button");
    buttonUpView.style.position = "absolute";
    buttonUpView.style.color = "#000";
    buttonUpView.innerText = "up";
    buttonUpView.style.fontFamily = "Khand";
    buttonUpView.style.fontSize = "15px";
    buttonUpView.style.left = ((sw/2)+5)+"px";
    buttonUpView.style.top = (sh-35)+"px";
    buttonUpView.style.width = (75)+"px";
    buttonUpView.style.height = (25)+"px";
    buttonUpView.style.border = "1px solid white";
    buttonUpView.style.borderRadius = "25px";
    buttonUpView.style.zIndex = "15";
    document.body.appendChild(buttonUpView);

    buttonUpView.onclick = function() {
        var step_x = position.x;
        var step_y = position.y-1;

        var hitWall = checkMove(step_x, step_y);
        if (!hitWall) {
            position.x = step_x;
            position.y = step_y;
            websocketBot.sendPosition();
        };
    };

    buttonDownView = document.createElement("button");
    buttonDownView.style.position = "absolute";
    buttonDownView.style.color = "#000";
    buttonDownView.innerText = "down";
    buttonDownView.style.fontFamily = "Khand";
    buttonDownView.style.fontSize = "15px";
    buttonDownView.style.left = ((sw/2)+90)+"px";
    buttonDownView.style.top = (sh-35)+"px";
    buttonDownView.style.width = (75)+"px";
    buttonDownView.style.height = (25)+"px";
    buttonDownView.style.border = "1px solid white";
    buttonDownView.style.borderRadius = "25px";
    buttonDownView.style.zIndex = "15";
    document.body.appendChild(buttonDownView);

    buttonDownView.onclick = function() {
        var step_x = position.x;
        var step_y = position.y+1;

        var hitWall = checkMove(step_x, step_y);
        if (!hitWall) {
            position.x = step_x;
            position.y = step_y;
            websocketBot.sendPosition();
        };
    };

    websocketBot.attachMessageHandler();
    createMap();

    drawImage();
    animate();
});

var websocketBot = {
    messageRequested: false,
    lastUpdate: 0,
    updateActiveMap: function() {
        ws.send("PAPER|"+playerId+"|map-response|"+
        JSON.stringify(maze));
    },
    requestActiveMap: function() {
        ws.send("PAPER|"+playerId+"|map-request");
    },
    sendPosition: function(value) {
        var obj = {
            timestamp: new Date().getTime(),
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

var checkMove = function(step_x, step_y) {
    var hitWall = false;
    if (step_x < 0) hitWall = true;
    if (step_y < 0) hitWall = true;
    if (step_x > (mazeSize-1)) hitWall = true;
    if (step_y > (mazeSize-1)) hitWall = true;

    if (step_x == Math.floor((mazeSize/2)) &&
    step_y == (mazeSize-1))
    hitWall = false;

    if (step_x == Math.floor((mazeSize/2)) &&
    step_y == 0)  {
        createMap();
        websocketBot.sendPosition();
        websocketBot.updateActiveMap();
        return true;
    }

    if (hitWall) return true;

    var { x, y } = position;

    var n0 = (y*mazeSize)+x;
    var obj0 = maze[n0];

    var n1 = (step_y*mazeSize)+step_x;
    var obj1 = maze[n1];

    if (obj0.left == 1 && step_x < x) hitWall = true;
    if (obj0.top == 1 && step_y < y) hitWall = true;
    if (obj0.right == 1 && step_x > x) hitWall = true;
    if (obj0.down == 1 && step_y > y) hitWall = true;

    if (obj1.left == 1 && step_x > x) hitWall = true;
    if (obj1.top == 1 && step_y > y) hitWall = true;
    if (obj1.right == 1 && step_x < x) hitWall = true;
    if (obj1.down == 1 && step_y < y) hitWall = true;

    if (!hitWall) {
        path.push({ x: step_x, y: step_y });
    }

    return hitWall;
};

var path = [];
var position = { x: Math.floor((mazeSize/2)), y: (mazeSize-1) };
var mazeSize = 11;

var path = [];
var createMap = function() {
    path = [];
    maze = [];
    for (var y = 0; y < (mazeSize); y++) {
    for (var x = 0; x < (mazeSize); x++) {
        var obj = {
            left: Math.floor(Math.random()*2),
            top: Math.floor(Math.random()*2),
            right: Math.floor(Math.random()*2),
            down: Math.floor(Math.random()*2),
            set: function(a, b, c, d) {
                this.left = a == -1 ? this.left : a;
                this.top = b == -1 ? this.top : b;
                this.right = c == -1 ? this.right : c;
                this.down = d == -1 ? this.down : d;
            }
        };

        if (x == 0 && y == (mazeSize-1)) obj.set(1, -1, -1, 1);
        else if (x == 0 && y > 0) obj.set(1, -1, -1, -1);
        else if (x == 0 && y == 0) obj.set(1, 1, -1, -1);
        else if (x < (mazeSize-1) && y == 0) obj.set(-1, 1, -1, -1);
        else if (x == (mazeSize-1) && y == 0) obj.set(-1, 1, 1, -1);
        else if (x == (mazeSize-1) && y < (mazeSize-1)) 
        obj.set(-1, -1, 1, -1);
        else if (x == (mazeSize-1) && y == (mazeSize-1)) 
        obj.set(-1, -1, 1, 1);
        else if (x > 0 && y == (mazeSize-1)) obj.set(-1, -1, -1, 1);

        if (x == Math.floor((mazeSize/2)) && y == (mazeSize-1)) 
        obj.set(0, 0, 0, 0);

        if (x == Math.floor((mazeSize/2)) && y == 0) 
        obj.set(0, 0, 0, 0);

        var n = (y*mazeSize)+x;
        maze[n] = obj;
    }
    };

    var x = Math.floor((mazeSize/2));
    var y = (mazeSize-1);
    var step_x = Math.floor((mazeSize/2));
    var step_y = (mazeSize-1);

    path.push({ x: x, y: y });

    //setInterval(function() {
    while (step_x != Math.floor((mazeSize/2)) || step_y != 0) {
        var rnd = Math.floor(Math.random()*2);
        step_x = x + (rnd == 0 ? 
        (-1+Math.floor(Math.random()*3)) : 0);
        step_y = y + (rnd == 1 ? 
        -1 : 0);

        var hitWall = false;
        if (step_x == 0 && step_y == (mazeSize-1)) hitWall = true;
        else if (step_x == 0 && step_y > 0) hitWall = true;
        else if (step_x == 0 && y == step_y) hitWall = true;
        else if (step_x < (mazeSize-1) && step_y == 0) hitWall = true;
        else if (step_x == (mazeSize-1) && step_y == 0) 
        hitWall = true;
        else if (step_x == (mazeSize-1) && step_y < (mazeSize-1)) 
        hitWall = true;
        else if (step_x == (mazeSize-1) && step_y == (mazeSize-1)) 
        hitWall = true;
        else if (step_x > 0 && step_y == (mazeSize-1)) hitWall = true;

        if (!hitWall) {
            x = step_x;
            y = step_y;

            position.x = x;
            position.y = y;

            var n = (y*mazeSize)+x;
            var obj = maze[n];
            obj.set(0, 0, 0, 0);
        }
    }

    position.x = Math.floor((mazeSize/2));
    position.y = (mazeSize-1);

    mapView.style.display = "initial";
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
    var mapCtx = mapView.getContext("2d");
    mapCtx.imageSmoothingEnabled = false;

    mapCtx.clearRect(0, 0, sw/2, sw/2);

    mapCtx.lineWidth = 3;
    mapCtx.strokeStyle = "#fff";

    for (var y = 0; y < (mazeSize); y++) {
    for (var x = 0; x < (mazeSize); x++) {
         var n = (y*mazeSize)+x;
         var obj = maze[n];

         if (obj.left) {
             mapCtx.beginPath();
             mapCtx.moveTo((x*((sw/2)/mazeSize)),
             ((y+1)*((sw/2)/mazeSize)));
             mapCtx.lineTo((x*((sw/2)/mazeSize)),
             (y*((sw/2)/mazeSize)));
             mapCtx.stroke();
         }
         if (obj.top) {
             mapCtx.beginPath();
             mapCtx.moveTo((x*((sw/2)/mazeSize)),
             (y*((sw/2)/mazeSize)));
             mapCtx.lineTo(((x+1)*((sw/2)/mazeSize)),
             (y*((sw/2)/mazeSize)));
             mapCtx.stroke();
         }
         if (obj.right) {
             mapCtx.beginPath();
             mapCtx.moveTo(((x+1)*((sw/2)/mazeSize)),
             ((y+1)*((sw/2)/mazeSize)));
             mapCtx.lineTo(((x+1)*((sw/2)/mazeSize)),
             (y*((sw/2)/mazeSize)));
             mapCtx.stroke();
         }
         if (obj.down) {
             mapCtx.beginPath();
             mapCtx.moveTo((x*((sw/2)/mazeSize)),
             ((y+1)*((sw/2)/mazeSize)));
             mapCtx.lineTo(((x+1)*((sw/2)/mazeSize)),
             ((y+1)*((sw/2)/mazeSize)));
             mapCtx.stroke();
         }
    }
    }

    mapCtx.lineWidth = 1;
    mapCtx.strokeStyle = "#5f5";

    mapCtx.beginPath();
    if (path.length > 0) {
        mapCtx.moveTo(path[0].x*((sw/2)/mazeSize)+
        (((sw/2)/mazeSize)/2), 
        path[0].y*((sw/2)/mazeSize)+
        (((sw/2)/mazeSize)/2));
        for (var n = 1; n < path.length; n++) {
            mapCtx.lineTo(path[n].x*((sw/2)/mazeSize)+
            (((sw/2)/mazeSize)/2), 
            path[n].y*((sw/2)/mazeSize)+
            (((sw/2)/mazeSize)/2));
        }
        mapCtx.stroke();
    }

    mapCtx.fillStyle = "#5f5";

    mapCtx.beginPath();
    mapCtx.arc(position.x*((sw/2)/mazeSize)+
    (((sw/2)/mazeSize)/2), 
    position.y*((sw/2)/mazeSize)+
    (((sw/2)/mazeSize)/2), ((sw/8)/mazeSize), 
    0, (Math.PI*2));
    mapCtx.fill();

    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, sw/2, sw/2);

    ctx.drawImage(mapView, 
    position.x*((sw/2)/mazeSize), 
    position.y*((sw/2)/mazeSize), 
    ((sw/2)/mazeSize), ((sw/2)/mazeSize),
    0, 0, (sw/2), (sw/2));
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