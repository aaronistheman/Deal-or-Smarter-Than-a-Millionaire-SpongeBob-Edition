"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

QUnit.module("canvas-stack.js");

QUnit.test("CanvasStack.add()", function(assert) {
    // this test checks stack's length
    var canvasStack = new CanvasStack();
    assert.deepEqual(canvasStack.add(
        CanvasStack.CANVASES_IDS.TITLE_SCREEN).storage.length, 1,
        "A canvas was successfully stored");
    assert.deepEqual(canvasStack.add(
        CanvasStack.CANVASES_IDS.MONEY_DISPLAY).storage.length, 3,
        "After, two more canvas were successfully, simultaneously stored");
});

QUnit.test("CanvasStack.remove()", function(assert) {
    // this test checks storage's length
    var canvasStack = new CanvasStack();
    // add four canvas ids
    canvasStack.add(CanvasStack.CANVASES_IDS.MONEY_DISPLAY)
        .add(CanvasStack.CANVASES_IDS.QUOTE);
    assert.deepEqual(canvasStack.remove(
        CanvasStack.CANVASES_IDS.QUOTE_TEXT).storage.length, 3,
        "A canvas was successfully removed");
    assert.deepEqual(canvasStack.remove(
        CanvasStack.CANVASES_IDS.MONEY_DISPLAY).storage.length, 1,
        "After, two canvases were successfully removed");
});

QUnit.test("CanvasStack::isCanvasOrCanvases()", function(assert) {
    var canvasStack = new CanvasStack();
    assert.deepEqual(CanvasStack.isCanvasOrCanvases("invalidParameter"),
        false, "Returns false if not valid canvas or array of canvases");
    assert.deepEqual(CanvasStack.isCanvasOrCanvases(
        CanvasStack.CANVASES_IDS.SPEAKER), true,
        "Returns true if valid canvas");
    assert.deepEqual(CanvasStack.isCanvasOrCanvases(
        CanvasStack.CANVASES_IDS.MONEY_DISPLAY), true,
        "Returns true if valid array canvases");
});

QUnit.module("game-show-fusion.js");

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