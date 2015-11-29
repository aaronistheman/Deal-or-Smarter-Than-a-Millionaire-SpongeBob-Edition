"use strict";

/*
    Original Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    Inherits from GUI.Button

    @hasTest yes
    @param fontFace the font face to use for the button's text
    @param fontSize the font size to use for the button's text
    @param width the width of the button
    @param height the height of the button
*/
GUI.LifelineButton = function(fontFace, fontSize, width, height) {
    // Constructor scope safety
    if (!(this instanceof GUI.LifelineButton))
        return new GUI.LifelineButton(fontFace, fontSize, width, height);
    else {
        GUI.Button.call(this, fontFace);

        this._fontSize = fontSize;
        this._width = width;
        this._height = height;
    }
};

// Make GUI.LifelineButton inherit from GUI.Button
GUI.LifelineButton.prototype = Object.create(GUI.Button.prototype, {
    constructor : {
        configurable : true,
        enumerable : true,
        value : GUI.LifelineButton,
        writable : true
    }
});

/*
    @Override
    See function comment of supertype's function
*/
GUI.LifelineButton.prototype._drawGraphicalPart = function(graphicalCanvas) {
    var context = graphicalCanvas.getContext('2d');
    context.fillStyle = "black";
    context.fillRect(this._positionX, this._positionY,
        this._width, this._height);
};

/*
    @Override
    See function comment of supertype's function
*/
GUI.LifelineButton.prototype._drawTextualPart = function(textualCanvas) {
    var context = textualCanvas.getContext('2d');
    context.fillStyle = this._textColor;
    context.font = this._fontSize + "px " + this.fontFace;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.text,
        this._positionX + (this._width / 2),
        this._positionY + (this._height / 2));
};

/*
    @Override
    See function comment of supertype's function
*/
GUI.LifelineButton.prototype._eraseTextualPart = function(textualCanvas) {
    var context = textualCanvas.getContext('2d');
    context.clearRect(this._positionX, this._positionY,
        this._width, this._height);
};