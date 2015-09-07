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
    bubble; endCallback is set up to be called when user wants
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
    NOTE: The following is an unfinished function that would have
    facilitated the chaining of quotes. I worked on it for about
    two or three hours before giving up, for I can't identify
    the problem. I don't think the benefits of the function are
    worth risking any more time figuring it out. Thus, immediately
    below is the function's contract, and with comments, I've
    divided the function into the two different implementations
    I tried.

    It would've been used like this:
    drawQuotes(["Quote 1", "Quote 2", "Quote 3", "Quote 4"], 85,
        function() {
            alert("Finished the chain");
        });

    @pre canvases are set up
    @post each quote in arrayOfQuotes has been set up in chain to
    appear in the quote bubble;
    endCallback has been set up to be called at end of chain
    @hasTest no
    @param arrayOfQuotes to set up to be drawn
    @param lengthForWrapAround maximum number of characters in each
    row of quote bubble
    @param finalCallback to call after the user has gone through the
    chain of quotes
    @returns nothing
    @throws nothing
*/
// function drawQuotes(arrayOfQuotes, lengthForWrapAround, finalCallback) {
    /*
        THIS WAS THE SECOND (PROBABLY BETTER) IMPLEMENTATION I TRIED.
    */
    // In reverse order, make the function for drawing each
    // quote so each can be chained together
    /*var endingCallbacks = [];
    for (var i = arrayOfQuotes.length - 1; i >= 0; --i) {
        var action = undefined;
        // var nextQuote = undefined;
        // var chainCallback = undefined;
        if ((i + 1) === arrayOfQuotes.length) {
            action = function() {
                gameShow.nextQuoteSound.play();
                eraseQuotes();
                finalCallback();
            };

            endingCallbacks.push({endCallback : action});

        }
        else {
            var object = {};
            object.nextQuote = arrayOfQuotes[i + 1];
            object.chainCallback =
                endingCallbacks[endingCallbacks.length - 1];
            object.endCallback = function() {
                alert(this);
                drawQuoteText(this.nextQuote,
                    lengthForWrapAround,
                    this.chainCallbackObject.endCallback);
                gameShow.nextQuoteSound.play();
            };

            endingCallbacks.push(object);

            // endingCallbacks.push({endCallback : action,
                // nextQuote : arrayOfQuotes[i + 1],
                // chainCallbackObject :
                    // endingCallbacks[endingCallbacks.length - 1]});
        }
    }

    // Start the chain
    drawQuoteText(arrayOfQuotes[0], lengthForWrapAround,
        endingCallbacks[endingCallbacks.length - 1].endCallback);
    */


    /*
        THIS WAS THE FIRST IMPLEMENTATION I TRIED.
    */
    // In reverse order, make the function for drawing each
    // quote so each can be chained together
    /* var endingCallbacks = [];
    for (var i = arrayOfQuotes.length - 1; i >= 0; --i) {
        // Check if this is the last quote
        if ((i + 1) === arrayOfQuotes.length)
            endingCallbacks.push(function() {
                gameShow.nextQuoteSound.play();
                eraseQuotes();
                endCallback();
            });
        else {
            // there is another quote to chain
            // alert("Quote: " + arrayOfQuotes[i + 1]);
            // alert("endCallbackIndex: " + (endingCallbacks.length - 1));
            // endingCallbacks.push(function() {
                // drawQuoteText(arrayOfQuotes[i + 1],
                    // lengthForWrapAround,
                    // endingCallbacks[endingCallbacks.length - 1]);
                // gameShow.nextQuoteSound.play();
            // });
            // endingCallbacks.push(function() {
                // drawQuoteText(arrayOfQuotes.slice(i + 1, 1),
                    // lengthForWrapAround,
                    // endingCallbacks.slice(
                        // endingCallbacks.length - 1, 1));
                // gameShow.nextQuoteSound.play();
            // });
        }

    // Start the chain
    // drawQuoteText(arrayOfQuotes[0], lengthForWrapAround,
        // endingCallbacks[endingCallbacks.length - 1]);
    */
// }

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