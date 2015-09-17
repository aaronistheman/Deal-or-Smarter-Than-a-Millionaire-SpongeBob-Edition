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
    one to five, and these ten questions are sorted by grade level
    @hasTest yes
*/
Questions.prototype._generateTenQuestions = function() {
    var supply = Questions.getEntireSupplyOfQuestions();
    var tenQuestions = [];

    /*
        @pre for each grade level, supplyOfQuestions contains at
        least two questions of different subject matters; otherwise,
        an infinite loop will occur
        @post two questions of the given grade from supplyOfQuestions
        have been put in tenQuestions; these two questions don't
        have the same subject; after a question is put in tenQuestions,
        every question in supplyOfQuestions that has the question's
        subject matter will be removed
    */
    var pickTwoQuestions = function(supplyOfQuestions, grade) {
        var numberOfQuestionsAdded = 0;
        while (numberOfQuestionsAdded < 2) {
            var randomIndex =
                Math.floor((Math.random() * supplyOfQuestions.length));

            // Only add the question indicated by randomIndex if the
            // grade level is correct
            if (supplyOfQuestions[randomIndex].grade === grade) {
                var questionToAdd =
                    supplyOfQuestions.splice(randomIndex, 1).pop();
                tenQuestions.push(questionToAdd);
                ++numberOfQuestionsAdded;

                // Erase all questions that have this question's subject
                // matter
                var subjectToErase = questionToAdd.subject;
                for (var i = 0; i < supplyOfQuestions.length; ) {
                    if (supplyOfQuestions[i].subject === subjectToErase)
                        supplyOfQuestions.splice(i, 1);
                    else
                        ++i;
                }
            }
        }
    };

    pickTwoQuestions(supply, GRADES.FIRST);
    pickTwoQuestions(supply, GRADES.SECOND);
    pickTwoQuestions(supply, GRADES.THIRD);
    pickTwoQuestions(supply, GRADES.FOURTH);
    pickTwoQuestions(supply, GRADES.FIFTH);

    this._questions = tenQuestions;
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

    supply.push(new Question(GRADES.FIRST, SUBJECTS.VIDEO_GAMES));
    supply.push(new Question(GRADES.FIRST, SUBJECTS.VIDEO_GAMES));
    supply.push(new Question(GRADES.FIRST, SUBJECTS.CRIME));
    supply.push(new Question(GRADES.FIRST, SUBJECTS.GEOGRAPHY));

    supply.push(new Question(GRADES.SECOND, SUBJECTS.STAFF));
    supply.push(new Question(GRADES.SECOND, SUBJECTS.STAFF));
    supply.push(new Question(GRADES.SECOND, SUBJECTS.RESTAURANTS));
    supply.push(new Question(GRADES.SECOND, SUBJECTS.VEHICLES));

    supply.push(new Question(GRADES.THIRD, SUBJECTS.SIDE_CHARACTERS));
    supply.push(new Question(GRADES.THIRD, SUBJECTS.SIDE_CHARACTERS));
    supply.push(new Question(GRADES.THIRD, SUBJECTS.MAIN_CHARACTERS));
    supply.push(new Question(GRADES.THIRD, SUBJECTS.ART));

    supply.push(new Question(GRADES.FOURTH, SUBJECTS.DRIVING));
    supply.push(new Question(GRADES.FOURTH, SUBJECTS.DRIVING));
    supply.push(new Question(GRADES.FOURTH, SUBJECTS.FITNESS));
    supply.push(new Question(GRADES.FOURTH, SUBJECTS.RUMORS));

    supply.push(new Question(GRADES.FIFTH, SUBJECTS.HISTORY));
    supply.push(new Question(GRADES.FIFTH, SUBJECTS.HISTORY));
    supply.push(new Question(GRADES.FIFTH, SUBJECTS.TECHNOLOGY));
    supply.push(new Question(GRADES.FIFTH, SUBJECTS.QUOTATIONS));

    return supply;
}