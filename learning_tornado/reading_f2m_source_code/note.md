# application.py

路由的定义全部放在这个文件里，构建tornado.web.Application的子类，然后override __init__函数，在里面初始化settings以及handlers。

    handlers = [
            (r"/", handler.topic.IndexHandler),
            (r"/t/(\d+)", handler.topic.ViewHandler),
            (r"/t/create/(.*)", handler.topic.CreateHandler),
            (r"/t/edit/(.*)", handler.topic.EditHandler),
            (r"/reply/edit/(.*)", handler.topic.ReplyEditHandler),
            (r"/node/(.*)", handler.topic.NodeTopicsHandler),
            (r"/u/(.*)/topics", handler.topic.UserTopicsHandler),
            (r"/u/(.*)/replies", handler.topic.UserRepliesHandler),
            (r"/u/(.*)/favorites", handler.topic.UserFavoritesHandler),
            (r"/u/(.*)", handler.topic.ProfileHandler),
            (r"/vote", handler.topic.VoteHandler),
            (r"/favorite", handler.topic.FavoriteHandler),
            (r"/unfavorite", handler.topic.CancelFavoriteHandler),
            (r"/notifications", handler.notification.ListHandler),
            (r"/members", handler.topic.MembersHandler),
            (r"/setting", handler.user.SettingHandler),
            (r"/setting/avatar", handler.user.SettingAvatarHandler),
            (r"/setting/avatar/gravatar", handler.user.SettingAvatarFromGravatarHandler),
            (r"/setting/password", handler.user.SettingPasswordHandler),
            (r"/forgot", handler.user.ForgotPasswordHandler),
            (r"/login", handler.user.LoginHandler),
            (r"/logout", handler.user.LogoutHandler),
            (r"/register", handler.user.RegisterHandler),
            (r"/(favicon\.ico)", tornado.web.StaticFileHandler, dict(path = settings["static_path"])),
            (r"/(sitemap.*$)", tornado.web.StaticFileHandler, dict(path = settings["static_path"])),
            (r"/(bdsitemap\.txt)", tornado.web.StaticFileHandler, dict(path = settings["static_path"])),
            (r"/(.*)", handler.topic.ProfileHandler),
        ]

使用分离出去的torndb模块来连接数据库。

     # Have one global connection to the blog DB across all handlers
     self.db = torndb.Connection(
         host = options.mysql_host, database = options.mysql_database,
         user = options.mysql_user, password = options.mysql_password
     )

另外memcache、session也使用这样的方式来共享对象

    # Have one global session controller
    self.session_manager = SessionManager(settings["cookie_secret"], ["127.0.0.1:11211"], 0)
    # Have one global memcache controller
    self.mc = memcache.Client(["127.0.0.1:11211"])

在__init__函数里定义self.db是application这个对象里的实例变量，每次运行期间只有一个的存在，所以db、memcache等都是应用内共享的。



# handler/base.py

session和jinja2对象在__init__内被构造。然后针对db，user_model等对象定义property decoractor。

重写render_string函数，为jinja2的模板渲染的时候传入xsrf_form_html等RequestHandler对象里的对象，这些对象在jinja2模板内不能使用，必须重写后将这些信息传过去。




