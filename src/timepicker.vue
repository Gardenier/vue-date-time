<template>
  <div class="hs-timepicker">
    <div class="hs-timepicker-cnt">
      <div class="time-input" @click="showBox('time')">
        <slot>
          <i class="default" :class="{'not-editable': notEditable}"></i>
          <input class="default" 
            type="text" 
            :disabled="notEditable"
            :readonly="isReadonly" 
            :placeholder="timePlaceholder" 
            :class="{act:timeAct, 'not-editable': notEditable}" 
            v-model="timeValue">
        </slot>
      </div>
      <div class="timepicker" v-show="isTimeBox" :style="{left: X +'px', top: Y+'px'}">
        <div class="timepicer-box">
          <div class="hourbox" @mouseover="showScroll('hour')" @mouseout="hideScroll('hour')">
            <ul class="hour-list">
              <li v-for="(i,idx) in hours" :key="idx">
                <span @click="selectHours(i.value,idx,$event)" :id="'hours-'+idx" :class="{active: i.isAct, pastdue: i.isPast}">{{i.value}}</span>
              </li>
            </ul>
            <Customscroll :options="optionsHours" :is-hour-scroll="isHourScroll" v-if="isTimeBox"></Customscroll>
          </div>
          <div class="minutesbox" @mouseover="showScroll('minute')" @mouseout="hideScroll('minute')">
            <ul class="time-list">
              <li v-for="(j,idx) in minutes" :key="idx">
                <span @click="selectMinutes(j.value,idx,$event)" :id="'minutes-'+idx" :class="{active: j.isAct, pastdue: j.isPast}">{{j.value}}</span>
              </li>
            </ul>
            <Customscroll :options="optionsMinutes" :is-minute-scroll="isMinuteScroll" v-if="isTimeBox"></Customscroll>
          </div>
        </div>
        <div class="time-btn" v-if="isTimeBtn">
          <span :class="{gray:isGrayTime}" @click="clearTime()">清空</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-useless-escape */
  /* eslint-disable no-trailing-spaces */
  /* eslint-disable no-redeclare */
  import Customscroll from './customScroll.vue'
  import { strToNum, fillZero } from './util/model.js'
  import './timepicker.styl'
  export default{
    name: 'Timepicker',
    props: {
      time: {
        type: String,
        default: ''
      },
      timePlaceholder: {
        type: String,
        default: '请选择'
      },
      timeWidth: {
        type: Number,
        default: 116
      },
      isReadonly: {
        type: Boolean,
        default: true
      },
      isTime: {
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
        type: String,
        default: 'time'
      },
      isTimeBtn: { // 是否显示'清空'操作按钮
        type: Boolean,
        default: true
      },
      isTimePast: { // 是否设置过期时间
        type: Boolean,
        default: false
      },
      notEditable: { // 禁用（样式置灰，不可编辑）
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        isHourScroll: false,
        isMinuteScroll: false,
        isTimeBox: false,
        timeAct: false,
        timeValue: '',
        isGrayTime: true,
        hours: [], // 时
        minutes: [], // 分
        curHourIdx: 0, // 记录当前选中时的位置
        curMinutesIdx: 0, // 记录当前选中分的位置
        X: 0,
        Y: 0,
        hourScroll: null,
        minutesScroll: null,
        hoursLimit: 0,
        minuteLimit: 0,
        optionsHours: {},
        optionsMinutes: {}
      }
    },
    watch: {
      'boxType.value': 'changeBoxType',
      time (nv) {
        this.timeValue = nv
      }
    },
    created () {
      var _self = this
      _self.$nextTick(function () {
        var hourList = _self.$el.querySelector('.hour-list')
        var timeList = _self.$el.querySelector('.time-list')
        var hourBox = _self.$el.querySelector('.hourbox')
        var minutesBox = _self.$el.querySelector('.minutesbox')
        // var curHourEl = _self.$el.querySelector('#hours-' + _self.curHourIdx)
        // var curMinutesEl = _self.$el.querySelector('#minutes-' + _self.curMinutesIdx)
        var curHourElOTop = hourList.style.top ? hourList.style.top : 0
        var curMinutesElOTop = timeList.style.top ? timeList.style.top : 0
        _self.hoursLimit = hourList.offsetHeight - hourBox.offsetHeight
        _self.minuteLimit = timeList.offsetHeight - minutesBox.offsetHeight
        _self.optionsHours = {
          parentDom: hourBox,
          contentDom: hourList,
          contentScrollT: (curHourElOTop > _self.hoursLimit) ? _self.hoursLimit : curHourElOTop
        }
        _self.optionsMinutes = {
          parentDom: minutesBox,
          contentDom: timeList,
          contentScrollT: (curMinutesElOTop > _self.minuteLimit) ? _self.minuteLimit : curMinutesElOTop
        }
      })
    },
    mounted () {
      var _self = this
      if (_self.time !== '') {
        _self.timeValue = _self.time
      }
      _self.$nextTick(function () {
        document.addEventListener('click', function (e) {
          let el = _self.$el.querySelector('.hs-timepicker-cnt')
          let evt = e || window.event
          let tgt = evt.target
          if (el && tgt && !_self.contains(el, tgt)) {
            _self.isTimeBox = false
            _self.timeAct = false
          }
//          if (el && !el.contains(event.target)) {
//          }
        })
      })
    },
    methods: {
      contains (root, el) {
        if (root.compareDocumentPosition) {
          return root === el || !!(root.compareDocumentPosition(el) & 16)
        }
        if (root.contains && el.nodeType === 1) {
          return root.contains(el) && root !== el
        }
        while ((el = el.parentNode)) {
          if (el === root) return true
        }
        return false
      },
      showScroll (ele) {
        this.isHourScroll = ele === 'hour'
        this.isMinuteScroll = ele === 'minute'
      },
      hideScroll (ele) {
        this.isHourScroll = !ele === 'hour'
        this.isMinuteScroll = !ele === 'minute'
      },
      changeBoxType: function () {
        var _self = this
        if (_self.boxType.value === 2 && _self.type === 'datetime') {
          _self.showBox('time')
        } else {
          _self.isTimeBox = false
          _self.timeAct = false
        }
      },
      fillZero: function (n) {
        return n < 10 ? '0' + n : n
      },
      showBox: function (tgt) {
        var _self = this
        if (_self.notEditable) return
        _self.$nextTick(function () {
          var left = _self.$el.querySelector('.time-input').offsetLeft
          var top = _self.$el.querySelector('.time-input').offsetTop + _self.$el.querySelector('.time-input').clientHeight
          _self.X = left
          _self.Y = top
        })
        if (tgt === 'time') {
          if (_self.type === 'datetime') {
            _self.boxType.value = 2
          }
          _self.isTimeBox = true
          _self.timeAct = true
          _self.initTime()
          _self.$emit('timevisible', _self.isTimeBox)
        }
      },
      initHour (curH, curM) {
        var _self = this
        var hList = []
        for (var i = 0; i < 24; i++) {
          var isHourPast = false // 该时间点是否过期
          isHourPast = _self.isTimePast && (i < curH)
          if (_self.fillZero(i) === _self.fillZero(curH) && !_self.timeValue) {
            hList.push({
              value: _self.fillZero(i),
              isAct: true,
              isPast: isHourPast
            })
            _self.curHourIdx = i
          } else if (_self.timeValue && i === _self.curHourIdx) {
            hList.push({
              value: _self.fillZero(i),
              isAct: true,
              isPast: isHourPast
            })
          } else {
            hList.push({
              value: _self.fillZero(i),
              isAct: false,
              isPast: isHourPast
            })
          }
        }
        return hList
      },
      initMinute (curH, curM) {
        var _self = this
        var mList = []
        for (var j = 0; j < 60; j++) {
          var isMinutePast = false // 是否过期
          isMinutePast = _self.isTimePast && (_self.curHourIdx === curH && j < curM)
          if (_self.fillZero(j) === _self.fillZero(curM) && !_self.timeValue) {
            mList.push({
              value: _self.fillZero(j),
              isAct: true,
              isPast: isMinutePast
            })
            _self.curMinutesIdx = j
          } else if (_self.timeValue && j === _self.curMinutesIdx) {
            mList.push({
              value: _self.fillZero(j),
              isAct: true,
              isPast: isMinutePast
            })
          } else {
            mList.push({
              value: _self.fillZero(j),
              isAct: false,
              isPast: isMinutePast
            })
          }
        }
        return mList
      },
      initTime: function () {
        var _self = this
        var format = /^\d{2}\:\d{2}$/   //  时间格式为hh:mm
        var curHour = new Date().getHours()
        var curMinutes = new Date().getMinutes()
        var hTop = 0
        var mTop = 0

        if (_self.timeValue && format.test(_self.timeValue)) {
          _self.isGrayTime = false
          _self.curHourIdx = parseInt(_self.timeValue.substr(0, 2))
          _self.curMinutesIdx = parseInt(_self.timeValue.substr(3, 2))
//          _self.hours[_self.curHourIdx].isAct = true
//          _self.minutes[_self.curMinutesIdx].isAct = true
        }

        _self.hours = _self.initHour(curHour, curMinutes)
        _self.minutes = _self.initMinute(curHour, curMinutes)
        _self.$nextTick(function () {
          var hourBox = _self.$el.querySelector('.hour-list')
          var minutesBox = _self.$el.querySelector('.time-list')
          hTop = _self.$el.querySelector('#hours-' + _self.curHourIdx).offsetTop
          mTop = _self.$el.querySelector('#minutes-' + _self.curMinutesIdx).offsetTop
          _self.changeTop(hourBox, hTop)
          _self.changeTop(minutesBox, mTop)
          _self.optionsHours.contentScrollT = hTop
          _self.optionsMinutes.contentScrollT = mTop
        })
      },
      changeTop: function (ele, t) {
        var _self = this
        _self.$nextTick(function () {
          ele.style.top = -t + 'px'
        })
      },
      selectHours: function (hrs, idx, e) {
        var _self = this
        var curDate = new Date()
        var curHour = curDate.getHours()
        var curMinutes = curDate.getMinutes()
        if (!_self.hours[idx].isPast) {
          /* 设置滚动条的位置 start */
          var ele = _self.$el.querySelector('.hour-list')
          var hoursLimit = _self.$el.querySelector('.hour-list').offsetHeight - _self.$el.querySelector('.hourbox').offsetHeight
          var top = (e.target.offsetTop > hoursLimit) ? hoursLimit : e.target.offsetTop
          _self.changeTop(ele, top)
          _self.optionsHours.contentScrollT = top
          /* 设置滚动条的位置 end */

          var m = '00'
          if (_self.timeValue) {
            // 有值的情况下, 默认情况是直接获取当前值的分钟数,
            // 但是如果设置过期时间, 需要进行判断
            // 如果选中小时数和当前时间小时数相等,并且获取的当前值的分钟数处在不可选的范围,则分钟数取的是当前时间的分钟数
            var selectM = strToNum(_self.timeValue.substr(3, 2))
            if (_self.isTimePast && idx === curHour && selectM < curMinutes) {
              selectM = curMinutes
            }
            m = fillZero(selectM)
            _self.minutes[_self.curMinutesIdx].isAct = false
            _self.minutes[selectM].isAct = true
            _self.curMinutesIdx = selectM
            var mBox = _self.$el.querySelector('.time-list')
            var mtp = _self.$el.querySelector('#minutes-' + _self.curMinutesIdx).offsetTop
            var mLimit = _self.$el.querySelector('.time-list').offsetHeight - _self.$el.querySelector('.minutesbox').offsetHeight
            var tp = (mtp > mLimit) ? mLimit : mtp
            _self.changeTop(mBox, tp)
            _self.optionsMinutes.contentScrollT = tp
          } else {
            // 选中小时数,分钟定位到'00'
            _self.minutes[_self.curMinutesIdx].isAct = false
            _self.minutes[0].isAct = true
            _self.curMinutesIdx = 0
            var mBox = _self.$el.querySelector('.time-list')
            var t = 10
            _self.changeTop(mBox, t)
            _self.optionsMinutes.contentScrollT = t
          }
          _self.hours[_self.curHourIdx].isAct = false
          _self.hours[idx].isAct = true
          _self.curHourIdx = idx
          _self.timeValue = hrs + ':' + m
          _self.isGrayTime = false
          _self.minutes = _self.initMinute(curHour, curMinutes)
          _self.$emit('input', _self.timeValue)
          _self.$emit('change')
        }
      },
      selectMinutes: function (mts, idx, e) {
        var _self = this
        if (!_self.minutes[idx].isPast) {
          var ele = _self.$el.querySelector('.time-list')
          var minuteLimit = _self.$el.querySelector('.time-list').offsetHeight - _self.$el.querySelector('.minutesbox').offsetHeight
          var top = (e.target.offsetTop > minuteLimit) ? minuteLimit : e.target.offsetTop
          _self.changeTop(ele, top)
          _self.optionsMinutes.contentScrollT = top
          var h = ''
          if (_self.timeValue) {
            h = _self.timeValue.substr(0, 2)
          } else {
            h = _self.fillZero(new Date().getHours())
          }
          _self.minutes[_self.curMinutesIdx].isAct = false
          _self.minutes[idx].isAct = true
          _self.curMinutesIdx = idx
          _self.timeValue = h + ':' + mts
          _self.isGrayTime = false
          // _self.isTimeBox = false
          _self.$emit('input', _self.timeValue)
          _self.$emit('change')
        }
      },
      clearTime: function () {
        var _self = this
        _self.timeValue = ''
        _self.isGrayTime = true
        _self.isTimeBox = false
        if (_self.type === 'datetime') {
          _self.boxType.value = 0
        }
        _self.timeAct = false

        _self.$emit('input', _self.timeValue)
      },
      closeTimeBox: function () {
        var _self = this
        _self.isTimeBox = false
        if (_self.type === 'datetime') {
          _self.boxType.value = 0
        }
        _self.timeAct = false
      }
    },
    components: {Customscroll}
  }
</script>
