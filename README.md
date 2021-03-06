# Deal-or-Smarter-Than-a-Millionaire-SpongeBob-Edition

About
-----

This is the web version of the SpongeBob edition of a fusion of
"Deal or No Deal", "Are You Smarter Than a Fifth Grader", and
"Who Wants to Be a Millionaire". (Note that none of "SpongeBob Squarepants,"
"Deal or No Deal," "Are You Smarter Than a Fifth Grader," or "Who
Wants to Be a Millionaire" are owned by me.) This "game show fusion"
is my original idea, and I started coding from scratch (with the help of
many resources, of course).

I programmed this during the months September, October, and November
of 2015, mostly while the fall quarter of my freshman year in college
occured.

Regarding languages, I used HTML5, CSS, and JavaScript.

Regarding libraries, I used jQuery, AngularJS, and QUnit. The former
two libraries are included through CDNs (Content Delivery Networks),
whereas the latter library's two files are included in the repository.

The following YouTube video contains a demonstration:
https://www.youtube.com/watch?v=I0Gk82HD09I

Features
--------

In this program, I greatly focused on using JavaScript custom types.
I did not do so perfectly, but I did try. I do not think I consistently
decoupled custom types well, but I mostly focused on OOP and the DRY
principle.

The host, SpongeBob, explains the rules at the start of the game.
Furthermore, he tells the user how to skip his explanation.

The game includes many of the characteristics of the three game
shows that inspired it. Many examples follow.
Each question has a monetary value.
The user chooses whether or not to accept a deal from the
banker.
The user has four sources of help ("lifelines")--"Peek",
"Ask the Audience," "Phone a Friend," and "Save"--and can choose from five
helpers before every two questions.
All helpers are characters from the television show
"SpongeBob Squarepants".
The user chooses the order in which he/she answers ten questions of various
difficulties and subjects.
The user, should he correctly answer the first ten questions, can attempt
to answer a "million dollar question", or he can take
his case home.

Currently, the game has 88 questions and 20 subjects. The game has
six possible endings.

Anything SpongeBob or any of the helpers say is displayed in a
quote bubble. The chaining of quotes is handled by an object
that stores the quotes-to-draw until it's told to
"deploy the quote chain."

The game manages what the user sees with a "canvas stack" (based
on the idea of a state stack) that can be used to manage which
of multiple canvases the user sees. Often, the canvas stack is
used to show the user multiple canvases at once (e.g. one with
text and one with graphics).

I used custom types to handle the displaying of various things (e.g.
a type BriefcaseDisplay to handle the displaying of the briefcases).

Sound effects and background music appropriately play. The
background tracks are from the soundtracks of "Deal or No Deal"
and "Who Wants to Be a Millionaire" (I did not much like the soundtrack
of "Are You Smarter Than a Fifth Grader.").
The background music becomes more dramatic as the user answers more
questions.
The possibly famous "the banker is calling" music plays when the banker
calls.

Canvases and audio elements are generated with AngularJS.

Preloading occurs for the images in the title screen. As this preloading
occurs, a loading screen is shown. (However, usually, this loading screen
shows for about a quarter of a second.)

Releases
--------

The latest release is: v0.1

Please see the releases section under this repository on GitHub
to download the latest release.

How to Run the Game
-------------------

Run index.html on any browser that supports the HTML audio and canvas
elements and mp3 files.

I've confirmed that the game works on modern versions of
Chrome, Internet Explorer, Firefox, and Opera.

The game works
best on Chrome, probably because I always tested it with Chrome. The
game seems to work just as well on Opera.

On Internet Explorer, some sound effects don't play at all, and I
don't know why. I had assumed they would all work, since W3Schools
says that Internet Explorer supports mp3 files. However, the sound
effects that do play do so more on time than they do on Firefox.

On Firefox, the sound effects are sometimes a little bit awkward in
timing,
and any text drawn on the canvases isn't as precisely positioned
as it is when the game is run with Chrome.

It doesn't work on
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

The book "HTML5 Games Development by Example" by Makzan provided me
with an introduction to canvas-based web games.

The book "HTML5 Canvas Cookbook" by Eric Rowell helped me learn
many things about the HTML5 canvas API.

The book "The Principles of Object-Oriented JavaScript" by Nicholas C.
Zakas helped me greatly as I wrote the object-oriented GUI custom
types.

The book "SFML Game Development" by Artur Moreira, Henrik Vogelius
Hansson, and Jan Haller indirectly helped me by providing me
with C++ versions of those aforementioned GUI custom types and of the
custom types MusicPlayer and SoundPlayer.

The book "jQuery Game Development Essentials" by Selim Arsever
taught me a few things
that I applied to this game, such as image preloading.

The first few chapters of the book "Pro Git" by Scott Chacon and
Ben Straub taught me how to use Git Bash, which proved convenient
as I wrote this application.

The book "The Pragmatic Programmer" by Andy Hunt and Dave Thomas helped
me make better decisions with this program.

I made the background of many of the images transparent with the
website at www.online-image-editor.com.

I converted the format of some audio files with online-convert.com.

I made the sound effects with Bfxr.

The "Who Wants to Be a Millionaire" music came from the YouTube
user MillionaireSound.

Author
------

That is me, Aaron Kaloti.

Contact Information
-------------------

My email address: aarons.7007@gmail.com

My YouTube channel (in which I demonstrate my finished applications):
https://www.youtube.com/channel/UCHhcIcXErjijtAI9TWy7wNw/videos