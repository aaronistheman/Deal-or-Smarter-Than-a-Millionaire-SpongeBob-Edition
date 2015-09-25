"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// These are for the questions.
// The values of the constants are important in displaying each
// question's label.
var SUBJECTS = {
    VIDEO_GAMES : "Video Games",
    CRIME : "Crime",
    GEOGRAPHY : "Geography",
    STAFF : "Staff",
    RESTAURANTS : "Restaurants",
    VEHICLES : "Vehicles",
    SIDE_CHARACTERS : "Side Characters",
    MAIN_CHARACTERS : "Main Characters",
    ART : "Art",
    DRIVING : "Driving",
    FITNESS : "Fitness",
    RUMORS : "Rumors",
    HISTORY : "History",
    TECHNOLOGY : "Technology",
    QUOTATIONS : "Quotations",
    EPISODES : "Episodes",
};

/*
    @param subject the value to check the presence of in SUBJECTS
    @returns true if subject equals one of the values in SUBJECTS;
    otherwise, false
*/
function isSubject(subject) {
    for (var i in SUBJECTS) {
        if (SUBJECTS[i] === subject)
            return true;
    }
    return false;
}