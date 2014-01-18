#encoding=utf-8
import tornado.web
import os
import markdown
from startup.handler.handler import BaseHandler

##Frontend Handler begin
class BaseFrontendHandler(BaseHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

class IndexHandler(BaseFrontendHandler):
    def get(self):
        ## get articles
        articles = self.select("select article_id, name, create_date, modify_date from st_article order by article_id desc")
        self.render("frontend/index.html", articles = articles)

class LogoutHandler(tornado.web.RequestHandler):
    def post(self):
        self.clear_cookie("user")
        self.redirect("/")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("frontend/login.html")
    def post(self):
        "post login form"
        name = self.get_argument("name")
        password = self.get_argument("password")
        self.set_secure_cookie("user", name, expires_days = 1)
        self.redirect("/")

class ArticleHandler(BaseFrontendHandler):
    def get(self):
        article_id = self.get_argument("article_id")
        article = self.select("select name, content from st_article where article_id ='%s'" % article_id)
        if not article:
            self.send_error(status_code=404)
        else:
            article = article[0]
            article["content"] = markdown.markdown(article["content"])
            self.render("frontend/article.html", article = article)

handlers = [
    (r"/", IndexHandler),
    (r"/login", LoginHandler),
    (r"/doLogin", LoginHandler),
    (r"/logout", LogoutHandler),
    (r"/article", ArticleHandler),
        ]
