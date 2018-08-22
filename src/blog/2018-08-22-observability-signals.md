{ "title": "Observability signals" }
---

Every observability signal emitted from a running process, from structured log
event to metric counter increment to distributed trace annotation, can be
understood as a measurement, or observation, about the state of a running
system. From a certain perspective, they're fundamentally alike: each of them
is some number, captured at some point in time, with an associated set of
metadata to identify what the number is or means. Even log events can be
understood through this lens: the set of key/value pairs encoded in the event
constitute the metadata, and the number is "1" to indicate the event occurred.

If we had a perfect collection system, where all interpretation could be done
at read-time with zero cost, we could emit these sorts of raw observations to
it, and stop there. But what makes the field interesting, or challenging, is of
course that no such data system exists. So we’ve had to make engineering
decisions, compromises, imbuing certain types of observations with semantic
meaning, and, critically, performing different classes of write-time
optimizations, to enable specific observability workflows.

Metrics, tracing, and logging are actually emergent _patterns of consumption_
of observability data, which inform the way we produce, ship, and store the
corresponding observations. They’re the product of an optimization function,
between how operators want to be able to introspect over their systems, and the
capability of technology to meet those demands at scale. There may be other,
yet-undiscovered patterns of consumption, likely driven by advances in
technology, which will usher in a new era and taxonomy of observability. But
this is where we’re at today, and for the forseeable future.

Based on this analysis, it should be possible, in theory, to develop an
über-system. The write path could accept raw events, de-mux them into metrics,
traces, and logs heuristically or by the "shape" of the data, make the relevant
optimizations, and store them into purpose-driven backends. The read path could
provide a single pane-of-glass-style interface abstracting over those backends.
Arguably, one-stop-shop observability vendors like Datadog already provide
something approximating this product.

