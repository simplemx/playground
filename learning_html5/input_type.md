HTML5加入了新的input类型。

# email

    <input type="email" name="email" />

在form里如果输入不合法提交表单的时候浏览器会自动弹出错误提示。

# url

    <input type="url" name="url" />
    
校验必须要有http开头的url。

# number

用于限制数字，可以设置限定范围。

    <input type="number" min="1" max="19" />
    
#### 属性

max:允许最大值

min:允许最小值

step:允许数字间隔

value:允许规定值

# range

用于包含一定范围内数字值的输入域。显示为滚动条。

    <input type="range" min="1" max="10" />
    
其他属性和number一样。

# datepicker

用于日期和时间的输入。输入类型包括有:date/month/week/time.datetime/datetime-local等。

    <input type="date" name="date" />
   
 
