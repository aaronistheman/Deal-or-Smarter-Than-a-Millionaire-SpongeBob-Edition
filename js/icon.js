"use strict";

/*
    Original Author: Aaron Kaloti
    For experimentation
*/

/*
    Inherits from GUI.Component
    @hasTest yes
    @param image instance of Image to attach to the icon
*/
GUI.Icon = function(image) {
    if (!(this instanceof GUI.Icon))
        return new GUI.Icon(image);
    else {
        GUI.Component.call(this);

        // Define truly private property "_image"
        var _image = image;
        Object.defineProperty(this, "image", {
            get : function() {
                return _image;
            },
            set : undefined,
            enumerable : true,
            configurable : true
        });

        this.width = undefined;
        this.height = undefined;
    }
};

// Make GUI.Icon inherit from GUI.Component
GUI.Icon.prototype = Object.create(GUI.Component.prototype, {
    constructor : {
        configurable : true,
        enumerable : true,
        value : GUI.Icon,
        writable : true
    }
});

GUI.Icon.prototype.isSelectable = function() {
    return false;
}

/*
    See draw() of supertype GUI.Component for general
    description; note that the textualCanvas argument
    isn't used here
    @pre this.image.complete must be true
    @post the icon, which is solely an image, has been
    drawn on the given graphical canvas; note that the icon's
    position is its top-left coordinate
*/
GUI.Icon.prototype.draw = function(graphicalCanvas, textualCanvas) {
    var context = graphicalCanvas.getContext('2d');
    if (this.width !== undefined &&
        this.height !== undefined) {
        // If the icon's width and height were both specified,
        // use those dimensions
        context.drawImage(this.image, this._positionX,
            this._positionY, this.width, this.height);
    }
    else {
        // Icon's width and height weren't both specified, so
        // use image's dimensions
        context.drawImage(this.image, this._positionX,
            this._positionY);
    }

    /*
    var that = this;
    alert("Loaded: " + (this.image.naturalWidth.complete));
    this.image.onload = function() {
        alert("Loaded: " + (this.complete));

        if (that.width !== undefined &&
            that.height !== undefined) {
            // If the icon's width and height were both specified,
            // use those dimensions
            context.drawImage(this, that._positionX, that._positionY,
                that.width, that.height);
        }
        else {
            // Icon's width and height weren't both specified, so
            // use image's dimensions
            context.drawImage(this, that._positionX, that._positionY);
        }
    };
    */
}