新的form属性：autocomplete/novalidate

# autocomplete

autocomplete在IE8以上以及其他浏览器都支持。

该属性规定form或者input拥有自动完成功能。适用于form以及form下的input。

    <form action=""><input type="text" autocomplete="on" /></form>



# autofocus

当设置了autofocus属性后，input将会自动获得焦点。

    <input type="text" autofocus="autofocus" />



# form

规定了input所属的表单。只有opera支持。

    <form action="demo_form.asp" method="get" id="user_form">
        First name:<input type="text" name="fname" />
        <input type="submit" />
    </form>
    Last name: <input type="text" name="lname" form="user_form" />



# height/width

可以用于image类型的input的图像高度和宽度。

    <input type="image" width="99" height="99" />
    


# multiple

规定输入域可以多选。目前只使用与email和file。

    <input type="file" name="img" multiple="multiple" />



# novalidate

规定提交表单的时候不检查form以及input。

    <form action="" novalidate="true">
        <input type="email" />
        <input type="submit" />
    </form>



# pattern

用于校验input的属于，为正则表达式。目前只有chrome以及safari支持。

    <input type="text" pattern="[A-z]{3}" />



# placeholder

提供输入域期待的值。

    <input type="text" placeholder="your text" />
    
    

# required

规定提交表单必须输入。

    <input type="text" required="required" />
    
