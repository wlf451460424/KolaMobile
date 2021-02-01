<template>
  <div class="footer">
    <p class="footer_top">
      <numeric-input
        v-model="multipleValue"
        :min="1"
        :max="9999"
        :step="1"
        size="140px"
      />
      <yuan-jiao-fen-li @modeChange="modeChanged" />
    </p>
    <div class="footer_middle">
      <div
        class="shoppingBasket"
        @click="addShoppingBasket"
      >
        添加投注
      </div>
      <div class="betting-info">
        {{ notes }}注，{{ totalMoney }}元
      </div>
      <div
        class="oneKeyBetting"
        @click="oneKeyBetting"
      >
        一键投注
      </div>
    </div>
    <div class="footer_bottom">
      若中奖，奖金{{ bonus }}元，可盈利{{ profit }}元
    </div>
  </div>
</template>

<script>
import Lottery from '@common/lottery-json'
import NumericInput from '@components/NumericInput'
import YuanJiaoFenLi from './YuanJiaoFenLi'
import LotteryUtils from '@utils/lottery-utils'
import MathUtils from '@utils/math-utils'
import calcLotteryNotes from '@common/notes'
import getBetContent from '@common/betContent'
import types from '@store/modules/mutation-types'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    NumericInput,
    YuanJiaoFenLi
  },
  props: {
    lotteryObj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      mode: [0, '元'], // 模式
      multipleValue: 1, // 倍数
      notes: 0, //  注数
      bonus: 0, //  奖金
      profit: 0, //  盈利
      isOptional: false,
      selectedVal: '',
      selectedText: '',
      options: '',
      currentIusse: ''
    }
  },
  computed: {
    modeValue () {
      return Math.pow(10, -this.mode[0])
    },
    totalMoney () {
      return MathUtils.multiply(MathUtils.multiply(this.notes, isNaN(this.multipleValue) ? 0 : this.multipleValue),
        MathUtils.multiply(this.modeValue, this.bet_single_amount))
    },
    ...mapState('lottery', {
      orderList: state => state.shoppingBasket,
      bet_single_amount: state => state.bet_single_amount,
      lottery_no: state => state.lottery_no,
      lottery_name: state => state.lottery_name,
      lottery_type: state => state.lottery_type
    })
  },
  watch: {
    lotteryObj (o) {
      this.selectedVal = o.selectedVal
      this.selectedText = o.selectedText
      this.options = o.options
      this.currentIusse = o.currentIusse
    }
  },
  mounted () {
    this.$bus.$on('calcNotes', this.calcNotes)
    this.$bus.$on('textareaRepeat', this.textareaRepeat)
    this.$bus.$on('textareaAssist', this.textareaAssist)
    this.$bus.$on('clearData', this.clearData)
  },
  beforeDestroy () {
    this.$bus.$off('calcNotes')
    this.$bus.$off('textareaRepeat')
    this.$bus.$off('textareaAssist')
    this.$bus.$off('clearData')
  },
  methods: {
    bettingHeaderParams (params) {
      this.selectedVal = params.selectedVal
      this.options = params.options
      this.selectedText = params.selectedText
      this.currentIusse = params.currentIusse
    },
    addShoppingBasket () {
      if (this.notes >= 1) {
        if (this.lottery_type === 2 && /^(4|7|11|14|34|35|36|37|38|39|40)$/.test(this.selectedVal.playId)) {
          if (this.notes === 1) {
            this.$toast.showText('胆拖玩法至少选择2注')
            return
          }
        }
        const soloMode = LotteryUtils.soloMode
        if (soloMode === 1) {
          const solo_count = LotteryUtils.soloCount
          const solo_amt = LotteryUtils.soloAmt
          const solo_maxAmt = LotteryUtils.soloMaxAmt
          if (solo_count !== 0 && solo_maxAmt !== 0) {
            if (solo_count >= this.notes) {
              this.$toast.showText('您所投注的内容属于单挑玩法，单挑最高奖金为' + solo_amt + ' 元')
            }
          } else if (solo_count !== 0 && solo_maxAmt === 0) {
            this.$toast.showText('您所投注的内容属于单挑玩法，单挑最高奖金为' + solo_amt + ' 元')
          }
        }
        this.addShoppingBaskets({
          lottery: Object.values(Lottery[this.lotteryObj.lotteryKindIndex])[0][this.lotteryObj.lotteryIndex],
          betContent: getBetContent(this.lotteryObj.lotteryKindIndex, this.selectedVal.playId),
          play: { playName: this.selectedText, playId: this.selectedVal.playId },
          mode: this.mode,
          notes: this.notes,
          multipleValue: this.multipleValue,
          totalMoney: this.totalMoney,
          keyId: new Date().getTime()
        })
      }
      if (this.orderList.length > 0) {
        this.$bus.$emit('initMainBettingLayout')
        this.$router.push({ name: 'CheckOutPage', params: { lotteryName: this.lotteryObj.lotteryName, lotteryMode: this.lotteryObj.lotteryMode } })
      } else {
        this.$toast.showText('至少选择一注')
      }
    },
    oneKeyBetting () {
      if (this.notes >= 1) {
        if (this.lottery_type === 2 && /^(4|7|11|14|34|35|36|37|38|39|40)$/.test(this.selectedVal.playId)) {
          if (this.notes === 1) {
            this.$toast.showText('胆拖玩法至少选择2注')
            return
          }
        }
        const _data = {
          lottery_no: this.lottery_no,
          issue_no: this.currentIusse,
          play_mode: 1
        }
        const _bet = []
        let bet_content = getBetContent(this.lotteryObj.lotteryKindIndex, this.selectedVal.playId).ballValues
        if (bet_content.indexOf('#') > -1 && this.lottery_type === 1) {
          bet_content = LotteryUtils.replaceLocation(bet_content)
        }
        _bet.push({
          bet_count: this.notes,
          bet_multiple: this.multipleValue,
          bet_amount: this.totalMoney,
          bet_content: bet_content,
          bet_rebate: LotteryUtils.getBetRebate(),
          play_code: this.selectedVal.playId,
          currency_mode: this.mode[0] + 1
        })
        _data.bet = _bet
        this.$api.lottery.bet(_data).then(res => {
          if (res.data.code === 200) {
            this.$toast.showText(`投注成功`)
          } else {
            this.$toast.showText(res.data.msg)
          }
        })
      } else {
        this.$toast.showText('至少选择一注')
      }
    },
    calcNotes () {
      this.notes = calcLotteryNotes(this.lotteryObj.lotteryKindIndex, this.lotteryObj.selectedVal.playId)
      LotteryUtils.calculateMoney(this)
      LotteryUtils.fixedPlayPrize(this.mode[0] + 1, LotteryUtils.getBetRebate())
    },
    modeChanged (mode) {
      this.mode = Object.values(mode)
      LotteryUtils.calculateMoney(this)
      LotteryUtils.fixedPlayPrize(this.mode[0] + 1, LotteryUtils.getBetRebate())
    },
    // 去重
    textareaRepeat (isOptional) {
      this.isOptional = isOptional
      LotteryUtils.textareaAssist(LotteryUtils, 1, this)
      LotteryUtils.fixedPlayPrize(this.mode[0] + 1, LotteryUtils.getBetRebate())
    },
    textareaAssist (isOptional) {
      this.isOptional = isOptional
      LotteryUtils.textareaAssist(LotteryUtils, 0, this)
      LotteryUtils.fixedPlayPrize(this.mode[0] + 1, LotteryUtils.getBetRebate())
    },
    ...mapMutations('lottery', {
      addShoppingBaskets: types.SHOPPING_BASKET_ADD
    }),
    clearData () {
      this.multipleValue = 1
      this.notes = 0
      this.bonus = 0
      this.profit = 0
      this.clearSelectedBalls()
    },
    ...mapMutations('lottery', {
      clearSelectedBalls: types.SELECTED_BALLS_CLEAR
    })
  }
}
</script>

<style lang="scss" scoped>
.footer {
    // height: 220px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    // z-index: 999;
    color: white;
    .footer_top{
      width: 100%;
      padding: 4px;
      background-color: white;
    }
    .footer_middle{
      background-color: $color-blue;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 80px;
      .shoppingBasket {
        width: 250px;
        height: 80px;
        font-size: 30px;
        display: grid;
        align-items: center;
        margin-left: 10px;
      }
      .betting-info {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 80px;
        font-size: 30px;
        color: white;
      }
      .oneKeyBetting {
        width: 250px;
        height: 80px;
        font-size: 30px;
        display: grid;
        align-items: center;
        margin-right: 10px;
        float: right;
      }
    }
    .footer_bottom {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      color: white;
      text-align: center;
      background-color: $color-blue;

    }
  }
</style>
