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



# Understand Javascript's Floating-Point Number

JS里所有的数字都是number类型，并且都是双精度的浮点数。

这里有一个奇怪的地方，当使用|操作符的时候。

     8 | 1;//9

why？因为JS在这里将他们当成32位的二进制数来计算了。所以1000|1=1001也就是9了。

     (8).toString(2);//1000

JS里的|操作都是按这种方式来运算的，首先将float按位计算，然后再转换回float。

而且由于大精度Float运算很不准确，例如

     0.1 + 0.2;//0.30000000000000004
     (0.1 + 0.2) + 0.3;//0.60000000000000001
     0.1 + (0.2 + 0.3);//0.6

所以需要牢记

# JS里的number是双精度浮点

# JS里整形也是浮点类型，不过是个子集而已

# |会将数字转换为位计算再转换回数字

# 尽量不要使用浮点计算，最好使用integer

