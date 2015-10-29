"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1

    Note that the custom type contained in this file is modelled
    after similar C++ classes written by Artur Moreira, Henrik
    Vogelius Hansson, and Jan Haller for their book, "SFML
    Game Development".
*/

/*
    @pre graphicalCanvasId and textualCanvasId are the ids of canvases
    that exist (i.e. the webpage has those canvas elements)
    @param graphicalCanvasId id of the canvas on which the graphical
    (i.e. non-textual) parts of the menu will be drawn
    @param textualCanvasId id of the canvas on which the textual
    (i.e. non-graphical) parts of the menu will be drawn
*/
function ChooseHelperMenuState(graphicalCanvasId, textualCanvasId) {
    this.GUIContainer = new GUI.Container();

    // To store which component has been activated; should be
    // edited in activated component's callback
    this.activatedComponent = undefined;

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

    this._setUpMenu();

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

ChooseHelperMenuState.prototype = {
    constructor : ChooseHelperMenuState,

    /*
        @pre this instance hasn't been set up with the proper
        menu components
        @post this instance has been set up
    */
    _setUpMenu : function() {
        var button1 = new GUI.Button("Arial");
        button1.setPosition(200, 200);
        button1.text = "Button 1";
        button1.setCallback(function() {
            alert("Button 1 was pressed");
        });

        var button2 = new GUI.Button("Arial");
        button2.setPosition(200, 300);
        button2.text = "Button 2";
        button2.setCallback(function() {
            alert("Button 2 was pressed");
        });

        var label1 = new GUI.Label("Label 1", "Arial");
        label1.setPosition(400, 200);

        this.GUIContainer.pack(button1);
        this.GUIContainer.pack(button2);
        this.GUIContainer.pack(label1);
    },

    /*
        @pre this.graphicalCanvas !== undefined;
        this.textualCanvas !== undefined
        @post each component in this.GUIContainer has been
        drawn on this ChooseHelperMenuState instance's canvases
    */
    draw : function() {
        this.GUIContainer.draw(
            this.graphicalCanvas, this.textualCanvas);
    },
}