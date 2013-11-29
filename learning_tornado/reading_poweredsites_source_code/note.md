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

    




