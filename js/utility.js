"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1

    This file includes code that isn't easily assigned to one
    of the other JavaScript files.
*/

var CANVAS_WIDTH = 1100;
var CANVAS_HEIGHT = 550;

// Namespace for GUI object prototypes
var GUI = {};

/*
    @returns true if currently unit testing, false otherwise
*/
function isUnitTesting() {
    return $("#qunit").length === 1;
}

/*
    @post the message has been used in an alert (if unit tests are
    not occuring) and thrown as an exception
    @param message
*/
function alertAndThrowException(message) {
    message = "Error: " + message;
    if (!isUnitTesting())
        alert(message);
    throw message;
}

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
    var nextWord = "";

    // Convert text into array of words
    var words = text.split(" ");

    // Add words until adding another one would make the text
    // piece's length on the canvas exceed maximumWidthInPixels,
    // in which case the text piece is added to the array of returned
    // pieces, and the process is repeated for a new piece until
    // no more words remain
    while (words.length > 0) {
        nextWord = (words.shift() + ' ');

        // Check if adding the next word would make the text
        // piece too big
        if (ctx.measureText(textPiece + nextWord).width >=
            maximumWidthInPixels) {
            textPieces.push(textPiece);
            textPiece = nextWord;
        }
        else
            textPiece += nextWord;
    }

    // Save the last piece
    textPieces.push(textPiece);

    return textPieces;
}