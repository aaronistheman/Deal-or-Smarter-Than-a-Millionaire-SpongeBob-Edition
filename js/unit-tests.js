"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

QUnit.module("game-show-fusion.js");

QUnit.test("CanvasStack::isCanvasOrCanvases()", function(assert) {
    var canvasStack = new CanvasStack();
    assert.deepEqual(CanvasStack.isCanvasOrCanvases("invalidParameter"),
        false, "Returns false if not valid canvas or array of canvases");
    assert.deepEqual(CanvasStack.isCanvasOrCanvases(
        CanvasStack.CANVASES.SPEAKER), true,
        "Returns true if valid canvas");
    assert.deepEqual(CanvasStack.isCanvasOrCanvases(
        CanvasStack.CANVASES.MONEY_DISPLAY), true,
        "Returns true if valid array canvases");
});

QUnit.test("CanvasStack.add()", function(assert) {
    // Check valid parameter enforcement
    var canvasStack = new CanvasStack();
    assert.deepEqual(canvasStack.add("invalidParameter"),
        ERROR_MESSAGES.PARAMETER, "Good valid parameter enforcement");

    // Confirm the 'this' pointer is returned if valid parameter
    assert.deepEqual(canvasStack.add(CanvasStack.CANVASES.SPEAKER),
        canvasStack,
        "The 'this' pointer is returned if successful addition");
});

QUnit.test("CanvasStack.storeAndShow()", function(assert) {
    // this test checks stack's length;
    // storeAndShow() is called in add()
    var canvasStack = new CanvasStack();
    assert.deepEqual(canvasStack.add(
        CanvasStack.CANVASES.TITLE_SCREEN).stack.length, 1,
        "A canvas was successfully stored");
    assert.deepEqual(canvasStack.add(
        CanvasStack.CANVASES.MONEY_DISPLAY).stack.length, 3,
        "Two more canvas were successfully, simultaneously stored");
});

QUnit.test("parameterError()", function(assert) {
    assert.deepEqual(parameterError("This is a test"),
        ERROR_MESSAGES.PARAMETER, "Correct value is returned");
});

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