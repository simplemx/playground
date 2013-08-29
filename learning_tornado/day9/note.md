# RequestHandler

    entry points

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

RequestHandler.get/post/put/delete/options 这5个函数是作为实际的处理request的地方。
