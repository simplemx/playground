import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        para = self.get_argument("test")
        self.write("Hello, world" + para)

class ParaHandler(tornado.web.RequestHandler):
    def get(self, id):
        self.write("your parameter is :" + id)

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/para/([0-9]+)", ParaHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

