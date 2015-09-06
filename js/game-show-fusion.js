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

function drawGameText() {
    var canvas = document.getElementById("choose-question-canvas");
    var ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Welcome to the game", canvas.width / 2,
        canvas.height / 2);
}

function drawSpongebob() {
    var canvas = document.getElementById("speaking-canvas");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, 180, 400);
}

function drawQuoteBubble() {
    var canvas = document.getElementById('quote-bubble-canvas');
    var ctx = canvas.getContext('2d');
    // ctx.fillStyle = "#eee";
    ctx.fillStyle = "rgba(240, 240, 240, 0.9)";
    ctx.fillRect(50, 325, 1000, 200);
}

$(document).ready(function() {
    // drawMenuBackground();

    drawMenuText();
    // drawGameText();
    drawSpongebob();
    drawQuoteBubble();

    $(document).keydown(function(e) {
        if (e.which === KEYCODES.ENTER) {
            $("#menu-canvas").removeClass('show');
            // start game
        }
    });
});