"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    Represents what to do when a certain key is acted on (e.g. pressed
    down)
    @param hasOneLife true to erase this._action after it has been
    used once; false, otherwise
*/
function KeyAction(hasOneLife) {
    this._action = undefined;
    this._hasOneLife = hasOneLife;
}

/*
    @post this._action has been executed (and erased if
    this._hasOneLife === true)
    The function achieves its postcondition in a way so that
    the erasing doesn't erase this._action before it's called and
    doesn't erase any new action that might've been set by
    the calling of this._action.
*/
KeyAction.prototype.perform = function() {
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
KeyAction.prototype.set = function(action) {
    this._action = action;
};

KeyAction.prototype.erase = function() {
    this._action = undefined;
};