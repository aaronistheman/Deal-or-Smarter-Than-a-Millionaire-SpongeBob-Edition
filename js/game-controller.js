"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// @returns an array containing the ids for each canvas to generate
function getCanvasIds() {
    // make an array for ids of each canvas in the webpage
    var canvasIds = [];

    // Here is where we add the data for each canvas element;
    // note that the order of these pushes matters (e.g. the quote
    // text must be above the quote bubble)
    canvasIds.push(CANVAS_IDS.QUESTIONING);
    canvasIds.push(CANVAS_IDS.CHOOSE_QUESTION);
    canvasIds.push(CANVAS_IDS.MONEY_DISPLAY_BARS);
    canvasIds.push(CANVAS_IDS.MONEY_DISPLAY_TEXT);
    canvasIds.push(CANVAS_IDS.SPEAKER);
    canvasIds.push(CANVAS_IDS.QUOTE_BUBBLE);
    canvasIds.push(CANVAS_IDS.QUOTE_TEXT);
    canvasIds.push(CANVAS_IDS.TITLE_SCREEN);

    return canvasIds;
}

// @returns an object containing data regarding generating canvases
function getCanvasData() {
    var canvasData = {};
    canvasData.ids = getCanvasIds();

    // Canvas dimensions
    canvasData.width = "1100";
    canvasData.height = "550";

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

    // Here is where we add the data for each audio element
    audioData.push(new AudioData("next-quote-sound",
        "audio/next_quote.mp3"));
    audioData.push(new AudioData("opening-theme",
        "audio/who_wants_to_be_a_millionaire_theme.mp3"));

    return audioData;
}

var app = angular.module('game', []);
app.controller('gameCtrl', function($scope) {
    $scope.canvasData = getCanvasData();
    $scope.audioData = getAudioData();
});