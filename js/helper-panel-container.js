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