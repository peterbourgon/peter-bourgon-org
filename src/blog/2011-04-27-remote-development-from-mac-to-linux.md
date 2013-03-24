{ "title": "Remote development from Mac to Linux" }
---
I love using a Mac as my development machine, but when I'm writing code for a
Linux target the options are slim pickings. There are a lot of headaches
involved with things like sshfs or NFS. It's a little silly to run a
virtualized Ubuntu install just to run "make". You can't always install a full
X desktop on a build server to NX or VNC in for Eclipse. And while ssh+vim is
fine for maintenance and code browsing, I personally give up a lot of
productivity, and burn a lot of finger calories, if I try to do feature
development in it.

If I can do all my source code management locally, with local Mac tools like
MacHG, Eclipse.app, and eg. TextMate or Sublime Text, I'm a lot happier. And it
works fine until I either have to build or run something. So I started thinking
a bit on how to effectively take local changes, and do all compilation and
execution steps on a remote host. And I came up with a little remote execution
script, call it **remote-run.sh**

```
#!/bin/sh

USER=$1
HOST=$2
if [[ $USER == "" || $HOST == "" ]] ; then
	echo "usage: `basename $0` user host command"
	exit 1
fi
shift 2

LOCAL_DIR=`pwd`
REMOTE_DIR=`echo $LOCAL_DIR | sed -e "s/Users/home/"`

ssh $USER@$HOST "cd $REMOTE_DIR && $*"
```

It's got a few assumptions built in to it: namely, that your Mac's
/Users/yourname is mirrored on your remote host as /home/yourname. And
implicitly, that you're only working in a subdirectory therein. But set up that
script in your ~/bin, and create an alias in your .bash_profile like

```
alias rr='/Users/yourname/bin/remote-run.sh yourname yourhost'
```

and suddenly, if your source code directory structure is mirrored properly, you
can browse around and do neat stuff like

```
$ cd ~/src/libfoo
$ rr make
gcc -c -Wall -fPIC -o foo.o foo.c
gcc -Wall -fPIC -shared -o libfoo.so foo.o
gcc -Wall -o test_foo foo.o test_foo.c
$
```

Which is really cool! And actually really fast, so long as your server's
sshd_config properly has UseDNS no ([via][1]).

[1]: http://www.thegeekstuff.com/2010/07/openssh-slow-at-ssh2_msg_service_accept-received/

But that raises the question: how to keep your local source tree in sync with
your remote server? Well, if you take another small script, called
**remote-sync.sh**

```
#!/bin/sh

USER=$1
HOST=$2
if [[ $USER == "" || $HOST == "" ]] ; then
	echo "usage: `basename $0` user host"
	exit 1
fi
shift 2

LOCAL_DIR=`pwd`
REMOTE_DIR=`echo $LOCAL_DIR | sed -e "s/Users/home/"`

SAFE_DIR=/Users/yourname/yoursrcrootdir
if [[ $LOCAL_DIR != $SAFE_DIR/* ]] ; then
	echo "`basename $0`: not under $SAFE_DIR, won't sync"
	exit 1
fi

rsync --verbose --recursive --times \
	--exclude ".hg" \
		$LOCAL_DIR/ $USER@$HOST:$REMOTE_DIR
```

And then create another alias, like

```
alias rs='/Users/yourname/bin/remote-sync.sh yourname yourhost'
```

you can browse around your local source tree, make whatever changes you want,
and update/build on the remote machine with a one-liner

```
$ mkdir -p ~/src/foobar
$ cd ~/src/foobar
$ cat <<EOF >foobar.cc
> #include <iostream>
> int main() {
>     std::cout << "hi!\n";
>     return 0;
> }
> EOF
$ rs
building file list ... done
./
foobar.cc

sent 189 bytes  received 54 bytes  486.00 bytes/sec
total size is 75  speedup is 0.31
$ rr make foobar
g++     foobar.cc   -o foobar
$ rr ./foobar
hi!
$
```

Which I think is pretty amazing. And if you've got a local Eclipse.app, all you
need to do to trick it into doing this remote build is changing its default
build command from "make" to a script that does exactly these steps, call it
**remote-make.sh**

```
#!/bin/sh

~/bin/remote-sync.sh yourname yourhost
~/bin/remote-run.sh yourname yourhost make
```

The amazing thing is it's transparent to Eclipse: any errors you get from that
output will be seamlessly applied as squiggly red underlines to your local
instance. This may not be the best remote development setup available, but it's
extraordinarily lightweight, fast, and not incompatible with dropping down to
the commandline when you need to.
