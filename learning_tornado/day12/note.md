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
