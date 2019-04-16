<template>
  <div class="date-table calendar-box">
    <input type="hidden" v-model="dateValue">
    <div class="calendar-week">
      <span v-for="(item, idx) in weeks" class="week" :key="idx">{{item}}</span>
    </div>
    <table class="calendar-days" border="0" cellpadding="0" cellspacing="0">
      <tbody>
      <tr v-for="(row,x) in days" :key="x">
        <td
          v-for="(idy,y) in row"
          :key="y"
          :y="idy.year"
          :m="idy.mon"
          :class="{select:idy.slt && !(idy.isPastDue), pastdue: idy.isPastDue, today: idy.crt, active:(idy.isActive && type !== 'daterange'), inrange: idy.isInRange, isstart: idy.isStart, isend: idy.isEnd}"
          @click="selectDate(x,y,idy.day,$event)"
        >{{idy.day}}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  /* eslint-disable no-useless-escape */
  /* eslint-disable no-debugger */
  import './datetable.styl'
  export default {
    name: 'datetable',
    props: {
      date: {
        year: {
          type: Number,
          default: 0
        },
        month: {
          type: Number,
          default: 0
        },
        change: {
          type: Boolean,
          default: false
        }
      },
      value: {
        type: String,
        default: ''
      },
      format: {
        type: String,
        default: 'yyyy/mm/dd'// yyyy-mm-dd,yyyy/mm/dd,dd/mm/yyyy、dd-mm-yyyy
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
      },
      pastDue: {
        type: Boolean,
        default: false // 过期日期,默认为true,不可点击
      },
      type: {
        type: String,
        default: 'date'
      },
      isLeft: {
        type: Boolean,
        default: false
      },
      isRight: {
        type: Boolean,
        default: false
      },
      rangeDate: {
        startValue: {
          type: String,
          default: ''
        },
        endValue: {
          type: String,
          default: ''
        },
        curY: {
          type: Number,
          default: 0
        },
        curM: {
          type: Number,
          default: 0
        },
        nextM: {
          type: Number,
          default: 0
        },
        nextY: {
          type: Number,
          default: 0
        }
      }
    },
    data () {
      return {
        start: '',
        end: '',
        dateValue: '',
        curWeekNum: '',
        curWeek: '',
        days: [],
        curDate: [],   // 记录当前选中的位置
        sepMark: '/',   // 默认分隔符为"/"
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        isGrayDate: true
      }
    },
    watch: {
      value (nv, ov) {
        this.dateValue = nv
      },
      rangeDate: {
        handler (nv) {
          this.start = nv.startValue
          this.end = nv.endValue
        },
        deep: true
      },
      date: {
        handler (nv, ov) {
          this.renderCalendar(nv.year, nv.month)
        },
        deep: true
      }
    },
    mounted () {
      var _self = this
      if (_self.value) {
        _self.dateValue = _self.value
      }
      _self.initCalendar()
    },
    methods: {
      formatReg: function (f) {
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
      initCalendar: function () {
        var _self = this
        if (_self.dateValue) {
          _self.isGrayDate = false
          var v = _self.dateValue
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
          var d = ''
          if (_self.formatReg(_self.format).test(_self.dateValue)) {
            d = new Date(Date.parse(v))
          } else {
            d = new Date()
          }
          _self.curWeekNum = d.getDay()
          _self.date.year = d.getFullYear()
          _self.date.month = d.getMonth()
        } else {
          var date = new Date()
          _self.curWeekNum = date.getDay()
          _self.date.year = date.getFullYear()
          _self.date.month = date.getMonth()
        }
        _self.weeks.forEach(function (w, idx) {
          if (_self.curWeekNum === idx) {
            _self.curWeek = w
          }
        })
        _self.renderCalendar(_self.date.year, _self.date.month)
      },
      /* {
       year: y, //年
       mon: n, //月
       day: i, // 日
       week: cw, // 周
       isPastDue: false, // 设置过期时间,过期为true且不可点选
       slt: true, // 是否至灰(即当月正常显示),isPastDue为true时,置灰不可点选;isPastDue为false时,虽置灰但可点选
       crt: cur, // 今天
       isActive: isA // 选中,true为高亮
       isInRange: false // 是否在日期区间
       isStart: false // 是否是开始日期
       isEnd: false // 是否是结束日期
       } */
      renderCalendar: function (y, m) {
        var _self = this
        var cD = new Date()
        var startV = new Date(Date.parse(_self.start.replace(/-/g, '/')))
        var endV = new Date(Date.parse(_self.end.replace(/-/g, '/')))
        var cDD = cD.getDate() // 当日
        var cDM = cD.getMonth() // 当月
        var cDY = cD.getFullYear() // 当年
        var cVD, cVM, cVY // 选中日
        var minLmtD, minLmtM, minLmtY // 最小时间
        var maxLmtD, maxLmtM, maxLmtY // 最大时间
        if (_self.minLimitDate) {
          var minLmt = new Date(Date.parse(_self.minLimitDate))
          minLmtD = minLmt.getDate()
          minLmtM = minLmt.getMonth()
          minLmtY = minLmt.getFullYear()
        }
        if (_self.maxLimitDate) {
          var maxLmt = new Date(Date.parse(_self.maxLimitDate))
          maxLmtD = maxLmt.getDate()
          maxLmtM = maxLmt.getMonth()
          maxLmtY = maxLmt.getFullYear()
        }
        if (_self.type !== 'daterange' && _self.dateValue && _self.formatReg(_self.format).test(_self.dateValue)) {
          var cVal = new Date(Date.parse(_self.dateValue))
          cVD = cVal.getDate()
          cVM = cVal.getMonth()
          cVY = cVal.getFullYear()
        } else {
          cVD = 0
          cVM = 0
          cVY = 0
        }
        var lastDateOfCur = new Date(y, m + 1, 0) // 当月最后一天日期
        var line = 0
        var days = []
        for (var i = 1; i <= lastDateOfCur.getDate(); i++) {
          var cd = new Date(y, m, i)
          var cw = cd.getDay()
          var cur = false
          var isA = false // 选中时高亮
          var isPastDue = false // 过期时间
          var isStart = false // 开始日期
          var isEnd = false // 结束日期
          var isInRange = false // 属于日期区间

          isStart = (cd.getTime() === startV.getTime())
          isEnd = (cd.getTime() === endV.getTime())
          isInRange = ((cd >= startV && cd <= endV) || isStart || isEnd)

          if (_self.minLimitDate && ((y < minLmtY) || (y === minLmtY && m < minLmtM) || (y === minLmtY && m === minLmtM && i < minLmtD))) {
            isPastDue = true
          }
          if (_self.maxLimitDate && ((y > maxLmtY) || (y === maxLmtY && m > maxLmtM) || (y === maxLmtY && m === maxLmtM && i > maxLmtD))) {
            isPastDue = true
          }
          if (_self.pastDue && _self.minLimitDate === '' && _self.maxLimitDate === '' && ((y < cDY) || (y === cDY && m < cDM) || (y === cDY && m === cDM && i < cDD))) {
            isPastDue = true
          }

          if (cVD !== cDD) {
            if (i === cDD && m === cDM && y === cDY) {
              cur = true
              if (!_self.dateValue || !_self.formatReg(_self.format).test(_self.dateValue)) {
                isA = true
                _self.curDate.x = line
                _self.curDate.y = cw
              }
            }
            if (i === cVD && m === cVM && y === cVY) {
              isA = true
              _self.curDate.x = line
              _self.curDate.y = cw
            }
          } else {
            if (i === cDD && m === cDM && y === cDY) {
              cur = true
              isA = true
              _self.curDate.x = line
              _self.curDate.y = cw
            }
          }
          if (i === 1) {
            if (cw === 0) {
              days[line] = []
              days[line].push({
                year: y,
                mon: m + 1,
                day: i,
                week: cw,
                slt: true,
                crt: cur,
                isActive: isA,
                isPastDue: isPastDue,
                isInRange: isInRange,
                isStart: isStart,
                isEnd: isEnd
              })
            } else {
              var addDayL = cw - 0 // 需要填充的上个月的天数
              var ldp = new Date(y, m, 0)
              var ld = ldp.getDate()
              var lIspast = isPastDue
              days[line] = []
              for (var a = 0; a < addDayL; a++) {
                if (_self.minLimitDate && ((y === minLmtY && m === minLmtM && i === minLmtD) || (y === minLmtY && m === minLmtM + 1 && ld < minLmtD))) {
                  lIspast = true
                }
                if (_self.maxLimitDate && ((y === maxLmtY && m === maxLmtM + 1 && i === maxLmtD) || (y === maxLmtY && m === maxLmtM + 1 && ld <= maxLmtD))) {
                  lIspast = false
                }
                if (_self.pastDue && _self.minLimitDate === '' && _self.maxLimitDate === '' && ((y < cDY) || (y === cDY && m < cDM + 1) || (y === cDY && m === cDM + 1 && ld < cDD))) {
                  lIspast = true
                }
                days[line].unshift({
                  year: (m === 0 ? y - 1 : y),
                  mon: (m === 0 ? 12 : m),
                  day: ld,
                  week: cw,
                  slt: false,
                  crt: false,
                  isActive: false,
                  isPastDue: lIspast,
                  isInRange: false,
                  isStart: false,
                  isEnd: false
                })
                ld--
              }
              days[line].push({
                year: y,
                mon: m + 1,
                day: i,
                week: cw,
                slt: true,
                crt: cur,
                isActive: isA,
                isPastDue: isPastDue,
                isInRange: isInRange,
                isStart: isStart,
                isEnd: isEnd
              })
            }
          } else if (i === lastDateOfCur.getDate()) {
            if (cw === 6) {
              days[line].push({
                year: y,
                mon: m + 1,
                day: i,
                week: cw,
                slt: true,
                crt: cur,
                isActive: isA,
                isPastDue: isPastDue,
                isInRange: isInRange,
                isStart: isStart,
                isEnd: isEnd
              })
            } else if (cw === 0) {
              line = line + 1
              days[line] = []
              days[line].push({
                year: y,
                mon: m + 1,
                day: i,
                week: cw,
                slt: true,
                crt: cur,
                isActive: isA,
                isPastDue: isPastDue,
                isInRange: isInRange,
                isStart: isStart,
                isEnd: isEnd
              })
              var addDayN = 6 - cw // 需要填充的下个月的天数
              var fdn = new Date(y, m + 1, 1)
              var fd = fdn.getDate()
              var nextIspast = isPastDue
              for (var la = 0; la < addDayN; la++) {
                if (_self.minLimitDate && ((y === minLmtY && m === minLmtM - 1 && i === minLmtD) || (y === minLmtY && m === minLmtM - 1 && fd >= minLmtD))) {
                  nextIspast = false
                }
                if (_self.maxLimitDate && ((y === maxLmtY && m === maxLmtM && i === maxLmtD) || (y === maxLmtY && m === maxLmtM - 1 && fd > maxLmtD))) {
                  nextIspast = true
                }
                days[line].push({
                  year: (m === 11 ? y + 1 : y),
                  mon: (m === 11 ? 1 : m + 2),
                  day: fd,
                  week: cw,
                  slt: false,
                  crt: false,
                  isActive: false,
                  isPastDue: nextIspast,
                  isInRange: false,
                  isStart: false,
                  isEnd: false
                })
                fd++
              }
            } else {
              days[line].push({
                year: y,
                mon: m + 1,
                day: i,
                week: cw,
                slt: true,
                crt: cur,
                isActive: isA,
                isPastDue: isPastDue,
                isInRange: isInRange,
                isStart: isStart,
                isEnd: isEnd
              })
              var eaddDayN = 6 - cw // 需要填充的下个月的天数
              var efdn = new Date(y, m + 1, 1)
              var efd = efdn.getDate()
              var enextIspast = isPastDue
              for (var ea = 0; ea < eaddDayN; ea++) {
                if (_self.minLimitDate && ((y === minLmtY && m === (minLmtM - 1) && i === minLmtD) || (y === minLmtY && m === minLmtM - 1 && efd >= minLmtD))) {
                  enextIspast = false
                }
                if (_self.maxLimitDate && ((y === maxLmtY && m === maxLmtM && i === maxLmtD) || (y === maxLmtY && m === maxLmtM - 1 && efd > maxLmtD))) {
                  enextIspast = true
                }
                days[line].push({
                  year: (m === 11 ? y + 1 : y),
                  mon: (m === 11 ? 1 : m + 2),
                  day: efd,
                  week: cw,
                  slt: false,
                  crt: false,
                  isActive: false,
                  isPastDue: enextIspast,
                  isInRange: false,
                  isStart: false,
                  isEnd: false
                })
                efd++
              }
            }
            // 小于6行,最后一行填充
            if (line < 5) {
              var lastMday = days[line][6].day // 上一行的最后一个数字
              var lla = days[line][6].day + 1
              if (lastMday === i) {
                lla = 1
              }
              var lw = 0
              line += 1
              days[line] = []
              var lnextIspast = isPastDue
              for (var n = 0; n <= 6; n++) {
                if (_self.minLimitDate && ((y === minLmtY && m === minLmtM - 1 && i === minLmtD) || (y === minLmtY && m === minLmtM - 1 && lla >= minLmtD))) {
                  lnextIspast = false
                }
                if (_self.maxLimitDate && ((y === maxLmtY && m === maxLmtM && i === maxLmtD) || (y === maxLmtY && m === maxLmtM - 1 && lla > maxLmtD))) {
                  lnextIspast = true
                }
                days[line].push({
                  year: (m === 11 ? y + 1 : y),
                  mon: (m === 11 ? 1 : m + 2),
                  day: lla,
                  week: lw,
                  slt: false,
                  crt: false,
                  isActive: false,
                  isPastDue: lnextIspast,
                  isInRange: false,
                  isStart: false,
                  isEnd: false
                })
                lla++
                lw++
              }
            }
          } else {
            if (cw === 0) {
              line = line + 1
              days[line] = []
            }
            days[line].push({
              year: y,
              mon: m + 1,
              day: i,
              week: cw,
              slt: true,
              crt: cur,
              isActive: isA,
              isPastDue: isPastDue,
              isInRange: isInRange,
              isStart: isStart,
              isEnd: isEnd
            })
          }
        }
        _self.days = days
      },
      fillZero: function (n) {
        return n < 10 ? '0' + n : n
      },
      selectDate: function (x, y, day, event) {
        var _self = this
        if (!_self.days[x][y].isPastDue) {
          var d = day
          var date = ''
          if (_self.days[x][y].mon !== (_self.date.month + 1)) {
            _self.date.month = _self.days[x][y].mon - 1
            _self.date.year = _self.days[x][y].year
          }
          if (_self.format) {
            var f = _self.format
            if (f.indexOf('-') !== -1) {
              _self.sepMark = '-'
            } else if (f.indexOf('/') !== -1) {
              _self.sepMark = '/'
            }
            if (f === 'yyyy-mm-dd' || f === 'yyyy/mm/dd') {
              date = _self.days[x][y].year + _self.sepMark + _self.fillZero(_self.days[x][y].mon) + _self.sepMark + _self.fillZero(d)
            } else if (f === 'dd-mm-yyyy' || f === 'dd/mm/yyyy') {
              date = _self.fillZero(d) + _self.sepMark + _self.fillZero(_self.days[x][y].mon) + _self.sepMark + _self.days[x][y].year
            }
          } else {
            date = _self.days[x][y].year + _self.sepMark + _self.fillZero(_self.days[x][y].mon) + _self.sepMark + _self.fillZero(d)
          }
          if (_self.type === 'daterange') {
            if (_self.rangeDate.startValue === '' || (_self.rangeDate.startValue !== '' && _self.rangeDate.endValue !== '')) {
              _self.rangeDate.endValue = ''
              _self.start = ''
              _self.end = ''
              _self.rangeDate.startValue = date
              _self.days[x][y].isStart = true
            } else {
              _self.rangeDate.endValue = date
              _self.days[x][y].isEnd = true
            }
            if (_self.isLeft) {
              _self.rangeDate.curY = _self.days[x][y].year
              _self.rangeDate.curM = _self.days[x][y].mon - 1
              if (_self.rangeDate.curM === 11) {
                _self.rangeDate.nextM = 0
                _self.rangeDate.nextY = _self.rangeDate.curY + 1
              } else {
                _self.rangeDate.nextM = _self.rangeDate.curM + 1
                _self.rangeDate.nextY = _self.rangeDate.curY
              }
            } else {
              _self.rangeDate.nextY = _self.days[x][y].year
              _self.rangeDate.nextM = _self.days[x][y].mon - 1
              if (_self.rangeDate.nextM === 0) {
                _self.rangeDate.curY = _self.rangeDate.nextY - 1
                _self.rangeDate.curM = 11
              } else {
                _self.rangeDate.curM = _self.rangeDate.nextM - 1
                _self.rangeDate.curY = _self.rangeDate.nextY
              }
            }
            _self.days[_self.curDate.x][_self.curDate.y].isActive = false
            _self.days[x][y].isActive = true
          } else {
            _self.dateValue = date
            _self.days[_self.curDate.x][_self.curDate.y].isActive = false
            _self.curDate.x = x
            _self.curDate.y = y
            _self.days[x][y].isActive = true
            _self.isDateBox = false
            _self.dateAct = false
            console.log('_self.dateValue', _self.dateValue)
            _self.$emit('input', _self.dateValue)
          }
          // _self.initCalendar()
        } else {
          return false
        }
      }
    }
  }
</script>
