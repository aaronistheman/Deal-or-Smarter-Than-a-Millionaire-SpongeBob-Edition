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
*/

/*
    @pre the canvas indicated by graphicsCanvasId is behind the
    canvas indicated by textCanvasId
    @param graphicsCanvasId id of the canvas to draw the non-text
    part of the questions' display on
    @param textCanvasId id of the canvas to draw the text part
    of the questions' display on
    @param numberToEmphasize number of the question to emphasize;
    set to "none" to emphasize no question label
*/
function Questions(graphicsCanvasId, textCanvasId, numberToEmphasize) {
    // Storage of objects of type Question
    this._questions = [];

    // Store ten questions for use in the game
    this._generateTenQuestions();

    // This number indicates which question the user is currently
    // hovering over as he selects a question
    this.numberToEmphasize = numberToEmphasize;

    // Store canvas data
    this.choosingQuestionCanvases = {
        graphicsCanvasId : graphicsCanvasId,
        textCanvasId : textCanvasId,
    };
}

/*
    @param whichOne number of the question to get
    @returns the question among the stored ten questions that is
    indicated by whichOne
*/
Questions.prototype.getQuestion = function(whichOne) {
    return this._questions[whichOne - 1];
};

/*
    @post the two canvases for this purpose have been erased,
    after which the stored questions were drawn in a way so
    that the user could choose which to try to answer; each's
    question's grade level and subject will be displayed
*/
Questions.prototype.displayAsChoices = function() {
    // Set up the canvas contexts
    var graphicsContext = document.getElementById(
        this.choosingQuestionCanvases.graphicsCanvasId).getContext('2d');
    var textContext = this._getLabelTextContext();

    // Iterate to draw each question label
    for (var i = 0; i < Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY; ++i) {
        var position = Questions._getLabelPosition(i + 1);
        this._drawQuestionLabel(graphicsContext, textContext,
            position.x, position.y, (i + 1));
    }
};

/*
    @post question label has been drawn in the given position,
    with the given text, and with the given fill style; the
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
    var text = Questions._getLabelText(this._questions[number - 1]);

    // Draw the graphical label; shape it differently if the
    // label is supposed to be emphasized
    if (number !== this.numberToEmphasize) {
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
        graphicsContext.fillRect(x, y, Questions.LABEL_DIMENSIONS.x,
            Questions.LABEL_DIMENSIONS.y);
    }

    // Draw the text of the label
    textContext.fillText(text,
        x + (Questions.LABEL_DIMENSIONS.x / 2.0),
        y + (Questions.LABEL_DIMENSIONS.y / 2.0));
};

/*
    @param number of the question label to get the fill style of
    @returns fillStyle for the context to draw the graphical
    labels on
*/
Questions.prototype._getLabelFillStyle = function(number) {
    // Color the emphasized question label differently
    if (number === this.numberToEmphasize)
        return "white";

    var grade = this._questions[number - 1].grade;
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
        this.choosingQuestionCanvases.textCanvasId).getContext('2d');
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
    if (number === this.numberToEmphasize) {
        // Color differently the text of emphasized question label
        return "black";
    }
    else
        return "white";
};

/*
    @pre 1 <= newNumber <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY
    @post this.numberToEmphasize has been updated; formerly
    emphasized question label has been redrawn so that it's no
    longer emphasized; now emphasized question label has been
    redrawn so that it's emphasized
    @param newNumber new number of question label to emphasize;
    set to "none" to emphasize no question
*/
Questions.prototype.setEmphasis = function(newNumber) {
    // Set up variables
    var graphicsContext = document.getElementById(
        this.choosingQuestionCanvases.graphicsCanvasId).getContext('2d');
    var textContext = document.getElementById(
        this.choosingQuestionCanvases.textCanvasId).getContext('2d');
    var oldNumber = this.numberToEmphasize;

    // Determine positions of formerly emphasized case and now
    // emphasized case
    if (oldNumber !== "none")
        var oldPosition = Questions._getLabelPosition(oldNumber);
    if (newNumber !== "none")
        var newPosition = Questions._getLabelPosition(newNumber);

    // Update numberToEmphasize
    this.numberToEmphasize = newNumber;

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
    @pre this.numberToEmphasize != "none"
    @post the emphasis has been placed on the label to the left
    of the currently emphasized label; if a leftmost label
    is already emphasized, nothing happens
*/
Questions.prototype.emphasizeLeftLabel = function() {
    if (this.numberToEmphasize % 2 === 0)
        this.setEmphasis(this.numberToEmphasize - 1);
};

/*
    @pre this.numberToEmphasize != "none"
    @post the emphasis has been placed on the label to the right
    of the currently emphasized label; if a rightmost label
    is already emphasized, nothing happens
*/
Questions.prototype.emphasizeRightLabel = function() {
    if (this.numberToEmphasize % 2 === 1)
        this.setEmphasis(this.numberToEmphasize + 1);
};

/*
    @pre this.numberToEmphasize != "none"
    @post the emphasis has been placed on the label below
    the currently emphasized label; if a lowest label
    is already emphasized, nothing happens
*/
Questions.prototype.emphasizeDownLabel = function() {
    if (this.numberToEmphasize >= 3)
        this.setEmphasis(this.numberToEmphasize - 2);
};

/*
    @pre this.numberToEmphasize != "none"
    @post the emphasis has been placed on the label above
    the currently emphasized label; if a uppermost label
    is already emphasized, nothing happens
*/
Questions.prototype.emphasizeUpLabel = function() {
    if (this.numberToEmphasize <= 8)
        this.setEmphasis(this.numberToEmphasize + 2);
};

/*
    @pre this._questions.length = 0
    @post this._questions contains ten instances of type Question;
    each of these instances has a different subject matter; two
    questions of the ten are attached to each grade level from
    one to five, and these ten questions are sorted by grade level
    @hasTest yes
*/
Questions.prototype._generateTenQuestions = function() {
    var supply = Questions.getEntireSupplyOfQuestions();
    var tenQuestions = [];

    /*
        @pre for each grade level, supplyOfQuestions contains at
        least two questions of different subject matters; otherwise,
        an infinite loop will occur
        @post two questions of the given grade from supplyOfQuestions
        have been put in tenQuestions; these two questions don't
        have the same subject; after a question is put in tenQuestions,
        every question in supplyOfQuestions that has the question's
        subject matter will be removed
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

    this._questions = tenQuestions;
}

/*
    Static methods and/or members
*/

Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY = 10;

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

/*
    @hasTest yes
    @param whichLabel number of the label to get the position of;
    1 <= whichLabel <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY
    @returns Vector2d object containing the top-left position at which
    to draw the question label (on the appropriate canvases)
*/
Questions._getLabelPosition = function(whichLabel) {
    // Decide how much to adjust the default label position
    var multiplierX = ((whichLabel - 1) % 2);
    var multiplierY = -1 * (Math.ceil(whichLabel / 2.0) - 1);
    var adjustment = new Vector2d(multiplierX, multiplierY);

    return Questions.FIRST_LABEL_POSITION.getSum(
        Questions.MARGINAL_LABEL_POSITION.getProduct(adjustment));
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
    @returns an array of instances of Question so that this array
    contains all of the questions that the user could possible face
*/
Questions.getEntireSupplyOfQuestions = function() {
    var supply = [];

    supply.push(new Question(GRADES.FIRST, SUBJECTS.VIDEO_GAMES));
    supply.push(new Question(GRADES.FIRST, SUBJECTS.VIDEO_GAMES));
    supply.push(new Question(GRADES.FIRST, SUBJECTS.CRIME));
    supply.push(new Question(GRADES.FIRST, SUBJECTS.GEOGRAPHY));

    supply.push(new Question(GRADES.SECOND, SUBJECTS.STAFF));
    supply.push(new Question(GRADES.SECOND, SUBJECTS.STAFF));
    supply.push(new Question(GRADES.SECOND, SUBJECTS.RESTAURANTS));
    supply.push(new Question(GRADES.SECOND, SUBJECTS.VEHICLES));

    supply.push(new Question(GRADES.THIRD, SUBJECTS.SIDE_CHARACTERS));
    supply.push(new Question(GRADES.THIRD, SUBJECTS.SIDE_CHARACTERS));
    supply.push(new Question(GRADES.THIRD, SUBJECTS.MAIN_CHARACTERS));
    supply.push(new Question(GRADES.THIRD, SUBJECTS.ART));

    supply.push(new Question(GRADES.FOURTH, SUBJECTS.DRIVING));
    supply.push(new Question(GRADES.FOURTH, SUBJECTS.DRIVING));
    supply.push(new Question(GRADES.FOURTH, SUBJECTS.FITNESS));
    supply.push(new Question(GRADES.FOURTH, SUBJECTS.RUMORS));

    supply.push(new Question(GRADES.FIFTH, SUBJECTS.HISTORY));
    supply.push(new Question(GRADES.FIFTH, SUBJECTS.HISTORY));
    supply.push(new Question(GRADES.FIFTH, SUBJECTS.TECHNOLOGY));
    supply.push(new Question(GRADES.FIFTH, SUBJECTS.QUOTATIONS));

    return supply;
}