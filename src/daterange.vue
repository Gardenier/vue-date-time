<template>
  <div class="date-range">
    <input type="hidden" v-model="dateValue">
    <div class="calendar-mon">
      <div class="left-date">
        <i class="prev-year" @click="prevRangeY()"></i>
        <i class="prev-mon" @click="prevRangeM()"></i>
        <span>
          <span>{{rangeDate.curY}}年</span>
          <span>{{rangeDate.curM + 1}}月</span>
        </span>
      </div>
      <div class="right-date">
        <i class="next-year" @click="nextRangeY()"></i>
        <i class="next-mon" @click="nextRangeM()"></i>
        <span>
          <span>{{rangeDate.nextY}}年</span>
          <span>{{rangeDate.nextM + 1}}月</span>
        </span>
      </div>
    </div>
    <Datetable
      v-model="dateL"
      :format="format"
      :range-date="rangeDate"
      :date="{year: rangeDate.curY, month: rangeDate.curM, change: isChange}"
      :type="type"
      :is-left=true
      :is-right=false
      :min-limit-date="minLimitDate"
      :max-limit-date="maxLimitDate"
      :dynamic-limit="dynamicLimit"
    ></Datetable>
    <Datetable
      v-model="dateR"
      :format="format"
      :range-date="rangeDate"
      :date="{year: rangeDate.nextY, month: rangeDate.nextM, change: isChange}"
      class="is-right"
      :type="type"
      :is-left=false
      :is-right=true
      :min-limit-date="minLimitDate"
      :max-limit-date="maxLimitDate"
      :dynamic-limit="dynamicLimit"
    ></Datetable>
    <div class="calendar-btn">
      <span type="button" :class="{gray:isGrayDate}" @click="clearDate">清空</span>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-useless-escape */
  import Datetable from './datetable.vue'
  export default {
    name: 'daterange',
    props: {
      value: {
        type: String,
        default: ''
      },
      format: {
        type: String,
        default: 'yyyy/mm/dd'// yyyy-mm-dd,yyyy/mm/dd,dd/mm/yyyy、dd-mm-yyyy
      },
      type: {
        type: String,
        default: 'date'
      },
      dynamicLimit: {
        type: Number,
        default: 3 // 日期限制, 以第一次点击的日期为基准, 限制此日期前后n个月的日期为可选状态, 默认为三个月
      },
      minLimitDate: {
        type: String,
        default: '' // 最小日期,早于此不可选
      },
      maxLimitDate: {
        type: String,
        default: '' // 最大日期,大于此不可选
      }
    },
    data () {
      return {
        dateL: '',
        dateR: '',
        dateValue: '',
        sepMark: '/',   // 默认分隔符为"/"
        isGrayDate: true,
        rangeDate: {
          startValue: '',
          endValue: '',
          curY: 0,
          curM: 0,
          nextM: 0,
          nextY: 0
        },
        isChange: false
      }
    },
    watch: {
      rangeDate: {
        handler (nv, ov) {
          this.isChange = !this.isChange
          if (nv.startValue !== '' && nv.endValue !== '') {
            if (new Date(Date.parse(nv.startValue)) >= new Date(Date.parse(nv.endValue))) {
              var v = nv.startValue
              nv.startValue = nv.endValue
              nv.endValue = v
            }
            this.dateValue = nv.startValue + ' - ' + nv.endValue
          }
        },
        deep: true
      },
      dateValue (nv, ov) {
        this.isGrayDate = nv === ''
        this.changRange()
        this.$emit('input', nv)
      }
    },
    mounted: function () {
      var _self = this
      if (_self.value !== '') {
        _self.dateValue = _self.value
      } else {
        _self.dateL = ''
        _self.dateR = ''
        _self.initRange()
      }
    },
    methods: {
      formatReg (f) {
        var reg = null
        switch (f) {
          case 'yyyy/mm/dd':
            reg = /^\d{4}\/\d{2}\/\d{2}$/
            break
          case 'dd/mm/yyyy':
            reg = /^\d{2}\/\d{2}\/\d{4}$/
            break
          case 'dd-mm-yyyy':
            reg = /^\d{2}\-\d{2}\-\d{4}$/
            break
          case 'yyyy-mm-dd':
          default:
            reg = /^\d{4}\-\d{2}\-\d{2}$/
            break
        }
        return reg
      },
      changeSepMak (v) {
        var _self = this
        if (_self.format) {
          var f = _self.format
          if (f.indexOf('-') !== -1) {
            _self.sepMark = '-'
          } else if (f.indexOf('/') !== -1) {
            _self.sepMark = '/'
          }
        } else {
          if (v.indexOf('-') !== -1) {
            _self.sepMark = '-'
          } else if (v.indexOf('/') !== -1) {
            _self.sepMark = '/'
          }
        }
      },
      _getTime (val) {
        return (new Date(Date.parse(val))).getTime()
      },
      _getDate (val) {
        return new Date(Date.parse(val))
      },
      _getDay (val) {
        return (new Date(Date.parse(val))).getDate()
      },
      _getMonth (val) {
        return (new Date(Date.parse(val))).getMonth()
      },
      _getYear (val) {
        return (new Date(Date.parse(val))).getFullYear()
      },
      fillZero (n) {
        return n < 10 ? '0' + n : n
      },
      /* 存在值的情况下,第一个为开始日期;否则为当月日期 */
      initRange (v) {
        var _self = this
        var val = ''
        if (!v) {
          this.rangeDate.startValue = ''
          this.rangeDate.endValue = ''
          val = new Date()
        } else {
          val = new Date(Date.parse(v))
        }
        _self.rangeDate.curY = val.getFullYear()
        _self.rangeDate.curM = val.getMonth()
        if (_self.rangeDate.curM === 11) {
          _self.rangeDate.nextM = 0
          _self.rangeDate.nextY = _self.rangeDate.curY + 1
        } else {
          _self.rangeDate.nextM = _self.rangeDate.curM + 1
          _self.rangeDate.nextY = _self.rangeDate.curY
        }
      },
      changRange () {
        this.initRange(this.rangeDate.startValue)
      },
      prevRangeY () {
        var _self = this
        _self.rangeDate.curY--
        _self.rangeDate.nextY--
      },
      prevRangeM () {
        var _self = this
        if (_self.rangeDate.curM === 0) {
          _self.rangeDate.nextY = _self.rangeDate.curY
          _self.rangeDate.nextM = 0
          _self.rangeDate.curM = 11
          _self.rangeDate.curY--
        } else {
          _self.rangeDate.curM--
          if (_self.rangeDate.nextM === 0) {
            _self.rangeDate.nextM = 11
            _self.rangeDate.nextY--
          } else {
            _self.rangeDate.nextM--
          }
        }
      },
      nextRangeY () {
        var _self = this
        _self.rangeDate.curY++
        _self.rangeDate.nextY++
      },
      nextRangeM () {
        var _self = this
        if (_self.rangeDate.curM === 11) {
          _self.rangeDate.curM = 0
          _self.rangeDate.curY++
          _self.rangeDate.nextM++
        } else {
          _self.rangeDate.curM++
          if (_self.rangeDate.nextM === 11) {
            _self.rangeDate.nextM = 0
            _self.rangeDate.nextY++
          } else {
            _self.rangeDate.nextM++
          }
        }
      },
      clearDate () {
        var _self = this
        if (_self.dateValue) {
          _self.dateValue = ''
          _self.initRange()
          _self.isGrayDate = true
          // _self.initCalendar()
        }
        _self.$emit('input', _self.dateValue)
      }
    },
    components: {Datetable}
  }
</script>
