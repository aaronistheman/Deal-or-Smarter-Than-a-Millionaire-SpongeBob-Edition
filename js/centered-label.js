"use strict";

/*
    Original Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    Inherits from GUI.Label

    @hasTest yes
    @param text the text to display on the label
    @param fontFace the font face to use for drawing the label's text;
    should be a string
*/
GUI.CenteredLabel = function(text, fontFace) {
    if (!(this instanceof GUI.CenteredLabel))
        return new GUI.CenteredLabel(text, fontFace);
    else {
        GUI.Label.call(this, text, fontFace);
    }
};

// Make GUI.CenteredLabel inherit from GUI.Label
GUI.CenteredLabel.prototype = Object.create(GUI.Label.prototype, {
    constructor : {
        configurable : true,
        enumerable : true,
        value : GUI.CenteredLabel,
        writable : true
    }
});

/*
    @Override
    Note that the graphicalCanvas argument isn't used here

    @post the label has been drawn on the given textual canvas; the
    label is centered on what has been defined as its position
*/
GUI.CenteredLabel.prototype.draw = function(graphicalCanvas, textualCanvas) {
    var context = textualCanvas.getContext('2d');
    context.fillStyle = GUI.Label.TEXT_COLOR;
    context.font = GUI.Label.FONT_SIZE + "px " + this.fontFace;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.text, this._positionX, this._positionY);
};