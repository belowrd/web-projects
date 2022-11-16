var canvas,
    ctx,
    flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

canvas.addEventListener(
    "mousemove",
    function (e) {
        findxy("move", e);
    },
    false
);
canvas.addEventListener(
    "mousedown",
    function (e) {
        findxy("down", e);
    },
    false
);
canvas.addEventListener(
    "mouseup",
    function (e) {
        findxy("up", e);
        var dataURL = canvas.toDataURL();
        document.getElementById("canvasimg").value = dataURL;
    },
    false
);
canvas.addEventListener(
    "mouseout",
    function (e) {
        findxy("out", e);
    },
    false
);

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();

    save();
}

function erase(e) {
    console.log("erase");
    e.preventDefault();
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").value = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
    if (res == "down") {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == "up" || res == "out") {
        flag = false;
    }
    if (res == "move") {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

document.getElementById("clear_canvas").addEventListener("click", (event) => {
    erase(event);
});
