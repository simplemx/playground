#encoding=utf-8
import tornado.ioloop
import tornado.web
import os
from startup.handler.backend import BackendHandler, BackendLoginHandler, \
        BackendResourceHandler, BackendUserHandler, BackendMenuHandler, \
        BackendAdminPwdHandler, BackendLogoutHandler
from startup.handler.frontend import IndexHandler, LogoutHandler, \
        LoginHandler


settings = {
    "static_path" : os.path.join(os.path.dirname(__file__), "resources"),
    "debug" : True,
    "login_url" : "/login",
    "cookie_secret" : "test",
    "xsrf_cookies" : True,
    "template_path" : os.path.join(os.path.dirname(__file__), "template/bootstrap"),
}
application = tornado.web.Application([
    (r"/", IndexHandler),
    (r"/login", LoginHandler),
    (r"/doLogin", LoginHandler),
    (r"/logout", LogoutHandler),
    (r"/backend", BackendHandler),
    (r"/backendlogin", BackendLoginHandler),
    (r"/backendlogout", BackendLogoutHandler),
    (r"/backendmenu", BackendMenuHandler),
    (r"/adminpwd", BackendAdminPwdHandler),
    (r"/backenduser", BackendUserHandler),
    (r"/backendresource", BackendResourceHandler),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


