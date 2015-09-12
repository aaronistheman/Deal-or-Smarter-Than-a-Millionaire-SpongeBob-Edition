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
    this._drawBriefcase(
        document.getElementById(this.caseCanvasId).getContext('2d'),
        document.getElementById(this.textCanvasId).getContext('2d'),
        100,
        100,
        3);
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
    caseContext.fillStyle = "#C0C0C0";
    caseContext.fillRect(x, y, 190, 95);
};

BriefcaseDisplay.prototype.setUp = function() {
    this.draw();
};