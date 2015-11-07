"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// Note that the values of these constants matter
var LIFELINES = {
    SAVE : "Save",
    PEEK : "Peek",
    ASK_AUDIENCE : "Ask the Audience",
    PHONE_FRIEND : "Phone a Friend",
};

/*
    @pre graphicalCanvasId and textualCanvasId are the ids of canvases
    that exist (i.e. the webpage has those canvas elements)
    @param graphicalCanvasId id of the canvas on which the graphical
    (i.e. non-textual) parts of the GUI components will be drawn
    @param textualCanvasId id of the canvas on which the textual
    (i.e. non-graphical) parts of the GUI components will be drawn
*/
function Lifelines(graphicalCanvasId, textualCanvasId) {
    // Make map of LIFELINES constants to the availability of the
    // represented lifeline (as a boolean)
    this._availability = {};
    for (var i in LIFELINES)
        this._availability[LIFELINES[i]] = true;

    // Container for the instances that graphically represent
    // the selectable lifelines
    this.container = new GUI.Container();
    this._setUpContainer();

    // when a lifeline button is activated, this member should be
    // set to the constant in LIFELINES that represents that button
    this.mostRecentlyActivatedButton = undefined;

    // Declare truly private member "_graphicalCanvas"
    var _graphicalCanvas = undefined;
    Object.defineProperty(this, "graphicalCanvas", {
        get : function() {
            return _graphicalCanvas;
        },
        set : function(canvas) {
            _graphicalCanvas = canvas;
        },
        enumerable : true,
        configurable : true
    });

    // Declare truly private member "_textualCanvas"
    var _textualCanvas = undefined;
    Object.defineProperty(this, "textualCanvas", {
        get : function() {
            return _textualCanvas;
        },
        set : function(canvas) {
            _textualCanvas = canvas;
        },
        enumerable : true,
        configurable : true
    });

    /*
        Call this function after the canvases indicated by the given
        ids have been created
        @post the canvases indicated by the constructor's parameters
        have been stored
    */
    this.loadCanvases = function() {
        _graphicalCanvas = document.getElementById(graphicalCanvasId);
        _textualCanvas = document.getElementById(textualCanvasId);
    };
}

Lifelines.prototype = {
    constructor : Lifelines,

    /*
        @pre this instance hasn't been set up with the proper GUI
        components
        @post this instance has been set up with those properly
        positioned components; the buttons of those components
        have correct callbacks
        @hasTest yes
    */
    _setUpContainer : function() {
        // To help with positioning the components
        var positionX = 20;
        var positionY = 40;
        var deltaY = 50;
        var buttonWidth = (300 - (positionX * 2));
        var buttonHeight = 30;
        var labelIndentation = buttonWidth / 2;

        // To help with designing the components
        var buttonFontSize = 25;
        var buttonFontFace = "Comic Sans MS";

        var that = this;

        // Add CenteredLabel instance that says "Lifelines"
        var centeredLabel =
            new GUI.CenteredLabel("Lifelines", "Comic Sans MS");
        centeredLabel.setPosition(positionX + labelIndentation, positionY);
        this.container.pack(centeredLabel);
        positionY += deltaY;

        // Add Button instance for Peek option
        var peekButton = new GUI.LifelineButton(buttonFontFace,
            buttonFontSize, buttonWidth, buttonHeight);
        peekButton.text = LIFELINES.PEEK;
        peekButton.setPosition(positionX, positionY);
        peekButton.setCallback(function() {
            that.mostRecentlyActivatedButton = peekButton.text;
        });
        this.container.pack(peekButton);
        positionY += deltaY;

        // Add Button instance for Ask the Audience option
        var askButton = new GUI.LifelineButton(buttonFontFace,
            buttonFontSize, buttonWidth, buttonHeight);
        askButton.text = LIFELINES.ASK_AUDIENCE;
        askButton.setPosition(positionX, positionY);
        askButton.setCallback(function() {
            that.mostRecentlyActivatedButton = askButton.text;
        });
        this.container.pack(askButton);
        positionY += deltaY;

        // Add Button instance for Phone a Friend option
        var phoneButton = new GUI.LifelineButton(buttonFontFace,
            buttonFontSize, buttonWidth, buttonHeight);
        phoneButton.text = LIFELINES.PHONE_FRIEND;
        phoneButton.setPosition(positionX, positionY);
        phoneButton.setCallback(function() {
            that.mostRecentlyActivatedButton = phoneButton.text;
        });
        this.container.pack(phoneButton);
    },

    /*
        @pre this.graphicalCanvas !== undefined;
        this.textualCanvas !== undefined
        @post each component in this.GUIContainer has been
        drawn on this instance's canvases
    */
    draw : function() {
        this.container.draw(this.graphicalCanvas, this.textualCanvas);
    },
};