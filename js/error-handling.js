"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

var ERROR_MESSAGES = {};
ERROR_MESSAGES.PARAMETER = "parameter error";

/*
    @pre none
    @post errorMessage has been printed to console
    @hasTest yes
    @param errorMessage to print in the console
    @returns constant indicating the parameter error (mostly for unit
    testing purposes)
    @throws nothing
*/
function parameterError(errorMessage) {
    // We don't want to have alerts bombard us during unit testing
    // of proper invalid parameter rejection
    if (!isUnitTesting())
        alert(errorMessage);

    console.log(errorMessage);
    return ERROR_MESSAGES.PARAMETER;
}