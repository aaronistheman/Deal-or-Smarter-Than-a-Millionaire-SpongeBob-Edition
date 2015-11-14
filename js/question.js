"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @param grade of the question (e.g. second grade); must be a
    constant in the object GRADES
    @param subject of the question (e.g. art); must be a
    constant in the object SUBJECTS
    @param text the text of the question
    @param answerData instance of AnswerData that is suitable
    to the question
    @throws a string if invalid subject
*/
function Question(grade, subject, text, answerData) {
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
}

/*
    @param correctIndex index of the correct answer in arrayOfAnswers
    @param arrayOfAnswers array of strictly four available answers
    @throws a string if either parameter is invalid
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