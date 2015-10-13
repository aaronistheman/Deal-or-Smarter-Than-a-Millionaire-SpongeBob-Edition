"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @pre 0 < defaultCorrectRate <= 1
    @post instance of Helper has been created without any strengths
    @param name of the helper; should be a value in SPEAKERS
    @param defaultCorrectRate the rate at which the helper answers
    correctly a question that does not suit any of his strengths
    @param introductoryQuote what the helper says when the host
    introduces him/her
    @param iconSource source of the image containing this helper's
    icon (which shows as the user decides which helper to pick)
    @throws exception if invalid defaultCorrectRate
*/
function Helper(name, defaultCorrectRate, introductoryQuote, iconSource) {
    // Confirm valid parameters
    if (defaultCorrectRate <= 0 || defaultCorrectRate > 1) {
        alert("Invalid defaultCorrectRate given to Helper constructor");
        throw "Invalid defaultCorrectRate given to Helper constructor";
    }

    this.name = name;
    this.defaultCorrectRate = defaultCorrectRate;
    this.introductoryQuote = introductoryQuote;

    // Array that contains the subjects that this helper will always
    // correctly answer questions of
    this._strengths = [];

    this.iconSource = iconSource;
}

/*
    @post instance of Helper has had the given subject added to
    this._strengths
    @hasTest yes
    @param subject member of SUBJECTS to add to this._strenghts
    @returns the "this" instance (to allow chaining)
*/
Helper.prototype.addStrength = function(subject) {
    this._strengths.push(subject);
    return this;
}