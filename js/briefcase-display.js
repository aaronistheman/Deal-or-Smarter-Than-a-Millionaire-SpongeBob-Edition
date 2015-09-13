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
    @param numberToEmphasize number of the case to emphasize
*/
function BriefcaseDisplay(caseCanvasId, textCanvasId, moneyAmounts,
        numberToEmphasize) {
    this.caseCanvasId = caseCanvasId;
    this.textCanvasId = textCanvasId;
    this.moneyAmounts = moneyAmounts;
    this.numberToEmphasize = numberToEmphasize;
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
    var textContext = this.getTextContext();

    // For help with positioning the briefcases
    var isOdd = function(number) { return ((number % 2) === 1); };
    var x = BriefcaseDisplay.firstCasePosition.x;
    var initialY = BriefcaseDisplay.firstCasePosition.y;
    var y = initialY;
    var horizontalPadding = BriefcaseDisplay.casePaddings.x;
    var verticalPadding = BriefcaseDisplay.casePaddings.y;

    for (var i = 0; i < this.moneyAmounts.length; ++i) {
        if ((i + 1) === this.numberToEmphasize)
            caseContext.fillStyle =
                BriefcaseDisplay.fillStyles.emphasizedCaseStyle;
        else
            caseContext.fillStyle =
                BriefcaseDisplay.fillStyles.caseStyle;

        this._drawBriefcase(caseContext, textContext, x, y, (i + 1));

        // Update x and y
        if (isOdd(i)) {
            x += (BriefcaseDisplay.caseDimensions.width +
                horizontalPadding);
            y = initialY;
        }
        else {
            y += (BriefcaseDisplay.caseDimensions.height +
                verticalPadding);
        }
    }
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
    caseContext.fillRect(x, y,
        BriefcaseDisplay.caseDimensions.x,
        BriefcaseDisplay.caseDimensions.y);
    textContext.fillText(number,
        x + (BriefcaseDisplay.caseDimensions.x / 2.0),
        y + (BriefcaseDisplay.caseDimensions.y / 2.0));
};

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
    emphasizedCaseStyle : "#FFDF00",
    textStyle : "black",
};

BriefcaseDisplay.textFont = "30px Arial";
BriefcaseDisplay.textAlign = "center";

/*
    @hasTest yes
    @param whichCase number of the case to get the position of;
    1 <= whichCase <= 10
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