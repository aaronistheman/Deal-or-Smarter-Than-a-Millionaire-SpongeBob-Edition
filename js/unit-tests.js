"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

QUnit.module("utility.js");

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

QUnit.test("CanvasStack.removeAll()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    canvasStack.add(CANVAS_IDS.BRIEFCASE_DISPLAY);

    // The canvases added above should end up removed
    assert.deepEqual(canvasStack.removeAll()._storage, [],
        "All stored canvases were removed");
});

/*
QUnit.test("CanvasStack::isCanvasOrCanvases()", function(assert) {
    var canvasStack = new CanvasStack();
    assert.deepEqual(CanvasStack.isCanvasOrCanvases("invalidParameter"),
        false, "Returns false if not valid canvas or array of canvases");
    assert.deepEqual(CanvasStack.isCanvasOrCanvases(
        CANVAS_IDS.SPEAKER), true,
        "Returns true if valid canvas");
    assert.deepEqual(CanvasStack.isCanvasOrCanvases(
        CANVAS_IDS.MONEY_DISPLAY), true,
        "Returns true if valid array canvases");
});
*/

QUnit.module("error-handling.js");

QUnit.test("parameterError()", function(assert) {
    assert.deepEqual(parameterError("This is a test"),
        ERROR_MESSAGES.PARAMETER, "Correct value is returned");
});

QUnit.module("game-show-fusion.js");

QUnit.test("convertStringToArrayOfStrings()", function(assert) {
    var testString = "abcdefghijk";
    var testMaxStringLength = 3;
    var textPieces = convertStringToArrayOfStrings(testString,
        testMaxStringLength);

    assert.equal(textPieces[0], 'abc', "Correct first piece made");
    assert.equal(textPieces[1], 'def', "Correct second piece made");
    assert.equal(textPieces[2], 'ghi', "Correct third piece made");
    assert.equal(textPieces[3], 'jk', "Correct fourth piece made");
});