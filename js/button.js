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
    @pre the image parameters are instances of Image
    @hasTest yes
    @param fontFace the font face to use for drawing the button's text;
    should be a string
*/
GUI.Button = function(fontFace) {
    if (!(this instanceof GUI.Button))
        return new GUI.Button(fontFace);
    else {
        GUI.Component.call(this);

        this._callback = undefined;

        // Define truly private property "_text"
        var _text = undefined;
        Object.defineProperty(this, "text", {
            get : function() {
                return _text;
            },
            set : function(text) {
                _text = text;
            },
            enumerable : true,
            configurable : true
        });

        this._textColor = GUI.Button.TEXT_COLORS.UNSELECTED;
    }
};

// Make GUI.Button inherit from GUI.Component
GUI.Button.prototype = Object.create(GUI.Component.prototype, {
    constructor : {
        configurable : true,
        enumerable : true,
        value : GUI.Button,
        writable : true
    }
});

/*
    @param callback function to assign to this._callback
*/
GUI.Button.prototype.setCallback = function(callback) {
    this._callback = callback;
};

GUI.Button.prototype.isSelectable = function() {
    return true;
};

/*
    See draw() of supertype GUI.Component for general
    description
    @post the button's graphical part has been drawn on
    the graphical canvas, and its textual part has been
    drawn on the textual canvas; note that the button's
    position is its top-left coordinate
*/
GUI.Button.prototype.draw = function(graphicalCanvas, textualCanvas) {
    this._drawGraphicalPart(graphicalCanvas);
    this._drawTextualPart(textualCanvas);
};

/*
    @pre this button's graphical part either hasn't been
    drawn or has been erased
    @post the button's graphical part has been drawn
    on the given canvas
*/
GUI.Button.prototype._drawGraphicalPart = function(graphicalCanvas) {
    var context = graphicalCanvas.getContext('2d');
    context.fillStyle = "black";
    context.fillRect(this._positionX, this._positionY,
        GUI.Button.DIMENSIONS.x, GUI.Button.DIMENSIONS.y);
};

/*
    @pre this button's textual part either hasn't been
    drawn or has been erased
    @post the button's textual part has been drawn
    on the given canvas
*/
GUI.Button.prototype._drawTextualPart = function(textualCanvas) {
    var context = textualCanvas.getContext('2d');
    context.fillStyle = this._textColor;
    context.font = GUI.Button.FONT_SIZE + "px " + this.fontFace;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.text,
        this._positionX + (GUI.Button.DIMENSIONS.x / 2),
        this._positionY + (GUI.Button.DIMENSIONS.y / 2));
};

/*
    @pre the button's textual part is on the given canvas
    and fits in the area of the graphical button
    @post the button's textual part has been erased
*/
GUI.Button.prototype._eraseTextualPart = function(textualCanvas) {
    var context = textualCanvas.getContext('2d');
    context.clearRect(this._positionX, this._positionY,
        GUI.Button.DIMENSIONS.x, GUI.Button.DIMENSIONS.y);
};

/*
    @post this button's textual part has been erased
    and redrawn on the given canvas
*/
GUI.Button.prototype.redrawTextualPart = function(textualCanvas) {
    this._eraseTextualPart(textualCanvas);
    this._drawTextualPart(textualCanvas);
}

/*
    @post the button has been updated to reflect its having been
    selected; its text color has been changed
    @hasTest yes
    @param graphicalCanvas canvas on which to redraw the graphical
    part of the button (if desired); give value of undefined to
    not redraw
    @param textualCanvas canvas on which to redraw the textual
    parts of the button (if desired); give value of undefined to
    not redraw
*/
GUI.Button.prototype.select = function(graphicalCanvas, textualCanvas) {
    GUI.Component.prototype.select.call(this);

    // Update the button's appearance
    this._textColor = GUI.Button.TEXT_COLORS.SELECTED;
    if (textualCanvas !== undefined)
        this.redrawTextualPart(textualCanvas);
};

/*
    @post the button has been updated to reflect its having been
    deselected; its text color has been changed
    @hasTest yes
    @param graphicalCanvas canvas on which to redraw the graphical
    part of the button (if desired); give value of undefined to
    not redraw
    @param textualCanvas canvas on which to redraw the textual
    parts of the button (if desired); give value of undefined to
    not redraw
*/
GUI.Button.prototype.deselect = function(graphicalCanvas, textualCanvas) {
    GUI.Component.prototype.deselect.call(this);

    // Update the button's appearance
    this._textColor = GUI.Button.TEXT_COLORS.UNSELECTED;
    if (textualCanvas !== undefined)
        this.redrawTextualPart(textualCanvas);
};

/*
    @post the button has been updated appropriately, and its
    callback, if defined, has been called
    @hasTest yes
*/
GUI.Button.prototype.activate = function() {
    GUI.Component.prototype.activate.call(this);

    if (this._callback !== undefined)
        this._callback();
};

GUI.Button.TEXT_COLORS = {
    UNSELECTED : "white",
    SELECTED : "red",
}

GUI.Button.DIMENSIONS = {
    x : 130,
    y : 70,
}

GUI.Button.FONT_SIZE = 16;