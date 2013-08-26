# UI MODULES

UI Module也就是界面上的组件，方便组件重用。

并且组件里可以包含css和js引入，方便之处是tornado会自动将这些js和css引入自动设置到相应的地方，css放在头部，js放在尾部。

其实还UI Module还可以直接通过模板来引入，在模板里调用set_resources函数。

>{{ set_resources(embedded_css=".entry { margin-bottom: 1em; }") }}

这个效果和在Entry内重写embedded_css是一样的。

然后在引入module的地方调用如下：

>{% module Template("module-entry.html", show_comments=True) %}

也就是可以通过传入模板路径名来构造UI Module的子类，减少编写代码。

set_resources函数只在调用Template的模板里才能调用，不能在其他非UI Module的模板内调用。而且Template的模板内只能访问全局template的命名空间和他们自己的变量，不能访问其他。
