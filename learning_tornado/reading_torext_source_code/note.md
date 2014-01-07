# example source code

### torext_helloworld

由这个例子可以清晰的看到torext的特色

     app = TorextApp()

     @app.route('/')
     class HomeHandler(BaseHandler):
          def get(self):
               self.write("hello world")

     if __name__ == "__main__":
          app.command_line_config()
          app.run()

封装成Flask风格的route，可以说是Flask/Tornado合二为一的框架，并且封装了很多app等，不用编写Application等，那些代码的确比较冗余，当然，如果从一个框架触发，那些代码编写后基本是很少调整，冗余难看点也关系不大。



### torext_project

这个例子和helloworld例子不同，整个项目风格都是tornado风格，没有使用上面的decoractor来表明route，暂时还不确定是否多个文件的时候是使用这种方式。

首先settings.py里是整个project的公共参数，可以看出这里的参数和普通tornado项目很多不同。比如LOG_REQUEST/LOG_RESPONSE/LOGGIN等参数。

然后，它是使用下面这种方式

     app.route_many([('','views'),('/api','api.views')])

来定义路由的，并不是在handler上面加decoractor来完成的。而上面的views.py文件里代码和普通tornado里的handler代码类似。



# torext source code

### app.py

感觉整个torext的核心代码基本都在这个文件里了。

首先定义了TorextApp对象，这个对象用于Torext工程里，类似Application的角色，其实是它自己封装了Application对象的构造等。这个对象可以传入多个settings，而必须要有一个settings的module传入，这个感觉有点奇怪，想不懂为嘛这样设计。另外还可以传入application_options,ioloop,httpserver_options等参数用于构造httpserver、application、ioloop等。

Torext.route就是上述@app.route的decoractor，这里可以看出这个decoractor没什么事情做，就是将这个class以及url放到host_handlers的成员变量里。

TorextApp里有host_handlers这个成员变量，是以host:handlers的键值对形式的dict。

而Torext.route_many,也就是上述的例子，和route类似，也是将传入的规则类名传入到host_handlers里。

这里和普通的tornado应用不同，由于Torext的handler要么是在通过decoractor的方式，要么是在代码里通过app.route_many的方式引入路由以及对应的handler的，handler也是使用字符串的形式来表明的。

而tornado应用更多是在各个子模块module里将那个模块的路由数组构造好，然后在Application对象构造钱将这些路由数组重新构造然后传入到Application对象里。

不过感觉route_many的方式有点不如原来tornado的方式。还是route decoractor的方式来得实在点。要是可以在子模块里编写decoractor就可以直接使用就好了。目前看来似乎torext不可以这样。



