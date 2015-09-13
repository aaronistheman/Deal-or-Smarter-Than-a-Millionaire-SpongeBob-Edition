"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    This file includes code that isn't easily assigned to one
    of the other JavaScript files.
*/

// For functions that toggle things (e.g. music)
var TOGGLE = {};
TOGGLE.ON = "on";
TOGGLE.OFF = "off";

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
}

/*
    @param v instance of Vector2d to add to 'this' in forming
    what to return
    @returns the sum of the two vectors ('this' and the parameter)
    without editing the original vector (i.e. 'this')
*/
Vector2d.prototype.getSum = function(v) {
    return new Vector2d(this.x + v.x, this.y + v.y);
};

/*
    @param v instance of Vector2d to multiply with 'this' in
    forming what to return
    @returns the product of the two vectors ('this' and the
    parameter) without editing the original vector (i.e. 'this')
*/
Vector2d.prototype.getProduct = function(v) {
    return new Vector2d(this.x * v.x, this.y * v.y);
};