{ "title": "Programming with errors" }
---
Go 1.13 introduces an enhanced [package errors](https://golang.org/pkg/errors)
(née [xerrors](https://godoc.org/golang.org/x/xerrors)) which roughly
standardizes programming with errors. Personally, I find the API confusing. This
is a quick reference for how to use it effectively.


### Creating errors

Sentinel errors work the same as before. Name them as ErrXxx, and create them
with errors.New.

```go
var ErrFoo = errors.New("foo error")
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

If your error type wraps another error, provide an Unwrap method.

```go
type BazError struct {
	Reason string
	Inner  error
}

func (e BazError) Error() string {
	if e.Inner != nil {
		return fmt.Sprintf("baz error: %s: %v", e.Reason, e.Inner)
	}
	return fmt.Sprintf("baz error: %s", e.Reason)
}

func (e BazError) Unwrap() error {
	return e.Inner
}
```


### Wrapping and returning errors

By default, when you encounter an error in a function and need to return it to
the caller, wrap it with some context about what went wrong, using
[fmt.Errorf](https://golang.org/pkg/fmt#Errorf) and the new `%w`
verb.

```go
func process(j Job) error {
	result, err := preprocess(j)
	if err != nil {
		return fmt.Errorf("error preprocessing job: %w", err)
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
with [errors.Is](https://golang.org/pkg/errors#Is), and for error
values with [errors.As](https://golang.org/pkg/errors#As).

```go
err := f()
if errors.Is(err, ErrFoo) {
	// you know you got an ErrFoo
	// respond appropriately
}

var bar BarError
if errors.As(err, &bar) {
	// you know you got a BarError
	// bar's fields are populated
	// respond appropriately
}
```

errors.Is and errors.As will both try to unwrap the error, recursively, in
order to find a match. **[This code](https://play.golang.org/p/GorSR6HTWzf)
demonstrates basic error wrapping and checking techniques.** Look at the order
of the checks in `func a()`, and then try changing the error that's returned by
`func c()`, to get an intuition about how everything works.

Avoid testing errors with plain equality, e.g. `if err == ErrFoo`, or e.g.
`switch err { case ErrFoo: `. This only works for sentinel errors, not error
values, and it doesn't perform any unwrapping. If you explicitly don't want to
allow callers to unwrap errors, provide a different formatting verb, like `%v`,
to `fmt.Errorf`, or don't provide an `Unwrap` method on your error type. But
this should be rare.
