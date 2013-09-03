import tornado.ioloop
import tornado.web
import os

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("template/index.html")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("template/login.html")

settings = {
    "static_path" : os.path.join(os.path.dirname(__file__), "resources"),
    "debug" : True,
    "login_url" : "/login",
}
application = tornado.web.Application([
    (r"/", IndexHandler),
    (r"/login", LoginHandler),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

