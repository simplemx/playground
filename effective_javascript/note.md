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



# Beware of Implicit Coercions

JS不同类型之间会发生强制转换，比如允许boolean参与运算。

     3 + true;//4

但尝试调用不是function对象和获取null的属性就会抛错。

而在其他场合,JS尽量将类型转换为适合的类型来满足运算。而且+号操作符还可以运行数学运算和字符串运算。

当数字和字符串相加，JS默认会将数字转换为字符串。

     1 + 2 + "3";//"33"
     (1 + 2) + "3";//"33"

|操作符不仅会将数字转换为2进制位，对于字符串可以转换为数字的也会相同地转换为二进制位来计算，这个方式对于~/&/^/|/<</>>/>>>这些操作符全都适用。

     "17" * 3;//51
     "8" | "1";//9

但是，null变量参与数学运算的时候，会被转换为0来计算，这个很容易造成不易察觉的错误。同理，undefined变量会转换为NaN。这些类型转换很容易引起不易察觉的错误。更恶劣的是，检查NaN也不能使用===来判断。

     var x = NaN;
     x === NaN;//false
     isNaN(x);//true

要使用isNaN才可以。但是，isNaN对其他类型的对象也适用。

     isNaN({});//true
     isNaN("");//true
     isNaN(undefined);//true

不过，如何判断NaN却可以用一个简单的方式来判断，因为NaN是唯一的不等于自己的值，所以可以简单的使用:

     var a = NaN;
     a !== NaN;//true it's NaN

对象参与字符串拼接运算的时候会调用toString函数。而对象的值可以通过valueOf函数来获得，所以可以通过重写这两个函数来获得想要的效果。

     "J" + {toString : function(){return "S";}};//"JS"
     2 * {valueOf : function(){return 3;}};//6

但值得注意的是，当对象参与+运算的时候，由于+既可以表达数学+也可以表达字符串拼接，当对象既有toString又有valueOf的时候，怎么判断呢，对象都可以转换为数字和字符串，这种时候，JS默认选择valueOf，这又引起了一些出人意料的现象。

     var obj = {toString : function(){return "a";},
               valueOf : function(){return 2;}};
     "object" + obj;//"object2"

所以，只有当对象会被作为数学运算的时候，才应该重写valueOf函数。并且这些对象的valueOf和toString函数都是返回相同的数字，这样才能保持行为的一致，其他情况下减少valueOf函数的使用。

if/||/&&操作符都可以执行boolean值，但接受所有的值，非boolean值都会转换为boolean值。

除了字符串和数字外所有对象都会当成为true，false值的对象有false,0, -0, "", NaN, null, undefined。

比如检查undefined值。

     if (!a) {
          a = 2;
     }

当a为0的时候，a也会被设置为2。更加的检查undefined值为使用typeof或者undefined对象

     typeof a === "undefined"
     a === undefined

# +号既可以代表数学加法也可以代表字符串拼接

# object可以通过valueOf来定义数字值，通过toString来定义字符串值

# Objects with valueOf methods should implement a toString method that provides a string representation of the number produced by valueOf.

# 使用typeof来检查undefined
