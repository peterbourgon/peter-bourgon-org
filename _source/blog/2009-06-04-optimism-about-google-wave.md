template: blog/entry.template
title: Optimism about Google Wave and the Wave protocol
---

The [Google Wave](http://wave.google.com/) announcement did something strange:
after reading up on it, I'm finding that I'm softening my [hard
lines](http://bourgon.org/2009/2/24) against web apps, opening up just a little
to the usefulness of XML on the wire, and feeling a bit more permissive in what
I think HTTP may be used for.

Maybe it has something to do with my burgeoning receptiveness to articles like
[this one](http://www.mikeindustries.com/blog/archive/2009/05/examining-
typekit), which reasonably state things like "the entire world wide web is a
hack." Fair. But I think Wave pushed it all over the edge because it's not
fundamentally corrupting the document model of the web. It extends the model in
arguably corrupt ways, sure, but at the end of the day a Wave _is-a_
document; the extensions or APIs that piggyback on HTTP do so to service proper
documents-as-documents. And I'm considerably more receptive to hacks when they
don't break fundamental design principles. Or, maybe more accurately, when I can
envision them as not breaking my mental model of those fundamental design
principles.

Wave has generated a lot of hype, and a lot of that hype is well-earned. The
_promise_ of an Waved web is a rich one, and not just for trivial
bullshit like movie polls between friends and chess games and _whatever_.
A widespread adoption of the Wave concept, in the same manner as we have
widespread adoption of email today, could be the first step in an honest re-boot
of the way we manage Internet-based information exchange.

But a lot of that promise gets lost in the Wave-hype; probably the most
frustrating aspect of it is that so few people seem capable of separating
Google's shiny, HTML5 Wave client from the underlying Wave protocol. The client
is doubtless an impressive bit of kit, pushing the in-browser envelope and
making a great case for HTML5 _stuff_, but in the scope of what's on
offer here it's almost irrelevant: it's an interchangable cog in the Wave
machine, that with any luck will end up being just one of dozens of ways of
interacting with Waves.

The real game-changer is the protocol, or what the protocol implies: that
collaborative (crowd-sourced) persistent documents have come of age, and can be
a first-class method of communication, rather than simply the output of a
comparatively complex workflow (nee Wikipedia). The technology powering Wave is
a Big Deal because it represents the first time a useful, but computationally-
intensive and "difficult" idea (in this case, operational transform) is manifest
in a usable way. And I think historically, even outside the realm of Computer
Science, bringing those kinds of ideas to market in practical ways has always
done exceptional things for everyone involved.

At the moment there is a severe paucity of in-depth documentation, so I'm not
yet convinced that Google have made the difficult bits simple and reliable
enough to grok in a heterogeneous and unreliable environment like the internet.
I believe it's crucial to Wave's success that a competent sysadmin can install,
maintain and debug a network of federated Wave servers, as well as that a
competent programmer can understand, work on, and extend core client-server and
server-server communication code. But if Google can get that right, I'm
extremely optimistic about what all this may mean.
