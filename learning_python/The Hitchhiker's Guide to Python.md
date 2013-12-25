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




