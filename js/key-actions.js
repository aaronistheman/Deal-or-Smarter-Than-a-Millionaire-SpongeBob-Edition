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
KEY_CODES.RIGHT_ARROW = 39;

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

    /*
        @post the action (if any) formerly attached to the key
        represented by keyCode has been replaced by the parameter
        action
        @param keyCode of the key to attach the action to
        @param action function to attach to the key
    */
    this.set = function(keyCode, action) {
        this._actions[keyCode].set(action);
    };

    /*
        @post the action attached to the key represented by keyCode
        has been erased
        @param keyCode of the key to attach the action to
    */
    this.erase = function(keyCode) {
        this._actions[keyCode].erase();
    };

    /*
        @pre event handlers haven't been set up; this function
        hasn't been called yet
        @post event handlers have been set up so that a
        key's action will be called when that key is pressed down
    */
    this.setUpEventHandler = function() {
        // this is needed because the event handler will change
        // what 'this' refers to in its scope
        var thisInstance = this;

        $(document).keydown(function(e) {
            var action = thisInstance._actions[e.which];
            if (action !== undefined)
                action.perform();
        });
    };
}

/*
    Represents what to do when a certain key is acted on (e.g. pressed
    down)
    @param hasOneLife true to erase this._action after it has been
    used once; false, otherwise
*/
function KeyAction(hasOneLife) {
    this._action = undefined;

    this._hasOneLife = hasOneLife;

    /*
        @post this._action has been executed (and erased if
        this._hasOneLife === true)
        The function achieves its postcondition in a way so that
        the erasing doesn't erase this._action before it's called and
        doesn't erase any new action that might've been set by
        the calling of this._action.
    */
    this.perform = function() {
        var action = this._action;

        // Only proceed if the action is defined
        if (action !== undefined) {
            // Erase the action, if necessary
            if (this._hasOneLife === true)
                this.erase();

            action();
        }
    };

    // @param action the function to assign to this._action
    this.set = function(action) {
        this._action = action;
    };

    this.erase = function() {
        this._action = undefined;
    };
}