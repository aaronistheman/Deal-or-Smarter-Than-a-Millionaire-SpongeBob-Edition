"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @param imageSource source of the image of the banker
*/
function Banker(imageSource) {
    this.image = new Image();
    this.image.src = imageSource;
}

/*
    @post banker and his environment has been drawn on given
    canvas
    @param canvasId id of the canvas to draw on
*/
Banker.prototype.draw = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    // Draw the banker (i.e. Mr. Krabs)
    var imageSizeMultiplier = 1.3;
    var imageWidth = 257 * imageSizeMultiplier;
    var imageHeight = 224 * imageSizeMultiplier;
    var x = (canvas.width / 2.0) - (imageWidth / 2);
    var y = (canvas.height / 2.0) - (imageHeight / 2) - 40;
    ctx.drawImage(this.image, x, y, imageWidth, imageHeight);

    // Draw a dark rectangle (i.e. "table")
    var x = 20;
    var y = 300;
    var width = canvas.width - (x * 2);
    var height = canvas.height - y;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, height);
}

/*
    @pre arrayOfMoneyAmounts has numbers in the form of strings
    with no dollar signs or commas
    @hasTest yes
    @param arrayOfMoneyAmounts the banker makes his offer based
    on the remaining money amounts
    @returns the banker's offer, which is a certain percentage
    of the average money amount; if the offer is at least 10000,
    it's rounded to the nearest thousand; otherwise, it's rounded
    to the nearest hundred; it's returned as a string and has
    commas where appropriate
*/
Banker.prototype.getOffer = function(arrayOfMoneyAmounts) {
    // Get the average money amount
    var sumMoneyAmounts = 0;
    for (var i = 0; i < arrayOfMoneyAmounts.length; ++i) {
        // Convert each string number into just a number
        var moneyAmount = parseFloat(arrayOfMoneyAmounts[i], 10);
        sumMoneyAmounts += moneyAmount;
    }
    var averageMoneyAmount = sumMoneyAmounts / arrayOfMoneyAmounts.length;

    // Apply the banker multiplier
    var bankerOffer = averageMoneyAmount * Banker.MULTIPLIER;

    if (bankerOffer < 10000) {
        // Round down and to the nearest hundred the banker's offer
        bankerOffer = Math.floor(bankerOffer / 100) * 100;
    }
    else {
        // Round down and to the nearest thousand the banker's offer
        bankerOffer = Math.floor(bankerOffer / 1000) * 1000;
    }

    // Return the banker's offer as a string with commas where
    // appropriate
    return putCommasInStringInteger(bankerOffer.toString());
};

/*
    Static members
*/

Banker.MULTIPLIER = 0.80;