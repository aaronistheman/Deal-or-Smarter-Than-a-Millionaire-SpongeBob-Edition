"use strict";

/*
    Authors of original (C++, SFML-supporting) version:
        Artur Moreira, Henrik Vogelius Hansson, and Jan Haller
    Translated (from C++, SFML-supporting version to
        JavaScript, Canvas-supporting version) by: Aaron Kaloti
    For experimentation
*/

/*
    Inherits from GUI.Component
    @hasTest yes
    @param text the text to display on the label
    @param fontFace the font face to use for drawing the label's text;
    should be a string
*/
GUI.Label = function(text, fontFace) {
    if (!(this instanceof GUI.Label))
        return new GUI.Label(text, fontFace);
    else {
        GUI.Component.call(this);

        // Define truly private property "_text"
        var _text = text;
        Object.defineProperty(this, "text", {
            get : function() {
                return _text;
            },
            set : undefined,
            enumerable : true,
            configurable : true
        });

        this.fontFace = fontFace;
        this.fontSize = 15;
    }
};

// Make GUI.Label inherit from GUI.Component
GUI.Label.prototype = Object.create(GUI.Component.prototype, {
    constructor : {
        configurable : true,
        enumerable : true,
        value : GUI.Label,
        writable : true
    }
});

GUI.Label.prototype.isSelectable = function() {
    return false;
}

/*
    See draw() of supertype GUI.Component for general
    description; note that the graphicalCanvas argument
    isn't used here
    @post the label, which is solely text, has been
    drawn on the given textual canvas; note that the label's
    position is its top-left coordinate
*/
GUI.Label.prototype.draw = function(graphicalCanvas, textualCanvas) {
    var context = textualCanvas.getContext('2d');
    context.fillStyle = GUI.Label.TEXT_COLOR;
    context.font = this.fontSize + "px " + this.fontFace;
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(this.text, this._positionX, this._positionY);
}

GUI.Label.TEXT_COLOR = "black";