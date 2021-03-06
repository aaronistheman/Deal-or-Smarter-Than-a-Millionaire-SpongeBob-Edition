"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

function CanvasStack() {
    // stores the ids of the canvases that are shown
    this._storage = [];
}

/*
    @pre none
    @post the only canvas or canvases shown and stored in
    this._storage are those that were indicated by whatToSet
    @hasTest yes
    @param whatToSet id or ids of the canvas or canvases to show
    and store; must be a value in CANVAS_IDS (or a concatenation
    of them)
    @param effect (optional) with which to have the canvas(es) show
    up; should be value in CanvasStack.EFFECTS
    @returns "this" pointer
    @throws nothing
*/
CanvasStack.prototype.set = function(whatToSet, effect) {
    // Hide each canvas indicated by the currently stored ids,
    // then clear the storage
    this.clear();

    // For each canvas indicated by the id or ids in whatToSet,
    // show the canvas and store the id
    this.add(whatToSet, effect);

    return this;
}

/*
    @pre the ids indicated by whatToAdd are not already stored
    @post whatToAdd has been added to this._storage, and the
    canvas represented by whatToAdd has been given CSS class
    'show' and the CSS class indicated by parameter effect
    @hasTest yes
    @param whatToAdd to affect as the postcondition specifies;
    must be a value in CANVAS_IDS
    @param effect (optional) with which to have the canvas(es) show
    up; should be value in CanvasStack.EFFECTS
    @returns "this" pointer
    @throws nothing
*/
CanvasStack.prototype.add = function(whatToAdd, effect) {
    // Determine which CSS class(es) to add
    if (effect !== undefined)
        var classToAdd = "show " + effect;
    else
        var classToAdd = "show";

    if (typeof whatToAdd == "string") {
        // only one canvas to add and show
        this._storage.push(whatToAdd);
        $('#' + whatToAdd).addClass(classToAdd);
    }
    else {
        // array of canvases to add
        this._storage = this._storage.concat(whatToAdd);
        for (var i in whatToAdd)
            $('#' + whatToAdd[i]).addClass(classToAdd);
    }
    return this;
};

/*
    @pre none
    @post the canvas or canvases commanded to be removed have
    been removed and (via CSS) hidden
    @hasTest yes
    @param whatToRemove which canvas or canvases to remove;
    pass an array of canvases to remove all of those;
    must be one of the constants attached to
    CANVAS_IDS
    @returns "this" pointer
    @throws nothing
*/
CanvasStack.prototype.remove = function(whatToRemove) {
    // React according to how many canvas ids to remove
    var canvasIdsToRemove = [];
    if (typeof whatToRemove == "string")
        canvasIdsToRemove.push(whatToRemove);
    else
        canvasIdsToRemove = whatToRemove;

    // Ensure all CanvasStack-related CSS classes are removed
    var classesToRemove = "show";
    for (var i in CanvasStack.EFFECTS)
        classesToRemove += (' ' + CanvasStack.EFFECTS[i]);

    // Find each canvas that should be hidden, hide it, and remove
    // its id from the storage
    for (var i in canvasIdsToRemove) {
        for (var j = 0; j < this._storage.length; ) {
            if (this._storage[j] === canvasIdsToRemove[i]) {
                $('#' + this._storage[j]).removeClass(classesToRemove);
                this._storage.splice(j, 1);
                break;
            }
            else
                ++j;
        }
    }

    return this;
};

/*
    @pre this._storage doesn't contain any objects, although it
    should only ever contain strings, anyway
    @post all canvases indicated by the stored ids have been
    hidden; the storage has been emptied
    @hasTest yes
    @returns "this" pointer"
    @throws nothing
*/
CanvasStack.prototype.clear = function() {
    // this._storage should never contain any objects, so
    // using slice() here should be fine
    return this.remove(this._storage.slice());
}

CanvasStack.EFFECTS = {
    FADE_IN : "fade-in",
};