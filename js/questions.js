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
    @pre the canvas indicated by labelGraphicsCanvasId is behind the
    canvas indicated by labelTextCanvasId
    @param labelGraphicsCanvasId id of the canvas to draw the non-text
    part of the questions' display on
    @param labelTextCanvasId id of the canvas to draw the text part
    of the questions' display on
    @param numberToEmphasize number of the question to emphasize;
    set to "none" to emphasize no question label
    @param questioningGraphicsCanvasId id of the canvas to draw
    the non-textual parts of the presentation of a question on
    @param questioningTextCanvasId id of the canvas to draw
    the text parts of the presentation of a question on
*/
function Questions(labelGraphicsCanvasId, labelTextCanvasId,
    numberToEmphasize, questioningGraphicsCanvasId,
    questioningTextCanvasId) {
    // Storage of objects of type Question
    this._questions = [];

    // Store ten questions for use in the game
    this._generateTenQuestions();

    // This number indicates which question the user is currently
    // hovering over as he selects a question
    this.numberToEmphasize = numberToEmphasize;

    // Store canvas data
    this._choosingQuestionCanvases = {
        labelGraphicsCanvasId : labelGraphicsCanvasId,
        labelTextCanvasId : labelTextCanvasId,
    };
    this._questioningCanvases = {
        questioningGraphicsCanvasId : questioningGraphicsCanvasId,
        questioningTextCanvasId : questioningTextCanvasId,
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
        this._choosingQuestionCanvases.labelGraphicsCanvasId)
            .getContext('2d');
    var textContext = document.getElementById(
        this._choosingQuestionCanvases.labelTextCanvasId)
            .getContext('2d');
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

    this._questions = tenQuestions;
}

/*
    @post the text of the question indicated by questionNumber and
    of that question's answers has been drawn
    @param questionNumber
*/
Questions.prototype.drawQuestionAndAnswersText =
    function(questionNumber) {
    // Variables that help with positioning
    var fontSize = 30;
    var verticalSpaceBetweenWords = 5;
    var sideMargin = 10;
    var allocatedWidthForQuestionDisplay = 800;
    var x = 310;
    var y = sideMargin;

    // Set up canvas context
    var ctx = document.getElementById(
        this._questioningCanvases.questioningTextCanvasId)
        .getContext('2d');
    ctx.fillStyle = "white";
    ctx.font = fontSize + "px 'Rock Salt'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    var textPieces = convertCanvasTextIntoSmallerPieces(ctx,
        this._questions[questionNumber - 1].text,
        allocatedWidthForQuestionDisplay - (sideMargin * 2));
    for (var i in textPieces) {
        // Throw exception if question is too big
        if (y >= (275 - (fontSize + verticalSpaceBetweenWords))) {
            alert("Error: question can't be fit in its designated space");
            throw "Error: question can't be fit in its designated space";
        }

        ctx.fillText(textPieces[i], x, y);

        // Update x and y
        y += (fontSize + verticalSpaceBetweenWords);
    }
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
    contains all of the questions that the user could possible face;
    there are at least ten questions of different subjects for fifth
    grade, at least eight of such questions for fourth grade,
    at least six of such questions for third grade, at least four
    of such questions for second grade, and at least two of
    such questions for first grade (this prevents an infinite loop
    in Questions._generateTenQuestions())
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

    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters has tried to steal " +
        "a recipe from Mr. Krabs?",
        new AnswerData(ANSWERS.FOURTH, ["Mrs. Puff", "Patrick",
            "Barnacle Boy", "Plankton"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.GEOGRAPHY,
        "Which of the following areas is at a much lower elevation " +
        "than Glove World?",
        new AnswerData(ANSWERS.FIRST, ["Rock Bottom", "Shell City",
            "Patrick's house", "Krusty Krab"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RESTAURANTS,
        "Which of the following is a restaurant in Bikini " +
        "Bottom?",
        new AnswerData(ANSWERS.SECOND, ["Goo Lagoon", "Krusty Krab",
            "Pizza Hut", "The Wash"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "What species is Plankton's wife?",
        new AnswerData(ANSWERS.THIRD, ["Sea Bear", "Lamp",
            "Computer", "Stove"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "What is SpongeBob's catchphrase?",
        new AnswerData(ANSWERS.FOURTH, ["Howdy ya'll.",
            "Time is money.", "What a beautiful day.", "I'm ready."])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VEHICLES,
        "Which of the following vehicles " +
        "is driven by Mermaid Man?",
        new AnswerData(ANSWERS.FIRST, ["Invisible Boatmobile",
            "Underwater Heartbreaker", "Patty Wagon", "bus"])));

    /*
        Second grade questions
    */
    gradeOfQuestion = GRADES.SECOND;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters tried to strangle " +
        "someone who reported his littering?",
        new AnswerData(ANSWERS.SECOND, ["Mr. Krabs", "Tattle-Tale Strangler",
            "Plankton", "Mr. Puff"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.SIDE_CHARACTERS,
        "What is Squilliam's last name?",
        new AnswerData(ANSWERS.THIRD, ["Tentacles", "Martinez",
            "Fancyson", "Ghisolfi"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.FITNESS,
        "Which of the following products sold in Bikini Bottom " +
        "can make a fish seem unreasonably fit?",
        new AnswerData(ANSWERS.FOURTH, ["arm cruncher",
            "seaweed", "barnacle chips", "anchor arms"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who said the following quote: 'We should take Bikini" +
        "Bottom, and push it somewhere else'?",
        new AnswerData(ANSWERS.FIRST, ["Patrick", "Sandy",
            "Mr. Krabs", "Squidward"])));

    /*
        Third grade questions
    */
    gradeOfQuestion = GRADES.THIRD;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who created the television show 'SpongeBob Squarepants'?",
        new AnswerData(ANSWERS.SECOND, ["Rodger Bumpass",
            "Stephen Hillenburg", "Paul Tibbitt", "Dee Bradley Baker"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "As SpongeBob hosted a house party, for what reason " +
        "did police arrest him?",
        new AnswerData(ANSWERS.THIRD, ["Improper dress", "Breaking in",
            "He didn't invite the police", "His party was boring"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VEHICLES,
        "Which of the following vehicles " +
        "does one apparently not need a license to drive?",
        new AnswerData(ANSWERS.FOURTH, ["boat", "bus", "Boaty",
            "Patty Wagon"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RUMORS,
        "Which of the following episodes was a rumor?",
        new AnswerData(ANSWERS.FIRST, ["Squidward's Suicide",
            "Help Wanted", "Someone in the Kitchen with Sandy",
            "Shanghaied"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who said the following quote: 'I wonder if a fall " +
        "from this height would kill me'?",
        new AnswerData(ANSWERS.SECOND, ["Barnacle Boy",
            "Squidward", "Patrick", "Flatts"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VIDEO_GAMES,
        "Who is the final boss in the video game version of " +
        "the first movie?",
        new AnswerData(ANSWERS.THIRD, ["Plankton", "Robot Plankton",
            "King Neptune", "The Flying Dutchman"])));

    /*
        Fourth grade questions
    */
    gradeOfQuestion = GRADES.FOURTH;

    supply.push(new Question(gradeOfQuestion, SUBJECTS.DRIVING,
        "At the beginning of the episode 'No Free Rides', " +
        "how many points did SpongeBob need in order to pass " +
        "his driving test?",
        new AnswerData(ANSWERS.FOURTH, [254, 6, 1200, 600])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who is the voice actor of SpongeBob Squarepants?",
        new AnswerData(ANSWERS.FIRST, ["Tom Kenny", "Rodger Bumpass",
            "Paul Tibbitt", "Clancy Brown"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.ART,
        "In the episode 'Artist Unknown', which of the following " +
        "was produced by SpongeBob and later by Squidward?",
        new AnswerData(ANSWERS.SECOND, ["Bold and Brash", "David",
            "Statue of Liberty", "Gates of Paradise"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters tried to steal " +
        "someone's car keys with his mouth?",
        new AnswerData(ANSWERS.THIRD, ["Plankton", "Tattle-Tale Strangler",
            "Bubble Bass", "Squilliam"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.MAIN_CHARACTERS,
        "What is Plankton's first name?",
        new AnswerData(ANSWERS.FOURTH, ["Eugene", "Ralph",
            "Lester", "Sheldon"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "According to Mr. Krabs, what is one of the purposes of his " +
        "'big meaty claws'?",
        new AnswerData(ANSWERS.FIRST, ["attracting mates",
            "stopping Plankton", "sleeping", "balance"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.GEOGRAPHY,
        "Which of the following areas is visited by SpongeBob " +
        "and Patrick in the first movie?",
        new AnswerData(ANSWERS.SECOND, ["Glove World", "Shell City",
            "Pizza Castle", "Sandy's Treedome"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "Which of the following did Mr. Krabs' cash register " +
        "used to be?",
        new AnswerData(ANSWERS.THIRD, ["blender", "blow dryer",
            "calculator", "spatula"])));

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
            "Battle for Bikini Bottom"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.CRIME,
        "Which of the following characters let someone " +
        "drown to death?",
        new AnswerData(ANSWERS.SECOND, ["Flatts", "Bubble Buddy",
            "Fred", "Plankton"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.HISTORY,
        "In which of the following years did a chum famine " +
        "take place?",
        new AnswerData(ANSWERS.THIRD, ["1913", "1948",
            "1959", "1968"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.ART,
        "Which of the following words is not used to describe " +
        "SpongeBob in the opening theme?",
        new AnswerData(ANSWERS.FOURTH, ["porous", "yellow",
            "absorbent", "spongy"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.TECHNOLOGY,
        "Which of the following did SpongeBob not say that " +
        "robots cannot do?",
        new AnswerData(ANSWERS.FIRST, ["dance", "laugh", "cry", "love"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.QUOTATIONS,
        "Who said the following quote: 'Everything is chrome " +
        "in the future'?",
        new AnswerData(ANSWERS.SECOND, ["Robot Plankton",
            "SpongeTron", "SpongeBob", "Karen"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RUMORS,
        "What is supposedly the second sign of the " +
        "Hash-Slinging Slasher's arrival?",
        new AnswerData(ANSWERS.THIRD,
            ["The walls will ooze green slime",
            "The Hash-Slinging Slasher will arrive " +
            "in the ghost of the bus that ran him over",
            "The phone will ring, and there will be nobody there",
            "The lights will flicker on and off"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.RESTAURANTS,
        "Which of the following is not a restaurant in Bikini " +
        "Bottom?",
        new AnswerData(ANSWERS.FOURTH,
            ["Fancy", "Weenie Hut Juniors",
            "Super Weenie Hut Juniors", "Weenie Hut General"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.STAFF,
        "Who is the voice actor of Patrick?",
        new AnswerData(ANSWERS.FIRST, ["Bill Fagerbakke",
            "Larry the Cable Guy", "Clancy Brown",
            "Rodger Bumpass"])));
    supply.push(new Question(gradeOfQuestion, SUBJECTS.VEHICLES,
        "What is the name of the vehicle that was driven by Patrick " +
        "and SpongeBob on the way to their panty raid?",
        new AnswerData(ANSWERS.SECOND, ["Underwater Heartbreaker",
            "Boaty", "X Tornado", "Trailblazer"])));

    return supply;
}