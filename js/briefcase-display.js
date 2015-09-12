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
    var testCanvas = document.getElementById(this.caseCanvasId);
    var ctx = testCanvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(10, 10, 10, 10);
};

BriefcaseDisplay.prototype.setUp = function() {
    this.draw();
};