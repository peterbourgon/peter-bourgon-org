{
	"template": "../inc/arbitrary-page.template.source",
	"title": "Go and the modern enterprise"
}

---

_This was originally a talk in February, 2015 at [FOSDEM](http://www.fosdem.org) and the London Go meetup.<br/>
[Find the video here](#)._

1. [The modern service-oriented enterprise](#the-modern-enterprise)
1. [What Go needs: a Go kit](#what-go-needs)
1. [Let's collaborate](#next-steps)


<!--
Go recently celebrated its [5<sup>th</sup> birthday](http://blog.golang.org/5years).
In half a decade, the language has enjoyed great success in a huge range of projects, from
 [commandline tools](https://github.com/tsenart/vegeta), to
 [powerful](https://github.com/boltdb/bolt)
 [databases](https://github.com/soundcloud/roshi), to
 [infrastructure orchestration](https://github.com/hashicorp/terraform),
 [containerization](https://github.com/docker), and
 [monitoring](https://github.com/prometheus/prometheus) systems.
It's rare that a day goes by without a front-page [Hacker News](http://news.ycombinator.com) post about Go in some capacity.
Yet while Go is strongly represented in individual components and systems,
 it seems under-represented in the business domain of large, trend-setting organizations --
 companies I'll refer to as **the modern enterprise**.
-->

<a name="the-modern-enterprise"></a>
## The modern enterprise <a class="lite" href="#the-modern-enterprise">&#8734;</a>

When we read the word _enterprise_ we probably think of older, slow-moving bureaucracies, like IBM, HP, or even Red Hat.
But it's been a long time since companies like those have been technical leaders. Decades, in some cases.
Now, companies like Google, Amazon, Twitter, Netflix, Facebook, Spotify, or even SoundCloud set the tone for our industry.
These _modern enterprises_ tend to share a few characteristics:

- Tech-oriented
- Consumer-focused
- Successful, exponential growth
- 100&ndash;1000+ engineers
- A service-oriented architecture

The last point in particular is important.

<a name="a-service-oriented-architecture"></a>
### A service-oriented architecture <a class="lite" href="#a-service-oriented-architecture">&#8734;</a>

With notable exceptions, most major modern enterprises have adopted a service-oriented (or microservice) architecture,
 after very similar patterns of evolution.

1. Start with a Ruby-on-Rails (or equivalent) **monolith**
1. Break out key components as services, leading to an **SOA**
1. Maybe, further deconstruction toward **microservices**

SOAs yield
 [big advantages](https://en.wikipedia.org/wiki/Service-oriented_architecture#Organizational_benefits),
 but [they come at a cost](http://highscalability.com/blog/2014/4/8/microservices-not-a-free-lunch.html).
Any set of network services is inherently more complex than its monolithic equivalent, owing to the well-documented
 [fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing).
Managing that complexity usually begins with conventions and best practices,
 which eventually evolve into libraries and frameworks.
In the modern enterprise, de-facto standards are beginning to emerge, often as open-source projects.
From my perspective, [Twitter's Finagle](https://twitter.github.io/finagle) seems to be the most notable.
[Netflix](https://netflix.github.io/) also maintains a stack that appears in many discussions.
And there are for sure many other codebases fulfilling the same general role, maintained by smaller organizations.

These libraries are primarily written in Scala, and have some limited interop with other JVM languages.
Scala has a lot of advantages in this space: it's expressive, permissive, and reasonably fast.
But it's not a panacea; by any measure it's hugely complex,
 with an undeniably difficult toolchain, and often unclear -- even contradictory -- language design.
Which means it's well-understood by few, and perhaps completely understood by none.
The inevitable consequence is antipatterns: cargo-culting, reinventing,
 patching misunderstood problems with leaky abstractions, and so on.

In this environment, a language like Go has the opportunity to shine.
Its coherent and considered design, developer friendly toolchain, architecture native binaries, and near C efficiency
 make it incredibly attractive in a service-oriented architecture,
 especially when compared against the current state of the art.
Go also punches well above its age-class in terms of library and ecosystem maturity, and in-the-wild success stories.
But we don't -- yet -- have a mature, **comprehensive** distributed services toolkit.
I think that's a gap that's ready to be filled.

<!--
Previous generations of developers focused largely on _the web framework_,
 because last-gen companies were building big, responsive, data-driven websites.
But modern enterprises do more: they implement more and bigger features, provide greater value,
 with what is typically an ad-hoc distributed system.
Modern languages and language ecosystems need to respond to this reality, and provide a _distributed system framework_
 to enable these organizations to achieve their goals.
I believe Go needs an entry in this space to reach the next level of its success.
-->

<a name="what-go-needs"></a>
## What Go needs <a class="lite" href="#what-go-needs">&#8734;</a>

I believe Go needs a Finagle-style toolkit -- a _Go kit_ --
 to allow it to be a viable alternative language in the modern service-oriented enterprise.

<a name="go-kit"></a>
### Go kit <a class="lite" href="#go-kit">&#8734;</a>

I imagine a Go kit composed of multiple co-related packages, that together
 form an opinionated framework for constructing large SOAs.
The toolkit should be comprehensive, ticking all of the boxes that are important to system architects.
It should do that while encoding strong opinions and conventions,
 informed by the operational experience of its contributors,
 as well as prior art like Finagle.
And it should integrate with the most common infrastructural components,
 to reduce deployment friction and promote interop with existing systems.

I imagine the toolkit would need a minimum set of core packages.
I'll describe what I envision for each, but keep in mind this is just my own set of opinions.
I'm primarily interested in [starting a discussion](#next-steps), and realizing a collective vision.

<a name="package-metrics"></a>
### package metrics <a class="lite" href="#package-metrics">&#8734;</a>

Both clients and servers need thorough instrumentation.
That means general runtime metrics, like memory and CPU profiling, GC information, and so on.
It also means app-level metrics, like request durations, internal queue depths,
 and per-stage latencies for e.g. in-process pipelines.
And it includes business-level metrics, like domain-model event throughput, or high-level latency deviance from SLAs.

I imagine a package metrics would have first-order concepts of counters, histograms, and gauges.
We have an existing basis for exposition in [package expvar](http://golang.org/pkg/expvar),
 and so I imagine the toolkit's metrics would use expvar as a source of truth,
 and provide parameterized exporters to multiple instrumentation backends, like
 [Prometheus](http://prometheus.io),
 [statsd](https://github.com/etsy/statsd),
 [Graphite](http://graphite.readthedocs.org/en/latest) directly,
 [InfluxDB](http://influxdb.com), and so on.

<a name="package-log"></a>
### package log <a class="lite" href="#package-log">&#8734;</a>

Organizations will have their own requirements for log levels, schemas, and destinations.
I imagine the toolkit could leverage [package log](http://golang.org/pkg/log) at the core,
 and provide an abstraction for optional modules, for things like
 level splitting, schema declaration and enforcement, and different backends.
It could support plain stdout/stderr, as well as systems like
 [syslog](http://golang.org/pkg/log/syslog),
 [NSQ](https://github.com/bitly/nsq),
 [Kafka](https://kafka.apache.org),
 and so on.

Our toolkit's log package should ultimately be usable for all kinds of log-structured data,
 not just diagnostic application logs.

<a name="package-server"></a>
### package server <a class="lite" href="#package-server">&#8734;</a>

Package server is probably the biggest and most important component of the toolkit.
Ideally, we should be able to write our services as implementations of normal, nominal Go interfaces,
 and delegate integration with the environment to the server package.
The package should encode and enforce conventions for server-side concerns, like
 health checks, system-wide request tracing, connection management, backpressure and throttling, and so on.
For each of those topics, it should provide interfaces for different, pluggable strategies.
It should integrate with [service discovery](#service-discovery),
 and work equally well over multiple [transports](#package-transport).
Considerable prior art exists in the form of
 [Finagle](https://twitter.github.io/finagle),
 [Karyon](https://github.com/Netflix/karyon) (Netflix's application service library),
 and likely many more.

<a name="package-client"></a>
### package client <a class="lite" href="#package-client">&#8734;</a>

Package client is the natural companion to package server.
It should encode and enforce conventions for client-side concerns,
 like request tracing, rate limiting, circuit breaking, connection pooling, and so on.
Same as package server, it should integrate with [service discovery](#service-discovery),
 and work equally well over multiple [transports](#package-transport).
And prior art exists in the form of Finagle and [Ribbon](https://github.com/Netflix/ribbon), among others.

Where appropriate, package client and server should share code.
For example, connection pooling, rate limiting, and request tracing all share a common core
 that can exist independently of the specific implementations.

<a name="service-discovery"></a>
### Service discovery <a class="lite" href="#service-discovery">&#8734;</a>

The business of connecting clients to servers in a dynamic environment is a huge topic in itself.
Suffice to say there are many strategies, from static endpoints, to dynamic topology subscriptions, and everything in between.
The toolkit should ultimately be compatible with whichever infrastructure is in use at your organization.
At a minimum, that means support for hard-coded lists of endpoints,
 and deep integration for fully-distributed systems i.e. DNS SRV records,
 centralized systems like [Consul](http://consul.io) or [etcd](https://github.com/coreos/etcd),
 and hybrid systems like [Airbnb's SmartStack](http://nerds.airbnb.com/smartstack-service-discovery-cloud/).

<a name="package-transport"></a>
### package transport <a class="lite" href="#package-transport">&#8734;</a>

Service implementations should be decoupled from their transports.
A single service should be able to bind listeners to, and serve identically over, multiple transports.
And here I mean transport in a broad sense:
 from request/response de/serialization (e.g. JSON, [package gob](http://golang.org/pkg/encoding/gob))
 up to and including IDL semantics (e.g. Protocol Buffers, Thrift, Avro)
 as well as the underlying transport for those messages (e.g. HTTP, [package rpc](http://golang.org/pkg/rpc), raw TCP).

With package transport, our goal is to allow the service author to work exclusively in their business domain,
 and leave the details of the communication mechanism to the toolkit.

<a name="the-benefits"></a>
## The benefits <a class="lite" href="#the-benefits">&#8734;</a>

If our distributed system reliably abides a set of conventions,
 we can leverage them as simplifying assumptions,
  and build a more comprehensible and reliable mental model.
After all, [simplicity is a prerequisite for reliability](http://en.wikiquote.org/wiki/Edsger_W._Dijkstra).

Even further: imagine a tool that leverages conventions to give deep introspection of the overall system at runtime.
It might allow us to compare the same dimensions of instrumentation across heterogeneous service instances.
Or expose and isolate particular request pathologies.
With that information, we could create feedback systems,
 to allow the system to dynamically react to environmental conditions.
It would enable advanced operational patterns like load-based autoscaling,
 or safe continuous deployment without operator involvement.

That's just one immediately obvious way to cash in on the taxes we've paid, and convert them to real business value.
But the future is wide open, full of possibilities we haven't yet imagined.

<a name="next-steps"></a>
## Next steps <a class="lite" href="#next-steps">&#8734;</a>

--

<br>________<br>*[Go back to my website](/), or [follow me on Twitter](http://twitter.com/peterbourgon).*
