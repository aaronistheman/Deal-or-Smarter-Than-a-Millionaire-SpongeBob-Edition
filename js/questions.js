"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    Note that each of the display ten questions has an assigned
    number; when displayed as options for the user, the numbers
    of the questions are like this:
    [9, 10] - the top of the display; fifth grade questions
    [7, 8] - fourth grade
    [5, 6] - third grade
    [3, 4] - second grade
    [1, 2] - the bottom of the display; first grade questions

    Similarly, the numbers of the answers are like this:
    [1] - choice A
    [2] - choice B
    [3] - choice C
    [4] - choice D
*/

/*
    @pre the canvas indicated by labelGraphicsCanvasId is behind the
    canvas indicated by labelTextCanvasId;
    1 <= numberOfLabelToEmphasize <=
        Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY, or
    numberOfLabelToEmphasize = "none";
    the canvas indicated by answersGraphicsCanvasId is behind the
    canvas indicated by answersTextCanvasId
    @param labelGraphicsCanvasId id of the canvas to draw the non-text
    part of the questions' display on
    @param labelTextCanvasId id of the canvas to draw the text part
    of the questions' display on
    @param numberOfLabelToEmphasize number of the question that
    should have its label emphasized;
    set to "none" to emphasize no question label
    @param answersGraphicsCanvasId id of the canvas to draw
    the non-textual parts of the presentation of a question on
    @param answersTextCanvasId id of the canvas to draw
    the text parts of the presentation of a question on
*/
function Questions(labelGraphicsCanvasId, labelTextCanvasId,
    numberOfLabelToEmphasize, answersGraphicsCanvasId,
    answersTextCanvasId)
{
    // Storages of objects of type Question
    this._tenQuestions = [];
    this._millionDollarQuestion = undefined;

    // Store ten questions for use in the game
    this._generateElevenQuestions();

    // This number indicates which question the user is currently
    // hovering over as he selects a question
    this.numberOfLabelToEmphasize = numberOfLabelToEmphasize;

    // This number represents which answer the user is currently
    // hovering over as he selects an answer
    this.numberOfAnswerToEmphasize = 1;

    // Store canvas data
    this._choosingQuestionCanvases = {
        labelGraphicsCanvasId : labelGraphicsCanvasId,
        labelTextCanvasId : labelTextCanvasId,
    };
    this._choosingAnswerCanvases = {
        answersGraphicsCanvasId : answersGraphicsCanvasId,
        answersTextCanvasId : answersTextCanvasId,
    };
}

Questions.prototype.getQuestions = function() {
    return this._tenQuestions;
};

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY,
    or questionNumber = Questions.MILLION_DOLLAR_QUESTION
    @param questionNumber number of the question to get
    @returns the question among the stored ten questions that is
    indicated by questionNumber
*/
Questions.prototype.getQuestion = function(questionNumber) {
    if (questionNumber !== Questions.MILLION_DOLLAR_QUESTION)
        return this._tenQuestions[questionNumber - 1];
    else
        return this.getMillionDollarQuestion();
};

Questions.prototype.getMillionDollarQuestion = function() {
    return this._millionDollarQuestion;
};

/*
    @post the graphical, rarely redrawn parts of the questions'
    label display and of the presentation of a question have
    been drawn
*/
Questions.prototype.drawInitialParts = function() {
    this._drawLabels();
    this._drawOnlyAnswerRectangles();
}

/*
    @post the two canvases for this purpose have been erased,
    after which the stored questions were drawn in a way so
    that the user could choose which to try to answer; each's
    question's grade level and subject will be displayed
*/
Questions.prototype._drawLabels = function() {
    // Set up the canvas contexts
    var graphicsContext = document.getElementById(
        this._choosingQuestionCanvases.labelGraphicsCanvasId).getContext('2d');
    var textContext = this._getLabelTextContext();

    // Iterate to draw each question label
    for (var i = 0; i < Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY; ++i) {
        var position = Questions._getLabelPosition(i + 1);
        this._drawQuestionLabel(graphicsContext, textContext,
            position.x, position.y, (i + 1));
    }
};

/*
    @pre 1 <= number <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY
    @post question label has been drawn in the given position; the
    graphical part is on graphicsContext; the textual part is on
    is on textContext
    @param graphicsContext context of the canvas to draw
    the graphical label on
    @param textContext set up context of the canvas to draw the
    label's text on
    @param x top left x-coordinate of the label's reserved space
    @param y top left y-coordinate of the label's reserved space
    @param number of the question label
*/
Questions.prototype._drawQuestionLabel =
    function(graphicsContext, textContext, x, y, number)
{
    graphicsContext.fillStyle = this._getLabelFillStyle(number);
    textContext.fillStyle = this._getLabelTextFillStyle(number);
    var text = Questions._getLabelText(this._tenQuestions[number - 1]);

    // Draw the graphical label; shape it differently if the
    // label is supposed to be emphasized
    if (number !== this.numberOfLabelToEmphasize) {
        var circularEdgeRadius = Questions.LABEL_DIMENSIONS.y / 2.0;
        graphicsContext.fillRect(
            x + circularEdgeRadius,
            y,
            Questions.LABEL_DIMENSIONS.x - (2 * circularEdgeRadius),
            Questions.LABEL_DIMENSIONS.y);
        // Draw the circular edges
        this._drawCircularEdgeOfLabel(
            graphicsContext,
            x + circularEdgeRadius,
            y + circularEdgeRadius,
            circularEdgeRadius,
            Math.PI * 0.5,
            Math.PI * 1.5);
        this._drawCircularEdgeOfLabel(
            graphicsContext,
            x + Questions.LABEL_DIMENSIONS.x - circularEdgeRadius,
            y + circularEdgeRadius,
            circularEdgeRadius,
            Math.PI * 1.5,
            Math.PI * 0.5);
    }
    else {
        // Emphasized question's label has no circular edges
        graphicsContext.fillRect(x, y, Questions.LABEL_DIMENSIONS.x,
            Questions.LABEL_DIMENSIONS.y);
    }

    // Draw the text of the label only of unanwered questions
    if (!this._tenQuestions[number - 1].answered) {
        textContext.fillText(text,
            x + (Questions.LABEL_DIMENSIONS.x / 2.0),
            y + (Questions.LABEL_DIMENSIONS.y / 2.0));
    }
};

/*
    @pre 1 <= number <= Questions.NUMBER_OF_ANSWERS
    @returns the fill style appropriate for the indicated
    answer rectangle, based on whether or not the answer is
    emphasized
*/
Questions.prototype._getAnswerRectangleFillStyle = function(number) {
    if (number === this.numberOfAnswerToEmphasize)
        return "white";
    else
        return "#484848";
}

/*
    @pre 1 <= number <= Questions.NUMBER_OF_ANSWERS
    @returns the fill style appropriate for the indicated
    answer's text, based on whether or not the answer is
    emphasized
*/
Questions.prototype._getAnswerRectangleTextFillStyle =
    function(number)
{
    if (number === this.numberOfAnswerToEmphasize)
        return "black";
    else
        return "white";
}

/*
    @param number of the question label to get the fill style of
    @returns fillStyle for the context to draw the graphical
    labels on
*/
Questions.prototype._getLabelFillStyle = function(number) {
    // Color the emphasized question's label differently
    if (number === this.numberOfLabelToEmphasize)
        return "white";

    // Color answered questions' labels differently
    if (this._tenQuestions[number - 1].answered)
        return "black";

    var grade = this._tenQuestions[number - 1].grade;
    switch (grade) {
        case GRADES.FIRST:
            return "green";
        case GRADES.SECOND:
            return "brown";
        case GRADES.THIRD:
            return "#4B0082";
        case GRADES.FOURTH:
            return "#DAA520";
        case GRADES.FIFTH:
            return "#800000";
    }
};

/*
    @post a rectangle has been cleared in the canvases indicated by
    the given contexts, so that the question label contained in
    that rectangle will have been erased
    @param graphicsContext context of the canvas to erase
    the graphical label from
    @param textContext context of the canvas to erase the
    label's text from
    @param x top left x-coordinate of the label's reserved space
    @param y top left y-coordinate of the label's reserved space
*/
Questions.prototype._eraseQuestionLabel =
    function(graphicsContext, textContext, x, y)
{
    graphicsContext.clearRect(x, y,
        Questions.LABEL_DIMENSIONS.x,
        Questions.LABEL_DIMENSIONS.y);
    textContext.clearRect(x, y,
        Questions.LABEL_DIMENSIONS.x,
        Questions.LABEL_DIMENSIONS.y);
}

/*
    @param graphicsContext to use for drawing
    @param x position of arc's center
    @param y position of arc's center
    @param arcRadius
    @param startingAngle of the arc
    @param endingAngle
*/
Questions.prototype._drawCircularEdgeOfLabel =
    function(graphicsContext, x, y, arcRadius, startingAngle,
        endingAngle)
{
    graphicsContext.beginPath();
    graphicsContext.arc(x, y, arcRadius, startingAngle, endingAngle);
    graphicsContext.closePath();
    graphicsContext.fill();
};

/*
    @returns canvas context that is set up in all ways
    except for position regarding where to draw
*/
Questions.prototype._getLabelTextContext = function() {
    var textContext = document.getElementById(
        this._choosingQuestionCanvases.labelTextCanvasId)
            .getContext('2d');
    textContext.font = "30px Arial";
    textContext.textAlign = "center";
    return textContext;
};

/*
    @param number of the question label
    @returns fill style for the context of the canvas to draw
    the text of the question label on
*/
Questions.prototype._getLabelTextFillStyle = function(number) {
    if (number === this.numberOfLabelToEmphasize) {
        // Color differently the text of emphasized question label
        return "black";
    }
    else
        return "white";
};

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY
    @post the indicated question has been set to answered; its
    label has been redrawn with a blackening
    @param questionNumber number of the question whose label
    the fade will be applied to and that will have its
    member variable 'answered' set to true
*/
Questions.prototype.setAnswered = function(questionNumber) {
    // Only act if the question hasn't been set to having
    // been answered
    if (!this.isAnswered(questionNumber)) {
        this._tenQuestions[questionNumber - 1].answered = true;

        // Set up variables for redrawing
        var graphicsContext = document.getElementById(
            this._choosingQuestionCanvases.labelGraphicsCanvasId)
            .getContext('2d');
        var textContext = document.getElementById(
            this._choosingQuestionCanvases.labelTextCanvasId)
            .getContext('2d');
        var position = Questions._getLabelPosition(questionNumber);

        // Erase and redraw the question label
        this._eraseQuestionLabel(graphicsContext, textContext,
            position.x, position.y);
        this._drawQuestionLabel(graphicsContext, textContext,
            position.x, position.y, questionNumber);
    }
};

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY
    @param questionNumber number of the question to check
    @returns true if the question indicated by questionNumber
    has been answered; false, otherwise
*/
Questions.prototype.isAnswered = function(questionNumber) {
    return this._tenQuestions[questionNumber - 1].answered;
};

/*
    @pre 1 <= newNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY
    @post this.numberOfLabelToEmphasize has been updated; formerly
    emphasized question label has been redrawn so that it's no
    longer emphasized; now emphasized question label has been
    redrawn so that it's emphasized
    @param newNumber new number of question label to emphasize;
    set to "none" to emphasize no question
*/
Questions.prototype.setEmphasizedLabel = function(newNumber) {
    // Set up variables
    var graphicsContext = document.getElementById(
        this._choosingQuestionCanvases.labelGraphicsCanvasId)
            .getContext('2d');
    var textContext = document.getElementById(
        this._choosingQuestionCanvases.labelTextCanvasId)
            .getContext('2d');
    var oldNumber = this.numberOfLabelToEmphasize;

    // Determine positions of formerly emphasized case and now
    // emphasized case
    if (oldNumber !== "none")
        var oldPosition = Questions._getLabelPosition(oldNumber);
    if (newNumber !== "none")
        var newPosition = Questions._getLabelPosition(newNumber);

    // Update numberOfLabelToEmphasize
    this.numberOfLabelToEmphasize = newNumber;

    // Redraw the formerly emphasized question label
    if (oldNumber !== "none") {
        this._eraseQuestionLabel(graphicsContext, textContext,
            oldPosition.x, oldPosition.y);
        this._drawQuestionLabel(graphicsContext, textContext,
            oldPosition.x, oldPosition.y, oldNumber);
    }

    // Redraw the now emphasized question label
    if (newNumber != "none") {
        this._eraseQuestionLabel(graphicsContext, textContext,
            newPosition.x, newPosition.y);
        this._drawQuestionLabel(graphicsContext, textContext,
            newPosition.x, newPosition.y, newNumber);
    }
}

/*
    @pre this.numberOfLabelToEmphasize != "none"
    @hasTest yes
    @returns number of label to the left of the currently emphasized
    label; if there is no such number of a label of an unanswered
    question, or if a label on the left is already emphasized,
    undefined is returned
*/
Questions.prototype._getNumberOfLeftwardLabelToEmphasize = function() {
    var potentiallyNowEmphasizedLabel =
        (this.numberOfLabelToEmphasize - 1);

    // Return the found label number if the already emphasized label
    // is on the right and the found label isn't of an answered
    // question
    if (this.numberOfLabelToEmphasize % 2 === 0 &&
        !this.isAnswered(potentiallyNowEmphasizedLabel))
    {
        return potentiallyNowEmphasizedLabel;
    }

    return undefined;
};

/*
    @pre this.numberOfLabelToEmphasize != "none"
    @hasTest yes
    @returns number of label to the right of the currently emphasized
    label; if there is no such number of a label of an unanswered
    question, or if a label on the right is already emphasized,
    undefined is returned
*/
Questions.prototype._getNumberOfRightwardLabelToEmphasize = function() {
    var potentiallyNowEmphasizedLabel =
        (this.numberOfLabelToEmphasize + 1);

    // Return the found label number if the already emphasized label
    // is on the left and the found label isn't of an answered
    // question
    if (this.numberOfLabelToEmphasize % 2 === 1 &&
        !this.isAnswered(potentiallyNowEmphasizedLabel))
    {
        return potentiallyNowEmphasizedLabel;
    }

    return undefined;
};

/*
    @pre this.numberOfLabelToEmphasize != "none"
    @hasTest yes
    @returns number of the first label below (in either column,
    starting on the column of the currently emphasized label) the
    currently emphasized label that is of an unanswered question; if no
    such label exists, or if the lowest label is already
    emphasized, undefined is returned
*/
Questions.prototype._getNumberOfLowerLabelToEmphasize = function() {
    // Only act if a lowest label isn't already emphasized
    if (this.numberOfLabelToEmphasize >= 3) {
        var isCurrentlyEmphasizedLabelOnLeft =
            (this.numberOfLabelToEmphasize % 2 === 1);
        var potentiallyNowEmphasizedLabel =
            this.numberOfLabelToEmphasize - 2;

        // If label immediately below is of answered question,
        // look at labels below in both columns
        while (potentiallyNowEmphasizedLabel >= 1 &&
            this.isAnswered(potentiallyNowEmphasizedLabel))
        {
            if (isCurrentlyEmphasizedLabelOnLeft) {
                if (potentiallyNowEmphasizedLabel % 2 === 1)
                    potentiallyNowEmphasizedLabel += 1;
                else
                    potentiallyNowEmphasizedLabel -= 3;
            }
            else
                potentiallyNowEmphasizedLabel -= 1;
        }

        // Make sure an existing label was designated
        if (potentiallyNowEmphasizedLabel >= 1)
            return potentiallyNowEmphasizedLabel;
    }

    return undefined;
};

/*
    @pre this.numberOfLabelToEmphasize != "none"
    @hasTest yes
    @returns number of the first label above the currently
    emphasized label that is of an unanswered question; if no
    such label exists, or if the uppermost label is already
    emphasized, undefined is returned

*/
Questions.prototype._getNumberOfHigherLabelToEmphasize = function() {
    // Only act if a highest label isn't already emphasized
    if (this.numberOfLabelToEmphasize <= 8) {
        var isCurrentlyEmphasizedLabelOnLeft =
            (this.numberOfLabelToEmphasize % 2 === 1);
        var potentiallyNowEmphasizedLabel =
            this.numberOfLabelToEmphasize + 2;

        // If label immediately above is of answered question,
        // look at labels above in both columns
        while (potentiallyNowEmphasizedLabel <= 10 &&
            this.isAnswered(potentiallyNowEmphasizedLabel))
        {
            if (isCurrentlyEmphasizedLabelOnLeft)
                potentiallyNowEmphasizedLabel += 1;
            else {
                if (potentiallyNowEmphasizedLabel % 2 === 1)
                    potentiallyNowEmphasizedLabel += 3;
                else
                    potentiallyNowEmphasizedLabel -= 1;
            }
        }

        // Make sure an existing label was designated
        if (potentiallyNowEmphasizedLabel <= 10)
            return potentiallyNowEmphasizedLabel;
    }

    return undefined;
};

/*
    @pre parameter direction has any of the following values: "left",
    "right", "up", "down"
    @post if practical, a label in the indicated direction was emphasized
    (and the once currently emphasized label is no longer emphasized);
    if there isn't a label of an unanswered in the indicated direction,
    nothing happens
    @param direction
    @returns true if a different label was emphasized; false otherwise
    @throws a string if invalid parameter
*/
Questions.prototype.emphasizeDifferentLabel = function(direction) {
    var labelToEmphasize = undefined;
    if (direction === "left")
        labelToEmphasize = this._getNumberOfLeftwardLabelToEmphasize();
    else if (direction === "right")
        labelToEmphasize = this._getNumberOfRightwardLabelToEmphasize();
    else if (direction === "up")
        labelToEmphasize = this._getNumberOfHigherLabelToEmphasize();
    else if (direction === "down")
        labelToEmphasize = this._getNumberOfLowerLabelToEmphasize();
    else {
        alertAndThrowException(
            "Invalid parameter passed to emphasizeDifferentLabel()");
    }

    if (labelToEmphasize !== undefined) {
        this.setEmphasizedLabel(labelToEmphasize);
        return true;
    }
    else
        return false;
};

/*
    @pre not all the first ten questions have been answered
    @post the emphasis has been placed on the label of the first
    unanswered question, starting from the first question's label
*/
Questions.prototype.emphasizeFirstAvailableLabel = function() {
    // Find the number of the first available label
    var first = undefined;
    for (var i = 1; i <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY; ++i) {
        if (!this.isAnswered(i)) {
            first = i;
            break;
        }
    }

    this.setEmphasizedLabel(first);
};

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY;
    1 <= numberOfNewAnswerToEmphasize <=
    Questions.NUMBER_OF_ANSWERS
    @post this.numberOfAnswerToEmphasize has been updated; formerly
    emphasized answer rectangle has been redrawn so that it's no
    longer emphasized; now emphasized answer rectangle has been
    redrawn so that it's emphasized
    @param questionNumber
    @param numberOfNewAnswerToEmphasize new number of answer to
    emphasize; set to "none" to emphasize no answer
*/
Questions.prototype.setEmphasizedAnswer =
    function(quesitonNumber, numberOfNewAnswerToEmphasize) {
    // Set up variables
    var graphicsContext = document.getElementById(
        this._choosingAnswerCanvases.answersGraphicsCanvasId)
            .getContext('2d');
    var textContext = document.getElementById(
        this._choosingAnswerCanvases.answersTextCanvasId)
            .getContext('2d');
    Questions.setUpAnswersTextContext(textContext);
    var oldNumber = this.numberOfAnswerToEmphasize;
    var newNumber = numberOfNewAnswerToEmphasize;

    // Determine positions of formerly emphasized case and now
    // emphasized case
    if (oldNumber !== "none")
        var oldPosition = Questions._getAnswerPosition(oldNumber);
    if (newNumber !== "none")
        var newPosition = Questions._getAnswerPosition(newNumber);

    // Update numberOfLabelToEmphasize
    this.numberOfAnswerToEmphasize = newNumber;

    // Redraw the formerly emphasized question label
    if (oldNumber !== "none") {
        this._eraseAnswer(graphicsContext, textContext,
            oldPosition.x, oldPosition.y);
        this._drawAnswer(graphicsContext, textContext,
            oldPosition.x, oldPosition.y, quesitonNumber, oldNumber);
    }

    // Redraw the now emphasized question label
    if (newNumber != "none") {
        this._eraseAnswer(graphicsContext, textContext,
            newPosition.x, newPosition.y);
        this._drawAnswer(graphicsContext, textContext,
            newPosition.x, newPosition.y, quesitonNumber, newNumber);
    }
}

/*
    @pre this.numberOfAnswerToEmphasize != "none"
    @post the emphasis has been placed on the answer below
    the currently emphasized answer; if the lowest answer
    is already emphasized, nothing happens
    @param questionNumber
*/
Questions.prototype.emphasizeDownAnswer = function(questionNumber) {
    if (this.numberOfAnswerToEmphasize < 4)
        this.setEmphasizedAnswer(questionNumber,
            this.numberOfAnswerToEmphasize + 1);
};

/*
    @pre this.numberOfAnswerToEmphasize != "none"
    @post the emphasis has been placed on the answer above
    the currently emphasized answer; if the uppermost answer
    is already emphasized, nothing happens
    @param questionNumber
*/
Questions.prototype.emphasizeUpAnswer = function(questionNumber) {
    if (this.numberOfAnswerToEmphasize > 1)
        this.setEmphasizedAnswer(questionNumber,
            this.numberOfAnswerToEmphasize - 1);
};

/*
    @post a rectangle has been cleared in the canvases indicated by
    the given contexts, so that the answer once shown in
    that rectangle will have been erased
    @param graphicsContext context of the canvas to erase
    the answer's visible rectangle from
    @param textContext context of the canvas to erase the
    answer's text from
    @param x top left x-coordinate of the answer's reserved space
    @param y top left y-coordinate of the answer's reserved space
*/
Questions.prototype._eraseAnswer =
    function(graphicsContext, textContext, x, y)
{
    graphicsContext.clearRect(x, y,
        Questions.ANSWER_DIMENSIONS.x,
        Questions.ANSWER_DIMENSIONS.y);
    textContext.clearRect(x, y,
        Questions.ANSWER_DIMENSIONS.x,
        Questions.ANSWER_DIMENSIONS.y);
}

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY;
    1 <= answerNumber <= Questions.NUMBER_OF_ANSWERS
    @post answer has been drawn in the given position; the
    graphical part is on graphicsContext; the textual part is on
    is on textContext
    @param graphicsContext context of the canvas to draw
    the answer's on
    @param textContext set up context of the canvas to draw the
    answer's text on
    @param x top left x-coordinate of the answer's reserved space
    @param y top left y-coordinate of the answer's reserved space
    @param answerNumber
*/
Questions.prototype._drawAnswer =
    function(graphicsContext, textContext, x, y, questionNumber,
        answerNumber)
{
    var position = Questions._getAnswerPosition(answerNumber);

    this._drawAnswerRectangle(graphicsContext, position.x,
        position.y, answerNumber);
    this._drawAnswerText(textContext, x, y, questionNumber,
        answerNumber);
};

/*
    @pre this._tenQuestions.length = 0;
    this._millionDollarQuestion = undefined
    @post the helper functions to generate eleven appropriate
    questions have been called
*/
Questions.prototype._generateElevenQuestions = function() {
    var supply = Questions.getEntireSupplyOfQuestions();
    this._generateTenQuestions(supply);
    this._setMillionDollarQuestion(supply);
};

/*
    @pre this._tenQuestions.length = 0
    @post this._tenQuestions contains ten instances of type Question;
    each of these instances has a different subject matter; two
    questions of the ten are attached to each grade level from
    one to five, and these ten questions are sorted by grade level;
    all questions in parameter supply that have subject matters of
    picked questions have been removed
    @hasTest yes
    @param supply array of instances of Question; the supply of
    questions to edit and choose from
*/
Questions.prototype._generateTenQuestions = function(supply) {
    var tenQuestions = [];

    /*
        @pre for the given grade level, supplyOfQuestions contains at
        least two questions of different subject matters; otherwise,
        an infinite loop will occur
        @post two questions of the given grade from supplyOfQuestions
        have been put in tenQuestions; these two questions don't
        have the same subject; after a question is put in tenQuestions,
        every question in supplyOfQuestions that has the question's
        subject matter will be removed
        @param supplyOfQuestions
        @param grade the grade level of the questions to pick from;
        has no effect on which questions are erased
    */
    var pickTwoQuestions = function(supplyOfQuestions, grade) {
        var numberOfQuestionsAdded = 0;
        while (numberOfQuestionsAdded < 2) {
            var randomIndex =
                Math.floor((Math.random() * supplyOfQuestions.length));

            // Only add the question indicated by randomIndex if the
            // grade level is correct
            if (supplyOfQuestions[randomIndex].grade === grade) {
                var questionToAdd =
                    supplyOfQuestions.splice(randomIndex, 1).pop();
                tenQuestions.push(questionToAdd);
                ++numberOfQuestionsAdded;

                // Erase all questions that have this question's subject
                // matter
                var subjectToErase = questionToAdd.subject;
                for (var i = 0; i < supplyOfQuestions.length; ) {
                    if (supplyOfQuestions[i].subject === subjectToErase)
                        supplyOfQuestions.splice(i, 1);
                    else
                        ++i;
                }
            }
        }
    };

    pickTwoQuestions(supply, GRADES.FIRST);
    pickTwoQuestions(supply, GRADES.SECOND);
    pickTwoQuestions(supply, GRADES.THIRD);
    pickTwoQuestions(supply, GRADES.FOURTH);
    pickTwoQuestions(supply, GRADES.FIFTH);

    this._tenQuestions = tenQuestions;
}

/*
    @pre none of the questions in parameter supply have the same
    subject as any of the questions in this._tenQuestions
    @post this._millionDollarQuestion contains a question of
    the appropriate grade (GRADES.MILLION)
    @hasTest yes
    @param supply array of instances of Question; the supply of
    questions to edit and choose from
*/
Questions.prototype._setMillionDollarQuestion = function(supply) {
    var randomIndex = Math.floor((Math.random() * supply.length));

    // Only add the question indicated by randomIndex when the
    // grade level is correct
    while (supply[randomIndex].grade !== GRADES.MILLION) {
        randomIndex = Math.floor((Math.random() * supply.length));
    }

    var questionToAdd = supply.splice(randomIndex, 1).pop();
    this._millionDollarQuestion = questionToAdd;
}

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY,
    or questionNumber = Questions.MILLION_DOLLAR_QUESTION
    @post the text of the question indicated by questionNumber and
    of that question's answers has been drawn
    @param questionNumber
*/
Questions.prototype.drawQuestionAndAnswersText =
    function(questionNumber)
{
    this._drawQuestionText(questionNumber);
    this._drawAnswersText(questionNumber);
}

/*
    @post the text of the displayed question and its answers has
    been erased
*/
Questions.prototype.eraseQuestionAndAnswersText = function() {
    var canvas = document.getElementById(
        this._choosingAnswerCanvases.answersTextCanvasId);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY,
    or questionNumber = Questions.MILLION_DOLLAR_QUESTION
    @post the text of the question indicated by questionNumber
    has been drawn in a good area and properly formatted
    @param questionNumber
    @throws string if the question can't be fit in the designated
    space with the used font type, style, and size
*/
Questions.prototype._drawQuestionText = function(questionNumber) {
    // Variables that help with positioning
    var fontSize = 30;
    var verticalSpaceBetweenWords = 5;
    var sideMargin = 100;
    var allocatedWidthForQuestionDisplay = 800;
    // var topMargin = 100;
    var topMargin = 30;
    var x = 300 + sideMargin;
    var y = topMargin;

    // Set up canvas context
    var ctx = document.getElementById(
        this._choosingAnswerCanvases.answersTextCanvasId)
        .getContext('2d');
    ctx.fillStyle = "white";
    // ctx.font = fontSize + "px 'Rock Salt'";
    ctx.font = fontSize + "px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Get question text
    if (questionNumber === Questions.MILLION_DOLLAR_QUESTION)
        var text = this._millionDollarQuestion.text;
    else
        var text = this._tenQuestions[questionNumber - 1].text;

    // Draw the question
    var textPieces = convertCanvasTextIntoSmallerPieces(ctx, text,
        allocatedWidthForQuestionDisplay - (sideMargin * 2));
    for (var i in textPieces) {
        // Throw exception if question is too big
        if (y >= (275 - (fontSize + verticalSpaceBetweenWords))) {
            alertAndThrowException(
                "Question can't be fit in its designated space");
        }

        ctx.fillText(textPieces[i], x, y);

        // Update x and y
        y += (fontSize + verticalSpaceBetweenWords);
    }
};

/*
    @post the four rectangles that would encompass the four
    choosable answers to a question have been drawn
*/
Questions.prototype._drawOnlyAnswerRectangles = function() {
    // Set up canvas contexts
    var graphicsContext = document.getElementById(
        this._choosingAnswerCanvases.answersGraphicsCanvasId)
        .getContext('2d');

    for (var i = 0; i < 4; ++i) {
        var position = Questions._getAnswerPosition(i + 1);
        this._drawAnswerRectangle(graphicsContext,
            position.x, position.y, i + 1);
    }
}

/*
    @pre 1 <= answerNumber <= Questions.NUMBER_OF_ANSWERS
    @post the rectangle of the answer indicated by
    answerNumber has been drawn
    @param graphicsContext context of the canvas to draw
    the rectangle on
    @param x
    @param y
    @param answerNumber
*/
Questions.prototype._drawAnswerRectangle =
    function(graphicsContext, x, y, answerNumber)
{
    graphicsContext.fillStyle =
        this._getAnswerRectangleFillStyle(answerNumber);
    graphicsContext.fillRect(x, y,
        Questions.ANSWER_DIMENSIONS.x,
        Questions.ANSWER_DIMENSIONS.y);
}

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY,
    or questionNumber = Questions.MILLION_DOLLAR_QUESTION
    @post the selectable answers to the question indicated by
    questionNumber have been drawn in a good area and properly formatted
    @param questionNumber
*/
Questions.prototype._drawAnswersText = function(questionNumber) {
    // Set up canvas context
    var ctx = document.getElementById(
        this._choosingAnswerCanvases.answersTextCanvasId)
        .getContext('2d');
    Questions.setUpAnswersTextContext(ctx);

    for (var i = 0; i < 4; ++i) {
        var position = Questions._getAnswerPosition(i + 1);
        this._drawAnswerText(ctx, position.x, position.y,
            questionNumber, (i + 1));
    }
}

/*
    @pre 1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY,
    or questionNumber = Questions.MILLION_DOLLAR_QUESTION;
    1 <= answerNumber <= Questions.NUMBER_OF_ANSWERS
    @post the text of the answer indicated by
    questionNumber and answerNumber has been drawn
    @param textNumber context of the canvas to draw the text on
    @param x of top left point of the answer's rectangle (not its
    text)
    @param y (see @param x)
    @param questionNumber
    @param answerNumber
    @throws string if the answer is too long to draw in its
    designated area
*/
Questions.prototype._drawAnswerText =
    function(textContext, x, y, questionNumber, answerNumber)
{
    // Give the text the correct color
    textContext.fillStyle =
        this._getAnswerRectangleTextFillStyle(answerNumber);

    // Set up the text to draw
    if (questionNumber === Questions.MILLION_DOLLAR_QUESTION) {
        var answerText = this._millionDollarQuestion.
            answerData.arrayOfAnswers[answerNumber - 1];
    }
    else {
        var answerText = this._tenQuestions[questionNumber - 1]
            .answerData.arrayOfAnswers[answerNumber - 1];
    }
    var text = Questions.getAnswerLetter(answerNumber) + answerText;


    // Throw an exception of the text is too long
    if ((Questions.ANSWER_TEXT_INDENT +
        textContext.measureText(text).width) >
        Questions.ANSWER_DIMENSIONS.x)
    {
        alertAndThrowException(
            "answer #" + answerNumber + " of 4 can't " +
            "be fit in its designated space");
    }

    textContext.fillText(text, x + Questions.ANSWER_TEXT_INDENT, y);
}

/*
    Static methods and/or members
*/

Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY = 10;
Questions.NUMBER_OF_ANSWERS = 4;
Questions.MILLION_DOLLAR_QUESTION = 100;

// For positioning the question labels
Questions.HEIGHT_SPACE_PER_LABEL = 410 / 5;
Questions.LABEL_DIMENSIONS = new Vector2d(450, 52);
Questions.LABEL_PADDING =
    new Vector2d(100,
        Questions.HEIGHT_SPACE_PER_LABEL -
            Questions.LABEL_DIMENSIONS.y);
// space needed to jump from point on one label to exact same
// point of adjacent label
Questions.MARGINAL_LABEL_POSITION =
    Questions.LABEL_DIMENSIONS.getSum(Questions.LABEL_PADDING);
Questions.FIRST_LABEL_POSITION = new Vector2d(
    (Questions.LABEL_PADDING.x / 2),
    Questions.LABEL_PADDING.y +
        (4 * Questions.MARGINAL_LABEL_POSITION.y));

// For positioning the display of a question and its answers
Questions.ANSWERS_FONT_SIZE = 30;
Questions.VERTICAL_SPACE_BETWEEN_ANSWERS = 5;
Questions.ANSWER_DIMENSIONS =
    new Vector2d(1080,
        (65 - Questions.VERTICAL_SPACE_BETWEEN_ANSWERS));
Questions.FIRST_ANSWER_POSITION = new Vector2d(10, 285);
Questions.MARGINAL_ANSWER_POSITION = new Vector2d(0,
    (Questions.ANSWERS_FONT_SIZE * 2) +
        Questions.VERTICAL_SPACE_BETWEEN_ANSWERS);
Questions.ANSWER_TEXT_INDENT = 30;

Questions.ANSWER_LETTERS = ['A', 'B', 'C', 'D'];

/*
    @pre 1 <= answerNumber <= Questions.NUMBER_OF_ANSWERS
    @param answerNumber
    @returns the appropriate answer letter (and additional whitespace)
    to append to the front of a displayed answer
*/
Questions.getAnswerLetter = function(answerNumber) {
    return '(' + Questions.ANSWER_LETTERS[answerNumber - 1] + ")    ";
}

/*
    @hasTest yes
    @param questionNumber number of the label to get the position of;
    1 <= questionNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY
    @returns Vector2d object containing the top-left position at which
    to draw the question label (on the appropriate canvases)
*/
Questions._getLabelPosition = function(questionNumber) {
    // Decide how much to adjust the default label position
    var multiplierX = ((questionNumber - 1) % 2);
    var multiplierY = -1 * (Math.ceil(questionNumber / 2.0) - 1);
    var adjustment = new Vector2d(multiplierX, multiplierY);

    return Questions.FIRST_LABEL_POSITION.getSum(
        Questions.MARGINAL_LABEL_POSITION.getProduct(adjustment));
}

/*
    @pre 1 <= answerNumber <= 4
    @hasTest yes
    @returns Vector2d object containing the top left coordinate
    of the space designated for the answer indicated by
    answerNumber of the four answers
*/
Questions._getAnswerPosition = function(answerNumber) {
    return Questions.FIRST_ANSWER_POSITION.getSum(
        Questions.MARGINAL_ANSWER_POSITION.getProduct(
            new Vector2d(0, (answerNumber - 1))));
}

/*
    @param question instance of Questoin
    @returns text to display on the question's label
*/
Questions._getLabelText = function(question) {
    var text = "";

    // Put the grade on the text
    switch (question.grade) {
        case GRADES.FIRST:
            text += "1st Grade ";
            break;
        case GRADES.SECOND:
            text += "2nd Grade ";
            break;
        case GRADES.THIRD:
            text += "3rd Grade ";
            break;
        case GRADES.FOURTH:
            text += "4th Grade ";
            break;
        case GRADES.FIFTH:
            text += "5th Grade ";
            break;
    }

    // Put the question's subject on the text
    text += question.subject;

    return text;
};

/*
    @post textContext has been set up for drawing the text of answers
    @param textContext to set up
*/
Questions.setUpAnswersTextContext = function(textContext) {
    textContext.font = Questions.ANSWERS_FONT_SIZE + "px 'Arial'";
    textContext.textAlign = "left";
    textContext.textBaseline = "top";
}

/*
    @hasTest yes (the test checks that the questions and
    answers would fit in their designated areas)
    @returns an array of instances of Question so that this array
    contains all of the questions that the user could possible face;
    there are at least eleven million dollar questions of different
    subjects, ten questions of different subjects for fifth
    grade, at least eight of such questions for fourth grade,
    at least six of such questions for third grade, at least four
    of such questions for second grade, and at least two of
    such questions for first grade (this prevents an infinite loop
    in Questions._generateElevenQuestions()); each question and answer
    should be able to fit in the display, although this depends
    on the font
*/
Questions.getEntireSupplyOfQuestions = function() {
    var supply = [];

    // To make the answer data below more readable
    var ANSWERS = {
        FIRST : 0,
        SECOND : 1,
        THIRD : 2,
        FOURTH : 3,
    };

    // Questions are ordered by grade and placed between
    // the appropriate grade dividers

    /*
        First grade questions
    */
    var gradeOfQuestion = GRADES.FIRST;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.PETS,
        "Who owns Gary?",
        new AnswerData(ANSWERS.THIRD, ["Patrick", "Squidward",
            "SpongeBob", "Sandy"]),
        new AudienceData(0.08, 0.03, 0.88, 0.01)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.PETS,
        "What is the name of SpongeBob's snail?",
        new AnswerData(ANSWERS.FOURTH, ["Sheldon", "Jerry",
            "Cornelius", "Gary"]),
        new AudienceData(0.02, 0.06, 0.01, 0.91)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters has tried to steal " +
        "a recipe from Mr. Krabs?",
        new AnswerData(ANSWERS.FOURTH, ["Mrs. Puff", "Sandy",
            "Barnacle Boy", "Plankton"]),
        new AudienceData(0, 0, 0.01, 0.99)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.GEOGRAPHY,
        "Which of the following areas is at a much lower elevation " +
        "than Glove World?",
        new AnswerData(ANSWERS.FIRST, ["Rock Bottom", "Shell City",
            "Patrick's house", "Krusty Krab"]),
        new AudienceData(0.84, 0.10, 0.03, 0.03)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RESTAURANTS,
        "Which of the following is a restaurant in Bikini " +
        "Bottom?",
        new AnswerData(ANSWERS.SECOND, ["Goo Lagoon", "Krusty Krab",
            "Pizza Hut", "The Wash"]),
        new AudienceData(0.04, 0.95, 0.01, 0.00)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "What species is Plankton's wife?",
        new AnswerData(ANSWERS.THIRD, ["Sea Bear", "Lamp",
            "Computer", "Stove"]),
        new AudienceData(0.06, 0.04, 0.89, 0.01)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "What is SpongeBob's catchphrase?",
        new AnswerData(ANSWERS.FOURTH, ["Howdy ya'll.",
            "Time is money.", "What a beautiful day.", "I'm ready."]),
        new AudienceData(0.02, 0, 0.04, 0.94)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VEHICLES,
        "Which of the following vehicles " +
        "is driven by Mermaid Man?",
        new AnswerData(ANSWERS.FIRST, ["Invisible Boatmobile",
            "Underwater Heartbreaker", "Patty Wagon", "bus"]),
        new AudienceData(0.90, 0.02, 0.07, 0.01)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.SIDE_CHARACTERS,
        "Which of the following characters is not a friend of SpongeBob?",
        new AnswerData(ANSWERS.SECOND, ["Mermaid Man", "Dennis",
            "Stanley", "Bubble Buddy"]),
        new AudienceData(0, 0.68, 0.24, 0.08)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.GEOGRAPHY,
        "Which of the following is a beach in Bikini Bottom?",
        new AnswerData(ANSWERS.THIRD, ["Galleria Diphteria",
            "Bikini Atoll", "Goo Lagoon", "Weenie Hut Jr."]),
        new AudienceData(0.02, 0.12, 0.85, 0.01)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In which of the following episodes did Plankton first appear?",
        new AnswerData(ANSWERS.FOURTH, ["F.U.N.", "Culture Shock",
            "Welcome to the Chum Bucket", "Plankton!"]),
        new AudienceData(0.01, 0.01, 0.19, 0.79)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "Which of the following episodes has a " +
        "scene in which Mr. Krabs asks for a pony for Christmas?",
        new AnswerData(ANSWERS.FIRST, ["Christmas Who?", "Shanghaied",
            "Welcome to the Chum Bucket", "One Krab's Trash"]),
        new AudienceData(0.93, 0, 0, 0.07)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VIDEO_GAMES,
        "On which of the following has a SpongeBob video game never " +
        "been released?",
        new AnswerData(ANSWERS.SECOND, ["Xbox 360", "Virtual Boy",
            "Game Boy Advance", "GameCube"]),
        new AudienceData(0.05, 0.86, 0.05, 0.04)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MAIN_CHARACTERS,
        "Which of the following is Squidward's last name?",
        new AnswerData(ANSWERS.THIRD, ["Tennisballs", "Tentpoles",
            "Tentacles", "Tortellini"]),
        new AudienceData(0, 0.01, 0.99, 0)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MAIN_CHARACTERS,
        "Which of the following characters mostly only ever says 'meow'?",
        new AnswerData(ANSWERS.FOURTH, ["Sandy", "Mermaid Man", "Karen",
            "Gary"]),
        new AudienceData(0, 0, 0, 1)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MUSIC,
        "What was the name of the song that SpongeBob sang in " +
        "'The Camping Episode'?",
        new AnswerData(ANSWERS.SECOND, ["Campfire Song",
            "Campfire Song Song", "Campfire Song Song Song",
            "Sweet Victory"]),
        new AudienceData(0.26, 0.42, 0.30, 0.02)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MUSIC,
        "Which of the following instruments is played most by Squidward?",
        new AnswerData(ANSWERS.THIRD, ["drums", "triangle", "clarinet",
            "mayonnaise"]),
        new AudienceData(0.03, 0.01, 0.96, 0)));

    /*
        Second grade questions
    */
    gradeOfQuestion = GRADES.SECOND;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters tried to strangle " +
        "someone who reported his littering?",
        new AnswerData(ANSWERS.SECOND, ["Mr. Krabs", "Tattle-Tale Strangler",
            "Plankton", "Mr. Puff"]),
        new AudienceData(0.02, 0.75, 0.23, 0)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.SIDE_CHARACTERS,
        "What is Squilliam's last name?",
        new AnswerData(ANSWERS.THIRD, ["Tentacles", "Martinez",
            "Fancyson", "Ghisolfi"]),
        new AudienceData(0.34, 0.05, 0.48, 0.13)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.FITNESS,
        "Which of the following products sold in Bikini Bottom " +
        "can make a fish seem unreasonably fit?",
        new AnswerData(ANSWERS.FOURTH, ["arm cruncher",
            "seaweed", "barnacle chips", "anchor arms"]),
        new AudienceData(0.33, 0.03, 0.25, 0.39)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who said the following quote: 'We should take Bikini " +
        "Bottom, and push it somewhere else'?",
        new AnswerData(ANSWERS.FIRST, ["Patrick", "Sandy",
            "Mr. Krabs", "Squidward"]),
        new AudienceData(0.46, 0.07, 0.05, 0.42)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "What is the name of the first episode of the television " +
        "show 'SpongeBob Squarepants'?",
        new AnswerData(ANSWERS.SECOND, ["Reef Blower", "Help Wanted",
            "Plankton", "Pilot"]),
        new AudienceData(0.22, 0.38, 0.17, 0.23)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.HISTORY,
        "In what year was the first episode of 'SpongeBob Squarepants' " +
        "released?",
        new AnswerData(ANSWERS.THIRD, ["2002", "2000", "1999", "1998"]),
        new AudienceData(0.15, 0.25, 0.31, 0.29)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VEHICLES,
        "Which of the following vehicles does Old Man Jenkins drive?",
        new AnswerData(ANSWERS.FOURTH, ["Underwater Heartbreaker",
            "garbage truck", "fire truck", "jalopy"]),
        new AudienceData(0.23, 0.04, 0.01, 0.72)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In the episode 'Plankton!', Karen says that Plankton is " +
        "one percent evil and ninety-nine percent what?",
        new AnswerData(ANSWERS.FIRST, ["hot gas", "nitrogen",
            "good", "green peas"]),
        new AudienceData(0.38, 0.24, 0.05, 0.33)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who once infamously said the following quote: 'I prefer " +
        "salad over plankton anyway'?",
        new AnswerData(ANSWERS.SECOND, ["Mr. Krabs", "Pearl",
            "Bubble Bass", "Karen"]),
        new AudienceData(0.05, 0.66, 0.23, 0.06)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "Which of the following does invisible spray stain?",
        new AnswerData(ANSWERS.THIRD, ["eyelashes", "shoes",
            "clothes", "spatulas"]),
        new AudienceData(0.11, 0.28, 0.46, 0.15)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.ART,
        "In the episode 'Can You Spare a Dime?', which of the following " +
        "characters ate paintings?",
        new AnswerData(ANSWERS.FIRST, ["Squidward", "SpongeBob", "Mr. Krabs",
            "Plankton"]),
        new AudienceData(0.41, 0.38, 0.13, 0.08)));

    /*
        Third grade questions
    */
    gradeOfQuestion = GRADES.THIRD;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who created the television show 'SpongeBob Squarepants'?",
        new AnswerData(ANSWERS.SECOND, ["Rodger Bumpass",
            "Stephen Hillenburg", "Paul Tibbitt", "Dee Bradley Baker"]),
        new AudienceData(0.21, 0.29, 0.26, 0.24)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "As SpongeBob hosted a house party, for what reason " +
        "did police arrest him?",
        new AnswerData(ANSWERS.THIRD, ["Improper dress", "Breaking in",
            "He didn't invite the police", "His party was boring"]),
        new AudienceData(0.05, 0.44, 0.35, 0.16)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VEHICLES,
        "Which of the following vehicles " +
        "does one apparently not need a license to drive?",
        new AnswerData(ANSWERS.FOURTH, ["boat", "bus", "Boaty",
            "Patty Wagon"]),
        new AudienceData(0.15, 0.07, 0.33, 0.45)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RUMORS,
        "Which of the following episodes was a rumor?",
        new AnswerData(ANSWERS.FIRST, ["Squidward's Suicide",
            "Help Wanted", "Someone in the Kitchen with Sandy",
            "Shanghaied"]),
        new AudienceData(0.83, 0.03, 0.07, 0.07)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who said the following quote: 'I wonder if a fall " +
        "from this height would kill me'?",
        new AnswerData(ANSWERS.SECOND, ["Barnacle Boy",
            "Squidward", "Patrick", "Flats"]),
        new AudienceData(0.38, 0.53, 0.04, 0.05)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VIDEO_GAMES,
        "Who is the final boss in the video game version of " +
        "the first movie?",
        new AnswerData(ANSWERS.THIRD, ["Plankton", "Robot Plankton",
            "King Neptune", "The Flying Dutchman"]),
        new AudienceData(0.29, 0.23, 0.28, 0.20)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In which of the following episodes was SpongeBob's house " +
        "destroyed?",
        new AnswerData(ANSWERS.FOURTH, ["Squidville", "Life of Crime",
            "Sandy's Rocket", "Home Sweet Pineapple"]),
        new AudienceData(0.15, 0.20, 0.08, 0.57)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "Which of the following is not a feature of the " +
            "hydro-dynamic spatula from the episode 'Help Wanted'?",
        new AnswerData(ANSWERS.FIRST, ["thermoelectric cooler",
            "turbo drive", "port-and-starboard attachments", "spinning"]),
        new AudienceData(0.31, 0.20, 0.23, 0.26)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following did Patrick once stab Squidward's hand with?",
        new AnswerData(ANSWERS.SECOND, ["knife", "jellyfishing net",
            "spatula", "keys"]),
        new AudienceData(0.23, 0.48, 0.11, 0.18)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.FITNESS,
        "In the episode 'MuscleBob BuffPants', who won the " +
        "anchor throwing contest?",
        new AnswerData(ANSWERS.THIRD, ["Larry", "SpongeBob", "Sandy",
            "Don"]),
        new AudienceData(0.42, 0.10, 0.43, 0.05)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MUSIC,
        "In which of the following episodes does SpongeBob sing " +
        "about a striped sweater?",
        new AnswerData(ANSWERS.FOURTH, ["F.U.N.", "Ripped Pants",
            "Band Geeks", "As Seen on TV"]),
        new AudienceData(0.18, 0.29, 0.23, 0.30)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.ASTRONOMY,
        "Who owned the rocket that allowed SpongeBob to go to the moon?",
        new AnswerData(ANSWERS.FIRST, ["Sandy", "SpongeBob",
            "Mermaid Man", "Plankton"]),
        new AudienceData(0.36, 0.05, 0.28, 0.31)));

    /*
        Fourth grade questions
    */
    gradeOfQuestion = GRADES.FOURTH;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.DRIVING,
        "At the beginning of the episode 'No Free Rides', " +
        "how many points did SpongeBob need in order to pass " +
        "his driving test?",
        new AnswerData(ANSWERS.FOURTH, [254, 6, 1200, 600]),
        new AudienceData(0.11, 0.24, 0.28, 0.37)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who is the voice actor of SpongeBob Squarepants?",
        new AnswerData(ANSWERS.FIRST, ["Tom Kenny", "Rodger Bumpass",
            "Paul Tibbitt", "Clancy Brown"]),
        new AudienceData(0.45, 0.14, 0.18, 0.23)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.ART,
        "In the episode 'Artist Unknown', which of the following " +
        "was produced by SpongeBob and later by Squidward?",
        new AnswerData(ANSWERS.SECOND, ["Bold and Brash", "David",
            "Statue of Liberty", "Gates of Paradise"]),
        new AudienceData(0.22, 0.43, 0.18, 0.17)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters tried to steal " +
        "someone's car keys with his mouth?",
        new AnswerData(ANSWERS.THIRD, ["Plankton", "Tattle-Tale Strangler",
            "Bubble Bass", "Squilliam"]),
        new AudienceData(0.26, 0.28, 0.30, 0.16)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MAIN_CHARACTERS,
        "What is Plankton's first name?",
        new AnswerData(ANSWERS.FOURTH, ["Eugene", "Ralph",
            "Lester", "Sheldon"]),
        new AudienceData(0.22, 0.20, 0.23, 0.35)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "According to Mr. Krabs, what is one of the purposes of his " +
        "'big meaty claws'?",
        new AnswerData(ANSWERS.FIRST, ["attracting mates",
            "stopping Plankton", "sleeping", "balance"]),
        new AudienceData(0.38, 0.34, 0.03, 0.25)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.GEOGRAPHY,
        "Which of the following areas is visited by SpongeBob " +
        "and Patrick in the first movie?",
        new AnswerData(ANSWERS.SECOND, ["Glove World", "Shell City",
            "Pizza Castle", "Sandy's Treedome"]),
        new AudienceData(0.20, 0.39, 0.23, 0.18)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "Which of the following did Mr. Krabs' cash register " +
        "used to be?",
        new AnswerData(ANSWERS.THIRD, ["blender", "blow dryer",
            "calculator", "spatula"]),
        new AudienceData(0.13, 0.07, 0.73, 0.07)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In which of the following episodes is there no audible " +
        "dialogue?",
        new AnswerData(ANSWERS.FOURTH, ["Bubblestand", "Nature Pants",
            "Ugh", "Reef Blower"]),
        new AudienceData(0.13, 0.39, 0.12, 0.36)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MUSIC,
        "In which of the following episodes does SpongeBob not sing?",
        new AnswerData(ANSWERS.FIRST, ["Your Shoe's Untied",
            "As Seen on TV", "Ripped Pants", "F.U.N."]),
        new AudienceData(0.32, 0.22, 0.18, 0.28)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "Which of the following episodes was released before the first " +
        "SpongeBob movie was released?",
        new AnswerData(ANSWERS.SECOND, ["Fear of a Krabby Patty",
            "Plankton's Army", "Best Day Ever", "The Original Fry Cook"]),
        new AudienceData(0.27, 0.27, 0.21, 0.25)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.FITNESS,
        "In the episode 'MuscleBob BuffPants', what did SpongeBob claim " +
        "to be his secret to getting huge muscles?",
        new AnswerData(ANSWERS.THIRD, ["bench pressing", "inflatable arms",
            "armpit farts", "fry cooking"]),
        new AudienceData(0.21, 0.29, 0.27, 0.23)));

    /*
        Fifth grade questions
    */
    gradeOfQuestion = GRADES.FIFTH;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.VIDEO_GAMES,
        "Which of the following games is not available on the " +
        "PlayStation 2?",
        new AnswerData(ANSWERS.FIRST, ["The Yellow Avenger",
            "Creature from the Krusty Krab",
            "Revenge of the Flying Dutchman",
            "Battle for Bikini Bottom"]),
        new AudienceData(0.26, 0.26, 0.25, 0.23)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters let someone " +
        "drown to death?",
        new AnswerData(ANSWERS.SECOND, ["Flats", "Bubble Buddy",
            "Fred", "Plankton"]),
        new AudienceData(0.23, 0.29, 0.22, 0.26)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.HISTORY,
        "In which of the following years did a chum famine " +
        "take place?",
        new AnswerData(ANSWERS.THIRD, ["1913", "1948",
            "1959", "1968"]),
        new AudienceData(0.18, 0.28, 0.27, 0.27)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MUSIC,
        "Which of the following words is not used to describe " +
        "SpongeBob in the opening theme?",
        new AnswerData(ANSWERS.FOURTH, ["porous", "yellow",
            "absorbent", "spongy"]),
        new AudienceData(0.19, 0.15, 0.24, 0.42)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who said the following quote: 'Everything is chrome " +
        "in the future'?",
        new AnswerData(ANSWERS.SECOND, ["Robot Plankton",
            "SpongeTron", "SpongeBob", "Karen"]),
        new AudienceData(0.39, 0.43, 0.07, 0.11)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RUMORS,
        "What is supposedly the second sign of the " +
        "Hash-Slinging Slasher's arrival?",
        new AnswerData(ANSWERS.THIRD,
            ["The walls will ooze green slime",
            "He'll arrive in a ghost bus",
            "The phone will ring, but there will be nobody there",
            "The lights will flicker on and off"]),
        new AudienceData(0.26, 0.20, 0.28, 0.26)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RESTAURANTS,
        "Which of the following is not a restaurant in Bikini " +
        "Bottom?",
        new AnswerData(ANSWERS.FOURTH,
            ["Fancy", "Weenie Hut Juniors",
            "Super Weenie Hut Juniors", "Weenie Hut General"]),
        new AudienceData(0.21, 0.26, 0.25, 0.28)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VEHICLES,
        "What is the name of the vehicle that was driven by Patrick " +
        "and SpongeBob on the way to their panty raid?",
        new AnswerData(ANSWERS.FIRST, ["Underwater Heartbreaker",
            "Boaty", "X Tornado", "Trailblazer"]),
        new AudienceData(0.32, 0.39, 0.05, 0.24)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who is currently the executive producer of the television " +
        "show 'SpongeBob Squarepants'?",
        new AnswerData(ANSWERS.FOURTH, ["Stephen Hillenburg",
            "Alan Smart", "Barry Anthony", "Paul Tibbitt"]),
        new AudienceData(0.43, 0.11, 0.13, 0.33)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "Which of the following episodes showed a reef blower?",
        new AnswerData(ANSWERS.FIRST, ["Squidville", "Pressure",
            "Good Neighbors", "Plankton!"]),
        new AudienceData(0.29, 0.28, 0.18, 0.25)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Which of the following did Patrick mistake for a cardinal " +
        "direction?",
        new AnswerData(ANSWERS.SECOND, ["nouth", "weast", "sorth", "est"]),
        new AudienceData(0.22, 0.29, 0.23, 0.26)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In the episode 'Bubblestand', for how much did SpongeBob " +
        "charge to teach how to blow bubbles?",
        new AnswerData(ANSWERS.THIRD, ["one cent", "ten cents",
            "twenty-five cents", "fifty cents"]),
        new AudienceData(0.28, 0.24, 0.28, 0.20)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who is the voice actor of Sandy?",
        new AnswerData(ANSWERS.SECOND, ["Tom Kenny", "Carolyn Lawrence",
            "Jill Talley", "Lori Alan"]),
        new AudienceData(0.13, 0.30, 0.28, 0.29)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In which of the following episodes does Mr. Krabs drive " +
        "Plankton to attempt suicide?",
        new AnswerData(ANSWERS.THIRD, ["Welcome to the Chum Bucket",
            "The Algae's Always Greener", "One Coarse Meal",
            "Friend or Foe"]),
        new AudienceData(0.08, 0.20, 0.39, 0.33)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In which of the following episodes does Mrs. Puff try to " +
        "murder SpongeBob?",
        new AnswerData(ANSWERS.FOURTH, ["No Free Rides",
            "Mrs. Puff, You're Fired", "Boating School",
            "Demolition Doofus"]),
        new AudienceData(0.19, 0.31, 0.17, 0.33)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "In the episode 'Born Again Krabs', for how much did Mr. Krabs " +
        "sell SpongeBob's soul to the Flying Dutchman?",
        new AnswerData(ANSWERS.FOURTH, ["one cent", "twenty-five cents",
            "fourty-two cents", "sixty-two cents"]),
        new AudienceData(0.32, 0.20, 0.18, 0.30)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.ANIMALS,
        "In the episode \"New Student Starfish,\" what was the name of " +
            "Mrs. Puff's egg?",
        new AnswerData(ANSWERS.FIRST, ["Roger", "Patar",
            "Franklin", "Benjamin"]),
        new AudienceData(0.32, 0.15, 0.26, 0.27)));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "Which of the following has Sandy's net guns been used " +
        "to capture?",
        new AnswerData(ANSWERS.FOURTH, ["SpongeBob", "moon rocks",
            "aliens", "Sandy"]),
        new AudienceData(0.26, 0.23, 0.22, 0.29)));

    /*
        Million dollar questions
    */
    gradeOfQuestion = GRADES.MILLION;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "Which of the following did SpongeBob not say that " +
        "robots cannot do?",
        new AnswerData(ANSWERS.FIRST, ["dance", "laugh", "cry", "love"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who is the voice actor of Patrick?",
        new AnswerData(ANSWERS.FIRST, ["Bill Fagerbakke",
            "Alan Smart", "Steve Fonti", "Rodger Bumpass"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who is the voice actor of Plankton?",
        new AnswerData(ANSWERS.SECOND, ["Bill Fagerbakke",
            "Doug Lawrence", "Rodger Bumpass", "Clancy Brown"])))
    supply.push(new Question(gradeOfQuestion, SUBJECTS.EPISODES,
        "Which of the following episodes has a scene that was eventually " +
        "deleted in America?",
        new AnswerData(ANSWERS.THIRD, ["Dying for Pie", "Jellyfishing",
            "Just One Bite", "Gary Takes a Bath"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters has stolen footwear " +
        "and eaten it?",
        new AnswerData(ANSWERS.FOURTH, ["Dennis", "Bubble Bass",
            "Patrick", "Mr. Krabs"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.DRIVING,
        "Which of the following things has SpongeBob never truly hit with " +
        "a boat?",
        new AnswerData(ANSWERS.FIRST, ["the main fish announcer",
            "the narrator", "lighthouse", "boat"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.DRIVING,
        "At the beginning of \"New Student Starfish,\" how many " +
        "good noodle stars did SpongeBob have?",
        new AnswerData(ANSWERS.THIRD, ["24", "64", "74", "78"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VIDEO_GAMES,
        "Which of the following SpongeBob video games cannot be played " +
        "on the Nintendo DS?",
        new AnswerData(ANSWERS.SECOND, ["SpongeBob's Truth or Square",
            "SpongeBob SquigglePants", "SpongeBob's Atlantis SquarePantis",
            "Creature from the Krusty Krab"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.GEOGRAPHY,
        "In which of the following bodies of water is Bikini " +
        "Bottom located?",
        new AnswerData(ANSWERS.THIRD, ["Atlantic Ocean",
            "Austin Creek", "Pacific Ocean", "Mediterranean Sea"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RUMORS,
        "Which of the following episodes was rumored to have " +
        "shown Squidward transform into a snail?",
        new AnswerData(ANSWERS.FOURTH, ["Shanghaied", "Squidville",
            "Nature Pants", "I Was a Teenage Gary"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MAIN_CHARACTERS,
        "Of which of the following species is Plankton?",
        new AnswerData(ANSWERS.FIRST, ["copepod", "krill",
            "pipidae", "enantiornithes"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.SIDE_CHARACTERS,
        "Which of the following characters is a news anchor?",
        new AnswerData(ANSWERS.SECOND, ["Old Man Jenkins",
            "Johnny Elaine", "Gilligan Scales", "What Zit Tooya"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who once said the following quote: 'The urge to do " +
        "bad is gone'?",
        new AnswerData(ANSWERS.THIRD, ["Atomic Founder", "Plankton",
            "Man Ray", "Barnacle Boy"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who once infamously said the following quote: 'That flies " +
        "in the face of my good nature'?",
        new AnswerData(ANSWERS.FOURTH, ["Mr. Krabs", "Plankton",
            "Patrick", "SpongeBob"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MUSIC,
        "Which of the following is a line in the song that SpongeBob " +
        "sings to Gary in the episode 'Missing Identity'?",
        new AnswerData(ANSWERS.FIRST, ["Serving it up",
            "I know of a place", "It's feeding time", "Meow"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.ART,
        "Which of the following tools is capable of creating " +
        "drawings that come to life?",
        new AnswerData(ANSWERS.SECOND, ["paintbrush", "pencil",
            "clay", "pen"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.PETS,
        "What was the name of the snail that Squidward entered " +
        "in the Bikini Bottom Snail Race?",
        new AnswerData(ANSWERS.THIRD, ["Rocky", "Shellie",
            "Snellie", "Snaillie"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.PETS,
        "What was the name of the \"snail\" that Patrick entered " +
        "in the Bikini Bottom Snail Race?",
        new AnswerData(ANSWERS.FOURTH, ["Benjamin", "Shellie",
            "Rock", "Rocky"])));

    return supply;
}