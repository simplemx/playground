### know which javascript you are using

ECMAScript3是在1999年定版，而ECMAScript5是在2009年定版。

很多Javascript实现遵循不同的ECMAScript版本。

很多Jacascript enginer支持const关键字。当然，不同实现对const关键字的实现不同。有些engier指赋值后不能变更值。

     const p = 2
     p = 3
     console.log(p) //print 2

而有些enginer则将const关键字和var关键字等价处理。

所以在浏览器端不能指定Javascript实现的场合应该保持使用标准特性，像const这样的不同实现不同支持的特性应该放弃使用。

ECMAScript5引入了了strict mode的方式，在脚本开始的时候写入：

     "use strict"

即可。使用上述的方式在不支持strict mode的实现上是没有坏处的，因为实现会执行一个字符串而已，不过在不支持strict mode的实现上是不会有strict mode检查的，只有在支持的实现上才会有。

使用use strict的缺点是只有在脚本开始或者函数开始的地方声明才生效，当如果有两个文件，一个使用strict mode而另外一个不使用，那么合并文件的时候就会有很纠结的事情发生了。

所以整个工程应该要么都遵循strict mode要么都不遵循。尽量使用strict mode。如果真的有必要，合并为两个文件，一个是strict mode，而另外一个文件不是。

