#encoding=utf-8
import tornado.web

class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, *argc, **argkw):
        super(BaseHandler, self).__init__(*argc, **argkw)

    def _set_default_value(self, list):
        "tornado's default behavior will output None into None \
                so turn None into empty string"
        if len(list) > 0:
            for each in list:
                for key in each:
                    if each[key] is None:
                        each[key] = ""
