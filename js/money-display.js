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
    this._barCanvasId = barCanvasId;
    this._textCanvasId = textCanvasId;

    // Store this so we know what text to put on each bar
    this._moneyAmounts = moneyAmounts.slice();

    this._numbersOfBarsToFade = [];
}

/*
    @hasTest yes
    @param moneyAmount instance of MoneyAmount
    @returns the index in this._moneyAmounts of the instance of
    MoneyAmount that is exactly the same as the given MoneyAmount
    instance; if none is found, -1 is returned
*/
MoneyDisplay.prototype.getBarIndex = function(moneyAmount) {
    for (var i = 0; i < this._moneyAmounts.length; ++i) {
        if (this._moneyAmounts[i].asNumber() === moneyAmount.asNumber())
            return i;
    }
    return -1;
}

/*
    @post this._numbersOfBarsToFade has been updated; now faded bar
    has been redrawn
    @param barNumber of the bar to apply the fade to
*/
MoneyDisplay.prototype.giveFade = function(barNumber) {
    // Only act if the bar hasn't already been given fade
    if (this._numbersOfBarsToFade.indexOf(barNumber) === -1) {
        this._numbersOfBarsToFade.push(barNumber);

        // Although there isn't a test for giveFade(), another test
        // calls that function, so sealing off the following code
        // from the unit tests is more efficient
        if (!isUnitTesting()) {
            // Set up variables for redrawing the bar
            var barContext = document.getElementById(this._barCanvasId).
                getContext('2d');
            barContext.fillStyle = this._getBarFillStyle(barNumber);
            var textContext = this._getSetUpTextContext();
            var position = MoneyDisplay.getBarPosition(barNumber);

            // Erase and redraw the bar
            this._eraseBar(barContext, position.x, position.y);
            this._drawBar(barContext, position.x, position.y);
        }
    }
}

/*
    @pre 1 <= barNumber <= MoneyDisplay.NUMBER_OF_BARS
    @param barNumber number of the bar to get the fill style of
    @returns the fill style that would be appropriate for the context
    that will be used to draw the indicated bar
*/
MoneyDisplay.prototype._getBarFillStyle = function(barNumber) {
    if (this._numbersOfBarsToFade.indexOf(barNumber) !== -1) {
        // Grey out this bar
        return "rgba(192, 192, 192, 0.3)";
    }
    else {
        // Display this bar normally
        return MoneyDisplay.defaultBarColor;
    }
}

/*
    @returns the set up context of the canvas to draw bars' text on
*/
MoneyDisplay.prototype._getSetUpTextContext = function() {
    var textContext = document.getElementById(this._textCanvasId).
        getContext('2d');
    textContext.fillStyle = "black";
    textContext.font = MoneyDisplay.textFontSize + "px Arial";
    textContext.textBaseline = "middle";
    return textContext;
}

/*
    @pre the canvases indicated by this._barCanvasId and this.textCanvasId
    are ready to be drawn on
    @post each bar (including the one that will display the banker's
    offer) has been drawn
*/
MoneyDisplay.prototype._drawEntireDisplay = function() {
    // Set up the canvases' contexts
    var barContext = document.getElementById(this._barCanvasId).
        getContext('2d');
    var textContext = this._getSetUpTextContext();

    this._drawTenBarsAndText(barContext, textContext);
    this._drawBankerOfferBar(barContext);
}

/*
    @post the bar on which the banker's offer can be displayed
    has been drawn
*/
MoneyDisplay.prototype._drawBankerOfferBar = function(barContext) {
    barContext.fillStyle = MoneyDisplay.defaultBarColor;
    barContext.fillRect(MoneyDisplay.bankerOfferBarPosition.x,
        MoneyDisplay.bankerOfferBarPosition.y,
        MoneyDisplay.bankerOfferBarDimensions.x,
        MoneyDisplay.bankerOfferBarDimensions.y);
}

/*
    @pre offer is instance of MoneyAmount
    @post the specified text has been drawn on the banker offer bar
    @param textContext set up context to use for drawing the bar's text
    @param offer to draw on the bnker offer bar
*/
MoneyDisplay.prototype._drawBankerOfferBarText =
    function(textContext, offer)
{
    textContext.font =
        "bold " + MoneyDisplay.bankerOfferTextFontSize + "px Arial";
    textContext.textAlign = "center";
    var textToDraw = '$ ' + offer.asString();
    textContext.fillText(textToDraw,
        MoneyDisplay.bankerOfferBarPosition.x +
            (MoneyDisplay.bankerOfferBarDimensions.x / 2),
        MoneyDisplay.bankerOfferBarPosition.y +
            (MoneyDisplay.bankerOfferBarDimensions.y / 2));
}

/*
    @post the text in the banker offer bar has been erased
    @param textContext set up context to use for erasing the bar's text
*/
MoneyDisplay.prototype._eraseBankerOfferBarText = function(textContext) {
    textContext.clearRect(MoneyDisplay.bankerOfferBarPosition.x,
        MoneyDisplay.bankerOfferBarPosition.y,
        MoneyDisplay.bankerOfferBarDimensions.x,
        MoneyDisplay.bankerOfferBarDimensions.y);
}

/*
    @pre isShown has either the value true or the value false;
    newOffer is instance of MoneyAmount
    @param isShown true to show the banker's offer; false to erase
    the text that would show it
    @param newOffer to draw as text on the banker offer bar; can
    be ignored if isShown is false
*/
MoneyDisplay.prototype.setBankerOffer = function(isShown, newOffer) {
    var textContext = this._getSetUpTextContext();
    if (isShown)
        this._drawBankerOfferBarText(textContext, newOffer);
    else
        this._eraseBankerOfferBarText(textContext);
}

/*
    @post the bars that display the ten briefcases' values have
    been drawn (graphically and textually)
    @param barContext context for drawing the bars graphically
    @param textContext set up context for drawing the bars' text
*/
MoneyDisplay.prototype._drawTenBarsAndText =
    function(barContext, textContext)
{
    for (var i = 0; i < MoneyDisplay.NUMBER_OF_BARS; ++i) {
        // Get the bar's unique color and position
        barContext.fillStyle = this._getBarFillStyle(i + 1);
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
MoneyDisplay.prototype._drawBar = function(barContext, x, y) {
    barContext.fillRect(x, y, MoneyDisplay.barDimensions.x,
        MoneyDisplay.barDimensions.y);
}

/*
    @post the rectangle at the indicated position has been cleared
    on only the graphical bar canvas; this will erase the graphical
    part of a bar, if x and y are correct
    @param barContext context of the canvas on which the graphical
    (non-textual) part of the bar is drawn
    @param x coordinate of the top left of the bar
    @param y coordinate of the top left of the bar
*/
MoneyDisplay.prototype._eraseBar = function(barContext, x, y) {
    barContext.clearRect(x, y, MoneyDisplay.barDimensions.x,
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
    var textToDraw = '$ ' + this._moneyAmounts[number - 1].asString();
    textContext.fillText(textToDraw, x + MoneyDisplay.textIndent,
        y + (MoneyDisplay.barDimensions.y / 2));
}

/*
    @pre canvases indicatd by the ids given to this instance are
    ready to be drawn on
*/
MoneyDisplay.prototype.setUp = function() {
    this._drawEntireDisplay();
};

/*
    Static members and methods
*/

MoneyDisplay.NUMBER_OF_BARS = 10;
MoneyDisplay.defaultBarColor = "#FFDF00";
MoneyDisplay.barDimensions = new Vector2d(400, 50);

// Space between bars (and the top and left canvas edges)
MoneyDisplay.paddings = new Vector2d(
    (CANVAS_WIDTH - (MoneyDisplay.barDimensions.x * 2)) / 3, 15);

MoneyDisplay.firstBarPosition =
    MoneyDisplay.paddings.getSum(new Vector2d(0, 95));

MoneyDisplay.marginalBarPosition = new Vector2d(
    MoneyDisplay.barDimensions.x + MoneyDisplay.paddings.x,
    MoneyDisplay.barDimensions.y + MoneyDisplay.paddings.y);

MoneyDisplay.textFontSize = (MoneyDisplay.barDimensions.y - 10);
MoneyDisplay.textIndent = 20; // how much to indent the text in a bar

MoneyDisplay.bankerOfferBarPosition = MoneyDisplay.paddings;
MoneyDisplay.bankerOfferBarDimensions = new Vector2d(
    CANVAS_WIDTH - (MoneyDisplay.paddings.x * 2),
    MoneyDisplay.firstBarPosition.y - (MoneyDisplay.paddings.y * 2));
MoneyDisplay.bankerOfferTextFontSize =
    (MoneyDisplay.bankerOfferBarDimensions.y - 10);

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