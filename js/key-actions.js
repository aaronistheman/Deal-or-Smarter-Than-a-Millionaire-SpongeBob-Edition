"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// For each key code stored here, another KeyAction
// object will be stored in a KeyActions object that is being
// initialized
var KEY_CODES = {};
KEY_CODES.ENTER = 13;
KEY_CODES.LEFT_ARROW = 37;
KEY_CODES.UP_ARROW = 38;
KEY_CODES.RIGHT_ARROW = 39;
KEY_CODES.DOWN_ARROW = 40;
KEY_CODES.H = 72;
KEY_CODES.N = 78;
KEY_CODES.S = 83;
KEY_CODES.Y = 89;

/*
    Container for the responses to certain key's being acted on.
    Note that in the implementation, I specifically make the
    keys' actions be triggered by the pressing down of a key;
    however, the class (specifically, setUpEventHandler()) can
    be edited to have the triggering event be specified as a
    parameter.
    @pre the keys for which a stored action is desired should be
    represented in the object KEY_CODES
*/
function KeyActions() {
    // Container for response to each key's being acted on
    this._actions = [];

    // Add a KeyAction object for each key defined in KEY_CODES
    for (var i in KEY_CODES) {
        // Make the Enter key action be erased after its first
        // use (after its being set to a new action)
        var hasOneLife = (KEY_CODES[i] === KEY_CODES.ENTER);

        this._actions[KEY_CODES[i]] = new KeyAction(hasOneLife);
    }
}

/*
    @post the action (if any) formerly attached to the key
    represented by keyCode has been replaced by the parameter
    action
    @param keyCode of the key to attach the action to
    @param action function to attach to the key
    @returns 'this' to allow chaining
*/
KeyActions.prototype.set = function(keyCode, action) {
    this._actions[keyCode].set(action);
    return this;
};

/*
    @post the action attached to the key represented by keyCode
    has been erased
    @param keyCode of the key to attach the action to
    @returns 'this' to allow chaining
*/
KeyActions.prototype.erase = function(keyCode) {
    this._actions[keyCode].erase();
    return this;
};

/*
    @pre event handlers haven't been set up; this function
    hasn't been called yet
    @post event handlers have been set up so that a
    key's action will be called when that key is pressed down
    @returns 'this' to allow chaining
*/
KeyActions.prototype.setUpEventHandler = function() {
    // this is needed because the event handler will change
    // what 'this' refers to in its scope
    var thisInstance = this;

    $(document).keydown(function(e) {
        var action = thisInstance._actions[e.which];
        if (action !== undefined)
            action.perform();
    });

    return this;
};
