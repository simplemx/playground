# Templates

流程控制标签使用{% %}来包围，这个和jsp类似。里面就是纯python语法了。表达式使用{{ expression }}。

表达式有很多，包括函数调用等。

其实tornado会将整个模板转换成一个python函数，这个和jsp转换成servlet是类似的。

所有的模板输出默认都会被escaped。如果不想使用，那么全局可以使用autoescape=None来构造Application对象，{% autoescape None %}可以用来使整个模板文件不会被escaped。使用{% raw ...%}来防止某个表达式被escaped。

# Cookie

设置cookie可以使用简单的self.set_cookie/self.get_cookie函数就可以设置和取值了。

为了防止cookie被乱改，还可以使用secure_cookie。调用set_secure_cookie/get_secure_cookie方法，然后构造Application对象的时候传入cookie_secret来构造即可。

# User authentication

目前合法的用户为current_user,在RequestHandler为self.current_user,在template可以直接通过current_user来访问。默认的时候current_user为空。

override RequestHandler里的get_current_user函数，那么就可以实现用户验证了。

还可以使用tornado.web.authenticated的decorator来对那些需要用户身份验证的请求进行验证，减少程序开发来判断权限。然后通过构造Application的时候传入login_url来既可以使用了。
