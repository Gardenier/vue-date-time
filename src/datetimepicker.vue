<template>
  <div class="hs-datetimerpicker">
    <Datepicker
      :value="value"
      :date-placeholder="datePlaceholder"
      :format="format"
      :past-due="pastDue"
      :is-date="isDate"
      :box-type="boxType"
      :type="type"
      :min-limit-date="minLimitDate"
      :max-limit-date="maxLimitDate"
      :site="site"
      :is-date-btn="isDateBtn"
      :has-today-btn="hasTodayBtn"
      :has-Clear-btn="hasClearBtn"
      :is-linkage="isLinkage"
      :not-editable="notEditable"
      v-if="isDate">
    </Datepicker>
    <Timepicker
      :time="time"
      :time-placeholder="timePlaceholder"
      :is-time="isTime"
      :box-type="boxType"
      :is-time-btn="isTimeBtn"
      :type="type"
      :is-time-past="isTimePast"
      :is-linkage="isLinkage"
      :not-editable="notEditable"
      v-if="isTime">
    </Timepicker>
  </div>
</template>
<script>
  import Datepicker from './datepicker.vue'
  import Timepicker from './timepicker.vue'
  import './datetimepicker.styl'
  export default{
    name: 'Datetimepicker',
    props: {
      value: {
        type: String,
        default: ''
      },
      time: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'date'// date: 日期;datetime: 日期时间;daterange: 日期范围
      },
      site: {
        type: String,
        default: 'left'
      },
      datePlaceholder: {
        type: String,
        default: '请选择'
      },
      timePlaceholder: {
        type: String,
        default: '请选择'
      },
      format: {
        type: String,
        default: 'yyyy-mm-dd'// yyyy-mm-dd,yyyy/mm/dd,dd/mm/yyyy、dd-mm-yyyy
      },
      pastDue: {
        type: Boolean,
        default: false // 过期日期
      },
      isTimePast: { // 是否设置过期时间
        type: Boolean,
        default: false
      },
      minLimitDate: {
        type: String,
        default: ''
      },
      maxLimitDate: {
        type: String,
        default: ''
      },
      notEditable: {
        type: Boolean,
        default: false
      },
      isTimeBtn: { // 是否显示'清空'操作按钮
        type: Boolean,
        default: true
      },
      isDateBtn: { // 是否显示 '今天' '清空'操作按钮
        type: Boolean,
        default: true
      },
      isLinkage: { // 是否联动,默认联动,日期选择之后时间自动弹出下拉框
        type: Boolean,
        default: true
      },
      hasTodayBtn: { // 是否显示 '今天' 操作按钮
        type: Boolean,
        default: true
      },
      hasClearBtn: { // 是否显示 '清空' 操作按钮
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        isDate: true,
        isTime: true,
        boxType: {
          value: 0
        } // 0: 不显示, 1: 日期, 2: 时间
      }
    },
    methods: {
      changeBox () {
        var _self = this
        _self.isDate = _self.type !== 'time'
        _self.isTime = (_self.type === 'time' || _self.type === 'datetime')
      }
    },
    mounted () {
      this.changeBox()
    },
    components: {
      Datepicker, Timepicker
    }
  }
</script>
