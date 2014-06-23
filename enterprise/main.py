#encoding=utf-8
import tornado.ioloop
import tornado.web
import os
from enterprise.handler import enterprise

handlers = []
handlers.extend(enterprise.handlers)

settings = {
    "static_path" : os.path.join(os.path.dirname(__file__), "resources"),
    "debug" : True,
    "login_url" : "/login",
    "cookie_secret" : "test",
    "xsrf_cookies" : True,
    "template_path" : os.path.join(os.path.dirname(__file__), "template"),
}

class Application(tornado.web.Application):
    def __init__(self):
        super(Application, self).__init__(handlers, **settings)

application = Application()

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
