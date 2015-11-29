"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

var gameShow = {};
gameShow.speakers = getSpeakerObjects();

gameShow.imagesToPreload = [];
gameShow.titleScreenImageUrls = {
    SPONGEBOB_CHARACTER : "media/images/spongebob.png",
    ARE_YOU_SMARTER : "media/images/logo_are_you_smarter.jpg",
    DEAL_OR : "media/images/logo_deal_or_no_deal.png",
    WHO_WANTS : "media/images/logo_who_wants_to_be_millionaire.jpg",
    SPONGEBOB_SHOW : "media/images/logo_spongebob.png",
};

gameShow.canvasStack = new CanvasStack();

gameShow.banker = new Banker("media/images/banker.png");

gameShow.moneyAmounts = getBeginningMoneyAmounts();
gameShow.briefcaseValue = undefined;

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

gameShow.numberOfQuestionsCorrectlyAnswered = 0;
gameShow.millionDollarQuestion = false;

gameShow.helpers = []; // array of instances of Helper
gameShow.activeHelper = null; // instance of the current helper
gameShow.NUMBER_OF_HELPERS = 5;
setUpHelpers();

gameShow.lifelines = new Lifelines(CANVAS_IDS.LIFELINES_GRAPHICS,
    CANVAS_IDS.LIFELINES_TEXT);
gameShow.isUserSelectingLifeline = false;
gameShow.canPeek = true; // to make it easier to determine whether or
                         // not the user can still use his helper
gameShow.canBeSaved = true; // note that saving isn't a selectable lifeline

gameShow.chooseHelperMenuState = new ChooseHelperMenuState(
    CANVAS_IDS.CHOOSE_HELPER_GRAPHICS, CANVAS_IDS.CHOOSE_HELPER_TEXT,
    gameShow.helpers);

gameShow.turnVariables = {
    selectedQuestion : undefined,
    selectedAnswerNumber : undefined,
    bankerOffer : undefined,

    // Store in case the helper's answer is demanded more than once
    // in a certain turn
    helperAnswerNumber : undefined,

    reset : function() {
        this.selectedQuestion = undefined;
        this.selectedAnswerNumber = undefined;
        this.bankerOffer = undefined;
        this.helperAnswerNumber = undefined;
    },
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
    ctx.rect(bubble.x, bubble.y, bubble.width, bubble.height);
    ctx.fillStyle = "rgba(240, 240, 240, 0.9)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";
    ctx.stroke();
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
    @post million dollar question label (i.e. "MILLION DOLLAR QUESTION")
    has been drawn on the appropriate canvas
*/
function setUpMillionDollarQuestionLabel() {
    // Prepare helpful variables
    var canvas = document.getElementById(CANVAS_IDS.MILLION_QUESTION);
    var ctx = canvas.getContext('2d');
    var width = 800;
    var height = 100;
    var leftX = (CANVAS_WIDTH - width) / 2;
    var topY = (CANVAS_HEIGHT - height) / 2;

    // Draw the label
    ctx.lineWidth = height;
    ctx.strokeStyle = "#FFDF00";
    ctx.lineCap = "round";
    ctx.moveTo(leftX, topY);
    ctx.lineTo(leftX + width, topY);
    ctx.stroke();

    // Draw the label's text
    ctx.fillStyle = "#c0c0c0";
    ctx.font = "bold 45px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("MILLION DOLLAR QUESTION", leftX + (width / 2), topY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeText("MILLION DOLLAR QUESTION", leftX + (width / 2), topY);
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
    @pre parameter direction has any of the following values: "left",
    "right", "up", "down"
    @post if practical, the question selector has been moved in
    the indicated direction and a sound effect was played
    @param direction to try to move the question selector in
*/
function moveQuestionSelector(direction) {
    if (gameShow.questions.emphasizeDifferentLabel(direction)) {
        gameShow.soundPlayer.play(
            SOUND_EFFECTS_IDS.MOVE_QUESTION_SELECTOR);
    }
};

/*
    @param bool true to allow user to change which question's label
    is emphasized; false to remove this ability
*/
function allowQuestionSelectorMovement(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.LEFT_ARROW, function() {
            moveQuestionSelector("left");
        })
        .set(KEY_CODES.RIGHT_ARROW, function() {
            moveQuestionSelector("right");
        })
        .set(KEY_CODES.UP_ARROW, function() {
            moveQuestionSelector("up");
        })
        .set(KEY_CODES.DOWN_ARROW, function() {
            moveQuestionSelector("down");
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
    @param bool true to allow user to change which answer
    is emphasized; false to remove this ability
*/
function allowAnswerSelectorMovement(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.UP_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_ANSWER_SELECTOR);
            gameShow.questions.emphasizeUpAnswer(
                gameShow.turnVariables.selectedQuestion);
        })
        .set(KEY_CODES.DOWN_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_ANSWER_SELECTOR);
            gameShow.questions.emphasizeDownAnswer(
                gameShow.turnVariables.selectedQuestion);
        });
    }
    else {
        gameShow.keyActions.erase(KEY_CODES.UP_ARROW)
            .erase(KEY_CODES.DOWN_ARROW);
    }
}

/*
    @param bool true to allow user to change which lifeline
    is selected; false to disable this ability
*/
function allowLifelineSelectorMovement(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.UP_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_LIFELINE_SELECTOR);
            gameShow.lifelines.container.selectPrevious(
                gameShow.lifelines.graphicalCanvas,
                gameShow.lifelines.textualCanvas);
        })
        .set(KEY_CODES.DOWN_ARROW, function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.MOVE_LIFELINE_SELECTOR);
            gameShow.lifelines.container.selectNext(
                gameShow.lifelines.graphicalCanvas,
                gameShow.lifelines.textualCanvas);
        });
    }
    else {
        gameShow.keyActions.erase(KEY_CODES.UP_ARROW)
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

    // Record which case was selected and its value
    gameShow.selectedBriefcaseNumber =
        gameShow.briefcaseDisplay.numberToEmphasize;
    gameShow.briefcaseValue =
        getRandomMoneyAmount(gameShow.moneyAmounts, false,
        gameShow.moneyDislay);

    // Update the briefcase display
    gameShow.briefcaseDisplay.giveFade(
        gameShow.selectedBriefcaseNumber);

    // Have the host announce it and allow game continuation
    gameShow.quotesToDraw.add("You have selected case " +
        gameShow.selectedBriefcaseNumber + ".")
        .deployQuoteChain(function() {
            gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_1_TO_5);
            gameShow.chooseHelperMenuState.draw();
            haveUserPickHelper();
        });
}

/*
    @pre arrayOfMoneyAmounts.length > 0
    @hasTest yes
    @param arrayOfMoneyAmounts array of instances of MoneyAmount from
    which to get an instance to return
    @param makeGrey true to use the given instance of MoneyDisplay to
    make grey the money bar of the removed
    money amount; false to not make the bar grey
    @param moneyDislay instance of MoneyDisplay with which the money bar can
    be greyed (only required if makeGrey is true)
    @returns a randomly chosen instance of MoneyAmount that was removed from
    arrayOfMoneyAmounts
*/
function getRandomMoneyAmount(arrayOfMoneyAmounts, makeGrey, moneyDisplay) {
    var randomIndex = Math.floor(Math.random() * arrayOfMoneyAmounts.length);
    var moneyAmount = arrayOfMoneyAmounts.splice(randomIndex, 1).pop();
    if (makeGrey) {
        // make grey the bar of the money amount to splice
        var index = gameShow.moneyDisplay.getBarIndex(moneyAmount);
        moneyDisplay.giveFade(index + 1);
    }
    return moneyAmount;
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
    @pre gameShow.numberOfQuestionsCorrectlyAnswered is correct
    @post the question selected by the player has been presented
    to him/her
*/
function handleQuestionSelection() {
    allowQuestionSelectorMovement(false);

    // Play dramatic sound effect if user has answered enough
    // questions
    if (gameShow.numberOfQuestionsCorrectlyAnswered >= 5)
        gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.PRESENT_QUESTION);

    // Present the question
    gameShow.turnVariables.selectedQuestion =
        gameShow.questions.numberOfLabelToEmphasize;
    // Explain the use of keys if the user is on the first question
    if (gameShow.numberOfQuestionsCorrectlyAnswered < 1) {
        gameShow.quotesToDraw.add("You have selected a question.")
        .add("Once the question is shown, use the arrow " +
        "keys and the Enter key to select your answer.")
        .add("Furthermore, use the 'H' key to jump to or from the " +
        "lifeline buttons.");
    }
    gameShow.quotesToDraw.add("Here comes the question.")
    .deployQuoteChain(function() {
        // Draw and present the questions and answers
        gameShow.questions.drawQuestionAndAnswersText(
            gameShow.turnVariables.selectedQuestion);
        presentQuestionAndAnswers();
    });
}

/*
    @param booleanValue true to allow the user to use the 'H' key
    to switch between being able to select an answer and being able
    to select a lifeline; false to disable the user's ability to
    select answers and lifelines
*/
function allowUserSelectAnswerOrLifeline(booleanValue) {
    if (booleanValue) {
        gameShow.isUserSelectingLifeline = false;
        allowAnswerSelectorMovement(!gameShow.isUserSelectingLifeline);

        gameShow.keyActions.set(KEY_CODES.H, function() {
            // If lifeline buttons remain,
            // toggle between the allowing of answer selection and
            // the allowing of lifeline selection
            if (gameShow.lifelines.container.getNumberOfChildren() > 1) {
                gameShow.isUserSelectingLifeline =
                    !gameShow.isUserSelectingLifeline;
                if (!gameShow.isUserSelectingLifeline) {
                    gameShow.soundPlayer.play(
                        SOUND_EFFECTS_IDS.ENABLE_ANSWER_SELECTION);
                    allowLifelineSelectorMovement(false);
                    allowAnswerSelectorMovement(true);
                }
                else {
                    gameShow.soundPlayer.play(
                        SOUND_EFFECTS_IDS.ENABLE_LIFELINE_SELECTION);
                    allowAnswerSelectorMovement(false);
                    allowLifelineSelectorMovement(true);
                }
            }
        });
    }
    else {
        // Remove the user's ability to select answers and lifelines
        allowAnswerSelectorMovement(false);
        allowLifelineSelectorMovement(false);
        gameShow.keyActions.erase(KEY_CODES.H);
    }
}

function canHelperStillHelp() {
    return (gameShow.canPeek || gameShow.canBeSaved);
}

/*
    @pre the lifeline buttons are stored from the second element onward
    in gameShow.lifelines.container._chldren
    @post all stored lifeline buttons have been removed; saving
    has been disallowed
    @hasTest yes
*/
function removeAllLifelines() {
    while (gameShow.lifelines.container.getNumberOfChildren() > 1)
        gameShow.lifelines.removeSelectedLifeline(
            gameShow.lifelines.container.getNumberOfChildren() > 2);

    gameShow.canBeSaved = false;
}

/*
    @pre question, answers, and lifeline buttons have been drawn
    @post the question, its answers, and the lifeline buttons
    have been presented, and the user is able to respond
*/
function presentQuestionAndAnswers() {
    // Update what the user sees
    if (gameShow.millionDollarQuestion)
        gameShow.canvasStack.set(CANVAS_IDS.QUESTIONING,
            CanvasStack.EFFECTS.FADE_IN);
    else
        gameShow.canvasStack.set(CANVAS_IDS.QUESTIONING.concat(
            CANVAS_IDS.LIFELINES));

    // Allow the user to pick an answer or lifeline
    allowUserSelectAnswerOrLifeline(true);
    gameShow.keyActions.set(KEY_CODES.ENTER, function() {
        if (!gameShow.isUserSelectingLifeline)
            handleAnswerSelection();
        else
            handleLifelineSelection();
    });
}

/*
    @post the game has responded appropriately to the user's
    choosing an answer
*/
function handleAnswerSelection() {
    allowUserSelectAnswerOrLifeline(false);

    // Save the answer
    gameShow.turnVariables.selectedAnswerNumber =
        gameShow.questions.numberOfAnswerToEmphasize;

    // Determine whether or not the correct answer was selected;
    // react to this judgment
    var question = gameShow.questions.getQuestion(
        gameShow.turnVariables.selectedQuestion);
    if (isCorrectAnswer(question,
        gameShow.turnVariables.selectedAnswerNumber)) {
        if (gameShow.millionDollarQuestion)
            handleCorrectMillionAnswerSelection();
        else
            handleCorrectAnswerSelection();
    }
    else {
        if (gameShow.millionDollarQuestion)
            handleWrongMillionAnswerSelection();
        else
            handleWrongAnswerSelection();
    }
}

/*
    @pre a newly constructed instance of Lifelines has one
    instance of Label and three instances of LifelineButton
    @post the game has responded appropriately to the user's
    choosing a lifeline; the selected lifeline has been activated
    and removed
*/
function handleLifelineSelection() {
    allowUserSelectAnswerOrLifeline(false);

    // React auditorily
    gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.SELECT_LIFELINE);

    // Activate the selected lifeline button in the container so
    // that we can tell which lifeline was selected
    gameShow.lifelines.container.activateSelectedComponent();

    // Respond, depending on which lifeline was selected
    var lifeline = gameShow.lifelines.mostRecentlyActivatedButton;
    if (lifeline === LIFELINES.PEEK)
        respondToPeekButtonActivation();
    else if (lifeline === LIFELINES.ASK_AUDIENCE)
        respondToAskAudienceButtonActivation();
    else if (lifeline === LIFELINES.PHONE_FRIEND)
        respondToPhoneFriendButtonActivation();
    else /* should never happen */
        alertAndThrowException("Most recently activated lifeline button " +
            "isn't button for appropriate lifeline");

    /*
        Don't allow the lifeline to be selected again; make sure
        an infinite loop doesn't occur by only selecting the
        next lifeline button if there will be a remaining lifeline button
        (meaning two components, counting the label in the lifelines'
        container, will remain)
    */
    gameShow.lifelines.removeSelectedLifeline(
        gameShow.lifelines.container.getNumberOfChildren() > 2);
}

/*
    @pre gameShow.activeHelper !== null; user has requested use
    of his "Peek" lifeline; SpongeBob is the currently drawn speaker;
    the question can't be the million dollar question
    @post helper's answer has been determined and presented to the
    user, after which the user has been allowed to choose his answer
    (or another lifeline) again; SpongeBob is the currently drawn
    speaker
*/
function respondToPeekButtonActivation() {
    // Make it easier to check that the peek lifeline has been used
    gameShow.canPeek = false;

    var helper = gameShow.activeHelper;

    // Determine the helper's answer
    var question = getCurrentQuestion();
    var answerNumber = getHelperAnswer(helper, question);
    var answer = getAnswerLetterAndText(question, answerNumber);

    // Store the helper's answer so that he/she gives the same
    // answer if the user both peeks and saves
    gameShow.turnVariables.helperAnswerNumber = answerNumber;

    // Have the host explain; keep helper's gender in mind; have
    // the host say Gary's answer, if necessary
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    if (helper.name === SPEAKERS.SANDY)
        gameShow.quotesToDraw.add("Your helper will now tell you " +
            "the letter of the answer that she has chosen.");
    else if (helper.name === SPEAKERS.GARY)
        gameShow.quotesToDraw.add("Unfortunately, your helper can't " +
            "say his answer, so I'll say it for him.")
        .add("Your helper chose (" + answer.letter + ") " +
            answer.text + ".");
    else
        gameShow.quotesToDraw.add("Your helper will now tell you " +
            "the letter of the answer that he has chosen.");
    gameShow.quotesToDraw.deployQuoteChain(function() {
        // Show the active helper
        drawNewSpeaker(helper.name);

        // Have the helper say his/her answer (unless it's Gary, in
        // which case the answer should've already been said)
        if (helper.name === SPEAKERS.GARY)
            gameShow.quotesToDraw.add("Meow.");
        else
            gameShow.quotesToDraw.add("I chose (" + answer.letter + ") " +
                answer.text + ".");
        gameShow.quotesToDraw.deployQuoteChain(function() {
            // Draw the host as the speaker again
            drawNewSpeaker(SPEAKERS.SPONGEBOB);

            gameShow.quotesToDraw.add("Okay. Your helper chose (" +
                answer.letter + "). Now, let's return to the question.")
            .deployQuoteChain(function() {
                // Show the (unchanged) question and answers,
                // and enable user input
                presentQuestionAndAnswers();
            });
        });
    });
}

/*
    @pre user has requested use of his "Ask the Audience" lifeline;
    the question can't be the million dollar question
    @post the music has been changed appropriately; the host has
    explained to the audience; a function has been called that will
    handle the presentation of the audience's votes
*/
function respondToAskAudienceButtonActivation() {
    // Play appropriate background music
    gameShow.musicPlayer.play(MUSIC_IDS.WAITING_FOR_AUDIENCE_ANSWER);

    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.quotesToDraw.add("All right. Audience, the question is " +
        "coming to you.")
    .add("It's a serious one. Here it comes to your keypads.")
    .add("Select an answer A, B, C, or D.")
    .add("Those of you at home can also vote online, with the " +
        "Game Show Fusion app, or on Facebook...")
    .add("...just kidding. Servers are expensive.")
    .deployQuoteChain(presentAudienceAnswers);
}

/*
    @post a chart showing the audience's answers has been drawn
    and presented; appropriate sound effect has been played;
    background music has been set to one appropriate for the question;
    after which the user has been allowed to choose his answer
    (or another lifeline) again
*/
function presentAudienceAnswers() {
    // Draw and show the chart
    drawAudienceDataChart();
    gameShow.canvasStack.set(CANVAS_IDS.QUOTE.concat(
        CANVAS_IDS.AUDIENCE_CHART));

    // Adjust the audio
    gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.AUDIENCE_ANSWERED);
    adjustBackgroundMusicBasedOnQuestionsAnswered();

    // Have the (unseen) host explain the chart and thank the audience
    gameShow.quotesToDraw.add("Here are the audience's votes.")
    .add("Thank you, audience.")
    .add("Now, let's get back to the question.")
    .deployQuoteChain(function() {
        // Show the (unchanged) question and answers,
        // and enable user input
        presentQuestionAndAnswers();
    });
}

/*
    @pre gameShow.turnVariables.selectedQuestion is correct
    @post the audience's votes have been displayed in a sideways,
    bar chart
*/
function drawAudienceDataChart() {
    // For making the code clearer
    var audienceData = gameShow.questions.getQuestion(
        gameShow.turnVariables.selectedQuestion).audienceData;
    var canvas = document.getElementById(CANVAS_IDS.AUDIENCE_CHART);
    var ctx = canvas.getContext('2d');
    var letters = ['A', 'B', 'C', 'D'];

    // For positioning the chart and its aspects
    var chartData = {};
    chartData.width = 700;
    chartData.height = 300;
    // Top-left coordinates:
    chartData.x = (CANVAS_WIDTH - chartData.width) / 2;
    chartData.y = 100; // this is safe; the chart won't touch the
                       // quote bubble
    chartData.leftMarginForAnswerLetters = 20;
    chartData.rightMarginForPercentages = 20;
    chartData.leftMarginForBar = 120;
    chartData.distanceBetweenBars = 10; // is also top and bottom margin
    chartData.fontSize = 30; // should be less than chartData.barHeight
    chartData.maxBarWidth = 460;
    chartData.barHeight = (chartData.height -
        (5 * chartData.distanceBetweenBars)) / 4;
    // Have each answer letter and percentage be centered vertically
    // in relation to the respective bar
    chartData.additionalVerticalTextIndent =
        (chartData.barHeight - chartData.fontSize) / 2;
    chartData.additionalVerticalPercentageIndent =
        chartData.additionalVerticalTextIndent;
    var deltaY = chartData.distanceBetweenBars +
        chartData.barHeight;

    /*
        Draw the answer letters
    */
    var positionX = chartData.x + chartData.leftMarginForAnswerLetters;
    var positionY = chartData.y + chartData.distanceBetweenBars +
        chartData.additionalVerticalTextIndent;
    // Treat the position as the letter's top-left point
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = chartData.fontSize + "px Arial";
    ctx.fillStyle = "#99cc00";
    // Iterate and draw
    for (var i in letters) {
        ctx.fillText(letters[i], positionX, positionY);
        positionY += deltaY;
    }

    /*
        Draw the bars
    */
    positionX = chartData.x + chartData.leftMarginForBar;
    positionY = chartData.y + chartData.distanceBetweenBars;
    ctx.fillStyle = "#0099cc";
    // Iterate and draw
    for (var i in letters) {
        ctx.fillRect(positionX, positionY,
            audienceData[letters[i]] * chartData.maxBarWidth,
            chartData.barHeight);
        positionY += deltaY;
    }

    /*
        Draw the percentages
    */
    positionX = chartData.x + (700 - chartData.rightMarginForPercentages);
    positionY = chartData.y + chartData.distanceBetweenBars +
        chartData.additionalVerticalPercentageIndent;
    ctx.fillStyle = "white";
    // Iterate and draw
    for (var i in letters) {
        var percentage = Math.round(audienceData[letters[i]] * 100);
        ctx.fillText(' ' + percentage + '%', positionX, positionY);
        positionY += deltaY;
    }
}

/*
    @pre user has requested use of his "Phone a Friend" lifeline;
    SpongeBob is the currently drawn speaker;
    the question can't be the million dollar question
    @post the host has explained what has happened (with
    appropriate background music), and a function
    has been called to handle "calling" the friend-to-phone
*/
function respondToPhoneFriendButtonActivation() {
    gameShow.musicPlayer.play(MUSIC_IDS.WAITING_FOR_PHONE_CALL);

    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.quotesToDraw.add("Okay. We will now try to make contact " +
        "with your friend.")
    .add("Here he is.")
    .deployQuoteChain(presentPhoneFriendAnswer)
}

/*
    @pre the current canvases shown are the ones that show the
    quote bubble and the speaker; gameShow.turnVariables.selectedQuestion
    is correct
    @post the music has been changed to match the phone call,
    and afterwards changed back to one appropriate for the question;
    Patrick's answer has been determined, and he has presented it;
    after the user has gone through all the quotes, he has been
    given back his ability to pick an answer (or lifeline);
    SpongeBob is the currently drawn speaker
*/
function presentPhoneFriendAnswer() {
    gameShow.musicPlayer.play(MUSIC_IDS.PHONE_CALL_OCCURING);

    // Determine Patrick's answer by making a temporary Helper
    // instance for him
    var patrick = new Helper(SPEAKERS.PATRICK, 0.80, undefined,
        undefined, []);
    var question = gameShow.questions.getQuestion(
        gameShow.turnVariables.selectedQuestion);
    var answerNumber = getHelperAnswer(patrick, question);
    var answer = getAnswerLetterAndText(question, answerNumber);

    drawNewSpeaker(SPEAKERS.PATRICK);
    gameShow.quotesToDraw.add("Hey Mario. Let me get a large double " +
        "olive...")
    .add("Oh yeah.")
    .add("Uhhhhh...")
    .add("For my answer, I'll pick...")
    .add("Uhhhhh...")
    .add("(" + answer.letter + ") " + answer.text + ".")
    .deployQuoteChain(function() {
        gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.PHONE_CALL_ENDED);
        adjustBackgroundMusicBasedOnQuestionsAnswered();

        drawNewSpeaker(SPEAKERS.SPONGEBOB);
        gameShow.quotesToDraw.add("All right. Patrick chose " + "(" +
            answer.letter + "). Let's return to the question.")
        .deployQuoteChain(function() {
            // Show the (unchanged) question and answers,
            // and enable user input
            presentQuestionAndAnswers();
        });
    });
}

/*
    @hasTest yes
    @param helper the instance of Helper whose data will be used
    to determine an answer that that helper could give
    @param question instance of Question to use
    @returns returns a number in range [1, 4]; this number indicates
    the answer chosen by the given helper (there is probability
    involved, since the helper may not always choose correct answer);
    however, if the given helper is the active helper and has already
    shown his/her answer, then that answer is returned
    @throws exception if fail to determine the helper's answer
    (although this should never happen)
*/
function getHelperAnswer(helper, question) {
    /*
        If given helper is active helper and has already shown his/her
        answer, return that answer number
    */
    if ((helper === gameShow.activeHelper) &&
        (gameShow.turnVariables.helperAnswerNumber !== undefined))
        return gameShow.turnVariables.helperAnswerNumber;

    var correctAnswerNumber = question.answerData.correctIndex + 1;
    var gaveCorrectAnswer = undefined;

    /*
        Determine if helper "answered" the question correctly
    */
    // If helper specializes in the subject, helper automatically
    // answers correctly
    if (helper.getStrengths().indexOf(question.subject) !== -1)
        gaveCorrectAnswer = true;
    // Otherwise, use probability to decide, based on the helper's
    // default correct rate
    else
        gaveCorrectAnswer = Math.random() < helper.defaultCorrectRate;

    /*
        Return appropriate answer number depending on whether
        or not the helper gave the correct answer
    */
    // If helper "answered" the question correctly, return
    // the correct answer number as his choice
    if (gaveCorrectAnswer === true)
        return correctAnswerNumber;
    // Otherwise, randomly choose a wrong answer and return that
    // answer's number as his choice
    else if (gaveCorrectAnswer === false) {
        // Create an array of the wrong answer numbers
        var wrongAnswerNumbers = [];
        for (var i = 1; i <= 4; ++i) {
            if (i !== correctAnswerNumber)
                wrongAnswerNumbers.push(i);
        }
        // Randomly return one of the wrong answer numbers
        var randomIndex =
            Math.floor(Math.random() * wrongAnswerNumbers.length);
        return wrongAnswerNumbers[randomIndex];
    }
    else // should never happen
        alertAndThrowException("Unable to determine helper's " +
            "answer in getHelperAnswer()");
}

/*
    @pre 1 <= numberOfAnswer <= 4
    @hasTest yes
    @param question instance of Question to check
    @param numberOfAnswer number of the selected answer
    @returns true if correct answer given; false, otherwise
*/
function isCorrectAnswer(question, numberOfAnswer) {
    return (question.answerData.correctIndex === (numberOfAnswer - 1));
}

/*
    @post the question and answer displays have been cleared;
    the questions' label display has been updated;
    the gameShow members have been updated
*/
function prepareForNextTurn() {
    // Prepare the canvases
    gameShow.questions.eraseQuestionAndAnswersText();
    gameShow.questions.setAnswered(gameShow.turnVariables.selectedQuestion);

    // Prepare gameShow members
    gameShow.turnVariables.reset();
}

/*
    @pre the music indicated by MUSIC_IDS.QUESTION_1_TO_5 is
    already playing if the user hasn't answered at least five
    questions; gameShow.numberOfQuestionsCorrectlyAnswered is correct
    and is less than 10
    @post background music has been changed depending on how
    many questions have been answered
*/
function adjustBackgroundMusicBasedOnQuestionsAnswered() {
    if (gameShow.numberOfQuestionsCorrectlyAnswered >= 5) {
        switch (gameShow.numberOfQuestionsCorrectlyAnswered) {
            case 5:
                gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_6);
                break;
            case 6:
                gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_7);
                break;
            case 7:
                gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_8);
                break;
            case 8:
                gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_9);
                break;
            case 9:
                gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_10);
                break;
            case 10:
                gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_MILLION);
                break;
            default: // should never happen
                alertAndThrowException("Invalid value of " +
                    "gameShow.numberOfQuestionsCorrectlyAnswered " +
                    "in adjustBackgroundMusicBasedOnQuestionsAnswered(): " +
                    gameShow.numberOfQuestionsCorrectlyAnswered);
        }
    }
    else
        gameShow.musicPlayer.play(MUSIC_IDS.QUESTION_1_TO_5);
}

/*
    @post the host has told the user what happened and concludes
    the game
*/
function handleCorrectMillionAnswerSelection() {
    // React visually and auditorily
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.musicPlayer.stop();

    // Tell the user what happened
    gameShow.quotesToDraw.add("That answer is: ")
    .deployQuoteChain(function() {
        gameShow.soundPlayer.play(
            SOUND_EFFECTS_IDS.CORRECT_ANSWER_MILLION);
        gameShow.quotesToDraw.add("CORRECT!")
        .add("Congratulations!")
        .add("You've beat the banker!")
        .add("And you go home a millionaire!")
        .add("You've won this game.")
        .add("Good bye.")
        .deployQuoteChain(presentEndingScreen);
    });
}

/*
    @post the host has told the user what happened and concludes
    the game
*/
function handleWrongMillionAnswerSelection() {
    // React visually and auditorily
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.musicPlayer.stop();

    // Tell the user what happened
    gameShow.quotesToDraw.add("That answer is: ")
        .deployQuoteChain(function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.LOSS_MILLION);

            // Have the host explain further
            gameShow.quotesToDraw.add("INCORRECT!");
            handleUserGoingHomeWithNothing();
        });
}

/*
    @post the host has told the user what happened;
    the question's monetary value has been revealed;
    the number of correctly answered questions was updated;
    turn variables were reset;
    answered question can't be selected by user anymore;
    game reacted both visually and auditorily
*/
function handleCorrectAnswerSelection() {
    gameShow.numberOfQuestionsCorrectlyAnswered++;

    // React visually
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);

    // Update what the host says
    gameShow.quotesToDraw.add("That answer is: ")
    .deployQuoteChain(function() {
        // Play special sound effect depending on how many questions
        // user has answered
        if (gameShow.numberOfQuestionsCorrectlyAnswered >= 5) {
            if (gameShow.numberOfQuestionsCorrectlyAnswered === 10)
                gameShow.soundPlayer.play(
                    SOUND_EFFECTS_IDS.CORRECT_ANSWER_10);
            else
                gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.CORRECT_ANSWER);
        }

        gameShow.quotesToDraw.add("Correct!")
        // Next, react depending on how many questions have been answered
        .deployQuoteChain(function() {
            if (gameShow.numberOfQuestionsCorrectlyAnswered < 10) {
                // Determine the question's value and tell the user
                gameShow.canvasStack.set(CANVAS_IDS.MONEY_DISPLAY.concat(
                    CANVAS_IDS.QUOTE));
                var questionValue =
                    getRandomMoneyAmount(gameShow.moneyAmounts, true,
                    gameShow.moneyDisplay);
                gameShow.quotesToDraw.add("The question was worth: $" +
                    questionValue.asString() + '.');

                if (gameShow.numberOfQuestionsCorrectlyAnswered === 9) {
                    gameShow.quotesToDraw.add("You now know what your " +
                        "case holds.")
                        .add("For the option to take it home, you must " +
                            "answer one more question.");
                }
                // The banker makes an offer after the second, fourth, sixth,
                // and eighth questions
                if (gameShow.numberOfQuestionsCorrectlyAnswered % 2 === 0)
                    gameShow.quotesToDraw.deployQuoteChain(makeBankerOffer);
                else
                    gameShow.quotesToDraw.deployQuoteChain(function() {
                        adjustBackgroundMusicBasedOnQuestionsAnswered();
                        goToNextTurn()
                    });
            }
            else
                explainUserChooseMillionOrGoHome();
        });
    });
}

/*
    @post the user has been offered a monetary amount by the banker
    that she can either accept (and leave the game) or reject
    (and continue the game)
*/
function makeBankerOffer() {
    gameShow.canvasStack.set(CANVAS_IDS.QUOTE.concat(
        CANVAS_IDS.BANKER), CanvasStack.EFFECTS.FADE_IN);
    gameShow.musicPlayer.play(MUSIC_IDS.BANKER);
    gameShow.turnVariables.bankerOffer = gameShow.banker.getOffer(
        gameShow.moneyAmounts.concat([gameShow.briefcaseValue]));

    gameShow.quotesToDraw.add("The banker is calling.")
        .add("He has an offer for you.")
        .add("Here's the offer.")
        .deployQuoteChain(function() {
            // Place special sound effect if big enough offer
            if (gameShow.turnVariables.bankerOffer.asNumber() >= 100000)
                gameShow.soundPlayer.play(
                    SOUND_EFFECTS_IDS.OFFERED_BIG_DEAL);

            gameShow.quotesToDraw.add("It is $" +
                gameShow.turnVariables.bankerOffer.asString() + '.')
                .deployQuoteChain(function() {
                    allowUserDealOrNoDeal(true);

                    gameShow.moneyDisplay.setBankerOffer(true,
                        gameShow.turnVariables.bankerOffer);
                    gameShow.canvasStack.set(CANVAS_IDS.MONEY_DISPLAY.concat(
                        CANVAS_IDS.QUOTE));

                    gameShow.quotesToDraw.add("Now, I must ask you: " +
                        "Deal or No Deal? (Press the 'y' key to accept " +
                        "the offer of $" +
                        gameShow.turnVariables.bankerOffer.asString() +
                        ". Press the 'n' key to reject it and continue.)")
                        .deployQuoteChain();
            });
        });
}

/*
    @param bool true to enable the key actions that let the user
    choose whether or not she wishes to accept the banker's offer;
    false, otherwise
*/
function allowUserDealOrNoDeal(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.Y, function() {
            allowUserDealOrNoDeal(false);
            userAcceptsDeal();
        })
        .set(KEY_CODES.N, function() {
            allowUserDealOrNoDeal(false);
            userRejectsDeal();
        });
    }
    else {
        gameShow.keyActions.erase(KEY_CODES.Y).erase(KEY_CODES.N);
    }
}

/*
    @post game has properly reacted to the user's accepting the
    banker's deal; the host has stated whether or not it was
    a good deal
*/
function userAcceptsDeal() {
    gameShow.musicPlayer.play(MUSIC_IDS.ACCEPT_OR_REJECT_DEAL);

    // Host tells the user whether or not the deal was good
    // and concludes the game
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.quotesToDraw.add("You're taking home $" +
        gameShow.turnVariables.bankerOffer.asString() + '.')
        .deployQuoteChain(function() {
            gameShow.musicPlayer.play(MUSIC_IDS.WAS_A_GOOD_DEAL_ACCEPTED);
            gameShow.quotesToDraw.add(
                "Now the question is: did you get a good deal?")
            .add("The banker's offer was $" +
                gameShow.turnVariables.bankerOffer.asString() + '.')
            .add("You picked case number " +
                gameShow.selectedBriefcaseNumber + '.')
            .add("That case was worth: ")
            .deployQuoteChain(function() {
                if (gameShow.turnVariables.bankerOffer.asNumber() >
                    gameShow.briefcaseValue.asNumber())
                    userAcceptedGoodDeal();
                else
                    userAcceptedBadDeal();
            });
        });
}

/*
    @post host has explained that the deal was good and concluded
    the game
*/
function userAcceptedGoodDeal() {
    gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.TOOK_GOOD_DEAL);
    gameShow.musicPlayer.stop();

    gameShow.quotesToDraw.add('$' + gameShow.briefcaseValue.asString() + '.')
    .deployQuoteChain(function() {
        gameShow.quotesToDraw.add("You got a good deal.")
        .add("Congratulations!")
        .add("That concludes this game.")
        .add("Good bye.")
        .deployQuoteChain(presentEndingScreen);
    });
}

/*
    @post host has explained that the deal was bad and concluded
    the game
*/
function userAcceptedBadDeal() {
    gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.TOOK_BAD_DEAL);
    gameShow.musicPlayer.stop();

    gameShow.quotesToDraw.add('$' + gameShow.briefcaseValue.asString() + '.')
        .deployQuoteChain(function() {
            gameShow.quotesToDraw.add("Oh! The banker " +
                "one-upped you this time.")
            .add("How unfortunate.")
            .add("That concludes this game.")
            .add("Good bye.")
            .deployQuoteChain(function() {
                gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.GOOD_BYE);
                presentEndingScreen();
            });
        });
}

/*
    @post game has properly reacted to the user's rejecting the
    banker's deal; the game has been set up to continue
*/
function userRejectsDeal() {
    gameShow.musicPlayer.play(MUSIC_IDS.ACCEPT_OR_REJECT_DEAL);
    gameShow.moneyDisplay.setBankerOffer(false);

    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.quotesToDraw.add("Let's hope you made the correct decision.")
        .deployQuoteChain(function() {
            // Prepare the background music
            adjustBackgroundMusicBasedOnQuestionsAnswered();

            // If useful, have the user pick a helper
            gameShow.activeHelper = null;
            if (canHelperStillHelp())
                haveUserPickHelper();
            else
                goToNextTurn();
        });
}

/*
    @post the user has been told to pick a new helper and been
    given the ability to do so; after he/she does so, the game
    continues
*/
function haveUserPickHelper() {
    // Don't end up calling goToNextTurn if the user hasn't answered
    // a question yet
    var endCallback =
        (gameShow.numberOfQuestionsCorrectlyAnswered === 0) ?
        selectQuestion : goToNextTurn;

    /*
        The user can only pick a helper after having answered an
        even number of questions (besides the tenth one, and including
        before the first one). Thus, go to the next question selection
        if user shouldn't be choosing a helper right now.
    */
    if (gameShow.numberOfQuestionsCorrectlyAnswered % 2 === 1)
        endCallback();
    else {
        // Have the host explain the user's job
        gameShow.canvasStack.set(CANVAS_IDS.QUOTE.concat(
            CANVAS_IDS.CHOOSE_HELPER));
        allowUserPickHelper(true);
        gameShow.quotesToDraw.add("Use the arrow keys and the Enter " +
            "key to select a helper for two questions.")
            .deployQuoteChain(function() {
                allowUserPickHelper(false);
                gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.SELECT_HELPER);

                if (gameShow.chooseHelperMenuState
                    .GUIContainer.hasSelection()) {
                    selectHelper();
                }
                else {
                    // should never happen!
                    alertAndThrowException("gameShow.chooseHelperMenuState" +
                        ".GUIContainer has no selected component");
                }

                // Announce the user's choice
                gameShow.quotesToDraw.add("You have selected " +
                    gameShow.activeHelper.name + ".")
                .deployQuoteChain(function() {
                    // Go to the selection of a question
                    endCallback();
                });
            });
    }
}

/*
    @post the selected helper has been stored in
    gameShow.activeHelper (and thus removed from gameShow.helpers),
    and if practical, this helper has
    been removed from gameShow.chooseHelperMenuState
*/
function selectHelper() {
    var helperIndex =
        gameShow.chooseHelperMenuState.GUIContainer.getSelectedChild();
    gameShow.activeHelper = gameShow.helpers.splice(helperIndex, 1).pop();

    // To avoid infinite loop, only remove the helper if he/she
    // isn't the only remaining helper
    if (gameShow.chooseHelperMenuState.GUIContainer.
        getNumberOfChildren() > 1) {
        gameShow.chooseHelperMenuState.removeSelectedHelper();
    }
}

/*
    @param bool true to allow user to change which helper's icon
    is selected; false to disable this ability
*/
function allowUserPickHelper(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.LEFT_ARROW, function() {
            gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.MOVE_HELPER_SELECTOR);
            gameShow.chooseHelperMenuState.GUIContainer.selectPrevious(
                gameShow.chooseHelperMenuState.graphicalCanvas,
                gameShow.chooseHelperMenuState.textualCanvas);
        })
        .set(KEY_CODES.RIGHT_ARROW, function() {
            gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.MOVE_HELPER_SELECTOR);
            gameShow.chooseHelperMenuState.GUIContainer.selectNext(
                gameShow.chooseHelperMenuState.graphicalCanvas,
                gameShow.chooseHelperMenuState.textualCanvas);
        });
    }
    else {
        gameShow.keyActions.erase(KEY_CODES.LEFT_ARROW)
            .erase(KEY_CODES.RIGHT_ARROW);
    }
}

/*
    @pre numberOfQuestionsCorrectlyAnswered < 10
    @post game has adjusted so that user can pick his next question
*/
function goToNextTurn() {
    prepareForNextTurn();

    // Update what the host says; call of selectQuestion starts
    // the next turn
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    if (gameShow.numberOfQuestionsCorrectlyAnswered === 5)
        gameShow.quotesToDraw.add("You're halfway to the " +
            "million dollar question.");
    else
        gameShow.quotesToDraw.add("Get ready to pick a question.");
    gameShow.quotesToDraw.deployQuoteChain(selectQuestion);
}

/*
    @post the user has been presented the option of either taking
    her case home or facing the million dollar question; the host
    has told her the value of her case and the question's subject;
    key actions have been updated to allow her to choose
*/
function explainUserChooseMillionOrGoHome() {
    gameShow.quotesToDraw.add("You now have a tough choice.")
        .add("You can take home your case, which you know must " +
            "have a value of $" + gameShow.briefcaseValue.asString() + ".")
        .add("Or, you can face the million dollar question.")
        .add("If you choose to see the question, you must answer it.")
        .add("If you choose the wrong answer, you go home with nothing.")
        .add("However, if you choose the right answer, you go home " +
            "a millionaire.")
        .add("Remember that your helpers and lifelines can't help " +
            "you on this question.")
        .add("Before I let you choose, I'll tell you the subject of " +
            "the question.")
        .add("It's subject is: " +
            gameShow.questions.getMillionDollarQuestion().subject + '.')
        .add("Now you must make your decision.")
        .deployQuoteChain(function() {
            allowUserChooseMillionOrGoHome(true);
            gameShow.canvasStack.set(CANVAS_IDS.QUOTE.concat(
                CANVAS_IDS.MILLION_QUESTION));
            gameShow.quotesToDraw.add("Press the 'y' key to see " +
                "the question. Press the 'n' key to quit.")
                .deployQuoteChain();
        });
}

/*
    @param bool true to enable the key actions that let the user
    choose whether or not she wishes to face the million dollar
    question; false, otherwise
*/
function allowUserChooseMillionOrGoHome(bool) {
    if (bool === true) {
        gameShow.keyActions.set(KEY_CODES.Y, function() {
            allowUserChooseMillionOrGoHome(false);
            gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.PRESENT_QUESTION);

            // Host gives dramatic introduction to the question
            gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
            gameShow.quotesToDraw.add("Here it is.")
                .add("For one million dollars, here is the question.")
                .deployQuoteChain(presentMillionDollarQuestion);
        })
        .set(KEY_CODES.N, function() {
            allowUserChooseMillionOrGoHome(false);
            gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
            userTakesCaseHome();
        });
    }
    else {
        gameShow.keyActions.erase(KEY_CODES.Y).erase(KEY_CODES.N);
    }
}

/*
    @post the host explained what happened and concluded the game
*/
function userTakesCaseHome() {
    // React auditorily
    gameShow.musicPlayer.stop();

    // Make the host explain
    gameShow.quotesToDraw.add("Then, congratulations.")
    .add("You're going home with $" +
        gameShow.briefcaseValue.asString() + '.')
    .add("Good bye.")
    .deployQuoteChain(function() {
        gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.GOOD_BYE);
        presentEndingScreen();
    });
}

/*
    @post variables have been adjusted so that the million dollar
    question can be presented without any bugs involving class
    Questions; the question and its answers have been presented
    with appropriate music
*/
function presentMillionDollarQuestion() {
    // Reset the turn-specific variables and canvases; set the music
    adjustBackgroundMusicBasedOnQuestionsAnswered();
    prepareForNextTurn();

    // Indicate that it's the million dollar question; don't allow
    // help
    gameShow.millionDollarQuestion = true;
    gameShow.turnVariables.selectedQuestion =
        Questions.MILLION_DOLLAR_QUESTION;
    gameShow.activeHelper = null;
    removeAllLifelines();

    // Draw and present the question and answers
    gameShow.questions.drawQuestionAndAnswersText(
        gameShow.turnVariables.selectedQuestion);
    presentQuestionAndAnswers();
}

/*
    @pre SpongeBob is currently drawn speaker;
    gameShow.turnVariables.selectedQuestion is correct;
    gameShow.activeHelper !== null
    @post helper's answer has been determined and presented;
    game progresses to next part determined by whether or not
    the user was saved; using the saving lifeline (again) has
    been prohibited
*/
function handleSavingLifeline() {
    // Don't let this lifeline be used again
    gameShow.canBeSaved = false;

    var helper = gameShow.activeHelper;

    // Determine the helper's answer
    var question = getCurrentQuestion();
    var answerNumber = getHelperAnswer(helper, question);
    var answer = getAnswerLetterAndText(question, answerNumber);

    gameShow.quotesToDraw.add("It is now up to your helper.")
    .add("If your helper chose the right answer, you get to continue " +
        "the game.")
    .add("Otherwise, you leave with nothing.")
    .add("I will now tell you what your helper chose.")
    .add("Your helper chose (" + answer.letter + ") " +
        answer.text + ".")
    .deployQuoteChain(function() {
        if (isCorrectAnswer(question, answerNumber))
            handleCorrectAnswerSelection();
        else
            handleWrongAnswerSelection();
    });
}

/*
    @post the host has told the user that he/she has answered
    incorrectly; if possible, the user's helper attempts to save
    him; otherwise, a function is called to resolve the game
*/
function handleWrongAnswerSelection() {
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);

    gameShow.quotesToDraw.add("That answer is: ")
    .deployQuoteChain(function() {
        gameShow.quotesToDraw.add("Wrong!");

        /*
            React differently, depending on whether or not the user
            can be saved (note that the user can't be saved if
            he picked the same wrong answer that the helper
            revealed in the handling of the Peek lifeline)
        */
        if (gameShow.turnVariables.selectedAnswerNumber ===
            gameShow.turnVariables.helperAnswerNumber) {
            // User can't be saved by helper because user knowingly
            // picked the same answer; end game

            gameShow.musicPlayer.stop();
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.LOSS_BUT_CANNOT_BE_SAVED);

            // Have host explain
            gameShow.quotesToDraw.add("As shown by your peek, " +
                "your helper picked the same answer and can't save you.")
            .deployQuoteChain(handleUserGoingHomeWithNothing);
        }
        else if (gameShow.canBeSaved) {
            // User can be saved; trigger "Save" lifeline
            gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.LOSS_BUT_CAN_BE_SAVED);
            gameShow.quotesToDraw.add(
                "However, your helper can still save you.")
            .deployQuoteChain(handleSavingLifeline);
        }
        else {
            // User has already been saved and thus can't be
            // saved this time; end game
            gameShow.musicPlayer.stop();
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.LOSS_BUT_CANNOT_BE_SAVED);

            gameShow.quotesToDraw.deployQuoteChain(
                handleUserGoingHomeWithNothing);
        }
    });
}

/*
    @pre 1 <= answerLetterNumber <= 4
    @param question instance of Question to get the answer text of
    @param answerLetterNumber the number of the answer letter to
    get the character letter and string text of
    @returns an object containing the corresponding answer letter
    and the text of the answer regarding the given question
    @throws exception if answerLetterNumber is in wrong range
*/
function getAnswerLetterAndText(question, answerLetterNumber) {
    // Check parameter validity
    if (!(1 <= answerLetterNumber && answerLetterNumber <= 4))
        alertAndThrowException("answerLetterNumber given to " +
            "getAnswerLetterAndText(...) isn't in valid range: " +
            answerLetterNumber);

    var answer = {};

    // Get the answer letter
    var answerLetters = ['A', 'B', 'C', 'D'];
    answer.letter = answerLetters[answerLetterNumber - 1];

    // Get answer text
    answer.text =
        question.answerData.arrayOfAnswers[answerLetterNumber - 1];

    return answer;
}

/*
    @pre gameShow.turnVariables.selectedQuestion is correct
    @returns instance of the currently active question
*/
function getCurrentQuestion() {
    return gameShow.questions.getQuestion(
        gameShow.turnVariables.selectedQuestion);
}

/*
    @pre SpongeBob is currently drawn speaker
    @post host has told the user the correct answer and
    that he/she has earned no money;
    game has reacted auditorily
*/
function handleUserGoingHomeWithNothing() {
    var question = getCurrentQuestion();
    var answer = getAnswerLetterAndText(question,
        question.answerData.correctIndex + 1);

    gameShow.quotesToDraw.add("The correct answer was (" +
        answer.letter + ") " + answer.text + ".")
    .add("Unfortunately, this means you'll go home with nothing.")
    .add("Good bye.")
    .deployQuoteChain(function() {
        eraseQuoteBubbleText();
        gameShow.soundPlayer.play(SOUND_EFFECTS_IDS.GOOD_BYE);
        presentEndingScreen();
    });
}

/*
    @post game has been updated so that the user can use the arrow
    keys to change which question is selected and can select a question
    by hitting Enter
*/
function selectQuestion() {
    gameShow.canvasStack.set(CANVAS_IDS.CHOOSE_QUESTION.concat(
        CANVAS_IDS.QUOTE));
    gameShow.questions.emphasizeFirstAvailableLabel();

    allowQuestionSelectorMovement(true);

    gameShow.quotesToDraw.add("Use the four arrow keys " +
        "and the Enter key to select a question.")
        .deployQuoteChain(function() {
            gameShow.soundPlayer.play(
                SOUND_EFFECTS_IDS.SELECT_QUESTION);
            handleQuestionSelection()
        });
}

/*
    @post ending screen has been shown
*/
function presentEndingScreen() {
    // Show the ending screen
    gameShow.canvasStack.set(CANVAS_IDS.ENDING_SCREEN,
        CanvasStack.EFFECTS.FADE_IN);
}

/*
    @post gameShow.helpers has been filled with an instance of Helper
    per helper in the game, and each helper has been given its strenghts
    @hasTest yes (although it isn't comprehensive)
*/
function setUpHelpers() {
    gameShow.helpers.push(new Helper(SPEAKERS.SQUIDWARD, 0.85,
        "Fortunately, I have enough talent for all of you.",
        "media/images/squidward_icon.JPG",
        [SUBJECTS.ART, SUBJECTS.MUSIC]));
    gameShow.helpers.push(
        new Helper(SPEAKERS.MERMAID_MAN, 0.55, "EVIL!",
        "media/images/mermaid_man_icon.JPG",
        [SUBJECTS.CRIME, SUBJECTS.GEOGRAPHY, SUBJECTS.HISTORY]));
    gameShow.helpers.push(
        new Helper(SPEAKERS.SANDY, 0.85, "Howdy ya'll.",
        "media/images/sandy_icon.JPG",
        [SUBJECTS.TECHNOLOGY, SUBJECTS.FITNESS]));
    gameShow.helpers.push(new Helper(SPEAKERS.LARRY, 0.70,
        "Hey, this party's finally starting to pick up.",
        "media/images/larry_icon.JPG",
        [SUBJECTS.FITNESS, SUBJECTS.RUMORS]));
    gameShow.helpers.push(new Helper(SPEAKERS.GARY, 0.80, "Meow.",
        "media/images/gary_icon.JPG",
        [SUBJECTS.PETS, SUBJECTS.ANIMALS]));
}

function setUpGame() {
    setUpQuoteBubble();
    setUpMillionDollarQuestionLabel();
    gameShow.banker.draw(CANVAS_IDS.BANKER);
    gameShow.moneyDisplay.setUp();
    gameShow.briefcaseDisplay.draw();
    gameShow.questions.drawInitialParts();
    gameShow.chooseHelperMenuState.loadCanvases();
    gameShow.lifelines.loadCanvases();
    gameShow.lifelines.draw();

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

/*
    @post title screen has been completely prepared
*/
function drawTitleScreen() {
    var canvas = document.getElementById(CANVAS_IDS.TITLE_SCREEN);
    var ctx = canvas.getContext('2d');

    // Position and draw SpongeBob
    var spongeBob = new Image();
    spongeBob.src = gameShow.titleScreenImageUrls.SPONGEBOB_CHARACTER;
    ctx.drawImage(spongeBob, 80, 50, 207, 250);

    // Position and draw the Deal or No Deal logo
    var logoDeal = new Image();
    logoDeal.src = gameShow.titleScreenImageUrls.DEAL_OR;
    ctx.drawImage(logoDeal, 510, 215, 555, 115);

    // Position and draw the Are You Smarter Than a 5th Grader logo
    var logoFifth = new Image();
    logoFifth.src = gameShow.titleScreenImageUrls.ARE_YOU_SMARTER;
    ctx.drawImage(logoFifth, 500, 340, 232, 180);

    // Position and draw the Who Wants to Be a Millionaire logo
    var logoWho = new Image();
    logoWho.src = gameShow.titleScreenImageUrls.WHO_WANTS;
    ctx.drawImage(logoWho, 800, 340, 198, 180);

    // Position and draw the SpongeBob Squarepants logo
    var logoSponge = new Image();
    logoSponge.src = gameShow.titleScreenImageUrls.SPONGEBOB_SHOW;
    ctx.drawImage(logoSponge, 30, 340, 338, 180);

    // Draw some descriptive words
    ctx.textBaseline = "top";
    ctx.textAlign = "start";
    ctx.font = "60px Arial";
    ctx.fillStyle = "purple";
    ctx.fillText("FUSION OF:", 600, 160);

    // Draw directions
    ctx.fillStyle = "#FFDF00";
    ctx.fillText("Press Enter to Play", 530, 50);
}

function preloadTitleScreenImages() {
    for (var i in gameShow.titleScreenImageUrls)
        addImage(gameShow.titleScreenImageUrls[i]);
    startPreloading(function() {
        setUpTitleScreen();
    });
}

function setUpTitleScreen() {
    drawTitleScreen();
    gameShow.canvasStack.set(CANVAS_IDS.TITLE_SCREEN);

    // Set up the user's ability to go to the game
    gameShow.keyActions.setUpEventHandler()
        .set(KEY_CODES.ENTER, setUpGame);
}

function setUpLoadingScreen() {
    var canvas = document.getElementById(CANVAS_IDS.LOADING_SCREEN);
    var ctx = canvas.getContext('2d');
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "60px Arial";
    ctx.fillStyle = "purple";
    ctx.fillText("Loading...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

function setUpAudio() {
    gameShow.soundPlayer.storeElements();
    gameShow.musicPlayer.storeElements();
}

/*
    From page 28 of "jQuery Game Development Essentials" by
    Selim Arsever

    @post image indicated by the given url has been added to the
    list of images to preload
    @param url location of the image
*/
function addImage(url) {
    if ($.inArray(url, gameShow.imagesToPreload) < 0) {
        gameShow.imagesToPreload.push();
    }
    gameShow.imagesToPreload.push(url);
}

/*
    From pages 28 and 29 of "jQuery Game Development Essentials" by
    Selim Arsever

    @post the preloading of the images has begun
    @param endCallback to call once all the images are loaded
    @param progressCallback (optional) is called with the current
    progress as a percentage
*/
function startPreloading(endCallback, progressCallback) {
    var images = [];
    var total = gameShow.imagesToPreload.length;

    for (var i = 0; i < total; i++) {
        var image = new Image();
        images.push(image);
        image.src = gameShow.imagesToPreload[i];
    }
    var preloadingPoller = setInterval(function() {
        var counter = 0;
        var total = gameShow.imagesToPreload.length;
        for (var i = 0; i < total; i++) {
            if (images[i].complete) {
                counter++;
            }
        }
        if (counter == total) {
            // we are done!
            clearInterval(preloadingPoller);
            endCallback();
        }
        else {
            if (progressCallback) {
                progressCallback((counter / total) * 100);
            }
        }
    }, 100);
};


$(document).ready(function() {
    if (!isUnitTesting()) {
        setUpAudio();
        gameShow.musicPlayer.play(MUSIC_IDS.OPENING);

        setUpLoadingScreen();
        gameShow.canvasStack.set(CANVAS_IDS.LOADING_SCREEN);
        preloadTitleScreenImages();
    }
});