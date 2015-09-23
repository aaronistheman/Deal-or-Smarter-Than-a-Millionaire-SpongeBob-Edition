"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    Using modules, I've divided the tests based on which file
    each tested function comes from. Modules are in alphabetical
    order by the name of the represented file.
*/

QUnit.module("briefcase-display.js");

QUnit.test("BriefcaseDisplay::getCasePosition()", function(assert) {
    assert.deepEqual(BriefcaseDisplay.getCasePosition(1),
        BriefcaseDisplay.firstCasePosition,
        "Correct position for first case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(4),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(3, 0))),
        "Correct position for fourth case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(5),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(4, 0))),
        "Correct position for fifth case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(6),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(0, -1))),
        "Correct position for sixth case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(10),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(4, -1))),
        "Correct position for tenth case");
});

QUnit.module("canvas-stack.js");

QUnit.test("CanvasStack.set()", function(assert) {
    // Create artificial environment
    var canvasStack = new CanvasStack();
    canvasStack.add(CANVAS_IDS.MONEY_DISPLAY);

    // The canvas ids added above should be replaced by the canvas ids
    // indicated in the parameter
    assert.deepEqual(canvasStack.set(
        CANVAS_IDS.SPEAKER_QUOTE)._storage.sort(),
        CANVAS_IDS.SPEAKER_QUOTE.sort(),
        "Canvases stored in CanvasStack were replaced by the " +
        "canvases indicated by the parameter; correct returned object");
});

QUnit.test("CanvasStack.add()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    var comparisonArray = [];
    comparisonArray.push(CANVAS_IDS.TITLE_SCREEN);

    assert.deepEqual(canvasStack.add(
        CANVAS_IDS.TITLE_SCREEN)._storage,
        comparisonArray,
        "A canvas was successfully stored");

    // Adjust setup
    comparisonArray = comparisonArray.concat(
        CANVAS_IDS.BRIEFCASE_DISPLAY);

    assert.deepEqual(canvasStack.add(
        CANVAS_IDS.BRIEFCASE_DISPLAY)._storage.sort(),
        comparisonArray.sort(),
        "After, two more canvas were successfully, simultaneously stored");
});

QUnit.test("CanvasStack.remove()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    var comparisonArray = [];
    comparisonArray = comparisonArray.concat(CANVAS_IDS.MONEY_DISPLAY);
    comparisonArray.push(CANVAS_IDS.QUOTE_BUBBLE);
    // add four canvas ids
    canvasStack.add(CANVAS_IDS.MONEY_DISPLAY).add(CANVAS_IDS.QUOTE);

    assert.deepEqual(canvasStack.remove(
        CANVAS_IDS.QUOTE_TEXT)._storage.sort(),
        comparisonArray.sort(),
        "A canvas was successfully removed");

    // Adjust the setup
    comparisonArray = [CANVAS_IDS.QUOTE_BUBBLE];

    assert.deepEqual(canvasStack.remove(
        CANVAS_IDS.MONEY_DISPLAY)._storage.sort(),
        comparisonArray.sort(),
        "After, two canvases were successfully removed");
});

QUnit.test("CanvasStack.clear()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    canvasStack.add(CANVAS_IDS.BRIEFCASE_DISPLAY);

    // The canvases added above should end up removed
    assert.deepEqual(canvasStack.clear()._storage, [],
        "All stored canvases were removed");
});

QUnit.module("error-handling.js");

QUnit.test("parameterError()", function(assert) {
    assert.deepEqual(parameterError("This is a test"),
        ERROR_MESSAGES.PARAMETER, "Correct value is returned");
});

QUnit.module("game-show-fusion.js");

QUnit.test("selectedCorrectAnswer()", function(assert) {
    var answerIndex = 3;
    var fakeQuestion = new Question(GRADES.FIRST, SUBJECTS.ART,
        "This is a fake question.",
        new AnswerData(answerIndex, ["a", "b", "c", "d"]));
    assert.deepEqual(selectedCorrectAnswer(fakeQuestion, 1),
        false, "Wrong answer was detected");
    assert.deepEqual(selectedCorrectAnswer(fakeQuestion, (answerIndex + 1)),
        true, "Correct answer was detected");
});

QUnit.module("questions.js");

QUnit.test("Questions._generateTenQuestions()", function(assert) {
    // Note that this test's effectiveness is slightly up to chance.

    // the constructor calls the tested function, so testing
    // can already be done
    var questionsObject = new Questions();
    var questions = questionsObject._questions;

    QUnit.deepEqual(questions.length, 10,
        "Ten instances of type Question were generated.");

    // Make an array for only the ten questions' subject matters
    // so that indexOf() and lastIndexOf() can be used more easily
    var subjects = [];
    for (var i = 0; i < questions.length; ++i)
        subjects.push(questions[i].subject);
    // Confirm that each of the ten stored questions has a different
    // subject matter
    var uniqueSubjectMatters = true;
    for (var i = 0; i < subjects.length - 1; ++i) {
        if (subjects.indexOf(subjects[i]) !==
            subjects.lastIndexOf(subjects[i]))
        {
            // The subject matter must be present in more than one
            // part of the array if its first appearance and last
            // appearance (index-wise) in the array are not the same
            uniqueSubjectMatters = false;

            // Escape because failed test
            break;
        }
    }
    QUnit.ok(uniqueSubjectMatters, "Each of the ten stored questions " +
        "has a different subject matter.");

    // Confirm that every two of the ten is attached to a unique
    // grade level from first to fifth; this also checks
    // that the questions are sorted by grade level
    var passingTest = true;
    var grade = GRADES.FIRST;
    for (var i = 0; i < questions.length; ++i) {
        if (questions[i].grade !== grade) {
            // Failed test; escape loop
            passingTest = false;
            break;
        }

        // Increase the grade level if two questions have been
        // compared to this grade level already; note that the
        // following works because the GRADES constants have
        // numerical values
        if (i % 2 === 1)
            grade += 1;
    }
    QUnit.ok(passingTest, "Every two of the ten questions " +
        "corresponds to a grade level going up from first to fifth, " +
        "and the questions are sorted by grade level, with the first " +
        "grade questions having the lowest index in the array of questions.");
});

/*
    @returns instance of Questions with the ids of a trivial
    canvas and with emphasis on the label indicated by
    numberOfLabelToEmphasize
*/
function getArtificialQuestionsInstance(numberOfLabelToEmphasize) {
    // Create trivial canvas to satisfy the constructor of Questions
    var canvasId = "junkCanvas";
    $("#qunit-fixture").append("<canvas id='" + canvasId + "'></canvas>");
    return new Questions(canvasId, canvasId,
        numberOfLabelToEmphasize, canvasId, canvasId);
}

QUnit.test("Questions._getNumberOfLeftwardLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(4);

    assert.deepEqual(questions._getNumberOfLeftwardLabelToEmphasize(),
        3, "Correct number is returned for label to the left " +
        "of currently emphasized label");
    questions.setAnswered(3);
    assert.deepEqual(questions._getNumberOfLeftwardLabelToEmphasize(),
        undefined, "No label is suggested if label to the left " +
        "of currently emphasized label is of an answered question");
    questions.setEmphasizedLabel(7);
    assert.deepEqual(questions._getNumberOfLeftwardLabelToEmphasize(),
        undefined, "No label is suggested if a label on the left " +
        "is already emphasized");
});

QUnit.test("Questions._getNumberOfRightwardLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(3);

    assert.deepEqual(questions._getNumberOfRightwardLabelToEmphasize(),
        4, "Correct number is returned for label to the right " +
        "of currently emphasized label");
    questions.setAnswered(4);
    assert.deepEqual(questions._getNumberOfRightwardLabelToEmphasize(),
        undefined, "No label is suggested if label to the right " +
        "of currently emphasized label is of an answered question");
    questions.setEmphasizedLabel(8);
    assert.deepEqual(questions._getNumberOfRightwardLabelToEmphasize(),
        undefined, "No label is suggested if a label on the right " +
        "is already emphasized");
});

QUnit.test("Questions._getNumberOfLowerLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(6);

    // Check if can correctly pick to emphasize the label immediately
    // below the currently emphasized one
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 4,
        "Correctly picked the number of the label immediately below " +
        "the currently emphasized one");

    // Check if can correctly skip the two labels immediately below
    // the currently emphasized one in picking the label to
    // emphasize
    questions.setEmphasizedLabel(9);
    questions.setAnswered(7);
    questions.setAnswered(5);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 3,
        "Correctly skipped the two labels immediately below the " +
        "currently emphasized one to pick the correct number");

    // Check if can identify that a lowest label is currently
    // emphasized
    questions.setEmphasizedLabel(2);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(),
        undefined, "undefined is returned if a lowest label " +
        "is already emphasized");

    // Confirm that no label is suggested if all the labels
    // below the currently emphasized one are of answered questions
    questions.setEmphasizedLabel(10);
    questions.setAnswered(8);
    questions.setAnswered(6);
    questions.setAnswered(4);
    questions.setAnswered(2);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(),
        undefined, "undefined is returned if all of the labels " +
            "below the emphasized one are of answered questions");
});

QUnit.test("Questions._getNumberOfHigherLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(4);

    // Check if can correctly pick to emphasize the label immediately
    // above the currently emphasized one
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 6,
        "Correctly picked the number of the label immediately above " +
        "the currently emphasized one");

    // Check if can correctly skip the two labels immediately above
    // the currently emphasized one in picking the label to
    // emphasize
    questions.setEmphasizedLabel(1);
    questions.setAnswered(3);
    questions.setAnswered(5);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 7,
        "Correctly skipped the two labels immediately above the " +
        "currently emphasized one to pick the correct number");

    // Check if can identify that an uppermost label is currently
    // emphasized
    questions.setEmphasizedLabel(10);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(),
        undefined, "undefined is returned if an uppermost label " +
        "is already emphasized");

    // Confirm that no label is suggested if all the labels
    // above the currently emphasized one are of answered questions
    questions.setEmphasizedLabel(2);
    questions.setAnswered(4);
    questions.setAnswered(6);
    questions.setAnswered(8);
    questions.setAnswered(10);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(),
        undefined, "undefined is returned if all of the labels " +
            "above the emphasized one are of answered questions");
});

QUnit.test("Questions::_getAnswerPosition()", function(assert) {
    assert.deepEqual(Questions._getAnswerPosition(1),
        Questions.FIRST_ANSWER_POSITION,
        "Correct position for first answer");
    assert.deepEqual(Questions._getAnswerPosition(4),
        Questions.FIRST_ANSWER_POSITION.getSum(
            Questions.MARGINAL_ANSWER_POSITION.getProduct(
                new Vector2d(0, 3))),
        "Correct position for fourth answer");
});

QUnit.test("Questions::_getLabelPosition()", function(assert) {
    assert.deepEqual(Questions._getLabelPosition(1),
        Questions.FIRST_LABEL_POSITION,
        "Correct position for first label");
    assert.deepEqual(Questions._getLabelPosition(4),
        Questions.FIRST_LABEL_POSITION.getSum(
            Questions.MARGINAL_LABEL_POSITION.getProduct(
                new Vector2d(1, -1))),
        "Correct position for fourth label");
    assert.deepEqual(Questions._getLabelPosition(5),
        Questions.FIRST_LABEL_POSITION.getSum(
            Questions.MARGINAL_LABEL_POSITION.getProduct(
                new Vector2d(0, -2))),
        "Correct position for fifth label");
    assert.deepEqual(Questions._getLabelPosition(10),
        Questions.FIRST_LABEL_POSITION.getSum(
            Questions.MARGINAL_LABEL_POSITION.getProduct(
                new Vector2d(1, -4))),
        "Correct position for tenth label");
});

QUnit.module("vector2d.js");

QUnit.test("Vector2d.getSum()", function(assert) {
    var v = new Vector2d(20, 30);
    assert.deepEqual(v.getSum(new Vector2d(40, 40)),
        new Vector2d(60, 70),
        "Function successfully returns the correct " +
        "sum as a Vector2d object");
});

QUnit.test("Vector2d.getProduct()", function(assert) {
    var v = new Vector2d(70, 80);
    assert.deepEqual(v.getProduct(new Vector2d(3, 2)),
        new Vector2d(210, 160),
        "Function successfully returns the correct " +
        "product as a Vector2d object");
});