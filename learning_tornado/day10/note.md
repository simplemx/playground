# RequestHandler

## other

RequestHandler.application 引用Application对象。

RequestHandler.async_callback(callback, *args, **kwargs) 已经废弃了。

RequestHandler.check_xsrf_cookie() 为了防止攻击，tornado设置了_xsrf cookie，并且在所有的post请求的时候都会将这个参数作为表单参数进行提交。tornado会调用这个函数来对请求表单里的这个参数进行是否非法校验。

_xsrf可以通过设置在form表单或者是http header内的X-XSRFToken/X-CSRFToken 内。

RequestHandler.compute_etag() 为这个请求计算etag header。

RequestHandler.create_template_loader(template_path) 为这个模板路径返回template_loader。如果为application设置了template_loader，那么将会使用那个template_loader。

RequestHandler.get_browser_local(default='en_US') 返回浏览器用户的local。根据请求头的accept-language头来进行决定。

RequestHandler.get_current_user() 返回目前的用户，一般情况下是根据cookie。

RequestHandler.get_login_url() 返回配置在Application里的login_url，可以重写为个性化的请求。

RequestHandler.get_status() 返回当前response的状态码。

RequestHandler.get_template_path() 返回配置在Application里的template_path，也可以个性化来从不同的RequestHandler里来获取不同的template_path。

RequestHandler.get_user_locale() 可以override来决定当前用户的locale，如果不设置那么将会和get_browser_local一样。

RequestHandler.log_exception(typ, value, tb) 可以override来个性化异常的日志记录。

RequestHandler.on_connection_close() 在异步的情况下客户端关闭连接的时候会触发这个函数。override这个方法去关闭相关的资源和收尾工作。注意这个函数只在异步请求的时候关闭才会触发，如果需要在所有请求结束时候做的收尾工作应该在on_finish里完成。

RequestHandler.require_setting(name, feature='this feature') 如果Application里的app setting没有设置这个属性，那么抛错。

RequestHandler.static_url(path, include_host=None, **kwargs) 返回传入的相对路径的静态资源URL并且是带上版本号的。需要为Application里设置上static_path。

RequestHandler.xsrf_form_html() 生成一段input的html，放在表单里，方便提交。
