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
    @param arrayOfStrenghts array of the subjects that the helper
    has an advantage in; should be array of members of object SUBJECTS
    @throws exception if invalid defaultCorrectRate
*/
function Helper(name, defaultCorrectRate, introductoryQuote, iconSource,
    arrayOfStrenghts) {
    // Confirm valid parameters
    if (defaultCorrectRate <= 0 || defaultCorrectRate > 1) {
        alertAndThrowException(
            "Invalid defaultCorrectRate given to Helper constructor");
    }

    this.name = name;
    this.defaultCorrectRate = defaultCorrectRate;
    this.introductoryQuote = introductoryQuote;

    // Array that contains the subjects that this helper has an
    // advantage with
    this._strengths = arrayOfStrenghts;

    // Is this helper currently the active one?
    this.isChosen = false;

    this.iconSource = iconSource;
}

/*
    @returns the array of this helper's strengths
*/
Helper.prototype.getStrengths = function() {
    return this._strengths;
}