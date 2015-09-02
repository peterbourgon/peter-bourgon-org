## An open letter to A.A.

### In clarification of my hastily-written thoughts on Web applications, and in response to his comments on the same.

First, let me say that you're right: I'm unlikely to convert you to one
particular mode of development, or one way of thinking about development. Nor
should I aim to, as we all benefit from a broad ecosystem of models. Though I
will make persuasive arguments, this is not meant to be a wholly persuasive
document. I'm mostly interested in clarifying my own thoughts. That
established...

As software developers in the age of the internet, we're interested in sharing
information between computers over a network. It may mean parallel processing to
solve a difficult task, or federation of roles/responsibility among different
classes of machines, or providing a view of some data on machine A to a
recipient on machine B. Sometimes a human is involved, sometimes not.

The question is: what method do we use to share this data? And the answer should
depend on our goals as a developer. In other words, we should choose the
technology based on the requirements of the application, rather than adapting
the application to suit a given technology.

If my computer is interested in sending a piece of information to another one,
how can it be accomplished? At a bare-metal level, we need something to be
responsible for taking that information, marshaling it into our transport
protocol, de-marshaling it on the receiving end, and passing it up the stack to
the recipient. This is the core of distributed computing; any distributed
computing mechanism must be able to handle at least this much. It sounds simple,
but there are many points to be considered if we [expect reliable success][1]:

* Latency issues cannot be ignored.
* Simple distributed invocations are subject to partial failure.
* Concurrency adds additional failure modes due to indeterminism, and results in
  a fundamentally different (inferior) quality of service.

All these points lead to the inescapable conclusion that
"[it is a stupid idea to build a distributed application as if it were a non-distributed one][1]."
And it follows that we will design a distributed application differently,
depending on the characteristics we value the most.

An online banking application probably values reliable, consistent data and
security above speed; a network TV application the opposite. "Web" applications
don't--shouldn't--get a pass on this sort of fundamental analysis simply
because we expect to access them through a browser. If I want a blazingly fast
Internet search application, my requirements shouldn't be compromised because of
an underlying assumption that, say, the results have to be provided in XML,
because it's "flexible". If my searcher is expected first and foremost to be
fast (and it is!) then imposing such restrictions when alternatives exist is
Just Plain Wrong(tm).

What does this have to do with Web applications?

Web applications, indeed most applications, overwhelmingly operate on the
principle of "provide input to module, get output." They operate on the basis of
function calls or method invocations: input X, output Y. Type search term, get
list of URLs. Type bank account number and password, get current balance. Input
location from GPS-enabled device, get list of friends in 20 mile radius.

HTTP is a request-response protocol, but one designed to handle specific types
of requests and responses: input URI, output document. It is stateless,
maintains no session knowledge, and provides value-added features to the effect
of advancing this singular purpose: input URI, output document.

That it is possible to map other application domains to this model does not make
it prudent. A URI is not a function call. A document is not an interface.

"[HTTP was not at all designed][2] around the programming language procedure
call model abstraction."
"[HTTP is not RPC][3];" it uses "a stream as a parameter [and] requests are
directed to resources using a generic interface with standard semantics. ...
RPC mechanisms, in contrast, are defined in terms of language APIs, not
network-based applications."

When you deviate from the stated and designed purpose of the protocol, you're
objectively Doing It Wrong(tm). And, pitifully, enough people started wanting to
Do It Wrong(tm) that entire cottage industries sprung up to make it easier. As I
mentioned before, the corruption of CSS and things like AJAX and jQuery are
among the most visible disturbances in the Force. But even below those, we have
these SOAP and REST paradigms that assist the Web application developer in
making his mistakes, adding stateful and session-oriented layers to an
inherently incompatible transfer protocol. So developers must do one of two
things: they must re-invent, poorly, a type of HTTP-as-RPC, repeating mistakes
of the past and wasting time and energy on an inescapably inferior product; or,
they must mutate their application, and indeed their entire model of application
development, to fit the constraints they've needlessly (and incorrectly) forced
themselves into.

Web applications largely exist in the realm of the latter, and the tools of Web
application developers, such as Ruby on Rails, have evolved to encourage and
support that paradigm-shift, though I would argue incompetently, without a real
understanding of what they're actually doing. No doubt there are many people
getting increasingly skilled at this sort of work. For me it is like a physician
who has become extremely proficient at finding the correct vein to let blood.

As an aside, this line of argument is all moot if your application (in the
broadest possible sense of the word "application") is both designed from the
ground-up to operate in the stateless REST/SOAP/HTTP paradigm, and interacts
with the user through true, pure HTML documents-as-documents. But it's quite
difficult for me to imagine an application in the classic sense that can
translate to this model. I'd argue any such thing is more accurately described
as a simple content-serving web site, such as Project Gutenberg, dict.org, or
(very arguably) the original/unadorned Google.com. Which, of course, is
precisely my point: the Web is no place for applications.

What the Web application developer actually wants is something we've already had
for a long time: actual, desktop-style applications, that you download and run
on your own PC. Of course there are huge headaches involved in this model:
cross-platform accessibility, operating system version compatibility, library
availability, and so on. I neither deny them nor diminish their impact. But in
order to avoid those headaches, Web developers co-opted a fundamentally
unsuitable technology to do things they have no business doing. And despite the
pitfalls of the alternatives, that is Just Plain Wrong(tm).

Often, what developers really want is a remote procedure call, or RPC. It's an
idea that's been around since the 70's, and tons of mental and physical effort
has been spent by very intelligent people to make RPC systems reliable, robust,
powerful and efficient. Today there are lots of these sorts of middlewares, from
CORBA (early 90's, largely deprecated) to ZeroC's ICE (which I've used
extensively) to Google's internal-cum-external Protocol Buffers and
Facebook's/Apache's Thrift. These allow developers to define (typically)
language-agnostic data types and interfaces, and make (to some degree) network-
agnostic method invocations. For machine-to-machine communication, 99% of the
time, this is both the most appropriate and most efficient way of sharing data.
Plus, they have the added advantage of being designed to do exactly what they're
being used to do: input X, output Y, for any values of X and Y.

This is the extent of my argument against Web applications/Web services, and the
source of my antagonism towards Web 2.0, Ruby on Rails, enterprise Java/Tomcat
stuff, 37signals, etc. etc. I can advocate for any number of alternative
technologies (including RPC, where appropriate) but I guess that's another thing
entirely.

[1]: http://zeroc.com/blogs/michi/2008/07/17/another-note-on-distributed-computing
[2]: http://zeroc.com/blogs/michi/2008/07/22/a-matter-of-definition/
[3]: http://www.ics.uci.edu/~fielding/pubs/dissertation/evaluation.htm
