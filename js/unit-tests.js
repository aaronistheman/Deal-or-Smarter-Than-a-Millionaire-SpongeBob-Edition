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

QUnit.module("banker.js");

QUnit.test("Banker.getOffer()", function(assert) {
    var banker = new Banker();

    // Set up to test for a correct banker offer that's rounded
    // to the nearest hundred
    var arrayOfMoneyAmounts = [];
    arrayOfMoneyAmounts.push(new MoneyAmount(50));
    arrayOfMoneyAmounts.push(new MoneyAmount(300));
    arrayOfMoneyAmounts.push(new MoneyAmount(750));
    // Calculate the correct banker offer, apply the banker multiplier,
    // and round it to the nearest hundred
    var bankOffer = (50 + 300 + 750) / 3;
    var roundedBankOffer =
        Math.floor(bankOffer * Banker.MULTIPLIER / 100) * 100;
    assert.deepEqual(banker.getOffer(arrayOfMoneyAmounts).asNumber(),
        roundedBankOffer, "Correct banker's offer determined, rounded to " +
            "nearest hundred, and returned");

    // Set up to test for a correct banker offer that's rounded to
    // the nearest thousand
    arrayOfMoneyAmounts = [];
    arrayOfMoneyAmounts.push(new MoneyAmount(250000));
    arrayOfMoneyAmounts.push(new MoneyAmount(100000));
    arrayOfMoneyAmounts.push(new MoneyAmount(300));
    // Calculate the correct banker offer, apply the banker multiplier,
    // and round it to the nearest thousand
    bankOffer = (250000 + 100000 + 300) / 3;
    roundedBankOffer =
        Math.floor(bankOffer * Banker.MULTIPLIER / 1000) * 1000;
    assert.deepEqual(banker.getOffer(arrayOfMoneyAmounts).asNumber(),
        roundedBankOffer, "Correct banker's offer determined, " +
        "rounded to nearest thousand, and returned");
});

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
    var idToUse = CANVAS_IDS.TITLE_SCREEN;
    var comparisonArray = [];
    comparisonArray.push(idToUse);
    $("#qunit-fixture").append("<canvas id='" + idToUse + "'></canvas>");

    // Test the addition of one canvas
    assert.deepEqual(canvasStack.add(idToUse)._storage,
        comparisonArray, "A canvas was successfully stored");
    assert.ok($("#" + idToUse).hasClass('show'),
        "CSS class 'show' was added to the canvas");

    // Adjust setup
    var idsToUse = CANVAS_IDS.BRIEFCASE_DISPLAY;
    comparisonArray = comparisonArray.concat(idsToUse);
    for (var i in idsToUse) {
        $("#qunit-fixture").append(
            "<canvas id='" + idsToUse[i] + "'></canvas>");
    }

    // Test the addition of multiple canvases and the use of fade in effect
    assert.deepEqual(canvasStack.add(idsToUse,
        CanvasStack.EFFECTS.FADE_IN)._storage.sort(), comparisonArray.sort(),
        "After, two more canvas were successfully, simultaneously stored");
    var classesAddedToEach = true;
    for (var i in idsToUse) {
        if (($("#" + idsToUse[i]).hasClass('show') === false) ||
            ($("#" + idsToUse[i]).hasClass(
                CanvasStack.EFFECTS.FADE_IN) === false)) {
            classesAddedToEach = false;
            break;
        }
    }
    assert.ok(classesAddedToEach, "The class 'show' and the class " +
        "indicated by CanvasStack.EFFECTS.FADE_IN were added");
});

QUnit.test("CanvasStack.remove()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    var comparisonArray = [];
    comparisonArray = comparisonArray.concat(CANVAS_IDS.MONEY_DISPLAY);
    comparisonArray.push(CANVAS_IDS.QUOTE_BUBBLE);
    // Create a DOM element for the money display canvases
    for (var i in CANVAS_IDS.MONEY_DISPLAY) {
        $("#qunit-fixture").append(
            "<canvas id='" + CANVAS_IDS.MONEY_DISPLAY[i] + "'></canvas>");
    }
    // add four canvas ids to the sample CanvasStack object;
    // give the fade-in effect to the money display canvases
    canvasStack.add(CANVAS_IDS.MONEY_DISPLAY, CanvasStack.EFFECTS.FADE_IN)
        .add(CANVAS_IDS.QUOTE);

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
    var classesRemovedFromEach = true;
    for (var i in CANVAS_IDS.MONEY_DISPLAY) {
        if (($("#" + CANVAS_IDS.MONEY_DISPLAY[i]).hasClass('show') ===
            true) ||
            ($("#" + CANVAS_IDS.MONEY_DISPLAY[i]).hasClass(
                CanvasStack.EFFECTS.FADE_IN) === true)) {
            classesRemovedFromEach = false;
            break;
        }
    }
    assert.ok(classesRemovedFromEach,
        "The class 'show' and the class " +
        "indicated by CanvasStack.EFFECTS.FADE_IN were removed " +
        "from the two indicated canvases");
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

QUnit.module("money-amount.js");

QUnit.test("MoneyAmount.asNumber()", function(assert) {
    var moneyAmount = new MoneyAmount(35000);
    assert.deepEqual(moneyAmount.asNumber(), 35000,
        "Correctly formatted value returned");
});

QUnit.test("MoneyAmount.asString()", function(assert) {
    var moneyAmount = new MoneyAmount(35000);
    assert.deepEqual(moneyAmount.asString(), "35,000",
        "Correctly formatted value returned");
});

QUnit.test("removeCommaFromStringNumber()", function(assert) {
    assert.deepEqual(removeCommaFromStringNumber("15,000.01"), "15000.01",
        "Given value was correctly modified and returned");
});

QUnit.test("removeCommaFromEachStringNumber()", function(assert) {
    assert.deepEqual(removeCommaFromEachStringNumber(
        ["3,000.53", "123,456", "1,000"]),
        ["3000.53", "123456", "1000"],
        "Correct array of adjusted numbers was created and returned");
});

QUnit.test("putCommasInStringInteger()", function(assert) {
    assert.deepEqual(putCommasInStringInteger("0"), "0",
        "Appropriately, no commas were inserted in 0");
    assert.deepEqual(putCommasInStringInteger("400"), "400",
        "Appropriately, no commas were inserted in 400");
    assert.deepEqual(putCommasInStringInteger("20000"), "20,000",
        "Appropriately, one comma was inserted in 20000");
    assert.deepEqual(putCommasInStringInteger("1000000"), "1,000,000",
        "Appropriately, two commas were inserted in 1000000");
});

QUnit.test("putCommasInStringNumber()", function(assert) {
    assert.deepEqual(putCommasInStringNumber("0.01"), "0.01",
        "Appropriately, no commas were inserted");
    assert.deepEqual(putCommasInStringNumber("400.00"), "400.00",
        "Appropriately, no commas were inserted");
    assert.deepEqual(putCommasInStringNumber("20000.00"), "20,000.00",
        "Appropriately, one comma was inserted");
    assert.deepEqual(putCommasInStringNumber("250000.00"), "250,000.00",
        "Appropriately, one comma was inserted");
    assert.deepEqual(putCommasInStringNumber("1000000.3567"),
        "1,000,000.3567", "Appropriately, two commas were inserted");
});

QUnit.module("questions.js");

QUnit.test("Questions._generateTenQuestions()", function(assert) {
    // Note that this test's effectiveness is slightly up to chance.

    // the constructor calls the tested function, so testing
    // can already be done
    var questionsObject = new Questions();
    var questions = questionsObject._tenQuestions;

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

QUnit.test("Questions._setMillionDollarQuestion()", function(assert) {
    // the constructor calls the tested function, so testing
    // can already be done
    var questionsObject = new Questions();
    var question = questionsObject._millionDollarQuestion;

    assert.deepEqual(question.grade, GRADES.MILLION,
        "A million dollar question of the correct grade was picked");
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
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 4,
        "Correctly picked the number of the label immediately below " +
        "the currently emphasized one");

    questions.setEmphasizedLabel(9);
    questions.setAnswered(7);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 8,
        "Correctly picked the label down and to the right " +
        "because the one below was of an answered question");

    questions.setAnswered(8);
    questions.setAnswered(5);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 6,
        "With the 9th label emphasized, picked the 6th one " +
        "because the 7th, 8th, and 5th ones were of answered questions");

    var questions = getArtificialQuestionsInstance(10);
    questions.setAnswered(8);
    questions.setAnswered(7);
    questions.setAnswered(6);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 5,
        "With the 10th label emphasized, picked the 5th one " +
        "because the 8th, 7th, and 6th ones were of answered questions");

    questions.setEmphasizedLabel(2);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(),
        undefined, "undefined is returned if a lowest label " +
        "is already emphasized");

    var questions = getArtificialQuestionsInstance(6);
    questions.setAnswered(4);
    questions.setAnswered(3);
    questions.setAnswered(2);
    questions.setAnswered(1);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(),
        undefined, "undefined is returned if all of the labels " +
            "below the emphasized one are of answered questions");
});

QUnit.test("Questions._getNumberOfHigherLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(6);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 8,
        "Correctly picked the number of the label immediately above " +
        "the currently emphasized one");

    questions.setEmphasizedLabel(1);
    questions.setAnswered(3);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 4,
        "Correctly picked the label up and to the right " +
        "because the one above was of an answered question");

    questions.setAnswered(4);
    questions.setAnswered(5);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 6,
        "With the 1st label emphasized, picked the 6th one " +
        "because the 3rd, 4th, and 5th ones were of answered questions");

    var questions = getArtificialQuestionsInstance(2);
    questions.setAnswered(4);
    questions.setAnswered(3);
    questions.setAnswered(6);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 5,
        "With the 2nd label emphasized, picked the 5th one " +
        "because the 4th, 3rd, and 6th ones were of answered questions");

    questions.setEmphasizedLabel(9);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(),
        undefined, "undefined is returned if a highest label " +
        "is already emphasized");

    var questions = getArtificialQuestionsInstance(6);
    questions.setAnswered(8);
    questions.setAnswered(7);
    questions.setAnswered(10);
    questions.setAnswered(9);
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

QUnit.test("Questions::getEntireSupplyOfQuestions()", function(assert) {
    var questions = Questions.getEntireSupplyOfQuestions();

    // Decide how well the question fits; checking characters
    // suffices; a question of at most 125 characters should
    // very well fit in its designated space, given the font used
    // (i.e. Rock Salt)
    var allQuestionsFit = true;
    for (var i = 0; i < questions.length; ++i) {
        if (questions[i].text.length > 125) {
            allQuestionsFit = false;
            break;
        }
    }

    assert.ok(allQuestionsFit, "All questions would fit in " +
        "their designated area");

    // Decide how well the answers fit
    var allAnswersFit = true;
    var canvasId = "junkCanvas";
    $("#qunit-fixture").append("<canvas id='" + canvasId + "' " +
        "width='1000' height='1000'></canvas>");
    var ctx = document.getElementById(canvasId).getContext('2d');
    Questions.setUpAnswersTextContext(ctx);
    for (var i = 0; (i < questions.length && allAnswersFit); ++i) {
        var arrayOfAnswers = questions[i].answerData.arrayOfAnswers;
        for (var j = 0; j < arrayOfAnswers.length; ++j) {
            var text = Questions.getAnswerLetter(j + 1) + arrayOfAnswers[j];

            if ((Questions.ANSWER_TEXT_INDENT + ctx.measureText(text).width) >
                Questions.ANSWER_DIMENSIONS.x)
            {
                allAnswersFit = false;
                break;
            }
        }
    }

    assert.ok(allAnswersFit, "All answers would fit in an " +
        "answer rectangle with the usually used context settings");
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