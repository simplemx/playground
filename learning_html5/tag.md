# video

支持ogg、mpeg4、webm三种格式。

    <video width="320" height="240" src="movie.ogg" contorls="controls">Your browser does not support the video tag</video>

video标签允许多个source元素，source可以为连接不同的视频文件，浏览器将使用第一个可识别的格式。

    <video width = "210" height="240" controls = "controls">
        <source src="movie.ogg" type="video/ogg"></source>
        <source src="movie.mp4" type="video/mp4"></source>
    </video>

## 其他属性：

autoplay : 如果出现该属性，那么视频准备就绪后马上播放。

controls : 向用户显示组件，如播放按钮等。

loop : 媒体播放完毕后再次播放。

preload : 视频在页面加载时候进行加载，并且预备播放，如果使用autoplay，则忽视这个属性。

## DOM

获取到video的DOM后可以调用下列的函数，play/pause等，可以通过JS去控制视频，还可以获取其他属性。



# audio

音频标签。支持ogg/mp3/wav格式。

和video一样，使用controls属性可以加入控制板，audio标签间插入的内容提供给不支持的浏览器展示。

和video一样，也是使用多个source，同样浏览器将会使用第一个适配的格式。

## 属性

autoplay : 自动播放

controls : 控制板

loop : 是否循环

preload : 在页面加载时则进行加载



# 拖放

html5内，任何元素都可以拖放。

首先，为了使元素可拖动，把 draggable 属性设置为 true ：

    <img draggable="true" />


