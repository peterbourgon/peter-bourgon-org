Notes to self/braindump regarding the development and version-2 design of plbth,
my unpronounceable, console-based, generative synth project.

Probably the most important "feature" of plbth is that it should be dual-mode,
usable both as a performance synth and a "fire-and-forget" generative synth. In
a broad sense, I wanted to be able to "play" it, and then later in the same
session "let it go" and have it generate its own sort of ambient chorus. In
order to accomplish this, very early in the development process I keyed in on
the concept of a Generator, which was an all-in-one package: set it up with some
parameters, some idea of how to generate notes, and after turning it on it will
output that prescribed sound (or sound-series) indefinitely. You could play it
by altering those parameters, or leave it be and it would be a little loop-
engine.

This was great for a first-draft effort, because I could tweak a bunch of
complex parameters all in one place. I could create a generator (create simple-
generator alpha), make it quieter (`alpha amplitude 0.4`), add an echo (`alpha
filter create echo`), change the notes it played (`alpha note-sequence C#/4
rest/1 Eb/1 As/-4 r/1 r/1 r/1`), and so on. When I took my hands off the
keyboard it would just keep doing what it had been doing. Great! Excellent.

Then I added the concept of a randomizer, which I called a Genesis Engine.
Conceptually, you would connect Generators to the Genesis Engine, and it would
control whatever parameters of the Generators you told it to. It was smart
enough to keep everything in the same key signature, and could in theory make
one Generator do an arpeggio while another played bass-lines, or whatever. It
was pretty versatile because every parameter of a Generator was programmatically
changeable: all Generators could be queried for settable_parameters (as strings)
and the Genesis Engine just has a map of parameter (string) to valid values or
value-ranges (also strings). Certain parameters (key signature) have a special
meaning ("global") and affect other parameters (note sequence) when they change.

Things continued in this way for awhile, as the first phase of plbth development
was a feature-blitz. Every few days I would decide I wanted to be able to do
"X", and I'd simply (often naively) add that feature. I always tried to do it as
coherently and cleanly as possible, given the current state of the code base.
But I purposefully stopped myself from refactoring huge chunks of the project in
order to maintain some forward momentum. I did this knowing that at some point
when we're reasonably feature-full, and when the architecture of the project
made making new features more difficult than necessary, I'd do a reasonably
thorough re-factoring. And I guess that time is now.

In order to facilitate some more advanced functionality (including, at some
point, being able to transparently hook in a MIDI controller) I want to make a
few broad architectural changes.

* The Clock feeds ticks to EventGenerators, one-to-many.

* An EventGenerator feeds Events to SoundGenerators, one-to-one or one-to-many.

* Events are received and processed asynchronously (as currently stands).

* A SoundGenerator contains (owns) zero-or-more EventFilters, and zero-or-more SoundFilters.

* An EventFilter takes an Event input, manipulates it (eg. octave shift, chorus
  duplication), and sends the resulting Event(s) on to the next Event receiver:
  another EventFilter, or the SoundGenerator.

* The SoundGenerator takes a stream of Events and, for each, generates a sound
  (float buffer) according to its parameters. We consider the time spent to
  generate the sound as close-to-zero. Generated sounds stack, rather than
  queue, in an output buffer, to allow effects like chorus.

* Before the sound buffer is dumped to the audio hardware, SoundFilters are
  applied sequentially. Not a great implementation (a float stream is
  preferable) but simplest for now.

These require or are helped by a few implementation-level changes:

* Object manipulation of any Generator type is handled through the same
  framework: create/delete generator-type name, then alpha output-to beta/none.

* Sound Generators can create/delete Event and Sound Filters in the same way:
  alpha create/delete filter-type name, then alpha chorusizer output-to
  octavizer, alpha octavizer output-to self, alpha event-input
  chorusizer/octavizer/self.

* Print/load state can be simplified from a special file format to a list of
  commands that can be run in series. This simplifies the amount of code
  required to translate "input" (user, state, file, macro, Genesis-generated)
  into changes of program state: everything can go through a single processing
  module.

* This means macros can be implemented in the same way -- no distinction between
  macro and statefile.

* Lots of keyboard-time was spent connecting object parameters to the UI. Object
  parameters should instead be dynamically discovered by the UI based on calls
  to settable_parameters() and automatic parsing of value strings. All
  parameters must be string-representable. All value types must have string
  constructors: ValueType v("user input"); must produce a valid object (which
  may have some InvalidState internal state) and should be the only place the
  string-to-object translation is done.

And, at an even lower-level:

* Drop all notion of Hz from programmer-space; all notes are proper Notes,
  containing Key, Octave, Duration.

* Duration exists only in terms of clock-time; no millisecond values are stored,
  only computed when required.

* Use friend operator<<() instead of dumpy to_string() functions.

* Make an effort to write (at least) mid-level unit tests for new functionality.

* Standardize Note/Octave/Duration notation (ugh!)

With these changes the Genesis Engine becomes simply a sort of autonomous
EventGenerator: taking Clock ticks, publishing Note Events to slave
SoundGenerators, as well as manipulating SoundGenerator parameters according to
its own internal logic. It's controllable just like any other Object in the
system, responding to settable_parameters().
