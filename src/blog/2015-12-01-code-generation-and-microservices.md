{
	"title": "Code generation and microservices"
}
---
I've seen a lot of interest in code generation for microservices lately.

The mapping from an [IDL][] definition to the programming language domain is
roughly deterministic. That is, one could write an idl2code generation
program, that takes an IDL definition as input, and produces a service
definition (type FooService interface), as well as bindings (adapters) from
the IDL's transport to both the generated FooService and individual methods
(endpoints). Most IDLs provide compilers that do this for supported target
languages.

[IDL]: https://en.wikipedia.org/wiki/Interface_description_language

The mapping is loosely bidirectional. That is, one could also write a code2idl
generation program, that takes a service definition (type FooService
interface) as input, and produces an IDL definition to one or more transports,
as well as bindings from those transports to both the provided FooService and
individual methods (endpoints).

But, two notes on that:

- IDLs typically carry more restrictive type and structure semantics than
  programming languages. That is, it's easy to write an interface in a
  programming language that can't be expressed in a given IDL, whereas it's
  hard to write an IDL definition that can't be expressed in a given
  programming language.

- Contracts are always built against the service API (i.e. the IDL) and never
  the implementation (i.e. the code itself). That is, the API (IDL) defines
  the boundaries and behaviors of the service.

For these reasons, prefer "starting with" the IDL, treating it as the source
of truth, and generating the code, rather than starting with the service
definition in your programming language, and generating the IDL. (You'll thank
me later.)
