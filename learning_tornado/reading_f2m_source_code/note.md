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



# handler/topic.py

业务handler里f2m的模式都是get的时候传入template_variables这个变量，然后在get请求里将topics/replies等属性设置到变量里，然后render的时候通过base.py里重写的render_string函数来将这些变量传递给jinja2来渲染。

但是感觉每个get的变量赋值有些重复，每个get里都有获取users等的公共获取。换取来的就是代码清晰简单。表单校验和poweredsites类似，也是使用form对象来validate。



# handler/user.py

do_login/do_logout函数的声明并不是放在class里作为实例函数，而是声明为静态函数，参数里带有self，方便类公用，不过放在父类等地方是不是也可以呢，或者以mixin的方式来重用。

采用hashlib来进行sha算法md5算法等。



# form/user.py

使用wtforms模块来进行校验。例如：

    class LoginForm(Form):
        email = TextField('Email', [
            validators.Required(message = "必须填写Email"),
            validators.Length(min = 4, message = "Email长度有误"),
            validators.Email(message = "Email地址无效"),
        ])

虽然代码看上去的确挺清晰的，但是感觉校验代码都统一到另外一个地方，好处坏处都有，首先好处是提示语可以集中在一块，这样修改调整方便。坏处是和实际处理的地方不在同一处，有点不方便。而且只为了校验引入这个库，是不是有点不值得呢？



# lib/session.py

session的管理是使用memcache来管理的。

首先看Session，__init__函数里传入sessionmanager以及requesthandler，首先根据sessionmanager从requesthandler里获取session对象，其实也就是从浏览器的sessionid来获取，然后从memcache里查询出session对象。查到session对象，那么将所有对象的值都赋给Session对象。其实Session对象每次实例化的时候都会重新将key value构造一遍。

SessionManager的__init__函数传入memcache地址以及timeout。_fetch根据sessionid来从memcache里查询session数据。调用get函数的时候获取浏览器的sessionid cookie，然后根据sessionid调用_fetch函数来查询memcache里的session数据。

这里使用了pickle模块来进行序列化对象。


