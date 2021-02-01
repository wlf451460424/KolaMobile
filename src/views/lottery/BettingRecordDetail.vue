<template>
  <div>
    <app-header
      title="订单详情"
      @left-click="back"
    />
    <div class="divStyle">
      <div class="itemStyle">
        <div class="item-row-style">
          订单号：{{ betOrderDetail.order_no }}
        </div>
        <div class="item-row-style">
          投注模式：{{ betOrderDetail.currency_mode_text }}
        </div>
        <div class="item-row-style">
          赔率：{{ betOrderDetail.play_mode === 1 ? betOrderDetail.bet_rebate : betOrderDetail.odds }}
        </div>
        <div class="item-row-style">
          开奖号码：{{ betOrderDetail.open_number }}
        </div>
        <div class="item-row-style">
          时间：{{ betOrderDetail.bet_time | timestampToDate() }}
        </div>
        <div class="item-row-style">
          期号：{{ betOrderDetail.issue_no }}
        </div>
        <div class="item-row-style">
          彩种：{{ betOrderDetail.play_mode === 1 ? betOrderDetail.lottery_name : betOrderDetail.lottery_name }}
        </div>
        <div class="item-row-style">
          玩法：{{ betOrderDetail.play_mode === 1 ? betOrderDetail.play_name : '(信)' + betOrderDetail.play_name }}
        </div>
        <div class="item-row-style">
          投注金额：{{ betOrderDetail.bet_amount }}
        </div>
        <div class="item-row-style">
          注数：{{ betOrderDetail.bet_count }}
        </div>
        <div class="item-row-style">
          倍数：{{ betOrderDetail.bet_multiple }}
        </div>
        <div class="item-row-style">
          中奖注数：{{ betOrderDetail.winning_count }}
        </div>
        <div class="item-row-style">
          订单状态：{{ betOrderDetail.order_text }}
        </div>
        <div class="item-row-style">
          奖金：{{ betOrderDetail.player_bouns }}
        </div>
        <div class="item-row-style">
          投注号码：{{ betOrderDetail.bet_content }}
        </div>
      </div>
      <cube-button @click="cancelOrder">
        撤单
      </cube-button>
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
      betOrderDetail: {}
    }
  },
  created () {
    this.getBetRecordDetail()
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    getBetRecordDetail () {
      const _data = {
        order_no: LotteryUtils.orderNo
      }
      this.$api.record.getBetRecordDetail(_data).then(res => {
        this.betOrderDetail = res.data.data
      })
    },
    cancelOrder () {
      this.$api.record.betRecordCancelOrder({ order_no: LotteryUtils.orderNo }).then(res => {
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
