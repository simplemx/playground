# Structuring Your Project



### poorly signs of structured project

* 在furn.py里的Table类引用了workers.py里的Carpenter类，但Carpenter类有又需要import Table类来完成。import引用是环形关系。

* Table类每次改动都会造成无关单元测试失败。

* 过度使用全局状态

* Spaghetti code，过多的嵌套if/for循环并且很多复制黏贴代码。

* Ravioli code，数百行相似短小的逻辑。



### Modules

keep module names short, lowercase, and be sure to avoid using special symbols like the dot (.) or question mark (?).

The underscore(_) should not be seen often in module names.

###### import statement

import modu 语句会首先从当前文件夹下寻找modu.py作为caller，如果没有，Python解析器会从Path去递归寻找modu.py，如果查找不到，那么将会raise ImportError。

一旦找到modu.py,Python解析器将会执行这个模块所有语句，函数以及类定义存储在这个模块下。这样就可以通过这个模块的名字来访问这个模块的变量、函数和类了。

还可以使用from modu import *和import *，这些都是bad pratice，代码更难度而且依赖不容易看清。

使用from modu import func是将代码引入全局命名空间的一种方式，比import module唯一好处是可以减少打字。

Very bad

    from modu import *
    x = sqrt(4)  # Is sqrt part of modu? A builtin? Defined above?

Better

    from modu import sqrt
    x = sqrt(4)  # sqrt may be part of modu, if not redefined in between

Best
    
    import modu
    x = modu.sqrt(4)  # sqrt is visibly part of modu's namespace

可读性是Python的重要特征，避免无用的表达以及多余很重要，但是在这里，立即就可以看出这个func来自哪个类哪个module更重要，Python的宗旨是explicit is better than implicit。声明来自哪里比起简单的省去哪个class哪个module更重要。



### Packages

任何带有__init__.py文件的文件夹都会被认为是Python Package。

import pack.module将会import文件夹pack下的module模块。这个语句会首先执行pack下的__init__.py，执行所有的语句，然后再执行pack下的module.py。

__init__.py里逻辑太多是一个bad pratice。让这个文件是空的比较好。

使用import pack.module as module可以方便的减少编写pack路径代码。



### Object-oriented programming

Python内所有事物都是对象，Functions、Classes、Types都是对象，Functions是first-class objects。从这个层面来说Python是很Object-oriented的。

但是Python并不是将Object-oriented来作为主要的编程范式，Python项目更倾向于使用少量或者非Object-oriented，比如很少的类关系等。

而且利用module和package，已经可以取得一定的封装和抽象能力，这些都是使用Object-oriented的主要原因。所以业务流程不需要Object-oriented的时候尽量少使用。

使用Object-oriented会引入一定的代价，就是状态。也就是为什么认为Functional programming比Object-oriented programming要更优秀的原因，有状态更容易引发锁等问题。

在使用函数和过程式代码的时候注意尽量减少副作用(side effect)。避免side effect的好处有：

* 相同的输入必定是相同的输出

* 更方便重构优化

* 更方便进行单元测试

* 更容易维护

总之，使用没有副作用的Pure function比起classes和objects在某些架构上是一个更有效的设计。

当然，Object-oriented在很多场合也http://ww4.sinaimg.cn/large/a7cb85c1jw1ebvqr98nlwg208f05yx6p.gif很适用，比如GUI程序，游戏等。这些程序里的对象都是有一个比较长的生命周期的。



### Decorators

A decorator is a function or a class that wraps (or decorates) a function or a method.

    def foo():
        pass
    
    def decoractor(func):
        # do something
        return func

    foo = decoractor(foo) # 人工decoractor

    @decoractor
    def bar():
        # 自动加上decoractor
        pass

这种方式和AOP一样，可以将非业务逻辑分开。比如缓存等就很适合使用这种方式。



### Dynamic typing

Python是动态类型的，变量没有固定的类型。变量只是指向对象的引用。

由于动态类型的特性，变量可以被设置为不同类型的对象，所以对于debug等很不利。

如何避免这样的问题呢？

* 避免使用相同的变量来指向不同的对象。

Bad

    a = 1
    a = "string"

Good

    count = 1
    msg = "string"

相关的对象，如果类型不同，最好也使用不同的变量来定义。

使用相同变量并没有带来多大的性能提高，赋值的时候都会new新对象（但是引用会减少啊，不过现在的计算机里引用增多事实上并没有什么问题），当嵌套过多，很难去判断一个变量的类型。

一些编码实践，比如函数式编程，推荐不要重新赋值给一个对象，Java里就是使用final关键字。Python没有这样的语法，总之，避免重新赋值比较妥当。



### Mutable/Immutable types

List和dict都是Mutable对象。这些对象提供了方法修改这个对象。

Immutable对象没有提供方法修改状态。例如x=6，x = x+1之后x是一个新的对象，并不是原来6的对象。

Mutable对象不可以用来作为dict的key。因为它是可变的。

Python的字符串是不可变对象。这意味着，拼接字符串的方式比起使用join来拼接list里的子字符串更低效，因为拼接的时候会产生中间字符串对象。

Bad

    nums = ""
    for n in range(20):
        nums += str(n)
    print nums

Good

    nums = []
    for n in range(20):
        nums.append(str(n))
    print "".join(nums)

Best

    nums = [str(n) for n in range(20)]
    print "".join(nums)

但是join并不是总是推荐的，如果是从已经定义的字符串里构造新字符串，那么使用+将会比join更高效，因为没有构造新的对象的。

    foo = 'foo'
    bar = 'bar'
    foobar = foo + bar #better than "".join([foo, bar])
    fooooo = "".join([foo, 'ooo']) # better than foo + 'ooo'

另外还可以使用format方式来代替上述的构造字符串。

    foo = "foo"
    bar = "bar"
    foobar = '%s%s' % (foo, bar) # it's ok
    foobar = '{0}{1}'.format(foo, bar) # it's better
    foobar = '{foo}{bar}'.format(foo = foo, bar = bar) # it's best




