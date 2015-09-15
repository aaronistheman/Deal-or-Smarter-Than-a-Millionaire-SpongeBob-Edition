"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// Includes ids of canvases;
// note that the order of these ids matter in that they affect
// the order in which the AngularJS code generates the canvases
// (e.g. the quote text must be above the quote bubble)
var CANVAS_IDS = {
    BRIEFCASES : "briefcase-display-canvas",
    BRIEFCASES_TEXT : "briefcase-text-canvas",
    QUESTIONING : "questioning-canvas",
    CHOOSE_QUESTION : "choose-question-canvas",
    MONEY_DISPLAY_BARS : "money-display-bars-canvas",
    MONEY_DISPLAY_TEXT : "money-display-text-canvas",
    SPEAKER : "speaker-canvas",
    QUOTE_BUBBLE : "quote-bubble-canvas",
    QUOTE_TEXT : "quote-text-canvas",
    TITLE_SCREEN : "title-screen-canvas",
};

// Groups of canvas ids; for use in functions that support them
CANVAS_IDS.QUOTE = [CANVAS_IDS.QUOTE_TEXT, CANVAS_IDS.QUOTE_BUBBLE];
CANVAS_IDS.SPEAKER_QUOTE =
    CANVAS_IDS.QUOTE.concat([CANVAS_IDS.SPEAKER]);
CANVAS_IDS.MONEY_DISPLAY =
    [CANVAS_IDS.MONEY_DISPLAY_TEXT, CANVAS_IDS.MONEY_DISPLAY_BARS];
CANVAS_IDS.BRIEFCASE_DISPLAY =
    [CANVAS_IDS.BRIEFCASES, CANVAS_IDS.BRIEFCASES_TEXT];