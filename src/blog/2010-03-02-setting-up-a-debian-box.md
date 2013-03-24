{ "title": "Setting up a Debian box" }
---
I recently bought a [Linode][1] virtual server,
and in the course of setting it up I realized I have a pretty by-rote series of
things I like to do to any new Linux (Debian) machine.

[1]: http://www.linode.com

First, it's important to grab any/all security updates, as specified by the
Linode [Getting Started guide][2]

[2]: http://library.linode.com/getting-started

```
# apt-get upgrade
# apt-get upgrade --show-upgraded
```

You don't want to really ever log in as root, so make sure your user account
(created via adduser) can do superuser things via apt-get
install sudo and editing /etc/sudoers.

```
# User privilege specification
root    ALL=(ALL) ALL
foobar  ALL=(ALL) ALL
```

Then, I like to tweak sshd a bit, by editing /etc/sshd/sshd_config. Most
importantly, I make sure root login is disabled. Also, I try to prevent my
connection from timing out while sitting idle (super annoying!).

```
PermitRootLogin no

ClientAliveInterval 600
ClientAliveCountMax 10
```

Then bounce sshd via /etc/init.d/ssh restart.

That typically does it for initial system config. I usually end up installing
[Squid][3] as a general-purpose web proxy (surprisingly useful) via apt-get
install squid, and in order for me to use it from the internet at large there
is a bit in the config that I normally have to dig around for.

[3]: http://www.squid-cache.org

```
# http_access allow localnet
http_access allow all # allow all IPs to use the proxy

# And finally deny all other access to this proxy
#http_access deny all # make sure this is commented out
```

There's a fun little shell script you can write to help automate the blocking
of malicious IPs. Edit /etc/network/interfaces and make sure at the bottom
there's the following line:

```
post-up iptables-restore /etc/network/iptables.save
```

Then, you can use this shell script:

```
#!/bin/bash

if [ "$1" == "" ] ; then
	echo "Usage: $0 <ip-address>"
	exit
fi

sudo iptables -I INPUT -s $1 -j DROP
sudo bash -c "iptables-save &gt; /etc/network/iptables.save"
```

Beyond that, there are a number of packages I like to have, but installing them
is an easy apt-get install X away.

```
sudo apt-get install g++ python2.5 git-core mercurial subversion screen nmap
```

