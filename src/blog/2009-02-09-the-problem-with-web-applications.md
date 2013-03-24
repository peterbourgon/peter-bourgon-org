## The history and the problem.

When CSS first became _en vogue_ and the phrase "separation of content and
design" escaped the narrow corridors of niche institutions, I used an iteration
of my own website's design to wax philosophical on the State of the Art. From my
perspective, the content-generators, the Web intelligentsia, began to shift the
focus of their energy toward the "design" portion of the equation. Tables
yielded to divisions, tags to styles, and huge amounts of time and grief were
lost to the downward spiral of standards and compatibility.

And before long, the competitiveness of design led to hair's-breadth hacks of
language specifications falling into common use--what modern CSS framework
doesn't include an "if-IE" conditional? Or negative margins somewhere? These
hacks are symptomatic. But the people who make them mislay the blame. It isn't
that a given piece of software isn't standards compliant. More fundamentally,
it's that the standards are foundationally corrupt, because the entire practice
of web development since the late 90's has been suspect.

At its technological core, the Web (as the hypertext transfer protocol and its
myriad markup languages) is an infrastructure designed to serve documents. The
term document is purposefully but pointedly vague--it may represent a book, an
article, a single word or letter, the dynamically generated output from an input
request, a list of items, a series of pictures or movies, _et cetera_. These
things have one binding commonality: they represent the ends of production, the
products--they are **content**. What they are explicitly _not_ are means to
production--they are not applications, or workflows, or highly interactive
generative _whatevers_.

Every step the Web has taken toward this idea of documents-as-interfaces,
websites-as-applications has been completely wrong. AJAX is an abomination.
jQuery is an execration.

Web developers, rich application designers--it's as if they're feverishly
researching bloodletting in hopes of curing AIDS. As if they're trying to figure
out the best way to build a two-legged chair. The problem is misdirected
effort--straight up, **you're doing it wrong**.

Nothing about the Web supports these development models. That it is even
possible is the unfortunate consequence of insufficiently strict systems
architects coupled with insufficiently educated developers. The adage that
anyone may publish on the Web is a true one, and a powerful thing. But that
power was massive; a growth engine of, by and for the people has no incentive to
play by the rules if they aren't rigidly enforced. And as people built without
discipline, and as they shifted their efforts from content to design, the Web,
slowly and from within, corrupted itself.

Almost no corner of the Web is today unspoiled. What once might have been a
usable index of an artist's work is
[rendered (literally, in this case) oblique, opaque, and indecipherable](http://www.mayalin.com/),
and consequently ruined. An entire cutesy cottage industry sprung up around
[the applicationization of the Web](http://keyboardr.com),
going so far as to leverage
[an unearned, unjustified and eye-rollingly terrible name](http://en.wikipedia.org/wiki/Web_2.0)
for itself. Even the Web's
[frontmost icon](http://google.com)
has advanced this corruption, this idea of the browser-as-everything.


## The problem is intractable, as things stand now.

I'm not an idiot. The Web as it exists today isn't going to revert into what it
Should Be, no matter how right I am (and I'm very, very right). The path forward
isn't a Sherman's March to HTML 1.0; the market demands rich Web-applications
(whatever that is) and it will have them on the entrenched technology as it
exists.

So, the Web, as it was and should have been, is dead. Let the content-designers
continue on their fundamentally idiotic path. Let a thousand
[CSS Zen Gardens](http://csszengarden.com)
flourish in their ignoble glory. Let Google build its stupid tool-bars and
browsers, and continue to worsen its products through its baldly-terrible
iterative changes. They all till on dead soil.


## The solution?

What we need is a new understanding of the market. Two new infrastructures
designed for two explicit purposes: one, to deliver the means to production;
another, to deliver the ends of those means.

For the latter, I envision a strict XML delivery system, with hooks for
enhancements of distribution, ease-of-creation, and dynamic generation. Pure
_content_ as an end rather than a means; configured for screen, print, or
device; simple, above all else, but extensible.

For the former, I envision something akin to a delivered Java, the runtime
environment not bound to the system but packaged in a browser/explorer, which
could navigate a routed and interlinked network of application-providing
servers. A platform not unlike [Valve's Steam](http://steampowered.com)
but more ubiquitous, more generic. It would bear in mind Java's failures, and
carry the weight of a global consortium behind it--public, private, open- and
closed-source benefactors creating a mechanism that can deliver applications to
users immediately, with zero configuration and ignorant of that user's
technological capabilities. Scalable, highly available, gracefully falling back
to lower levels of support when able, and gracefully failing completely when
not. And, most importantly, built to seamlessly publish to the meta-XML content
specification we've described above as a first priority. The two systems, the
means and the ends, co-operate, fundamentally and rigidly aware of each others'
existence. Any attempt by one to duplicate or co-opt functionality already
provided, or better provided, by the other must be met with the most
insurmountable wall of impossibility.

It's all a ridiculous pipe dream, of course. I can't imagine such an idyllic
infrastructure into existence. But I can encourage it: let's all reconsider the
assumptions of what we're doing, at a really core level. Are we choosing the
right technology to solve our problems? Are we spending time in the right
pursuits? Are we researching and developing meaningfully, or wastefully? Let's
all "Web" less, "design" less, and worry a little bit more about producing
information that people can actually, usefully, consume.


## Further reading.

The [Webless Initiative](http://port70.net/webless/) has some good ideas wrapped
in a little bit too much ascetic/puritan rage (accordingly, the associated
[Anti-web manifesto](http://port70.net/webless/antiweb.html)).

A poorly written/researched article entitled
[In Praise of Lo Fi](http://www.jackcheng.com/in-praise-of-lo-fi)
nevertheless raises some meaningful thoughts.

[Joel Spolsky](http://www.joelonsoftware.com)
speaks intelligently about best-practice software architecture and design,
though (caveat!) tends to lend too much weight to pragmatism to entirely suit
this discussion.

By many measures,
[37 signals](http://37signals.com)
is the corporate embodiment of the opposite of this philosophy; I can think of
almost nothing good about the company, its ethos, its products or its people,
and I therefore think it serves as a good example of What Not To Do, a towering
beacon from which you may steer your ship violently and ceaselessly away.
