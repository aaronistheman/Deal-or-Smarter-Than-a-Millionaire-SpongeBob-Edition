"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

var SOUND_EFFECTS_IDS = {
    NEXT_QUOTE : "next-quote-sound",

    // selection of briefcase
    MOVE_CASE_SELECTOR : "move-case-selector-sound",
    SELECT_CASE : "select-case-sound",

    // selection of helper
    MOVE_HELPER_SELECTOR : "move-helper-selector-sound",
    SELECT_HELPER : "select-helper-sound",

    // selection of question
    MOVE_QUESTION_SELECTOR : "move-question-selector-sound",
    SELECT_QUESTION : "select-question-sound",
    PRESENT_QUESTION : "present-question-sound",

    // selection of answer
    MOVE_ANSWER_SELECTOR : "move-answer-selector-sound",
    ENABLE_ANSWER_SELECTION : "enable-answer-selection-sound",

    // selection of lifeline
    ENABLE_LIFELINE_SELECTION : "enable-lifeline-selection-sound",
    MOVE_LIFELINE_SELECTOR : "move-lifeline-selector-sound",
    SELECT_LIFELINE : "select-lifeline-sound",

    // regarding "Ask the Audience" lifeline
    AUDIENCE_ANSWERED : "audience-answered-sound",

    // regarding "Phone a Friend" lifeline
    PHONE_CALL_ENDED : "phone-call-ended-sound",

    // loss
    LOSS_BUT_CAN_BE_SAVED : "loss-but-can-be-saved-sound",
    LOSS_BUT_CANNOT_BE_SAVED : "loss-but-cannot-be-saved-sound",
    LOSS_MILLION : "loss-million-sound",

    GOOD_BYE : "good-bye-sound",

    // correct answer
    CORRECT_ANSWER : "correct-answer-sound",
    CORRECT_ANSWER_10 : "correct-answer-10-sound",
    CORRECT_ANSWER_MILLION : "correct-answer-million-sound",

    // offered or took deal
    OFFERED_BIG_DEAL : "offered-big-deal-sound",
    TOOK_GOOD_DEAL : "took-good-deal-sound",
    TOOK_BAD_DEAL : "took-bad-deal-sound",
};

var MUSIC_IDS = {
    // Introduction to game
    OPENING : "opening-theme",
    INTRODUCE_HELPERS : "introduce-helpers-theme",

    // Background music for questions
    QUESTION_1_TO_5 : "question-1-to-5-theme",
    QUESTION_6 : "question-6-theme",
    QUESTION_7 : "question-7-theme",
    QUESTION_8 : "question-8-theme",
    QUESTION_9 : "question-9-theme",
    QUESTION_10 : "question-10-theme",
    QUESTION_MILLION : "question-million-theme",

    // Regarding "Ask the Audience" lifeline
    WAITING_FOR_AUDIENCE_ANSWER : "waiting-audience-theme",

    // Regarding "Phone a Friend" lifeline
    WAITING_FOR_PHONE_CALL : "waiting-phone-call-theme",
    PHONE_CALL_OCCURING : "phone-call-occuring-theme",

    BANKER : "banker-theme",
    ACCEPT_OR_REJECT_DEAL : "accept-or-reject-deal-theme",
    WAS_A_GOOD_DEAL_ACCEPTED : "was-a-good-deal-accepted-theme",
};