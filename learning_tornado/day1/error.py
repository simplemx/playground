import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.get_argument("test")
        self.write("Hello, world")
    def write_error(self, status_code, exc_info=None, **kargs):
        self.write("error:" + str(status_code))

application = tornado.web.Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
