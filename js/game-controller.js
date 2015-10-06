"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// @returns an array containing the ids for each canvas to generate
function getCanvasIds() {
    // make an array for ids of each canvas in the webpage
    var canvasIds = [];

    // Here is where we add the data for each canvas element
    for (var key in CANVAS_IDS) {
        if (typeof CANVAS_IDS[key] == "string")
            canvasIds.push(CANVAS_IDS[key]);
    }

    return canvasIds;
}

// @returns an object containing data regarding generating canvases
function getCanvasData() {
    var canvasData = {};
    canvasData.ids = getCanvasIds();

    // Canvas dimensions
    canvasData.width = CANVAS_WIDTH.toString();
    canvasData.height = CANVAS_HEIGHT.toString();

    return canvasData;
}

function AudioData(id, src) {
    this.id = id;
    this.src = src;
}

// @returns an array of objects that contains data regarding
// generating audio elements
function getAudioData() {
    var audioData = [];

    // Here is where we add the data for each audio element;
    // add sound effects
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.NEXT_QUOTE,
        "media/sound/next_quote.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.MOVE_CASE_SELECTOR,
        "media/sound/move_case_selector.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.SELECT_CASE,
        "media/sound/select_case.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.MOVE_QUESTION_SELECTOR,
        "media/sound/move_question_selector.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.SELECT_QUESTION,
        "media/sound/select_question.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.PRESENT_QUESTION,
        "media/sound/present_question.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.MOVE_ANSWER_SELECTOR,
        "media/sound/move_answer_selector.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.LOSS,
        "media/sound/loss.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.LOSS_MILLION,
        "media/sound/loss_million.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.GOOD_BYE,
        "media/sound/good_bye.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.CORRECT_ANSWER,
        "media/sound/correct_answer.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.CORRECT_ANSWER_10,
        "media/sound/correct_answer_10.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.CORRECT_ANSWER_MILLION,
        "media/sound/correct_answer_million.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.OFFERED_BIG_DEAL,
        "media/sound/offered_big_deal.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.TOOK_GOOD_DEAL,
        "media/sound/took_good_deal.mp3"));
    audioData.push(new AudioData(SOUND_EFFECTS_IDS.TOOK_BAD_DEAL,
        "media/sound/took_bad_deal.mp3"));

    // add background music
    audioData.push(new AudioData(MUSIC_IDS.OPENING,
        "media/music/who_wants_to_be_a_millionaire_theme.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.INTRODUCE_HELPERS,
        "media/music/deal_or_no_deal_theme.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.QUESTION_1_TO_5,
        "media/music/question_1_to_5.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.QUESTION_6,
        "media/music/question_6.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.QUESTION_7,
        "media/music/question_7.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.QUESTION_8,
        "media/music/question_8.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.QUESTION_9,
        "media/music/question_9.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.QUESTION_10,
        "media/music/question_10.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.QUESTION_MILLION,
        "media/music/question_million.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.BANKER,
        "media/music/banker_theme.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.ACCEPT_OR_REJECT_DEAL,
        "media/music/accept_or_reject_deal.mp3"));
    audioData.push(new AudioData(MUSIC_IDS.WAS_A_GOOD_DEAL_ACCEPTED,
        "media/music/was_a_good_deal_accepted.mp3"));

    return audioData;
}

var app = angular.module('game', []);
app.controller('gameCtrl', function($scope) {
    $scope.canvasData = getCanvasData();
    $scope.audioData = getAudioData();
});