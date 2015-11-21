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
    @param sizeX width to scale the image to when drawing on canvas
    @param sizeY height to scale the image to when drawing on canvas
*/
function Speaker(imageSource, canvasId, posX, posY, sizeX, sizeY) {
    // Store the image indicated by imageSource
    this.image = new Image();
    this.image.src = imageSource;

    // Store canvas data
    this.canvasId = canvasId;
    this.posX = posX;
    this.posY = posY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
}

/*
    @post the speaker has been drawn on the canvas indicated by
    this.canvasId
*/
Speaker.prototype.draw = function() {
    var canvas = document.getElementById(this.canvasId);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.image, this.posX, this.posY,
        this.sizeX, this.sizeY);
};

// Note that the values of these constants are used
var SPEAKERS = {
    // The host
    SPONGEBOB : "SpongeBob",

    // Helpers
    SQUIDWARD : "Squidward",
    MERMAID_MAN : "Mermaid Man",
    SANDY : "Sandy",
    LARRY : "Larry",
    GARY : "Gary",

    // The friend used in Phone-a-Friend lifeline
    PATRICK : "Patrick",
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
        "media/images/spongebob.png", canvasId, 600, 100, 356, 427);
    objects[SPEAKERS.SQUIDWARD] = new Speaker(
        "media/images/squidward.png", canvasId, 700, 10, 177, 520);
    objects[SPEAKERS.MERMAID_MAN] = new Speaker(
        "media/images/mermaid_man.png", canvasId, 550, 50, 450, 339);
    objects[SPEAKERS.SANDY] = new Speaker(
        "media/images/sandy.png", canvasId, 700, 90, 212, 438);
    objects[SPEAKERS.LARRY] = new Speaker(
        "media/images/larry_the_lobster.png", canvasId, 600, 50, 340, 363);
    objects[SPEAKERS.GARY] = new Speaker(
        "media/images/gary.gif", canvasId, 600, 200, 273, 214);
    objects[SPEAKERS.PATRICK] = new Speaker(
        "media/images/patrick.jpg", canvasId, 300, 50, 480, 360);

    return objects;
}