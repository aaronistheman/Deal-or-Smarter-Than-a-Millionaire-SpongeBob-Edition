"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @pre the canvas indicated by graphicsCanvasId is behind the
    canvas indicated by textCanvasId
    @param graphicsCanvasId id of the canvas to draw the non-text
    part of the questions' display on
    @param textCanvasId id of the canvas to draw the text part
    of the questions' display on
*/
function Questions(graphicsCanvasId, textCanvasId) {
    // Storage of objects of type Question
    this._questions = [];

    // Store ten questions for use in the game
    this._generateTenQuestions();

    // Store canvas data
    this.choosingQuestionCanvases = {
        graphicsCanvasId : graphicsCanvasId,
        textCanvasId : textCanvasId,
    };
}

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
        graphicsContext.fillStyle = Questions._getLabelFillStyle(
            this._questions[i].grade);
        var position = Questions._getLabelPosition(i + 1);
        var text = Questions._getLabelText(this._questions[i]);
        this._drawQuestionLabel(graphicsContext, textContext,
            position.x, position.y, text);
    }
};

/*
    @post question label has been drawn in the given position,
    with the given text, and with the given fill style; the
    graphical part is on graphicsContext; the textual part is on
    is on textContext
    @param graphicsContext set up context of the canvas to draw
    the graphical label on
    @param textContext set up context of the canvas to draw the
    label's text on
    @param x top left x-coordinate of the label's reserved space
    @param y top left y-coordinate of the label's reserved space
    @param text to draw on the label
*/
Questions.prototype._drawQuestionLabel =
    function(graphicsContext, textContext, x, y, text)
{
    // Draw the graphical label
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

    // Draw the text of the label
    textContext.fillText(text,
        x + (Questions.LABEL_DIMENSIONS.x / 2.0),
        y + (Questions.LABEL_DIMENSIONS.y / 2.0));
};

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
    textContext.fillStyle = "white";
    textContext.font = "30px Arial";
    textContext.textAlign = "center";
    return textContext;
};

/*
    Because each question must have a unique subject (but not
    necessarily a unique grade level), this is how a question
    from the storage of ten questions will
    be retrieved based on the user's choice.
    @pre none of the Question objects in "this" have the same
    subject
*/
// Questions.prototype.getQuestionBySubject = function(subject) {

// }

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
    1 <= whichLabel <= Questions.NUMBER_OF_QUESTIONS_TO_DISPLAY;
    the label numbers are like this:
    [9, 10] - the top of the display; fifth grade questions
    [7, 8] - fourth grade
    [5, 6] - third grade
    [3, 4] - second grade
    [1, 2] - the bottom of the display; first grade questions
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
    @param grade the color of the label depends on the grade;
    must be a constant in object GRADES
    @returns fillStyle for the context to draw the graphical
    labels on
*/
Questions._getLabelFillStyle = function(grade) {
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