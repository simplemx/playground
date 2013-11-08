#encoding=utf-8
import tornado.ioloop
import tornado.web
import os
import MySQLdb
from DBUtils.PersistentDB import PersistentDB

## DB pool

dbpool = PersistentDB(creator=MySQLdb, maxusage=1000, host='127.0.0.1', user='root', passwd='', port=3306, db='startup', charset='utf8')

##BASE Handler
class BaseHandler(tornado.web.RequestHandler):
    def select(self, sql):
        conn = dbpool.connection()
        cur = conn.cursor(MySQLdb.cursors.DictCursor)
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result
    def delete(self, sql):
        conn = dbpool.connection()
        cur = conn.cursor()
        cur.execute(sql)
        cur.close()
        conn.close()
        return True

class BaseBackendHandler(BaseHandler):
    def get_login_url(self):
        return "/backendlogin"
    def get_current_user(self):
        return self.get_secure_cookie("backend_user")

class BaseFrontendHandler(BaseHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


##Backend Handler begin

class BackendLoginHandler(BaseBackendHandler):
    def get(self):
        self.render("template/backend/login.html")
    def post(self):
        "post login form"
        name = self.get_argument("name")
        password = self.get_argument("password")
        "query from db and judge info security"
        admin_info = self.select("select password from st_admin where admin_name='%s'" % name )
        if not admin_info or not admin_info[0]["password"] or admin_info[0]["password"] != password:
            self.send_error(status_code=401) 
            return
        self.set_secure_cookie("backend_user", name, expires_days=1)
        self.redirect("/backend")

class BackendLogoutHandler(tornado.web.RequestHandler):
    def post(self):
        self.clear_cookie("backend_user")
        self.redirect("/backend")

class BackendHandler(BaseBackendHandler):
    @tornado.web.authenticated
    def get(self):
        self.render("template/backend/index.html")

class BackendMenuHandler(BaseBackendHandler):
    def select_menu(self):
        return self.select("select menu_id,menu_name,parent_id,url,sort from st_menu")
    @tornado.web.authenticated
    def get(self):
        menus = self.select_menu()
        self.render("template/backend/menu.html", menus = menus)
    @tornado.web.authenticated
    def post(self):
        mode = self.get_argument("mode")
        msg = "提交成功"
        if mode == 1 :
            "edit"
        elif mode == 2 :
            "add"
        elif mode == 3 :
            "delete"
            menu_id = self.get_argument("menu_id")
            self.delete("delete st_menu st where st.menu_id=%s" % menu_id)
        menus = self.select_menu()
        self.render("template/backend/menu.html", menus = menus, msg = msg)
        


##Frontend Handler begin

class IndexHandler(BaseFrontendHandler):
    def get(self):
        self.render("template/index.html")

class LogoutHandler(tornado.web.RequestHandler):
    def post(self):
        self.clear_cookie("user")
        self.redirect("/")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("template/login.html")
    def post(self):
        "post login form"
        name = self.get_argument("name")
        password = self.get_argument("password")
        self.set_secure_cookie("user", name, expires_days = 1)
        self.redirect("/")

settings = {
    "static_path" : os.path.join(os.path.dirname(__file__), "resources"),
    "debug" : True,
    "login_url" : "/login",
    "cookie_secret" : "test",
    "xsrf_cookies" : True,
}
application = tornado.web.Application([
    (r"/", IndexHandler),
    (r"/login", LoginHandler),
    (r"/doLogin", LoginHandler),
    (r"/logout", LogoutHandler),
    (r"/backend", BackendHandler),
    (r"/backendlogin", BackendLoginHandler),
    (r"/backendlogout", BackendLogoutHandler),
    (r"/backendmenu", BackendMenuHandler),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


