"use strict";

var gameShow = {};
gameShow.spongeBobImage = new Image();
gameShow.spongeBobImage.src = "images/spongebob.png";
gameShow.nextQuoteSound;
gameShow.quoteLengthForWrapAround = 70;
gameShow.quoteBubble = {};
gameShow.quoteBubble.x = 50;
gameShow.quoteBubble.y = 440;
gameShow.quoteBubble.width = 1000;
gameShow.quoteBubble.height = 85;

var keyboard = {};
keyboard.ENTER = 13;
keyboard.enterKeyAction = {
    // what to do when the Enter key
    // is pressed; should be a function
    action : undefined,

    // for cleaner syntax (than keyboard.enterKeyAction.action = action;)
    // @param action the function to assign to this.action (i.e. what
    // to do when the Enter key is pressed)
    set : function(action) {
        this.action = action;
    },

    // @post this.action = undefined
    erase : function() {
        this.action = undefined;
    },

    // @post event handler has been set up so that this.action, if
    // it's defined, will be called when user presses Enter
    // (this.action will be erased before the action function is
    // called)
    setUpEventHandler : function() {
        $(document).keydown(function(e) {
            if (e.which === keyboard.ENTER) {
                // Note that in the handler, the object 'this'
                // refers to the document
                if (keyboard.enterKeyAction.action !== undefined) {
                    // Erase action before calling it, but do so
                    // in a way so that the action to do isn't
                    // inadvertently erased first
                    var act = keyboard.enterKeyAction.action;
                    keyboard.enterKeyAction.erase();
                    act();
                }
            }
        });
    }
};

var ERROR_MESSAGES = {};
ERROR_MESSAGES.PARAMETER = "parameter error";

var quotesToDraw = {
    // quotes with lower indexes will be displayed first
    storage : [],

    /*
        @pre this.storage.length > 0
        @post things have been set up so that the user can go from
        one quote to the next by pressing Enter; after the last
        quote has been displayed, pressing Enter will result in
        the endCallback being called; this.storage.length = 0
        @hasTest no
        @param endCallback to call after all the quotes in this.storage
        have been displayed
        @returns nothing
        @throws nothing
    */
    deployQuoteChain : function(endCallback) {
        if (this.storage.length !== 0) {
            // more quotes to display; display the next one
            eraseQuoteBubbleText();
            drawQuoteText(this.storage.shift(), function() {
                quotesToDraw.deployQuoteChain(endCallback);
            });
        }
        else {
            // no more quotes to call
            endCallback();
        }
    }
};

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

// @post title screen has been set up with prompt for user
function drawTitleScreenText() {
    var canvas = document.getElementById("title-screen-canvas");
    var ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter to play", canvas.width / 2,
        canvas.height / 2);
}

// This is currently a trivial function made for the purpose of
// testing.
function drawTestGameText() {
    var canvas = document.getElementById("money-display-canvas");
    var ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Welcome to the game", canvas.width / 2,
        canvas.height / 2);
}

// @post canvas that shows a speaker has been erased
function eraseSpeaker() {
    var canvas = document.getElementById("speaker-canvas");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// @post SpongeBob has been drawn so that he looks like he's
// speaking to you
function drawSpongebob() {
    var canvas = document.getElementById("speaker-canvas");
    var ctx = canvas.getContext('2d');

    ctx.drawImage(gameShow.spongeBobImage, 600, 50);
}

// @post quote bubble has been drawn on its canvas
function drawQuoteBubble() {
    var canvas = document.getElementById('quote-bubble-canvas');
    var ctx = canvas.getContext('2d');
    var bubble = gameShow.quoteBubble;
    ctx.fillStyle = "rgba(240, 240, 240, 0.9)";
    ctx.fillRect(bubble.x, bubble.y, bubble.width, bubble.height);
}

// @post text in the quote bubble has been cleared
function eraseQuoteBubbleText() {
    var canvas = document.getElementById('quote-text-canvas');
    var ctx = canvas.getContext('2d');
    var bubble = gameShow.quoteBubble;

    // Note that this clears the text on the bubble, not the
    // bubble itself, because of the canvas we're affecting
    ctx.clearRect(bubble.x, bubble.y, bubble.width, bubble.height);
}

/*
    @pre canvases are set up
    @post old speaker (if any) has been erased;
    correct speaker has been drawn and endCallback has
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
function drawNewSpeaker(speakerName, endCallback) {
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
        keyboard.enterKeyAction.set(function() {
            gameShow.nextQuoteSound.play();
            endCallback();
        });
    }
    else {
        keyboard.enterKeyAction.set(function() {
            gameShow.nextQuoteSound.play();
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
    var bubble = gameShow.quoteBubble;
    var x = bubble.x + 25;
    var y = bubble.y + 35;

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

function removeTitleScreen() {
    $("#title-screen-canvas").removeClass('show');
}

function talkAboutMoneyDisplay() {
    // move speaker canvas out of the way so money display can
    // be seen
    $("#speaker-canvas").removeClass('show');
}

function drawMoneyDisplay() {
    var canvas = document.getElementById("money-display-canvas");

    // Set up the drawing of the bars
    var barContext = canvas.getContext('2d');
    barContext.fillStyle = "#FFDF00";
    var barWidth = 400;
    var horizontalPadding = (1100 - (barWidth * 2)) / 3; // this makes
                                // equal horizontal space between bars
    var barHeight = 60;
    var verticalPadding = 20; // space between bars on display
    var x = horizontalPadding;
    var y = verticalPadding;

    // Set up the drawing of the dollar sign on each bar
    // var textContext = canvas.getContext('2d');
    // var textPadding = 10;
    // textContext.font = (barHeight - (textPadding * 2)) + "px Arial";
    // // textContext.fillStyle = "black";

    for (var i = 0; i < 10; ++i) {
        // draw the bar
        barContext.fillRect(x, y, barWidth, barHeight);

        // put the dollar sign at the left of the bar
        // textContext.fillText('$', x + textPadding, y + textPadding);

        y += (barHeight + verticalPadding);

        if (i === 4) {
            // five bars have been drawn; go to next column
            x += (barWidth + horizontalPadding);
            y = verticalPadding;
        }
    }
}

function setUpGame() {
    removeTitleScreen();
    setUpQuoteBubble();
    drawMoneyDisplay();

    // Host's introductory text
    drawNewSpeaker("SpongeBob", function() {
        quotesToDraw.storage.push("Welcome to the game. " +
            "Press Enter to go to the next quote.");
        quotesToDraw.storage.push("I'm your host, " +
            "SpongeBob Squarepants.");
        quotesToDraw.storage.push("Get ready to play this " +
            "combination of game shows.");
        quotesToDraw.deployQuoteChain(function() {
            talkAboutMoneyDisplay();
        });
    });
}

$(document).ready(function() {
    if (!isUnitTesting()) {
        drawTitleScreenText();
        keyboard.enterKeyAction.setUpEventHandler();
        keyboard.enterKeyAction.set(setUpGame);
    }
});