#encoding=utf-8
import tornado.web
import MySQLdb

class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, *argc, **argkw):
        super(BaseHandler, self).__init__(*argc, **argkw)
        self.conn = self.application.conn

    def select(self, sql):
        cur = self.conn.cursor(MySQLdb.cursors.DictCursor)
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        self.conn.close()
        self._set_default_value(result)
        return result

    def _set_default_value(self, list):
        "tornado's default behavior will output None into None \
                so turn None into empty string"
        if len(list) > 0:
            for each in list:
                for key in each:
                    if each[key] is None:
                        each[key] = ""

    def update(self, sql):
        cur = self.conn.cursor()
        cur.execute(sql)
        cur.close()
        self.conn.commit()
        self.conn.close()
        return True
