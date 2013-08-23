import tornado.ioloop
import tornado.web
import os

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("staticcontentversioning.html")

settings = {
    "static_path" : os.path.join(os.path.dirname(__file__), "static"),
}
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/(icon\.png)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


