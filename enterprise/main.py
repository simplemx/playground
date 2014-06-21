#encoding=utf-8
import tornado.ioloop
import tornado.web
import os
from startup.handler import backend, frontend
from startup.util.db import dbpool

handlers = []
handlers.extend(backend.handlers)
handlers.extend(frontend.handlers)

settings = {
    "static_path" : os.path.join(os.path.dirname(__file__), "resources"),
    "debug" : True,
    "login_url" : "/login",
    "cookie_secret" : "test",
    "xsrf_cookies" : True,
    "template_path" : os.path.join(os.path.dirname(__file__), "template/bootstrap"),
}

class Application(tornado.web.Application):
    def __init__(self):
        super(Application, self).__init__(handlers, **settings)
        "share conn among handlers"
        self.conn = dbpool.connection()

application = Application()

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


