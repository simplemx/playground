#encoding=utf-8
import tornado.ioloop
import tornado.web
import os
import MySQLdb
from DBUtils.PersistentDB import PersistentDB

## DB pool

dbpool = PersistentDB(creator=MySQLdb, maxusage=1000, host='127.0.0.1', user='root', passwd='', port=3306, db='startup', charset='utf8')

## ui template mode
template_mode = "template/bootstrap/%s"

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
    def update(self, sql):
        conn = dbpool.connection()
        cur = conn.cursor()
        cur.execute(sql)
        cur.close()
        conn.commit()
        conn.close()
        return True
    def get_template(self, template_name):
        return template_mode % template_name

class BaseBackendHandler(BaseHandler):
    def get_login_url(self):
        return "/backendlogin"
    def get_current_user(self):
        return self.get_secure_cookie("backend_user")
    def renderMsg(self, msg):
        self.render(self.get_template("backend/msg.html"), msg = msg)

class BaseFrontendHandler(BaseHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


##Backend Handler begin

class BackendLoginHandler(BaseBackendHandler):
    def get(self):
        self.render(self.get_template("backend/login.html"))
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
        self.render(self.get_template("backend/index.html"))

class BackendMenuHandler(BaseBackendHandler):
    def select_menu(self):
        return self.select("select menu_id,menu_name,parent_id,url,sort from st_menu")
    @tornado.web.authenticated
    def get(self):
        menus = self.select_menu()
        self.render(self.get_template("backend/menu.html"), menus = menus)
    @tornado.web.authenticated
    def post(self):
        mode = self.get_argument("mode")
        msg = "提交成功"
        menu_id = self.get_argument("menu_id")
        if mode == "1" :
            "edit"
            menu_name = self.get_argument("menu_name")
            url = self.get_argument("url","")
            parent_id = self.get_argument("parent_id","")
            sql = "update st_menu set menu_name='%s',url='%s',parent_id='%s' where menu_id='%s'" % (menu_name,url,parent_id,menu_id)
        elif mode == "2" :
            "add"
            menu_name = self.get_argument("menu_name")
            parent_id = self.get_argument("parent_id","")
            url = self.get_argument("url","")
            sql = "insert into st_menu (menu_id,menu_name,parent_id,url) values('%s','%s','%s','%s')" % (menu_id,menu_name,parent_id,url)
        elif mode == "3" :
            "delete"
            sql = "delete from st_menu where menu_id='%s'" % menu_id
        self.update(sql)
        menus = self.select_menu()
        self.renderMsg(msg)

class BackendUserHandler(BaseBackendHandler):
    def select_all_user(self):
        return self.select("select user_id,user_name,signature,create_time from st_user")
    @tornado.web.authenticated
    def get(self):
        users = self.select_all_user()
        self.render(self.get_template("backend/user.html"), users = users)
    @tornado.web.authenticated
    def post(self):
        msg = "操作成功"
        mode = self.get_argument("mode")
        user_id = self.get_argument("user_id", "")
        user_name = self.get_argument("user_name", "")
        signature = self.get_argument("signature", "")
        if "0" == mode :
            "add"
            self.update("insert into st_user(user_name,signature,create_time) values('%s','%s',now()) " % (user_name, signature))
        elif "1" == mode :
            "modify"
            self.update("update st_user set user_name='%s',signature='%s' where user_id=%s" % (user_name, signature, user_id))
        else :
            "delete"
            self.update("delete from st_user where user_id='%s'" % user_id)
        self.renderMsg(msg)

class BackendAdminPwdHandler(BaseBackendHandler):
    @tornado.web.authenticated
    def get(self):
        self.render(self.get_template("backend/admin_pwd.html"))
    @tornado.web.authenticated
    def post(self):
        msg = "修改成功"
        old_pwd = self.get_argument("old_pwd")
        password = self.get_argument("password")
        admin = self.get_current_user()
        admin_info = self.select("select password from st_admin where admin_name='%s'" % admin)
        if old_pwd != admin_info[0]["password"] :
            msg = "输入的旧密码错误，请检查"
        else :
            self.update("update st_admin set password='%s' where admin_name='%s'" %(password, admin))
        self.renderMsg(msg)

class BackendResourceHandler(BaseBackendHandler):
    "handler process img upload"
    @tornado.web.authenticated
    def get(self):
        imgs = self.select("select resource_id, name, b.admin_name as uploader, upload_time,url from st_resource a, st_admin b where a.upload_admin_id=b.admin_id")
        self.render(self.get_template("backend/resource.html"), imgs = imgs)
    @tornado.web.authenticated
    def post(self):
        msg = "提交成功"
        mode = self.get_argument("mode")
        if mode == "0" :
            name = self.get_argument("name")
            if "file" in self.request.files:
                f = open(("resources/user/%s" % self.request.files["file"][0]["filename"]) , "wb")
                f.write(self.request.files["file"][0]["body"])
                f.close()
                admin_info = self.select("select admin_id from st_admin where admin_name='%s'" % self.get_current_user())
                self.update(("insert into st_resource (name,url,upload_time,upload_admin_id) values('%s','%s',now(),%s)" % (name, ("user/%s" %  self.request.files["file"][0]["filename"]), admin_info[0]["admin_id"])))
            else:
                self.send_error(status_code=400)
        elif mode == "2" :
            resource_id = self.get_argument("resource_id")
            self.update("delete from st_resource where resource_id = '%s'" % resource_id)
        self.renderMsg(msg)

##Frontend Handler begin

class IndexHandler(BaseFrontendHandler):
    def get(self):
        self.render("index.html")

class LogoutHandler(tornado.web.RequestHandler):
    def post(self):
        self.clear_cookie("user")
        self.redirect("/")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("login.html")
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
    (r"/adminpwd", BackendAdminPwdHandler),
    (r"/backenduser", BackendUserHandler),
    (r"/backendresource", BackendResourceHandler),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


