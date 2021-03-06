#encoding=utf-8
import tornado.web
import os
from startup.handler.handler import BaseHandler

class BaseBackendHandler(BaseHandler):
    def get_login_url(self):
        return "/backendlogin"
    def get_current_user(self):
        return self.get_secure_cookie("backend_user")
    def renderMsg(self, msg):
        self.render("backend/msg.html", msg = msg)

##Backend Handler begin

class BackendLoginHandler(BaseBackendHandler):
    def get(self):
        self.render("backend/login.html")
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
        self.render("backend/index.html")

class BackendMenuHandler(BaseBackendHandler):
    def select_menu(self):
        return self.select("select menu_id,menu_name,parent_id,url,sort from st_menu")
    @tornado.web.authenticated
    def get(self):
        menus = self.select_menu()
        self.render("backend/menu.html", menus = menus)
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
        self.render("backend/user.html", users = users)
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
        self.render("backend/admin_pwd.html")
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
        self.render("backend/resource.html", imgs = imgs)
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

class BackendArticleHandler(BaseBackendHandler):
    @tornado.web.authenticated
    def get(self):
        admin = self.get_current_user()
        admin_info = self.select("select admin_id from st_admin where admin_name='%s'" % admin)
        articles = self.select("select article_id, name, content, create_date, modify_date from st_article where author_id='%s'" % admin_info[0]["admin_id"])
        self.render("backend/article.html", articles = articles)

    @tornado.web.authenticated
    def post(self):
        mode = self.get_argument("mode")
        article_id = self.get_argument("article_id")
        if mode == "2":
            "delete"
            self.update("delete from st_article where article_id ='%s'" % article_id)
        self.renderMsg("提交成功")
        
class BackendArticleEntityHandler(BaseBackendHandler):
    @tornado.web.authenticated
    def get(self):
        article_id = self.get_argument("article_id", -1)
        is_edit = False
        article = None
        if article_id > 0:
            #edit
            article = self.select("select article_id, name, content, create_date, modify_date from st_article where article_id='%s'" % article_id)
            article = article[0]
            is_edit = True
        self.render("backend/article_entity.html", is_edit = is_edit, article = article)
    
    @tornado.web.authenticated
    def post(self):
        is_edit = self.get_argument("is_edit")
        content = self.get_argument("content", "")
        title = self.get_argument("title")
        if is_edit == "True":
            #edit
            article_id = self.get_argument("article_id")
            self.update("update st_article set name='%s', content='%s' where article_id = '%s'" % (title, content, article_id))
        else:
            admin = self.get_current_user()
            admin_info = self.select("select admin_id from st_admin where admin_name='%s'" % admin)
            self.update("insert into st_article(name, content, create_date, author_id)   values('%s','%s',now(), '%s')" % (title, content, admin_info[0]["admin_id"]))
        self.renderMsg("提交成功")


handlers = [
    (r"/backend", BackendHandler),
    (r"/backendlogin", BackendLoginHandler),
    (r"/backendlogout", BackendLogoutHandler),
    (r"/backendmenu", BackendMenuHandler),
    (r"/adminpwd", BackendAdminPwdHandler),
    (r"/backenduser", BackendUserHandler),
    (r"/backendresource", BackendResourceHandler),
    (r"/backendarticle", BackendArticleHandler),
    (r"/articleentity", BackendArticleEntityHandler),
        ]
