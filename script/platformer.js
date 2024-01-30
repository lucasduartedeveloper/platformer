var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;

var audioBot = true;
var playerId = new Date().getTime();

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

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
    pictureView.style.background = "#fff";
    pictureView.width = (sw);
    pictureView.height = (sh); 
    pictureView.style.left = (0)+"px";
    pictureView.style.top = (0)+"px";
    pictureView.style.width = (sw)+"px";
    pictureView.style.height = (sh)+"px";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

    matterJsView = document.createElement("canvas");
    matterJsView.style.position = "absolute";
    matterJsView.style.background = "#fff";
    matterJsView.width = sw;
    matterJsView.height = sh; 
    matterJsView.style.left = (0)+"px";
    matterJsView.style.top = (0)+"px";
    matterJsView.style.width = (sw)+"px";
    matterJsView.style.height = (sh)+"px";
    matterJsView.style.zIndex = "15";
    document.body.appendChild(matterJsView);

    analogView = document.createElement("button");
    analogView.style.position = "absolute";
    analogView.style.color = "#000";
    analogView.style.fontFamily = "Khand";
    analogView.style.fontSize = "15px";
    analogView.style.left = (sw-110)+"px";
    analogView.style.top = (sh-110)+"px";
    analogView.style.width = (100)+"px";
    analogView.style.height = (100)+"px";
    analogView.style.border = "1px solid white";
    analogView.style.borderRadius = "50%";
    analogView.style.zIndex = "15";
    document.body.appendChild(analogView);

    sprite0 = {
        positionNo: 0,
        position: 1,
        direction: 2,
        lastPosition: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        canJump: false
    };

    sprite1 = {
        positionNo: 0,
        position: 1,
        direction: 2,
        lastPosition: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 }
    };

    startX = 0;
    startY = 0;
    moveX = 0;
    moveY = 0;

    analogView.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    };

    analogView.ontouchmove = function(e) {
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;

        if (!sprite0.canJump) return;

        var position = { ...body0.position };
        var velocity = { ...body0.velocity };

        var v = {
            x: moveX-startX,
            y: 0
        }
        var vn = Math.normalize(v, 1);

        var dir = 0;
        if (vn.x < 0) dir = 1;
        else dir = 2;

        sprite0.direction = dir;

        sprite0.velocity = vn;
    };

    analogView.ontouchend = function() {
        var v = { x: 0, y: 0 };
        sprite0.velocity = v;

        sprite0.position = 1;
        sprite0.positionNo = 0;
    };

    jumpView = document.createElement("button");
    jumpView.style.position = "absolute";
    jumpView.style.background = "rgba(255, 255, 255, 0)";
    jumpView.style.color = "#000";
    jumpView.style.fontFamily = "Khand";
    jumpView.style.fontSize = "15px";
    jumpView.style.left = (10)+"px";
    jumpView.style.top = (sh-110)+"px";
    jumpView.style.width = (100)+"px";
    jumpView.style.height = (100)+"px";
    jumpView.style.border = "1px solid white";
    jumpView.style.borderRadius = "50%";
    jumpView.style.zIndex = "15";
    document.body.appendChild(jumpView);

    jumpView.ontouchstart = function(e) {
        if (!sprite0.canJump) return;
        sfxPool.play("audio/jump-sfx.wav");

        var velocity = { ...body0.velocity };

        var v = {
            x: sprite0.velocity.x,
            y: -11
        };

        sprite0.canJump = false;
        Body.setVelocity(body0, {
            x: velocity.x + v.x,
            y: velocity.y + v.y
        });
    };

    shootView = document.createElement("button");
    shootView.style.position = "absolute";
    shootView.style.color = "#000";
    shootView.style.fontFamily = "Khand";
    shootView.style.fontSize = "15px";
    shootView.style.left = (sw-60)+"px";
    shootView.style.top = (sh-170)+"px";
    shootView.style.width = (50)+"px";
    shootView.style.height = (50)+"px";
    shootView.style.border = "1px solid white";
    shootView.style.borderRadius = "50%";
    shootView.style.zIndex = "15";
    document.body.appendChild(shootView);

    isAttacking = false;
    attackInterval = 0;
    shootView.onclick = function() {
        if (isAttacking) return;
        isAttacking = true;

        sfxPool.play("audio/weapon-sfx-0.wav");
        Body.applyForce(body0_weapon1, 
            body0_weapon1.position, {
            x: (sprite0.direction == 1 ? -1 : 1),
            y: 0
        });

        isAttacking = false;
    };

    drawImage();
    animate();

    loadImages();

    matterJs();
});

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

var img_list = [
    "img/spritesheet-0.png",
    "img/spritesheet-1.png",
    "img/spritesheet-2.png",
    "img/weapon-0.png",
    "img/bus-sprite.png"
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
                //callback();
            }
        };
        var rnd = Math.random();
        img.src = img_list[n].includes("img") ? 
        img_list[n]+"?f="+rnd : 
        img_list[n];
    }
};

var gridSize = 10;

var drawImage = 
    function(angle=0, color="#000", gridColor="#333") {
    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, sw, sh);

    ctx.save();
    ctx.translate((sw/2), (sh/2));
    ctx.rotate(angle);
    ctx.translate(-(sw/2), -(sh/2));

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, sw, sh);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (var y = 0; y < Math.floor((sh/(sw/gridSize))); y++) {
        ctx.beginPath();
        ctx.moveTo(0, y*(sw/gridSize));
        ctx.lineTo(sw, y*(sw/gridSize));
        ctx.stroke();
    }

    for (var x = 0; x <= gridSize; x++) {
        ctx.beginPath();
        ctx.moveTo(x*(sw/gridSize), 0);
        ctx.lineTo(x*(sw/gridSize), sh);
        ctx.stroke();
    }

    ctx.restore();
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
        //drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var createTexture = 
    function(no, line, column, position, direction, 
    width=25, height=25) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");

    if (!imagesLoaded) return null;

    var image = img_list[no];

    var tileWidth = image.naturalWidth/12;
    var tileHeight = image.naturalHeight/8;

    var lineWidth = (tileHeight*3);
    var columnWidth = (tileWidth*3);

    ctx.drawImage(image, 
    (column*columnWidth)+position*tileWidth, 
    (line*lineWidth)+direction*tileHeight, 
    tileWidth, tileHeight, 
    0, 0, width, height);

    return canvas.toDataURL();
};

var createTexture_item = 
    function(no, angle=0, width=25, height=25) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");

    if (!imagesLoaded) return null;

    var image = img_list[no];

    ctx.save();
    ctx.translate((width/2), (height/2));
    ctx.rotate(angle*(Math.PI/180));
    ctx.translate(-(width/2), -(height/2));

    ctx.drawImage(image, 0, 0, width, height);

    ctx.restore();

    return canvas.toDataURL();
};

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var Body = Matter.Body;

// create an engine
var engine = Engine.create();

var body0 = Bodies.rectangle(
(sw/4), sh-((sh/4)*1.5), 25, 25, { 
    label: "body0",
    render: {
         fillStyle: "#fff",
         strokeStyle: "#fff" }});

var body0_weapon = Bodies.circle(
(sw/2), sh-(sh/4), 5, { 
    isStatic: true, isSensor: true,
    label: "body0_weapon",
    render: {
         fillStyle: "#5f5",
         strokeStyle: "#5f5" }});

var body1 = Bodies.rectangle(
(sw/2), (sh/4), 25, 25, { 
    label: "body1",
    render: {
         fillStyle: "#fff",
         strokeStyle: "#fff" }});

var door = Bodies.rectangle(
(sw/2), (sh/2)-35, 
25, 50,
{ isSensor: true, isStatic: true,
    label: "door",
    render: {
         fillStyle: "#ccc",
         strokeStyle: "#ccc" }});

var room0 = createRoom0();

var bodyArr = [];

var addBody = function(pos, dir) {
    console.log(pos, dir);

    var obj = {
        body: Bodies.circle(pos.x, pos.y, 5, { 
            label: "block",
            frictionAir: 0,
            restitution: 0,
            render: {
                fillStyle: "#fff",
                strokeStyle: "#fff" }})
     };

     var velocity = {
         x: dir.x*(sw/gridSize),
         y: dir.y*(sw/gridSize)
     };
     Body.setVelocity(obj.body, velocity);

     bodyArr.push(obj);
     Composite.add(engine.world, [ obj.body ]);
};

var matterJs = function() {
    // create a renderer
    render = Render.create({
        engine: engine,
        canvas: matterJsView,
        options: {
            width: sw,
            height: sh,
            background: "transparent",
            wireframes: false
            //showPerformance: true
        }
    });

    //engine.timing.timeScale = 0.01;
    render.options.hasBounds = true;

    engine.world.gravity.y = 2;

    Matter.Events.on(engine, "collisionStart", function(event) { 
        pairs = [ ...event.pairs ];
        //console.log(event);

        for (var n = 0; n < pairs.length; n++) {
            console.log(pairs[n].bodyA.label, pairs[n].bodyB.label);

            if (pairs[n].bodyA.label.includes("body0") ||
                pairs[n].bodyB.label.includes("body0")) {
                if (pairs[n].bodyA.label.includes("ground") ||
                pairs[n].bodyB.label.includes("ground")) {
                    var velocity = { ...body0.velocity };
                    if (velocity.y > 0)
                    sprite0.canJump = true;
                }

                if (pairs[n].bodyA.label.includes("door") ||
                    pairs[n].bodyB.label.includes("door"))
                    createWorld();
            }
        }
    });

    Matter.Events.on(engine, "beforeUpdate", function() { 
        drawText(text, 15, sh-(sh/4)+17.5);

        var position = { ...body0.position };
        var velocity = { ...body0.velocity };

        var vn = sprite0.velocity;

        Body.setVelocity(body0, {
            x: Math.abs(velocity.x) < 5 ? (velocity.x+vn.x) : velocity.x,
            y: velocity.y+vn.y
        });

        var co = Math.abs(position.x-sprite0.lastPosition.x);
        var ca = Math.abs(position.y-sprite0.lastPosition.y);

        var hyp = Math.sqrt(
        Math.pow(co, 2)+
        Math.pow(ca, 2));

        var positionArr = [ 1, 0, 2, 0 ];
        if (hyp > 5) {
            var nextPosition = (sprite0.positionNo+1) < 4 ?
            (sprite0.positionNo+1) : 0;
            sprite0.positionNo = nextPosition;
            sprite0.position = positionArr[nextPosition];
            sprite0.lastPosition = position;
        }

        Body.setAngle(body0, 0);

        body0.render.sprite.texture = 
        sprite0.canJump ? 
        createTexture(0, 0, 0, sprite0.position, sprite0.direction) : 
        createTexture(0, 0, 0, 1, sprite0.direction);
        //body0.render.sprite.yOffset = 0.75;

        Body.setAngle(body1, 0);

        body1.render.sprite.texture = 
        createTexture(0, 1, 0, sprite1.position, sprite1.direction);
        //body1.render.sprite.yOffset = 0.75;.

        body0_weapon.render.sprite.texture = 
        createTexture_item(3);
    });

    // add buildings
    Composite.add(engine.world, 
    [ door, ...room0 ]);

    // add all of the bodies to the world
    Composite.add(engine.world, [ body0 ]); //, body1 ]);
    //Composite.add(engine.world, [ body0_aim ]);

    var mouse = Matter.Mouse.create(render.canvas);
    var mouseConstraint = 
    Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            render: { visible: true }
        }
    });
    render.mouse = mouse;

    // add soft global constraint
    var constraints = [ mouseConstraint ];
    Composite.add(engine.world, constraints);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
}

var defaultCategory = 0x0001, // for walls
    weaponCategory = 0x0002, // circles
    npcCategory = 0x0004; // yellow 

var createWorld = function() {
    Composite.remove(engine.world, 
    [ body0 ]);

    Composite.remove(engine.world, 
    [ door, ...room0 ]);

    var ground0 = Bodies.rectangle(
    (sw/2), sh-(sh/4)+140, 
    sw, 300,
    { isStatic: true,
    label: "ground",
    render: {
         fillStyle: "#cfb574",
         strokeStyle: "#cfb574" }});

    var c = { 
        x: sw+(sw/2),
        y: sh-(sh/4)+140
    };
    var polygon = [
        { x: c.x-(sw/2), y: c.y+150 },
        { x: c.x-(sw/2), y: c.y-150 },
        { x: c.x+(sw/2), y: c.y },
        { x: c.x+(sw/2), y: c.y+150 }
    ];

    var ground1 = Bodies.rectangle(
    c.x, c.y, sw, 300, 
    { isStatic: true,
    label: "ground",
    render: {
         fillStyle: "#cfb574",
         strokeStyle: "#cfb574" }});

    var c = { 
        x: (sw*2)+(sw/2),
        y: sh-(sh/4)+140
    };
    var polygon = [
        { x: c.x-(sw/2), y: c.y+150 },
        { x: c.x-(sw/2), y: c.y-150 },
        { x: c.x+(sw/2), y: c.y },
        { x: c.x+(sw/2), y: c.y+150 }
    ];

    var ground2 = Bodies.rectangle(
    c.x, c.y, sw, 300, 
    { isStatic: true,
    label: "ground",
    render: {
         fillStyle: "#cfb574",
         strokeStyle: "#cfb574" }});

    var r = (720/411);
    var scale = (150/720);
    var height = (150/r);
    var bus = Bodies.rectangle(
    (sw*3)-75, sh-(sh/4)-(height/2)-10, sw, 300, 
    { isStatic: true, isSensor: true,
    label: "ground",
    render: {
         fillStyle: "#cfb574",
         strokeStyle: "#cfb574" }});

    bus.render.sprite.texture = "img/bus-sprite.png";
    bus.render.sprite.xScale = scale;
    bus.render.sprite.yScale = scale;

    Body.setPosition(door, {
        x: (sw/4),
        y: sh-(sh/4)-35
    });

    Body.setPosition(body0, {
        x: (sw/4),
        y: sh-((sh/4)*1.5)
    });

    Matter.Events.off(engine,  "collisionStart");
    Matter.Events.on(engine, "collisionStart", function(event) { 
        pairs = [ ...event.pairs ];
        //console.log(event);

        for (var n = 0; n < pairs.length; n++) {
            console.log(pairs[n].bodyA.label, pairs[n].bodyB.label);

            if (pairs[n].bodyA.label.includes("body0") ||
                pairs[n].bodyB.label.includes("body0")) {
                if (pairs[n].bodyA.label.includes("ground") ||
                    pairs[n].bodyB.label.includes("ground")) {
                    var velocity = { ...body0.velocity };
                    if (velocity.y > 0)
                    sprite0.canJump = true;
                }
            }

            if (pairs[n].bodyA.label.includes("body0_weapon") ||
                pairs[n].bodyB.label.includes("body0_weapon")) {
                if (pairs[n].bodyA.label.includes("monster") ||
                    pairs[n].bodyB.label.includes("monster")) {
                    var monster = 
                    pairs[n].bodyA.label.includes("monster") ? 
                    pairs[n].bodyA : pairs[n].bodyB;
                    Composite.remove(engine.world, [ monster ]);
                }
            }
        }
    });

    Matter.Events.off(engine,  "beforeUpdate");
    Matter.Events.on(engine, "beforeUpdate", function() { 
        if (body0.position.x > (sw*2))
        drawText("THE END", (sw/2), (sh/4), true);

        var position = { ...body0.position };
        var velocity = { ...body0.velocity };

        var c = {
            x: position.x,
            y: position.y
        };
        render.bounds.min.x = (c.x-(sw/2));
        render.bounds.max.x = (c.x+(sw/2));

        var vn = sprite0.velocity;

        Body.setVelocity(body0, {
            x: Math.abs(velocity.x) < 5 ? (velocity.x+vn.x) : velocity.x,
            y: velocity.y+vn.y
        });

        var co = Math.abs(position.x-sprite0.lastPosition.x);
        var ca = Math.abs(position.y-sprite0.lastPosition.y);

        var hyp = Math.sqrt(
        Math.pow(co, 2)+
        Math.pow(ca, 2));

        var positionArr = [ 1, 0, 2, 0 ];
        if (hyp > 5) {
            var nextPosition = (sprite0.positionNo+1) < 4 ?
            (sprite0.positionNo+1) : 0;
            sprite0.positionNo = nextPosition;
            sprite0.position = positionArr[nextPosition];
            sprite0.lastPosition = position;
        }

        Body.setAngle(body0, 0);

        body0.render.sprite.texture = 
        sprite0.canJump ? 
        createTexture(0, 0, 0, sprite0.position, sprite0.direction) : 
        createTexture(0, 0, 0, 1, sprite0.direction);
        //body0.render.sprite.yOffset = 0.75;

        Body.setAngle(body1, 0);

        body1.render.sprite.texture = 
        createTexture(0, 1, 0, sprite1.position, sprite1.direction);
        //body1.render.sprite.yOffset = 0.75;

        body0_weapon.render.sprite.texture = 
        createTexture_item(3);
    });

    drawImage(0, "lightblue", "#99f");

    var body2 = Bodies.rectangle(
    (sw/2), sh-((sh/4)*1.5), 50, 50, { 
    label: "body0",
    render: {
         fillStyle: "#fff",
         strokeStyle: "#fff" }});

    body2.render.sprite.texture = createTexture(1, 1, 2, 1, 2, 50, 50);

    var body3 = Bodies.rectangle(
    sw+(sw/2), sh-((sh/4)*1.5), 25, 25, { 
    label: "monster",
    render: {
         fillStyle: "#fff",
         strokeStyle: "#fff" }});

    body3.render.sprite.texture = createTexture(2, 0, 1, 1, 1);

    var c = { 
        x: (sw/4),
        y: sh-(sh/4)-35
    };
    var polygon = [
        { x: c.x-75, y: c.y+25 },
        { x: c.x, y: c.y-(getHeight(150)-25) },
        { x: c.x, y: c.y-(getHeight(150)-25) },
        { x: c.x+75, y: c.y+25 }
    ];

    var pyramid0 = Bodies.fromVertices(
    c.x, c.y, polygon, 
    { isStatic: true, isSensor: true,
    label: "ground",
    render: {
         fillStyle: "#997f42",
         strokeStyle: "#997f42" }});

    Composite.add(engine.world, 
    [ pyramid0, door, ground0, ground1, ground2, bus ]);

    Composite.add(engine.world, 
    [ body0, body2, body3 ]);

    body0_weapon1 = Bodies.circle(
    (sw/4), sh-((sh/4)*1.5)+(25/4)-25, 5, { 
    isSensor: true, 
    label: "body0_weapon",
    mass: 0,
    //density: 0,
    render: {
         fillStyle: "#5f5",
         strokeStyle: "#5f5" }});

    body0_weapon1.render.sprite.texture = 
    createTexture_item(3);

    var constraints = [
    Matter.Constraint.create({
        bodyA: body0,
        pointA: { x: 0, y: (25/4) },
        bodyB: body0_weapon1,
        pointB: { x: 0, y: (25/4) },
        stiffness: 0.1,
        render: {
            //anchors: false,
            strokeStyle: '#fff',
            lineWidth: 1,
            type: 'line'
        }
    })];

    Composite.add(engine.world, 
    [ body0_weapon1, ...constraints ]);
};

var text = "SEARCH THE BUS";
var drawText = function(text, x, y, centered=false) {
    var ctx = matterJsView.getContext("2d");

    ctx.font = "15px sans serif";
    ctx.textAlign = centered ? "center" : "left";
    ctx.textBaseline = "middle";

    var imgData = ctx.getImageData(x, y, 1, 1);
    var data = imgData.data;

    var brightness = (1/255)*
    ((data[0]+data[1]+data[2])/3);

    ctx.fillStyle = !centered && brightness < 0.5 ? "#fff" : "#000";
    ctx.fillText(text, x, y);
};

var getHeight = function(h) {
    var co = Math.sqrt(Math.pow(h, 2) - Math.pow(h/2, 2));
    return co;
};

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisivbilitychange";
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