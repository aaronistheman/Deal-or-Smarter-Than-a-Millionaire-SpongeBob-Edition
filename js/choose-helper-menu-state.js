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
    @param arrayOfHelpers array of instances of Helper to use to
    set up the menu
*/
function ChooseHelperMenuState(graphicalCanvasId, textualCanvasId,
    arrayOfHelpers) {

    this.GUIContainer = new GUI.Container();

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

    this._setUpMenu(arrayOfHelpers);

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
        @param arrayOfHelpers array of instances of Helper to use to
        set up the menu
    */
    _setUpMenu : function(arrayOfHelpers) {
        // For positioning the menu panels
        var positionX = 50;
        var positionY = 20;
        var deltaX = GUI.HelperPanelContainer.iconWidth +
            (CANVAS_WIDTH - 100 - (GUI.HelperPanelContainer.iconWidth *
            gameShow.NUMBER_OF_HELPERS)) / (gameShow.NUMBER_OF_HELPERS - 1);

        // Create a HelperPanelContainer for each helper and store it
        var helperPanelContainer = null;
        for (var i in arrayOfHelpers) {
            // Create the instance, position it, and store it
            helperPanelContainer = new GUI.HelperPanelContainer(
                arrayOfHelpers[i]);
            helperPanelContainer.setPosition(positionX, positionY);
            this.GUIContainer.pack(helperPanelContainer);

            // Update the positional coordinates
            positionX += deltaX;
        }
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

    /*
        @post this instance's stored canvases have been completely
        erased
    */
    erase : function() {
        this.graphicalCanvas.getContext('2d')
            .clearRect(0, 0, this.graphicalCanvas.width,
                this.graphicalCanvas.height);
        this.textualCanvas.getContext('2d')
            .clearRect(0, 0, this.textualCanvas.width,
                this.textualCanvas.height);
    },

    /*
        @pre this.GUIContainer has at least two selectable components
        (otherwise, an infinite loop will occur)
        @post this instance's selected helperPanelContainer instance
        has been removed, the one after it has been selected, and
        the deleted one has been erased
    */
    removeSelectedHelper : function() {
        this.erase();

        // Remove the currently selected helperPanelContainer instance
        this.GUIContainer.removeSelectedComponent(true);

        // Redraw the remaining helperPanelContainer instances
        this.draw();
    },
}