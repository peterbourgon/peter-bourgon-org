template: blog/entry.template
title: nginx, virtual hosts, and forwarding
---

If you're running nginx for a web server (typically a good idea) it's pretty
straightforward to patch virtual hosts to different document roots. Edit your
sites-available config file, and add a section like:

```
server {
	listen 80;
	server_name subdomain.domain.com;
	access_log /var/log/nginx/subdomain.domain.com.access.log;
	root /var/www/subdomain;
}
```

I wanted to take a subdomain (or virtual host, if you will) and forward it to a
completely different service, serving HTTP requests on a different port on the
same box. I was expecting a long slog through configs and forum posts, but it's
almost equally as easy:

```
server {
	listen 80;
	server_name service.domain.com;
	access_log /var/log/nginx/service.domain.com.access.log;
	location / {
		proxy_pass http://127.0.0.1:9999/;
	}
}
```

As always, to bounce nginx, it's just sudo /etc/init.d/nginx restart - simple!
