{
	"template": "../inc/arbitrary-page.template.source",
	"title": "Go: Best Practices for Production Environments",
	"showheader": false
}

---

(_This was originally a talk at [GopherCon](http://www.gophercon.com) 2014. [Find the slides here](https://github.com/gophercon/2014-talks). No video yet._)

At SoundCloud, we structure our product as an API with many clients. That is, our main website, mobile client, and mobile apps are all first-order clients of a single main API. Behind that API is a universe of services: SoundCloud operates basically as a Service-Oriented-Architecture.

We're also a polyglot organization, which means we use lots of languages. And many of those services (and backing infrastructure bits) are written in Go. In fact, we were pretty early adopters: we've been using Go in production for about two and a half years, now. Some of our projects include:

 - Bazooka, our internal platform-as-a-service; spiritually, very similar to Heroku or Flynn;
 - Our perimeter traffic tier is pretty standard (nginx, HAProxy, etc.) but it's coördinated with Go services;
 - Our audio assets are stored on S3, but coördinating uploads, transcoding, and link generation is handled with Go services;
 - Search is powered by Elasticsearch, and Explore is powered by sophisticated machine learning models, but they're integrated with the rest of our infrastructure with Go;
 - Prometheus, an early-stage telemetry system, is pure Go;
 - The stream is currently powered by Cassandra, but we're rolling out a (nearly) pure Go replacement;
 - We're also experimenting with a pure Go implementation of HTTP Live Streaming;
 - and many other small product-oriented services.

These projects have been written by around half a dozen teams, comprised of over a dozen individual SoundCloud gophers, most of whom work with Go full-time. After all this time, all of these projects, and among such a heterogeneous mix of engineers, we've evolved a set of best practices for Go in production. The lessons we've learned might be useful to other organizations starting to invest heavily in Go.

## Development Environment

On our laptops, we've got a single, global `GOPATH`. Personally, I like `$HOME`, but many others use a subdirectory under `$HOME`. We clone our repos into their canonical paths within the `GOPATH`, and work there directly. That is,

```
$ mkdir -p $GOPATH/src/github.com/soundcloud
$ cd $GOPATH/src/github.com/soundcloud
$ git clone git@github.com:soundcloud/roshi
```

Many of us fought with this convention for a long time in the early days, to preserve our own particular methods of code organization. It simply wasn't worth the hassle.

For editors, many of use use vim, with various plugins. (I understand [vim-go](https://github.com/fatih/vim-go) is a good one.) Many, including myself, use Sublime Text with GoSublime. A few use emacs. Nobody uses an IDE. I'm not sure that's a best practice, it's just interesting to note.

## Repository structure

Our best practice is to keep things simple. Many, many services are maybe half a dozen source files in `package main`.

```
github.com/soundcloud/simple/
	README.md
	Makefile
	main.go
	main_test.go
	support.go
	support_test.go
```

Our search dispatcher, for example, is still like this after 2 years. Don't create structure until you demonstrably need it.

Maybe at some point you want to create a new support package. Use a subdirectory in your main repo, and import it using the fully-qualified name. If the package only has one file, or one struct, it almost certainly doesn't need to be separated.

Sometimes a repo needs to contain multiple binaries; for example, when a job needs a server, a worker, and maybe a janitor. In those circumstances, put each binary in a separate `package main` in a separate subdirectory, and use other subdirectories (other packages) to implement shared functionality.

```
github.com/soundcloud/complex/
	README.md
	Makefile
	complex-server/
		main.go
		main_test.go
		handlers.go
		handlers_test.go
	complex-worker/
		main.go
		main_test.go
		process.go
		process_test.go
	shared/
		foo.go
		foo_test.go
		bar.go
		bar_test.go
```

Note that there's never a `src` directory involved. With the exception of a vendor subdirectory (more on that below) your repos shouldn't contain a directory named `src`, or represent their own `GOPATH`.

## Formatting and style

First and foremost, configure your editor to `go fmt` (or [`goimports`](https://github.com/bradfitz/goimports)) your code on save, using the default arguments. That means tabs for indentation, and spaces for alignment. Code that isn't properly formatted shouldn't be committed anywhere.

We used to have a pretty extensive style guide, but Google recently released their [Code Review Comments](https://code.google.com/p/go-wiki/wiki/CodeReviewComments) document, which was almost exactly our conventions. So, we use that.

We actually take it a little bit further:

- Avoid named return parameters, unless they unambiguously and significantly increase clarity.
- Avoid `make` and `new`, unless they're necessary (`new(int)`, or `make(chan int)`) or we know the size of the allocated thing in advance (`make(map[int]string, n)`, or `make([]int, 0, 256)`).
- Use `struct{}` as a sentinel value, rather than `bool` or `interface{}`. For example, a set is `map[string]struct{}`; a signal channel is `chan struct{}`. It unambiguously signals an explicit lack of information.

It's also nice to break long lines on parameters. That is, rather than the Java-style

```
// Don't do this.
func process(dst io.Writer, readTimeout,
	writeTimeout time.Duration, allowInvalid bool,
		max int, src <-chan util.Job) {
	// ...
}
```

prefer

```
func process(
	dst io.Writer,
	readTimeout, writeTimeout time.Duration,
	allowInvalid bool,
	max int,
	src <-chan util.Job,
) {
	// ...
}
```

Similarly, when constructing objects,

```
f := foo.New(foo.Config{ 
	Site: "zombo.com", 
	Out:  os.Stdout, 
	Dest: conference.KeyPair{ 
		Key:   "gophercon",
		Value: 2014,
	},
})
```

Also, when allocating new objects, pass members as part of the initialization (as above), rather than setting them afterwards.

```
// Don't do this.
f := &Foo{} // or, even worse: new(Foo)
f.Site = "zombo.com"
f.Out = os.Stdout
f.Dest.Key = "gophercon"
f.Dest.Value = 2014
```

## Configuration

We tried many ways of passing configuration to a Go program: parsing config files, extracting it from the environment directly with `os.Getenv`, various value-add flag parsing packages. In the end, the best value-for-money is just plain `package flag`. The strict typing and simple semantics are absolutely good enough for everything we need.

We deploy primarily [12-Factor](http://12factor.net) applications, and 12-Factor apps pass configuration through the environment. But even so, we use a start script to convert environment variables to flags. Flags act as an explicit and fully-documented surface area between a program and its operating context. They're invaluable for understanding and operating applications.

A nice idiom for flags is to define them in your `func main`. That prevents you from reading them arbitrarily in your code as globals, which forces you to abide strict dependency injection, which makes testing easier.

```
func main() {
	var (
		payload = flag.String("payload", "abc", "payload data")
		delay   = flag.Duration("delay", 1*time.Second, "write delay")
	)
	flag.Parse()
	// ...
}
```

## Logging and telemetry

We played around with several logging frameworks, providing things like leveled logging, debug, output routing, special formatting, and so on. In the end, we settled on plain `package log`. It works because we only log actionable information. That means serious, panic-level errors that need to be addressed by humans, or structured data that will be consumed by other machines. For example, the search dispatcher emits every request it processes with contextual information, so our analytics workflows can see how often people with New Zealand IPs search for [Lorde](https://soundcloud.com/lordemusic), or whatever.

Everything else emitted by a running process we consider telemetry. Request response times, QPS, runtime errors, queue depths, and so on. And telemetry basically operates in one of two models: push and pull.

 - **Push** means emitting metrics to a known external system. For example, Graphite, Statsd, and AirBrake work this way.
 - **Pull** means exposing metrics at some known location, and allowing an external system to scrape them. For example, `expvar` and Prometheus work this way. (Maybe there are others?)

Both styles have their place. Push is intuitive and straightforward to use when you're just getting started. But pushed metrics are perversely incentivized with growth: the bigger you get, the more they cost, in terms of CPU cycles and bandwidth. We've found that past a certain size of infrastructure, pull is the only model that scales. There's also a lot of value in being able to introspect a running system. So, best practice: `expvar` or expvar-style metrics exposition.

## Testing and validation

We tried many different testing libraries and frameworks over the course of a year, but very quickly gave up on most of them, and today all of our testing is done with plain `package testing`, via data-driven (table-driven) tests. We don't have strong or specific complaints against testing/checking packages, beyond that they simply provided no great value. One thing that does help: [reflect.DeepEqual](http://golang.org/pkg/reflect#DeepEqual) gives you simple, full comparison of arbitrary data (i.e. expected vs. got).

Package testing is geared around unit testing, but for integration tests, things are a little trickier. The process of spinning up external services typically depends on your integration environment, but we did find one nice idiom to integrate against them. Write an `integration_test.go`, and give it a build tag of `integration`. Define (global) flags for things like service addresses and connect strings, and use them in your tests.

```
// +build integration

var fooAddr = flag.String(...)

func TestToo(t *testing.T) {
	f, err := foo.Connect(*fooAddr)
	// ...
}
```

`go test` takes build tags just like `go build`, so you can call `go test -tags=integration`. It also synthesizes a `package main` which calls `flag.Parse`, so any flags declared and visible will be processed and available to your tests.

By validation, I mean static code validation. And fortunately Go has several great tools. I find it useful to consider the stages of writing code, when considering which tools to use.

When you do this | Run this
-----------------|-----------------------------------------
Save             | `go fmt` (or `goimports`)
Build            | `go vet`, `golint`, and maybe `go test`
Deploy           | `go test -tags=integration`

## Interlude

So far, nothing too crazy. When doing research to compile this list, what was notable to me was just how... uninteresting the conclusions were. Boring. I want to emphasize that these very lightweight, pure-stdlib conventions really do scale to large groups of developers and diverse project ecosystems. You absolutely don't need your own error checking framework, or testing library, or flag parser, simply because your code base has grown beyond a certain size. Or you believe it _might_ grow beyond a certain size! You truly ain't gonna need it. The standard idioms and practices continue to function beautifully at scale.

## Dependency management

Dependency management! Whee! ᕕ( ᐛ )ᕗ

The state of dependency management in the Go ecosystem is a topic of hot debate, and we've definitely not figured out the perfect solution yet. However, we have settled on what seems like a good compromise.

How important is your project? | Your dependency management solution is...
-------------------------------|-------------------------------------------
Eh...                          | `go get -d` and hope!
_Very._                        | VENDORING

(It's worth noting that a shocking number of our long-term production services still rely on option 1. Still, because we don't generally use a lot of third-party code, and because major problems are usually detected at build time, we can mostly get away with it.)

Vendoring means copying your dependencies into your project's repo, and then using them when building. Depending on what you're shipping, there are two best practice ways of vendoring.

Shipping a | Vendor directory name | Procedure
-----------|-----------------------|--------------------------------------
Binary     | `_vendor`             | Blessed build with prefixed `GOPATH`
Library    | `vendor`              | Rewrite your imports

If you ship a binary, create a `_vendor` subdirectory in the root of your repository. (With a leading underscore, so the `go` tool ignores it when doing e.g. `go test ./...`.) Treat it like its own `GOPATH`; for example, copy the dependency `github.com/user/dep` to `_vendor/src/github.com/user/dep`. Then, write a so-called blessed build procedure, which prepends `_vendor` to any existing `GOPATH`. (Remember: `GOPATH` is actually a list of paths, searched in order by the `go` tool when resolving imports.) For example, you might have a top-level Makefile that looks like this:

```
GO ?= go
GOPATH := $(CURDIR)/_vendor:$(GOPATH)

all: build

build:
	$(GO) build
```

If you're shipping a library, create a `vendor` subdirectory in the root of your repository. Treat it just like a prefix in package paths; for example, copy the dependency `github.com/user/dep` to `vendor/user/dep`. Then, rewrite all of your imports, transitively. While a pain, this seems to be the best available way to ensure actually-reproducible builds while remaining `go get` compliant. It's worth noting that we don't actually ship any libraries, so this method may be too much of a hassle in practice to be worthwhile.

How to actually copy the dependencies into your repository is another hot topic. The simplest way is to **manually** copy the files from a clone, which may be the best answer if you're not concerned with pushing changes upstream. Some people use **git submodules**, but we found them very counterintuitive and difficult to manage. (So do [many](http://codingkilledthecat.wordpress.com/2012/04/28/why-your-company-shouldnt-use-git-submodules) other [people](http://somethingsinistral.net/blog/git-submodules-are-probably-not-the-answer/), for the record.) We've had good success with **git subtrees**, which appear to work like submodules ought to. And there's plenty of work on **tools** to handle this work automatically. Right now, it looks like [godep](http://github.com/tools/godep) is the most actively developed, and is certainly worth investigating.

## Building and deploying

Building and deploying is tricky, because it's so tightly coupled to your operational environment. I'll describe our situation, because I think it's a really good model, but it may not apply directly to other organizations.

For building, we generally use plain `go build` for development, and a Makefile for cutting official builds. That's mostly because we're polyglot, and our tooling needs to use a lowest common denominator. Also, our build system starts with a bare environment, and we need to bring our own compiler. (Our Makefiles are ugly!)

For deploying, the key abstraction for us is stateless versus stateful.

Mode      | Example        | Model        | Deploying is called | Deploy in
----------|----------------|--------------|---------------------|--------------
Stateless | Request router | 12-Factor    | Scaling             | Containers
Stateful  | Redis          | None, really | Provisioning        | Containers?

We primarily deploy stateless services, in a manner very similar to Heroku.

```
$ git push bazooka master
$ bazooka scale -r <new> -n 4 ...
$ # validate
$ bazooka scale -r <old> -n 0 ...
```

## Conclusions

I intend this to be a kind of experience report from a large organization that's been running Go in production for a relatively long time. While these are informed opinions, they're still just opinions, so please take everything with a grain of salt. That said, Go's greatest strength is its structural simplicity. **The ultimate best practice is to embrace simplicity**, rather than trying to circumvent it.

<br>________<br>*[Go back to my website](/), or [follow me on Twitter](http://twitter.com/peterbourgon).*
