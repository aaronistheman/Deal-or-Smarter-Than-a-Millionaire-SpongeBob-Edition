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

QUnit.test("Questions._getAnswerPosition()", function(assert) {
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