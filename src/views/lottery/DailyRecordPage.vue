<template>
  <div>
    <app-header
      title="每日统计"
      @left-click="back"
    />
    <div class="select-div">
      <div style="width:30%;">
        <cube-select
          v-model="value"
          :options="options"
          @change="change"
        />
      </div>
      <div class="timeStyle">
        <p @click="showDatePicker_start">
          {{ startTime }}
        </p>
      </div>
      <div class="timeStyle">
        <p @click="showDatePicker_end">
          {{ endTime }}
        </p>
      </div>
    </div>
    <div class="divStyle">
      <div class="itemStyle">
        <div class="item-row-style">
          投注总金额：{{ dailyTotal.bet_amount }}
        </div>
        <div class="item-row-style">
          中奖中金额：{{ dailyTotal.player_bouns }}
        </div>
        <div class="item-row-style">
          盈亏总金额：{{ dailyTotal.loss_amount }}
        </div>
      </div>
      <div
        v-for="(item , index) in dailyRecordList"
        :key="index"
        class="itemStyle"
      >
        <div class="item-row-style">
          投注总金额：{{ item.bet_amount }}
        </div>
        <div class="item-row-style">
          中奖中金额：{{ item.player_bouns }}
        </div>
        <div class="item-row-style">
          盈亏总金额：{{ item.loss_amount }}
        </div>
        <div class="item-row-style">
          时间：{{ item.date | timestampToDate() }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DateUtils from '@utils/date'
export default {
  components: {
  },
  filters: {
    timestampToDate (str) {
      return DateUtils.stampToDate(str)
    }
  },
  data () {
    return {
      showHis: true,
      hisNum: 7,
      dailyTotal: {},
      dailyRecordList: [],
      options: ['当前时间', '历史时间'],
      value: '当前时间',
      startDate: new Date(),
      endDate: new Date(),
      startTime: DateUtils.FunGetDateStr(0),
      endTime: DateUtils.FunGetDateStr(0)

    }
  },
  mounted () {
    this.getDailyRecord()
  },
  methods: {
    showDatePicker_start () {
      if (this.value === '当前时间') {
        this.datePicker_start = this.$createDatePicker({
          title: '当前时间',
          min: new Date(Number(DateUtils.FunGetDateStr(-3).split('-')[0]), Number(DateUtils.FunGetDateStr(-3).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(-3).split('-')[2])),
          max: new Date(Number(DateUtils.FunGetDateStr(0).split('-')[0]), Number(DateUtils.FunGetDateStr(0).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(0).split('-')[2])),
          value: new Date(),
          onSelect: this.selectHandle_start
        })
      } else {
        this.datePicker_start = this.$createDatePicker({
          title: '历史时间',
          min: new Date(Number(DateUtils.FunGetDateStr(-33).split('-')[0]), Number(DateUtils.FunGetDateStr(-33).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(-33).split('-')[2])),
          max: new Date(Number(DateUtils.FunGetDateStr(-4).split('-')[0]), Number(DateUtils.FunGetDateStr(-4).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(-4).split('-')[2])),
          value: new Date(),
          onSelect: this.selectHandle_start
        })
      }
      this.datePicker_start.show()
    },
    selectHandle_start (date, selectedVal, selectedText) {
      this.startDate = date
      this.startTime = selectedText.join('-')
      this.changSelectConditionDaily()
    },
    showDatePicker_end () {
      if (this.value === '当前时间') {
        this.datePicker_end = this.$createDatePicker({
          title: '当前时间',
          min: new Date(Number(DateUtils.FunGetDateStr(-3).split('-')[0]), Number(DateUtils.FunGetDateStr(-3).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(-3).split('-')[2])),
          max: new Date(Number(DateUtils.FunGetDateStr(0).split('-')[0]), Number(DateUtils.FunGetDateStr(0).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(0).split('-')[2])),
          value: new Date(),
          onSelect: this.selectHandle_end
        })
      } else {
        this.datePicker_end = this.$createDatePicker({
          title: '历史时间',
          min: new Date(Number(DateUtils.FunGetDateStr(-33).split('-')[0]), Number(DateUtils.FunGetDateStr(-33).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(-33).split('-')[2])),
          max: new Date(Number(DateUtils.FunGetDateStr(-4).split('-')[0]), Number(DateUtils.FunGetDateStr(-4).split('-')[1]) - 1, Number(DateUtils.FunGetDateStr(-4).split('-')[2])),
          value: new Date(),
          onSelect: this.selectHandle_end
        })
      }
      this.datePicker_end.show()
    },
    selectHandle_end (date, selectedVal, selectedText) {
      this.endDate = date
      if (this.endDate < this.startDate) {
        this.endTime = this.startTime
      } else {
        this.endTime = selectedText.join('-')
      }
      this.changSelectConditionDaily()
    },
    change (value, index, text) {
      // console.log('change', value, index, text)
      if (value === '当前时间') {
        this.startTime = DateUtils.FunGetDateStr(0)
        this.endTime = DateUtils.FunGetDateStr(0)
      } else {
        this.startTime = DateUtils.FunGetDateStr(-4)
        this.endTime = DateUtils.FunGetDateStr(-4)
      }
      this.changSelectConditionDaily()
    },
    changSelectConditionDaily () {
      this.dailyRecordList = []
      this.dailyTotal = {}
      this.getDailyRecord()
    },

    back () {
      this.$router.go(-1)
    },
    getDailyRecord () {
      const _data = {
        begin_time: DateUtils.dateToStamp(this.startTime + ' 00:00:00', 0),
        end_time: DateUtils.dateToStamp(this.endTime + ' 23:59:59', 0)
      }
      this.$api.record.getDailyStatistics(_data).then(res => {
        const result = res.data
        this.dailyRecordList = result.data.records
        this.dailyTotal = result.data.summary
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@styles/record_css.scss';
</style>
