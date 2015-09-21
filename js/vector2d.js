"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

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