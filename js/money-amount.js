"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @pre value is a number (not a string) (and thus with no commas in it)
    @param value the numerical amount of money to store
*/
function MoneyAmount(value) {
    this._value = value;
}

/*
    @hasTest yes
    @returns this._value as a number (not as a string)
*/
MoneyAmount.prototype.asNumber = function() {
    return this._value;
}

/*
    @hasTest yes
    @returns this._value as a string with commas to increase readability
*/
MoneyAmount.prototype.asString = function() {
    return putCommasInStringNumber(this._value.toString());
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
    @pre stringNumber is a string representation of a positive
    number with no commas and that's first/leftmost digit isn't zero
    (unless it's the ones digit)
    @hasTest yes
    @param stringNumber the string representation to edit
    @returns a version of stringNumber that has commas as separators
    of every three digits from the ones digit
*/
function putCommasInStringNumber(stringNumber) {
    var stringToReturn = "";
    var atRightOfDecimalPoint = false;
    var indexOfDecimalPoint = stringNumber.length;

    // Check if stringNumber has a decimal; if it does, can't
    // focus on adding commas until the numbers to the right
    // of the decimal point have been read
    for (var i = 0; i < stringNumber.length; ++i) {
        if (stringNumber[i] === '.') {
            atRightOfDecimalPoint = true;
            indexOfDecimalPoint = undefined;
        }
    }

    // Start from the right of the number and recreate it,
    // adding commas where necessary; traverse one digit at a time
    for (var i = stringNumber.length - 1; i >= 0; --i) {
        // Add the character to the front of stringToReturn
        stringToReturn = stringNumber[i] + stringToReturn;

        // If the numbers to the right of the decimal point have
        // been read, and the leftmost digit isn't being examined,
        // check if a comma should be added
        if (!atRightOfDecimalPoint && i !== 0) {
            // Add a comma if the digit in question is a multiple
            // of three digits away from the decimal point
            var distanceFromEnd = indexOfDecimalPoint - i;
            if (distanceFromEnd % 3 === 0)
                stringToReturn = ',' + stringToReturn;
        }
        // Otherwise, keep looking for the decimal point
        else if (atRightOfDecimalPoint) {
            // If found decimal point, record its index
            if (stringNumber[i] === '.') {
                indexOfDecimalPoint = i;
                atRightOfDecimalPoint = false;
            }
        }
    }

    return stringToReturn;
}