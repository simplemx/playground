#encoding=utf-8
import tornado.web
from enterprise.handler.handler import BaseHandler

class IndexHandler(BaseHandler):
    def get(self):
        self.render("index.html")

handlers = [
    (r"/", IndexHandler),
        ]

