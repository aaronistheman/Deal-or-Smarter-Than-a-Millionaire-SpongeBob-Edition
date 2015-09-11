"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

function CanvasStack() {
    this.storage = [];
}

/*
    @pre none
    @post whatToAdd has been added to this.storage, and the
    canvas represented by whatToAdd has been given CSS class
    'show'
    @hasTest yes
    @param whatToAdd to affect as the postcondition specifies;
    must be a value in CanvasStack.CANVASES_IDS
    @returns "this" pointer
    @throws nothing
*/
CanvasStack.prototype.add = function(whatToAdd) {
    if (typeof whatToAdd == "string") {
        // only one canvas to add and show
        this.storage.push(whatToAdd);
        $('#' + whatToAdd).addClass('show');
    }
    else {
        // array of canvases to add
        this.storage = this.storage.concat(whatToAdd);
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
    CanvasStack.CANVASES_IDS
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

    for (var i in canvasIdsToRemove) {
        for (var j = 0; j < this.storage.length; ) {
            if (this.storage[j] === canvasIdsToRemove[i]) {
                $('#' + this.storage[j]).removeClass('show');
                this.storage.splice(j, 1);
                break;
            }
            else
                ++j;
        }
    }

    return this;
};

/*
    'Static' members and instances
*/

// Includes ids of canvases and groups of those ids
CanvasStack.CANVASES_IDS = {
    TITLE_SCREEN : "title-screen-canvas",
    QUOTE_TEXT : "quote-text-canvas",
    QUOTE_BUBBLE : "quote-bubble-canvas",
    SPEAKER : "speaker-canvas",
    MONEY_DISPLAY_TEXT : "money-display-text-canvas",
    MONEY_DISPLAY_BAR : "money-display-bars-canvas",
    CHOOSE_QUESTION : "choose-question-canvas",
    QUESTIONING : "questioning-canvas",
};
CanvasStack.CANVASES_IDS.QUOTE = [CanvasStack.CANVASES_IDS.QUOTE_TEXT,
    CanvasStack.CANVASES_IDS.QUOTE_BUBBLE];
CanvasStack.CANVASES_IDS.MONEY_DISPLAY =
    [CanvasStack.CANVASES_IDS.MONEY_DISPLAY_TEXT,
    CanvasStack.CANVASES_IDS.MONEY_DISPLAY_BAR];

// @returns true if whatToCheck equals one of the constants
// in CanvasStack.CANVASES_IDS
CanvasStack.isCanvasOrCanvases = function(whatToCheck) {
    for (var key in CanvasStack.CANVASES_IDS) {
        if (whatToCheck === CanvasStack.CANVASES_IDS[key])
            return true;
    }
    return false;
};