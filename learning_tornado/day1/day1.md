
# Helloworld

首先是Hello World。

>import tornado.ioloop
import tornado.web
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")
application = tornado.web.Application([
    (r"/", MainHandler),
])
if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

这个程序太简单了，都不知道有什么好说。

路由URL设置那里可以设置为正则表达式，正则的值会传入到RequestHandler的处理函数中。

>class StoryHandler(tornado.web.RequestHandler):
    def get(self, story_id):
        self.write("You requested the story " + story_id)
application = tornado.web.Application([
    (r"/story/([0-9]+)", StoryHandler),
])

而获取请求参数的是调用RequestHandler.get_argument函数。

>class MyFormHandler(tornado.web.RequestHandler):
    def get(self):
        self.write('<html><body><form action="/myform" method="post">'
                   '<input type="text" name="message">'
                   '<input type="submit" value="Submit">'
                   '</form></body></html>')
    def post(self):
        self.set_header("Content-Type", "text/plain")
        self.write("You wrote " + self.get_argument("message"))

这里有个注意点，如果没有传入请求参数，然后调用self.get_argument的时候会抛错400,这里需要做异常处理。

获取请求对象可以直接调用self.request对象，这里可以获取请求相关的对象。

# RequestHandler

下面理解一下RequestHandler。

1.每次请求都会产生一个新的RequestHandler对象。

2.生命周期。initialize(__init__) -> prepare -> get/post/etc -> on_finish。

以上的方法，initialize/prepare/on_finish都是可以重写的。

其他可以重写的方法有：

write_error：错误处理，可以用来作通用错误处理

set_default_headers: 设置默认response的header

# Error Handling

1.write_error
2.call send_error,其实也是调用write_error函数。

# Redirection

1.self.redirect

2.RedirectHandler
