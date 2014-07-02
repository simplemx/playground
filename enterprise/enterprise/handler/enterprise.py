#encoding=utf-8
import tornado.web

class EnterpriseHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
    def renderMsg(self, msg):
        self.render("msg.html", msg = msg)

class QueryHandler(EnterpriseHandler):
    def get(self):
        self.render("busi_query.html")
    def post(self):
        print self.get_argument("cond1")
        print self.get_argument("cond2")
        self.renderMsg("成功")

class OperateHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("busi_oper.html")

handlers = [
    (r"/", EnterpriseHandler),
    (r"/query", QueryHandler),
    (r"/oper", OperateHandler),
        ]

