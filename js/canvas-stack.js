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
    and store; must be a value in CANVAS_IDS
    @returns "this" pointer
    @throws nothing
*/
CanvasStack.prototype.set = function(whatToSet) {
    // Hide each canvas indicated by the currently stored ids,
    // then clear the storage
    this.removeAll();

    // For each canvas indicated by the id or ids in whatToSet,
    // show the canvas and store the id
    this.add(whatToSet);

    return this;
}

/*
    @pre the ids indicated by whatToAdd are not already stored
    @post whatToAdd has been added to this._storage, and the
    canvas represented by whatToAdd has been given CSS class
    'show'
    @hasTest yes
    @param whatToAdd to affect as the postcondition specifies;
    must be a value in CANVAS_IDS
    @returns "this" pointer
    @throws nothing
*/
CanvasStack.prototype.add = function(whatToAdd) {
    if (typeof whatToAdd == "string") {
        // only one canvas to add and show
        this._storage.push(whatToAdd);
        $('#' + whatToAdd).addClass('show');
    }
    else {
        // array of canvases to add
        this._storage = this._storage.concat(whatToAdd);
        for (var i in whatToAdd)
            $('#' + whatToAdd[i]).addClass('show');
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

    // Find each canvas that should be hidden, hide it, and remove
    // its id from the storage
    for (var i in canvasIdsToRemove) {
        for (var j = 0; j < this._storage.length; ) {
            if (this._storage[j] === canvasIdsToRemove[i]) {
                $('#' + this._storage[j]).removeClass('show');
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
CanvasStack.prototype.removeAll = function() {
    // this._storage should never contain any objects, so
    // using slice() here should be fine
    return this.remove(this._storage.slice());
}

/*
    'Static' members and instances
*/

/*
// @hasTest yes
// @returns true if whatToCheck equals one of the constants
// in CANVAS_IDS
CanvasStack.isCanvasOrCanvases = function(whatToCheck) {
    for (var key in CANVAS_IDS) {
        if (whatToCheck === CANVAS_IDS[key])
            return true;
    }
    return false;
};
*/

/*
    Non-static constants
*/

// Includes ids of canvases;
// note that the order of these ids matter in that they affect
// the order in which the AngularJS code generates the canvases
// (e.g. the quote text must be above the quote bubble)
var CANVAS_IDS = {
    BRIEFCASES : "briefcase-display-canvas",
    BRIEFCASES_TEXT : "briefcase-text-canvas",
    QUESTIONING : "questioning-canvas",
    CHOOSE_QUESTION : "choose-question-canvas",
    MONEY_DISPLAY_BARS : "money-display-bars-canvas",
    MONEY_DISPLAY_TEXT : "money-display-text-canvas",
    SPEAKER : "speaker-canvas",
    QUOTE_BUBBLE : "quote-bubble-canvas",
    QUOTE_TEXT : "quote-text-canvas",
    TITLE_SCREEN : "title-screen-canvas",
};

// Groups of canvas ids; for use in functions that support them
CANVAS_IDS.QUOTE = [CANVAS_IDS.QUOTE_TEXT, CANVAS_IDS.QUOTE_BUBBLE];
CANVAS_IDS.SPEAKER_QUOTE =
    CANVAS_IDS.QUOTE.concat([CANVAS_IDS.SPEAKER]);
CANVAS_IDS.MONEY_DISPLAY =
    [CANVAS_IDS.MONEY_DISPLAY_TEXT, CANVAS_IDS.MONEY_DISPLAY_BARS];
CANVAS_IDS.BRIEFCASE_DISPLAY =
    [CANVAS_IDS.BRIEFCASES, CANVAS_IDS.BRIEFCASES_TEXT];