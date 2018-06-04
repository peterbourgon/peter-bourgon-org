{
"template": "../inc/arbitrary-page.template.source",
"title": "Observability: the hard parts"
}
---

_This was originally a talk at <a href="https://monitorama.com">Monitorama PDX 2018</a>._

<a name="context-setting" />

### <a href="#context-setting">Context-setting</a>

This is an experience report. A colleague and I have been working on leveling-up
the observability story within Fastly's engineering org. I suspect a lot of you
are thinking about starting, or in the middle of, similar initiatives. I thought
it would be useful to talk about the interesting successes and failures we've
had. I'll step through the life of the project, highlighting interesting
discoveries along the way, and then summarize the key takeaways at the end. As
it turns out, the technical challenges were actually the easy ones: the hard
parts have been largely social and political.

<a name="history-of-fastly" />

### <a href="#history-of-fastly">A brief history of Fastly</a>

To understand our operating context, I guess it's necessary to understand a
little bit about Fastly the company. Fastly is an edge cloud and content
delivery network. We started in 2011 and have a slightly different take on the
market: we use beefier machines in our POPs, and a relatively modern software
stack, to provide a more featureful and programmable edge product.

Fastly has historically been an engineering org of mostly senior engineers. This
was by design, and allowed great product and technical velocity at the outset,
and continued as we grew to our current size of about 120 engineers. But like
any technical decision, there are both benefits and risks.

Teams of senior engineers bring their experience with them. They also operate
quite autonomously. This has the inevitable result of a heterogeneous mix of
designs, implementations, and support tooling—including monitoring.

Our monitoring universe grew organically, and organic growth of software tends
to be append-only. Initially ad-hoc dashboards, proving their value through the
course of time, would become canon. Incident-driven alerts specialized to
specific or quixotic symptoms would be created but, of course, rarely audited.
Over a period of years, these patterns produced highly-specialized monitoring
regimes: essentially local optima that worked well in the small, but didn't
benefit from coherence in the large.

To be clear: this is desirable, to a degree. But even organic gardens need to be
weeded sometimes.

<a name="goals" />

### <a href="#goals">Goals</a>

Concretely, we want to be able to answer these questions for all of our
production systems:

- Is the system currently healthy?
- If not, why not? Where can we begin debugging?

We want to make sure that any engineer in the organization can answer these
questions for any service, with only an introductory understanding of our
architecture.

<a name="non-goals" />

### <a href="#non-goals">Non-goals</a>

Goals are obviously important to direct design and development efforts.
Non-goals are even more important, to scope the work and keep the project
tractable.

Observe that the questions we want to answer are focused on the present moment.
Answering them accurately requires some degree of historical data, but not a
lot. Marcus did some investigation of how our existing monitoring systems were
used by internal customers. The vast majority of collected metrics were queried
only over the last few hours or days. And despite collecting thousands of
metrics per host, only perhaps tens of those metrics were queried with any
regularity. The actual usage patterns&mdash;which were hugely different than the
usage patterns that teams _said_ they had&mdash;helped us to work within
Prometheus' limitations. We would have only short data retention in the initial
few versions of the infrastructure, order of weeks. Anything longer would be a
separate initiative, after the initial rollout.

We're also laser-focused on internal systems, owned and operated by the
engineering org. We won't build a system that serves other use cases, or is
subject to other SLAs. One common example is surfacing data to customers. In our
industry, for online multi-tenant systems, there's a pretty clear line of
demarcation between operational telemetry for our own systems, and (for lack of
a better phrase) customer metrics, data showing us the experience of our
customers. We already had reasonably mature systems in place for the latter, and
didn't want to expand the scope or risk profile to include them in our work.

It's also important to understand the role of metrics in the broader context of
observability, especially relative to the other two pillars of logging and
tracing. Metrics are a great fit for reactive requirements like dashboards and
alerts, and can provide a good system overview, but aren't great for
investigation. Metrics are complementary to a good logging pipeline, and our
system shouldn't try to supplant those use cases.

<a name="strategy" />

### <a href="#strategy">Strategy</a>

Having identified and scoped the problem, my colleague Marcus and I formed a
project team to do the work. We both had pretty extensive domain knowledge:
Marcus in Fastly, me in Prometheus, and both of us in observability work in
general. This would be our primary, though not exclusive, focus for about a
year.

After a domain survey and technology review, we settled on the following plan:

1. Deploy Prometheus across our infrastructure
1. Add duplicate Prometheus instrumentation to our own services
1. Deploy Prometheus exporters for our third-party services
1. Write a new, curated set of dashboards and alerts for everything
1. Run all systems in parallel, to build confidence
1. Decommission old systems on a well-communicated future date

We would start by paving out the infrastructure using the tracer bullet
methodology. That is, build a working solution quickly, but correctly, in the
production environment, and using designs and techniques that are
production-quality. This requires good familiarity with all of the tools, but it
avoids a messy "productionization" step between prototype and final product.

&mdash;

To validate our plan would work, we'd pick a couple of services that would cover
a reasonable cross-section of use cases. Some would be third-party, and we'd
deploy the expoters; some would be in-house, and we'd either instrument them
ourselves, or pair with the teams to instrument them. Finding friendly and
enthusiastic internal alpha customers was crucial: they give us necessary
context, and a testing ground for our theoretical workflows. If, after a short
timebox, our alpha customers are happy, we have reasonable justification to
carry on.

<a name="rollout" />

### <a href="#rollout">Rollout!</a>

The initial spike took just under a month, and was a success. The roadblocks we
hit in our infrastructure were surmountable, and our alpha customers were happy
and enthusiastic.

The next step, then, was to inventory the company, and priority-rank teams and
services by whatever criteria made sense. For us, this was a mix of production
criticality and some notion of friendliness—better to have the folks eager to
help earlier on, while we iron out the kinks. We created a burndown chart
(really, a spreadsheet) with progress for each service. Of course, it grew over
time, as we found more and more services hiding in the cracks. Each service
progressed through stages: kickoff, instrumentation, production wire-up,
dashboarding and alerting, and finally done. Time to start grinding it out!

<a name="the-grind" />

### <a href="#the-grind">The grind</a>

Here's where things get interesting. This was based on a mostly-successful
strategy I witnessed at SoundCloud. We went with an embedded expert/consultant
model, where I would personally rotate through teams in sequence, and
essentially pair with them for a period of one to two weeks. The key realization
was that the technical details are pretty rote and not difficult; the problem is
actually social and educational. That is, getting engineers to understand first
how the Prometheus model works, but more importantly why the things we're doing
are important and necessary. Since many teams have been operating in successful,
locally-optimized silos for a long time, this boils down to a practice of
empathy.

<a name="instrument" />

### <a href="#instrument">1. Instrument</a>

Step one is to help you instrument your code. In many cases, this was an hour or
two of pair programming, followed by a round or two of PR review. Prometheus has
a good local testing story, which was a big selling point for some engineers.

One small mistake I made: trying to lay out the process exhaustively, before the
fact. Much of that guidance would change, as we went through the process with
different teams. What worked a lot better was allowing common patterns to emerge
naturally, and document them post-facto. This requires more high-touch work at
the outset, but that turns out to be inevitable, anyway.

<a name="documentation" />

<a href="#documentation" style="text-decoration: none;">&mdash;</a>

The documentation portal became an important center of mass. It was a GitHub
wiki, with a roughly even split between post-hoc HOWTO-style guides, and a FAQ
of specific questions as they arose. There was also a large section of case
studies, narratively describing the path of several teams; this was helpful for
the many engineers who are most successful following the examples of others. But
the real benefit of the portal, I think, was sprinkling every
observability-related conversation with deep links to answers or more
information. This socializes and reinforces the documentation site as a source
of authority, making people more able to help themselves in the future.

<a name="wire-up" />

### <a href="#wire-up">2. Wire-up</a>

Once the code was instrumented and deployed, the next step was to get it plumbed
into the Prometheus infrastructure. Often, this required deploying that
Prometheus infrastructure info a new corner of our infrastructure. This was
easily the most time-consuming and trickiest technical part of the project,
especially at the beginning, when we were still discovering and defining best
practices. Our heterogeneous services had heterogeneous deployment models, and
it took a long while to have good answers for all of them. Even once that was
mostly done, new teams would invariably require exceptions. Over the life of the
project, I think we were most often bottlenecked when trying to realize our
design or architectural vision against the organic nature of our actual
infrastructure.

<a name="optimization-and-technical-debt">

<a href="#optimization-and-technical-debt" style="text-decoration: none;">&mdash;</a>

These challenges were the most tractable consequence of a natural tension I
alluded to earlier: between letting engineers choose the best tool for their job
in isolation i.e. local optimization, and standardizing on common models and
practices i.e. global optimization. The discussion of which to favor and why
needs to happen continuously and transparently, with everyone involved in the
engineering org. My experience is that most orgs don't address the concern
directly enough, and naturally bias toward local optimization in service to
development velocity.

This should be understood as technical debt: fine to do, as long as it's scoped,
and done with a proper accounting of the costs. Indefinite deferral becomes
exponentially more difficult to unwind, and, left unchecked, can derail teams or
entire engineering orgs for years. And so, I think in a very real sense,
leveling up your observability story can be understood as paying down technical
(observability) debt accrued in service to velocity.

<a name="dashboards-and-alerts">

### <a href="#dashboards-and-alerts">3. Dashboards and alerts</a>

Once the metrics are being collected, it's time to do something useful with
them. This generally means a basic service dashboard and set of alerts, to
answer our initial questions:

- Is the system currently healthy?
- If not, why not? Where can we begin debugging?

Many teams had built both in other products, which were generally
straightforward to port over. That porting process gives us an opportunity to
weed our garden of years of cruft. I asked each team these core questions, and
tried to make sure we'd only build things that would answer them. A good
dashboard is a carefully curated set of visualizations, in service to specific
goals—not everything that could possibly or theoretically be relevant.

Similarly, alerts tended to grow over time, often in response to specific
incidents. But a good set of alerts is similarly minimal, focused on high-level
service metrics, not low-level technical details. For example, it's almost
always incorrect to alert on e.g. CPU load; much better to prefer alerts on e.g.
90th quantile request latency, or the time a job spends waiting in queues.

How this work got done was on a spectrum, based on interest and available
resources on a team. On one extreme, the team could take care of it themselves
entirely: there was (eventually) comprehensive, step-by-step documentation for
both concerns on the documentation portal. On the other extreme, especially at
the beginning of the project, I would often volunteer to prototype both a
dashboard and initial set of alerts for the team, and ask them for review and
feedback when I was done. And, in the middle, we could model it as another
pairing session, where I would teach them the power of PromQL and the horrors of
Grafana.

<a name="empathy" />

<a href="#empathy" style="text-decoration: none;">&mdash;</a>

It's easy enough to do research and compile a set of best practices for
dashboards and alerts. It's even easy to enumerate that reasoning in a clear
way, on demand, in classes, or in pairing sessions. What's difficult is
convincing engineers with workflows that have historically worked for them that
it's worth trying something different, in service to higher-order goals. This is
the real challenge of any org-wide hearts-and-minds project. And it's why
embedding (or something akin to it) is essential.

Every conversation I have when embedded begins as a fun little exploration, a
dance, where I try to identify the context of the other person. I need to do
this before I start giving any information. I have a lot of choices for the type
and amount of information to give, essentially where to start the conversation,
and starting it in the wrong place can be a disaster.

Engineers—or, really, humans—by and large need to be met where they are. The
promise of better pastures is tempered by the pain of the journey to them. We
can improve this ratio by making the promise greater, or more real. We can do
that by delivering immediate and clear benefit in the form of the new ways. We
can also improve the ratio by making the costs lesser. We can do that by
shouldering some or much of the initial burden. In truth I think a successful
enterprise must do both.

Getting by with something you already know is always easier, preferable, to
learning something new. So to change the behavior of an entire org you have to
motivate an excitement, de-program the fear, and help people escape the trap of
learned helplessness. The only way this works is by establishing a connection,
demonstrating understanding, and practicing empathy.

<a name="follow-through" />

### <a href="#follow-through">Follow-through</a>

We have a few major departments within engineering, and each department has
several teams, each with three to ten engineers. Service ownership is often
indistinct, with many services in maintenance mode, without clear stewards. This
isn't a bad thing! It just means someone in my position needs to do the work to
identify owners, and get work prioritized. At the beginning, with eager alpha
customers, this is easy. But as things drag on, and the easy wins are won,
buy-in at the top of the org chart is essential.

Teams and and will ignore carrot-based motivation, and sometimes need nudging
with a stick. Ultimately, that can only come from senior leadership. Without a
clear mandate and deadlines, and org-wide refactor like this devolves into a
forever project, with 100% probability. (Even with a clear mandate and
deadlines, some percentage of teams will always lag behind.)

<a name="hard-bits" />

### <a href="#hard-bits">Hard bits</a>

Now, a few difficult or unexpected twists.

We anticipated that empathy would be important, but we didn't anticipate just
how important it would be. In particular, fighting learned helplessness was
tricky, and there were no shortcuts.

A few teams didn't want to buy in until the system was considered production
stable. That's understandable, but it's difficult to square with the fog-of-war
and progressive reification of patterns that we had to traverse, especially
regarding infrastructural patterns. Describing the system as "a Google-style
beta" seemed to satisfy most of these teams and get them on-board.

We also underestimated the importance of socializing infrastructural and on-call
knowledge in the SRE team, where both Marcus and I were based. Two is the
perfect team size for quickly developing and deploying a project like this, but
two engineers isn't enough to run the system in perpetuity. We should have
brought in additional support earlier in the process, even informally, to expand
the pool of engineers who were knowledgable about the system.

Alerting in the world of Prometheus is still a no-man's land. Alertmanager is a
powerful but half-finished product. We've patched it up around the edges to make
it servicable, but it needs a great deal of love and attention before it reaches
the level of engineering maturity that Prometheus clearly demonstrates.

<a name="what-worked-really-well" />

### <a href="#what-worked-really-well">What worked really well</a>

Now, some things that worked really well, most of which I've mentioned in
passing already.

A team of two was hugely productive. I think this is the perfect team size for a
project of this scope in an organization the size of Fastly. Communication
overhead costs are real and worth optimizing for.

The embedding/consultant model was successful, and I think is essential for any
project of this scope. Neither carrots nor sticks, in isolation or in
combination, can substantively change practices. Real change requires
connection, understanding, and empathy.

Prometheus itself is a marvel of engineering: simple, stable,
resource-efficient. It's highly adaptable to a large number of deployment
scenarios, and seems to play well in all of them. We're very pleased with the
choice.

GitOps-style resource management, where a Git repo is the source of truth for
infrastructural configuration, definitely has rough edges, especially where it
interfaces with Grafana, which has only just started being retrofit to support
this style of workflow. But overall it's been well-understood, especially by our
engineers, and it seems to be the most correct pattern for infrastructure
management. If you're working on a project in this space, you should probably
use GitOps to manage change. If you're writing tools to serve this space, you
need a strong story around repository-sourced resources. This means online
reading resources from disk, a compact resource declaration format, robust (i.e.
non-fatal) syntax and sanity checks, and so on.

<a name="outcome" />

### <a href="#outcome">Outcome</a>

So we're in the final stretches now—famous last words, huh?—but all signs are
positive. Hopefully I've given you some food for thought, and you can learn from
our successes and mistakes.
