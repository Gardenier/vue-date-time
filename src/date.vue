<template>
    <div class="date">
      <input type="hidden" v-model="dateValue">
      <div class="calendar-mon">
        <div class="date">
          <i class="prev-year" @click="prevYear"></i>
          <i class="prev-mon" @click="prev"></i>
          <span>
            <span>{{curYear}}年</span>
            <span>{{curMonNum + 1}}月</span>
          </span>
          <i class="next-mon" @click="next"></i>
          <i class="next-year" @click="nextYear"></i>
        </div>
      </div>
      <Datetable
        v-model="dateValue"
        :type="type"
        :box-type="boxType"
        :date="{year: curYear,month: curMonNum}"
        :format="format"
        :past-due="pastDue"
        :min-limit-date="minLimitDate"
        :max-limit-date="maxLimitDate"
        :value="dateValue"
      ></Datetable>
      <div class="calendar-btn" v-if="(isDateBtn && hasTodayBtn) || (isDateBtn && hasClearBtn)">
        <span type="button" class="today" v-show="hasTodayBtn" @click="today($event)">今天</span>
        <span type="button" v-show="hasClearBtn" :class="{gray:isGrayDate}" @click="clearDate">清空</span>
      </div>
    </div>
</template>
<script>
  /* eslint-disable no-useless-escape */
  /* eslint-disable no-debugger */
  import Datetable from './datetable.vue'
  export default{
    name: 'date',
    props: {
      value: {
        type: String,
        default: ''
      },
      dateStyle: {
        type: String,
        default: ''
      },
      datePlaceholder: {
        type: String,
        default: '请选择'
      },
      format: {
        type: String,
        default: 'yyyy/mm/dd'// yyyy-mm-dd,yyyy/mm/dd,dd/mm/yyyy、dd-mm-yyyy
      },
      isReadonly: {
        type: Boolean,
        default: true
      },
      minLimitDate: {
        type: String,
        default: '' // 最小日期,早于此不可选
      },
      maxLimitDate: {
        type: String,
        default: '' // 最大日期,大于此不可选
      },
      pastDue: {
        type: Boolean,
        default: false // 过期日期,默认为true,不可点击
      },
      isDate: {
        type: Boolean,
        default: false
      },
      boxType: {
        value: {
          type: Number,
          default: 0
        }
      },
      type: {
        value: {
          type: String,
          default: 'date'
        }
      },
      isDateBtn: { // 是否显示 '今天' '清空'操作按钮
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
    data: function () {
      return {
        dateValue: '',
        curDay: 0,
        curMonNum: 0,
        curMon: 0,
        curYear: 0,
        curWeekNum: '',
        sepMark: '/',   // 默认分隔符为"/"
        isGrayDate: true
      }
    },
    watch: {
      value (nv, ov) {
        this.dateValue = nv
      },
      dateValue (nv, ov) {
        this.isGrayDate = nv === ''
        var val = new Date(Date.parse(nv))
        var valToday = new Date()
        if (nv === '') {
          this.curYear = valToday.getFullYear()
          this.curMonNum = valToday.getMonth()
        } else {
          this.curYear = val.getFullYear()
          this.curMonNum = val.getMonth()
        }
        this.$emit('input', nv)
      }

    },
    mounted: function () {
      var _self = this
      if (_self.value) {
        _self.dateValue = _self.value
      } else {
        _self.getToday()
      }
    },
    methods: {
      changeBoxType: function () {
        var _self = this
        if (_self.boxType.value === 1 && _self.type === 'datetime') {
          _self.showBox('date')
        } else {
          _self.isDateBox = false
          _self.dateAct = false
        }
      },
      fillZero: function (n) {
        return n < 10 ? '0' + n : n
      },
      getToday () {
        var _self = this
        var date = new Date()
        _self.curYear = date.getFullYear()
        _self.curDay = date.getDate()
        _self.curWeekNum = date.getDay()
        _self.curMonNum = date.getMonth()
      },
      prevYear: function (e) {
        this.curYear--
      },
      nextYear: function (e) {
        this.curYear++
      },
      prev: function (e) {
        var _self = this
        if (_self.curMonNum === 0) {
          _self.curYear--
          _self.curMonNum = 11
        } else {
          _self.curMonNum--
        }
      },
      next: function (e) {
        var _self = this
        if (_self.curMonNum === 11) {
          _self.curYear++
          _self.curMonNum = 0
        } else {
          _self.curMonNum++
        }
      },
      today: function (e) {
        var _self = this
        var date = new Date()
        _self.curYear = date.getFullYear()
        _self.curDay = date.getDate()
        _self.curWeekNum = date.getDay()
        _self.curMonNum = date.getMonth()
        if (_self.format) {
          var f = _self.format
          if (f.indexOf('-') !== -1) {
            _self.sepMark = '-'
          } else if (f.indexOf('/') !== -1) {
            _self.sepMark = '/'
          }
          if (f === 'yyyy-mm-dd' || f === 'yyyy/mm/dd') {
            _self.dateValue = _self.curYear + _self.sepMark + _self.fillZero(_self.curMonNum + 1) + _self.sepMark + _self.fillZero(_self.curDay)
          } else if (f === 'dd-mm-yyyy' || f === 'dd/mm/yyyy') {
            _self.dateValue = _self.fillZero(_self.curDay) + _self.sepMark + _self.fillZero(_self.curMonNum + 1) + _self.sepMark + _self.curYear
          }
        } else {
          _self.dateValue = _self.curYear + _self.sepMark + _self.fillZero(_self.curMonNum + 1) + _self.sepMark + _self.fillZero(_self.curDay)
        }
        _self.isDateBox = false
        if (_self.type === 'datetime') {
          _self.boxType.value = 2
        }
        _self.dateAct = false
        _self.$emit('input', _self.dateValue)
        // _self.initCalendar()
      },
      clearDate: function (e) {
        var _self = this

        _self.dateValue = ''
        _self.isGrayDate = true
        _self.isDateBox = false
        if (_self.type === 'datetime') {
          _self.boxType.value = 0
        }
        _self.dateAct = false

        _self.$emit('input', _self.dateValue)
      }
    },
    components: {Datetable}
  }
</script>
