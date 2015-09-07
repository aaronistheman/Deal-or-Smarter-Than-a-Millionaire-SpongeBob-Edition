# Deal-or-Smarter-Than-a-Millionaire-SpongeBob-Edition

About
-----

This is the web version of the SpongeBob edition of a fusion of
"Deal or No Deal", "Are You Smarter Than a Fifth Grader", and
"Who Wants to Be a Millionaire".
Besides the images, audio, and borrowed software, this game is
entirely be my work.

Regarding languages, I used HTML5, CSS, and JavaScript.

Regarding libraries, I used jQuery, AngularJS, and QUnit. The former
two libraries are included through CDNs (Content Delivery Networks),
whereas the latter library's two files are included in the repository.

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

Use of Git Hooks
----------------

To prevent trailing whitespace, I've enabled the pre-commit Git hook.
However, this change can't be saved in the repository. To make this
change, navigate to the directory .git/hooks, and rename "pre-commit.sample"
to "pre-commit".

Acknowledgements
----------------

The seamless, background texture is from www.mb3d.co.uk.

The image of SpongeBob is from www.wikihow.com.

The audio was made with Bfxr.