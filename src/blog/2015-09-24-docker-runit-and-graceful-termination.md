{
	"title": "Docker, runit, and graceful termination"
}
---
If you have a Docker container that hosts several daemons,
 it's important to also provide a supervisor process to manage their lifecycle.
I was introduced to [runit](http://smarden.org/runit) at SoundCloud, and I've been using it ever since.
It's small, purpose-built, and does everything right, including all of the tricky edge cases.

To use runit, you'll need a run script for each daemon in /etc/service/foo/run.
That will look like

```sh
#!/bin/sh

exec /path/to/foo
```

Then, you'll need a global entrypoint script, to start runit as PID 1, and have it supervise the daemons.
That will look like

```sh
#!/bin/sh

exec /sbin/runsvdir /etc/service
```

This works.
But when you stop the container, Docker sends a TERM signal to PID 1, i.e. runsvdir.
And as we read from [the man page](http://smarden.org/runit/runsvdir.8.html),

> If **runsvdir** receives a TERM signal, it exits with 0 immediately.

If we want our daemons to receive their own TERM signals,
 so they can do a graceful shutdown,
  perhaps we need to send HUP, as

> If **runsvdir** receives a HUP signal,
> it sends a TERM signal to each runsv(8) process
> it is monitoring and then exits with 111.

But sending `docker kill -s HUP` still doesn't do what we want,
 because when runsvdir returns with 111,
  Docker will immediately tear down the container.
Our daemons may not have had the chance to receive their TERM signals.

One solution employed by [phusion/baseimage-docker](https://github.com/phusion/baseimage-docker)
 is to wrap runit in
[another my_init script](https://github.com/phusion/baseimage-docker/blob/14ec533a164cdb495e1c6ab10b82ebe96695a971/image/bin/my_init).
But that requires python3, and it's a bit heavyweight besides.
It's tempting to use a shell script to approximate the same effect, i.e.

```sh
#!/bin/sh

sv_stop() {
        for s in $(ls -d /etc/service/*)
        do
                /sbin/sv stop $s
        done
}

trap "sv_stop; exit" SIGTERM
/sbin/runsvdir /etc/service &
wait
```

The TERM signal sent by `docker stop` is trapped, and each service is stopped properly.
But this script doesn't [reap orphaned zombie processes](https://blog.phusion.nl/2015/01/20/docker-and-the-pid-1-zombie-reaping-problem/),
 which is a critical task for any PID 1.

So, I wrote a small Go program,
 designed to be used as the ENTRYPOINT in a Docker container with one or more runit services,
  which converts the TERM signal from a Docker stop into graceful shutdown of those services,
   and which properly reaps orphaned zombie processes.

Check out [peterbourgon/runsvinit](https://github.com/peterbourgon/runsvinit),
 including an [example Docker container](https://github.com/peterbourgon/runsvinit/tree/master/example),
  and please let me know if I've done something stupid.
