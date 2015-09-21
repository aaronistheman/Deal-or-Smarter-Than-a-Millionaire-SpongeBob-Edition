"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @post a chain of helper functions has been started so that
    the rules will be explained

    I did it this way to avoid bad-looking nesting of calls
    of gameShow.quotesToDraw.deployQuoteChain and calls of
    the methods of gameShow.canvasStack.
*/
function explainRules() {
    explainCasePick();
}

/*
    Note that explainRules() should be called to begin the chain
    that will call the functions below.
*/

function explainCasePick() {
    // move speaker canvas out of the way to show other things
    // while host is speaking
    gameShow.canvasStack.set(CANVAS_IDS.BRIEFCASE_DISPLAY.concat(
        CANVAS_IDS.QUOTE));

    gameShow.quotesToDraw.add("Shortly, you will pick a briefcase.")
        .deployQuoteChain(explainPickedCaseValue);
}

function explainPickedCaseValue() {
    gameShow.canvasStack.set(CANVAS_IDS.MONEY_DISPLAY.concat(
        CANVAS_IDS.QUOTE));
    gameShow.quotesToDraw.add(
        "That case's value equals one of the values on the " +
        "money board, but you don't know which.")
        .deployQuoteChain(beginExplainingQuestions);
}

function beginExplainingQuestions() {
    gameShow.canvasStack.set(CANVAS_IDS.QUOTE.concat(
        CANVAS_IDS.CHOOSE_QUESTION));
    gameShow.quotesToDraw.add(
        "After that, you will try to answer ten questions.")
        .add("To keep it easy for you, these questions are " +
            "elementary school level.")
        .add("And, they're all about the TV show " +
            "'SpongeBob Squarepants'.")
        .deployQuoteChain(explainQuestionValue);
}

function explainQuestionValue() {
    gameShow.canvasStack.set(CANVAS_IDS.MONEY_DISPLAY.concat(
        CANVAS_IDS.QUOTE));
    gameShow.quotesToDraw.add(
        "Answering a question correctly reveals a random " +
        "amount from the money board.")
        .add("But wait, a twist occurs after every two questions " +
            "and before your tenth question:")
        .deployQuoteChain(explainBanker);
}

function explainBanker() {
    gameShow.canvasStack.set(CANVAS_IDS.QUOTE.concat(
        CANVAS_IDS.BANKER));
    gameShow.quotesToDraw.add("the banker will offer you some money.")
        .add("He wants your briefcase, but he doesn't want to pay " +
            "too much for it.")
        .add("You can say 'Deal' and leave the game with that money,")
        .add("or you can say 'No Deal' and hope for an even greater " +
            "amount of money.")
        .deployQuoteChain(explainOutcomes);
}

function explainOutcomes() {
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.quotesToDraw.add(
        "If you miss a question, you leave with nothing.")
        .add("If you get past all ten questions, you can either take " +
            "your case home,")
        .deployQuoteChain(explainMillionDollarQuestion);
}

function explainMillionDollarQuestion() {
    gameShow.canvasStack.set(CANVAS_IDS.QUOTE.concat(
        CANVAS_IDS.MILLION_QUESTION));
    gameShow.quotesToDraw.add(
        "or you can bet it all and try to answer the million " +
        "dollar question.")
        .deployQuoteChain(explainHelp);
}

function explainHelp() {
    gameShow.musicPlayer.stop();
    gameShow.canvasStack.set(CANVAS_IDS.SPEAKER_QUOTE);
    gameShow.quotesToDraw.add("However, you're not alone.")
        .add("You have helpers.")
        .add("Let's see them.")
        .deployQuoteChain(showSquidward);
}

function showSquidward() {
    gameShow.musicPlayer.play(MUSIC_IDS.INTRODUCE_HELPERS);
    drawNewSpeaker(SPEAKERS.SQUIDWARD);
    gameShow.quotesToDraw.add("Fortunately, I have enough talent " +
        "for all of you.")
        .deployQuoteChain(showMermaidMan);
}

function showMermaidMan() {
    drawNewSpeaker(SPEAKERS.MERMAID_MAN);
    gameShow.quotesToDraw.add("EVIL!")
        .deployQuoteChain(showSandy);
}

function showSandy() {
    drawNewSpeaker(SPEAKERS.SANDY);
    gameShow.quotesToDraw.add("Howdy ya'll.")
        .deployQuoteChain(showLarryTheLobster);
}

function showLarryTheLobster() {
    drawNewSpeaker(SPEAKERS.LARRY);
    gameShow.quotesToDraw.add("Hey, this party's finally " +
        "starting to pick up. ")
        .deployQuoteChain(showGary);
}

function showGary() {
    drawNewSpeaker(SPEAKERS.GARY);
    gameShow.quotesToDraw.add("Meow.")
        .deployQuoteChain(explainSourcesOfHelp);
}

function explainSourcesOfHelp() {
    drawNewSpeaker(SPEAKERS.SPONGEBOB);

    // Describe what the helpers can do and the two ways in
    // which the player can cheat off of them
    gameShow.quotesToDraw.add("You get to pick one helper before " +
        "every two questions.")
        .add("You have two cheats you can use on your helper.")
        .add("Once per game, you can peek at your helper's answer " +
            "before picking your own.")
        .add("Additionally, also once per game, if you get a " +
            "question wrong, your helper has a chance at saving you.")
        .add("To do this, he or she must've picked the correct " +
            "answer.")
        .add("However, your helpers don't know everything.")
        .add("They can be wrong. Keep that in mind.")

    // Describe the two additional lifelines that the player has
        .add("In addition to the cheats, you also have two lifelines.")
        .add("Each of these can only be used once per game.")
        .add("You can ask the audience to vote on a question.")
        .add("You can also phone a friend to try to get the answer.")
        .add("Hopefully, that friend is reliable.")

        .add("However, be aware that none of your cheats and lifelines" +
            " can be used on the million dollar question.")
        .deployQuoteChain(selectFirstCase);
}