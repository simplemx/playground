import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class MyFormHandler(tornado.web.RequestHandler):
    def get(self):
        print self.request
        self.write('<html><body><form action="/myform" method="post">'
                   '<input type="text" name="message">'
                   '<input type="submit" value="Submit">'
                   '</form></body></html>')

    def post(self):
        self.set_header("Content-Type", "text/plain")
        try:
            self.write("You wrote " + self.get_argument("message"))
        except:
            raise tornado.web.HTTPError(403)

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/myform", MyFormHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

