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

GUI.Container.prototype.getNumberOfChildren = function() {
    return this._children.length;
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
    @pre if shouldSelectNext is true, this container has at least two
    selectable children (otherwise, an infinite loop will occur)
    @post this container's currently selected child has been removed,
    and if desired, the next selectable child has been selected
    @hasTest yes
    @param shouldSelectNext true to select the next selectable child;
    false to have no child be currently selected
    @throws exception if shouldSelectNext is neither true nor false
*/
GUI.Container.prototype.removeSelectedComponent = function(shouldSelectNext) {
    // Throw exception if invalid shouldSelectNext value
    if (shouldSelectNext === undefined)
        alertAndThrowException("Invalid first parameter given to " +
            "GUI.Container.prototype.removeSelectedComponent()");

    // Remove the currently selected child
    this._children.splice(this._selectedChild, 1);

    // Only select the next child if desired; otherwise, don't have
    // any child be selected
    if (shouldSelectNext === true) {
        // Select the next selectable child;
        // make sure this._selectedChild isn't out of bounds
        if (this._selectedChild >= this._children.length)
            this._selectedChild = 0;
        // Select the child indicated by this._selectedChild, if possible,
        // or find the next child that can be selected
        if (this._children[this._selectedChild].isSelectable()) {
            /*
                Note that this use of this.selectChild may seem redundant
                since the child indicated by this._selectedChild is already
                selected, but we need to call this function so that the
                selected component is redrawn in its state that indicates
                its being selected
            */
            this.selectChild(this._selectedChild, this.graphicalCanvas,
                this.textualCanvas);
        }
        else
            this.selectNext(this.graphicalCanvas, this.textualCanvas);
    }
    else {
        // Since the formerly selected child was removed, we don't
        // have to worry about deselecting anything
        this._selectedChild = -1;
    }
}

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