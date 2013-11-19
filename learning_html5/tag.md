# video

支持ogg、mpeg4、webm三种格式。

><video width="320" height="240" src="movie.ogg" contorls="controls">Your browser does not support the video tag</video>

video标签允许多个source元素，source可以为连接不同的视频文件，浏览器将使用第一个可识别的格式。

><video width = "210" height="240" controls = "controls">
>    <source src="movie.ogg" type="video/ogg"></source>
>    <source src="movie.mp4" type="video/mp4"></source>
></video>

## 其他属性：

autoplay : 如果出现该属性，那么视频准备就绪后马上播放。

controls : 向用户显示组件，如播放按钮等。

loop : 媒体播放完毕后再次播放。

preload : 视频在页面加载时候进行加载，并且预备播放，如果使用autoplay，则忽视这个属性。





