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



