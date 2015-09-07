var app = angular.module('game', []);
app.controller('gameCtrl', function($scope) {
    // make an array for ids of each canvas in this webpage
    var canvasIds = [];
    // canvasIds.push("choose-question-background-canvas");
    canvasIds.push("choose-question-canvas");
    // canvasIds.push("questioning-background-canvas");
    canvasIds.push("questioning-canvas");
    canvasIds.push("speaking-canvas");
    canvasIds.push("quote-bubble-canvas");
    canvasIds.push("quote-text-canvas");
    // canvasIds.push("menu-background-canvas");
    canvasIds.push("menu-canvas");

    // insert:
    // open case scene
    // banker deal scene

    $scope.canvasIds = canvasIds;

    // Canvas dimensions
    $scope.width = "1100";
    $scope.height = "550";
});