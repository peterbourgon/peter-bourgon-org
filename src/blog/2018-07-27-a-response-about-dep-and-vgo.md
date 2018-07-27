{ "title": "A response about dep and vgo" }
---

[Russ Cox did a tweetstorm](https://twitter.com/_rsc/status/1022588240501661696)
about his perspective on the dep/vgo/modules story. It's not a lot of fun to
re-litigate histories, but there are some subtle and important problems in this
narrative, and it's important to me that I have something on the record that
objects to those problems as I see them. I think it's important because Go's
leadership spends a lot of time and energy on promoting the notion of a
community culture, and I think this incident, in all of its messy and protracted
complexity, stands as pretty compelling evidence that they haven't figured out
the right protocols for that, yet. It's important that there's an accurate
history on the record, so that future endeavors can improve on the mistakes of
the past.

Russ starts by giving a bit of history. I want to skip ahead to the point where
he gets involved. (I've slightly re-ordered sections of his tweets, for clarity
of response.)

> In June 2017 I shared a doc with the package management group sketching
> thoughts about go command integration. There are some major flaws that Sam and
> others helped me see. I've now published it here:
> https://research.swtch.com/go-pkg-june-2017.html.
>
> I met with the package management group a few days later to discuss the
> design. I took notes and wrote them up for Andrew, who missed the meeting.
> I've now published them here:
> https://research.swtch.com/go-pkg-june-2017-notes.html
>
> One topic at the meeting was the status and future of dep. Again I emphasized
> that the whole point of this process was to understand the problem space
> better and to work toward smooth integration in the go command.
>
> We discussed dep at the GopherCon contributor summit. Matt Farina says that I
> said I could do better if I went off on my own and built something. I'm sure I
> didn't; likely I said that dep's design needed to change to be integrated into
> the go command.

I was also there at the contributor summit, and directing a lot of the
conversation at the package management sub-group. I don't remember precisely the
words that Russ used, but I remember very clearly the net effect. When Russ
arrived at the table, about halfway through the session, he said that to
understand a domain he had to work through the problems and build something
himself, and that he was either just starting that or in the middle of it, and
that he hoped to have some kind of output from that process soon.

The clear impression was that Russ wasn't going to engage with the committee,
the research we had prepared for him, or the prototype product of that research,
`dep` &mdash; at least, not yet. The clear impression was that Russ had his own
hypothesis about what a solution would look like, and that he was interested in
validating those hypotheses, by himself. This was among the first meaningful
communication the committee had with Russ, and while we were excited that we
finally had the attention of the core team, and remained cautiously optimistic,
it was an inauspicious introduction.

[Matt wrote](https://codeengineered.com/blog/2018/golang-godep-to-vgo/#comment-3912787226):

> I watched as Jess, Sam, and others at the table let out a sigh and looked
> down. It felt like the air had been sucked out of the room. I was upset enough
> that I told you, right there, that it wasn't the right way to approach people
> who put their effort and time into working on this problem.

I also clearly remember this moment, precisely as Matt describes it.


&mdash;

> In late November I sent the package management group a draft of what became
> semantic import versioning and I met with them to get their thoughts. I had
> not written any code - I was still trying to work out what go command
> integration meant. https://research.swtch.com/impver-draft-20171120.pdf
>
> My draft ended by suggesting that dep add support for semantic import
> versioning, and I met with the pkg mgmt group to discuss that. Sam and Peter
> argued that it was too late to change anything in dep and that it should just
> become “go dep,” a fait accompli. No dep changes.

This is absolutely not true: nobody on the committee wanted `dep` to simply
become `go dep`. We suggested some subcommand integrations, as strawmen to move
the conversation forward, but we certainly never insisted on an e.g. `ensure`
subcommand in the final product. This was clear to all parties from day one.

Indeed, we knew from the beginning that a deeper integration with the `go` tool
was necessary. We also knew that we needed buy-in from that tool's author (Russ)
to propose any changes, and so we deliberately deferred that decisionmaking
until Russ was involved in the conversation. In fact, we generally went out of
our way to avoid making decisions that we considered to be part of the go tool's
territory, in order to ease future integration work. As a result, `dep` operated
with many strawman nouns and verbs, like `ensure`, mostly as a means to make
forward progress while Russ was unavailable.

At this point we _did_ have several conversations about semantic import
versioning. Russ failed to convince the committee that it was necessary, and we
therefore didn't outright agree to modiying `dep` to leverage/enforce it.
Perhaps that's what he is remembering.


&mdash;

> Although it was a successful experiment, Dep is not the right approach for the
> next decade of Go development. It has many very serious problems. A few:
>
> - Dep does not support using multiple major versions of a program in a single
>   build. This alone is a complete showstopper. Go is meant for large-scale
>   work, and in a large-scale program different parts will inevitably need
>   different versions of some isolated dependency.

Russ has asserted this from day one, and has brought several examples out in
evidence, but has simply not convinced the committee that it's true. Calling it
a serious problem, let alone a showstopper, is a significant overstatement. The
strongest claim that can be made on this point is that it's a matter of opinion.

(Popularity is not evidence of correctness, but it's worth noting that the
committee is not alone. Many other package management systems enforce this same
constraint; it doesn't seem to be a showstopper for those ecosystems.)

> - Dep's very flexible config conflicts with the convention-based “go build”
>   approach. Another complete showstopper. Even Sam admits Dep is too flexible.
>   Rich configs are good for experimentation but bad for day-to-day use. No one
>   understands how to use Dep well.

All fixable.

> - Dep's use of a SAT solver adds more problems. My tweetstorm yesterday hit
>   the highlights there.
>
> - If the constraints fed into a SAT search are incomplete (and they are), then
>   even a perfect SAT search can pick bad configurations (and Dep does). I
>   walked through the details in my Singapore talk.
>   https://www.youtube.com/watch?v=F8nrpe0XWRg

Pathological conditions exist, but advocates for SAT have never claimed
otherwise. It's an engineering decision, like others, the product of an analysis
of pros and cons on all sides. (I guess the details are outside the scope of
this response.)


&mdash; 

> We let Dep go its own way and end up somewhere unacceptable, making Go modules
> seem a very large course correction. Worse, the course correction surprised a
> lot of people, because we'd only shared concerns with the package management
> group.

This is somewhat disingenous. The course correction also surprised the package
management group collectively, because until the `vgo` papers appeared, we had
every hope and expectation that the core team would continue to work _with_ us
and `dep` to get it to an acceptable place, rather than propose something
altogether new.

> We have a defined process for changes to go, large and small. Basically, write
> a proposal. The core Go team helps point out the important concerns to address
> to stay true to Go's design and vision, and we guide a community conversation
> toward consensus.
>
> Community consensus is not always possible. If we don't get there, then the
> core Go team decides. Technically I am the final decider but what actually
> happens is that a bunch of long-time Go team members talk through the decision
> to get to a consensus among ourselves.
>
> There was never a Dep proposal. For the Go modules proposal, the community was
> broadly in favor, though certainly not Sam and a few others. I left the
> decision to the other usual proposal reviewers, and they considered the issues
> and the objections and formally accepted it.

This is somewhat disingenous. We deliberately avoided making a proposal for
`dep` until we had established a more formal communication channel with the core
team. Much of `dep`'s development occurred without any communication at all. We
were, or at least I was, still hopeful that Russ and Sam's technical conflicts
could be resolved, and a `dep` proposal made, when the `vgo` papers were
released. Remember: by that time, Russ had only been to (I believe) 2 or 3 of
our meetings; we had been having them for almost two years.


&mdash;

> I thought I could focus on the technical details and let the pkg mgmt group
> run community interactions. Somehow that led to the entire community believing
> that Dep was the official endgame, even though my discussions with the pkg
> mgmt group were clear it was not on that track.
>
> In retrospect I made lots of mistakes, but the biggest one was not
> communicating concerns with Dep and plans for go command integration more
> widely and publicly. I wanted to let the package management group speak with
> one voice.
>
> It seemed to me most productive to talk directly to Sam and the others about
> what was needed to bring package management into the go command proper. But
> those concerns were basically ignored, 

Russ's technical arguments were certainly not ignored; we debated them
extensively. They simply failed to convince Sam and the committee. Rather than
refine the arguments to be more convincing, or work with the committee to hammer
out a compromise position, Russ decided to implement his ideas on his own, and
make a proposal without us, and without telling us that's what he was doing
until it was essentially done. To be clear: as technical lead on the Go project,
Russ certainly has the power to do all of these things. But what image does that
project?

> with the result that Dep is and remains unfit as a design for go command
> integration.
>
> One way or another, Dep was presented and became known as the final answer for
> Go package management, even though we'd been clear with Sam as early as
> December 2016 that it was only a step along the way and should be expected to
> be replaced.

The community of contributors to `dep` were ready, willing, able, and eager to
evolve it to satisfy whatever was necessary for go command integration. This was
understood from day one of the commitee's work, and day one of opening the `dep`
repo to the public. We were surprised and saddened that the core team wasn't
interested in working with us to get there.


&mdash;

> Since Dep was not going to add support for import versioning, I hacked up an
> implementation in the go command to test the ideas. I also found the nice fit
> between import versioning and minimal version selection and implemented that
> too.
>
> At the start of January 2018, I had a design I wanted to talk about publicly
> and no implementation to test whether it was any good. But Sam was talking
> about Dep at FOSDEM on Feb 3, which I didn't want to complicate. So I kept
> talking to Sam but didn't publish anything.
>
> By mid-February I had a working demo of all the pieces and was confident there
> weren't major problems with the design. Sam's FOSDEM talk was over, so I
> finally published the blog posts and the prototype implementation. Boom.

What should a project lead do, if they form a technical opinion on an important
subject that is at odds with the community domain experts? Especially if those
domain experts have been working with the community on that subject for many
years? And if the community has been in a crisis mode for lack of a standard
solution for just as long?

My position is that if Go wants to foster a constructive community culture, the
leadership has an obligation to engage and work with the community when they
step up to the plate and solve big problems that the core team has consistently
ignored. Even, and especially, if there are disputes in how the solution is
designed or implemented. Doing an end-run around community work, especially when
those workers have been desperate for collaboration for years, isn't great.


&mdash;

When the `dep` committee was formed, I took extraordinary pains to make it, and
the processes it followed, as absolutely bulletproof and unassailable as
possible, from the perspective of protecting the bonafides of the group itself,
the reputation of its members, and the validity (for lack of a better word) of
the artifacts it would produce. In lieu of direction, or even basic
communication, from anyone on the core team, we decided to

- Draw the members from existing leaders and experts in the community
- Form a secondary advisory group from all relevant projects in the space
- Spend half a year collecting user feedback and doing domain research
- Review all other significant package management tools in detail
- Walk the design space as a group, aiming for consensus on all major decisions
- Document, painstakingly and publicly, all of the above

We did all of this because we wanted to be an _exemplar_ of how the community
could step up and solve a problem that was being ignored by the core team. I
can't think of anything else we could have done to be better than we were. But
the end result of this effort was no different than if we had done none of it at
all: the core team ultimately didn't engage with us meaningfully on the body of
work we'd contributed, and instead insisted on doing the work themselves, as an
essentially greenfield project.

I think the outcome of the dep/vgo/modules story pretty clearly demonstrates
that, while Go leadership will happily accept contributions to issues and
non-controversial proposals, it isn't interested in, or capable of, fostering a
true community of autonomous contributors. That power sits exclusively in the
core team at Google.

Once I gave a talk about a project I'd worked on, which ultimately failed. I had
a slide at the end, with a picture of a ship wrecked on an island, and the
caption read "The purpose of your life may be to serve as a warning to others."
I hope this story serves as a warning to others: if you're interested in making
substantial contributions to the Go project, no amount of independent due
diligence can compensate for a design that doesn't originate from the core team.

Maybe some of you are reading this and thinking to yourself, "well, _no duh_,
Peter, that should be obvious." Maybe so. My mistake.
