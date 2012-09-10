template: blog/entry.template

---

Spent the last few days learning [the Go language](http://golang.org). It's
gotten a surprisingly negative reaction among the literati. I think a lot of it
is Google-fatigue, but a lot might be legitimate language issues. I'll talk
about one: parallelization speeds. Go provides goroutines as simple mechanisms
for parallelization. Essentially 'go' is a keyword in the language that lets you
background a function call. The language multiplexes goroutines onto threads
"efficiently" and according to the GOMAXPROCS environment variable.

Well and good. So I dusted off the part of my brain that was once capable of
implementing sorting algorithms, and whipped up a
[naive quicksort](http://code.google.com/p/peterbourgon/source/browse/go/demo/sort/quicksort.go?r=e0b1200f512bcd5034919abfa5b202a9bea1bf69),
which was simple enough to
[strengthen and parallelize](http://code.google.com/p/peterbourgon/source/browse/go/demo/sort/quicksort.go?r=4f5e3aa4d0e57fd521b7976df60895cd33e376e2).

But benchmarking with `time`, I discovered that performance went down
as processors went up. To some degree one can expect this: the job you ask a new
thread (or goroutine) to perform must be sufficiently complex that the
computation isn't dwarfed by the cost of manufacturing the thread (or
goroutine). So, I
[optimized](http://code.google.com/p/peterbourgon/source/diff?spec=svn3fbedfa218f08a98a98b1c992ac320bdcb29889d&r=3fbedfa218f08a98a98b1c992ac320bdcb29889d&format=side&path=/go/demo/sort/quicksort.go)
a bit by only spawning routines when the data set
was sufficiently large, otherwise keeping computation in the same routine. This
had a significant improvement on my GOMAXPROCS=1 benchmarks, but still the
multi-core version was half again or twice slower.

Thinking it was some fault in my implementation, I dug up
[somebody else's quicksort implementation](http://code.google.com/p/peterbourgon/source/browse/go/demo/sort/quicksort2.go)
and, applying the same data set size optimization, put it to the test. Same
results. So, I dug through the mailing list to see that,
[quote](http://groups.google.com/group/golang-nuts/browse_thread/thread/9f09c82c45942065/808b8c336f7fac11?lnk=gst&q=adam+langley+%22suitable+problems%22#808b8c336f7fac11),

> In time, suitable problems should be able to see a linear speedup in number of
> cores, but we're not there yet.

and so that apparently "parallelized computations taking in many cases longer
than their single-threaded counterparts is a known issue at this point" -- still
waiting on confirmation on that one. I want to be optimistic but this seems
pretty bad. I'm going to keep hunting around for maybe a "suitable problem" that
will see *any* "speedup" in number of cores, because for the moment Go is
an interesting language to be writing in, and a welcome break from
[the bowels of C++](http://code.google.com/p/peterbourgon/source/browse/cpp/plbth/src/Genesis.cpp).
I hope I can find one.
