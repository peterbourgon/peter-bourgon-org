{ "title": "Go naming tips" }

---

(_This post adapted from [a Twitter thread](https://twitter.com/peterbourgon/status/1121013346784948224)_)

In my experience, the best way to name types in Go is as follows:

- Structs are plain nouns: API, Replica, Object
- Interfaces are active nouns: Reader, Writer, JobProcessor
- Functions and methods are verbs: Read, Process, Sync

Besides being consistent, this model has two nice secondary benefits.
First, doc comments become natural and fluent.

```go
// Sync the local replica state to the provided upstream.
func (r *Replica) Sync(u Upstream) error { ... }

// Process the next available job from the queue
// and emit results to the sink.
func Process(q JobQueuer, s Sinker) error { ... }
```

Second, if functions are verbs, it seems to help a block of code read more fluently.
That is, each expression (or expression-block) becomes kind of like a sentence.

```go
objectNoun := Verb(subjectNoun, subjectNoun, ...)
```

Through this lens, each function is like a coherent paragraph of prose.
I think this is a great metaphor, as it naturally reinfoces other virtues, like
appropriate length, single responsibility, and independent testability.


