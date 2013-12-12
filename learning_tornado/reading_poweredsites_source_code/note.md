# poweredsites/handlers/admin.py

每一个页面一个Handler，使用self.db来进行数据库操作，和我之前的写法一样，直接handler里写入sql，没有过度封装。代码基本就是简单是get然后进行render。

定义了sub_handlers。定义子域名下的不同访问URL以及对应的Handler。

    sub_handlers = ["^admin.poweredsites.org$",
                [(r"/?", AdminIndexHandler),
                 (r"/clearcache", AdminClearCacheHandler),
                 (r"/newusers", AdminNewUsersHandler),
                 ##(r"/addsiteslug", AdminAddSiteSlugHandler),
               ]
            ]



# poweredsites/handlers/blog.py

其他的BaseHandler都放在/libs/handler.py里，不明白为什么这里将这个BaseHndler放到这个具体页面模块里。

首先可以看到这个BaseHandler里的prepare函数。

     def prepare(self):
        super(BlogBaseHandler, self).prepare()
        self._context.title = "Blog"
        self._context.keywords = "Blog," + self._context.keywords
        self._context.is_help = False

这个_context是怎么实现的呢，后续再弄明白，但是这里可以看出它是定义页面的title以及keywords然后进行页面渲染。并且后续可以看到BlogIndexHandler里的get函数进行了self._context.css.append("highlight.css")的调用，可以看出页面使用的元素都是放在_context对象里的。

BlogFeedHandler里使用self.set_header("Content-Type", "application/atom+xml")来使用feed的content-type。

使用self.db.get进行select语句，使用self.db.execute来进行update语句。

使用markdown来将markdown转换为html。    



# poweredsites/handlers/chat.py

使用了Mixin来重用代码，十分优雅呀。

使用了asynchronous Decoractor，来使用异步。



# poweredsites/handlers/front.py

FrontIndexHandler作为一个父类，定义了一系列的私有变量，提供给子类复用和重写。



# poweredsites/handlers/project.py

公共sql变量保存在父类的_sql*变量内，提供给子类复用。

使用escape.json_encode将数据库查询返回的内容转换为json格式然后输出到页面内。

SubmitProjectHandler里的get方法使用异步的方式，如果get请求里带有url参数，那么发起一个AsyncHTTPClient去请求那个url，然后将url目标html使用BeautifulSoup来进行解析。然后渲染submit页面。

提交的时候使用PorjectForm来包装提交数据。



# poweredsites/handlers/user.py

LoginHandler里获取next变量，然后根据next来做出不同的url跳转。



# poweredsites/forms/base.py

使用formencode模块进行表单验证



# poweredsites/lib/decorators.py

使用@functools.wraps(method)来包装decoractor。



# poweredsites/lib/handler.py

这里定义了基础的BaseHandler。

BaseHandler的__init__函数里如果为第一次运行，那么会执行_after_prefork函数，这个函数会连接mysql和mongodb，然后将db变量和mysql连接关联起来，所以handler子类里到处都是self.db.get也就是直接调用db模块的conn。

执行prepare函数的时候会调用_prepare_context函数，这个函数会初始化之前说的_context对象。_context对象实际是个dict，当获取不存在的key的时候不报错而返回空字符串，并且在_prepare_context函数里设置上默认的base.js/base.css/title等。

get_error_html函数重写报错页面，如果是debug模式那么跳到404_debug.html否则跳到404.html。



# poweredsites/lib/const.py

常量定义都放在这个文件里，里面定义不同的class，然后定义class里不同的类变量。



# poweredsites/lib/cache.py

cache这个decoractor用于根据条件来进行缓存，有缓存的话直接从缓存里获取，否则调用原函数，然后将返回结果缓存起来。

page这个decoractor用于缓存整个返回，包括header以及html，传入self，从self里获取_status_code/_headers/_write_buffer。



# templates/base.html

title、description等都是直接从handler里的context对象里获取。

这里有个样式设置

    <style type='text/css'>
        {% include background.css %}
    </style>

从将background.css文件的内容直接引入到这里，为嘛呢？可以看看background.css里，里面都是带有background image的样式，里面也使用了static_url函数来为图片引入加入hash，这样当后续这些图片变更的时候会自动更新。将这些样式以这种方式引入也可以避免整个css文件更新。而且维护的时候也是维护文件，挺方便的，而实际上多一个style并不会有太大的影响。不过觉得采用另外一个文件引入也可以的，除非图片经常变化，否则感觉这种做法其实没有太大的意义。

样式渲染的时候使用context.options.combined_media来判断是否使用合并的css。否则每个样式分别输出。

header、footer等html直接采用{% include header.html %}来引入，将文件更解耦。



# model/favorite.py

这些类似Java的Dao类都继承lib.query里的Query对象，这个对象封装了数据库操作的接口。

可以看到这里对数据库的查询都是经过了封装而提供出来更友好的接口了。

     def cancel_exist_favorite_by_id(self, favorite_id):
        where = "id = %s" %  favorite_id
        return self.where(where).delete()

不过呢，这样的方式其实个人不见得喜欢。的确自己写的时候比较清晰。所谓的更OO，但是直接delete Sql有啥大区别吗？当然咯，所谓的很多ORM最后也不过是拼装Sql，为的就是解放开发者，但是对于这些简单的数据库操作，其实这样感觉有点过度了，不过也有好处，要是有公共的处理，这样的方式比较好加。

     def get_plane_by_plane_id(self):
        where = ""
        planes = self.get_all_planes()
        for plane in planes:
            where = "plane_id = %s" % plane["id"]
            plane["nodes"] = self.table("node").where(where).select()
        return planes

上述的代码，首先查询出所有的planes，然后从所有planes里取出id来查询nodes，这样一次查询了好多次数据库，也就是ORM总是没有实际的sql灵活就是了。


# 模板

F2E.im是使用jinja2来作为模板的，并没有使用tornado的默认模板。

随便看了几眼jinja2的模板，感觉和tornado的有点类似，不过语法稍微有点不一样。

回想JSP、Tapestry、Mustache、Tempo、Freemarker这些用过的模板，还是喜欢简洁轻量的。像Tornado这样就挺简单清晰，不过很不喜欢UIModule，看到后就没想用的想法。
