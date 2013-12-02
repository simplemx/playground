# viewport meta

Boostrap是移动设备优先的，需要在head之中添加viewport meta标签。

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

在meta内加上user-scalable=no 可以设置用户不能自动缩放，视实际情况而定。



# responsive img

通过给图片增加class为img-responsive可以给图片的响应式布局支持更好，其实质是为图片赋予了max-width: 100%; 和height: auto;属性，可以让图片按比例缩放，不超过其父元素的尺寸。

    <img src="..." class="img-responsive" alt="Responsive image">



# normalize

使用了normalize来增强浏览器表现一致性。



# containers

用.container即可让包括的内容实现居中对齐。基本都使用了max-width来进行了设置

    <div class="container">
    ...
    </div>



# Grid System

通过一系列的rows和columns来对页面进行布局。

* rows必须在.container以内
* 使用rows创建水平方向上的columns组
* 内容必须放在columns内，只有columns是rows的直接下属节点
