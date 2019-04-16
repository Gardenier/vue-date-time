<template>
  <div class="hs-datepicker">
    <div class="hs-datepick-cnt">
      <div class="date-input" @click="showBox()" :class="[dateAct?'act':'', type === 'daterange'?'isrange':'']">
        <slot>
          <i class="default" :class="{'not-editable': notEditable}"></i>
          <input readonly 
            class="default" 
            type="text" 
            :placeholder="datePlaceholder" 
            :disabled="notEditable"
            :class="{act:dateAct,'not-editable': notEditable}" 
            v-model="dateValue">
          </slot>
      </div>
      <div class="datepicker" v-show="isDateBox" :style="{left: X+'px', top: Y+'px'}">
        <Date
          v-if="type !== 'daterange'"
          v-model="dateValue"
          :box-type="boxType"
          :format="format"
          :past-due="pastDue"
          :min-limit-date="minLimitDate"
          :max-limit-date="maxLimitDate"
          :type="type"
          :value="value"
          :is-date-btn="isDateBtn"
          :has-today-btn="hasTodayBtn"
          :has-clear-btn="hasClearBtn"
        ></Date>
        <Daterange
          v-if="type === 'daterange'"
          v-model="dateValue"
          :format="format"
          :min-limit-date="minLimitDate"
          :max-limit-date="maxLimitDate"
          :type="type"
          :value="value"
          :dynamic-limit="dynamicLimit"
        ></Daterange>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  /* eslint-disable no-useless-escape */
  /* eslint-disable no-debugger */
  import Date from './date.vue'
  import Daterange from './daterange.vue'
  import './datepicker.styl'
  export default{
    name: 'Datepicker',
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
      site: {
        type: String,
        default: 'left'
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
      },
      notEditable: { // 禁用（样式置灰，不可编辑）
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        isDateBox: false,
        dateAct: false,
        dateValue: '',
        X: 0,
        Y: 0
      }
    },
    watch: {
      'boxType.value': 'changeBoxType',
      value (nv) {
        this.dateValue = nv
      },
      dateValue (nv) {
        this.$emit('input', nv)
        this.isDateBox = false
        this.dateAct = false
        if (this.type === 'datetime' && this.isLinkage) {
          this.boxType.value = 2
        }
      }
    },
    mounted: function () {
      var _self = this
      if (_self.value) {
        _self.dateValue = _self.value
      }
      _self.$nextTick(() => {
        document.addEventListener('click', function (e) {
          let el = _self.$el.querySelector('.hs-datepick-cnt')
          let evt = e || window.event
          let tgt = evt.target
          if (el && tgt && !_self.contains(el, tgt)) {
            _self.isDateBox = false
            _self.dateAct = false
          }
//        _self.isDateBox = false
//        _self.dateAct = false
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
      changeBoxType: function () {
        var _self = this
        if (_self.boxType.value === 1 && _self.type === 'datetime') {
          _self.showBox()
        } else {
          _self.isDateBox = false
          _self.dateAct = false
        }
      },
      showBox: function () {
        var _self = this
        if (_self.notEditable) return
        _self.$nextTick(function () {
          var left = _self.$el.querySelector('.date-input').offsetLeft
          var top = _self.$el.querySelector('.date-input').offsetTop + _self.$el.querySelector('.date-input').clientHeight
          var width = _self.$el.querySelector('.date-input').clientWidth
          if (_self.site === 'right') {
            if (_self.type === 'daterange') {
              left -= (484 - width)
            } else {
              left -= (240 - width)
            }
          }
          _self.X = left
          _self.Y = top
        })
        if (_self.type === 'datetime') {
          _self.boxType.value = 1
        }
        _self.isDateBox = true
        _self.dateAct = true
        _self.$emit('datevisible', _self.isDateBox)
      }
    },
    components: { Date, Daterange }
  }
</script>
