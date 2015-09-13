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

function Vector2d(x, y) {
    this.x = x;
    this.y = y;

    // @param v instance of Vector2d to combine with 'this' in forming
    // what to return
    // @returns the sum of the two vectors ('this' and the parameter)
    // without editing the original vector (i.e. 'this')
    this.getSum = function(v) {
        return new Vector2d(this.x + v.x, this.y + v.y);
    };
}