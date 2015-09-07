"use strict";

var gameShow = {};
gameShow.spongeBobImage = new Image();
gameShow.spongeBobImage.src = "images/spongebob.png";
gameShow.nextQuoteSound;

var KEYCODES = {};
KEYCODES.ENTER = 13;

/*
    @pre none
    @post none
    @hasTest false
    @param none
    @returns true if currently unit testing, false otherwise
    @throws nothing
*/
function isUnitTesting() {
    return $("#qunit").length === 1;
}

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

    ctx.drawImage(gameShow.spongeBobImage, 600, 50);
}

function drawQuoteBubble() {
    var canvas = document.getElementById('quote-bubble-canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(240, 240, 240, 0.9)";
    ctx.fillRect(50, 325, 1000, 200);
}

// @post text in the quote bubble has been cleared
function eraseQuotes() {
    var canvas = document.getElementById('quote-text-canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(50, 325, 1000, 200);
}

/*
    @pre canvases are set up
    @post text has been drawn with appropriate wrap around and in quote
    bubble; endCallback is set up to be called when user wants;
    sound plays when user presses Enter on a quote
    @hasTest no
    @param text to draw
    @param lengthForWrapAround maximum number of characters for each
    row of quote
    @param endCallback to call after the user presses Enter (can
    be used for chaining quote bubbles together) (optional)
    @returns nothing
    @throws nothing
*/
function drawQuoteText(text, lengthForWrapAround, endCallback) {
    drawEachTextPiece(convertStringToArrayOfStrings(text,
        lengthForWrapAround));

    if (endCallback !== undefined) {
        // Allow the endCallback to be called
        $(document).keydown(function(e) {
            if (e.which === KEYCODES.ENTER) {
                $(document).off("keydown");
                gameShow.nextQuoteSound.play();
                endCallback();
            }
        });
    }
    else {
        $(document).keydown(function(e) {
            if (e.which === KEYCODES.ENTER) {
                $(document).off("keydown");
                gameShow.nextQuoteSound.play();
            }
        });
    }
}

/*
    @pre canvases are set up
    @post each string in textPieces has been drawn, with each string
    using its own row
    @hasTest no
    @param textPieces array of strings to draw on canvas
    @returns nothing
    @throws nothing
*/
function drawEachTextPiece(textPieces) {
    var canvas = document.getElementById('quote-text-canvas');
    var ctx = canvas.getContext('2d');
    var textPadding = 10;
    var fontSize = 30;
    ctx.font = fontSize + "px Arial";
    var x = 75;
    var y = 400;

    // Erase the quote bubble
    ctx.clearRect(50, 325, 1000, 200);

    // Draw the text
    for (var textIndex in textPieces) {
        ctx.fillText(textPieces[textIndex], x, y);
        y += (fontSize + textPadding);
    }
}

/*
    @pre none
    @post see @returns
    @hasTest yes
    @param string to split into pieces
    @param maxStringLength for each string in the array
    @returns array of pieces of the parameter string such that none
    of the pieces have a length greater than maxStringLength
    @throws nothing
*/
function convertStringToArrayOfStrings(string, maxStringLength) {
    var textPieces = [];
    var numberOfPieces = 0;
    // Check if the entire text has been made into text pieces
    while ((maxStringLength * numberOfPieces) < string.length) {
        var startIndex = (maxStringLength * numberOfPieces);
        var endIndex = startIndex + maxStringLength;
        textPieces.push(string.slice(startIndex, endIndex));
        numberOfPieces = textPieces.length;
    }
    return textPieces;
}

function setUpQuoteBubble() {
    gameShow.nextQuoteSound =
        document.getElementById('next-quote-sound');
    drawQuoteBubble();
}

function setUpGame() {
    $("#menu-canvas").removeClass('show');
    $(document).off("keydown");
    drawSpongebob();
    setUpQuoteBubble();
    drawQuoteText("Quote 1", 85, function() {
       drawQuoteText("Quote 2", 85, function() {
            alert("Finished the chain");
            eraseQuotes();
       });
    });
}

$(document).ready(function() {
    if (!isUnitTesting()) {
        drawMenuText();

        $(document).keydown(function(e) {
            if (e.which === KEYCODES.ENTER)
                setUpGame();
        });
    }
});