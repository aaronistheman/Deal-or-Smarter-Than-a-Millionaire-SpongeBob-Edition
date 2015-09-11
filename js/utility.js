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