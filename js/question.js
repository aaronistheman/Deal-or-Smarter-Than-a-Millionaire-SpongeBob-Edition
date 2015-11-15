"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @pre audienceData.length = 4; the doubles in audienceData sum
    up to 1; each value in audienceData is in range [0, 1]
    @param grade of the question (e.g. second grade); must be a
    constant in the object GRADES
    @hasTest yes
    @param subject of the question (e.g. art); must be a
    constant in the object SUBJECTS
    @param text the text of the question
    @param answerData instance of AnswerData that is suitable
    for the question
    @param audienceData instance of AudienceData that is suitable
    for the question
    @throws exception on any of the following conditions (since,
    otherwise, these errors may only be caught on the small chance
    that the given question appears):
    (1) invalid grade
    (2) invalid subject
*/
function Question(grade, subject, text, answerData, audienceData) {
    if (isGrade(grade))
        this.grade = grade;
    else {
        alertAndThrowException(
            "Error: invalid grade given to Question constructor");
    }

    if (isSubject(subject))
        this.subject = subject;
    else {
        alertAndThrowException(
            "Error: invalid subject given to Question constructor");
    }

    this.text = text;

    this.answerData = answerData;
    this.answered = false;

    this.audienceData = audienceData;
}

/*
    @hasTest yes
    @param correctIndex index of the correct answer in arrayOfAnswers
    @param arrayOfAnswers array of strictly four available answers
    @throws exception on any of the following conditions (since these
    conditions could be hard to detect during runtime):
    (1) correctIndex isn't in correct range
    (2) arrayOfAnswers has wrong length
*/
function AnswerData(correctIndex, arrayOfAnswers) {
    if (correctIndex >= 0 && correctIndex <= 3)
        this.correctIndex = correctIndex;
    else {
        alertAndThrowException(
            "Error: invalid correctIndex given to AnswerData constructor");
    }

    if (arrayOfAnswers.length === 4)
        this.arrayOfAnswers = arrayOfAnswers;
    else {
        alertAndThrowException(
            "Error: invalidly-sized arrayOfAnswers given " +
            "to AnswerData constructor");
    }
}