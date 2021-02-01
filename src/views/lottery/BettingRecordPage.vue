<template>
  <div>
    <app-header
      title="投注记录"
      @left-click="back"
    >
      <template
        v-slot:right
        class="right"
      >
        <a @click="lotteryIdPicker">{{ lotteryName }}
        </a>
      </template>
    </app-header>
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
      <LoadMore
        :on-load-more="onLoadMore"
        :enable-load-more="enableLoadMore"
      >
        <div
          v-for="(item , index) in bettingList"
          :key="index"
          class="itemStyle"
          @click="goDetailPage(item.order_no)"
        >
          <div class="item-row-style">
            期号：{{ item.issue_no }}
          </div>
          <div class="item-row-style">
            投注金额：{{ item.amount }} 元
          </div>
          <div class="item-row-style">
            彩种：{{ item.play_mode === 1 ? item.lottery_name : item.lottery_name + '(信)' }}
          </div>
          <div class="item-row-style">
            时间：{{ item.create_time | timestampToDate() }}
          </div>
        </div>
      </LoadMore>
    </div>
  </div>
</template>
<script>
import DateUtils from '@utils/date'
import LoadMore from './LoadMore'
import LotteryUtils from '@utils/lottery-utils'
export default {
  components: {
    LoadMore
  },
  filters: {
    timestampToDate (str) {
      return DateUtils.stampToDate(str)
    }
  },
  data () {
    return {
      options: ['当前时间', '历史时间'],
      value: '当前时间',
      showHis: true,
      hisNum: 7,
      bettingList: [],
      page: 1,
      has_next_page: 0,
      enableLoadMore: true,
      startDate: new Date(),
      endDate: new Date(),
      startTime: DateUtils.FunGetDateStr(0),
      endTime: DateUtils.FunGetDateStr(0),
      lotteryList: LotteryUtils.getSaleLotteryList(),
      lotteryId: 0,
      lotteryName: '彩种选择'
    }
  },
  mounted () {
    this.getBettingRecord()
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
      this.changSelectConditionBetting()
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
      this.changSelectConditionBetting()
    },
    change (value, index, text) {
      if (value === '当前时间') {
        this.startTime = this.FunGetDateStr(0)
        this.endTime = this.FunGetDateStr(0)
      } else {
        this.startTime = this.FunGetDateStr(-4)
        this.endTime = this.FunGetDateStr(-4)
      }
      this.changSelectConditionBetting()
    },
    lotteryIdPicker () {
      if (!this.picker) {
        this.picker = this.$createPicker({
          title: '彩种选择',
          data: [this.lotteryList],
          onSelect: this.selectHandle
        })
      }
      this.picker.show()
    },
    selectHandle (selectedVal, selectedIndex, selectedText) {
      this.lotteryName = selectedText.join(' ')
      this.lotteryId = selectedVal.join(', ')
      this.changSelectConditionBetting()
    },
    changSelectConditionBetting () {
      this.page = 1
      this.bettingList = []
      this.getBettingRecord()
    },

    back () {
      this.$router.go(-1)
    },
    goDetailPage (order_no) {
      LotteryUtils.orderNo = order_no
      this.$router.push({ name: 'BettingRecordDetail' })
    },
    onLoadMore (done) {
      setTimeout(() => {
        if (!this.enableLoadMore) {
          return
        }
        this.page = this.page + 1
        this.$toast.showText('加载中')
        this.getBettingRecord()
        done()
      }, 200)
    },
    getBettingRecord () {
      const _data = {
        begin_time: DateUtils.dateToStamp(this.startTime + ' 00:00:00', 0),
        end_time: DateUtils.dateToStamp(this.endTime + ' 23:59:59', 0),
        page_index: this.page,
        page_size: 10
        // play_mode: 1
      }
      if (Number(this.lotteryId) !== 0) {
        _data.lottery_no = Number(this.lotteryId)
      }
      this.$api.record.getBetRecordList(_data).then(res => {
        const result = res.data.data
        if (result.records.length > 0) {
          this.bettingList = this.bettingList.concat(result.records)
        }
        this.has_next_page = result.paging.has_next_page
        if (this.has_next_page === 0) {
          this.enableLoadMore = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@styles/record_css.scss';
</style>
