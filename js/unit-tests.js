"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

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