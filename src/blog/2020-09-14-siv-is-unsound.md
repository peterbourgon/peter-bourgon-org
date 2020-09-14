{ "title": "Semantic Import Versioning is unsound" }
---
Earlier there was an article titled
[Go Modules have a v2+ Problem](https://donatstudios.com/Go-v2-Modules)
making the rounds, which critiqued some aspects of Go modules' design.
I think the arguments presented there are actually just skimming the
surface of a much more fundamental and serious problem. I've been
talking about this problem for long enough, and with enough other people,
that I think it's worth a more formal description. So, here we go.

## What is SIV?

Go modules have a requirement called Semantic Import Versioning (SIV) which
states that a given module identifier must remain semantically compatible across
all of its versions.

In terms of [semver](https://semver.org), this means that if your module is at
major version 1 or above, and you make a breaking change, you must not only
increment the major version, but also change the name of the module itself.
(Semver major version 0 explicitly makes no claims about compatibility, so SIV
essentially doesn't apply there.)

## Costs and benefits

The simplifying assumption of SIV does provide benefits. Most notably, by
forcing dependency relationships to be expressed in terms of nominal API
compatibility, dependency resolution becomes much simpler. If every version
available under a given identifier is nominally equivalent, then the tooling is
free to choose any of them, ratcheting upwards, when solving a dependency graph.
Consequently, different major versions of the same — well, "same" — dependency
can coëxist in a single compilation unit just fine, because there's no ambiguity
about which major version is being referred-to by an identifier. This ability
is frequently described as essential when performing large-scale migrations
of a dependency from one major version to another.

But SIV also comes with costs. The costs might manifest as specific bugs, or
workflow failures, or specific issues that can be individually identified and
addressed, and I'll try to point some of those out. But I believe it's a mistake
to focus on these manifestations themselves, as I believe they're symptoms of
the actual issue, which is that SIV as currently implemented is fundamentally
unsound.

There are lots of angles to my claim, and I'll try to present them coherently.

## Defining identity

First, I'd like to separate the concept of an identifier used as a precise
input to a dependency management tool (i.e. plumbing), from the concept of an
identifier used by human beings in the UX of those tools (i.e. porcelain).

Software necessarily establishes and exists in a domain, or bounded context,
where it's free to "define its terms". When I'm writing a service that manages
user profiles, a User or a Profile
[means just what I choose it to mean — neither more nor less](https://www.goodreads.com/quotes/12608-when-i-use-a-word-humpty-dumpty-said-in-rather).
Or, when I'm writing a programming language, I'm free to say that types follow
identifiers in declarations, and that's just the way it is. This sort of
epistemic closure is necessary for building useful and well-abstracted models.
Programmers understand that necessity, and expect to pay the cognitive costs as
table stakes when programming.

But this freedom, like any other, has limits. Even within a domain, if I insist on an
[entirely invented vocabulary](https://urbit.org/docs/glossary/)
for my language without good reason, users will rightfully balk: the cognitive costs
aren't justified by sufficient benefits.
And when we leave individual software domains and start working in the context of
entire ecosystems, we lose even more of this power. A User type might mean two
specific and different things in two repos, but when we talk about users at a
cross-team integration meeting, or at our all-hands, by default we're talking
about a different, more general, more abstract thing. The context of the
conversation sets that expectation.

Humans generally and programmers specifically already have a well-established
notion of identity. Crucially, that notion of identity is orthogonal to version,
or time. I am fundamentally the same human being at age 35 as I was at age 12,
even though practically all of my substantive characteristics have changed.
Similarly, my flags package peterbourgon/ff is still fundamentally the same
logical thing at v3.x.x as it was at v1.x.x, even though its API has changed in
non-backwards-compatible ways.

This is also a subtle distinction, but it causes a lot of serious issues,
especially as it interacts with another design decision. In modules, major
versions 0 and 1 are unique in that they're expressed not with an explicit
version suffix but as the bare, unversioned module name. So when a user writes
`github.com/user/repo`, modules believes they are explicitly specifying major
version 0 or 1, which is essentially never the case.

Consequently, it's very easy for users to select an old or unsupported major
version of a dependency unintentionally. And there's no good way for them to
find out: because SIV understands major versions as completely distinct, modules
explicitly doesn't understand or suggest any connection between e.g. module/v2
and module/v3. (The small affordance on pkg.go.dev that lists the major versions
of a given module is derived from additional non-modules metadata.) Even more,
modules authors appear to be
[actively resistant](http://github.com/golang/go/issues/40323)
to the notion that this ancestry actually exists.

## An extraordinary bias towards consumers

There's a reason for that resistance — modules doesn't lift its domain-specific
concept of identity into the ecosystem unintentionally. The authors believe that
identity _should_ be defined in terms of API compatibility rather than author
intent, because they believe a software ecosystem should always prioritize
stability for consumers above everything else. In this worldview, a major
version represents significantly more than its definition under semantic
versioning. It's a contract with its consumers, understood by default to be
supported and maintained indefinitely. In effect the "cost" of a major version
bump is — always — extremely high.

This appears to be an artifact of the software ecosystem within Google. At
Google, package consumers expect their dependencies to be automatically updated
with e.g. security fixes, or updated to work with new e.g. infrastructural
requirements, without their active intervention. Stability is so highly valued,
in fact, that package authors are expected to proactively audit and PR their
consumers' code to prevent any observable change in behavior. As I understand
it, even issues caused by a dependency upgrade are considered the fault of the
dependency, for inadequate risk analysis, rather than the fault of the consumer,
for inadequate testing before upgrading to a new version. This, predictably,
motivates a culture of automatic upgrades: even if extremely infrequent, a major
version bump might also be expected to come with a tool that automatically fixes
users code.

This point is actually closely related to my previous point. Modules so deeply
biases for consumers that, under SIV, module identifiers actually don't capture
the name or identity of a software artifact, as _expressed by the author_ of
that artifact. Instead, module identifers try to capture a specific API
compatibility as _experienced by the consumers_ of the artifact.

(I write "try" because, ultimately, it's unenforceable: authors can still
publish breaking changes without changing the major version or the module name.)

## Impact on the ecosystem

Modules' extraordinary bias toward consumer stability may be ideal for the software
ecosystem within Google, but it's not approriate for software ecosystems in
general.

Primarily, the costs and benefits of a major version bump aren't the same for
all projects. For widely-imported modules with large API surface areas, new
major versions create a lot of toil for a lot of people, and so might carry a
high cost. But for modules with tiny APIs and/or few consumers, a major version
bump is, objectively, less costly. Further, for software that models
well-defined domains with stable and productive APIs, breaking changes might
represent more churn than innovation, and so might not carry many benefits. But
for software that's still exploring its domain, or modeling something that has a
naturally high rate of change, being able to make relatively frequent breaking
changes could be essential to keeping the project healthy.

(Sometimes modules' authors suggest that projects with high rates of change
should simply stick to v0 until the project stabilizes. But just as the costs
and benefits of a major version bump aren't the same for all projects, neither
is the definition of stability. A major version expresses semantic compatibility
and nothing more — projects shouldn't be prevented from using semver to express
their version semantics because ecosystem tooling has substituted stricter
definitions.)

Additionally, policies that bias for consumer stability rely on a set of
structural assumptions that may exist in a closed system like Google, but simply
don't exist in an open software ecosystem in general. Concretely: it's
impossible for me to know who imports my module, it's impractical for me to own
any of the risk they incur by importing it, and it's infeasible for me to
maintain a major version into perpetuity — or, indeed, to maintain anything
beyond what I opt-in to maintaining. Being a good member of a community of
course requires good-faith effort toward all of these things, but mandatory
tooling can't treat them as expectations without artificially excluding
participation.

A bias towards consumers necessarily implies some kind of bias against authors.
In SIV, versions are modeled so that API compatibility is considered the
fundamental "thing", the authoritive truth that defines identity. In this model,
the actual version identifier is sort of emergent from, or an expression of,
that truth. But API compatibility isn't and can't be precisely defined, nor can
it even be discovered, in the P=NP sense. Major versions express an _intent_ of
version compatibility, but not its existence. Consequently, SIV's model of
versioning is precisely backwards. The version as expressed by the author is the
core truth, and API compatibility is (or isn't) an emergent property of that
truth. SIV strips authors of this authority.

Finally, this bias simply doesn't reflect the reality of software development in
the large. Package authors increment major versions as necessary, consumers
update their version pins accordingly, and everyone has an intuitive
understanding of the implications, their risk, and how to manage that risk. The
notion that substantial version upgrades should be trivial or even automated by
tooling is unheard of. Modules and SIV represent a normative argument: that, at
least to some degree, we're all doing it wrong, and that we should change our
behavior. But when we move to a broader context, just as we lose some amount of
freedom to assert our specific domain language, we lose some amount of freedom
to make normative arguments. A tool that targets an ecosystem necessarily has an
extremely limited budget for evangelism — it essentially has to work with users
where they are, rather than guiding users where it might want them to be.

## What are we actually getting?

SIV gives the tooling the benefit of unambiguous identifiers, which help it
resolve the dependency graph. But that's an internal benefit, invisible to users
except by its ramfiications. The only explicit benefit to users is that they can
have different versions of the "same" module in their compilation unit. Of
course, this was always the case: the difference is that, previously, it was
opt-in by the author, by e.g. creating a new repo a new major version, and now
it's mandatory for all artifacts in the ecosystem.

Is that mandate justified? How frequently does the need for this feature arise,
in practice? I understand it is relatively common in ecosystems like Google's,
where coördinating a major version upgrade frequently requires a "phased"
approach where multiple versions are used concurrently for a period of time. But
I personally have never experienced this need, and an informal poll of my peers
also doesn't suggest it's anything near common. To be clear, I'm not saying it's
not valuable. But it seems clear to me that the benefits of making it mandatory
for everyone in an ecosystem don't come anywhere close to justifying the costs
it incurs.

SIV should be removed from modules' design.

## lol u thought

Of course, that's almost certainly not going to happen. Even if you buy my
rationale, modules' design is _de facto_ frozen — the process that led us to
this point is a totally separate discussion — so what improvement could we
realistically work towards?

Earlier I distinguished identifiers as used internally (plumbing) from
identifiers used in UX (porcelain). If there were a way to remove SIV and
restore the intuitive notions of identity and version from the porcelain, while
keeping SIV and the stricter definitions of identity and version in the
plumbing, I'd be perfectly happy. It's an approach that seems to be suggested
by the authors, though always kind of implicitly.

It's possible to envision a new porcelain subcommand in the `go` tool that uses
the intuitive notion of identity and version consistently, and would translate
to the SIV grammar where and when necessary. It's also possible that Go users
would, eventually, understand that subcommand and its various editor
integrations as the primary way to work with dependencies. But I think the
tricky part is the import statments in the source files themselves, which seem
to me to be unavoidably part of the UX and also would unavoidably need to keep
their more-restrictive SIV semantics to consumable by tooling. One solution I
can see there is to introduce the concept of a mapping from human-identity
import statement to SIV-identity module name. Are there others?
