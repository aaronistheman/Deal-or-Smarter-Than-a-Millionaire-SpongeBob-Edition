"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    This file includes code that isn't easily assigned to one
    of the other JavaScript files.
*/

// For functions that toggle things (e.g. music)
var TOGGLE = {};
TOGGLE.ON = "on";
TOGGLE.OFF = "off";

/*
    @pre none
    @post none
    @hasTest false
    @param none
    @returns true if currently unit testing, false otherwise
    @throws nothing
*/
function isUnitTesting() {
    return $("#qunit").length === 1;
}

function Vector2d(x, y) {
    this.x = x;
    this.y = y;
}

/*
    @param v instance of Vector2d to add to 'this' in forming
    what to return
    @returns the sum of the two vectors ('this' and the parameter)
    without editing the original vector (i.e. 'this')
*/
Vector2d.prototype.getSum = function(v) {
    return new Vector2d(this.x + v.x, this.y + v.y);
};

/*
    @param v instance of Vector2d to multiply with 'this' in
    forming what to return
    @returns the product of the two vectors ('this' and the
    parameter) without editing the original vector (i.e. 'this')
*/
Vector2d.prototype.getProduct = function(v) {
    return new Vector2d(this.x * v.x, this.y * v.y);
};

/*
    @pre none of the words in text are so big that no matter what,
    if the word, with the given context, were drawn without breaks in
    it, the maximum width would be exceeded; violation of this
    precondition causes infinite loop
    @param ctx set up context to use for checking when the
    maximum width (in pixels) is reached
    @param text to convert into array of pieces
    @param maximumWidthInPixels of each text piece
    @returns array of text pieces each small enough so that they
    all can be drawn on the canvas associated with the given context
    while not exceeding the given maximum width
*/
function convertCanvasTextIntoSmallerPieces(
    ctx, text, maximumWidthInPixels)
{
    var textPieces = [];
    var textPiece = "";

    // Convert text into array of words
    var words = text.split(" ");

    // Add words until adding another one would make the text
    // piece's length on the canvas exceed maximumWidthInPixels,
    // in which case the text piece is added to the array of returned
    // pieces, and the process is repeated for a new piece until
    // no more words remain
    while (words.length > 0) {
        textPiece += (words.shift() + ' ');
        if (ctx.measureText(textPiece).width >= maximumWidthInPixels) {
            textPieces.push(textPiece);
            textPiece = "";
        }
    }

    // Save the last piece
    textPieces.push(textPiece);

    return textPieces;
}