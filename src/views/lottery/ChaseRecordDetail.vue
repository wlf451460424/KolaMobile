<template>
  <div>
    <app-header
      title="订单详情"
      @left-click="back"
    />
    <div class="divStyle">
      <div class="itemStyle">
        <div class="item-row-style">
          订单号：{{ chaseOrderDetail.chase_plan_no }}
        </div>
        <div class="item-row-style">
          彩种：{{ chaseOrderDetail.lottery_name }}
        </div>
        <div class="item-row-style">
          玩法：{{ chaseOrderDetail.play_name }}
        </div>
        <div class="item-row-style">
          投注模式：{{ chaseOrderDetail.currency_mode_text }}
        </div>
        <div class="item-row-style">
          赔率：{{ chaseOrderDetail.bet_rebate }}
        </div>
        <div class="item-row-style">
          时间：{{ chaseOrderDetail.create_time | timestampToDate() }}
        </div>
        <div class="item-row-style">
          {{ chaseOrderDetail.stop_mode_text }}
        </div>
        <div class="item-row-style">
          投注号码：{{ chaseOrderDetail.bet_content }}
        </div>
      </div>
      <cube-button>追号详情</cube-button>
      <div
        v-for="(item , index) in chaseOrderList"
        :key="index"
        class="itemStyle"
      >
        <div class="item-row-style">
          订单号：{{ item.order_no }}
        </div>
        <div class="item-row-style">
          期号：{{ item.issue_no }}
        </div>
        <div class="item-row-style">
          注数：{{ item.bet_count }}
        </div>
        <div class="item-row-style">
          倍数：{{ item.bet_multiple }}
        </div>
        <div class="item-row-style">
          投注金额：{{ item.bet_amount }}
        </div>
        <div class="item-row-style">
          开奖号码：{{ item.numbers }}
        </div>
        <div class="item-row-style">
          中奖注数：{{ item.award_content }}
        </div>
        <div class="item-row-style">
          奖金：{{ item.award_amount }}
        </div>
        <div class="item-row-style">
          订单状态：{{ item.order_status_text }}
        </div>
        <cube-button @click="cancelOrder(item.id, item.ts)">
          撤单
        </cube-button>
      </div>
    </div>
  </div>
</template>
<script>
import DateUtils from '@utils/date'
import LotteryUtils from '@utils/lottery-utils'
export default {
  filters: {
    timestampToDate (str) {
      return DateUtils.stampToDate(str)
    }
  },
  data () {
    return {
      chaseOrderDetail: {},
      chaseOrderList: []
    }
  },
  created () {
    this.getChaseRecordDetail()
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    getChaseRecordDetail () {
      const _data = {
        chase_plan_no: LotteryUtils.orderNo
      }
      this.$api.record.getChaseOrderDetail(_data).then(res => {
        const result = res.data
        this.chaseOrderDetail = result.data
        this.chaseOrderList = result.data.chase_plan_bet_order_list
      })
    },
    cancelOrder (id, ts) {
      this.$api.record.chaseDetailCancelOrder({ chase_detail_id: id, ts: ts }).then(res => {
        const result = res.data
        if (result.code === 200) {
          this.$toast.showText('撤单成功')
        } else {
          this.$toast.showText(result.msg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@styles/record_css.scss';
</style>
