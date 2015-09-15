"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @param name of the speaker
    @param imageSource for drawing the image of the speaker
    @param canvasId id of the canvas to draw the speaker on, if
    he/she is drawn
    @param posX x-coordinate of the speaker when drawn on the canvas
    @param posY y-coordinate of the speaker when drawn on the canvas
*/
function Speaker(name, imageSource, canvasId, posX, posY) {
    this.name = name;

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
    THE_FLYING_DUTCHMAN : "The Flying Dutchman",
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

    objects[SPEAKERS.SPONGEBOB] = new Speaker(SPEAKERS.SPONGEBOB,
        "images/spongebob.png", canvasId, 600, 50);

    return objects;
}