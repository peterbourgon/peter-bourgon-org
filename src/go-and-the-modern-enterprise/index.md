{
	"template": "../inc/arbitrary-page.template.source",
	"title": "Go and the modern enterprise"
}

---

_This was originally a talk in February, 2015 at [FOSDEM](http://www.fosdem.org) and the London Go meetup.
[Find the video here](#)._

1. [The modern enterprise and the SOA](#the-modern-enterprise)
1. [What Go needs: a Go kit](#what-go-needs)
1. [Let's collaborate](#next-steps)

Go recently celebrated its [5<sup>th</sup> birthday](http://blog.golang.org/5years).
In half a decade, the language has enjoyed great success in a huge range of projects, from
 [commandline tools](https://github.com/tsenart/vegeta), to
 [powerful](https://github.com/boltdb/bolt)
 [databases](https://github.com/soundcloud/roshi), to
 [infrastructure orchestration](https://github.com/hashicorp/terraform),
 [containerization](https://github.com/docker), and
 [monitoring](https://github.com/prometheus/prometheus) systems.
It's rare that a day goes by without a front-page [Hacker News](http://news.ycombinator.com) post about Go in some capacity.
Yet it seems that Go has been conspicuously absent in the tech stacks of large, trend-setting tech organizations -- companies I'll refer to as **the modern enterprise**.

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

Most of the points are flexible, but the last one is important.

<a name="the-service-oriented-architecture"></a>
### The service-oriented architecture <a class="lite" href="#the-service-oriented-architecture">&#8734;</a>

With notable exceptions, most major modern enterprises have adopted a service-oriented (or microservice) architecture,
 after very similar patterns of evolution.

1. Start with a Ruby-on-Rails (or equivalent) **monolith**
1. Break out key components as services, leading to an **SOA**
1. Maybe, further deconstruction toward **microservices**

SOAs yield
 [big advantages](https://en.wikipedia.org/wiki/Service-oriented_architecture#Organizational_benefits),
 but they come at a cost.
Any set of network services is inherently more complex than its monolithic equivalent, owing to the well-documented
 [fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing).
Managing those complexities becomes the job of conventions and best practices.
And those practices can be collected and codified into libraries and frameworks.
In the modern enterprise, de-facto standard libraries are beginning to emerge, often as open-source projects.
From my perspective,
 [Twitter's Finagle](https://twitter.github.io/finagle) seems to be the most notable.
 [Netflix](https://netflix.github.io/) also maintains a stack that appears in many discussions.
And there are countless other, smaller organizations that maintain their own frameworks.

Go has the opportunity to shine here.
Its coherent and considered design, developer friendly toolchain, architecture native binaries, and near C efficiency
 make it incredibly attractive in a service-oriented architecture,
  especially when compared against the current state of the art.
Go also punches well above its age-class in terms of library and ecosystem maturity, and in-the-wild success stories.
But we don't -- yet -- have a mature, **comprehensive** library/framework for the requirements of the modern SOA.
I think that's a gap that's ready to be filled.

<a name="what-go-needs"></a>
## What Go needs <a class="lite" href="#what-go-needs">&#8734;</a>

I believe Go needs a Finagle-style toolkit, a Go kit, to allow it to be a viable alternative language in the modern service-oriented enterprise.

<a name="go-kit"></a>
### Go kit <a class="lite" href="#go-kit">&#8734;</a>

I imagine a Go kit, composed of multiple co-related packages, that together
 provide an opinionated framework for constructing large SOAs.
The toolkit should be comprehensive, ticking all of the boxes that are important to system architects.
It should do that while encoding strong opinions and conventions,
 informed by the operational experience of its contributors,
 as well as prior art like Finagle.
And it should integrate with the most common infrastructural components,
 to reduce deployment friction and promote interop with existing systems.

I imagine the toolkit would need a minimum set of core packages.
I'll describe what I envision for each, but bear in mind this is just my own set of opinions.
I'm primarily interested in [starting a discussion](#next-steps), and realizing a collective vision.

<a name="package-metrics"></a>
### package metrics <a class="lite" href="#package-metrics">&#8734;</a>

Both clients and servers need thorough instrumentation.
That means general runtime metrics, like memory and CPU profiling, GC information, and OS details like open file descriptors.
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
 and provide a common mechanism to plug-in modules for level splitting, schema declaration and enforcement,
  and different backends, like plain stdout/stderr,
  [syslog](http://golang.org/pkg/log/syslog),
  [NSQ](https://github.com/bitly/nsq),
  [Kafka](https://kafka.apache.org),
  and so on.
Our toolkit's log package should ultimately be usable for all kinds of log-structured data,
 not just diagnostic application logs.

<a name="package-server"></a>
### package server <a class="lite" href="#package-server">&#8734;</a>

Package server is probably the biggest and most important component of the toolkit.
It should encode and enforce conventions for server-side concerns, like
 health checks, system-wide request tracing, connection management, backpressure and throttling, and so on.
For each of those topics, it should provide interfaces for different, pluggable strategies.
It should integrate with [service discovery](#service-discovery),
 and work equally well over multiple [transports](#package-transport).
Considerable prior art exists in the form of
 [Finagle](https://twitter.github.io/finagle),
 [Karyon](https://github.com/Netflix/karyon) (Netflix's application service library),
 and likely many more.

In the best case, we want to declare our services as normal, nominal Go interfaces,
 expressing business-domain semantics.

    type FriendBearService interface {
        Dance(time.Duration)
        Irrigate(int) error
    }

But if accomplishing our goals requires deeper integration, we should be willing to pay that tax.
For example, threading a
 [context.Context](http://godoc.org/golang.org/x/net/context) through each method, as described in
 [the golang.org blog post](http://blog.golang.org/context):

> "At Google, we require that Go programmers pass a Context
> parameter as the first argument to every function on the
> call path between incoming and outgoing requests."

That is,

    type FriendBearService interface {
        Dance(context.Context, time.Duration)
        Irrigate(context.Context, int) error
    }

We should extend the same spirit to all packages in the toolkit.

<a name="package-client"></a>
### package client <a class="lite" href="#package-client">&#8734;</a>

Package client is the natural companion to package server.
It should encode and enforce conventions for client-side concerns,
 like request tracing, rate limiting, circuit breaking, connection pooling, and so on.
Same as package server, it should integrate with [service discovery](#service-discovery),
 and work equally well over multiple [transports](#package-transport).

<a name="service-discovery"></a>
### Service discovery <a class="lite" href="#service-discovery">&#8734;</a>

The business of connecting clients to servers in a dynamic environment is a huge topic in itself.
Suffice to say there are many strategies, from hard-coded endpoints, to topology subscriptions, and everything in between.
The toolkit should ultimately be compatible with whichever infrastructure is in use at your organization.
At a minimum, that means support for static lists of endpoints,
 and deep integration for fully-distributed systems i.e. DNS SRV records,
 centralized systems like [Consul](http://consul.io) or [etcd](https://github.com/coreos/etcd),
 and hybrid systems like [Synapse](https://github.com/airbnb/synapse)/[Nerve](https://github.com/airbnb/nerve).

<a name="package-transport"></a>
### package transport <a class="lite" href="#package-transport">&#8734;</a>

Lorem ipsum.

<a name="package-inspect"></a>
### package inspect <a class="lite" href="#package-inspect">&#8734;</a>

Lorem ipsum.

<a name="next-steps"></a>
## Next steps <a class="lite" href="#next-steps">&#8734;</a>

Lorem ipsum.

<br>________<br>*[Go back to my website](/), or [follow me on Twitter](http://twitter.com/peterbourgon).*
