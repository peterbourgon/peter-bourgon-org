{ "title": "Programming with xerrors" }
---

The new [package xerrors](https://godoc.org/golang.org/x/xerrors) is the future
of errors in Go. Personally, I find the API needlessly confusing. This is a
quick reference for how to use it effectively.


### Creating errors

Sentinel errors work the same as before. Name them as ErrXxx, and create them
with xerrors.New.

```go
var ErrFoo = xerrors.New("foo error")
```

Error types basically work the same as before. Name them as XxxError, and make
sure they have an Error method, to satisfy the error interface.

```go
type BarError struct {
	Reason string
}

func (e BarError) Error() string {
	return fmt.Sprintf("bar error: %s", e.Reason)
}
```

If your error type wraps another error, provide an Unwrap method, to satisfy the
[xerrors.Wrapper](https://godoc.org/golang.org/x/xerrors#Wrapper) interface.

```go
type BazError struct {
	Reason string
	Inner  error
}

func (e BazError) Error() string {
	return fmt.Sprintf("baz error: %s", e.Reason)
}

func (e BazError) Unwrap() error {
	return e.Inner
}
```

Review [xerrors.Formatter](https://godoc.org/golang.org/x/xerrors#Formatter) and
[xerrors.Printer](https://godoc.org/golang.org/x/xerrors#Printer) for more
sophisticated use cases.


### Wrapping and returning errors

By default, when you encounter an error in a function and need to return it to
the caller, wrap it with some context about what went wrong, using
[xerrors.Errorf](https://godoc.org/golang.org/x/xerrors#Errorf) and the `%w`
verb.

```go
func process(j Job) error {
	result, err := preprocess(j)
	if err != nil {
		return xerrors.Errorf("error preprocessing job: %w", err)
	}
```

This process is called error annotation. Avoid returning un-annotated errors,
because that can make it difficult for callers to understand what went wrong.

Also, consider wrapping errors via a custom error type (like BazError, above)
for more sophisticated use cases.

```go
	p := getPriority()
	widget, err := manufacture(p, result)
	if err != nil {
		return ManufacturingError{Priority: p, Error: err}
	}
```


### Checking errors

Most of the time, when you receive an error, you don't care about the details.
Whatever you were trying to do failed, so you either need to report the error
(e.g. log it) and carry on; or, if it's not possible to continue, annotate the
error with context, and return it to the caller.

If you care about which error you received, you can check for sentinel errors
with [xerrors.Is](https://godoc.org/golang.org/x/xerrors#Is), and for error
values with [xerrors.As](https://godoc.org/golang.org/x/xerrors#As).

```go
func a() (int, error) {
	i, err := b()
	if xerrors.Is(err, ErrFoo) {
		// you know you got an ErrFoo
		// respond appropriately
	}

	var bar BarError
	if xerrors.As(err, &bar) {
		// you know you got a BarError
		// bar's fields are populated
		// respond appropriately
	}
```

xerrors.Is and xerrors.As will both try to unwrap the error, recursively, in
order to find a match. [This code](https://play.golang.org/p/3LSIO1DAjLg)
demonstrates basic error wrapping and checking techniques. Look at the order of
the checks in `func a()`, and then try changing the error that's returned by
`func c()`, to get an intuition about how everything works.

Avoid testing errors with plain equality, e.g. `if err == ErrFoo`. This only
works for sentinel errors, not error values, and it doesn't perform any
unwrapping. If you explicitly don't want to allow callers to unwrap errors,
provide a different formatting verb, like `%v`, to `xerrors.Errorf`, or don't
provide an `Unwrap` method on your error type. But this should be rare.
