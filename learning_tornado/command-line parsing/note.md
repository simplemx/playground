允许用户定义自己的options。定义完成后将会加入到global的option内。

    from tornado.options import defind, options
    define("mysql_host", default= "localhost:3306", help = "Main user DB")
    define("memcache_hosts", default = "localhost:11011", multiple = True, help = "*")
    
    db = database.Connection(options.mysql_host)

只要模块引入了，那么自动将会将这些个性化参数进行定义，可以在main函数里调用parse_command_line或者parse_config_file来获取配置参数。


