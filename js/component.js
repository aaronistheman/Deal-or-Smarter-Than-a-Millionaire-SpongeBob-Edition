"use strict";

/*
    Authors of original (C++, SFML-supporting) version:
        Artur Moreira, Henrik Vogelius Hansson, and Jan Haller
    Translated (from C++, SFML-supporting version to
        JavaScript, Canvas-supporting version) by: Aaron Kaloti
    For experimentation
*/

/*
    This class is meant to be abstract.
    @hasTest yes
*/
GUI.Component = function() {
    if (this.constructor === GUI.Component)
        alertAndThrowException(
            "GUI.Component constructor is abstract");
    else {
        this._isSelected = false;
        this._isActive = false;

        this._positionX = 0;
        this._positionY = 0;
    }
};

GUI.Component.prototype = {
    constructor : GUI.Component,

    /*
        Note that this is an abstract method.
        @hasTest yes
        @returns true if this instance is selectable; false, otherwise
    */
    isSelectable : function() {
        alertAndThrowException(
            "GUI.Component.prototype.isSelectable() is abstract");
    },

    isSelected : function() {
        return this._isSelected;
    },

    select : function() {
        this._isSelected = true;
    },

    deselect : function() {
        this._isSelected = false;
    },

    isActive : function() {
        return this._isActive;
    },

    activate : function() {
        this._isActive = true;
    },

    deactivate : function() {
        this._isActive = false;
    },

    setPosition : function(x, y) {
        this._positionX = x;
        this._positionY = y;
    },

    /*
        Note that this is an abstract method.
        @param graphicalCanvas the canvas on which the graphical
        (i.e. non-textual) parts of the component will be drawn
        @param textualCanvas the canvas on which the textual
        (i.e. non-graphical) parts of the component will be drawn
    */
    draw : function(graphicalCanvas, textualCanvas) {
        alertAndThrowException(
            "GUI.Component.prototype.draw() is abstract");
    },
};