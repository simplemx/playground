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
        return result

    def update(self, sql):
        cur = self.conn.cursor()
        cur.execute(sql)
        cur.close()
        self.conn.commit()
        self.conn.close()
        return True
