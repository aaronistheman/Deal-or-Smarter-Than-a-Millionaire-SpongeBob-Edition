"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1

    Using modules, I've divided the tests based on which file
    each tested function comes from. Modules are in alphabetical
    order by the name of the represented file.
*/

/*
    @pre when used as a constructor, customType must be okay
    with having no arguments supplied to it
    @post some assertions have been run to see if an instance of the
    given type inherits from Component.prototype (and steals its
    constructor)
    @param assert needed to be able to do QUnit assertions
    @param customType the type to evaluate; should be a constructor's
    name
    @param nameOfType custom type's name that will be used in the
    tests' messages; must be a string
*/
function testInheritanceFromComponent(assert, customType, nameOfType) {
    var object = new customType();

    // Test object inheritance
    assert.ok(GUI.Component.prototype.isPrototypeOf(object),
        nameOfType + " inherits the prototype of Component");
    assert.ok(object instanceof GUI.Component,
        "Instance of " + nameOfType + " is instance of Component");

    // Test constructor stealing
    assert.ok(object.hasOwnProperty("_isSelected"),
        nameOfType + " steals Component's constructor in its own");
}

/*
    @pre when used as a constructor, customType must be okay
    with having no arguments supplied to it
    @post some assertions have been run to see if the constructor
    of customType is scope-safe
    @param assert needed to be able to do QUnit assertions
    @param customType the type to evaluate; should be a constructor's
    name
    @param nameOfType custom type's name that will be used in the
    tests' messages; must be a string
*/
function testConstructorScopeSafety(assert, customType, nameOfType) {
    var object = customType();
    assert.ok((object instanceof customType) && (typeof object === "object"),
        "Constructor of " + nameOfType + " is scope-safe");
}

QUnit.module("banker.js");

QUnit.test("Banker.prototypegetOffer()", function(assert) {
    var banker = new Banker();

    // Set up to test for a correct banker offer that's rounded
    // to the nearest hundred
    var arrayOfMoneyAmounts = [];
    arrayOfMoneyAmounts.push(new MoneyAmount(50));
    arrayOfMoneyAmounts.push(new MoneyAmount(300));
    arrayOfMoneyAmounts.push(new MoneyAmount(750));
    // Calculate the correct banker offer, apply the banker multiplier,
    // and round it to the nearest hundred
    var bankOffer = (50 + 300 + 750) / 3;
    var roundedBankOffer =
        Math.floor(bankOffer * Banker.MULTIPLIER / 100) * 100;
    assert.deepEqual(banker.getOffer(arrayOfMoneyAmounts).asNumber(),
        roundedBankOffer, "Correct banker's offer determined, rounded to " +
            "nearest hundred, and returned");

    // Set up to test for a correct banker offer that's rounded to
    // the nearest thousand
    arrayOfMoneyAmounts = [];
    arrayOfMoneyAmounts.push(new MoneyAmount(250000));
    arrayOfMoneyAmounts.push(new MoneyAmount(100000));
    arrayOfMoneyAmounts.push(new MoneyAmount(300));
    // Calculate the correct banker offer, apply the banker multiplier,
    // and round it to the nearest thousand
    bankOffer = (250000 + 100000 + 300) / 3;
    roundedBankOffer =
        Math.floor(bankOffer * Banker.MULTIPLIER / 1000) * 1000;
    assert.deepEqual(banker.getOffer(arrayOfMoneyAmounts).asNumber(),
        roundedBankOffer, "Correct banker's offer determined, " +
        "rounded to nearest thousand, and returned");
});

QUnit.module("button.js");

QUnit.test("Button()", function(assert) {
    testInheritanceFromComponent(assert, GUI.Button, "Button");
    testConstructorScopeSafety(assert, GUI.Button, "Button");
});

QUnit.test("Button.prototype.select()", function(assert) {
    var button = new GUI.Button("trivial");
    button.select(undefined, undefined);
    assert.ok(button._isSelected,
        "Button's state has been updated to reflect its being selected");
    assert.deepEqual(button._textColor, GUI.Button.TEXT_COLORS.SELECTED,
        "Button's text color has been updated");
});

// This test assumes that GUI.Button.prototype.select() works
QUnit.test("Button.prototype.deselect()", function(assert) {
    var button = new GUI.Button("trivial");
    button.select(undefined, undefined);
    button.deselect(undefined, undefined);
    assert.deepEqual(button._isSelected, false,
        "Button's state has been updated to reflect its being deselected");
    assert.deepEqual(button._textColor, GUI.Button.TEXT_COLORS.UNSELECTED,
        "Button's text color has been updated");
});

QUnit.test("Button.prototype.activate()", function(assert) {
    var button = new GUI.Button("trivial");
    button.activate();
    assert.ok(button._isActive,
        "This method accesses the supertype (Component) version");

    var callbackWasCalled = false;
    button.setCallback(function() {
        callbackWasCalled = true;
    });
    button.activate();
    assert.ok(callbackWasCalled,
        "Activating a button triggers the callback");
});

QUnit.module("briefcase-display.js");

QUnit.test("BriefcaseDisplay.getCasePosition()", function(assert) {
    assert.deepEqual(BriefcaseDisplay.getCasePosition(1),
        BriefcaseDisplay.firstCasePosition,
        "Correct position for first case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(4),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(3, 0))),
        "Correct position for fourth case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(5),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(4, 0))),
        "Correct position for fifth case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(6),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(0, -1))),
        "Correct position for sixth case");
    assert.deepEqual(BriefcaseDisplay.getCasePosition(10),
        BriefcaseDisplay.firstCasePosition.getSum(
            BriefcaseDisplay.marginalCasePosition.getProduct(
                new Vector2d(4, -1))),
        "Correct position for tenth case");
});

QUnit.module("canvas-stack.js");

QUnit.test("CanvasStack.prototype.set()", function(assert) {
    // Create artificial environment
    var canvasStack = new CanvasStack();
    canvasStack.add(CANVAS_IDS.MONEY_DISPLAY);

    // The canvas ids added above should be replaced by the canvas ids
    // indicated in the parameter
    assert.deepEqual(canvasStack.set(
        CANVAS_IDS.SPEAKER_QUOTE)._storage.sort(),
        CANVAS_IDS.SPEAKER_QUOTE.sort(),
        "Canvases stored in CanvasStack were replaced by the " +
        "canvases indicated by the parameter; correct returned object");
});

QUnit.test("CanvasStack.prototype.add()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    var idToUse = CANVAS_IDS.TITLE_SCREEN;
    var comparisonArray = [];
    comparisonArray.push(idToUse);
    $("#qunit-fixture").append("<canvas id='" + idToUse + "'></canvas>");

    // Test the addition of one canvas
    assert.deepEqual(canvasStack.add(idToUse)._storage,
        comparisonArray, "A canvas was successfully stored");
    assert.ok($("#" + idToUse).hasClass('show'),
        "CSS class 'show' was added to the canvas");

    // Adjust setup
    var idsToUse = CANVAS_IDS.BRIEFCASE_DISPLAY;
    comparisonArray = comparisonArray.concat(idsToUse);
    for (var i in idsToUse) {
        $("#qunit-fixture").append(
            "<canvas id='" + idsToUse[i] + "'></canvas>");
    }

    // Test the addition of multiple canvases and the use of fade in effect
    assert.deepEqual(canvasStack.add(idsToUse,
        CanvasStack.EFFECTS.FADE_IN)._storage.sort(), comparisonArray.sort(),
        "After, two more canvas were successfully, simultaneously stored");
    var classesAddedToEach = true;
    for (var i in idsToUse) {
        if (($("#" + idsToUse[i]).hasClass('show') === false) ||
            ($("#" + idsToUse[i]).hasClass(
                CanvasStack.EFFECTS.FADE_IN) === false)) {
            classesAddedToEach = false;
            break;
        }
    }
    assert.ok(classesAddedToEach, "The class 'show' and the class " +
        "indicated by CanvasStack.EFFECTS.FADE_IN were added");
});

QUnit.test("CanvasStack.prototype.remove()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    var comparisonArray = [];
    comparisonArray = comparisonArray.concat(CANVAS_IDS.MONEY_DISPLAY);
    comparisonArray.push(CANVAS_IDS.QUOTE_BUBBLE);
    // Create a DOM element for the money display canvases
    for (var i in CANVAS_IDS.MONEY_DISPLAY) {
        $("#qunit-fixture").append(
            "<canvas id='" + CANVAS_IDS.MONEY_DISPLAY[i] + "'></canvas>");
    }
    // add four canvas ids to the sample CanvasStack object;
    // give the fade-in effect to the money display canvases
    canvasStack.add(CANVAS_IDS.MONEY_DISPLAY, CanvasStack.EFFECTS.FADE_IN)
        .add(CANVAS_IDS.QUOTE);

    assert.deepEqual(canvasStack.remove(
        CANVAS_IDS.QUOTE_TEXT)._storage.sort(),
        comparisonArray.sort(),
        "A canvas was successfully removed");

    // Adjust the setup
    comparisonArray = [CANVAS_IDS.QUOTE_BUBBLE];

    assert.deepEqual(canvasStack.remove(
        CANVAS_IDS.MONEY_DISPLAY)._storage.sort(),
        comparisonArray.sort(),
        "After, two canvases were successfully removed");
    var classesRemovedFromEach = true;
    for (var i in CANVAS_IDS.MONEY_DISPLAY) {
        if (($("#" + CANVAS_IDS.MONEY_DISPLAY[i]).hasClass('show') ===
            true) ||
            ($("#" + CANVAS_IDS.MONEY_DISPLAY[i]).hasClass(
                CanvasStack.EFFECTS.FADE_IN) === true)) {
            classesRemovedFromEach = false;
            break;
        }
    }
    assert.ok(classesRemovedFromEach,
        "The class 'show' and the class " +
        "indicated by CanvasStack.EFFECTS.FADE_IN were removed " +
        "from the two indicated canvases");
});

QUnit.test("CanvasStack.prototype.clear()", function(assert) {
    // Set up
    var canvasStack = new CanvasStack();
    canvasStack.add(CANVAS_IDS.BRIEFCASE_DISPLAY);

    // The canvases added above should end up removed
    assert.deepEqual(canvasStack.clear()._storage, [],
        "All stored canvases were removed");
});

QUnit.module("centered-label.js");

QUnit.test("GUI.CenteredLabel()", function(assert) {
    // Test constructor scope safety
    var centeredLabel = GUI.CenteredLabel("teehee", "teehee");
    assert.ok((centeredLabel instanceof GUI.CenteredLabel) &&
        (typeof centeredLabel === "object"),
        "Constructor of CenteredLabel is scope-safe");

    // Test inheritance from GUI.Label
    centeredLabel = new GUI.CenteredLabel("teehee", "teehee");
    assert.ok(GUI.Label.prototype.isPrototypeOf(centeredLabel),
        "CenteredLabel inherits the prototype of Label");
    assert.ok(centeredLabel instanceof GUI.Label,
        "Instance of CenteredLabel is instance of Label");

    // Test constructor stealing
    assert.ok(centeredLabel.hasOwnProperty("fontFace"),
        "CenteredLabel steals Label's constructor in its own");
});

QUnit.module("component.js");

QUnit.test("Component()", function(assert) {
    var exceptionThrown = false;
    try {
        var component = new GUI.Component();
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Constructor is abstract");
});

QUnit.test("Component.prototype.isSelectable()", function(assert) {
    var exceptionThrown = false;
    try {
        var trivialObject = {};
        GUI.Component.prototype.isSelectable.call(trivialObject);
    }
    catch(err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Method is unofficially abstract");
});

QUnit.module("container.js");

QUnit.test("Container()", function(assert) {
    testInheritanceFromComponent(assert, GUI.Container, "Container");
    testConstructorScopeSafety(assert, GUI.Container, "Container");
});

QUnit.test("Container.prototype.pack()", function(assert) {
    // Add two unselectable components, two selectable components, and
    // then a final unselectable component, so that the third component
    // should be selected
    var container = new GUI.Container();
    container.pack(new GUI.Label());
    container.pack(new GUI.Icon());
    container.pack(new GUI.Button());
    container.pack(new GUI.Button());
    container.pack(new GUI.Container());

    assert.deepEqual(container._children.length, 5,
        "Each Component was added");
    assert.ok(container._children[2].isSelected(),
        "Selected correct Component");
    assert.ok(!(container._children[0].isSelected() ||
        container._children[1].isSelected() ||
        container._children[3].isSelected() ||
        container._children[4].isSelected()),
        "Correctly, none of the wrong Components were selected");
});

QUnit.test("GUI.Container.prototype.removeSelectedComponent()",
    function(assert) {
    /*
        Since the selection within the method is done with other
        methods of GUI.Container, it's safe to only use selectable
        components to test
    */

    // Set up a container of four (selectable) buttons
    var container = new GUI.Container();
    var button1 = new GUI.Button();
    button1.text = "button1";
    container.pack(button1);
    var button2 = new GUI.Button();
    button2.text = "button2";
    container.pack(button2);
    var button3 = new GUI.Button();
    button3.text = "button3";
    container.pack(button3);
    var button4 = new GUI.Button();
    button4.text = "button4";
    container.pack(button4);

    // Remove the first component and select the selectable component
    // after it
    container.removeSelectedComponent(true);
    assert.deepEqual(container._children.length,
        3, "A component was removed");
    assert.deepEqual(container._children[container._selectedChild].text,
        "button2", "Appropriate component was selected");

    // Select the last component and remove it so that the first
    // (selectable) component will be selected
    container.selectPrevious(undefined, undefined);
    container.removeSelectedComponent(true);
    assert.deepEqual(container._children.length, 2,
        "Another component was removed");
    // Recall that "button2" is now the name of the "first" button
    assert.deepEqual(container._children[container._selectedChild].text,
        "button2", "Appropriate component was selected");

    // Test that exception is thrown (and the container isn't changed)
    // if shouldSelectNext is neither true nor false
    var exceptionThrown = false;
    try {
        container.removeSelectedComponent();
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.deepEqual(container._children.length, 2,
        "A component isn't removed if invalid first parameter");
    assert.ok(exceptionThrown, "Exception thrown if invalid parameter");

    // Test that no component is selected if first parameter is given
    // false value
    var formerContainerLength = container._children.length;
    container.removeSelectedComponent(false);
    assert.deepEqual(container._children.length, formerContainerLength - 1,
        "A component is removed if first parameter is false");
    assert.deepEqual(container._selectedChild, -1,
        "No component is selected if first parameter is false");
});

QUnit.test("Container.prototype.selectChild()", function(assert) {
    var container = new GUI.Container();
    container.pack(new GUI.Label());
    container.pack(new GUI.Button());
    container.pack(new GUI.Button());

    container.selectChild(0, undefined, undefined);
    assert.ok((container._selectedChild === 1) &&
        (!container._children[0].isSelected()) &&
        container._children[1].isSelected(),
        "Nothing happens if indicated component isn't selectable");
    container.selectChild(2, undefined, undefined);
    assert.ok((container._selectedChild === 2) &&
        (!container._children[1].isSelected()) &&
        container._children[2].isSelected(),
        "Indicated component was successfully selected");
});

QUnit.module("error-handling.js");

QUnit.test("parameterError()", function(assert) {
    assert.deepEqual(parameterError("This is a test"),
        ERROR_MESSAGES.PARAMETER, "Correct value is returned");
});

QUnit.module("game-show-fusion.js");

QUnit.test("getRandomMoneyAmount()", function(assert) {
    var moneyAmounts = [new MoneyAmount(4), new MoneyAmount(80),
        new MoneyAmount(2)];
    var moneyDisplay = new MoneyDisplay("trivialId", "trivialId",
        moneyAmounts);

    assert.deepEqual(typeof getRandomMoneyAmount(moneyAmounts, false),
        "object", "An object was returned when not greying a money bar");
    assert.deepEqual(moneyDisplay._numbersOfBarsToFade.length, 0,
        "Correctly, no bar was given a grey fade");
    assert.deepEqual(typeof getRandomMoneyAmount(
        moneyAmounts, true, moneyDisplay),
        "object", "An object was returned after greying a money bar");
    assert.deepEqual(moneyDisplay._numbersOfBarsToFade.length, 1,
        "Correctly, one bar was given a grey fade");
});

QUnit.test("getHelperAnswer()", function(assert) {
    // Set up fake question and other variables
    var answerIndex = 2;
    var answerNumber = answerIndex + 1;
    var questionSubject = SUBJECTS.MUSIC;
    var otherSubject1 = SUBJECTS.VIDEO_GAMES;
    var otherSubject2 = SUBJECTS.ART;
    var fakeQuestion = new Question(GRADES.THIRD, questionSubject,
        "What grade is Devin Sigley in?",
        new AnswerData(answerIndex, ["a", "b", "c", "d"]),
        new AudienceData(0.25, 0.25, 0.25, 0.25));

    /*
        Confirm that correct answer is given by helper with 100%
        correct rate
    */
    var smartHelper = new Helper("Smart Dude", 1, "...",
        "fakeIconSource", []);
    assert.deepEqual(getHelperAnswer(smartHelper, fakeQuestion),
        answerNumber, "Always correct helper chose correct answer");

    /*
        Confirm that wrong answer is given by helper with 0%
        correct rate
    */
    var stupidHelper = new Helper("Stupid Dude", 0, "...",
        "fakeIconSource", []);
    var stupidHelperAnswer = getHelperAnswer(stupidHelper, fakeQuestion);
    assert.ok(stupidHelperAnswer !== answerNumber,
        "Always wrong helper didn't choose correct answer");
    assert.ok(1 <= stupidHelperAnswer && stupidHelperAnswer <= 4,
        "Always wrong helper's answer number is within correct range");

    /*
        Confirm that correct answer is always given by helper
        who specializes in the question's subject, regardless
        of correct answer rate
    */
    var talentedHelper = new Helper("Talented Dude", 0, "...",
        "fakeIconSource", [otherSubject1, questionSubject, otherSubject2]);
    assert.deepEqual(getHelperAnswer(talentedHelper, fakeQuestion),
        answerNumber, "Correct answer is always given by helper who " +
            "specializes in question's subject");
});

QUnit.test("isCorrectAnswer()", function(assert) {
    var answerIndex = 3;
    var fakeQuestion = new Question(GRADES.FIRST, SUBJECTS.ART,
        "This is a fake question.",
        new AnswerData(answerIndex, ["a", "b", "c", "d"]),
        new AudienceData(0.25, 0.25, 0.25, 0.25));
    assert.deepEqual(isCorrectAnswer(fakeQuestion, 1),
        false, "Wrong answer was detected");
    assert.deepEqual(isCorrectAnswer(fakeQuestion, (answerIndex + 1)),
        true, "Correct answer was detected");
});

QUnit.test("setUpHelpers()", function(assert) {
    gameShow.helpers = [];
    setUpHelpers();

    assert.deepEqual(gameShow.helpers.length, gameShow.NUMBER_OF_HELPERS,
        "Correct number of helpers added to the appropriate array");
    if (gameShow.NUMBER_OF_HELPERS > 0)
        assert.ok(gameShow.helpers[0].getStrengths().length > 0,
            "At least one strength was given to the first helper");
});

QUnit.test("removeAllLifelines()", function(assert) {
    // Set up
    var trivialCanvasId = "foobar";
    $("#qunit-fixture").append("<canvas id='" + trivialCanvasId +
        "' width='300' height='300'></canvas>");
    gameShow.lifelines = new Lifelines(trivialCanvasId, trivialCanvasId);
    gameShow.lifelines.loadCanvases();

    // Call the function and evaluate the result
    removeAllLifelines();
    assert.deepEqual(gameShow.lifelines.container.getNumberOfChildren(),
        1, "All lifeline buttons were removed");
    assert.deepEqual(gameShow.canBeSaved, false,
        "Saving was disallowed");
});

QUnit.module("helper-panel-container.js");

QUnit.test("GUI.HelperPanelContainer()", function(assert) {
    // Test constructor scope safety
    var helperPanelContainer = GUI.HelperPanelContainer(new Helper(
        "Test", .80, "Hi!", "fakeIconSource", []));
    assert.ok((helperPanelContainer instanceof GUI.HelperPanelContainer) &&
        (typeof helperPanelContainer === "object"),
        "Constructor of HelperPanelContainer is scope-safe");

    // Test inheritance from GUI.Container
    helperPanelContainer = new GUI.HelperPanelContainer(new Helper(
        "Test", .80, "Hi!", "fakeIconSource", []));
    assert.ok(GUI.Container.prototype.isPrototypeOf(helperPanelContainer),
        "HelperPanelContainer inherits the prototype of Container");
    assert.ok(helperPanelContainer instanceof GUI.Container,
        "Instance of HelperPanelContainer is instance of Container");

    // Test constructor stealing
    assert.ok(helperPanelContainer.hasOwnProperty("_children"),
        "HelperPanelContainer steals Container's constructor in its own");

    /*
        Test that the constructor stored the data about the given helper
        the way it was supposed to
    */
    var helperName = "Fake Man";
    var defaultCorrectRate = 0.75;
    var arrayOfStrengths = [SUBJECTS.ART, SUBJECTS.MAIN_CHARACTERS];
    helperPanelContainer = new GUI.HelperPanelContainer(new Helper(
        helperName, defaultCorrectRate, "Hi!",
        "fakeIconSource", arrayOfStrengths));
    assert.deepEqual(helperPanelContainer._children[
        GUI.HelperPanelContainer.buttonWithNameIndex].text, helperName,
        "Helper's name was stored appropriately as first child");
    assert.deepEqual(helperPanelContainer._children[
        GUI.HelperPanelContainer.strengthsTitleLabelIndex + 1].text,
        SUBJECTS.ART, "Helper's first strength was properly stored");
    assert.deepEqual(helperPanelContainer._children[
        GUI.HelperPanelContainer.strengthsTitleLabelIndex + 2].text,
        SUBJECTS.MAIN_CHARACTERS,
        "Helper's second strength was properly stored");
});

QUnit.test("GUI.HelperPanelContainer.prototype.select()", function(assert) {
    /*
        Test if exception is thrown if container's first child isn't
        a button
    */
    // Create an instance to test and modify it in an illegal way
    var helperPanelContainer = new GUI.HelperPanelContainer(new Helper(
        "Test", .80, "Hi!", "fakeIconSource", []));
    // Don't do this:
    helperPanelContainer._children[
        GUI.HelperPanelContainer.buttonWithNameIndex] =
        new GUI.Label(undefined, undefined);
    // Test
    var exceptionWasThrown = false;
    try {
        helperPanelContainer.select();
    }
    catch (err) {
        exceptionWasThrown = true;
    }
    assert.ok(exceptionWasThrown, "Exception is thrown if container's " +
        "first child isn't instance of Button");
});

QUnit.test("GUI.HelperPanelContainer.prototype.deselect()",
    function(assert) {
    /*
        Test if exception is thrown if container's first child isn't
        a button
    */
    // Create an instance to test and modify it in an illegal way
    var helperPanelContainer = new GUI.HelperPanelContainer(new Helper(
        "Test", .80, "Hi!", "fakeIconSource", []));
    // Don't do this:
    helperPanelContainer._children[
        GUI.HelperPanelContainer.buttonWithNameIndex] =
        new GUI.Label(undefined, undefined);
    // Test
    var exceptionWasThrown = false;
    try {
        helperPanelContainer.deselect();
    }
    catch (err) {
        exceptionWasThrown = true;
    }
    assert.ok(exceptionWasThrown, "Exception is thrown if container's " +
        "first child isn't instance of Button");
});

QUnit.test("GUI.HelperPanelContainer.prototype.activate()",
    function(assert) {
    /*
        Test if exception is thrown if container's first child isn't
        a button
    */
    // Create an instance to test and modify it in an illegal way
    var helperPanelContainer = new GUI.HelperPanelContainer(new Helper(
        "Test", .80, "Hi!", "fakeIconSource", []));
    // Don't do this:
    helperPanelContainer._children[
        GUI.HelperPanelContainer.buttonWithNameIndex] =
        new GUI.Label(undefined, undefined);
    // Test
    var exceptionWasThrown = false;
    try {
        helperPanelContainer.activate();
    }
    catch (err) {
        exceptionWasThrown = true;
    }
    assert.ok(exceptionWasThrown, "Exception is thrown if container's " +
        "first child isn't instance of Button");
});

QUnit.test("GUI.HelperPanelContainer.prototype.setPosition()",
    function(assert) {
    // Set up
    var helperName = "Fake Man";
    var defaultCorrectRate = 0.75;
    var arrayOfStrengths = [SUBJECTS.ART, SUBJECTS.MAIN_CHARACTERS];
    var helperPanelContainer = new GUI.HelperPanelContainer(new Helper(
        helperName, defaultCorrectRate, "Hi!",
        "fakeIconSource", arrayOfStrengths));

    // Change the container's position
    var deltaX = 80;
    var deltaY = 250;
    helperPanelContainer.setPosition(deltaX, deltaY);

    // Test the position of its first label
    assert.deepEqual(helperPanelContainer._children[
        GUI.HelperPanelContainer.strengthsTitleLabelIndex].getPosition(),
        { x : deltaX,
            y : (deltaY +
                GUI.HelperPanelContainer.distanceBetweenButtonAndIcon +
                GUI.HelperPanelContainer.distanceBetweenIconAndStrengths)},
        "Children's positions were correctly adjused");
});

QUnit.module("icon.js");

QUnit.test("Icon()", function(assert) {
    testInheritanceFromComponent(assert, GUI.Icon, "Icon");
    testConstructorScopeSafety(assert, GUI.Icon, "Icon");
});

QUnit.module("label.js");

QUnit.test("Label()", function(assert) {
    testInheritanceFromComponent(assert, GUI.Label, "Label");
    testConstructorScopeSafety(assert, GUI.Label, "Label");
});

QUnit.test("Label.text", function(assert) {
    var label = new GUI.Label("123", "trivial");
    assert.deepEqual(label.text, "123", "Getter for \"_text\" works");
});

QUnit.test("Other aspects of Label", function(assert) {
    var label = new GUI.Label("original", "trivial");
    label._text = "changed";
    assert.deepEqual(label.text, "original",
        "The \"_text\" member of custom type Label is private");
});

QUnit.module("lifelines.js");

QUnit.test("Lifelines.prototype._setUpContainer()", function(assert) {
    // Indirectly call the method-to-test
    var lifelines = new Lifelines(undefined, undefined);

    // Activate the Ask the Audience button and confirm that
    // this.mostRecentlyActivatedButton was given the correct value;
    // assume that that button is the third component in the container
    lifelines.container._children[2].activate();
    assert.deepEqual(lifelines.mostRecentlyActivatedButton,
        LIFELINES.ASK_AUDIENCE, "Buttons are given callbacks that " +
        "edit lifelines.mostRecentlyActivatedButton");
});

QUnit.module("lifeline-button.js");

QUnit.test("GUI.LifelineButton()", function(assert) {
    // Test constructor scope safety
    var lifelineButton = GUI.LifelineButton("Arial", 30, 100, 100);
    assert.ok((lifelineButton instanceof GUI.LifelineButton) &&
        (typeof lifelineButton === "object"),
        "Constructor of LifelineButton is scope-safe");

    // Test inheritance from GUI.Button
    lifelineButton = new GUI.LifelineButton("Arial", 30, 100, 100);
    assert.ok(GUI.Button.prototype.isPrototypeOf(lifelineButton),
        "LifelineButton inherits the prototype of Button");
    assert.ok(lifelineButton instanceof GUI.Button,
        "Instance of LifelineButton is instance of Button");

    // Test constructor stealing
    assert.ok(lifelineButton.hasOwnProperty("_callback"),
        "LifelineButton steals Button's constructor in its own");
});

QUnit.module("money-amount.js");

QUnit.test("MoneyAmount.prototype.asNumber()", function(assert) {
    var moneyAmount = new MoneyAmount(35000);
    assert.deepEqual(moneyAmount.asNumber(), 35000,
        "Correctly formatted value returned");
    moneyAmount = new MoneyAmount(0.01);
    assert.deepEqual(moneyAmount.asNumber(), 0.01,
        "Correctly formatted value returned");
});

QUnit.test("MoneyAmount.prototype.asString()", function(assert) {
    var moneyAmount = new MoneyAmount(35000);
    assert.deepEqual(moneyAmount.asString(), "35,000",
        "Correctly formatted value returned");
    moneyAmount = new MoneyAmount(0.01);
    assert.deepEqual(moneyAmount.asString(), "0.01",
        "Correctly formatted value returned");
});

QUnit.test("MoneyAmount._removeCommaFromStringNumber()", function(assert) {
    assert.deepEqual(MoneyAmount._removeCommaFromStringNumber("15,000.01"),
        "15000.01", "Given value was correctly modified and returned");
});

QUnit.test("MoneyAmount._putCommasInStringNumber()", function(assert) {
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("0.01"), "0.01",
        "Appropriately, no commas were inserted");
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("400"), "400",
        "Appropriately, no commas were inserted");
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("400.00"), "400.00",
        "Appropriately, no commas were inserted");
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("20000.00"),
        "20,000.00", "Appropriately, one comma was inserted");
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("35000"), "35,000",
        "Appropriately, one comma was inserted");
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("250000.00"),
        "250,000.00", "Appropriately, one comma was inserted");
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("1000000.3567"),
        "1,000,000.3567", "Appropriately, two commas were inserted");
    assert.deepEqual(MoneyAmount._putCommasInStringNumber("1000000"),
        "1,000,000", "Appropriately, two commas were inserted");
});

QUnit.module("money-display.js");

QUnit.test("MoneyDisplay.prototype.getBarIndex()", function(assert) {
    var moneyDisplay = new MoneyDisplay("trivialId", "trivialId",
        [new MoneyAmount(500), new MoneyAmount(0.01), new MoneyAmount(1000)]);
    assert.deepEqual(moneyDisplay.getBarIndex(new MoneyAmount(500)), 0,
        "Index of first bar returned");
    assert.deepEqual(moneyDisplay.getBarIndex(new MoneyAmount(0.01)), 1,
        "Index of second bar returned");
    assert.deepEqual(moneyDisplay.getBarIndex(new MoneyAmount(1000)), 2,
        "Index of third bar returned");
    assert.deepEqual(moneyDisplay.getBarIndex(new MoneyAmount(100)), -1,
        "-1 returned if appropriate bar not found");
    assert.deepEqual(moneyDisplay.getBarIndex(new MoneyAmount(500000)), -1,
        "-1 returned if appropriate bar not found");
});

QUnit.test("MoneyDisplay.getBarPosition()", function(assert) {
    assert.deepEqual(MoneyDisplay.getBarPosition(1),
        MoneyDisplay.firstBarPosition,
        "Correct position for first bar");
    assert.deepEqual(MoneyDisplay.getBarPosition(4),
        MoneyDisplay.firstBarPosition.getSum(
            MoneyDisplay.marginalBarPosition.getProduct(
                new Vector2d(0, 3))),
        "Correct position for fourth bar");
    assert.deepEqual(MoneyDisplay.getBarPosition(5),
        MoneyDisplay.firstBarPosition.getSum(
            MoneyDisplay.marginalBarPosition.getProduct(
                new Vector2d(0, 4))),
        "Correct position for fifth bar");
    assert.deepEqual(MoneyDisplay.getBarPosition(6),
        MoneyDisplay.firstBarPosition.getSum(
            MoneyDisplay.marginalBarPosition.getProduct(
                new Vector2d(1, 0))),
        "Correct position for sixth bar");
    assert.deepEqual(MoneyDisplay.getBarPosition(10),
        MoneyDisplay.firstBarPosition.getSum(
            MoneyDisplay.marginalBarPosition.getProduct(
                new Vector2d(1, 4))),
        "Correct position for tenth bar");
});

QUnit.module("question.js");

QUnit.test("Question()", function(assert) {
    /*
        Confirm exception thrown if invalid grade
    */
    var question = null;
    var exceptionThrown = false;
    try {
        question = new Question("fakeGrade", SUBJECTS.ART,
            "What grade is Devin Sigley in?",
            new AnswerData(2, ["yolo", "swag", "meh", "5"]),
            new AudienceData(0.25, 0.25, 0.25, 0.25));
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if invalid grade");

    /*
        Confirm exception thrown if invalid subject
    */
    exceptionThrown = false;
    try {
        question = new Question(GRADES.SECOND, "fakeSubject",
            "What grade is Devin Sigley in?",
            new AnswerData(2, ["yolo", "swag", "meh", "5"]),
            new AudienceData(0.25, 0.25, 0.25, 0.25));
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if invalid subject");

    /*
        Confirm exception thrown if answerData given to constructor
        isn't of type AnswerData
    */
    exceptionThrown = false;
    try {
        question = new Question(GRADES.SECOND, SUBJECTS.MAIN_CHARACTERS,
            "What grade is Devin Sigley in?",
            new AudienceData(0.25, 0.25, 0.25, 0.25),
            new AudienceData(0.25, 0.25, 0.25, 0.25));
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if not given " +
        "instance of AnswerData");

    /*
        Confirm exception thrown if audienceData given to constructor
        isn't of type AudienceData
    */
    exceptionThrown = false;
    try {
        question = new Question(GRADES.SECOND, SUBJECTS.MAIN_CHARACTERS,
            "What grade is Devin Sigley in?",
            new AnswerData(2, ["yolo", "swag", "meh", "5"]),
            new AnswerData(2, ["yolo", "swag", "meh", "5"]));
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if not given " +
        "instance of AudienceData");

    /*
        Confirm no exception thrown if undefined audienceData for
        a million dollar question
    */
    var noExceptionThrown = true;
    try {
        // Note that no AudienceData instance is given
        question = new Question(GRADES.MILLION, SUBJECTS.MUSIC,
            "What grade is Devin Sigley in?",
            new AnswerData(2, ["yolo", "swag", "meh", "5"]));
    }
    catch (err) {
        noExceptionThrown = false;
    }
    assert.ok(noExceptionThrown, "Exception is NOT thrown if million " +
        "dollar question isn't given " +
        "instance of AudienceData");
});

QUnit.test("AnswerData()", function(assert) {
    // Confirm exception thrown if correctIndex is in wrong range
    var answerData = null;
    var exceptionThrown = false;
    try {
        answerData = new AnswerData(4, ["", "", "", ""]);
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if correctIndex not in " +
        "correct range");

    // Confirm exception thrown if invalidly-sized arrayOfAnswers
    var exceptionThrown = false;
    try {
        answerData = new AnswerData(2, ["", "", ""]);
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if wrong number of " +
        "answers given");
});

QUnit.test("AudienceData()", function(assert) {
    // Confirm exception is thrown if four percentages in given audience
    // data don't add up to 1
    var audienceData = null;
    var exceptionThrown = false;
    try {
        // Note that the given four percentages add up to 0.99, not 1
        audienceData = new AudienceData(0.25, 0.25, 0.24, 0.25);
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if four percentages " +
        "given to constructor don't add up to 1");

    // Confirm exception thrown if any of the four percentages given
    // to constructor aren't in range [0, 1]
    exceptionThrown = false;
    try {
        // Given percentages must still add up to 1 to prevent
        // triggering the exception that is triggered otherwise
        audienceData = new AudienceData(0, 1.01, -0.01, 0);
    }
    catch (err) {
        exceptionThrown = true;
    }
    assert.ok(exceptionThrown, "Exception thrown if any of the percentages " +
        "aren't in range [0, 1]");
});

QUnit.module("questions.js");

QUnit.test("Questions.prototype._generateTenQuestions()", function(assert) {
    // Note that this test's effectiveness is slightly up to chance.

    // the constructor calls the tested function, so testing
    // can already be done
    var questionsObject = new Questions();
    var questions = questionsObject._tenQuestions;

    QUnit.deepEqual(questions.length, 10,
        "Ten instances of type Question were generated.");

    // Make an array for only the ten questions' subject matters
    // so that indexOf() and lastIndexOf() can be used more easily
    var subjects = [];
    for (var i = 0; i < questions.length; ++i)
        subjects.push(questions[i].subject);
    // Confirm that each of the ten stored questions has a different
    // subject matter
    var uniqueSubjectMatters = true;
    for (var i = 0; i < subjects.length - 1; ++i) {
        if (subjects.indexOf(subjects[i]) !==
            subjects.lastIndexOf(subjects[i]))
        {
            // The subject matter must be present in more than one
            // part of the array if its first appearance and last
            // appearance (index-wise) in the array are not the same
            uniqueSubjectMatters = false;

            // Escape because failed test
            break;
        }
    }
    QUnit.ok(uniqueSubjectMatters, "Each of the ten stored questions " +
        "has a different subject matter.");

    // Confirm that every two of the ten is attached to a unique
    // grade level from first to fifth; this also checks
    // that the questions are sorted by grade level
    var passingTest = true;
    var grade = GRADES.FIRST;
    for (var i = 0; i < questions.length; ++i) {
        if (questions[i].grade !== grade) {
            // Failed test; escape loop
            passingTest = false;
            break;
        }

        // Increase the grade level if two questions have been
        // compared to this grade level already; note that the
        // following works because the GRADES constants have
        // numerical values
        if (i % 2 === 1)
            grade += 1;
    }
    QUnit.ok(passingTest, "Every two of the ten questions " +
        "corresponds to a grade level going up from first to fifth, " +
        "and the questions are sorted by grade level, with the first " +
        "grade questions having the lowest index in the array of questions.");
});

QUnit.test("Questions.prototype._setMillionDollarQuestion()",
    function(assert) {
    // the constructor calls the tested function, so testing
    // can already be done
    var questionsObject = new Questions();
    var question = questionsObject._millionDollarQuestion;

    assert.deepEqual(question.grade, GRADES.MILLION,
        "A million dollar question of the correct grade was picked");
});

/*
    @returns instance of Questions with the ids of a trivial
    canvas and with emphasis on the label indicated by
    numberOfLabelToEmphasize
*/
function getArtificialQuestionsInstance(numberOfLabelToEmphasize) {
    // Create trivial canvas to satisfy the constructor of Questions
    var canvasId = "junkCanvas";
    $("#qunit-fixture").append("<canvas id='" + canvasId + "'></canvas>");
    return new Questions(canvasId, canvasId,
        numberOfLabelToEmphasize, canvasId, canvasId);
}

QUnit.test("Questions.prototype._getNumberOfLeftwardLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(4);

    assert.deepEqual(questions._getNumberOfLeftwardLabelToEmphasize(),
        3, "Correct number is returned for label to the left " +
        "of currently emphasized label");
    questions.setAnswered(3);
    assert.deepEqual(questions._getNumberOfLeftwardLabelToEmphasize(),
        undefined, "No label is suggested if label to the left " +
        "of currently emphasized label is of an answered question");
    questions.setEmphasizedLabel(7);
    assert.deepEqual(questions._getNumberOfLeftwardLabelToEmphasize(),
        undefined, "No label is suggested if a label on the left " +
        "is already emphasized");
});

QUnit.test("Questions.prototype._getNumberOfRightwardLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(3);

    assert.deepEqual(questions._getNumberOfRightwardLabelToEmphasize(),
        4, "Correct number is returned for label to the right " +
        "of currently emphasized label");
    questions.setAnswered(4);
    assert.deepEqual(questions._getNumberOfRightwardLabelToEmphasize(),
        undefined, "No label is suggested if label to the right " +
        "of currently emphasized label is of an answered question");
    questions.setEmphasizedLabel(8);
    assert.deepEqual(questions._getNumberOfRightwardLabelToEmphasize(),
        undefined, "No label is suggested if a label on the right " +
        "is already emphasized");
});

QUnit.test("Questions.prototype._getNumberOfLowerLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(6);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 4,
        "Correctly picked the number of the label immediately below " +
        "the currently emphasized one");

    questions.setEmphasizedLabel(9);
    questions.setAnswered(7);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 8,
        "Correctly picked the label down and to the right " +
        "because the one below was of an answered question");

    questions.setAnswered(8);
    questions.setAnswered(5);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 6,
        "With the 9th label emphasized, picked the 6th one " +
        "because the 7th, 8th, and 5th ones were of answered questions");

    var questions = getArtificialQuestionsInstance(10);
    questions.setAnswered(8);
    questions.setAnswered(7);
    questions.setAnswered(6);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(), 5,
        "With the 10th label emphasized, picked the 5th one " +
        "because the 8th, 7th, and 6th ones were of answered questions");

    questions.setEmphasizedLabel(2);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(),
        undefined, "undefined is returned if a lowest label " +
        "is already emphasized");

    var questions = getArtificialQuestionsInstance(6);
    questions.setAnswered(4);
    questions.setAnswered(3);
    questions.setAnswered(2);
    questions.setAnswered(1);
    assert.deepEqual(questions._getNumberOfLowerLabelToEmphasize(),
        undefined, "undefined is returned if all of the labels " +
            "below the emphasized one are of answered questions");
});

QUnit.test("Questions.prototype._getNumberOfHigherLabelToEmphasize()",
    function(assert)
{
    var questions = getArtificialQuestionsInstance(6);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 8,
        "Correctly picked the number of the label immediately above " +
        "the currently emphasized one");

    questions.setEmphasizedLabel(1);
    questions.setAnswered(3);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 4,
        "Correctly picked the label up and to the right " +
        "because the one above was of an answered question");

    questions.setAnswered(4);
    questions.setAnswered(5);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 6,
        "With the 1st label emphasized, picked the 6th one " +
        "because the 3rd, 4th, and 5th ones were of answered questions");

    var questions = getArtificialQuestionsInstance(2);
    questions.setAnswered(4);
    questions.setAnswered(3);
    questions.setAnswered(6);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(), 5,
        "With the 2nd label emphasized, picked the 5th one " +
        "because the 4th, 3rd, and 6th ones were of answered questions");

    questions.setEmphasizedLabel(9);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(),
        undefined, "undefined is returned if a highest label " +
        "is already emphasized");

    var questions = getArtificialQuestionsInstance(6);
    questions.setAnswered(8);
    questions.setAnswered(7);
    questions.setAnswered(10);
    questions.setAnswered(9);
    assert.deepEqual(questions._getNumberOfHigherLabelToEmphasize(),
        undefined, "undefined is returned if all of the labels " +
            "above the emphasized one are of answered questions");
});

QUnit.test("Questions._getAnswerPosition()", function(assert) {
    assert.deepEqual(Questions._getAnswerPosition(1),
        Questions.FIRST_ANSWER_POSITION,
        "Correct position for first answer");
    assert.deepEqual(Questions._getAnswerPosition(4),
        Questions.FIRST_ANSWER_POSITION.getSum(
            Questions.MARGINAL_ANSWER_POSITION.getProduct(
                new Vector2d(0, 3))),
        "Correct position for fourth answer");
});

QUnit.test("Questions._getLabelPosition()", function(assert) {
    assert.deepEqual(Questions._getLabelPosition(1),
        Questions.FIRST_LABEL_POSITION,
        "Correct position for first label");
    assert.deepEqual(Questions._getLabelPosition(4),
        Questions.FIRST_LABEL_POSITION.getSum(
            Questions.MARGINAL_LABEL_POSITION.getProduct(
                new Vector2d(1, -1))),
        "Correct position for fourth label");
    assert.deepEqual(Questions._getLabelPosition(5),
        Questions.FIRST_LABEL_POSITION.getSum(
            Questions.MARGINAL_LABEL_POSITION.getProduct(
                new Vector2d(0, -2))),
        "Correct position for fifth label");
    assert.deepEqual(Questions._getLabelPosition(10),
        Questions.FIRST_LABEL_POSITION.getSum(
            Questions.MARGINAL_LABEL_POSITION.getProduct(
                new Vector2d(1, -4))),
        "Correct position for tenth label");
});

QUnit.test("Questions.getEntireSupplyOfQuestions()", function(assert) {
    var questions = Questions.getEntireSupplyOfQuestions();

    // Decide how well the question fits; checking characters
    // suffices; a question of at most 125 characters should
    // very well fit in its designated space, given the font used
    var allQuestionsFit = true;
    for (var i = 0; i < questions.length; ++i) {
        if (questions[i].text.length > 125) {
            allQuestionsFit = false;
            break;
        }
    }

    assert.ok(allQuestionsFit, "All questions would fit in " +
        "their designated area");

    // Decide how well the answers fit
    var allAnswersFit = true;
    var canvasId = "junkCanvas";
    $("#qunit-fixture").append("<canvas id='" + canvasId + "' " +
        "width='1000' height='1000'></canvas>");
    var ctx = document.getElementById(canvasId).getContext('2d');
    Questions.setUpAnswersTextContext(ctx);
    for (var i = 0; (i < questions.length && allAnswersFit); ++i) {
        var arrayOfAnswers = questions[i].answerData.arrayOfAnswers;
        for (var j = 0; j < arrayOfAnswers.length; ++j) {
            var text = Questions.getAnswerLetter(j + 1) + arrayOfAnswers[j];

            if ((Questions.ANSWER_TEXT_INDENT + ctx.measureText(text).width) >
                Questions.ANSWER_DIMENSIONS.x)
            {
                allAnswersFit = false;
                break;
            }
        }
    }

    assert.ok(allAnswersFit, "All answers would fit in an " +
        "answer rectangle with the usually used context settings");
});

QUnit.module("vector2d.js");

QUnit.test("Vector2d.prototype.getSum()", function(assert) {
    var v = new Vector2d(20, 30);
    assert.deepEqual(v.getSum(new Vector2d(40, 40)),
        new Vector2d(60, 70),
        "Function successfully returns the correct " +
        "sum as a Vector2d object");
});

QUnit.test("Vector2d.prototype.getProduct()", function(assert) {
    var v = new Vector2d(70, 80);
    assert.deepEqual(v.getProduct(new Vector2d(3, 2)),
        new Vector2d(210, 160),
        "Function successfully returns the correct " +
        "product as a Vector2d object");
});