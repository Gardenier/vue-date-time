###Install

`npm install vue-date-time`


###Use


######单独的日期组件

`import Datepicker from 'vue-date-time/src/datepicker.vue`
<br/>
`<Datepicker>  slot  </Datepicker>`
<br/>
*slot处为可设置内容，取代的默认的输入框部分*

######单独的时间组件

`import Timepicker from 'vue-date-time/src/timepicker.vue`
<br/>
`<Timepicker>  slot </Timepicker>`
<br/>
*slot处为可设置内容，取代的默认的输入框部分*

######带时间的日期组件

`import Datetimepicker from 'vue-date-time/src/datetimepicker.vue`
<br/>
`<Datetimepicker type='datetime'></Datetimepicker>`

###配置项


#####基本

| 配置项      |类型      | 默认值      | 可选项                                                         | 说明|
| :--------- | :-----: | :--------: | :-----------------------------------------------------------: | :---- |
|value       |String   |‘ ’         |-                                                              |需要设置默认日期时设置 |
|time        |String   |‘ ’         |-                                                              |需要设置默认时间时设置|
| format     | String  | yyyy/mm/dd | yyyy-mm-dd <br/> yyyy/mm/dd <br/> dd/mm/yyyy <br/> dd-mm-yyyy |日期格式|
| pastDue    |  Boolean| true       | true <br/> false                                              |设置过期日期 |
|isTimePast  |Boolean  | false      | true <br/> false                                              | 设置过期时间 <br/> *小于当前时间的选项不可选*|
|minLimitDate|  String | ' '        | -                                                             |最小日期|
|maxLimitDate| String  |‘ ’         | -                                                             |最大日期|
|isDateBtn   | Boolean | true       |    true <br/> false                                           |显示底部‘今天’‘清空’按钮|
|isTimeBtn   | Boolean |true        |    true <br/> false                                           | 显示底部‘清空’按钮|
|isTodayBtn  | Boolean | true       |    true <br/> false                                           | 显示'今天' 按钮|
|isCleatBtn  | Boolean | true       |    true <br/> false                                           | 显示 '清空' 按钮 |

#####日期时间组件的特殊配置项

| 配置项 | 类型 | 默认值   | 可选项                                        |说明 |
| :---- | :--:| :-:     | :------------------------------------------: | :-- |
|type   |String|datetime|datetime <br/> daterange <br/> date <br/> time| 组件类型<br/>*datetime为时间日期;<br/>daterange 为日期范围;<br/>date 为只显示日期；<br/>Time 为只显示时间；<br/> **特殊说明:若只是单独引用日期组件或者时间组件，该项可以省略***|
|site   |String|left    |left <br/> right                              |显示的位置<br/>*left:下拉框和输入框左侧对齐<br/>right:下拉和输入框右侧对齐*|




