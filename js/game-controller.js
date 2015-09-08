"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

var app = angular.module('game', []);
app.controller('gameCtrl', function($scope) {
    // make an array for ids of each canvas in this webpage
    var canvasIds = [];
    // canvasIds.push("choose-question-background-canvas");
    canvasIds.push("choose-question-canvas");
    // canvasIds.push("questioning-background-canvas");
    canvasIds.push("questioning-canvas");
    canvasIds.push("speaker-canvas");
    canvasIds.push("quote-bubble-canvas");
    canvasIds.push("quote-text-canvas");
    // canvasIds.push("title-screen-background-canvas");
    canvasIds.push("title-screen-canvas");

    // insert:
    // open case scene
    // banker deal scene

    $scope.canvasIds = canvasIds;

    // Canvas dimensions
    $scope.width = "1100";
    $scope.height = "550";
});