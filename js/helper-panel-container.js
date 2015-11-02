"use strict";

/*
    Original Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    Inherits from GUI.Container

    The format of this container's children is supposed to be
    (Note that the helper referred to is the one given as parameter):
    -GUI.Button instance to display the helper's name and to be the
    activatable part
    -GUI.Icon instance to display the helper's icon
    -GUI.Label to indicate that the list of the helper's strengths
    is being displayed
    -as many instances of GUI.Label as is needed to display each
    of the helper's strenghts

    @post has created an instance that uses many subtypes of Component
    to store the data regarding the given helper instance
    @hasTest yes
    @param helper instance of Helper whose data will be used for
    this container
*/
GUI.HelperPanelContainer = function(helper) {
    if (!(this instanceof GUI.HelperPanelContainer))
        return new GUI.HelperPanelContainer(helper);
    else {
        GUI.Container.call(this);

        /*
            Store the data from the helper instance in this container
            in the form of other components. Note that it's crucial
            to some of this custom type's methods that the name-displaying
            button be the first child.
        */

        // Store a button instance for the name of the helper
        var nameButton = new GUI.Button("Arial");
        // nameButton.setPosition(
        nameButton.text = helper.name;
        nameButton.setCallback(function() {});
        this._children.push(nameButton);

        // Store an icon for the helper's icon
        var iconImage = new Image();
        iconImage.src = helper.iconSource;
        var icon = new GUI.Icon(iconImage);
        // icon.setPosition(
        icon.width = 150;
        icon.height = 150;
        this._children.push(icon);

        // Store a label to indicate that the helper's strenghts
        // are listed
        var label = new GUI.Label("Strengths: ", "Arial");
        // label.setPosition(
        this._children.push(label);

        // Store a label for each of the helper's strenghts
        var strengths = helper.getStrengths();
        for (var i in strengths) {
            label = new GUI.Label(strengths[i], "Arial");
            this._children.push(label);
        }
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
    GUI.Container.prototype.select.call(this);

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
    GUI.Container.prototype.deselect.call(this);

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

/*
    @Override

    @post each stored component has been drawn on the indicated
    canvases and temporarily positioned relative to this container
*/
GUI.HelperPanelContainer.prototype.draw =
    function(graphicalCanvas, textualCanvas) {
    for (var i in this._children) {
        // Store the child's position to restore it
        var formerPosition = this._children[i].getPosition();

        // Set the child's position in relation to this container
        this._children[i].setPosition(this._positionX + formerPosition.x,
            this._positionY + formerPosition.y);

        // Draw the child
        this._children[i].draw(graphicalCanvas, textualCanvas);

        // Restore the child's former position
        this._children[i].setPosition(formerPosition.x, formerPosition.y);
    }
};

// Index of the button that's supposed to display the helper's name
GUI.HelperPanelContainer.buttonWithNameIndex = 0;

GUI.HelperPanelContainer.iconIndex = 1;

// Index of the label that indicates the list of strenghts
GUI.HelperPanelContainer.strengthsTitleLabelIndex = 2;