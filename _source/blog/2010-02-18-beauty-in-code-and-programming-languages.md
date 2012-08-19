template: blog/entry.template
---

When I'm learning about a new language or programming paradigm, I have this
internal set of criteria that I'm judging it against. And while those criteria
can shift as time goes on, I think they're largely based on my core values,
which specifically are that

1. Code should be, as a #1 priority, maintainable; which means that
2. I should be able to read and understand existing code quickly; which implies that
3. The language should provide unambiguous ways of doing things; or, conversely
4. The language should not allow programmers to do one thing in N ways.

There's a long-lived philosophy in the open-source world that I'm slowly
becoming aware of. There are programmers that view code as art, and accordingly
apply art-like valuations to code: how many times have you heard about a
"beautiful" function or implementation of so-and-so, or read some veneration of
an obscure and difficult passage by Carmack? Before I became a professional
programmer I sat on the sidelines of these discussions in more-or-less
agreement. I believed, or wanted to believe, that what I was doing was no less
expressive than turning stone to statues.

I'm sitting here watching the late-afternoon sun kiss the flowers on the trees
and thinking to myself how silly this idea that code is artful has become to
me. What I believe now is that code is not beautiful when it is compact,
obscure, or the belabored output of a capable mind iterating over the same idea
until it is optimized beyond studied comprehension. Beauty is what makes me
happy &amp; satisfied; beautiful code is straightforward code, that I can read
and understand, that I can maintain a mental model of, and manipulate, and more
than anything else *maintain* through its useful life. Beautiful code
behaves as code's Platonic ideal: to be read by humans, and only incidentally
by machines.

Languages like Erlang or Haskell have proponents that tout this idea of
thinking deeply and lovingly about an idea for hours, and producing a single
line of "beautiful" code that accomplishes the requirements efficiently. Mein
Gott in Himmel but what a terrible thing to imagine &mdash; a whole application
of such things! It's anachronistic revery at its worst: a veneration of a time
when hyper-optimized code was *de rigeur* as a matter of necessity.

I certainly don't believe that the wild opposite of this philosophy is
preferable. The phrase "Enterprise Java" is terrifying in equal measure. But we
live in an age where there is a legitimate middle ground, where a language can
be all of

1. Reasonably, even highly efficient by default;
2. Expressive enough to solve high-level problems; and
3. Strict enough to prevent the creation of bad (unmaintainable) code.

And I think that's a laudable goal, for a language. In fact, I think it's the
only goal that modern language designers should strive for. And it gives me a
sound theoretical basis for my deep-seated reactions to new languages and
paradigms. I realize, now, why I have such a distaste for Ruby and Perl. I see
them as languages of "expressivity", designed to be written rather than
maintained, as there is no single way to accomplish task X. I see their
proponents as code-as-art evangelicals, with the evidence being their code
itself: terse, and obscure, and by any measure not appreciable by maintainers.

I realize now why I feel so positive toward Python. It's not a perfect thing;
say what you will about the aimlessness of some of its libraries or Python 3,
but at least it has [an ethos][1], man. I realize that strict rules in the
structure of a language are actually quite awesome. Forcing indentation is such
a good idea! [Forcing a brace style][2] (even if it's one I hate, and among
other things) is actually really insanely great! I adopt these things as
idiomatic conventions of the language and don't deviate from them, and as a
consequence so many headaches of reading code disappear.

[1]: http://www.python.org/dev/peps/pep-0020
[2]: http://www.golang.org

I advocate for this philosophy in certain circles and I get such an absurd
reaction back. I said that I found "only one idiomatic way of doing something"
a very compelling feature, and got in reply

> I don't dig your tyranny, man. That way lies narrow-minded thinking,
> the rejection of anything new or noteworthy, and a foolish consistency
> that hobbles great minds.
> 
> Seriously, the world would have no art or creativity if as soon as you did
> something, it became an ironclad convention that no-one's allowed to break.
> In addition, you'll never get usage by a lot of people by continually
> rejecting their input. You'll only get the tiniest incremental changes by
> people with no problem being dictated to. That describes a lot of things
> in this world, but not open-source software, with its malleability and zero
> marginal cost of distribution.

which addled my brain so thoroughly as to leave me speechless. Please, man,
find beauty in art and nature, you'll find no greater advocate for that than I.
But (to crib another responder) the beauty of programming is creativity
expressed from simple rules; the beauty of form as defined by function. Let's
advance the real, structural beauty of programming by abandoning the crippling
"beauty" of overindulgence.

