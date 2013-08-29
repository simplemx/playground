# RequestHandler

## entry points

RequestHandler.initialize() 子类可以重写这个函数来执行初始化的操作。构造Application的时候传入第三个参数会被当做keyword参数传入initialize函数。

    class ProfileHandler(RequestHandler):
        def initialize(self, database):
            self.database = database
        def get(self, username):
            ...
    app = Application([
        (r'/user/(.*)', ProfileHandler, dict(database=database)),
        ])

RequestHandler.prepare() 当RequestHandler发起请求的时候都会触发这个函数，无论请求的是get还是post等。重写这个函数来进行公共的初始化的操作。

RequestHandler.on_finish() 在请求结束的时候会自动触发。重写这个函数来处理清除资源等。在response返回内容到浏览器之后才触发。

RequestHandler.get/post/put/delete/options/head 这6个函数是作为实际的处理request的地方。

## input

RequestHandler.get_argument(name, default=[], strip=True) 返回请求里name对应的值。如果没有传入default，那么这个获取的这个参数将会被认为是必须的，将会抛错MissingArgumentError。所以避免抛错的时候可以传入default参数。

如果请求的参数名出现多次，以最后一次为准。并且，返回的值都是被unicode。


RequestHandler.get_arguments(name, strip= True) 返回对应name的值列表。如果请求里不带这个参数，那么返回空list。

RequestHandler.decode_argument(value, name=None) 用于decode 请求里的参数。用在get_argument等。

RequestHandler.request 对HTTPRequest对象的引用。

RequestHandler.path_kwarrs、path_args 这两个参数是定义传递到get、post等函数的参数，在那些函数调用之前就已经设置了这些参数了，在prepare的时候就可以访问这些参数了。

## output

RequestHandler.set_status(status_code, reason=None) 这个函数用于设置返回的状态码。reason是可传参数，如果没有设置的时候，会从httplib.responses里获取原因。

RequestHandler.set_header(name, value) 这个函数用于设置返回的header。默认值都是encode为UTF-8。

RequestHandler.add_header(name, value) 这个函数和set_header的区别是，set_header是设置，add_header可以调用多次，同一个header里包含多个value。

RequestHandle.clear_header(name) 这个函数用于清除response里的header。但是这个函数不能清除通过add_header设置的多个值。

RequestHandler.set_default_headers() 这个函数用来设置默认的返回的header。重写这个方法将会导致http头在请求开始的时候就被设置默认的值。

RequestHandler.write(chunk) 将chunk内容写入到返回的buffer中。chunk内容只是写入到buffer中，需要再调用flush函数才能将buffer返回到输出流。

如果chunk是dict，那么自动转换为JSON并且设置content-type为json。如果需要个性化不使用这个content-type，那么需要在write之后再手工调用set_header。

需要注意的是因为安全方面的因素list不会被转换为json来返回，所有的json返回都必须包装在dict里。

RequestHandler.flush(include_footers=False, callback=None) 将当前buffer里的内容flush到网络上返回给浏览器。

如果callback参数有设置。当所有内容都写入到返回的socket之后将会触发这个callback函数。需要注意的是，一次只有一个flush callback能够生效，如果调用了两次flush，那么之前的flush的callback将会被丢弃。

RequestHandler.finish(chunk=None) 完成这个返回。结束这次HTTP请求。

RequestHandler.render(template_name, **kwargs) 通过传入的模板名称来渲染模板。

RequestHandler.render_string(template_name, **kwargs) 返回模板名称对应的模板内容。但是没有写入到response内。

RequestHandler.get_template_namespace() 返回模板的模板namespace。可以被重写来增加个性化。

RequestHandler.redirect(url, permanent=False, status=None) 重定向到url，如果permanent为True则为301，否则为302。status会被设置为http status返回。

RequestHandler.send_error(status_code=500, **kwargs) 发送一个错误码到浏览器。flush如果已经调用了，那么是不能再发送错误码过去了，这个函数会终结返回。如果之前已经往返回内容了写入了内容但是没有被flush，那么将会被扔掉。

重写write_error函数来个性化自己的返回的错误页面，kwargs参数将会被传递给write_error。

RequestHandler.write_error(status_code, **kwargs) 个性化错误页面。

RequestHandler.clear() 清除返回里的所有header和内容。
