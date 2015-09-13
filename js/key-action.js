"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

var keyboard = {};
keyboard.ENTER = 13;
keyboard.enterKeyAction = {
    // what to do when the Enter key
    // is pressed; should be a function
    action : undefined,

    // for cleaner syntax (than keyboard.enterKeyAction.action = action;)
    // @param action the function to assign to this.action (i.e. what
    // to do when the Enter key is pressed)
    set : function(action) {
        this.action = action;
    },

    // @post this.action = undefined
    erase : function() {
        this.action = undefined;
    },

    // @post event handler has been set up so that this.action, if
    // it's defined, will be called when user presses Enter
    // (this.action will be erased before the action function is
    // called)
    setUpEventHandler : function() {
        $(document).keydown(function(e) {
            if (e.which === keyboard.ENTER) {
                // Note that in the handler, the object 'this'
                // refers to the document
                if (keyboard.enterKeyAction.action !== undefined) {
                    // Erase action before calling it, but do so
                    // in a way so that the action to do isn't
                    // inadvertently erased first
                    var act = keyboard.enterKeyAction.action;
                    keyboard.enterKeyAction.erase();
                    act();
                }
            }
        });
    }
};