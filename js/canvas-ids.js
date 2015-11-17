"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

// the values of the constants are the ids of the generated
// canvases;
// note that the order of these ids matter in that they affect
// the order in which the AngularJS code generates the canvases
// (e.g. the quote text must be above the quote bubble);
// for each string in CANVAS_IDS, a canvas will be created
// using AngularJS
var CANVAS_IDS = {
    CHOOSE_HELPER_GRAPHICS : "choose-helper-graphics-canvas",
    CHOOSE_HELPER_TEXT : "choose-helper-text-canvas",
    BANKER : "banker-canvas",
    BRIEFCASES : "briefcase-display-canvas",
    BRIEFCASES_TEXT : "briefcase-text-canvas",
    QUESTIONING_GRAPHICS : "questioning-graphics-canvas",
    QUESTIONING_TEXT : "questioning-text-canvas",
    LIFELINES_GRAPHICS : "lifelines-graphics-canvas",
    LIFELINES_TEXT : "lifelines-text-canvas",
    AUDIENCE_CHART : "ask-the-audience-chart-canvas",
    MILLION_QUESTION : "million-question-canvas",
    CHOOSE_QUESTION_GRAPHICS : "choose-question-graphics-canvas",
    CHOOSE_QUESTION_TEXT : "choose-question-text-canvas",
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
CANVAS_IDS.CHOOSE_HELPER =
    [CANVAS_IDS.CHOOSE_HELPER_GRAPHICS, CANVAS_IDS.CHOOSE_HELPER_TEXT];
CANVAS_IDS.MONEY_DISPLAY =
    [CANVAS_IDS.MONEY_DISPLAY_TEXT, CANVAS_IDS.MONEY_DISPLAY_BARS];
CANVAS_IDS.BRIEFCASE_DISPLAY =
    [CANVAS_IDS.BRIEFCASES, CANVAS_IDS.BRIEFCASES_TEXT];
CANVAS_IDS.CHOOSE_QUESTION =
    [CANVAS_IDS.CHOOSE_QUESTION_GRAPHICS,
    CANVAS_IDS.CHOOSE_QUESTION_TEXT];
CANVAS_IDS.QUESTIONING = [CANVAS_IDS.QUESTIONING_GRAPHICS,
    CANVAS_IDS.QUESTIONING_TEXT];
CANVAS_IDS.LIFELINES = [CANVAS_IDS.LIFELINES_GRAPHICS,
    CANVAS_IDS.LIFELINES_TEXT];