"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

function Questions() {
    // Storage of objects of type Question
    this._questions = [];

    this._generateTenQuestions();
}

/*
    Because each question must have a unique subject (but not
    necessarily a unique grade level), this is how a question
    from the storage of ten questions will
    be retrieved based on the user's choice.
    @pre none of the Question objects in "this" have the same
    subject
*/
// Questions.prototype.getQuestionBySubject = function(subject) {

// }

/*
    @pre this._questions.length = 0
    @post this._questions contains ten instances of type Question;
    each of these instances has a different subject matter; two
    questions of the ten are attached to each grade level from
    one to five
*/
Questions.prototype._generateTenQuestions = function() {
    var supply = Questions.getEntireSupplyOfQuestions();

    // Pick a question from a grade.
    // Erase all questions, regardingless of grade,
    // from supply that have its subject.
    // Pick another question from the same grade.
    // Erase all questions that have its subject.
    // Go to the next grade, and repeat the process.

    while (this._questions.length < 10) {
        var randomIndex = Math.floor((Math.random() * supply.length));
        this._questions.push(supply.splice(randomIndex, 1).pop());
    }
}

/*
    Static methods and/or members
*/

/*
    @returns an array of instances of Question so that this array
    contains all of the questions that the user could possible face
*/
Questions.getEntireSupplyOfQuestions = function() {
    var supply = [];

    supply.push(new Question(SUBJECTS.VIDEO_GAMES));
    supply.push(new Question(SUBJECTS.CRIME));
    supply.push(new Question(SUBJECTS.GEOGRAPHY));
    supply.push(new Question(SUBJECTS.STAFF));
    supply.push(new Question(SUBJECTS.RESTAURANTS));
    supply.push(new Question(SUBJECTS.VEHICLES));
    supply.push(new Question(SUBJECTS.SIDE_CHARACTERS));
    supply.push(new Question(SUBJECTS.MAIN_CHARACTERS));
    supply.push(new Question(SUBJECTS.ART));
    supply.push(new Question(SUBJECTS.DRIVING));
    supply.push(new Question(SUBJECTS.FITNESS));
    supply.push(new Question(SUBJECTS.RUMORS));
    supply.push(new Question(SUBJECTS.HISTORY));
    supply.push(new Question(SUBJECTS.TECHNOLOGY));
    supply.push(new Question(SUBJECTS.QUOTATIONS));

    return supply;
}