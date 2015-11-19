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
    (3) answerData isn't instance of AnswerData
    (4) audienceData isn't instance of AudienceData and grade isn't
    GRADES.MILLION
*/
function Question(grade, subject, text, answerData, audienceData) {
    if (isGrade(grade))
        this.grade = grade;
    else {
        alertAndThrowException(
            "Invalid grade given to Question constructor");
    }

    if (isSubject(subject))
        this.subject = subject;
    else {
        alertAndThrowException(
            "Invalid subject given to Question constructor");
    }

    this.text = text;

    if (answerData instanceof AnswerData)
        this.answerData = answerData;
    else
        alertAndThrowException("answerData given to Question " +
            "constructor isn't instance of AnswerData; " +
            "Question has following text: " + this.text);

    this.answered = false;

    if ((grade === GRADES.MILLION) || (audienceData instanceof AudienceData))
        this.audienceData = audienceData;
    else
        alertAndThrowException("audienceData given to Question " +
            "constructor isn't instance of AudienceData; " +
            "Question has following text: " + this.text);
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
            "invalid correctIndex given to AnswerData constructor");
    }

    if (arrayOfAnswers.length === 4)
        this.arrayOfAnswers = arrayOfAnswers;
    else {
        alertAndThrowException(
            "invalidly-sized arrayOfAnswers given " +
            "to AnswerData constructor");
    }
}

/*
    Data type used to express the audience's answer if user uses
    "Ask the Audience" lifeline on a question

    @pre each parameter is in range [0, 1]
    @hasTest yes
    @param percentageA percentage of audience that votes for choice (A)
    of the question associated with this AudienceData instance
    @param percentageB percentage of audience that votes for choice (B)
    @param percentageC percentage of audience that votes for choice (C)
    @param percentageD percentage of audience that votes for choice (D)
    @throws exception on any of the following conditions (since these
    conditions could be hard to detect during runtime):
    (1) the four percentages don't add up to 1
    (2) any of the four percentages aren't in range [0, 1]
*/
function AudienceData(percentageA, percentageB, percentageC, percentageD) {
    // throw exception if the four percentages in audienceData don't
    // add up to 1
    if (parseFloat((percentageA + percentageB + percentageC +
        percentageD).toPrecision(3)) !== 1) {
        // output the percentages for the debugger's convenience
        console.log("These four percentages together are invalid when " +
            "given to AudienceData constructor because they don't " +
            "add up to 1");
        console.log("percentageA: " + percentageA);
        console.log("percentageB: " + percentageB);
        console.log("percentageC: " + percentageC);
        console.log("percentageD: " + percentageD);

        alertAndThrowException(
            "four percentages given to AudienceData " +
            "constructor don't add up to exactly 1; " +
            "the four percentages have been output to console");
    }

    // throw exception if any of the four percentages in audienceData
    // aren't in range [0, 1]
    for (var i in arguments) {
        if (arguments[i] < 0 || arguments[i] > 1) {
            // output the percentages for the debugger's convenience
            console.log("These four percentages together are invalid when " +
                "given to AudienceData constructor because at least " +
                "one of them is not in range [0, 1]");
            console.log("percentageA: " + percentageA);
            console.log("percentageB: " + percentageB);
            console.log("percentageC: " + percentageC);
            console.log("percentageD: " + percentageD);

            alertAndThrowException(
                "at least one of the four percentages given to " +
                "AudienceData constructor aren't in range [0, 1]; " +
                "the four percentages have been output to console");
        }
    }

    this.A = percentageA;
    this.B = percentageB;
    this.C = percentageC;
    this.D = percentageD;
}