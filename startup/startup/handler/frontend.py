#encoding=utf-8
import tornado.web
import os
from startup.handler.handler import BaseHandler

##Frontend Handler begin
class BaseFrontendHandler(BaseHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

class IndexHandler(BaseFrontendHandler):
    def get(self):
        self.render("index.html")

class LogoutHandler(tornado.web.RequestHandler):
    def post(self):
        self.clear_cookie("user")
        self.redirect("/")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("login.html")
    def post(self):
        "post login form"
        name = self.get_argument("name")
        password = self.get_argument("password")
        self.set_secure_cookie("user", name, expires_days = 1)
        self.redirect("/")
