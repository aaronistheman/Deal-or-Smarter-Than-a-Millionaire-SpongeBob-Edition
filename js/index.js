function drawMenuBackground() {
    var canvas = document.getElementById("menu-background-canvas");
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(300, 50);
    ctx.stroke();
}

$(document).ready(function() {
    drawMenuBackground();
});