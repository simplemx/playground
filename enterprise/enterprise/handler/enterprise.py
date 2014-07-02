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
        services = [{
                "name" : "service1",
                "price" : "12",
                "id" : "1"
            },
            {
                "name" : "service2",
                "price" : "13",
                "id" : "2"
                }]
        self.render("busi_oper.html", services = services)
    def post(self):
        print self.get_argument("service-id")
        self.render("busi_oper_confirm.html")

handlers = [
    (r"/", EnterpriseHandler),
    (r"/query", QueryHandler),
    (r"/oper", OperateHandler),
        ]

