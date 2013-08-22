# CSRF XSRF

Tornado内置了csrf攻击保护。只需要在初始化Application对象的时候传入xsrf_cookies即可。

>settings = {
>    "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
>    "login_url": "/login",
>    "xsrf_cookies": True,
>}
>application = tornado.web.Application([
>    (r"/", MainHandler),
>    (r"/login", LoginHandler),
>], **settings)

如果设置了xsrf_cookies，那么所有的POST/DELETE/PUT请求都会要求包含_xsrf值。所有这些请求提交都需要提交这个参数，不然会报错403。表单里包含这个参数值需要简单的在模板里包含

> {% module xsrf_form_html() %}

即可。

如果是使用ajax提交，那么可以使用js从cookie里获取_xsrf的值然后提交。cookie里的_xsrf例子如下：

> _xsrf=20b0a846fe47447198a26526dc3a6758; user="ZmQ=|1377137824|0aa7769d5ddcb5196d6963669f7166d2723af07a"

如果不是通过表单提交参数，那么_xsrf参数也可以通过http header的形式提交。此时使用的http header为X-XSRFToken。

除了在模板里使用xsrf_form_html函数来获取xsrfToken之外，还可以在RequestHandler里通过self.xsrf_token来访问当前的xsrfToken，这个是为了方便js等访问这个变量。

可以override RequestHandler.check_xsrf_cookie函数来个性化XSRF防范的行为。如果不需要这个行为，那么override其为空即可。

# Static Files

静态资源设置可以在构造Application的settings的时候传入static_path来指定静态资源访问的路径。使用了这个配置之后所有的对static_path的访问都会转换为对该静态资源文件夹的静态文件访问。并且Tornado会自动的将/favicon.ico以及/robots.txt都自动转换到该static_path下访问，即使对这些资源的访问没有使用static_path的前缀。

而且可以使用StaticFileHandler来作为静态资源访问的处理器。如果访问路径很长的话可以减短了访问的路径。


