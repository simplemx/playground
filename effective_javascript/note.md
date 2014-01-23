# know which javascript you are using

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

+ JS里的number是双精度浮点

+ JS里整形也是浮点类型，不过是个子集而已

+ |会将数字转换为位计算再转换回数字

+ 尽量不要使用浮点计算，最好使用integer




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

+ +号既可以代表数学加法也可以代表字符串拼接

+ object可以通过valueOf来定义数字值，通过toString来定义字符串值

+ Objects with valueOf methods should implement a toString method that provides a string representation of the number produced by valueOf.

+ 使用typeof来检查undefined



# Prefer Primitives to Object Wrappers

JS有5种primitive value，分别是boolean/number/string/null/undefined。并且标准实现里为boolean/string/number提供了构造方法来进行包装。

     var s = new String("hello world")

But unlike primitive strings, a String object is a true object

     typeof "hello";//"string"
     typeof s;//"object"

     var s1 = new String("t");
     var s2 = new String("t");
     s1 === s2 ;//false

由于new之后的是一个全新的object，所以无论是==还是===都是不会相等的。

primitive Object的最大作用是使用它们的工具函数，这些函数不但可以在primitive Object上使用，JS默认会对他们进行处理，就算在primitive values也可以使用。

     "hello".toUpperCase();//"HELLO"

在primitive values上调用上述这样的隐式转换时候，当设置属性的时候，primitive values是不会被影响的。上述的隐式转换会默认生成新的字符串对象，所以对之前的primitive value是没有影响的。在程序里如果不小心使用primitive values来修改变量，那么程序会继续执行，但错误不容易被发觉。

+ Object wrappers for primitive types do not have the same behavior as their primitive values when compared for equality
--primitive values和它们的包装对象进行比较的时候是不同的，包装对象是全新的对象

+ Getting and setting properties on primitives implicitly creates object wrappers
--在primitive values上赋值和获取属性都会隐式构造新的对象wrapper



# Avoid using == with Mixed Types

     "1.0e0" == { valueOf: function() { return true; } };

上述的两个无相关对象，在JS里都会被应为是相等的，这两个对象都会转换为number对象，然后再进行比较，字符串转换为1，而valueOf为true的对象也是转换为1，所以是==的。

这里可以通过明确转换为number，可以使用+号。

     if (form.month.value == today.getMonth() + 1){}//需要开发人员理解怎么转换
     if (+ form.month.value == today.getMonth() + 1){}//明确转换为number

这样可以更加清晰的让代码容易理解。同理，还可以使用===

     if (+ form.month.value === today.getMonth() + 1) {}//使用===

当比较的对象类型相同的时候，使用==和使用===是一样的，但使用===让阅读者理解这里比较是没有使用类型转换的，这样让JS代码更清晰和减少陷阱。

+ ==操作符针对不同类型对象的比较的时候规则比较复杂混乱

+ 使用===操作符可以让比较操作更加清晰也更容易debug。

+ 使用自己的转换函数来为不同类型的对象转换为相同类型进行比较操作




# Minimize Use of the Global Object

+ 避免声明全局变量

+ 尽量使用局部变量

+ 减少为global object上设置属性的可能

+ 使用global object来进行平台支持与否的判断



# Always declare local Variables

+ Always declare new local variables with var

+ Consider using lint tools to help check for unbound variables



# Understand Variable Hoisting

Hosting是指在JS里变量的定义是会将定义hosting在最近的变量范围的开头，然后赋值会仍然放在那里。

不过值得注意的是try catch语句里的catch范围里是另外一个block。

     for (var i = 0, n = header.length; i < n; i++){...}

is equal to:

     var i, n;
     for (i = 0, n = header.length; i < n; i++){...}

+ Variable declarations within a block are implicitly hoisted to the top of their enclosing function
--在block范围内的变量声明隐式的会被host在函数范围内的最顶部

+ Redeclarations of a variable are treated as a single variable
--重复声明的变量会被当做声明一个变量

+ Consider manually hoisting local variable declarations to avoid confusion
--建议手工host局部变量声明来避免混淆



# Use Immediately Invoked Function Expressions to Create Local Scopes

Closures store their outer variables by reference, not by value.闭包保存变量的引用，并不是保存他们的值。So:

     function wrapElements(a) {
          var result = [], i, n
          for (i = 0, n = a.length; i < n; i++){
               result[i] = function(){return a[i]}
          }
     }
     var wrapped = wrapElements([1,2,3,4,5])
     var f = wrapped[0]
     f();//undefined, not 1,not 5

上述需要注意的是所有匿名函数引用的i的闭包最后是变为a.length了，不是a.length-1，所以是undefined。并不是5。

解决方案是建立一个内部作用域。

     function wrapElements(a) {
          var result = []
          for (var i = 0, n = a.length; i < n; i++){
               (function(){
                    var j = i
                    result[j] = function(){return a[j]}
               })()
          }
     }

这就是IFFE(immediately invoked function expression)，当然，也可以通过匿名函数传入参数的方式来达到目的。

+ Understand the difference between binding and assignment--理解闭包绑定和赋值的区别

+ Closures capture their outer variables by reference, not by value--闭包保留变量的引用，并不是值

+ Use immediately invoked function expressions (IIFEs) to create local scopes--使用IIFE来创建局部变量作用域

+ Be aware of the cases where wrapping a block in an IIFE can change its behavior--了解使用IIFE后this等情况和没有IIFE后的不同



# Beware of Unportable Scoping of Named Function Expressions

function declaration

     function double(x){return x * 2}

这个定义会在当前命名空间内定义一个函数，并且绑定到变量double上。

named function expression

     var f = function double(x) {return x * 2}
     var f = function(x){return x * 2}

上述的两个表达式会定义函数，然后绑定到f变量上。而named function expression里的函数名字只有在函数内部的范围内可以使用，离开函数外将不能访问。最大的用处就是递归的时候使用，但是就算是递归也可以使用外部绑定的变量f。

JS引擎会将named function expression里返回命名空间当做object一样处理，它会继承Object.prototype对象。

     var constructor = function(){return null}
     var f = function f(){return constructor()}
     f();//{}

上述的f函数并不是返回null，因为named function expression继承了Object.prototype.constructor，所以默认的调用是调用这个函数，并不是上述声明的函数。对Object.prototype的任何变更都会在named function里受到影响。

+ Use named function expressions to improve stack traces in Error objects and debuggers--使用named function expression来为debug和错误的堆栈信息做友好提示

+ Beware of pollution of function expression scope with Object.prototype in ES3 and buggy JavaScript environments--named function expression会在自己的命名范围内继承Object.prototype

+ Beware of hoisting and duplicate allocation of named function expressions in buggy JavaScript environments--使用named function expression会为hosting和多余命名分配过多空间

+ Consider avoiding named function expressions or removing them before shipping--避免使用named function expression

+ If you are shipping in properly implemented ES5 environments, you’ve got nothing to worry about--ES5环境里已经修改了这些bug，无需担心



# Beware of Unportable Scoping of Block-Local Function Declarations

在函数内部再声明函数，和声明变量类似，都会host在命名空间最顶，所以这里会有一定的困惑性。

     function f(){return 2}
     function test(x){
          var result = []
          if (x) {
               function f(){return 1}
               result.push(f())
          }
          result.push(f())
          return result
     }

上述的函数在不同的JS实现上会有出入，大多数会将在block范围内的f host在开头，但是也有实现是在执行block的时候才解析的。

更好的方法是减少使用局部block内的函数声明，尽量在外层声明，在内部引用即可。

+ Always keep function declarations at the outermost level of a program or a containing function to avoid unportable behavior--在程序最外层或者函数范围最顶层声明函数，避免在内部来声明函数

+ Use var declarations with conditional assignment instead of conditional function declarations--使用var来作为if block内的函数重新定义，而不是直接声明



# Avoid Creating Local Variables with eval

使用eval会将传入的参数执行一遍，而如果利用eval来创建变量等是一个很容易引发bug的做法。因为eval既可以创建局部变量也可以创建全局变量，一切都视传入的参数和上下文决定。

+ Avoid creating variables with eval that pollute the caller’s scope--不要使用eval来创建变量

+ If eval code might create global variables, wrap the call in a nested function to prevent scope pollution--如果一定要用eval来新建变量，那么可以使用让eval执行在包装函数内的方式来避免全局变量被污染



# Prefer Indirect eval to Direct eval The eval

大多数函数都只有能访问定义时候的scope的权利，但是eval函数除了这个之外，还能访问它在被调用的时候的scope。

eval的调用可以分为direct eval和indirect eval。

     eval(param)

这是direct eval。

     var f = eval;
     f(param)

这是indirect eval。区别是indirect eval会将参数在global scope内执行。并不是和direct eval一样是在local scope内执行。

一个更清晰的indirect eval写法是

     (0, eval)(param)

(0, eval)表达式首先执行0，然后执行eval，并且返回eval，并且将eval作为indirect eval来执行。

+ Wrap eval in a sequence expression with a useless literal to force the use of indirect eval--为eval包装在()表达式内来强调eval来使用indirect eval

+ Prefer indirect eval to direct eval whenever possible--尽量使用indirect eval



# Understand the Difference between Function, Method, and Constructor Calls

JS里无论是function/method/contructor都是使用function。

function就是普通函数，而method则使用this来获取绑定的对象，这个对象还有可能是全局对象，这样很容易出问题。

+ Method calls provide the object in which the method property is looked up as their receiver--调用method的时候会保证对象来作为接受者来调用

+ Function calls provide the global object (or undefined for strict functions) as their receiver. Calling methods with function call syntax is rarely useful--调用function的时候将全局对象作为接受者，而在strict mode里将会为undefined。将function来作为method来调用不会有什么作用。

+ Constructors are called with new and receive a fresh object as their receiver--contructor将会使用new关键字来调用，并且会创建一个全新的对象作为接受者来。



# Get Comfortable Using Higher-Order Functions

+ Higher-order functions are functions that take other functions as arguments or return functions as their result--higher order function是那些函数将其他函数作为参数或者返回结果的函数

+ Familiarize yourself with higher-order functions in existing libraries--熟悉lib里的higher-order 函数

+ Learn to detect common coding patterns that can be replaced by higher-order functions--将重复代码抽象出去作为higher-order 函数。



# Use call to Call Methods with a Custom Receiver

+ Use the call method to call a function with a custom receiver--使用call来调用function以及额外的function接受者

+ Use the call method for calling methods that may not exist on a given object--使用call函数来调用一个可能不存在的对象

+ Use the call method for defining higher-order functions that allow clients to provide a receiver for the callback--使用call函数来作为定义higher-order函数的定义个性化接受者的工具



# Use apply to Call Functions with Different Numbers of Arguments

+ Use the apply method to call variadic functions with a computed array of arguments

+ Use the first argument of apply to provide a receiver for variadic methods



# Use arguments to Create Variadic Functions

+ Use the implicit arguments object to implement variable-arity functions

+ Consider providing additional fixed-arity versions of the variadic functions you provide so that your consumers don’t need to use the apply method



# Never Modify the arguments Object

arguments看起来是一个array对象，但实际并不是。

     function callMethod(obj, method) {
          var shift = [].shift;
          shift.call(arguments);
          shift.call(arguments);
          return obj[method].apply(obj, arguments);
     }
     var obj = {add : function(x, y){return x + y}}
     callMethod(obj, "add", 17, 25);//error

上述的代码执行错误是因为函数的参数，只是一个引用arguments对象里某个index的别名，obj是arguments[0]的别名，method是arguments[1]的别名，尽管我们通过shift函数将arguments对象里的前两个remove掉了，但是obj仍然是arguments[0]的别名，所以，obj[method]就是执行17[25]

在ES5环境strict mode内，参数并不是arguments里某个index的别名，所以有下属的情况出现。

     function strict(x) {
          "use strict"
          arguments[0] = "modify"
          return x === arguments[0];//false
     }
     function nostrict(x) {
          arguments[0] = "modify"
          return x === arguments[0];//true
     }

所以不要改变arguments对象的值，另外可以使用[].slice来将arguments转变为真正的array。

     var args = [].slice.call(arguments)

+ Never modify the arguments object

+ Copy the arguments object to a real array using [].slice.call(arguments) before modifying it--如果需要改变arguments对象，那么使用[].slice.call来将arguments转变为真正的array再进行改变



# Use a Variable to Save a Reference to arguments

+ Be aware of the function nesting level when referring to arguments--在嵌套层次多的代码里要小心arguments对象实际使用的可能是嵌套函数里的

+ Bind an explicitly scoped reference to arguments in order to refer to it from nested functions--显式将arguments对象绑定到一个变量里来在嵌套函数里使用是更安全的做法



# Use bind to Extract Methods with a Fixed Receiver

+ Beware that extracting a method does not bind the method’s receiver to its object--使用变量引用method的方式来要小心此时method的使用并没有绑定原来的receiver

+ When passing an object’s method to a higher-order function, use an anonymous function to call the method on the appropriate receiver--当将method传入到higher-order函数里的时候，可以构造匿名函数来达到使用正确的receiver的方式

+ Use bind as a shorthand for creating a function bound to the appropriate receiver--还可以使用bind使用正确的receiver



# Use bind to Curry Functions

bind函数除了绑定receiver之外，传入的其他多个参数会作为返回参数的默认参数返回一个新的函数。

     var urls = paths.map(simpleURL.bind(null, "http", siteDomain));
     //equal to 
     var urls = paths.map(function(each){return simpleURL("http", siteDomain, each);});

+ Use bind to curry a function, that is, to create a delegating function with a fixed subset of the required arguments

+ Pass null or undefined as the receiver argument to curry a function that ignores its receiver



# Prefer Closures to Strings for Encapsulating Code

function很方便的可以存储变量以被后续使用，这样促成了higher-order functions。当然也可以让代码以string的方式传入到eval内。但是这个是个很容易出现问题的方式。

+ Never include local references in strings when sending them to APIs that execute them with eval--当将字符串传入eval的时候，不要在代码里定义局部变量

+ Prefer APIs that accept functions to call rather than strings to eval--使用function的方式来执行代码比使用string传入eval的方式更好



# Avoid Relying on the toString Method of Functions

function对象的toString方法可以返回该function的代码。但是在不同浏览器上有不同的实现，具体视实际浏览器实现而定，而且native代码页不会展示出来，闭包代码也不会被显示

+ JavaScript engines are not required to produce accurate reflections of function source code via toString--JS引擎不会保证一定会使用toString去反射function的源码

+ Never rely on precise details of function source, since different engines may produce different results from toString--不要依赖toString来获取准确的源代码

+ The results of toString do not expose the values of local variables stored in a closure--toString返回的代码没有显示闭包内的局部变量

+ In general, avoid using toString on functions--避免使用function的toString



# Avoid Nonstandard Stack Inspection Properties

+ Avoid the nonstandard arguments.caller and arguments.callee, because they are not reliably portable--避免使用不标准的arguments.caller和arguments.callee。它们是不利于移植的

+ Avoid the nonstandard caller property of functions, because it does not reliably contain complete information about the stack--避免使用不标准的获取当前运行时堆栈的函数



# Understand the Difference between prototype, getPrototypeOf, and __proto__

+ C.prototype determines the prototype of objects created by new C()--prototype决定了使用new构造的对象的prototype

+ Object.getPrototypeOf(obj) is the standard ES5 function for retrieving the prototype of an object--Object.getPrototypeOf是ES5标准的获取对象的prototype的方法

+ obj.__proto__ is a nonstandard mechanism for retrieving the prototype of an object--obj.__proto__不标准的获取对象prototype的方式

+ A class is a design pattern consisting of a constructor function and an associated prototype--JS里的class是constructor函数和prototype的融合

