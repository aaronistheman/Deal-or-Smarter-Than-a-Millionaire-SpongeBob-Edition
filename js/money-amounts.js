"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @returns an array of strings, each of which contains a money
    amount that is to be used in game as a briefcase value; each
    string number has commas, if needed, to increase readability
*/
function getBeginningMoneyAmounts() {
    return ['0.01', '50', '300', '750', '1,000',
        '10,000', '25,000', '100,000', '250,000', '500,000'];
}

/*
    @pre stringNumber, besides any commas in it, represents a number
    (e.g. "10,000.01")
    @hasTest yes
    @returns version of stringNumber without any commas in it
*/
function removeCommaFromStringNumber(stringNumber) {
    return stringNumber.replace(/\,/g,'');
}

/*
    @pre each element of arrayOfStringNumbers, besides having commas,
    is a string version of a number (e.g. "20,000.01")
    @hasTest yes
    @returns version of arrayOfStringNumbers in which none of the
    elements have any commas
*/
function removeCommaFromEachStringNumber(arrayOfStringNumbers) {
    var resultantArray = [];
    for (var i = 0; i < arrayOfStringNumbers.length; ++i) {
        var stringNumber = arrayOfStringNumbers[i];
        resultantArray.push(removeCommaFromStringNumber(stringNumber));
    }
    return resultantArray;
}