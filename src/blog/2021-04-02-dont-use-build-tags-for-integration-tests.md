{ "title": "Don't use build tags for integration tests" }
---
[I used to recommend](https://peter.bourgon.org/go-in-production/#testing-and-validation)
using build tags to gate integration tests. But I don't any more — I've found a
much better way.

```
func TestIntegration(t *testing.T) {
	fooAddr := os.Getenv("FOO_ADDR")
	if fooAddr == "" {
		t.Skip("set FOO_ADDR to run this test")
	}

	f, err := foo.Connect(fooAddr)
	// ...
}
```

Why is this better? Mostly, it's about usability.

Build tags are somewhat esoteric and non-discoverable, meaning you have to read
the source to know there's some tests that only get built conditionally, and
that the build tag is integration. There's no signal when you run the tests that
you're actually missing some of them.

Build tags can also hide build errors. If you have a typo in an integration test
file, or you update a dependency and introduce a breaking change, you won't know
about it until you explicitly run the integration tests with the build tag. You
probably aren't doing that yourself, you're probably letting CI do it, which
means you're getting delayed feedback, too, which is even more frustrating.

Integration tests typically need some config from the environment, to know
stuff like the address of the MySQL server they should interact with. One way
to provide that information is with test flags, but test flags are also kind of
esoteric, and are only discoverable if you remember to look for them, and run
`go test` both with with `-tags integration` and the nonstandard `-test.h`.
And test flags basically have to be package globals in order to be usable, but
[package globals should be strictly avoided](http://peter.bourgon.org/blog/2017/06/09/theory-of-modern-go.html),
even in test code.

The other way to provide that config is with env vars, which have none of the
downsides of test flags, but are unfortunately not discoverable. However, if you
gate integration tests with `t.Skip` and print the env var in the message, you
solve all your problems at once. You get runtime config to the test, you
eliminate the need for build tags as an opt-in mechanism, and you make the
opting-in mechanism discoverable -- the test output tells you exactly what to
do.

