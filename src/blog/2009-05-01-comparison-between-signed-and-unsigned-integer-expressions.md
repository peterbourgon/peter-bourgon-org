Many times I find myself comparing `size_t` with `int`; for example, when I need
to check that a vector isn't bigger than some runtime-determined boundary value.
Using `-Wall` (as everyone should be), and assuming your `size_t` is defined
rationally, compilers correctly flag this as problematic:

```
./test.cpp: In function main:
./test.cpp:8: warning: comparison between signed and unsigned integer expressions
```

I think the best solution is to `static_cast` one to the other. But which to
which? If you cast the `int` to a `size_t`, you run the risk of a negative `int`
overflowing into an incorrectly-huge `size_t`. And if you cast the `size_t` to
an int, you run the risk of a huge `size_t` overflowing into an incorrectly-
negative int. So, pragmatically, if your `int` has a high likelihood of being
negative, you should cast your `size_t` to an `int`; if your `size_t` has a high
likelihood of being larger than your implementation's max `int` value, you
should cast your `int` to a `size_t`.

Yet, at a high level, `size_t` is a "concept" both in the sense that it is not
directly a primitive type, and that it represents something not immediately
mathematical: it's a non-negative count of a number of items. That, handily,
maps to an unsigned something `int` in C++, as an implementation detail. So one
could argue that the best bet is to cast the `int` to a `size_t`, as it's
casting a lower-order concept to a higher one, which (presumably) is capable of
handling it.

But an `int` is also a sort of "concept", albeit a mathematical one directly
supported by most modern languages. It's an integer value that may by definition
be negative; any limitation on the size of that value is an implementation
detail. In other words, by definition and ignoring implementation details, a
size_t is-a `int`, whereas an `int` is-NOT-a `size_t`. And therefore, I think in
the general case you should compare `int`s and `size_t`s by casting the `size_t`
to an `int`, eg.

```
int max_size = ...;
if (static_cast<int>(my_vector.size()) > max_size)
{
    // handle error
}
```

Luckily this also tends to be the correct pragmatic choice; if your STL
containers regularly contain more than N-million elements, you are probably not
very interested in bounds-checking them.
