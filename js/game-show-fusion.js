"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

var gameShow = {};
gameShow.spongeBobImage = new Image();
gameShow.spongeBobImage.src = "images/spongebob.png";
gameShow.quoteLengthForWrapAround = 70;

gameShow.moneyAmounts = ['0.01', '50', '300', '750', '1,000',
    '10,000', '25,000', '100,000', '250,000', '500,000'];

gameShow.sounds = {};
gameShow.sounds.nextQuote;
gameShow.sounds.openingTheme;

gameShow.quoteBubble = {};
gameShow.quoteBubble.x = 50;
gameShow.quoteBubble.y = 440;
gameShow.quoteBubble.width = 1000;
gameShow.quoteBubble.height = 85;

gameShow.quotesToDraw = {
    // quotes with lower indexes will be displayed first
    storage : [],

    /*
        @param quote to put at end of storage
        @returns 'this' pointer (to allow chaining of calls
        (e.g. gameShow.quotesToDraw.add(...).add(...).add(...)
            .add(...).deployQuoteChain(...);))
    */
    add : function(quote) {
        this.storage.push(quote);
        return this;
    },

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
                gameShow.quotesToDraw.deployQuoteChain(endCallback);
            });
        }
        else {
            // no more quotes to call
            if (endCallback !== undefined)
                endCallback();
        }
    }
};

gameShow.canvasStack = new CanvasStack();

gameShow.moneyDisplay = new MoneyDisplay(
    CANVAS_IDS.MONEY_DISPLAY_BARS,
    CANVAS_IDS.MONEY_DISPLAY_TEXT,
    gameShow.moneyAmounts);

gameShow.briefcaseDisplay = new BriefcaseDisplay(
    CANVAS_IDS.BRIEFCASES,
    CANVAS_IDS.BRIEFCASES_TEXT,
    gameShow.moneyAmounts,
    7);

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

// For functions that toggle things (e.g. music)
var TOGGLE = {};
TOGGLE.ON = "on";
TOGGLE.OFF = "off";

// @post title screen has been set up with prompt for user
function drawTitleScreenText() {
    var canvas = document.getElementById(CANVAS_IDS.TITLE_SCREEN);
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
    var canvas = document.getElementById(CANVAS_IDS.SPEAKER);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// @post SpongeBob has been drawn so that he looks like he's
// speaking to you
function drawSpongebob() {
    var canvas = document.getElementById(CANVAS_IDS.SPEAKER);
    var ctx = canvas.getContext('2d');

    ctx.drawImage(gameShow.spongeBobImage, 600, 50);
}

// @post quote bubble has been drawn on its canvas
function drawQuoteBubble() {
    var canvas = document.getElementById(CANVAS_IDS.QUOTE_BUBBLE);
    var ctx = canvas.getContext('2d');
    var bubble = gameShow.quoteBubble;
    ctx.fillStyle = "rgba(240, 240, 240, 0.9)";
    ctx.fillRect(bubble.x, bubble.y, bubble.width, bubble.height);
}

// @post text in the quote bubble has been cleared
function eraseQuoteBubbleText() {
    var canvas = document.getElementById(CANVAS_IDS.QUOTE_TEXT);
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
            gameShow.sounds.nextQuote.play();
            endCallback();
        });
    }
    else {
        keyboard.enterKeyAction.set(function() {
            gameShow.sounds.nextQuote.play();
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
    var canvas = document.getElementById(CANVAS_IDS.QUOTE_TEXT);
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
    @post quote bubble has been drawn on its canvas
*/
function setUpQuoteBubble() {
    drawQuoteBubble();
}

function selectFirstCase() {
    gameShow.canvasStack.remove(CANVAS_IDS.MONEY_DISPLAY)
        .add(CANVAS_IDS.BRIEFCASE_DISPLAY);
}

function explainRules() {
    // move speaker canvas out of the way to show other things
    // while host is speaking
    gameShow.canvasStack.remove(CANVAS_IDS.SPEAKER)
        .add(CANVAS_IDS.BRIEFCASE_DISPLAY);

    gameShow.quotesToDraw.add("Shortly, you will pick a briefcase.")
        .deployQuoteChain(function() {
            gameShow.canvasStack.remove(CANVAS_IDS.BRIEFCASE_DISPLAY)
                .add(CANVAS_IDS.MONEY_DISPLAY);
            gameShow.quotesToDraw.add(
                "That case's value equals one of the values on the " +
                "money board, but you don't know which.")
            // change to display of questions
            .add("After that, you will try to answer ten questions.")
            // change back to money display
            .add("Answering a question correctly reveals a random " +
                "amount from the money board.")
            .add("But wait, a twist occurs after every two questions " +
                "and before your tenth question:")
            // show the banker
            .add("the banker will offer you some money.")
            .add("He wants your briefcase, but he doesn't want to pay " +
                "too much for it.")
            .add("You can say 'Deal' and leave the game with that money,")
            .add("or you can say 'No Deal' and hope for an even greater " +
                "amount of money.")
            // show SpongeBob
            .add("If you miss a question, you leave with nothing.")
            .add("If you get past all ten questions, you can either take " +
                "your case home,")
            // show million dollar question screen
            .add("or you can bet it all and try to answer the million " +
                "dollar question.")
            .add("You do have help, but I haven't been programmed " +
                "to describe how.")
            .deployQuoteChain(selectFirstCase);
        });
}

function setUpGame() {
    removeTitleScreen();
    setUpQuoteBubble();
    gameShow.moneyDisplay.setUp();
    gameShow.briefcaseDisplay.draw();

    // Show the appropriate canvases
    gameShow.canvasStack.add(CANVAS_IDS.SPEAKER_QUOTE);

    // Host's introductory text
    drawNewSpeaker("SpongeBob", function() {
        gameShow.quotesToDraw.add("Welcome to the game. " +
            "Press Enter to go to the next quote.")
            .add("I'm your host, " +
                "SpongeBob Squarepants.")
            .add("Do you think you can beat the banker?")
            .add("If so, get ready to play this " +
                "combination of game shows.")
            .deployQuoteChain(explainRules);
    });
}

/*
    @param toggleSetting TOGGLE.ON to turn music on; TOGGLE.OFF
    to turn music off
    @returns result of parameterError() if parameter error
    @throws (caught) exception if parameter error
*/
function toggleOpeningTheme(toggleSetting) {
    try {
        if (toggleSetting === TOGGLE.ON)
            gameShow.sounds.openingTheme.play();
        else if (toggleSetting === TOGGLE.OFF)
            gameShow.sounds.openingTheme.pause();
        else
            throw "Invalid parameter toggleSetting";
    }
    catch (err) {
        return parameterError(err);
    }
}

function setUpTitleScreen() {
    gameShow.canvasStack.add(CANVAS_IDS.TITLE_SCREEN);
    drawTitleScreenText();
    toggleOpeningTheme(TOGGLE.ON);

    // Set up the user's ability to go to the game
    keyboard.enterKeyAction.setUpEventHandler();
    keyboard.enterKeyAction.set(setUpGame);
}

function removeTitleScreen() {
    gameShow.canvasStack.remove(CANVAS_IDS.TITLE_SCREEN);
}

function setUpAudio() {
    gameShow.sounds.nextQuote =
        document.getElementById('next-quote-sound');
    gameShow.sounds.openingTheme =
        document.getElementById("opening-theme");
}

$(document).ready(function() {
    if (!isUnitTesting()) {
        setUpAudio();
        setUpTitleScreen();
    }
});