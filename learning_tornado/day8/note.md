# Debug Mode

Debug Mode和HttpServer的多进程处理模式是冲突的，如果使用了Debug Mode，那么HTTPServer.start的参数不能大于1，不要使用tornado.process.fork_processes。

autoreload是可以作为一个单独的模块来使用的tornado.autoreload。

在一些平台上，autoreload会导致新旧进程存在。

# WSGI and Google AppEngine

因为WSGI不支持non-blocking requests，所以如果使用WSGI而不是使用Tornado的httpserver的话，那么Tornado将不能使用Async/non-blocking requests。

使用WSGI的时候，不能在使用 tornado.web.Application了，换成为使用tornado.wsgi.WSGIApplication。

    application = tornado.wsgi.WSGIApplication([
        (r"/", MainHandler),
    ])
    wsgiref.handlers.CGIHandler().run(application)


