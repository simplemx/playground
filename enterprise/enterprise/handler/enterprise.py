#encoding=utf-8
import tornado.web
import config
import handler

# base handler
class EnterpriseHandler(handler.BaseHandler):
    def render(self, template_name, **kwargs):
        # set default ajax mode for ajax get requests
        # ajax_mode = self.get_argument("_ajax_mode", False)
        kwargs["_ajax_mode"] = self.get_argument("_ajax_mode", False)
        kwargs["_uri"] = self.getRealURI(self.request.uri)
        super(EnterpriseHandler, self).render(template_name, **kwargs)

class QueryHandler(EnterpriseHandler):
    def get(self):
        self.render("busi_query.html")
    def post(self):
        print self.get_argument("cond1")
        print self.get_argument("cond2")
        self.renderMsg("成功")

class OperateHandler(EnterpriseHandler):
    def get(self):
        self.render("busi_oper.html", services = config.services)

class OperateUserInfoHandler(EnterpriseHandler):
    def get(self):
        service_id = self.get_argument("service-id")
        self.render("busi_oper_userinfo.html", service_id = service_id)
    def post(self):
        service_id = self.get_argument("service_id")
        cond1 = self.get_argument("cond1")
        cond2 = self.get_argument("cond2")
        print ("%s %s %s" % (service_id, cond1, cond2))
        self.render("busi_oper_result.html", result_msg = "成功")

class OperateConfirmHandler(EnterpriseHandler):
	def get(self):
		self.render("busi_oper_confirm.html")
handlers = [
    (r"/", EnterpriseHandler),
    (r"/querybusi", QueryHandler),
    (r"/operatebusi", OperateHandler),
    (r"/operatebusi/userinfo", OperateUserInfoHandler),
	(r"/operatebusiconfirm", OperateConfirmHandler),
        ]

