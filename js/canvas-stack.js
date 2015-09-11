"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

function CanvasStack() {
    this.storage = [];

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
    this.add = function(whatToAdd) {
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
        must be one of the constants
        attached to CanvasStack.CANVASES_IDS
        @returns "this" pointer
        @throws nothing
    */
    this.remove = function(whatToRemove) {
        // Remove the canvas indicated by whatToRemove
        for (var i in this.storage) {
            if (this.storage[i] === whatToRemove) {
                $('#' + this.storage[i]).removeClass('show');
                this.storage.splice[i, 1];
                break;
            }
        }
        return this;
    };
}

/*
    'Static' members and instances
*/

// Includes ids of canvases and groups of those ids
CanvasStack.CANVASES_IDS = {
    TITLE_SCREEN : "title-screen-canvas",
    QUOTE_TEXT : "quote-text-canvas",
    QUOTE_BUBBLE : "quote-bubble-canvas",
    QUOTE : [this.QUOTE_TEXT, this.QUOTE_BUBBLE],
    SPEAKER : "speaker-canvas",
    MONEY_DISPLAY_TEXT : "money-display-text-canvas",
    MONEY_DISPLAY_BAR : "money-display-bars-canvas",
    MONEY_DISPLAY : [this.MONEY_DISPLAY_TEXT,
        this.MONEY_DISPLAY_BAR],
    CHOOSE_QUESTION : "choose-question-canvas",
    QUESTIONING : "questioning-canvas",
};

// @returns true if whatToCheck equals one of the constants
// in CanvasStack.CANVASES_IDS
CanvasStack.isCanvasOrCanvases = function(whatToCheck) {
    for (var key in CanvasStack.CANVASES_IDS) {
        if (whatToCheck === CanvasStack.CANVASES_IDS[key])
            return true;
    }
    return false;
};