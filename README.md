# Deal-or-Smarter-Than-a-Millionaire-SpongeBob-Edition

About
-----

This is the web version of the SpongeBob edition of a fusion of
"Deal or No Deal", "Are You Smarter Than a Fifth Grader", and
"Who Wants to Be a Millionaire".

Regarding languages, I used HTML5, CSS, and JavaScript.

Regarding libraries, I used jQuery, AngularJS, and QUnit. The former
two libraries are included through CDNs (Content Delivery Networks),
whereas the latter library's two files are included in the repository.

Features
--------

In this program, I greatly focused on using JavaScript object
prototypes.

The host, SpongeBob, explains the rules at the start of the game.
Furthermore, he tells the user how to skip his explanation.

The game includes many of the characteristics of the three game
shows that inspired it. Many examples follow.
Each question has a monetary value.
The user chooses whether or not to accept a deal from the
banker.
The user has four sources of help ("lifelines" and "cheats")
and can choose from five
helpers, all of which are characters from the television show
"SpongeBob Squarepants".
The user chooses among ten questions of various
difficulties and subjects.
The user, should he answer the first ten questions, can attempt
to answer a "million dollar question", or he can take
his case home.

Anything SpongeBob or any of the helpers say is displayed in a
quote bubble.

The game manages what the user sees with a "canvas stack" (based
on the idea of a state stack) that can be used to manage which
of multiple canvases the user sees. Often, the canvas stack is
used to show the user multiple canvases at once (e.g. one with
text and one with graphics).

Sound effects and background music appropriately play. The
background tracks are from the soundtracks of "Deal or No Deal"
and "Who Wants to Be a Millionaire".

Canvases and audio elements are generated with AngularJS.

How to Run the Game
-------------------

Run index.html on any browser that supports the html audio element and
mp3 files. I've confirmed that the game works on modern versions of
Chrome, Internet Explorer, Firefox, and Opera. It doesn't work on
the most recent version of Safari (that I could find: 5.1.7) for Windows.

How to Run Unit Tests
---------------------

Run unit-tests.html. According to the QUnit website, the following
browsers support unit testing with QUnit:
"IE6+ and Current - 1 for Chrome, Firefox, Safari and Opera."
Thus, a modern version of a major browser should work.

Use of Git Hooks
----------------

To prevent trailing whitespace, I've enabled the pre-commit Git hook.
However, this change can't be saved in the repository. To make this
change, navigate to the directory .git/hooks, and rename "pre-commit.sample"
to "pre-commit".

Acknowledgements
----------------

I made the background of many of the images transparent with the
website at www.online-image-editor.com.

I made the sound effects with Bfxr.

Author
------

That is me, Aaron Kaloti.

Contact Information
-------------------

My email address: aarons.7007@gmail.com

My YouTube channel (in which I demonstrate my finished applications):
https://www.youtube.com/channel/UCHhcIcXErjijtAI9TWy7wNw/videos