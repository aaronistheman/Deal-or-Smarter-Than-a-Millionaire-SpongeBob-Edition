"use strict";

/*
    Original Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    Inherits from GUI.Container

    @hasTest yes
    @param helper instance of Helper whose data will be used for
    this container
*/
GUI.HelperPanelContainer = function() {
    if (!(this instanceof GUI.HelperPanelContainer))
        return new GUI.HelperPanelContainer();
    else {
        GUI.Container.call(this);


    }
};

// Make GUI.HelperPanelContainer inherit from GUI.Container
GUI.HelperPanelContainer.prototype =
    Object.create(GUI.Container.prototype, {
        constructor : {
            configurable : true,
            enumerable : true,
            value : GUI.HelperPanelContainer,
            writable : true
    }
});

/*
    @Override
    This overriden method won't ever try to select an added component.
*/
GUI.HelperPanelContainer.prototype.pack = function(component) {
    this._children.push(component);
};

/*
    @Override
*/
GUI.HelperPanelContainer.prototype.isSelectable = function() {
    return true;
}

/*
    @Override

    @post this container and its name-displaying button have both
    been selected
    @throws exception if the container's first child isn't an
    instance of GUI.Button
*/
GUI.HelperPanelContainer.prototype.select = function() {
    // Select this container
    GUI.Container.select.call(this);

    // Select the appropriate button, which must be the first child,
    // or else an exception is thrown
    if (!(this._children[GUI.HelperPanelContainer.buttonWithNameIndex]
        instanceof GUI.Button))
        alertAndThrowException("GUI.HelperPanelContainer.prototype.select() " +
            "called for instance that has a non-Button first child");
    else
        this._children[GUI.HelperPanelContainer.buttonWithNameIndex].select();
};

/*
    @Override

    @post this container and its name-displaying button have both
    been deselected
    @throws exception if the container's first child isn't an
    instance of GUI.Button
*/
GUI.HelperPanelContainer.prototype.deselect = function() {
    // Deselect this container
    GUI.Container.deselect.call(this);

    // Deselect the appropriate button, which must be the first child,
    // or else an exception is thrown
    if (!(this._children[GUI.HelperPanelContainer.buttonWithNameIndex]
        instanceof GUI.Button))
        alertAndThrowException("GUI.HelperPanelContainer.prototype." +
            "deselect() " +
            "called for instance that has a non-Button first child");
    else
        this._children[
            GUI.HelperPanelContainer.buttonWithNameIndex].deselect();
};

/*
    @Override

    @post this container's name-displaying button has been activated
    @throws exception if the container's first child isn't an
    instance of GUI.Button
*/
GUI.HelperPanelContainer.prototype.activate = function() {
    GUI.Component.prototype.activate.call(this);

    // Activate the container's name-displaying button. It must
    // be the first child, or else an exception is thrown
    if (!(this._children[GUI.HelperPanelContainer.buttonWithNameIndex]
        instanceof GUI.Button))
        alertAndThrowException("GUI.HelperPanelContainer.prototype." +
            "activate() " +
            "called for instance that has a non-Button first child");
    else
        this._children[
            GUI.HelperPanelContainer.buttonWithNameIndex].activate();
};

/*
    @Override
    This subtype isn't meant to be able to have a selection in it;
    it's meant to be used to display the data regarding a helper.
*/
GUI.HelperPanelContainer.prototype.hasSelection = function() {
    return false;
};

/*
    @Override
    Don't allow selection of another component in this container.
*/
GUI.HelperPanelContainer.prototype.selectChild = function() {
    return;
};

/*
    @Override
    Don't allow selection of another component in this container.
*/
GUI.HelperPanelContainer.prototype.selectNext = function() {
    return;
};

/*
    @Override
    Don't allow selection of another component in this container.
*/
GUI.HelperPanelContainer.prototype.selectPrevious = function() {
    return;
};

// Index of the button that's supposed to display the helper's name
GUI.HelperPanelContainer.buttonWithNameIndex = 0;

GUI.HelperPanelContainer.iconIndex = 1;

// Index of the label that indicates the list of strenghts
GUI.HelperPanelContainer.strengthsTitleLabelIndex = 2;