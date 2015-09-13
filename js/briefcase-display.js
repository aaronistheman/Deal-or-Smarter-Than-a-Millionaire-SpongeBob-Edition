"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @pre moneyAmounts.length = BriefcaseDisplay.NUMBER_OF_CASES
    @param caseCanvasId id of the canvas to draw the briefcases on
    @param textCanvasId id of the canvas to draw the text (i.e.
    the briefcase numbers) on
    @param moneyAmounts array of money amounts to display
    @param numberToEmphasize number of the case to emphasize
*/
function BriefcaseDisplay(caseCanvasId, textCanvasId, moneyAmounts,
        numberToEmphasize) {
    this.caseCanvasId = caseCanvasId;
    this.textCanvasId = textCanvasId;
    this.moneyAmounts = moneyAmounts;
    this.numberToEmphasize = numberToEmphasize;
    this.numbersToFade = [];
}

/*
    @pre no aspect of the briefcase display has been drawn
    @post all briefcases (and their numbers) have been drawn
*/
BriefcaseDisplay.prototype.draw = function() {
    // Set up the canvas contexts
    var caseContext =
        document.getElementById(this.caseCanvasId).getContext('2d');
    var textContext = this.getTextContext();

    // Iterate to draw each briefcase
    for (var i = 0; i < this.moneyAmounts.length; ++i) {
        var position = BriefcaseDisplay.getCasePosition(i + 1);
        this._drawBriefcase(caseContext, textContext,
            position.x, position.y, (i + 1));
    }
};

/*
    @post this.numbersToFade has been updated; now faded case
    has been redrawn
    @param caseNumber of the case to apply the fade to
*/
BriefcaseDisplay.prototype.giveFade = function(caseNumber) {
    // Only act if the case hasn't already been given fade
    if (this.numbersToFade.indexOf(caseNumber) === -1) {
        this.numbersToFade.push(caseNumber);

        // Set up variables for redrawing
        var caseContext =
            document.getElementById(this.caseCanvasId).getContext('2d');
        var textContext = this.getTextContext();
        var position = BriefcaseDisplay.getCasePosition(caseNumber);

        // Erase and redraw the case
        this._eraseBriefcase(caseContext, textContext,
            position.x, position.y);
        this._drawBriefcase(caseContext, textContext, position.x,
            position.y, caseNumber);
    }
}

/*
    @pre 1 <= newNumber <= NUMBER_OF_CASES
    @post this.numberToEmphasize has been updated; formerly
    emphasized case has been redrawn so that it's no longer
    emphasized; now emphasized case has been redrawn so that
    it is emphasized
    @param newNumber new number of case to emphasize; set to
    "none" to emphasize no case
*/
BriefcaseDisplay.prototype.setEmphasis = function(newNumber) {
    // Set up variables
    var caseContext =
        document.getElementById(this.caseCanvasId).getContext('2d');
    var textContext = this.getTextContext();
    var oldNumber = this.numberToEmphasize;
    var oldPosition = BriefcaseDisplay.getCasePosition(oldNumber);
    if (newNumber !== "none")
        var newPosition = BriefcaseDisplay.getCasePosition(newNumber);

    // Update numberToEmphasize
    this.numberToEmphasize = newNumber;

    // Redraw the formerly emphasized case
    this._eraseBriefcase(caseContext, textContext,
        oldPosition.x, oldPosition.y);
    this._drawBriefcase(caseContext, textContext, oldPosition.x,
        oldPosition.y, oldNumber);

    if (newNumber !== "none") {
        // Redraw the now emphasized case
        this._eraseBriefcase(caseContext, textContext,
            newPosition.x, newPosition.y);
        this._drawBriefcase(caseContext, textContext, newPosition.x,
            newPosition.y, newNumber);
    }
};

/*
    @pre this.numberToEmphasize != "none"
    @post the next case has been identified, with wrap around if
    necessary, so that setEmphasis() can handle the rest
*/
BriefcaseDisplay.prototype.emphasizeNextCase = function() {
    var nextCaseNumber = (this.numberToEmphasize + 1);
    if (nextCaseNumber > BriefcaseDisplay.NUMBER_OF_CASES)
        nextCaseNumber = 1;
    this.setEmphasis(nextCaseNumber);
};

/*
    @pre this.numberToEmphasize != "none"
    @post the previous case has been identified, with wrap around if
    necessary, so that setEmphasis() can handle the rest
*/
BriefcaseDisplay.prototype.emphasizePreviousCase = function() {
    var previousCaseNumber = (this.numberToEmphasize - 1);
    if (previousCaseNumber < 1)
        previousCaseNumber = BriefcaseDisplay.NUMBER_OF_CASES;
    this.setEmphasis(previousCaseNumber);
};

/*
    @returns canvas context that is set up in all ways except
    for position regarding drawing on the briefcase text canvas
*/
BriefcaseDisplay.prototype.getTextContext = function() {
    var textContext =
        document.getElementById(this.textCanvasId).getContext('2d');
    textContext.fillStyle = BriefcaseDisplay.fillStyles.textStyle;
    textContext.font = BriefcaseDisplay.textFont;
    textContext.textAlign = BriefcaseDisplay.textAlign;
    return textContext;
};

/*
    @post the rectangle at the specified position has been cleared
    on both briefcase canvases
    @param caseContext context of the canvas to erase the briefcase
    itself from
    @param textContext context of the canvas to erase the briefcase
    number from
    @param x coordinate of top left of briefcase
    @param y coordinate of top left of briefcase
*/
BriefcaseDisplay.prototype._eraseBriefcase =
    function(caseContext, textContext, x, y) {
    caseContext.clearRect(x, y,
        BriefcaseDisplay.caseDimensions.x,
        BriefcaseDisplay.caseDimensions.y);
    textContext.clearRect(x, y,
        BriefcaseDisplay.caseDimensions.x,
        BriefcaseDisplay.caseDimensions.y);
};

/*
    @post briefcase indicated by parameter number has been drawn
    (and given a color that makes it emphasized, if it's supposed to be)
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
    caseContext.fillStyle = this.getCaseFillStyle(number);

    // Draw the briefcase and its number
    caseContext.fillRect(x, y,
        BriefcaseDisplay.caseDimensions.x,
        BriefcaseDisplay.caseDimensions.y);
    textContext.fillText(number,
        x + (BriefcaseDisplay.caseDimensions.x / 2.0),
        y + (BriefcaseDisplay.caseDimensions.y / 2.0));
};

/*
    @param caseNumber the case to get the appropriate color of
    @returns appropriate briefcase fill style (i.e. color),
    based on whether or not the briefcase is supposed to be
    emphasized
*/
BriefcaseDisplay.prototype.getCaseFillStyle = function(caseNumber) {
    if (this.numbersToFade.indexOf(caseNumber) !== -1)
        return BriefcaseDisplay.fillStyles.fadedCaseStyle;
    else if (caseNumber === this.numberToEmphasize)
        return BriefcaseDisplay.fillStyles.emphasizedCaseStyle;
    else
        return BriefcaseDisplay.fillStyles.caseStyle;
}

/*
    Static members and methods
*/

BriefcaseDisplay.caseDimensions = new Vector2d(190, 95);

// padding is space between briefcases
BriefcaseDisplay.casePaddings = new Vector2d(10, 40);

// space needed to jump from point on one case to exact same
// point of adjacent case
BriefcaseDisplay.marginalCasePosition =
    BriefcaseDisplay.caseDimensions.getSum(
        BriefcaseDisplay.casePaddings);

BriefcaseDisplay.firstCasePosition = new Vector2d(55, 185);

BriefcaseDisplay.fillStyles = {
    caseStyle : "#C0C0C0",
    fadedCaseStyle : "rgba(192, 192, 192, 0.3)",
    emphasizedCaseStyle : "#FFDF00",
    textStyle : "black",
};

BriefcaseDisplay.textFont = "30px Arial";
BriefcaseDisplay.textAlign = "center";

BriefcaseDisplay.NUMBER_OF_CASES = 10;

/*
    @hasTest yes
    @param whichCase number of the case to get the position of;
    1 <= whichCase <= BriefcaseDisplay.NUMBER_OF_CASES
    @returns Vector2d object containing the position to draw the
    briefcase at (on its canvas)
*/
BriefcaseDisplay.getCasePosition = function(whichCase) {
    // Decide how much to adjust the case position
    var multiplierX = ((whichCase - 1) % 5);
    var multiplierY = (whichCase < 6) ? 0 : -1;
    var adjustment = new Vector2d(multiplierX, multiplierY);

    return BriefcaseDisplay.firstCasePosition.getSum(
        BriefcaseDisplay.marginalCasePosition.getProduct(
            adjustment));
}