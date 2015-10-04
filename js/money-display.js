"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    When looking at the money display, the indexes of each bar
    are as follows:
    [1, 6] - the top row
    [2, 7]
    [3, 8]
    [4, 9]
    [5, 10] - the bottom row
*/

/*
    @pre moneyAmounts.length = 10
    @param barCanvasId id of the canvas to draw the bars on
    @param textCanvasId id of the canvas to draw the text (i.e.
    the money amounts) on
    @param moneyAmounts array of 10 instances of MoneyAmount, the
    values of which will be displayed
*/
function MoneyDisplay(barCanvasId, textCanvasId, moneyAmounts) {
    this.barCanvasId = barCanvasId;
    this.textCanvasId = textCanvasId;
    this.moneyAmounts = moneyAmounts;
}

/*
    @pre what the caller wants to draw hasn't been drawn
    @post what the caller wants to draw (see @param) has been
    drawn
    @hasTest no
    @param whatToDraw either has value of "bars" or "text"
    @returns parameterError() if invalid whatToDraw value; otherwise,
    nothing
    @throws caught exception if invalid whatToDraw value
*/
// MoneyDisplay.prototype.draw = function(whatToDraw) {
    // // Get variables that apply to drawing bars and text
    // var barSettings = MoneyDisplay.barSettings;
    // var textSettings = MoneyDisplay.textSettings;

    // var barWidth = barSettings.width;
    // var horizontalPadding = barSettings.horizontalPadding;
    // var barHeight = barSettings.height;
    // var verticalPadding = barSettings.verticalPadding;

    // // Get variables that are specific to what's being drawn
    // try {
        // if (whatToDraw === 'bars') {
            // // Set variables specific to drawing bars
            // var canvas = document.getElementById(this.barCanvasId);
            // var ctx = canvas.getContext('2d');
            // ctx.fillStyle = barSettings.fillStyle;
            // var x = horizontalPadding;
            // var firstBarY = verticalPadding; // facilitates
                                             // // resetting y
            // var y = firstBarY;
        // }
        // else if (whatToDraw === 'text') {
            // // Set variables specific to drawing text
            // var canvas = document.getElementById(this.textCanvasId);
            // var ctx = canvas.getContext('2d');
            // ctx.fillStyle = textSettings.fillStyle;
            // ctx.font = textSettings.fontSize + "px Arial";
            // var x = horizontalPadding + 20;
            // var firstBarY = verticalPadding + 45; // facilitates
                                                  // // resetting y
            // var y = firstBarY;
        // }
        // else
            // throw "Invalid value for whatToDraw";
    // }
    // catch (err) {
        // return parameterError(err);
    // }

    // for (var i = 0; i < this.moneyAmounts.length; ++i) {
        // if (whatToDraw === 'bars') {
            // // draw the bar
            // ctx.fillRect(x, y, barWidth, barHeight);
        // }
        // else if (whatToDraw === 'text') {
            // var textToDraw = '$ ' + this.moneyAmounts[i].asString();
            // ctx.fillText(textToDraw, x, y);
        // }

        // y += (barHeight + verticalPadding);

        // // if five bars have been drawn, go to next column
        // if (i === 4) {
            // x += (barWidth + horizontalPadding);
            // y = firstBarY;
        // }
    // }
// };

/*
    @returns the set up context of the canvas to draw graphical
    part of the bars on
*/
MoneyDisplay.prototype._getSetUpBarContext = function() {
    var barContext = document.getElementById(this.barCanvasId).
        getContext('2d');
    barContext.fillStyle = "#FFDF00";
    return barContext;
}

/*
    @returns the set up context of the canvas to draw bars' text on
*/
MoneyDisplay.prototype._getSetUpTextContext = function() {
    var textContext = document.getElementById(this.textCanvasId).
        getContext('2d');
    textContext.fillStyle = "black";
    textContext.font = MoneyDisplay.textFontSize + "px Arial";
    return textContext;
}

/*
    @post each bar has been drawn
*/
MoneyDisplay.prototype._drawEntireDisplay = function() {
    // Set up the canvases' contexts
    var barContext = this._getSetUpBarContext();
    var textContext = this._getSetUpTextContext();

    for (var i = 0; i < MoneyDisplay.NUMBER_OF_BARS; ++i) {
        var position = MoneyDisplay.getBarPosition(i + 1);
        this._drawBar(barContext, position.x, position.y);
        this._drawBarText(textContext, position.x, position.y, (i + 1));
    }
}

/*
    @post a bar has been drawn at the indicated position
    @param barContext context of the canvas to draw the graphical
    part of the bar on
    @param x of top left corner of the bar
    @param y of top left corner of the bar
*/
MoneyDisplay.prototype._drawBar = function(barContext, x, y)
{
    barContext.fillRect(x, y, MoneyDisplay.barDimensions.x,
        MoneyDisplay.barDimensions.y);
}

/*
    @pre 1 <= number <= MoneyDisplay.NUMBER_OF_BARS
    @post the appropriate text has been drawn at the indicated position
    @param textContext context of the canvas to draw the textual
    part of the bar on
    @param x of top left corner of the bar's graphical part
    @param y of top left corner of the bar's graphical part
    @param number of the bar (see comment at the top of this file
    regarding the numbers of the bars)
*/
MoneyDisplay.prototype._drawBarText =
    function(textContext, x, y, number)
{
    var textToDraw = '$ ' + this.moneyAmounts[number - 1].asString();
    textContext.fillText(textToDraw, x + 20, y + 45);
}

MoneyDisplay.prototype.setUp = function() {
    this._drawEntireDisplay();
};

/*
    Static members and methods
*/

MoneyDisplay.NUMBER_OF_BARS = 10;

MoneyDisplay.barDimensions = new Vector2d(400, 60);

MoneyDisplay.paddings = new Vector2d(
    (1100 - (MoneyDisplay.barDimensions.x * 2)) / 3, 20);

MoneyDisplay.firstBarPosition = MoneyDisplay.paddings;

MoneyDisplay.marginalBarPosition = new Vector2d(
    MoneyDisplay.barDimensions.x + MoneyDisplay.paddings.x,
    MoneyDisplay.barDimensions.y + MoneyDisplay.paddings.y);

MoneyDisplay.textFontSize = (MoneyDisplay.barDimensions.y - 20);

/*
    @pre 1 <= whichOne <= MoneyDisplay.NUMBER_OF_BARS
    @hasTest yes
    @param whichOne the number of the money bar to get the position of
    @returns Vector2d object containing the position to draw the
    money bar at (on its canvas)
*/
MoneyDisplay.getBarPosition = function(whichOne) {
    // Decide how much to adjust the bar position
    var multiplierX = (whichOne < 6) ? 0 : 1;
    var multiplierY = ((whichOne - 1) % 5);
    var adjustment = new Vector2d(multiplierX, multiplierY);

    return MoneyDisplay.firstBarPosition.getSum(
        MoneyDisplay.marginalBarPosition.getProduct(adjustment));
}