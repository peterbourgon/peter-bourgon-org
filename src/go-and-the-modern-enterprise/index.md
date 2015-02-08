{
	"template": "../inc/arbitrary-page.template.source",
	"title": "Go and the modern enterprise"
}

---

_This was originally a talk in February, 2015 at [FOSDEM](http://www.fosdem.org) and the London Go meetup.
[Find the video here](#)._

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
With notable exceptions, most major modern enterprises have adopted a service-oriented (or _microservice_) architecture,
after very similar patterns of evolution.

1. Start with a Ruby-on-Rails (or equivalent) **monolith**
1. Break out key components as services, leading to an **SOA**
1. Maybe, further deconstruction toward **microservices**

Service-oriented architectures yield
 [big advantages](https://en.wikipedia.org/wiki/Service-oriented_architecture#Organizational_benefits),
 but they come at a cost.
Any set of network services is inherently more complex than its monolithic equivalent, owing to the well-documented
 [fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing).
Dealing with those complexities becomes the job of conventions and best practices.
Those idioms can be collected and codified into libraries and frameworks.
In the modern enterprise, de-facto standard libraries are beginning to emerge, often as open-source projects.
From my perspective, [Twitter's Finagle](https://twitter.github.io/finagle) seems to be the most notable.
[Netflix](https://netflix.github.io/) also maintains a stack that appears in many discussions.
And there are countless other, smaller organizations that maintain their own idiomatic frameworks.

—

It's here, I think, that Go really has the opportunity to shine.
Go's coherent and considered design, developer friendly toolchain, architecture native binaries, and near C efficiency
 make it incredibly attractive in a service-oriented architecture.
Go also punches well above its age-class in terms of library and ecosystem maturity, and in-the-wild success stories.



<a name="structured-services"></a>
## Structured services <a class="lite" href="#structured-services">&#8734;</a>

Lorem ipsum dolor sit.

<a name="what-go-needs"></a>
## What Go needs <a class="lite" href="#what-go-needs">&#8734;</a>

Lorem ipsum dolor sit.

<br>________<br>*[Go back to my website](/), or [follow me on Twitter](http://twitter.com/peterbourgon).*
