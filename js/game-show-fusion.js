"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

var gameShow = {};
gameShow.speakers = getSpeakerObjects();

gameShow.moneyAmounts = ['0.01', '50', '300', '750', '1,000',
    '10,000', '25,000', '100,000', '250,000', '500,000'];

gameShow.canvasStack = new CanvasStack();

gameShow.moneyDisplay = new MoneyDisplay(
    CANVAS_IDS.MONEY_DISPLAY_BARS,
    CANVAS_IDS.MONEY_DISPLAY_TEXT,
    gameShow.moneyAmounts);

gameShow.briefcaseDisplay = new BriefcaseDisplay(
    CANVAS_IDS.BRIEFCASES,
    CANVAS_IDS.BRIEFCASES_TEXT,
    gameShow.moneyAmounts,
    "none");

gameShow.selectedBriefcaseNumber = undefined;

gameShow.questions = new Questions(
    CANVAS_IDS.CHOOSE_QUESTION_GRAPHICS,
    CANVAS_IDS.CHOOSE_QUESTION_TEXT,
    "none",
    CANVAS_IDS.QUESTIONING_GRAPHICS,
    CANVAS_IDS.QUESTIONING_TEXT);

gameShow.turnVariables = {
    selectedQuestion : undefined,
};

gameShow.keyActions = new KeyActions();

gameShow.soundPlayer = new SoundPlayer();
gameShow.musicPlayer = new MusicPlayer();

gameShow.quoteBubble = {};
gameShow.quoteBubble.x = 50;
gameShow.quoteBubble.y = 440;
gameShow.quoteBubble.width = 1000;
gameShow.quoteBubble.height = 85;
gameShow.quoteBubble.textIndent = new Vector2d(25, 35);
gameShow.maximumTextLengthInPixels = (gameShow.quoteBubble.width -
    (gameShow.quoteBubble.textIndent.x * 2));

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
        @post storage of quotes has been emptied
    */
    clear : function() {
        this.storage = [];
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
            drawQuoteTextAndCallFunction(this.storage.shift(),
                function() {
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
    correct speaker has been drawn
    @hasTest no
    @param speakerName name of the person to draw; should be
    a constant in SPEAKERS
    @returns nothing
    @throws nothing
*/
function drawNewSpeaker(speakerName) {
    eraseSpeaker();
    gameShow.speakers[speakerName].draw();
}

/*
    @pre canvases are set up
    @post text has been drawn with appropriate wrap around and in quote
    bubble; endCallback is set up to be called when user wants;
    sound plays when user presses Enter on a quote
    @hasTest no
    @param text the text to draw
    @param endCallback to call after the user presses Enter (can
    be used for chaining quote bubbles together) (optional)
    @returns nothing
    @throws nothing
*/
function drawQuoteTextAndCallFunction(text, endCallback) {
    drawQuoteText(text);

    if (endCallback !== undefined) {
        // Allow the endCallback to be called
        gameShow.keyActions.set(KEY_CODES.ENTER, function() {
            gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.NEXT_QUOTE);
            endCallback();
        });
    }
    else {
        gameShow.keyActions.set(KEY_CODES.ENTER, function() {
            gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.NEXT_QUOTE);
        });
    }
}

/*
    @pre canvases are set up
    @post the text has been drawn in the quote bubble, with
    wrap around if necessary
    @hasTest no
    @param text the text to draw
    @returns nothing
    @throws nothing
*/
function drawQuoteText(text) {
    var canvas = document.getElementById(CANVAS_IDS.QUOTE_TEXT);
    var ctx = canvas.getContext('2d');
    var textPadding = 10;
    var fontSize = 30;
    ctx.font = fontSize + "px Arial";
    var bubble = gameShow.quoteBubble;
    var x = (bubble.x + gameShow.quoteBubble.textIndent.x);
    var y = (bubble.y + gameShow.quoteBubble.textIndent.y);

    // Convert the text into pieces so that the text can be put
    // into multiple lines, if necessary, so that the entire text
    // fits within the quote bubble's width
    var textPieces = convertCanvasTextIntoSmallerPieces(ctx, text,
        gameShow.maximumTextLengthInPixels);

    // Draw the text
    for (var textIndex in textPieces) {
        ctx.fillText(textPieces[textIndex], x, y);
        y += (fontSize + textPadding);
    }
}

/*
    @post quote bubble has been drawn on its canvas
*/
function setUpQuoteBubble() {
    drawQuoteBubble();
}

/*
    @param bool true to allow user to change which case is
    emphasized; false to remove this ability
*/
function allowCaseSelectorMovement(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.LEFT_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_CASE_SELECTOR);
            gameShow.briefcaseDisplay.emphasizePreviousCase();
        })
        .set(KEY_CODES.RIGHT_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_CASE_SELECTOR);
            gameShow.briefcaseDisplay.emphasizeNextCase();
        });
    }
    else {
        gameShow.keyActions.erase(KEY_CODES.LEFT_ARROW)
            .erase(KEY_CODES.RIGHT_ARROW);
    }
}

/*
    @param bool true to allow user to change which case is emphasized;
    false to remove this ability
*/
function allowQuestionSelectorMovement(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.LEFT_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_QUESTION_SELECTOR);
            gameShow.questions.emphasizeLeftLabel();
        })
        .set(KEY_CODES.RIGHT_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_QUESTION_SELECTOR);
            gameShow.questions.emphasizeRightLabel();
        })
        .set(KEY_CODES.UP_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_QUESTION_SELECTOR);
            gameShow.questions.emphasizeUpLabel();
        })
        .set(KEY_CODES.DOWN_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_QUESTION_SELECTOR);
            gameShow.questions.emphasizeDownLabel();
        });
    }
    else {
        gameShow.keyActions.erase(KEY_CODES.LEFT_ARROW)
            .erase(KEY_CODES.RIGHT_ARROW)
            .erase(KEY_CODES.UP_ARROW)
            .erase(KEY_CODES.DOWN_ARROW);
    }
}

/*
    @post the selection of a case has been performed; the
    selection has been set up to be announced by the host; the
    briefcase display has been updated; the
    continuation of the game has been set to start after the user
    presses Enter
*/
function handleCaseSelection() {
    gameShow.musicPlayer.stop();
    allowCaseSelectorMovement(false);

    // Record which case was selected
    gameShow.selectedBriefcaseNumber =
        gameShow.briefcaseDisplay.numberToEmphasize;

    // Update the briefcase display
    gameShow.briefcaseDisplay.giveFade(
        gameShow.selectedBriefcaseNumber);

    // Have the host announce it and allow game continuation
    gameShow.quotesToDraw.add("You have selected case " +
        gameShow.selectedBriefcaseNumber + ".")
        .deployQuoteChain(selectQuestion);
}

/*
    @post game has been updated so that the user can use the arrow
    keys to change which case is selected and can select a case
    by hitting Enter
*/
function selectFirstCase() {
    gameShow.canvasStack.set(CANVAS_IDS.BRIEFCASE_DISPLAY.concat(
        CANVAS_IDS.QUOTE));
    gameShow.briefcaseDisplay.setEmphasis(1);

    allowCaseSelectorMovement(true);

    gameShow.quotesToDraw.add("Now, you must use the left and " +
        "right arrow keys and the Enter key to choose a case.")
        .deployQuoteChain(function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.SELECT_CASE);
            handleCaseSelection();
        });
}

/*
    @post the question selected by the player has been presented
    to him/her
*/
function handleQuestionSelection() {
    allowQuestionSelectorMovement(false);

    // Present the question
    gameShow.turnVariables.selectedQuestion =
        gameShow.questions.numberOfLabelToEmphasize;
    gameShow.quotesToDraw.add("Here comes the question.")
        .deployQuoteChain(presentQuestionAndAnswers);
}

/*
    @pre gameShow.turnVariables.selectedQuestion has been updated
    @post the question, its answers, and the support options
    have been presented; audio has been updated
*/
function presentQuestionAndAnswers() {
    // Update what the user sees and hears
    gameShow.canvasStack.set(CANVAS_IDS.QUESTIONING);

    gameShow.questions.drawQuestionAndAnswersText(
        gameShow.turnVariables.selectedQuestion);
}

/*
    @post game has been updated so that the user can use the arrow
    keys to change which question is selected and can select a question
    by hitting Enter
*/
function selectQuestion() {
    gameShow.musicPlayer.play(MUSIC_IDS.FIRST_FOUR_QUESTIONS);
    gameShow.canvasStack.set(CANVAS_IDS.CHOOSE_QUESTION.concat(
        CANVAS_IDS.QUOTE));
    gameShow.questions.setEmphasizedLabel(1);

    allowQuestionSelectorMovement(true);

    gameShow.quotesToDraw.add("Use the left and right arrow keys " +
        "and the Enter key to select a question.")
        .deployQuoteChain(function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.SELECT_QUESTION);
            handleQuestionSelection()
        });
}

function setUpGame() {
    setUpQuoteBubble();
    gameShow.moneyDisplay.setUp();
    gameShow.briefcaseDisplay.draw();
    gameShow.questions.drawInitialParts();

    // Show the appropriate canvases
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);

    // Host's introductory text
    drawNewSpeaker(SPEAKERS.SPONGEBOB);
    gameShow.quotesToDraw.add("Welcome to the game. " +
        "Press Enter to go to the next quote.")
        .add("I'm your host, " +
            "SpongeBob Squarepants.")
        .add("Do you think you can beat the banker?")
        .add("If so, get ready to play this " +
            "combination of game shows.")
        .deployQuoteChain(explainRules);
}

function setUpTitleScreen() {
    gameShow.canvasStack.set(CANVAS_IDS.TITLE_SCREEN);
    drawTitleScreenText();
    gameShow.musicPlayer.play(MUSIC_IDS.OPENING);

    // Set up the user's ability to go to the game
    gameShow.keyActions.setUpEventHandler()
        .set(KEY_CODES.ENTER, setUpGame);
}

function setUpAudio() {
    gameShow.soundPlayer.storeElements();
    gameShow.musicPlayer.storeElements();
}

$(document).ready(function() {
    if (!isUnitTesting()) {
        setUpAudio();
        setUpTitleScreen();
    }
});