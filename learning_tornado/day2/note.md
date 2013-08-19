# Redirection

1.self.redirect

>    self.redirect('/somepage', permanent=True)

permanent为True触发301 Moved Permanently，否则触发302 Found

2.RedirectHandler 

>    application = tornado.web.Application([
>        (r"/", MainHandler),
>        (r"/redirect", TestHandler),
>        (r"/re", tornado.web.RedirectHandler, dict(url="/", permanent=False)),
>    ])

The default RedirectHandler status code is 301 Moved Permanently, but to use 302 Found instead, set permanent to False.

# Templates

使用self.render

>class MainHandler(tornado.web.RequestHandler):
>    def get(self):
>        items = ["Item 1", "Item 2", "Item 3"]
>        self.render("template.html", title="My title", items=items)