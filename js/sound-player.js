"use strict";

/*
    Authors of original (C++, SFML-supporting) version:
        Artur Moreira, Henrik Vogelius Hansson, and Jan Haller
    Translated (from C++, SFML-supporting version to
        JavaScript, canvas-supporting version) by: Aaron Kaloti
    Release number: 0.1
*/

function SoundPlayer() {
    // Storage of the html elements of the sound effects;
    // each element will be mapped to its id
    this._soundEffects = {};
}

/*
    @pre webpage (esp. audio elements) is ready
*/
SoundPlayer.prototype.storeElements = function() {
    this._storeSoundEffectsElements();
}

/*
    @pre for each id in SOUND_EFFECTS_IDS, there is an html
    audio element that has that id
    @post each html audio element that has a sound effect has
    been stored
*/
SoundPlayer.prototype._storeSoundEffectsElements = function() {
    for (var i in SOUND_EFFECTS_IDS) {
        var id = SOUND_EFFECTS_IDS[i];
        this._soundEffects[id] = document.getElementById(id);
    }
}

/*
    @pre id is a constant in global variable SOUND_EFFECTS_IDS;
    audio elements have been stored
    @param id of the html element of the audio to play
    @post the sound effect indicated by the parameter has been
    played
*/
SoundPlayer.prototype.play = function(id) {
    this._soundEffects[id].play();
}