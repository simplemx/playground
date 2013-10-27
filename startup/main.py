import tornado.ioloop
import tornado.web
import os

class BaseBackendHandler(tornado.web.RequestHandler):
    def get_login_url(self):
        return "/backendlogin"
    def get_current_user(self):
        return self.get_secure_cookie("backend_user")

class BaseFrontendHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

class BackendLoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("template/backend/login.html")
    def post(self):
        "post login form"
        name = self.get_argument("name")
        password = self.get_argument("password")
        self.set_secure_cookie("backend_user", name, expires_days=1)
        self.redirect("/backend")

class BackendLogoutHandler(tornado.web.RequestHandler):
    def post(self):
        self.clear_cookie("backend_user")
        self.redirect("/backend")

class BackendHandler(BaseBackendHandler):
    @tornado.web.authenticated
    def get(self):
        self.render("template/backend/index.html")

class IndexHandler(BaseFrontendHandler):
    def get(self):
        self.render("template/index.html")

class LogoutHandler(tornado.web.RequestHandler):
    def post(self):
        self.clear_cookie("user")
        self.redirect("/")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("template/login.html")
    def post(self):
        "post login form"
        name = self.get_argument("name")
        password = self.get_argument("password")
        self.set_secure_cookie("user", name, expires_days = 1)
        self.redirect("/")

settings = {
    "static_path" : os.path.join(os.path.dirname(__file__), "resources"),
    "debug" : True,
    "login_url" : "/login",
    "cookie_secret" : "test",
    "xsrf_cookies" : True,
}
application = tornado.web.Application([
    (r"/", IndexHandler),
    (r"/login", LoginHandler),
    (r"/doLogin", LoginHandler),
    (r"/logout", LogoutHandler),
    (r"/backend", BackendHandler),
    (r"/backendlogin", BackendLoginHandler),
    (r"/backendlogout", BackendLogoutHandler),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


