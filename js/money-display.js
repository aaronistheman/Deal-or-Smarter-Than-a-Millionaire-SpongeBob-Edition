"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
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
MoneyDisplay.prototype.draw = function(whatToDraw) {
    // Get variables that apply to drawing bars and text
    var barSettings = MoneyDisplay.barSettings;
    var textSettings = MoneyDisplay.textSettings;

    var barWidth = barSettings.width;
    var horizontalPadding = barSettings.horizontalPadding;
    var barHeight = barSettings.height;
    var verticalPadding = barSettings.verticalPadding;

    // Get variables that are specific to what's being drawn
    try {
        if (whatToDraw === 'bars') {
            // Set variables specific to drawing bars
            var canvas = document.getElementById(this.barCanvasId);
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = barSettings.fillStyle;
            var x = horizontalPadding;
            var firstBarY = verticalPadding; // facilitates
                                             // resetting y
            var y = firstBarY;
        }
        else if (whatToDraw === 'text') {
            // Set variables specific to drawing text
            var canvas = document.getElementById(this.textCanvasId);
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = textSettings.fillStyle;
            ctx.font = textSettings.fontSize + "px Arial";
            var x = horizontalPadding + 20;
            var firstBarY = verticalPadding + 45; // facilitates
                                                  // resetting y
            var y = firstBarY;
        }
        else
            throw "Invalid value for whatToDraw";
    }
    catch (err) {
        return parameterError(err);
    }

    for (var i = 0; i < this.moneyAmounts.length; ++i) {
        if (whatToDraw === 'bars') {
            // draw the bar
            ctx.fillRect(x, y, barWidth, barHeight);
        }
        else if (whatToDraw === 'text') {
            var textToDraw = '$ ' + this.moneyAmounts[i].asString();
            ctx.fillText(textToDraw, x, y);
        }

        y += (barHeight + verticalPadding);

        // if five bars have been drawn, go to next column
        if (i === 4) {
            x += (barWidth + horizontalPadding);
            y = firstBarY;
        }
    }
};

MoneyDisplay.prototype.setUp = function() {
    this.draw('bars');
    this.draw('text');
};

/*
    Static members and methods
*/

MoneyDisplay.barSettings = {
    fillStyle : "#FFDF00",
    width : 400,
    height : 60,

    // padding is space between bars
    verticalPadding : 20,
};
// this makes equal horizontal spacing between bars
MoneyDisplay.barSettings.horizontalPadding =
    (1100 - (MoneyDisplay.barSettings.width * 2)) / 3;

MoneyDisplay.textSettings = {
    fillStyle : "black",
    padding : 10,
};
MoneyDisplay.textSettings.fontSize =
    (MoneyDisplay.barSettings.height -
    (MoneyDisplay.textSettings.padding * 2));