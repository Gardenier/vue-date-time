<template>
  <div>
    <!--<Datetimepicker type="datetime"></Datetimepicker>-->
    <!-- <Datetimepicker type="datetime" :notEditable="notEditable"></Datetimepicker> -->
    <Datepicker v-model="starttime" :hasClearBtn="date1" :pastDue="pastDue"></Datepicker>
    <Timepicker v-model="time1" :time="time1"></Timepicker>
  </div>
</template>
<script type="text/babel">
  import Datetimepicker from './../../src/datetimepicker.vue'
  import Datepicker from './../../src/datepicker.vue'
  import Timepicker from './../../src/timepicker.vue'
  export default {
    data () {
      return {
        starttime: '',
        date1: true,
        time1: '',
        maxLimitDate: '2018-10-20',
        pastDue: true,
        notEditable: true,
        notEditable1: false
      }
    },
    methods: {
      datevisible (nv) {
        this.date1 = nv
      },
      timevisible (nv) {
        this.time1 = nv
      }
    },
    mounted () {
      var _self = this
      setTimeout(function () {
        _self.time1 = '17:00'
      }, 10)
    },
    components: {Datetimepicker, Datepicker, Timepicker}
  }
</script>
