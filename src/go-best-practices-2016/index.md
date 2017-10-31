{
    "title": "Go best practices, six years in",
    "template": "../inc/arbitrary-page.template.source",
	"metadescription": "Generally good things to do when writing Go code, in 2016 and beyond."
}
---

(_This article was originally a talk at QCon London 2016. [Video and slides here](https://www.infoq.com/presentations/go-patterns)._)

In 2014, I gave a talk at the inaugural GopherCon titled [Best Practices in Production Environments](/go-in-production).
We were early adopters at [SoundCloud](https://soundcloud.com), and by that point had been writing, running, and maintaining Go in production in one form or another for nearly 2 years.
We had learned a few things, and I tried to distill and convey some of those lessons.

Since then, I've continued working in Go full-time,
 later on the activities and infrastructure teams at SoundCloud,
 and now at [Weaveworks](https://weave.works),
  on [Weave Scope](https://weave.works/products/weave-scope)
  and [Weave Mesh](https://github.com/weaveworks/mesh).
I've also been working hard on [Go kit](https://github.com/go-kit/kit),
 an open-source toolkit for microservices.
And all the while, I've been active in the Go community,
 meeting lots of developers at meetups and conferences throughout Europe and the US,
 and collecting their stories&mdash;both successes and failures.

With the [6th anniversary](https://blog.golang.org/6years) of Go's release in November of 2015,
 I thought back to that first talk.
Which of those best practices have stood the test of time?
Which have become outmoded or counterproductive?
Are there any new practices that have emerged?
In March, I had the opportunity to give a talk at [QCon London](https://qconlondon.com)
 where I reviewed the best practices from 2014 and took a look at how Go has evolved in 2016.
Here's the meat of that talk.

I've highlighted the key takeaways as linkable Top Tips.

<a name="top-tip-0"></a><div class="toptip"><a href="#top-tip-0">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Use Top Tips to level up your Go game.
</div>

And a quick table of contents...

1. [Development environment](#development-environment)
1. [Repository structure](#repository-structure)
1. [Formatting and style](#formatting-and-style)
1. [Configuration](#configuration)
1. [Program design](#program-design)
1. [Logging and instrumentation](#logging-and-instrumentation)
1. [Testing](#testing)
1. [Dependency management](#dependency-management)
1. [Build and deploy](#build-and-deploy)
1. [Conclusion](#conclusion)


<br/><a name="development-environment"></a>
## Development environment &nbsp;<a class="lite" href="#development-environment">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#development-environment">original</a></span>

Go has development environment conventions centered around the GOPATH.
In 2014 I advocated strongly for a single global GOPATH.
My positioned has softened a bit.
I still think that's the best idea, all else equal, but depending on your project or team, other things may make sense, too.

If you or your organization produces primarily binaries, you might find some advantages with a per-project GOPATH.
There's a new tool, [gb](https://getgb.io), from Dave Cheney and contributors, which replaces the standard go tooling for this use-case.
A lot of people are reporting a lot of success with it.

Some Go developers use a two-entry GOPATH, e.g. `$HOME/go/external:$HOME/go/internal`.
The go tool has always known how to deal with this: go get will fetch into the first path,
 so it can be useful if you need strict separation of third-party vs. internal code.

One thing I've noticed some developers forget to do:
 put GOPATH/bin into your PATH.
This allows you to easily run binaries you get via go get,
 and makes the (preferred) go install mechanism of building code easier to work with.
No reason not to do it.

<a name="top-tip-1"></a><div class="toptip"><a href="#top-tip-1">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Put $GOPATH/bin in your $PATH, so installed binaries are easily accessible.
</div>

Regarding editors and IDEs, there's been a lot of steady improvement.
If you're a vim warrior, life has never been better:
 thanks to the tireless and extremely capable efforts of [Fatih Arslan](https://twitter.com/fatih),
 the [vim-go](https://github.com/fatih/vim-go) plugin is in an absolutely exceptional state,
 best-in-class.
I'm not as familiar with emacs, but [Dominik Honnef's](https://twitter.com/dominikhonnef)
 [go-mode.el](https://github.com/dominikh/go-mode.el) is still the big kahuna there.

Moving up the stack, lots of folks are still using and having success with
 [Sublime Text](https://www.sublimetext.com/) + [GoSublime](https://github.com/DisposaBoy/GoSublime).
And it's hard to beat the speed.
But more attention seems to be paid lately to the Electron-powered editors.
[Atom](https://atom.io/) + [go-plus](https://atom.io/packages/go-plus) has many fans,
 especially those developers that have to frequently switch languages to JavaScript.
The dark horse has been [Visual Studio Code](https://code.visualstudio.com/)
 + [vscode-go](https://github.com/Microsoft/vscode-go), which,
 while slower than Sublime Text, is noticably faster than Atom,
 and has excellent default support for important-to-me features,
 like click-to-definition.
I've been using it daily for about half a year now,
 after being introduced to it by [Thomas Adam](https://github.com/tecbot).
Lots of fun.

In terms of full IDEs, the purpose-built [LiteIDE](https://github.com/visualfc/liteide)
 has been receiving regular updates and certainly has its share of fans.
And the [IntelliJ Go plugin](https://github.com/go-lang-plugin-org/go-lang-idea-plugin)
 has been consistently improving as well.

<br/><a name="repository-structure"></a>
## Repository structure  &nbsp;<a class="lite" href="#repository-structure">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#repository-structure">original</a></span>

_**Update**: Ben Johnson has written an excellent article titled
 [Standard Package Layout](https://medium.com/@benbjohnson/standard-package-layout-7cdbc8391fc1)
 with great advice for typical line-of-business applications._

_**Update**: Tim Hockin's
 [go-build-template](https://github.com/thockin/go-build-template), adapted slightly,
 has proven to be a better general model. I've adapted this section since its original publication._

We've had a lot of time for projects to mature, and some patterns have emerged.
While I believe there is no single best repo structure,
 I think there is a good general model for many types of projects.
It's especially useful for projects that provide both binaries and libraries,
 or combine Go code with other, non-Go assets.
 
The basic idea is to have two top-level directories, pkg and cmd.
Underneath pkg, create directories for each of your libraries.
Underneath cmd, create directories for each of your binaries.
All of your Go code should live exclusively in one of these locations.

```
github.com/peterbourgon/foo/
  circle.yml
  Dockerfile
  cmd/
    foosrv/
      main.go
    foocli/
      main.go
  pkg/
    fs/
      fs.go
      fs_test.go
      mock.go
      mock_test.go
    merge/
      merge.go
      merge_test.go
    api/
      api.go
      api_test.go
```

All of your artifacts remain go gettable.
The paths may be slightly longer, but the nomenclature is familiar to other Go developers.
And you have space and isolation for non-Go assets.
For example, Javascript can live in a client or ui subdirectory.
Dockerfiles, continuous integration configs, or other build helpers 
 can live in the project root or in a build subdirectory.
And runtime configuration like Kubernetes manifests can have a home, too.

<a name="top-tip-2"></a><div class="toptip"><a href="#top-tip-2">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Put library code under a pkg/ subdirectory. Put binaries under a cmd/ subdirectory.
</div>

Of course, you'll still use fully-qualified import paths.
That is, the main.go in cmd/foosrv should `import "github.com/peterbourgon/foo/pkg/fs"`.
And beware of the [ramifications of including a vendor dir](#dependency-management) for downstream users.

<a name="top-tip-3"></a><div class="toptip"><a href="#top-tip-3">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Always use fully-qualified import paths. Never use relative imports.
</div>

This little bit of structure makes us play nice in the broader ecosystem,
 and hopefully continues to ensure our code is easy to consume.


<br/><a name="formatting-and-style"></a>
## Formatting and style  &nbsp;<a class="lite" href="#formatting-and-style">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#formatting-and-style">original</a></span>

Things have stayed largely the same here.
This is one area that Go has gotten quite right,
 and I really appreciate the consensus in the community and stability in the language.

The [Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments) are great,
 and should be the minimum set of critera you enforce during code review.
And when there are disputes or inconsistencies in names,
 Andrew Gerrand's [idiomatic naming conventions](https://talks.golang.org/2014/names.slide)
  are a great set of guidelines.

<a name="top-tip-4"></a><div class="toptip"><a href="#top-tip-4">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Defer to Andrew Gerrand's <a href="https://talks.golang.org/2014/names.slide">naming conventions</a>.
</div>

And in terms of tooling, things have only gotten better.
You should configure your editor to invoke gofmt&mdash;or, better, [goimports](https://github.com/bradfitz/goimports)&mdash;on save.
(At this point, I hope that's not in any way controversial.)
The go vet tool produces ([almost](https://github.com/golang/go/issues/9171)!) no false positives,
 so you might consider making it part of your precommit hook.
And check out the excellent [gometalinter](https://github.com/alecthomas/gometalinter) for linting concerns.
This _can_ produce false positives, so it's not a bad idea to
 [encode your own conventions](https://github.com/weaveworks/mesh/blob/master/lint) somehow.


<br/><a name="configuration"></a>
## Configuration  &nbsp;<a class="lite" href="#configuration">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#configuration">original</a></span>

Configuration is the surface area between the runtime environment and the process.
It should be explicit and well-documented.
I still use and recommend package flag, but I admit at this point I wish it were less esoteric.
I wish it had standard, getopts-style long- and short-form argument syntax,
 and I wish its usage text were much more compact.

[12-factor apps](http://12factor.net) encourage you to use environment vars for configuration,
 and I think that's fine, _provided each var is also defined as a flag_.
Explicitness is important: changing the runtime behavior of an application
 should happen in ways that are discoverable and documented.

I said it in 2014 but I think it's important enough to say again:
 [define and parse your flags in func main](https://robots.thoughtbot.com/where-to-define-command-line-flags-in-go).
Only func main has the right to decide the flags that will be available to the user.
If your library code wants to parameterize its behavior,
 those parameters should be part of type constructors.
Moving configuration to package globals has the illusion of convenience, but it's a false economy:
 doing so breaks code modularity,
 makes it more difficult for developers or future maintainers to understand dependency relationships,
 and makes writing independent, parallelizable tests much more difficult.

<a name="top-tip-5"></a><div class="toptip"><a href="#top-tip-5">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Only func main has the right to decide which flags are available to the user.
</div>

I think there's a great opportunity for a well-scoped flags package to emerge from the community,
 combining all of these characteristics.
Maybe it already exists; if so, [please let me know](https://twitter.com/peterbourgon).
I'd certainly use it.


<br/><a name="program-design"></a>
## Program design &nbsp;<a class="lite" href="#program-design">permalink</a>

In the talk, I used configuration as a jumping-off point, to discuss a few other issues of program design.
(I didn't cover this in the 2014 version.)
To start, let's take a look at constructors.
If we are properly parameterizing all of our dependencies, our constructors can get quite large.

```
foo, err := newFoo(
    *fooKey,
    bar,
    100 * time.Millisecond,
    nil,
)
if err != nil {
    log.Fatal(err)
}
defer foo.close()
```

Sometimes this kind of construction is best expressed with a config object:
 a struct parameter to a constructor that takes _optional_ parameters to the constructed object.
Let's assume fooKey is a required parameter,
 and everything else either has a sensible default or is optional.
Often, I see projects construct config objects in a sort of piecemeal way.

```
// Don't do this.
cfg := fooConfig{}
cfg.Bar = bar
cfg.Period = 100 * time.Millisecond
cfg.Output = nil

foo, err := newFoo(*fooKey, cfg)
if err != nil {
    log.Fatal(err)
}
defer foo.close()
```

But it's considerably nicer to leverage so-called struct initialization syntax
 to construct the object all at once, in a single statement.

```
// This is better.
cfg := fooConfig{
    Bar:    bar,
    Period: 100 * time.Millisecond,
    Output: nil,
}

foo, err := newFoo(*fooKey, cfg)
if err != nil {
    log.Fatal(err)
}
defer foo.close()
```

No statements go by where the object is in an intermediate, invalid state.
And all of the fields are nicely delimited and indented, mirroring the fooConfig definition.

Notice we construct and then immediately use the cfg object.
In this case we can save another degree of intermediate state, and another line of code,
 by inlining the struct declaration into the newFoo constructor directly.

```
// This is even better.
foo, err := newFoo(*fooKey, fooConfig{
    Bar:    bar,
    Period: 100 * time.Millisecond,
    Output: nil,
})
if err != nil {
    log.Fatal(err)
}
defer foo.close()
```

Nice.

<a name="top-tip-6"></a><div class="toptip"><a href="#top-tip-6">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Use struct literal initialization to avoid invalid intermediate state.
Inline struct declarations where possible.
</div>

Let's turn to the subject of sensible defaults.
Observe that the Output parameter is something that can take a nil value.
For the sake of argument, assume it's an io.Writer.
If we don't do anything special, when we want to use it in our foo object,
 we'll have to first perform a nil check.

```
func (f *foo) process() {
    if f.Output != nil {
        fmt.Fprintf(f.Output, "start\n")
    }
    // ...
}
```

That's not great.
It's much safer, and nicer, to be able to use output without having to check it for existence.

```
func (f *foo) process() {
     fmt.Fprintf(f.Output, "start\n")
     // ...
}
```

So we should provide a usable default here.
With interface types, one good way is to pass something that provides a no-op implementation of the interface.
And it turns out that the stdlib ioutil package comes with a no-op io.Writer, called ioutil.Discard.

<a name="top-tip-7"></a><div class="toptip"><a href="#top-tip-7">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Avoid nil checks via default no-op implementations.
</div>

We could pass that into the fooConfig object, but that's still fragile.
If the caller forgets to do it at the callsite, we'll still end up with a nil parameter.
So, instead, we can create a sort of safety within the constructor.

```
func newFoo(..., cfg fooConfig) *foo {
    if cfg.Output == nil {
        cfg.Output = ioutil.Discard
    }
    // ...
}
```

This is just an application of the Go idiom _make the zero value useful_.
We allow the zero value of the parameter (nil) to yield good default behavior (no-op).

<a name="top-tip-8"></a><div class="toptip"><a href="#top-tip-8">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Make the zero value useful, especially in config objects.
</div>

Let's revisit the constructor.
The parameters fooKey, bar, period, output are all _dependencies_.
The foo object _depends_ on each of them in order to start and run successfully.
If there's a single lesson I've learned from writing Go code in the wild
 and observing large Go projects on a daily basis for the past six years, it is this:
**make dependencies explicit**.

<a name="top-tip-9"></a><div class="toptip bigdeal"><a href="#top-tip-9">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Make dependencies explicit!
</div>

An incredible amount of maintenance burden, confusion, bugs, and unpaid technical debt
 can, I believe, be traced back to ambiguous or implicit dependencies.
Consider this method on the type foo.

```
func (f *foo) process() {
    fmt.Fprintf(f.Output, "start\n")
    result := f.Bar.compute()
    log.Printf("bar: %v", result) // Whoops!
    // ...
}
```

fmt.Printf is self-contained and doesn't affect or depend on global state;
 in functional terms, it has something like _referential transparency_.
So it is not a dependency.
Obviously, f.Bar is a dependency.
And, interestingly, log.Printf acts on a package-global logger object,
 it's just obscured behind the free function Printf.
So it, too, is a dependency.

What do we do with dependencies?
**We make them explicit.**
Because the process method prints to a log as part of its work,
 either the method or the foo object itself needs to take a logger object as a dependency.
For example, log.Printf should become f.Logger.Printf.

```
func (f *foo) process() {
    fmt.Fprintf(f.Output, "start\n")
    result := f.Bar.compute()
    f.Logger.Printf("bar: %v", result) // Better.
    // ...
}
```

We're conditioned to think of certain classes of work, like writing to a log, as incidental.
So we're happy to leverage helpers, like package-global loggers, to reduce the apparent burden.
But logging, like instrumentation, is often crucial to the operation of a service.
And hiding dependencies in the global scope can and does come back to bite us,
 whether it's something as seemingly benign as a logger,
  or perhaps another, more important, domain-specific component that we haven't bothered to parameterize.
Save yourself the future pain by being strict: make _all_ your dependencies explicit.

<a name="top-tip-10"></a><div class="toptip"><a href="#top-tip-10">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Loggers are dependencies, just like references to other components,
 database handles, commandline flags, etc.
</div>

Of course, we should also be sure to take a sensible default for our logger.

```
func newFoo(..., cfg fooConfig) *foo {
    // ...
    if cfg.Logger == nil {
        cfg.Logger = log.New(ioutil.Discard, ...)
    }
    // ...
}
```

_Update:_ for more detail on this and the subject of magic, see the June 2017 blog post
 on a [theory of modern Go](/blog/2017/06/09/theory-of-modern-go.html).

<br/><a name="logging-and-instrumentation"></a>
## Logging and instrumentation  &nbsp;<a class="lite" href="#logging-and-instrumentation">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#logging-and-telemetry">original</a></span>

To speak about the problem generally for a moment:
 I've had a lot more production experience with logging,
  which has mostly just increased my respect for the problem.
Logging is expensive, more expensive than you think,
 and can quickly become the bottleneck of your system.
I wrote more extensively on the subject [in a separate blog post](/blog/2016/02/07/logging-v-instrumentation.html),
 but to re-cap:

- Log only _actionable information_, which will be read by a human or a machine
- Avoid fine-grained log levels &mdash; info and debug are probably enough
- Use structured logging &mdash; I'm biased, but I recommend [go-kit/log](https://github.com/go-kit/kit/tree/master/log)
- Loggers are dependencies!

Where logging is expensive, instrumentation is cheap.
You should be instrumenting every significant component of your codebase.
If it's a resource, like a queue, instrument it according to
 [Brendan Gregg's USE method](http://www.brendangregg.com/usemethod.html):
  utilization, saturation, and error count (rate).
If it's something like an endpoint, instrument it according to
 [Tom Wilkie's RED method](https://twitter.com/LindsayofSF/status/692191001692237825):
  request count (rate), error count (rate), and duration.

If you have any choice in the matter,
 [Prometheus](https://prometheus.io) is probably the instrumentation system you should be using.
And, of course, metrics are dependencies, too!

Let's use loggers and metrics to pivot and address global state more directly.
Here are some facts about Go:

- log.Print uses a fixed, global log.Logger
- http.Get uses a fixed, global http.Client
- http.Server, by default, uses a fixed, global log.Logger
- database/sql uses a fixed, global driver registry
- func init exists only to have side effects on package-global state

These facts are convenient in the small, but awkward in the large.
That is, how can we test the log output of components that use the fixed global logger?
We must redirect its output, but then how can we test in parallel?
Just don't?
That seems unsatisfactory.
Or, if we have two independent components both making HTTP requests with different requirements,
 how do we manage that?
With the default global http.Client, it's quite difficult.
Consider this example.

```
func foo() {
    resp, err := http.Get("http://zombo.com")
    // ...
}
```

http.Get calls on a global in package http.
It has an implicit global dependency.
Which we can eliminate pretty easily.

```
func foo(client *http.Client) {
    resp, err := client.Get("http://zombo.com")
    // ...
}
```

Just pass an http.Client as a parameter.
But that is a concrete type, which means if we want to test this function
 we also need to provide a concrete http.Client,
  which likely forces us to do actual HTTP communication.
Not great.
We can do one better, by passing an interface which can Do (execute) HTTP requests.

```
type Doer interface {
    Do(*http.Request) (*http.Response, error)
}

func foo(d Doer) {
    req, _ := http.NewRequest("GET", "http://zombo.com", nil)
    resp, err := d.Do(req)
    // ...
}
```

http.Client satisfies our Doer interface automatically,
 but now we have the freedom to pass a mock Doer implementation in our test.
And that's great: a unit test for func foo is meant to test only the behavior of foo,
 it can safely assume that the http.Client is going to work as advertised.

Speaking of testing...


<br/><a name="testing"></a>
## Testing  &nbsp;<a class="lite" href="#testing">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#testing">original</a></span>

In 2014, I reflected on our experience with various testing frameworks and helper libraries,
 and concluded that we never found a great deal of utility in any of them,
 recommending the stdlib's approach of plain package testing with table-based tests.
Broadly, I still think this is the best advice.
The important thing to remember about testing in Go is that _it is just programming_.
It is not sufficiently different from other programming that it warrants its own metalanguage.
And so package testing continues to be well-suited to the task.

TDD/BDD packages bring new, unfamiliar DSLs and control structures,
 increasing the cognitive burden on you and your future maintainers.
I haven't personally seen a codebase where that cost has paid off in benefits.
Like global state, I believe these packages represent a false economy,
 and more often than not are the product of cargo-culting behaviors from other languages and ecosystems.
_When in Go, do as Gophers do_: we already have a language for writing simple,
 expressive tests&mdash;it's called Go, and you probably know it pretty well.

With that said, I do recognize my own context and biases.
Like with my opinions on the GOPATH, I've softened a bit,
 and defer to those teams and organizations for whom a testing DSL or framework may make sense.
If you know you want to use a package, go for it.
Just be sure you're doing it for well-defined reasons.

Another incredibly interesting topic has been designing for testing.
Mitchell Hashimoto recently gave a great talk on the subject here in Berlin
 ([SpeakerDeck](https://speakerdeck.com/mitchellh/advanced-testing-with-go),
  [YouTube](https://www.youtube.com/watch?v=yszygk1cpEc))
 which I think should be required viewing.

In general, the thing that seems to work the best is to write Go in a generally functional style,
 where dependencies are explicitly enumerated, and provided as small, tightly-scoped interfaces whenever possible.
Beyond being good software engineering discipline in itself,
 it feels like it automatically optimizes your code for easy testing.

<a name="top-tip-11"></a><div class="toptip"><a href="#top-tip-11">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Use many small interfaces to model dependencies.
</div>

As in the http.Client example just above, remember that unit tests should be written to
 test the thing being tested, and nothing more.
If you're testing a process function,
 there's no reason to also test the HTTP transport the request came in on,
  or the path on disk the results get written to.
Provide inputs and outputs as fake implementations of interface parameters,
 and focus on the business logic of the method or component exclusively.

<a name="top-tip-12"></a><div class="toptip"><a href="#top-tip-12">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Tests only need to test the thing being tested.
</div>


<br/><a name="dependency-management"></a>
## Dependency management &nbsp;<a class="lite" href="#dependency-management">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#dependency-management">original</a></span>

Ever the hot topic.
In 2014, things were nascent, and about the only concrete advice I could give was to vendor.
That advice still holds today: vendoring is still the solution to dependency management for binaries.
In particular, the GO15VENDOREXPERIMENT and its concomittant vendor/ subdirectory
 have become default in Go 1.6.
So you'll be using that layout.
And, thankfully, the tools have gotten a lot better.
Some I can recommend:

- [FiloSottile/gvt](https://github.com/FiloSottile/gvt) takes a minimal approach,
   basically just extracting the vendor subcommand from the gb tool
   so it can be used standalone.
- [Masterminds/glide](https://github.com/Masterminds/glide) takes a maximal approach,
   attempting to recreate the feel and finish of a fully-featured dependency management tool
   using vendoring under the hood.
- [kardianos/govendor](https://github.com/kardianos/govendor) sits in the middle,
   providing probably the richest interface to vendoring-specific nouns and verbs,
   and is driving the conversation on the manifest file.
- [constabulary/gb](https://github.com/constabulary/gb) abandons the go tooling altogether
   in favor of a different repository layout and build mechanism.
   Great if you produce binaries and can mandate the build environment, e.g. in a corporate setting.

<a name="top-tip-13"></a><div class="toptip"><a href="#top-tip-13">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Use a top tool to vendor dependencies for your binary.
</div>

A big caveat for libraries.
In Go, dependency management is a concern of the binary author.
Libraries with vendored dependencies are very difficult to use;
 so difficult that it is probably better said that they are impossible to use.
There are many corner cases and edge conditions that have played out in the months since
 vendoring was officially introduced in 1.5.
(You can dig in to [one of these](https://groups.google.com/forum/#!topic/golang-dev/4FfTBfN2YaI)
 [forum posts](https://groups.google.com/forum/#!msg/golang-nuts/AnMr9NL6dtc/UnyUUKcMCAAJ)
  if you're particularly interested in the details.)
Without getting too deep in the weeds, the lesson is clear:
 libraries should **never** vendor dependencies.

<a name="top-tip-14"></a><div class="toptip"><a href="#top-tip-14">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Libraries should never vendor their dependencies.
</div>

You can carve out an exception for yourself if your library has hermetically sealed its dependencies,
 so that none of them escape to the exported (public) API layer.
No dependent types referenced in any exported functions, method signatures, structures&mdash;anything.

If you have the common task of maintaining an open-source repository
 that contains both binaries and libraries,
 unfortunately, you are stuck between a rock and a hard place.
You want to vendor your deps for your binaries,
 but you shouldn't vendor them for your libraries,
 and the GO15VENDOREXPERIMENT doesn't admit this level of granularity,
 from what appears to me to be regrettable oversight.

Bluntly, I don't have an answer to this.
The etcd folks have hacked together [a solution using symlinks](https://github.com/coreos/etcd/tree/60425de0ff0dc8a2e7898fcd56f16669d4e4933b/cmd)
 which I cannot in good faith recommend,
  as symlinks are not well-supported by the go toolchain and break entirely on Windows.
That this works at all is more a happy accident than any consequence of design.
I and others have raised all of these concerns [to the core team](https://github.com/golang/go/issues/15162),
 and I hope something will happen in the near term.


<br/><a name="build-and-deploy"></a>
## Build and deploy &nbsp;<a class="lite" href="#build-and-deploy">permalink</a> <span class="orig"><a class="lite" href="/go-in-production/#build-and-deploy">original</a></span>

Regarding building, one important lesson learned, with a hat tip to Dave Cheney:
 prefer go install to go build.
The install verb caches build artifacts from dependencies in $GOPATH/pkg,
 making builds faster.
It also puts binaries in $GOPATH/bin,
 making them easier to find and invoke.

<a name="top-tip-15"></a><div class="toptip"><a href="#top-tip-15">✪</a>&nbsp;
<strong>Top Tip</strong> &mdash;
Prefer go install to go build.
</div>

If you produce a binary, don't be afraid to try out new build tools
 like [gb](https://getgb.io), which may significantly reduce your cognitive burden.
Conversely, remember that since Go 1.5 cross-compilation is built-in;
 just set the appropriate GOOS and GOARCH environment variables, and
  invoke the appropriate go command.
So there's no need for extra tools here anymore.

Regarding deployment, we Gophers have it pretty easy
 compared to languages like Ruby or Python,
  or even the JVM.
One note: if you deploy in containers,
 follow the [advice of Kelsey Hightower](https://medium.com/@kelseyhightower/optimizing-docker-images-for-static-binaries-b5696e26eb07#.r4j4suwn2) and do it FROM scratch.
Go gives us this incredible opportunity; it's a shame not to use it.

As more general advice, think carefully before choosing a platform
 or orchestration system&mdash;if you even choose one at all.
Likewise for jumping onto the microservices bandwagon.
An elegant monolith, deployed as an AMI to an autoscaling EC2 group,
 is a very productive setup for small teams.
Resist, or at least carefully consider, the hype.


<br/><a name="conclusion"></a>
## Conclusion &nbsp;<a class="lite" href="#conclusion">permalink</a>

The Top Tips:

1. Put $GOPATH/bin in your $PATH, so installed binaries are easily accessible.&nbsp;&nbsp;<a class="lite" href="#top-tip-1">link</a>
1. Put library code under a pkg/ subdirectory. Put binaries under a cmd/ subdirectory.&nbsp;&nbsp;<a class="lite" href="#top-tip-2">link</a>
1. Always use fully-qualified import paths. Never use relative imports.&nbsp;&nbsp;<a class="lite" href="#top-tip-3">link</a>
1. Defer to Andrew Gerrand's <a href="https://talks.golang.org/2014/names.slide">naming conventions</a>.&nbsp;&nbsp;<a class="lite" href="#top-tip-4">link</a>
1. Only func main has the right to decide which flags are available to the user.&nbsp;&nbsp;<a class="lite" href="#top-tip-5">link</a>
1. Use struct literal initialization to avoid invalid intermediate state.&nbsp;&nbsp;<a class="lite" href="#top-tip-6">link</a>
1. Avoid nil checks via default no-op implementations.&nbsp;&nbsp;<a class="lite" href="#top-tip-7">link</a>
1. Make the zero value useful, especially in config objects.&nbsp;&nbsp;<a class="lite" href="#top-tip-8">link</a>
1. <strong>Make dependencies explicit!</strong>&nbsp;&nbsp;<a class="lite" href="#top-tip-9">link</a>
1. Loggers are dependencies, just like references to other components, database handles, commandline flags, etc.&nbsp;&nbsp;<a class="lite" href="#top-tip-10">link</a>
1. Use many small interfaces to model dependencies.&nbsp;&nbsp;<a class="lite" href="#top-tip-11">link</a>
1. Tests only need to test the thing being tested.&nbsp;&nbsp;<a class="lite" href="#top-tip-12">link</a>
1. Use a top tool to vendor dependencies for your binary.&nbsp;&nbsp;<a class="lite" href="#top-tip-13">link</a>
1. Libraries should never vendor their dependencies.&nbsp;&nbsp;<a class="lite" href="#top-tip-14">link</a>
1. Prefer go install to go build.&nbsp;&nbsp;<a class="lite" href="#top-tip-15">link</a>

Go has always been a conservative language,
 and its maturity has brought relatively few surprises and effectively no major changes.
Consequently, and predictably, the community also hasn't dramatically shifted its stances
 on what's considered best practice.
Instead, we've seen a reification of tropes and proverbs
 that were reasonably well-known in the early years,
  and a gradual movement "up the stack" as design patterns, libraries, and program structures
   are explored and transformed into idiomatic Go.

Here's to another 6 years of fun and productive Go programming. <a style="text-decoration:none;" href="https://twitter.com/peterbourgon/status/725297831221800960">🏌</a>


<br>________<br>*[Go back to my website](/), or [follow me on Twitter](http://twitter.com/peterbourgon).*
