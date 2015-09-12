"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @pre moneyAmounts.length = 10
    @param caseCanvasId id of the canvas to draw the briefcases on
    @param textCanvasId id of the canvas to draw the text (i.e.
    the briefcase numbers) on
    @param moneyAmounts array of 10 money amounts to display
*/
function BriefcaseDisplay(caseCanvasId, textCanvasId, moneyAmounts) {
    this.caseCanvasId = caseCanvasId;
    this.textCanvasId = textCanvasId;
    this.moneyAmounts = moneyAmounts;
}

/*
    @pre what the caller wants to draw hasn't been drawn
    @post what the caller wants to draw has been
    drawn
    @hasTest no
    @returns nothing
    @throws nothing
*/
BriefcaseDisplay.prototype.draw = function() {
    // Set up the canvas contexts
    var caseContext =
        document.getElementById(this.caseCanvasId).getContext('2d');
    var textContext =
        document.getElementById(this.textCanvasId).getContext('2d');

    caseContext.fillStyle = "#C0C0C0";
    textContext.fillStyle = "black";
    textContext.font = "30px Arial";
    textContext.textAlign = "center";

    this._drawBriefcase(
        caseContext, textContext, 100, 100, 3);
};

/*
    @post briefcase has been drawn
    @hasTest no
    @param caseContext context of the canvas to draw the case on
    @param textContext context of the canvas to draw the case's
    number on
    @param x where
    @param y where
    @param number on the briefcase
    @returns nothing
    @throws nothing
*/
BriefcaseDisplay.prototype._drawBriefcase =
    function(caseContext, textContext, x, y, number) {
    var briefcaseWidth = 190;
    var briefcaseHeight = 95;

    caseContext.fillRect(x, y,
        BriefcaseDisplay.caseDimensions.width,
        BriefcaseDisplay.caseDimensions.height);
    textContext.fillText(number,
        x + (BriefcaseDisplay.caseDimensions.width / 2.0),
        y + (BriefcaseDisplay.caseDimensions.height / 2.0));
};

BriefcaseDisplay.prototype.setUp = function() {
    this.draw();
};

/*
    Static members and methods
*/

BriefcaseDisplay.caseDimensions = {
    width : 190,
    height : 95,
};