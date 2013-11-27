# video

支持ogg、mpeg4、webm三种格式。

    <video width="320" height="240" src="movie.ogg" contorls="controls">Your browser does not support the video tag</video>

video标签允许多个source元素，source可以为连接不同的视频文件，浏览器将使用第一个可识别的格式。

    <video width = "210" height="240" controls = "controls">
        <source src="movie.ogg" type="video/ogg"></source>
        <source src="movie.mp4" type="video/mp4"></source>
    </video>

#### 其他属性：

autoplay : 如果出现该属性，那么视频准备就绪后马上播放。

controls : 向用户显示组件，如播放按钮等。

loop : 媒体播放完毕后再次播放。

preload : 视频在页面加载时候进行加载，并且预备播放，如果使用autoplay，则忽视这个属性。

#### DOM

获取到video的DOM后可以调用下列的函数，play/pause等，可以通过JS去控制视频，还可以获取其他属性。



# audio

音频标签。支持ogg/mp3/wav格式。

和video一样，使用controls属性可以加入控制板，audio标签间插入的内容提供给不支持的浏览器展示。

和video一样，也是使用多个source，同样浏览器将会使用第一个适配的格式。

#### 属性

autoplay : 自动播放

controls : 控制板

loop : 是否循环

preload : 在页面加载时则进行加载



# 拖放

html5内，任何元素都可以拖放。

首先，为了使元素可拖动，把 draggable 属性设置为 true ：

    <img draggable="true" />

然后监听移动元素的dragstart事件，这个事件监听拖动开始的时候需要做的操作，一般可以设置event.dataTransfer.setData函数，设置被拖元素的数据类型和值。

然后为接受移动元素加上dragover和drop事件，dragover事件规定了在何处放置被拖动的元素，如果允许放置，需要调用event.preventDefault函数。

drop事件用于设置将被拖动元素放置到该元素中。



# SVG

SVG是Scalable Vector Graphics。用于定义网络的基于Vector的图形。使用XML格式，在放大或者改变尺寸的情况下不会失真。

例如:

    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="190">
        <polygon points="100,10 40,180 190,60 10,60 160,180"
        style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;" />
    </svg>

SVG可以直接将svg元素插入html内。



# SVG VS Canvas

SVG基于XML，可以为某个元素增加事件监听器。如果SVG对象的属性发生比那话，那么浏览器自动重现图形。

Canvas是逐像素进行渲染的，一旦完成绘制，那么不会继续得到浏览器的关注，如果其位置发生变化，整个场景需要重新绘制。



# LocalStorage/SessionStorage

传统Web是使用cookie完成浏览器存储数据的，cookie通过每个对服务器的请求来传递的。

在HTML5中，数据不是每个服务器请求传递的，而是只有在请求时使用数据。网站只能访问自身的数据，不能访问其他网站存储的数据。

#### LocalStorage

存储的数据没有时间限制。并且存储的是字符串。访问例子

    <script type="text/javascript">
        localStorage.name="smith";
    </script>

#### SessionStorage

只针对一个session进行数据存储，当用户关闭窗口后，数据会被清除。

    <script type="text/javascript">
        sessionStorate.name="smith";
    </script>



# Application cache

使用application cache可以有以下几个优势：

* 用户可以在应用离线时候使用它们
* 已缓存的资源加载更快
* 减少服务器负载，浏览器只会从服务器下载更新过或者更改过的资源

启用缓存的时候，需要在html标签内包含manifest属性。例如

    <html manifest="demo.appcache"></html>

manifest文件的扩展名为appcache,指定了manifest的页面用户访问的时候都会被缓存，如果没指定manifest属性，则页面不会被缓存。manifest文件的MIME-TYPE为text/cache-manifest，服务器上注意不要屏蔽了。

#### manifest文件

文本文件，告知浏览器被缓存的内容，分为三部分

* CACHE MANIFEST 这部分列出的文件将在首次下载后缓存
* NETWORK 此标题下的文件需要与服务器连接，而且不会被缓存
* FALLBACK 此标题下列出的文件规定当前页面无法正常访问时候的回退页面

第一行必须是CACHE MANIFEST,例子：

    CACHE MANIFEST
    /main.css
    /logo.gif
    /main.js

只要浏览器下载了这些文件，就算用户脱网了，还可以使用这些资源。

    NETWORK:
    login.asp

规定login.asp不会被缓存，离线时不可用。

    FALLBACK:
    /html5/ /404.html

规定了当物联网的时候，html5目录内所有文件都被404.html代替。

当用户清空浏览器缓存、manifest文件被修改、程序更新应用缓存的时候，缓存将会发生变化。

如果使用了manifest，那么就算图片、js变更了，浏览器都不会重新读取新的文件，只有变更manifest文件等，才能触发浏览器重新下载缓存文件。比较简单的方法是修改manifest文件内的注释。

个别浏览器缓存限制很小，5MB左右。



# Web Worker

可以理解为后台线程，独立于浏览器执行JS单线程外的后台线程。

首先创建一个js文件，然后创建Web Worker，创建的时候传入js文件，那么会创建一个后台线程执行这个js文件。而js文件和浏览器的通信是使用postMessage函数。而Web Worker可以监听onmessage事件，这样可以获取到worker里的小心，然后做个性化处理。

终止可以调用Web Worker的terminate函数。

Web Worker是外部对象，不能访问window，不能访问document，不能访问parent对象。

onmessage可以传递任何对象。


