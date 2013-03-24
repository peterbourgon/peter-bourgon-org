cherrypy is a pretty good lightweight HTTP server for Python, and to their
credit they make it really easy to get started in a simple, single-purpose app.
But if you ever want to add a cherrypy server into an existing program, or
manage the server in a more object-oriented (or at least non-global) way, it's a
little tricky to figure out how. The quickstart() method is not so useful here,
and they like to emphasize that in the documentation.

So, here is my implementation of a modular cherrypy (3.1+) "server" object that
may be independently started/stopped.

```
from __future__ import with_statement
import cherrypy
import threading

class HTTPServer(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.sync = threading.Condition()

    def run(self):
        with self.sync:
            cherrypy.server.socket_port = 8080
            #cherrypy.server.socket_host = optional hostname
            cherrypy.tree.mount(MySiteClass(), "/", None)
            cherrypy.engine.start()
        cherrypy.engine.block()

    def stop(self):
        with self.sync:
            cherrypy.engine.exit()
            cherrypy.server.stop()
```
