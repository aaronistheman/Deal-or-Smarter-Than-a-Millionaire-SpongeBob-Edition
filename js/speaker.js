"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @param imageSource for drawing the image of the speaker
    @param canvasId id of the canvas to draw the speaker on, if
    he/she is drawn
    @param posX x-coordinate of the speaker when drawn on the canvas
    @param posY y-coordinate of the speaker when drawn on the canvas
*/
function Speaker(imageSource, canvasId, posX, posY) {
    // Store the image indicated by imageSource
    this.image = new Image();
    this.image.src = imageSource;

    // Store canvas data
    this.canvasId = canvasId;
    this.posX = posX;
    this.posY = posY;
}

/*
    @post the speaker has been drawn on the canvas indicated by
    this.canvasId
*/
Speaker.prototype.draw = function() {
    var canvas = document.getElementById(this.canvasId);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.image, this.posX, this.posY);
};

var SPEAKERS = {
    SPONGEBOB : "SpongeBob",
    SQUIDWARD : "Squidward",
    MERMAID_MAN : "Mermaid Man",
    SANDY_CHEEKS : "Sandy Cheeks",
    LARRY_THE_LOBSTER : "Larry the Lobster",
    GARY : "Gary",
};

/*
    @returns an object that uses the strings in SPEAKERS as keys
    and their corresponding Speaker objects as values; because
    some of those strings have spaces in them, the object[key]
    notation should be used for accessing the return object's values
*/
function getSpeakerObjects() {
    var objects = {};
    var canvasId = CANVAS_IDS.SPEAKER;

    objects[SPEAKERS.SPONGEBOB] = new Speaker(
        "images/spongebob.png", canvasId, 600, 50);
    objects[SPEAKERS.SQUIDWARD] = new Speaker(
        "images/squidward.png", canvasId, 600, 50);
    objects[SPEAKERS.MERMAID_MAN] = new Speaker(
        "images/mermaid_man.png", canvasId, 600, 50);
    objects[SPEAKERS.SANDY_CHEEKS] = new Speaker(
        "images/sandy_cheeks.png", canvasId, 600, 50);
    objects[SPEAKERS.LARRY_THE_LOBSTER] = new Speaker(
        "images/larry_the_lobster.png", canvasId, 600, 50);
    objects[SPEAKERS.GARY] = new Speaker(
        "images/gary.gif", canvasId, 600, 50);

    return objects;
}