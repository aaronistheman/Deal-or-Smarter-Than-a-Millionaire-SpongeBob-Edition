"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

function MusicPlayer() {
    this._current = undefined;

    // Storage of the html elements of the music; each element
    // is mapped to its id
    this._music = {};
}

/*
    @pre webpage (esp. audio elements) is ready
*/
MusicPlayer.prototype.storeElements = function() {
    this._storeMusicElements();
}

/*
    @post each html audio element that has music has been
    stored
*/
MusicPlayer.prototype._storeMusicElements = function() {
    for (var i in MUSIC_IDS) {
        var id = MUSIC_IDS[i];
        this._music[id] = document.getElementById(id);
    }
}

/*
    @pre id is a constant in global variable MUSIC_IDS;
    audio elements have been stored
    @param id of the html element of the audio to play
    @post the currently playing track has been stopped;
    the track indicated by id has been played
*/
MusicPlayer.prototype.play = function(id) {
    this.stop();

    // Play the new track
    this._current = this._music[id];
    this._current.play();
}

/*
    @post the currently playing track has been stopped
*/
MusicPlayer.prototype.stop = function() {
    if (this._current !== undefined) {
        this._current.pause();
        this._current.currentTime = 0;
    }
}

/*
    @post the current music has been either played or paused,
    depending on the parameter
    @param paused true to pause; false to play
*/
MusicPlayer.prototype.setPaused = function(paused) {
    if (paused)
        this._current.pause();
    else
        this._current.play();
}