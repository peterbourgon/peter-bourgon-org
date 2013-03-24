{ "title": "It's not possible to validate Tumblr pages" }
---
It's not possible to successfully validate Tumblr pages.

First, because the little `BEGIN TUMBLR CODE` iframe is woefully broken, and you
don't have an option to turn it off. (*There's* a legacy of the Geocities era
that is neither campy nor nostalgic.)

But, also, and more annoyingly: there is apparently a
[longstanding](http://getsatisfaction.com/tumblr/topics/why_does_tumblr_strip_p_tags_from_posts)
and
[known bug](http://blog.gesteves.com/post/64395827/tumblr-annoyance)
in Tumblr's template processing that strips `<p>` tags from any block of text
that's only a single paragraph. This occurs no matter how you enter your post,
using the WYSIWYG editor or dumping in the raw HTML. In fact, if you try to
'edit' the saved, raw HTML, you'll see that the `p` tags are still there, which
is what leads me to believe it's a presentation-layer issue.

This is such a trivial thing to fix, and a plainly obvious problem. It would be
one of the first things I'd notice on even a cursory PQ analysis, and I'm no PQ
guru. It really calls into question the efficacy of the Tumblr folks; I'm
starting to think (and get whisky-levels-of-depressed about the fact) that most
popular websites and Internet endeavors these days are truly flash-in-the-pan,
halfass little marketing-driven engines for people with too much time and not
enough discipline.

Jeff Atwood tells me
[all programming is web programming](http://www.codinghorror.com/blog/archives/001296.html)
and I'd better get used to it, bub. But
[his narcissism](http://www.codinghorror.com/blog/archives/001298.html)
is almost the perfect vehicle for that kind of message: amping up the worst
qualities in developers (self promotion; echo-chamber product rallying) while
masquerading a plaintive but empty support of the best (subtle introspection;
thorough technology analysis). Through this lens my
[earlier](http://bourgon.org/2009/2/9)
[rants](http://bourgon.org/2009/2/24)
on web services
[and the companies behind them](http://bourgon.org/2009/3/22)
read equally a critique on the info-pop mindset of a self-congratulatory
generation.

[Y-combinator](http://www.ycombinator.com)
is a good hub for this sort of thing. What they do is amazing: give a chance to
a kid with a dream. But my God, the shit that passes muster over there. For
every
[Reddit](http://www.reddit.com)
there's forty
[More Hotters](http://morehotter.com/).
Going to
[quote Social Browse unquote](http://socialbrowse.com)
is like being punched in the face by mediocrity. It hurts me physically to see
the site, and fundamentally to think that there are still people that believe
some shitty portmanteau in the "social web" sphere has the potential to be
anything but a grand's worth of squatted domain. But deep down, the strongest
offense is that the barrel of CompSci- degree-having monkeys that spawned this
abortion of an idea (and I have no doubt that they are probably talented folks
in their own right! but that they) managed to convince an entire capital fund
that they had $20,000 worth of promise rattling around in there. That somebody
else -- with money! -- is on board with this, is, like... man. Maybe if
Y-combinator once a year funded a bunch of wiry- lookin' guys with a climate
prediction model, or a better text-indexing mechanism, or, you know, *something*
that didn't make my eyes roll so far back I can see gray.

I see all of these things and I get angry and sad and all these other emotions.
But maybe it just means I'm traveling in the wrong circles; raging against the
digerati echo-chamber is satisfying, but probably just intellectual
masturbation. If anyone knows where I can go for the latest-and-greatest in
meaningful technology work, please, by all means, clue a brother in. Otherwise
I'm reduced to a downward spiral of self-loathing.
