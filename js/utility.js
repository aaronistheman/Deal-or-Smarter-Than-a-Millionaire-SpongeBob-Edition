"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    This file includes code that isn't easily assigned to one
    of the other JavaScript files.
*/

/*
    @pre none
    @post none
    @hasTest false
    @param none
    @returns true if currently unit testing, false otherwise
    @throws nothing
*/
function isUnitTesting() {
    return $("#qunit").length === 1;
}

function Point(x, y) {
    this.x = x;
    this.y = y;

    // @param p instance of Point to combine with 'this' in forming
    // what to return
    // @returns the sum of the two points (this and the parameter)
    // without editing the original point
    this.getSum = function(p) {
        return new Point(this.x + p.x, this.y + p.y);
    };
}