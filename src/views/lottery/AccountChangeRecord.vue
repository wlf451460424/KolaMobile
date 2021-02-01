<template>
  <div>
    <app-header
      title="帐变记录"
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
      <LoadMore
        :on-load-more="onLoadMore"
        :enable-load-more="enableLoadMore"
      >
        <div
          v-for="(item , index) in accountChangeList"
          :key="index"
          class="itemStyle"
        >
          <div class="item-row-style">
            订单号：{{ item.operand_id }}
          </div>
          <div class="item-row-style">
            交易金额：
            <template v-if="item.direction === -1 ">
              <span :style="{color:'#009900'}">- {{ item.amount }}</span>
            </template>
            <template v-else>
              <span :style="{color:'#FF0000'}">+ {{ item.amount }}</span>
            </template>
            元
          </div>
          <div class="item-row-style">
            交易类型：{{ item.category_text }}
          </div>
          <div class="item-row-style">
            交易时间：{{ item.create_time | timestampToDate() }}
          </div>
          <div class="item-row-style">
            备注：{{ item.remark }}
          </div>
        </div>
      </LoadMore>
    </div>
  </div>
</template>
<script>
import DateUtils from '@utils/date'
import LoadMore from './LoadMore'
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
      accountChangeList: [],
      page: 1,
      has_next_page: 0,
      enableLoadMore: true,
      startDate: new Date(),
      endDate: new Date(),
      startTime: DateUtils.FunGetDateStr(0),
      endTime: DateUtils.FunGetDateStr(0)
    }
  },
  mounted () {
    this.getAccountChangeRecord()
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
      this.changSelectConditionAccount()
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
      this.changSelectConditionAccount()
    },
    change (value, index, text) {
      if (value === '当前时间') {
        this.startTime = DateUtils.FunGetDateStr(0)
        this.endTime = DateUtils.FunGetDateStr(0)
      } else {
        this.startTime = DateUtils.FunGetDateStr(-4)
        this.endTime = DateUtils.FunGetDateStr(-4)
      }
      this.changSelectConditionAccount()
    },
    changSelectConditionAccount () {
      this.page = 1
      this.accountChangeList = []
      this.getAccountChangeRecord()
    },

    back () {
      this.$router.go(-1)
    },
    onLoadMore (done) {
      setTimeout(() => {
        if (!this.enableLoadMore) {
          return
        }
        this.page = this.page + 1
        this.$toast.showText('加载中')
        this.getAccountChangeRecord()
        done()
      }, 200)
    },
    getAccountChangeRecord () {
      const _data = {
        begin_time: DateUtils.dateToStamp(this.startTime + ' 00:00:00', 0),
        end_time: DateUtils.dateToStamp(this.endTime + ' 23:59:59', 0),
        page_index: this.page,
        page_size: 10
      }
      this.$api.record.getFundRecord(_data).then(res => {
        const result = res.data.data
        this.accountChangeList = this.accountChangeList.concat(result.records)
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
