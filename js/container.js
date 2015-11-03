"use strict";

/*
    Authors of original (C++, SFML-supporting) version:
        Artur Moreira, Henrik Vogelius Hansson, and Jan Haller
    Translated (from C++, SFML-supporting version to
        JavaScript, Canvas-supporting version) by: Aaron Kaloti
    Release number: 0.1
*/

/*
    Inherits from GUI.Component

    @hasTest yes
*/
GUI.Container = function() {
    if (!(this instanceof GUI.Container))
        return new GUI.Container();
    else {
        GUI.Component.call(this);

        this._children = [];
        this._selectedChild = -1; // index of the selected child
    }
};

// Make GUI.Container inherit from GUI.Component
GUI.Container.prototype = Object.create(GUI.Component.prototype, {
    constructor : {
        configurable : true,
        enumerable : true,
        value : GUI.Container,
        writable : true
    }
});

GUI.Container.prototype.getSelectedChild = function() {
    return this._selectedChild;
};

/*
    @post the given component has been added to this container;
    if none of the elements in the container are selected and
    the given component can be selected, it will be
    @hasTest yes
    @param component to add to the container; is an instance of
    Component or of a subtype of Component
*/
GUI.Container.prototype.pack = function(component) {
    this._children.push(component);

    if (!this.hasSelection() && component.isSelectable())
        this.selectChild(this._children.length - 1, undefined, undefined);
};

/*
    @Override
*/
GUI.Container.prototype.isSelectable = function() {
    return false;
};

/*
    @Override
    See draw() of supertype GUI.Component for general
    description

    @post each stored component has been drawn on the indicated
    canvases
*/
GUI.Container.prototype.draw = function(graphicalCanvas, textualCanvas) {
    for (var i in this._children)
        this._children[i].draw(graphicalCanvas, textualCanvas);
};

GUI.Container.prototype.hasSelection = function() {
    return this._selectedChild >= 0;
};

/*
    @post the currently selected component (if any) has been
    deselected, and the stored component indicated by the given index
    has been selected; does nothing if the indicated component isn't
    selectable
    @hasTest yes
    @param index of the component in this._children to select
    @param graphicalCanvas canvas on which to redraw the graphical
    part of the selected component
    @param textualCanvas canvas on which to redraw the textual
    part of the selected component
*/
GUI.Container.prototype.selectChild =
    function(index, graphicalCanvas, textualCanvas) {
    if (this._children[index].isSelectable()) {
        if (this.hasSelection())
            this._children[this._selectedChild].deselect(
                graphicalCanvas, textualCanvas);

        this._children[index].select(graphicalCanvas, textualCanvas);
        this._selectedChild = index;
    }
};

/*
    @post the next selectable component has been selected,
    or nothing happened if this container doesn't have a selected
    component
    @param graphicalCanvas canvas on which to redraw the graphical
    part of the selected component
    @param textualCanvas canvas on which to redraw the textual
    part of the selected component
*/
GUI.Container.prototype.selectNext =
    function(graphicalCanvas, textualCanvas) {
    if (!this.hasSelection())
        return;

    // Search for next selectable component; wrap around if necessary
    var next = this._selectedChild;
    do
        next = (next + 1) % this._children.length;
    while (!this._children[next].isSelectable());

    // Select that component
    this.selectChild(next, graphicalCanvas, textualCanvas);
};

/*
    @post the most previous selectable component has been selected,
    or nothing happened if this container doesn't have a selected
    component
    @param graphicalCanvas canvas on which to redraw the graphical
    part of the selected component
    @param textualCanvas canvas on which to redraw the textual
    part of the selected component
*/
GUI.Container.prototype.selectPrevious =
    function(graphicalCanvas, textualCanvas) {
    if (!this.hasSelection())
        return;

    // Search for previous selectable component; wrap around if necessary
    var prev = this._selectedChild;
    do
        prev = (prev + this._children.length - 1) % this._children.length;
    while (!this._children[prev].isSelectable());

    // Select that component
    this.selectChild(prev, graphicalCanvas, textualCanvas);
};

/*
    @post if possible, this container's currently selected component
    has been activated
*/
GUI.Container.prototype.activateSelectedComponent = function() {
    if (this.hasSelection())
        this._children[this._selectedChild].activate();
};