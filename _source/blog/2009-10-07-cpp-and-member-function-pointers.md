template: blog/entry.template
title: C++ and member function pointers
---

C++ has a bit of A Thing with member function pointers. The fact that they're
there at all is pretty neat, cause from what I gather about the 80's people
weren't much into delegates and all the fancy 21st century stuff everybody's on
about these days. Honestly, I don't recall much about the decade.

But member function pointers are kind of absurd, and I'm always forgetting the
correct syntax, so I thought I'd write something real fast to remind myself.
Basically, if you have some class...

```
class Foo
{
public:
    void alpha();
    void beta();
    void delta();
};
```

You just need to define one typedef (for convenience) and then you can create a
member function pointer more or less as a first class object.

```
// typedef return-type (ClassName::*my-typedef-name)(arg1-type, arg2-type, ...)
typedef void (Foo::*SomeFooFunction)();
```

Presumably you made it to pass it around to functions, or what-have-you:

```
void call_some_function(Foo& f, SomeFooFunction func_ptr)
{
    (f.*func_ptr)();
}

int main()
{
    Foo f;
    SomeFooFunction func_ptr = &Foo::alpha;
    call_some_function(f, func_ptr); // will call f.alpha()
    return 0;
}
```

Member functions of the same return type and argument signature can be
interchangeably represented by the same member function pointer typedef.

```
class Foo
{
public:
    int do_x(float f, char c);
    int do_y(float f, char c);
    int do_z(float f, char c);
};

typedef int (Foo::*MyFunctionPtr)(float, char);

int call(Foo& f, MyFunctionPtr func_ptr, float fv, char cv)
{
    return (f.*func_ptr)(fv, cv);
}

int main()
{
    Foo f;
    MyFunctionPtr func_ptr = &Foo::do_y;
    int i = call(f, func_ptr, 1.23, 'x');
    printf("%d\n", i);
    return 0;
}
```
