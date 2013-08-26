# Non-blocking, asynchronous requests

这块看了介绍后总觉得水很深，介绍的太简单了。

请求在RequestHandler的get/post方法等之后都会结束，而如果使用tornado.web.asynchronous decorator，那么get方法结束之后请求是不会结束的，什么时候请求结束的责任将会交由开发者去调用self.finish方法，才会结束该次请求。

    class MainHandler(tornado.web.RequestHandler):
        @tornado.web.asynchronous
        def get(self):
            http = tornado.httpclient.AsyncHTTPClient()
            http.fetch("http://friendfeed-api.com/v2/feed/bret",
                   callback=self.on_response)

        def on_response(self, response):
            if response.error: raise tornado.web.HTTPError(500)
            json = tornado.escape.json_decode(response.body)
            self.write("Fetched " + str(len(json["entries"])) + " entries "
                   "from the FriendFeed API")
            self.finish()

从上面的例子可以看出，在get函数里会获取远程http服务的json串，然后将json写回到response里了，这里由于获取http服务是一个异步请求，所以写入返回也是在一个异步请求里完成的。通过在异步请求里调用on_response来关掉请求，可以避免这些耗时高的请求阻塞住请求处理器，分发给下面的服务来完成请求。

这块还有好多更需挖掘的。

