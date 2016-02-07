{
    "title": "Logging v. instrumentation"
}
---
Logging and instrumentation are two perennially hot topics in software development generally,
and seem to be enjoying a certain renaissance in the context of microservices particularly.
And I see quite a lot of confusion on the topic.
What, precisely, should services log?
To what level of detail?
Where should those logs go: to a syslog daemon, to files on disk, to a message queue?
When is it appropriate to start instrumenting your code?
Once you've started, what sort of information should you be recording?
And what metrics system makes sense?

## Logging

In my opinion, my [thesis](http://peter.bourgon.org/go-in-production/#logging-and-telemetry)
 from GopherCon 2014 still holds: services should **only log actionable information**.
That includes serious, panic-level errors that need to be consumed by humans,
 or structured data that needs to be consumed by machines.
An example of the former would be a message signaling that a required database
 has become completely unavailable.
An example of the latter would be a message indicating a media object has been played,
 recorded so an end-of-day batch process might calculate owed royalties.
Logs read by humans should be sparse, ideally silent if nothing is going wrong.
Logs read by machines should be well-defined, ideally with a versioned schema.

Because logging has relatively limited applicability,
 I tend to favor log packages with a minimum surface area.
Avoid multiple production log levels (info, warn, error) and especially runtime level configuration.
After all, you should only be logging information that needs to be seen!
An exception is debug logging, which is useful during development and problem diagnosis.

Operationally, logs should be [treated as event streams](http://12factor.net/logs).
Quoting from [12factor](http://12factor.net/), because I couldn't say it any better:

> A (service) never concerns itself with routing or storage
> of its output stream. It should not attempt to write to
> or manage logfiles. Instead, each running process writes
> its event stream, unbuffered, to `stdout`.

It's the responsibility of your operating environment or infrastructure
 to route process or container stdout/stderr to the appropriate destination.
That could be a centralized log system like an [ELK stack](https://www.elastic.co/webinars/introduction-elk-stack),
 a set of rotated log files managed by a supervisor like [runit](http://smarden.org/runit/),
 or a durable message broker like [Kafka](https://kafka.apache.org/).
It's a violation of the [principle of least knowledge](https://en.wikipedia.org/wiki/Law_of_Demeter)
 to move this responsibility into your service.

Finally, understand that logging is expensive.
I've seen entire teams of absolutely brilliant engineers spend _years_
 building, managing, and evolving logging infrastructure.
It's a hard problem, made much harder by overburdening the pipelines with unnecessary load.
Resist the urge to log any information that doesn't meet the above criteria.
As a concrete example, logging each incoming HTTP request is almost certainly a mistake,
 especially on a service that's in the hot-path for your product.
That kind of high-volume data is a better match for instrumentation.

## Instrumentation

Instrumentation is for all remaining diagnostic information about your service.
In contrast to logging, services should **instrument every meaningful number available for capture**.
Metrics are (or should be) cheap to record and report,
 and instrumentation systems are more useful the more data they contain,
 which is a virtuous cycle: the more you have, the better-off you are.

Good initial candidates for instrumentation include the things you've left out of your logging.
That tends to be things like incoming request counts, request durations, and error counts.
My [Weave](https://weave.works) colleague [Tom Wilkie](https://twitter.com/tom_wilkie)
 suggests a useful mnemonic for this three-tuple of information.
The [RED method](https://twitter.com/LindsayofSF/status/692191001692237825)
 suggests you capture **R**equest rate (count),
 **E**rror rate (count), and
 **D**uration of requests.

That's a spiritual successor to another mnemonic,
 [Brendan Gregg's USE method](http://www.brendangregg.com/usemethod.html).
The USE method suggests you instrument the
 **U**tilization,
 **S**aturation, and
 **E**rror count of all system resources.
Utilization can be understood as "the average time that the resource was busy servicing work",
 and saturation as "the degree to which the resource has extra work which it can't service"
 e.g. queue depth.
This is a great fallback for more general-purpose components in your service.

There are many great instrumentation libraries for nearly any language ecosystem.
All good libraries have (at least) three main primitives:

- A **counter**, for recording events that happen, e.g. incoming requests, bad request errors, etc.
- A **gauge**, for recording things that fluctuate over time, e.g. the size of a threadpool.
- A **histogram**, for recording observations of scalar quantities of events, e.g. request durations.

Primitive instrumentation libraries and systems, like Graphite,
 will couple a primitive to a single, static name.
So, you might create a histogram called `http_request_duration`,
 and invoke e.g. histogram.Observe(took.Microseconds) at the conclusion of every HTTP request.
This is probably good enough to get started.
But more recent, sophisticated instrumentation systems
 allow you to specify additional dimensions on each metric.
For example, your `http_request_duration` metric may have fields for
 URL path (e.g. "/api/v1/foo") and return status code (e.g. 200).
This dimensionality is typically exposed via a reasonably sophisticated query language,
 which makes data exploration, troubleshooting, and fault correlation much more powerful.

I'll admit some bias, having worked with the authors during the initial development and
 being one of the very first users, but I think that
 [Prometheus](https://prometheus.io) is really the instrumentation system to beat right now.
It's been designed from the ground up for exactly this kind of cloud-native architecture,
 and has endured a great deal of production hardening at several large orgs.
If you have the good fortune to be greenfielding a monitoring infrastructure,
 you owe it to yourself to put Prometheus at the top of your list.

## Observability

Both logging and instrumentation are ultimately just methods to achieve
 [system observability](https://speakerdeck.com/mattheath/observability-in-micro-service-architectures).
Other methods include distributed tracing systems like
 [Zipkin](https://github.com/openzipkin/zipkin),
 [Appdash](https://github.com/sourcegraph/appdash), or
 [Phosphor](https://github.com/mondough/phosphor).
As an industry, we're still figuring out the best practices for this area.
But, in my experience and from discussions with my peers,
 I think the above guidelines provide a good foundation for any microservice architecture.

<br/>_Is this all bollocks? I'm curious to hear your feedback!
 Tweets received [@peterbourgon](https://twitter.com/peterbourgon)._
