{
	"title": "A theory of modern Go"
}
---

_tl;dr: magic is bad; global state is magic → no package level vars; no func init_

The single best property of Go is that it is basically [non-magical](https://news.ycombinator.com/item?id=13949588).
With very few exceptions, a straight-line reading of Go code leaves no ambiguity about definitions, dependency relationships, or runtime behavior.
This makes Go relatively easy to read, which in turn makes it relatively easy to maintain, which is 
 [the single highest virtue](http://programmingisterrible.com/post/139222674273/write-code-that-is-easy-to-delete-not-easy-to) of industrial programming.

But there are a few ways that magic can creep in.
One unfortunately very common way is through the use of global state.
Package-global objects can encode state and/or behavior that is hidden from external callers.
Code that calls on those globals can have surprising side effects, which subverts the reader's ability to understand and mentally model the program.

Functions (including methods) are basically the only mechanism that Go has to build abstraction.
Consider the following function definition.

```go
func NewObject(n int) (*Object, error)
```

By convention, we expect that functions of the form NewXxx are type constructors.
That expectation is validated when we see that the function returns a pointer to an Object, and an error.
From this we can deduce that the constructor function may or may not succeed, and if it fails, that we will receive an error telling us why.
We observe that the function takes a single int parameter, which we assume controls some aspect or capability of the returned Object.
Presumably, there is some constraint on n, which, if not met, will result in an error.
But because the function takes no other parameter, we expect it should have no other effect, beyond (hopefully) allocating some memory.

By reading the function signature alone, we are able to make all of these deductions, and build a mental model of this function.
This process, applied repeatedly and recursively from the first line of func main, is how we read and understand programs.

Now, consider if this were the body of the function.

```go
func NewObject(n int) (*Object, error) {
	row := dbconn.QueryRow("SELECT ... FROM ... WHERE ...")
	var id string
	if err := row.Scan(&id); err != nil {
		logger.Log("during row scan: %v", err)
		id = "default"
	}
	resource, err := pool.Request(n)
	if err != nil {
		return nil, err
	}
	return &Object{
		id:  id,
		res: resource,
	}, nil
}
```

The function invokes a package global database/sql.Conn, to make a query against some unspecified database;
 a package global logger, to output a string of arbitrary format to some unknown location;
 and a package global pool object of some kind, to request a resource of some kind.
All of these operations have side effects that are completely invisible from an inspection of the function signature.
There is no way for a caller to predict any of these things will happen, except by reading the function and diving to the definition of all of the globals.

Consider this alternative signature.

```go
func NewObject(db *sql.DB, pool *resource.Pool, n int, logger log.Logger) (*Object, error)
```

By lifting each of the dependencies into the signature as parameters, we allow readers to accurately model the scope and potential behaviors of the function.
The caller knows exactly what the function needs to do its work, and can provide them accordingly.

If we're designing the public API for this package, we can even take it one helpful step further.

```go
// RowQueryer models part of a database/sql.DB.
type RowQueryer interface {
	QueryRow(string, ...interface{}) *sql.Row
}

// Requestor models the requesting side of a resource.Pool.
type Requestor interface {
	Request(n int) (*resource.Value, error)
}

func NewObject(q RowQueryer, r Requestor, logger log.Logger) (*Object, error) {
	// ...
}
```

By modeling each concrete object as an interface, capturing only the methods we use, we allow callers to swap in alternative implementations.
This reduces source-level coupling between packages, and enables us to mock out the concrete dependencies in tests.
Testing the original version of the code, with concrete package-level globals, involves tedious and error-prone swapping-out of components.

If all of our constructors and functions [take their dependencies explicitly](https://peter.bourgon.org/go-best-practices-2016/#program-design), then we no longer have any use for globals.
Instead, we can construct all of our database connections, our loggers, our resource pools, in our func main, so that
 [future readers](https://blogs.msdn.microsoft.com/oldnewthing/20070406-00/?p=27343/) can very clearly map out a component graph.
And we can very explicitly pass those dependencies to the components that use them, so that we eliminate the comprehension-subverting magic of globals.
Also, observe that if we have no global variables, we have no more use for func init, whose only purpose is to instantiate or mutate package-global state.
We can then look at all uses of func init with appropriate suspicion: what is this code doing? Why is it not in func main, where it belongs?

It's not only possible, but quite easy, and actually extremely refreshing, to write Go programs that are practically free of global state.
In my experience, programming in this way is not noticeably slower or more tedious than using global variables to shrink function definitions.
On the contrary: when a function signature reliably and completely describes the behavior-scope of the function body, we can reason about, refactor, and maintain code in the large much more efficiently.
[Go kit](https://github.com/go-kit/kit) has been written in this style since the very beginning, to its great benefit.

— – -

From this, we can develop a theory of modern Go.
[Based on the words of](https://twitter.com/davecheney/status/871939730761547776) Dave "Humbug" Cheney, I propose the following guidelines:

- No package level variables
- No func init

There are exceptions, of course. But from these rules, the other practices follow naturally.

