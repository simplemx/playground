# Static Content Versioning

在模板里的静态资源的url出使用static_url函数。

    <img src="{{ static_url("images/logo.png") }}"/>

使用static_url函数的时候，路径是会直接匹配到配置的static_path当中去。比如static_path配置的是/static，那么上述的img的src也就是请求/static/images/logo.png。其实在配置了static_path之后，无论是直接请求/static/*.jpg还是直接访问/*.jpg,都会请求static_path下的资源。

使用static_url函数后，该资源的URI会变成类似如下这样：

    /static/images/logo.png?v=aae54

这个v是图片资源的hash。使用了v之后，图片的response header时候会加上expires。这样后续的访问就可以避免更多请求以及304返回等。

并且v的hash值是根据文件的内容来产生的，如果文件更新了并且重启了服务器，那么服务器才会生成一个新的hash值，如果服务器不重启，那么会是使用老的hash值的。


# Localization

当前用户的locale可以通过RequestHandler的self.locale来访问，在模板中可以直接通过locale来访问。可以通过locale.name来访问当前的locale名字。

可以通过locale.translate来对字符串进行翻译。模板里可以调用_()。

默认tornado会侦查Accept-Language header来判断用户使用的locale。如果没找到合适的locale，那么会使用默认的en_US来作为locale。如果需要个性化locale，那么可以override RequestHandler的get_user_locale函数。这个函数如果返回为None，那么会使用tornado的默认逻辑。
