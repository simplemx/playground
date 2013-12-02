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

<table>
  <thead>
    <tr>
      <th></th>
      <th>
        超小屏幕设备
        <small>手机 (&lt;768px)</small>
      </th>
      <th>
        小屏幕设备
        <small>平板 (≥768px)</small>
      </th>
      <th>
        中等屏幕设备
        <small>桌面 (≥992px)</small>
      </th>
      <th>
        大屏幕设备
        <small>桌面 (≥1200px)</small>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>栅格系统行为</th>
      <td>总是水平排列</td>
      <td colspan="3">开始是堆叠在一起的，超过这些阈值将变为水平排列</td>
    </tr>
    <tr>
      <th>最大<code>.container</code>宽度</th>
      <td>None (自动)</td>
      <td>750px</td>
      <td>970px</td>
      <td>1170px</td>
    </tr>
    <tr>
      <th>class前缀</th>
      <td><code>.col-xs-</code></td>
      <td><code>.col-sm-</code></td>
      <td><code>.col-md-</code></td>
      <td><code>.col-lg-</code></td>
    </tr>
    <tr>
      <th>列数</th>
      <td colspan="4">12</td>
    </tr>
    <tr>
      <th>最大列宽</th>
      <td class="text-muted">自动</td>
      <td>60px</td>
      <td>78px</td>
      <td>95px</td>
    </tr>
    <tr>
      <th>槽宽</th>
      <td colspan="4">30px (每列左右均有15px)</td>
    </tr>
    <tr>
      <th>可嵌套</th>
      <td colspan="4">Yes</td>
    </tr>
    <tr>
      <th>Offsets</th>
      <td colspan="1" class="text-muted">N/A</td>
      <td colspan="3">Yes</td>
    </tr>
    <tr>
      <th>列排序</th>
      <td class="text-muted">N/A</td>
      <td colspan="3">Yes</td>
    </tr>
  </tbody>
</table>

class在viewport大于或者等于阀值的设备上起作用，并且会将小viewport的class覆盖掉，所以如果有设置.col-mid-而没设置.col-lg-的时候在大设备上将会采用.col-mid-。

所有的col列数一共为12，如果超出则按照12来处理。使用col-md-*来设置，如果*为1那么代表宽度是一个grid，如果是3那么是3个grid，最大是12个grid。

#### 水平堆叠

使用.col-md-*来可以进行一系列的Grid进行堆叠。

#### mobile/desktop

想让Grid自动根据页面高宽来布局，可以使用.col-xs-*,.col-md-*来定义columns。

#### mobile/desktop/tablet

增加.col-sm-*来支持更多的页面

    <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-8">.col-xs-12 .col-sm-6 .col-md-8</div>
        <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
        <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
        <!-- Optional: clear the XS cols if their content doesn't match in height -->
        <div class="clearfix visible-xs"></div>
        <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
    </div>



# offseting columns

可以使用.col-md-offset-*来让grid往右移动多少个grid的偏移。



# push、pull

通过使用.col-md-push-* 和 .col-md-pull-*就可以很容易的改变列的顺序。



# 标题

h1到h6标签均可以使用，还提供了h1到h6的class。在标题内可以使用small标签或者.small，为的是标记副标题。



# body

默认的font-size为14px，line-height为1.428，body标签下所有p标签内都直接继承这些属性，另外p标签还被设置了10px的bottom-margin。

通过添加.lead可以让段落突出显示。

使用strong/.strong来进行加粗强调，使用small/.small来显示普通文本。使用em/.em来进行斜体显示。



# align

提供了.text-left/.text-center/.text-right来设置align的文本。



# 强调文本

还提供了一系列的强调classes，提供不同颜色来显示。分别有text-muted/text-primary/text-success/text-info/text-warning/text-danger。



# list

unordered/ordered list可以使用原生的html。

使用.list-unstyled的list将会去掉list-style。使用list-inline的list将会将list的display设置为inline-block。



# table

使用.table的时候为默认样式。使用.table-striped的时候给tbody内的tr增加条纹状花纹。使用.table-bordered为table增加边框。使用.table-hover来让tbody的每一行响应鼠标悬停状态。使用.table-condensed来让表格更加紧凑。

可以为tr增加这些class来添加不同的颜色:.active/.success/.warning/.danger

将.table放在.table-responsive内将会让table在小于768px的时候出现水平滚动条可以进行拖动。大于768px的时候自动消失。


 
# form

使用.form-control将会将input/text-area/select标签设置到width:100%。默认的，将label以及.form-control包含在.form-group里可以更佳的定位。

如果使用左对齐等，可以设置为.form-inline，那么排布得更紧凑。

为表单增加.form-horizontal，那么为label以及control进行grid布局。这样可以使.form-group的行为表现为和.row一样，并且无需加入.row。



# checkbox/radio

默认的checkbox以及radio标签样式都是堆叠在一起的，定义在.checkbox/.radio下面。使用.checkbox-inline/.radio-inline可以使这些控件列在一排。



# select

使用默认html即可，添加multiple可以显示多个选项。



# static text

如果需要将文本设置在label的同一行，可以为p元素加上.form-control-static。

    <div class="form-group">
        <label for="" control-label="" col-sm-2="">email</label>
        <div class="col-sm-10">
            <p form-control-static="">test</p>
        </div>
    </div>



# control status

使用#focusedInput来让controls获得焦点。



# validation status

定义了error、warning、success三种状态，使用的时候将.has-warning/.has-error/.has-success添加到这些控件的父元素即可。此元素内的.control-label/.form-control以及.help-block都将会变成校验状态的颜色。



# control size

可以通过设置.input-lg这样的样式来控制组件的高度大小。



# Buttons

使用.btn可以设置带样式的button。加入.btn-default/.btn-primary/.btn-success/.btn-info/.btn-warning/.btn-danger/.btn-link来显示不同样式。

还可以使用.btn-lg/.btn-sm/.btn-xs来设置不同尺寸的按钮。

还可以使用.btn-block来使其获得父节点100%宽度，而且按钮也变成为block级元素。

另外可以作为按钮使用的标签有a/button/input。



# img

可以为img标签增加.img-rounded/.img-circle/.img-thumbnail来获取不同带样式。



# tool classes

#### close

使用.close可以显示关闭按钮。

#### .carets

使用.caret可以显示下拉图标。

#### .clearfix

清除页面的任何浮动。

#### .show/.hidden



# Responsive tools

可以使用下属的classes来为不同的屏幕等显示隐藏内容。

<table class="table table-bordered table-striped responsive-utilities">
  <thead>
    <tr>
      <th></th>
      <th>
        超小屏幕
        <small>手机 (&lt;768px)</small>
      </th>
      <th>
        小屏幕
        <small>平板 (≥768px)</small>
      </th>
      <th>
        中等屏幕
        <small>桌面 (≥992px)</small>
      </th>
      <th>
        大屏幕
        <small>桌面 (≥1200px)</small>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>.visible-xs</code></th>
      <td class="is-visible">可见</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-hidden">隐藏</td>
    </tr>
    <tr>
      <th><code>.visible-sm</code></th>
      <td class="is-hidden">隐藏</td>
      <td class="is-visible">可见</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-hidden">隐藏</td>
    </tr>
    <tr>
      <th><code>.visible-md</code></th>
      <td class="is-hidden">隐藏</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-visible">可见</td>
      <td class="is-hidden">隐藏</td>
    </tr>
    <tr>
      <th><code>.visible-lg</code></th>
      <td class="is-hidden">隐藏</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-visible">可见</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th><code>.hidden-xs</code></th>
      <td class="is-hidden">隐藏</td>
      <td class="is-visible">可见</td>
      <td class="is-visible">可见</td>
      <td class="is-visible">可见</td>
    </tr>
    <tr>
      <th><code>.hidden-sm</code></th>
      <td class="is-visible">可见</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-visible">可见</td>
      <td class="is-visible">可见</td>
    </tr>
    <tr>
      <th><code>.hidden-md</code></th>
      <td class="is-visible">可见</td>
      <td class="is-visible">可见</td>
      <td class="is-hidden">隐藏</td>
      <td class="is-visible">可见</td>
    </tr>
    <tr>
      <th><code>.hidden-lg</code></th>
      <td class="is-visible">可见</td>
      <td class="is-visible">可见</td>
      <td class="is-visible">可见</td>
      <td class="is-hidden">隐藏</td>
    </tr>
  </tbody>
</table>

