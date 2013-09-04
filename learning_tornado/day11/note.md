# Application Configuration

class tornado.web.Application(handlers=None, default_host='', transforms=None, wsgi=False, **settings)

这个类的实例用来传给HTTPServer来处理请求。

传入的handlers参数可以是URLSpec对象或者是(regexp, request_class)的tuples。当有请求到达的时候，tornado会迭代handlers，找出第一个匹配的来处理这个请求。

每一个tuple可以包含第三个可选参数，第三个参数是dict，这个参数将会传递给RequestHandler的初始化函数。

可以通过add_handlers函数来添加RequestHandler.

## settings

settings是用来个性化tornado服务。包括:

### 通用设置

debug : 是否debug mode。

gzip : 是否启用gzip压缩。

log_function : 传入的函数会在每次请求结尾的时候调用来记录日志结果。

ui_modules : 设置UIModule来个性化UI组件。

### 安全认证

cookie_secret : 设置secure_cookie的加密。

login_url : 登录url

xsrf_cookies : 设置xsrf防范是否启用。

### Template

autoscape : 设置是否自动escape。

template_path : 模板的路径。

template_loader : 设置个性化的template_loader。

### 静态文件

static_path : 设置静态文件访问的目录。

static_url_prefix :  设置静态文件的访问路径前缀，默认为/static/。

static_handler_class/static_handler_args : 设置个性化的静态文件处理RequestHandler。
