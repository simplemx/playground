#encoding=utf-8
import tornado.web
import MySQLdb
from startup.util.db import dbpool

class BaseHandler(tornado.web.RequestHandler):
    def select(self, sql):
        conn = dbpool.connection()
        cur = conn.cursor(MySQLdb.cursors.DictCursor)
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result
    def update(self, sql):
        conn = dbpool.connection()
        cur = conn.cursor()
        cur.execute(sql)
        cur.close()
        conn.commit()
        conn.close()
        return True
