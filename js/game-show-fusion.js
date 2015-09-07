"use strict";

var gameShow = {};
gameShow.spongeBobImage = new Image();
gameShow.spongeBobImage.src = "images/spongebob.png";
gameShow.nextQuoteSound;
gameShow.quoteLengthForWrapAround = 85;

var KEYCODES = {};
KEYCODES.ENTER = 13;

var ERROR_MESSAGES = {};
ERROR_MESSAGES.PARAMETER = "parameter error";

/*
    @pre none
    @post errorMessage has been printed to console
    @hasTest yes
    @param errorMessage to print in the console
    @returns constant indicating the parameter error (mostly for unit
    testing purposes)
    @throws nothing
*/
function parameterError(errorMessage) {
    console.log(errorMessage);
    return ERROR_MESSAGES.PARAMETER;
}

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

// This is a trivial function that was made for the purpose of testing.
function drawMenuBackground() {
    // var canvas = document.getElementById("menu-background-canvas");
    // var ctx = canvas.getContext('2d');
    // ctx.beginPath();
    // ctx.moveTo(100, 50);
    // ctx.lineTo(300, 50);
    // ctx.stroke();
}

// @post menu has been set up with prompt for user
function drawMenuText() {
    var canvas = document.getElementById("menu-canvas");
    var ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter to play", canvas.width / 2,
        canvas.height / 2);
}

// This is currently a trivial function made for the purpose of
// testing.
function drawGameText() {
    var canvas = document.getElementById("choose-question-canvas");
    var ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Welcome to the game", canvas.width / 2,
        canvas.height / 2);
}

// @post canvas that shows a speaker has been erased
function eraseSpeaker() {
    var canvas = document.getElementById("speaking-canvas");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// @post SpongeBob has been drawn so that he looks like he's
// speaking to you
function drawSpongebob() {
    var canvas = document.getElementById("speaking-canvas");
    var ctx = canvas.getContext('2d');

    ctx.drawImage(gameShow.spongeBobImage, 600, 50);
}

// @post quote bubble has been drawn on its canvas
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
    @post correct speaker has been drawn and endCallback has
    been called; if invalid speaker, a message has been printed to
    the console, and a string indicating the error has been returned
    @hasTest no
    @param speakerName name of the person to draw; available options:
        -"SpongeBob" to draw SpongeBob
    @param endCallback to call after the drawing has finished (this
    can be used to chain quotes to the drawing of their speaker)
    @returns return value of parameterError() if invalid speakerName
    @throws (caught) exception if invalid speakerName
*/
function drawSpeaker(speakerName, endCallback) {
    eraseSpeaker();

    try {
        // Draw the correct speaker, or cause an error
        if (speakerName === "SpongeBob")
            drawSpongebob();
        else
            throw "Invalid parameter speakerName()";
    }
    catch(err) {
        return parameterError(err);
    }

    endCallback();
}

/*
    @pre canvases are set up
    @post text has been drawn with appropriate wrap around and in quote
    bubble; endCallback is set up to be called when user wants;
    sound plays when user presses Enter on a quote
    @hasTest no
    @param text to draw
    @param endCallback to call after the user presses Enter (can
    be used for chaining quote bubbles together) (optional)
    @returns nothing
    @throws nothing
*/
function drawQuoteText(text, endCallback) {
    drawEachTextPiece(convertStringToArrayOfStrings(text,
        gameShow.quoteLengthForWrapAround));

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

/*
    @pre quote bubble canvas and sound effect haven't been set up
    @post sound effect that plays when a quote bubble is done has
    been set up; quote bubble has been drawn on its canvas
*/
function setUpQuoteBubble() {
    gameShow.nextQuoteSound =
        document.getElementById('next-quote-sound');
    drawQuoteBubble();
}

function setUpGame() {
    $("#menu-canvas").removeClass('show');
    $(document).off("keydown");
    setUpQuoteBubble();
    drawSpeaker("SpongeBob", function() {
        drawQuoteText("Welcome to the game. Press Enter to go " +
            "to the next quote.",
            function() {
                drawQuoteText("I'm your host, SpongeBob Squarepants.",
                function() {
                    drawQuoteText("Get ready to play this combination " +
                        "of game shows.",
                        function() {
                            eraseQuotes();
                        });
                });
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