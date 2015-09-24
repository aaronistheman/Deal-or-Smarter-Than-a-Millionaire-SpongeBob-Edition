"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// The grade level attached to each question.
// Note that the numerical values of these constants are used
// in a unit test.
var GRADES = {
    FIRST : 1,
    SECOND : 2,
    THIRD : 3,
    FOURTH : 4,
    FIFTH : 5,
};

/*
    @param grade the value to check the presence of in GRADES
    @returns true if grade equals one of the values in GRADES;
    otherwise, false
*/
function isGrade(grade) {
    for (var i in GRADES) {
        if (GRADES[i] === grade)
            return true;
    }
    return false;
}