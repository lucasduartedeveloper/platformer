var createRectangle = function(x, y, width, height, label) {
    var body = 
    Bodies.rectangle(x, y, width, height, { isStatic: true,
    label: label,
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

    return body;
};

var createRoom0 = function() {
    var table = 
    createRectangle((sw/2), (sh/2), (sw/2), 20, "ground");

    var table1 = 
    createRectangle(
    sw-(sw/4), (sh/2)+((sh/4)/2), (sw/2), 20, "ground");

    var ceiling = 
    createRectangle((sw/4), -140, (sw/2), 300, "ceiling");

    var ceilingB = 
    createRectangle((sw-(sw/4)), -140, (sw/2), 300, "ceiling");

    var wallA = 
    createRectangle(-140, (sh/4), 300, ((sh/2)), "wallA");

    var wallA_lower = 
    createRectangle(-140, sh-((sh/4)), 300, ((sh/2)), "wallA");

    var wallB = 
    createRectangle(sw+140, (sh/4), 300, ((sh/2)), "wallB");

    var wallB_lower = 
    createRectangle(sw+140, sh-((sh/4)), 300, ((sh/2)), "wallA");

    var ground = 
    createRectangle((sw/4), sh-(sh/4)+140, (sw/2), 300, 
    "ground");

    var groundB = 
    createRectangle((sw-(sw/4)), sh-(sh/4)+140, (sw/2), 300,
    "ground");

    var cornerA = 
    createRectangle(-150, (sh+150), 300, 300, "cornerA");

    var cornerB = 
    createRectangle(-150, -150, 300, 300, "cornerB");

    var cornerC = 
    createRectangle((sw+150), -150, 300, 300, "cornerC");

    var cornerD = 
    createRectangle((sw+150), (sh+150), 300, 300, "cornerD");

    return [
        table, table1, ceiling, wallA, wallB, ground, 
        ceilingB, wallA_lower, wallB_lower, groundB, 
        cornerA, cornerB, cornerC, cornerD
    ];
};