import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world<a href='/redirect'>test</a>")

class TestHandler(tornado.web.RequestHandler):
    def get(self):
        self.redirect("/", permanent=False)

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/redirect", TestHandler),
    (r"/re", tornado.web.RedirectHandler, dict(url="/", permanent=False)),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

