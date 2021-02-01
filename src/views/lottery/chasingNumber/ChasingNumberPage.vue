<template>
  <div class="ChasingNumberPage">
    <app-header
      :title="title"
      @left-click="back"
    />
    <div class="chasing_container">
      <chasing-number-type @chasing-change="chasingChange" />
      <component :is="currentChasingNumber" />
      <div class="issue_list">
        <cube-scroll>
          <div>
            <div class="issue_list_header">
              <span class="p_1">序号</span><span class="p_2">期号</span><span class="p_3">倍数</span><span class="p_4">追号金额</span>
            </div>
            <issue-list-item
              v-for="(item, i) in issue_list"
              :key="i"
              :item="item"
            />
          </div>
        </cube-scroll>
      </div>
    </div>
    <div class="footer">
      <div class="footer_top">
        <div>共<span>{{ notes }}</span>注, <span>{{ moneyTotle }}</span>元</div>
        <div
          class="footer_clean_btn"
          @click="checkClick"
        >
          <input
            ref="checks"
            type="checkbox"
            :checked="stopAdd"
          >
          <span>中奖停追</span>
        </div>
      </div>
      <cube-button @click="goChasing">
        立即追号
      </cube-button>
    </div>
  </div>
</template>
<script>
import ChasingNumberType from '@views/lottery/chasingNumber/ChasingNumberType'
import IssueListItem from '@views/lottery/chasingNumber/IssueListItem'
import { mapState } from 'vuex'
import MathUtils from '@utils/math-utils'
import LotteryUtils from '@utils/lottery-utils'
import Toast from '@common/toast'
import DialogUtils from '@common/dialog'
export default {
  components: {
    ChasingNumberType,
    IssueListItem,
    'same-multiple-value': () => import('@views/lottery/chasingNumber/SameMultipleValue'),
    'double-multiple-value': () => import('@views/lottery/chasingNumber/DoubleMultipleValue'),
    'profit-margin': () => import('@views/lottery/chasingNumber/ProfitMargin')
  },
  data () {
    return {
      vueObj: this.$route.params,
      currentIndex: 0,
      issue_list: [],
      addIssue: 10, // 追号期数
      moneyTotle: 0,
      addMultiple: 1, // 起始倍数
      intervalIssues: 1, // 隔期
      intervalMultiple: 2, // 隔期倍数
      minProfit: 50, // 利润率
      chase_bet: {},
      stopAdd: true
    }
  },
  computed: {
    notes () {
      return this.vueObj.notes
    },
    money () {
      return this.vueObj.money
    },
    currentChasingNumber () {
      let chasingType = {
        '0': () => import('@views/lottery/chasingNumber/SameMultipleValue'),
        '1': () => import('@views/lottery/chasingNumber/DoubleMultipleValue'),
        '2': () => import('@views/lottery/chasingNumber/ProfitMargin')
      }
      return chasingType[this.currentIndex]
    },
    ...mapState('lottery', {
      orderList: state => state.shoppingBasket,
      lottery_no: state => state.lottery_no,
      title: state => state.lottery_name,
      lottery_type: state => state.lottery_type
    })
  },
  created () {
    this.produceIusse()
  },
  mounted () {
    this.$bus.$on('produceIusse', this.produceIusse)
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    checkClick () {
      this.stopAdd = this.$refs.checks.checked
    },
    initParam () {
      this.issue_list = []
      this.addIssue = 10
      this.moneyTotle = 0
      this.addMultiple = 1
      this.intervalIssues = 1
      this.intervalMultiple = 2
      this.minProfit = 50
      this.stopAdd = true
    },
    chasingChange (index) {
      this.currentIndex = index
      this.produceIusse()
    },
    getTotal () {
      let tMoney = 0
      if (this.issue_list.length > 0) {
        this.issue_list.forEach(d => {
          tMoney = MathUtils.fomatFloat(MathUtils.add(tMoney, MathUtils.multiply(d.bet_money, d.bet_multiple)), 3)
        })
        this.moneyTotle = Number(tMoney)
      }
    },
    getDoubleMultiple (index) {
      const issueCount = Number(this.intervalIssues)
      const multipleNum = Number(this.intervalMultiple)
      const addMultiple = Number(this.addMultiple)
      const num = parseInt((index + issueCount) / issueCount) - 1
      return MathUtils.multiply(Math.pow(multipleNum, num), addMultiple)
    },
    produceIusse (vueObj) {
      this.initParam()
      if (vueObj) {
        this.addIssue = vueObj.issues
        this.addMultiple = vueObj.addMultiple
        if (this.currentIndex === 1) {
          this.intervalIssues = vueObj.intervalIssues
          this.intervalMultiple = vueObj.intervalMultiple
        } else if (this.currentIndex === 2) {
          this.minProfit = vueObj.minProfit
        }
      }
      this.issue_list = []
      const chaseArr = []
      const _data = {
        lottery_no: this.lottery_no,
        count: this.addIssue
      }
      // this.$store.dispatch('getChaseIssue', _data)
      this.$api.lottery.getChaseIssue(_data).then(result => {
        const issArr = result.data.data
        var beforeTotal = 0
        if (this.currentIndex === 2) {
          issArr.forEach((d, i) => {
            var multipleNum = 0
            if (i) {
              multipleNum = LotteryUtils.getMultiple(this.minProfit, beforeTotal, LotteryUtils.playPrize, this.getBetTotalMoney())
              if (multipleNum < this.addMultiple) {
                multipleNum = this.addMultiple
              }
            } else {
              multipleNum = this.addMultiple
            }
            beforeTotal = MathUtils.add(beforeTotal, MathUtils.multiply(multipleNum, this.getBetTotalMoney()))
            const expectMoney = LotteryUtils.getExpectMoney(LotteryUtils.playPrize, multipleNum, beforeTotal)
            const yieldRate = LotteryUtils.getYieldRate(expectMoney, beforeTotal)
            if ((MathUtils.minus(yieldRate, this.minProfit) >= 0) && (MathUtils.minus(LotteryUtils.maxBetMultiple, multipleNum) >= 0)) {
              chaseArr.push({
                id: i + 1,
                issue: d.issue_no,
                bet_multiple: multipleNum,
                bet_money: this.getBetTotalMoney()
              })
            } else if (MathUtils.minus(yieldRate, this.minProfit) < 0 && i === 0) {
              return Toast.showText(`您设置的利润率过高，无法达到您的预期目标值，请重新修改参数设置`)
            }
          })
        } else {
          issArr.forEach((d, i) => {
            chaseArr.push({
              id: i + 1,
              issue: d.issue_no,
              bet_multiple: this.currentIndex === 0 ? this.addMultiple : this.getDoubleMultiple(i),
              bet_money: this.getBetTotalMoney()
            })
          })
        }
        this.issue_list = chaseArr
        this.getTotal()
      })
    },
    getBetTotalMoney () {
      return MathUtils.multiply(this.money, this.addMultiple)
    },
    goChasing () {
      if (this.issue_list.length > 0) {
        this.chase_bet.issue_list = this.issue_list
        this.chase_bet.stop_mode = this.stopAdd ? 2 : 1
        this.goBetting()
      } else {
        Toast.showText('请选择要追号的期号')
      }
    },
    goBetting () {
      const singleMode = LotteryUtils.singleMode
      const singleQuota = LotteryUtils.singleQuota
      var param = '{ "lottery_no":' + this.lottery_no + ' }'
      this.$api.lottery.getIssue(param).then(res => {
        this.currentIusse = res.data.data.issue_no
        if (this.currentIusse !== '') {
          if (singleMode === 1) { // 单期风险控制提醒
            DialogUtils.showText('该彩种单期最高奖金' + singleQuota + '元，请确认', this.produceBettingContent)
          } else {
            this.produceBettingContent()
          }
        }
      })
    },
    produceBettingContent () {
      const paramList = LotteryUtils.getBetParams(0)
      const _data = {
        lottery_no: Number(this.lottery_no),
        issue_no: this.currentIusse,
        play_mode: 1
      }
      _data.bet = paramList
      _data.chase_bet = this.chase_bet
      this.$api.lottery.bet(_data).then(res => {
        if (res.data.code === 200) {
          DialogUtils.showText('追号成功', this.back, this.goRecord, '继续投注', '查看记录')
        } else {
          this.$toast.showText(res.data.msg)
        }
      })
    },
    goRecord () {
      this.$router.push({ name: 'ChaseRecordPage' })
    }
  }
}
</script>
<style lang="scss" scoped>
.ChasingNumberPage{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .chasing_container{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    padding: 30px;
    .issue_list {
      margin-top: 20px;
      border-color: $color-gray;
      border-radius: 8px;
      border-style: solid;
      border-width: 1px;
      height: calc(45vh);
      background-color: white;
      .issue_list_header {
        display: flex;
        justify-content: space-between;
        padding: 4px 30px;
        margin-top: 20px;
        .p_1{
          width: 10%;
        }
        .p_2{
          width: 40%;
        }
        .p_3{
          width: 20%;
        }
        .p_4{
          width: 30%;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .footer_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 66px;
      line-height: 66px;
      background-color: white;
      border-top-color: $color-light-gray;
      border-top-width: 2px;
      border-top-style: solid;
      padding-left: 40px;
      padding-right: 40px;
      font-size: 24px;
      span {
        color: $color-light-red;
      }
      .footer_clean_btn {
        background-color: $color-light-gray;
        width: 25vw;
        height: 42px;
        line-height: 42px;
        border-radius: 50px;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

</style>
