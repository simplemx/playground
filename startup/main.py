#encoding=utf-8
import tornado.ioloop
import tornado.web
import os
from startup.handler import backend, frontend

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
application = tornado.web.Application(handlers, **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


