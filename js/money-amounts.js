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

/*
    @pre stringInteger is a string representation of a positive
    integer with no non-numerical components (e.g. commas, periods)
    and that's first/leftmost digit is not zero
    @hasTest yes
    @param stringInteger the string representation to add commas to
    @returns a version of stringInteger that has commas as
    separators of every three digits from the end of the number
*/
function putCommasInStringInteger(stringInteger) {
    var stringToReturn = "";

    for (var i = stringInteger.length - 1; i >= 0; --i) {
        // Add the digit to the front of stringToReturn
        stringToReturn = stringInteger[i] + stringToReturn;

        if (i !== 0) {
            // Add a comma if the digit in question is a multiple
            // of three digits away from the end/rightmost of the number
            var distanceFromEnd = stringInteger.length - i;
            if (distanceFromEnd % 3 === 0)
                stringToReturn = ',' + stringToReturn;
        }
    }

    return stringToReturn;
}