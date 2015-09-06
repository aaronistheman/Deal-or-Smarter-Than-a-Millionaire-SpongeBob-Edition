var KEYCODES = {};
KEYCODES.ENTER = 13;

function drawMenuBackground() {
    // var canvas = document.getElementById("menu-background-canvas");
    // var ctx = canvas.getContext('2d');
    // ctx.beginPath();
    // ctx.moveTo(100, 50);
    // ctx.lineTo(300, 50);
    // ctx.stroke();
}

function drawMenuText() {
    var canvas = document.getElementById("menu-canvas");
    var ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter to play", canvas.width / 2,
        canvas.height / 2);
}

$(document).ready(function() {
    // drawMenuBackground();

    drawMenuText();

    // $(document).keydown(function(e) {
        // if (e.which === KEYCODES.ENTER)
            // window.location.href = "play.html";
    // });
});