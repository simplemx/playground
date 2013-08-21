import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        if not self.get_secure_cookie("mycookie"):
            self.set_secure_cookie("mycookie", "value")
            self.write("your cookie was not set yet!")
        else:
            self.write("your cookie was set!")


application = tornado.web.Application([
    (r"/", MainHandler),
],cookie_secret="__todo")

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


