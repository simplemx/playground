# Decorators

## tornado.web.asynchronous(method)

用于标记这个函数为异步。只能用于RequestHandler的get/post等几个函数。如果使用了这个decorator，那么在RequestHandler的get/post函数完成后是不会将response返回到浏览器的，开发者需要使用self.finish()函数来完成当前请求。如果没有这个decorator，那么RequestHandler的请求将会在get/post函数完成后完结。

## tornado.web.authenticated(method)

用于声明这个请求的访问必须要用户已经登录，如果没登录那么redirect去login_url。

## tornado.web.addslash(method)

这个decorator会为请求的路径加上缺失的/。比如请求的是/foo那么会被redirect到/foo。

## tornado.web.removeslash(method)

这个和addslash相反。

# Other

## tornado.web.HTTPError(status_code, log_message=None, *args, **kwargs)

异常信息。raise HTTPError会触发RequestHandler.send_error函数。

## tornado.web.FallbackHandler(application, request, **kwargs)

这个RequestHandler用于包装另外一个http server的回调，比如用于Tornado 服务和WSGI服务的一起使用。

## tornado.web.StaticFileHandler(application, request, **kwargs)

用于服务静态内容。如果使用static_path来构造Application对象，那么会实例化一个StaticFileHandler来处理配置的静态请求。

StaticFileHandler构造的时候需要传入path参数来确定静态文件的路径。

这个类只适用于访问量少的文件服务，如果文件访问量大，那么使用apache或者nginx。

# HTTP Server

## tornado.httpserver.HTTPServer(request_callback, no_keep_alive=False, io_loop=None, xheaders=False, ssl_options=None, protocal=None, **kwargs)

这个服务由一个请求处理实例来完成对请求的处理，这个处理函数入参是request，并且将response通过request.write来写入，然后调用request.finish来完成这个请求。当然，如果是keep-alive的请求的时候这个请求事实上是不会被关闭的。

HTTPServer初始化的时候可以使用三种方式：

1.listen简单单进程模式

    server = HTTPServer(app)
    server.listen(8888)
    IOLoop.instance().start()

另外还可以使用tornado.web.Application.listen来代替上述的代码。

2.bind/start简单的多进程模式

    server = HTTPServer(app)
    server.bind(8888)
    server.start(0)
    IOLoop.instance().start()

3.add_sockets高级的多进程模式

    sockets = tornado.netutil.bind_sockets(8888)
    tornado.process.fork_processes(0)
    server = HTTPServer(app)
    server.add_sockets(sockets)
    IOLoop.instance().start()


