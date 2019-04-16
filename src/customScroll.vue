<template>
  <div class="scroll-field" v-show="cOffsetH >= pClientH" :class="{show: isHourScroll || isMinuteScroll}">
    <div class="scroll-btn" :style="{height: scrollbarHeight + 'px'}"></div>
  </div>
</template>
<script>
  /* eslint-disable no-undef */
  import './customScroll.styl'
  export default{
    name: 'CustomScroll',
    props: {
      options: {
        parentDom: '',
        contentDom: '',
        contentScrollT: 0
      },
      isHourScroll: false,
      isMinuteScroll: false
    },
    data () {
      return {
        scrollBtn: {},
        pClientH: 0, // 父元素高度
        cOffsetH: 0, // 滚动元素高度
        sOffsetH: 0, // 滚动条区域高度
        isDrag: false,
        scrollbarTop: 0, // 滚动条的top值
        contentTop: 0, // 滚动区域的top值
        scrollbarHeight: 0, // 滚动条的高度
        scrollRadix: 0, // 比例
        maxLimit: 0, // 最大滚动距离
        startTop: 0
      }
    },
    watch: {
      options: {
        handler (nv, ov) {
          this.changeTop(nv.contentScrollT * this.scrollRadix)
        },
        deep: true
      }
    },
    mounted () {
      if (this.options) {
        this.initScroll(this.options.parentDom, this.options.contentDom, this.options.contentScrollT)
        this.scrollBtn = this.$el.querySelector('.scroll-btn')
        this.addScroll(this.options)
      }
    },
    methods: {
      initScroll (pdom, cdom) {
        var _self = this
        _self.$nextTick(function () {
          if (pdom && cdom) {
            pdom.style.position = 'relative'
            pdom.style.overflow = 'hidden'
            cdom.style.position = 'relative'

            _self.pClientH = pdom.clientHeight
            _self.cOffsetH = cdom.offsetHeight
            _self.sOffsetH = _self.$el.offsetHeight

            _self.scrollRadix = _self.sOffsetH / _self.cOffsetH // (<0)
            _self.maxLimit = _self.cOffsetH - _self.pClientH
            _self.contentTop = _self.options.contentScrollT === 0 ? 0 : _self.options.contentScrollT
            _self.scrollbarTop = _self.contentTop * _self.scrollRadix
            // 设置滚动条高度
            _self.scrollbarHeight = _self.sOffsetH * (_self.pClientH / _self.cOffsetH)
          }
        })
      },
      addScroll (options) {
        var _self = this
        var elScrollBtn = _self.$el.querySelector('.scroll-btn')
        _self.addScrollEvent(options.contentDom, function (e) {
          if (e.wheel > 0) { // 滚轮向上滚动
            if (_self.scrollbarTop > 0) {
              var topl = --_self.scrollbarTop
              _self.changeTop(topl)
            }
          } else { // 滚轮向下滚动
            if (_self.scrollbarTop < _self.maxLimit * _self.scrollRadix) {
              var topr = ++_self.scrollbarTop
              _self.changeTop(topr)
            }
          }
        })
        _self.addEvent(elScrollBtn, 'mousedown', function (e) {
          _self.mouseDown(e)
        })
        _self.addEvent(elScrollBtn, 'mouseup', function (e) {
          _self.mouseUp(e)
        })
        _self.addEvent(document.body, 'mouseup', function (e) {
          _self.mouseUp(e)
        })
        _self.addEvent(document.body, 'mousemove', function (e) {
//          e.stopPropagation()
//          if (e.stopPropagation) {
//            e.stopPropagation()
//          } else if (window.event) { // ie
//            window.event.cancelBubble = true
//          }
          if (_self.isDrag) {
            // 获取当前鼠标位置
            var position = _self.getMousePos(e).y
            var currTop = (_self.scrollbarTop + position - _self.startTop)
            if (currTop) {
              _self.changeTop(currTop)
            }
          }
        })
      },
      changeTop (top) {
        var _self = this
        var limit = _self.maxLimit * _self.scrollRadix
        if (top < 0) {
          top = 0
        }
        if (top > limit) {
          top = limit
        }
        _self.scrollBtn.style.top = top + 'px'
        _self.options.contentDom.style.top = -top / _self.scrollRadix + 'px'
      },
      mouseUp (e) {
//        e.stopPropagation()
//        if (e.stopPropagation) {
//          e.stopPropagation()
//        } else if (window.event) { // ie
//          window.event.cancelBubble = true
//        }
        this.isDrag = false
        this.startTop = this.getMousePos(e).y
      },
      mouseDown (e) {
//        e.stopPropagation()
//        if (e.stopPropagation) {
//          e.stopPropagation()
//        } else if (window.event) { // ie
//          window.event.cancelBubble = true
//        }
        this.isDrag = true
        this.startTop = this.getMousePos(e).y
      },
      addEvent (element, type, fn) {
        if (element) {
          if (element.attachEvent) {
            element['e' + type + fn] = fn
            element[type + fn] = function () { element['e' + type + fn](window.event) }
            element.attachEvent('on' + type, element[type + fn])
          } else if (element.addEventListener) {
            element.addEventListener(type, fn, false)
          }
        }
      },
      addScrollEvent (element, fn) {
        var bindScrollFn = function (e) {
          e = e || window.event
          // 判断滚轮滚动方向：Firefox和其他浏览器不同
          e.wheel = (e.wheelDelta ? e.wheelDelta : -e.detail) > 0 ? 1 : -1 // 通过事件判断鼠标滚轮反向，1是向上，-1是向下
          // 阻止浏览器默认行为
          if (e.preventDefault) { // ff
            e.preventDefault()
          } else {
            e.returnValue = false // ie
          }
          fn.call(element, e)
        }
        if (document.addEventListener) {
          // ff
          element.addEventListener('DOMMouseScroll', bindScrollFn, false)
          // w3c
          element.addEventListener('mousewheel', bindScrollFn, false)
        } else { // ie
          element.attachEvent('onmousewheel', bindScrollFn)
        }
      },
      getEvent () {
        if (document.all) { // ie only
          return window.event
        }
        var func = getEvent.caller
        while (func != null) {
          var arg0 = func.arguments[0]
          if (arg0) {
            if ((arg0.constructor === Event || arg0.constructor === MouseEvent) || (typeof (arg0) === 'object' && arg0.preventDefault && arg0.stopPropagation)) {
              return arg0
            }
          }
          func = func.caller
        }
        return null
      },
      getMousePos (ev) {
        if (!ev) {
          ev = currScroll.getEvent()
        }
        if (ev.pageX || ev.pageY) {
          return {
            x: ev.pageX,
            y: ev.pageY
          }
        }
        if (document.documentElement && document.documentElement.scrollTop) {
          return {
            x: ev.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
            y: ev.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
          }
        } else if (document.body) {
          return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
          }
        }
      }
    }
  }
</script>
