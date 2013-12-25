# 边框

可以创建圆角边框，增加阴影，使用图片来绘制边框等。

### 圆角边框

border-radius属性可以用于设置圆角。

    div{
        border-radius : 25px;
        -moz-border-radius : 25px;/*old firefox*/
    }

### 阴影

box-shadow属性用于设置阴影。

    div{
        box-shadow : 10px 10px 5px #888888;
    }

其中3个参数，第一个参数是阴影的左移值，第二个参数是阴影的下移值，第三个阴影用于描述阴影的发散值，值越大阴影越模糊，值为0的时候阴影和矩形一样。

### border-image

用于创建边框

    div {
        border-image : url(border.png) 30 30 round;
    }

border-image是一个简写属性，用于设置以下的属性：
border-image-source:路径
border-image-slice:边框箱内偏移
border-image-width:边框宽度
border-image-outset:边框图像超出边框边框的量
border-image-repeat:是否应该平铺，铺满，或者拉伸



# 背景

### background-size

规定背景图片的尺寸，在CSS3之前，背景图片的尺寸是由图片的实际尺寸决定的，在CSS3之中，可以规定背景图片的尺寸，这允许我们在不同环境中使用相同的背景图片。

### background-origin

规定背景图片的定位区域，背景图片可以设置于content-box/padding-box/border-box。

### background-image

允许为同一个元素设置多个背景图像了。



# 文本效果

### text-shadow

为文本增加阴影。

    h1 { text-shadow : 5px 5px 4px #FF0000;}

### 自动换行

word-wrap允许文本强制换行，单词会被拆分。



# 字体

使用CSS3，那么可以将字体文件存储在web服务器上，这样可以让用户下载对应的字体，而不是之前那样只能使用用户计算机上安装的字体。

必须首先定义字体的名称，然后指向该字体文件。

    @font-face
    {
    font-family : myfont;
    src : url('sansation_Light.ttf'),
          url('sansation_Light.eot');
    }
    div {font-family : myfont;}

使用粗体文本的时候可以添加另外一个@font-face，这样可以为相同的字体设置许多的@font-face规则来使用。



# 3d transform

可以使用rotateX/rotateY来让元素围绕X、Y轴来围绕。

# 多列

通过CSS3，可以创建多个列来对文本进行布局。

column-count规定元素被分隔的列数。

把div元素的文本分隔成三列:

    div{
        -moz-column-count : 3;
        -webkit-column-count : 3;
        column-count : 3;
    }


column-gap 规定列之间的间隔。column-rule规定列之间宽度和颜色规则。


