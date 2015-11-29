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

        var positionY = 0;

        // Store a button instance for the name of the helper
        var nameButton = new GUI.Button("Arial");
        nameButton.text = helper.name;
        nameButton.setCallback(function() {});
        this._children.push(nameButton);

        // Store an icon for the helper's icon
        var iconImage = new Image();
        iconImage.src = helper.iconSource;
        var icon = new GUI.Icon(iconImage);
        positionY += GUI.HelperPanelContainer.distanceBetweenButtonAndIcon;
        icon.setPosition(0, positionY);
        icon.width = GUI.HelperPanelContainer.iconWidth;
        icon.height = GUI.HelperPanelContainer.iconHeight;
        this._children.push(icon);

        // Store a label to indicate that the helper's strenghts
        // are listed
        var label = new GUI.Label("Strengths: ", "Calibri");
        positionY += GUI.HelperPanelContainer.distanceBetweenIconAndStrengths;
        label.setPosition(0, positionY);
        this._children.push(label);

        // Store a label for each of the helper's strenghts
        var strengths = helper.getStrengths();
        for (var i in strengths) {
            label = new GUI.Label(strengths[i], "Calibri");
            positionY += GUI.HelperPanelContainer.distanceBetweenChildren;
            label.setPosition(0, positionY);
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
    @param graphicalCanvas canvas on which to redraw the graphical
    part of the button (if desired); give value of undefined to
    not redraw
    @param textualCanvas canvas on which to redraw the textual
    parts of the button (if desired); give value of undefined to
    not redraw
    @throws exception if the container's first child isn't an
    instance of GUI.Button
*/
GUI.HelperPanelContainer.prototype.select =
    function(graphicalCanvas, textualCanvas) {
    // Select this container
    GUI.Container.prototype.select.call(this);

    // Select the appropriate button, which must be the first child,
    // or else an exception is thrown
    if (!(this._children[GUI.HelperPanelContainer.buttonWithNameIndex]
        instanceof GUI.Button))
        alertAndThrowException("GUI.HelperPanelContainer.prototype.select() " +
            "called for instance that has a non-Button first child");
    else
        this._children[GUI.HelperPanelContainer.buttonWithNameIndex].select(
            graphicalCanvas, textualCanvas);
};

/*
    @Override

    @post this container and its name-displaying button have both
    been deselected
    @param graphicalCanvas canvas on which to redraw the graphical
    part of the button (if desired); give value of undefined to
    not redraw
    @param textualCanvas canvas on which to redraw the textual
    parts of the button (if desired); give value of undefined to
    not redraw
    @throws exception if the container's first child isn't an
    instance of GUI.Button
*/
GUI.HelperPanelContainer.prototype.deselect =
    function(graphicalCanvas, textualCanvas) {
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
            GUI.HelperPanelContainer.buttonWithNameIndex].deselect(
                graphicalCanvas, textualCanvas);
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

    @post this container's position has been set, and all of its
    children have been repositioned appropriately (so that they
    are positioned relative to the container)
    @hasTest yes
*/
GUI.HelperPanelContainer.prototype.setPosition = function(x, y) {
    // Position this container
    GUI.Component.prototype.setPosition.call(this, x, y);

    // Reposition the children
    for (var i in this._children) {
        // Set the child's position in relation to this container
        var childPosition = this._children[i].getPosition();
        this._children[i].setPosition(this._positionX + childPosition.x,
            this._positionY + childPosition.y);

    }
};

// Index of the button that's supposed to display the helper's name
GUI.HelperPanelContainer.buttonWithNameIndex = 0;

GUI.HelperPanelContainer.iconIndex = 1;

// Index of the label that indicates the list of strenghts
GUI.HelperPanelContainer.strengthsTitleLabelIndex = 2;

GUI.HelperPanelContainer.distanceBetweenChildren = 30;
GUI.HelperPanelContainer.iconWidth = 150;
GUI.HelperPanelContainer.iconHeight = 150;
GUI.HelperPanelContainer.distanceBetweenButtonAndIcon =
    GUI.HelperPanelContainer.distanceBetweenChildren + 30;
GUI.HelperPanelContainer.distanceBetweenIconAndStrengths =
    GUI.HelperPanelContainer.iconHeight + 20;