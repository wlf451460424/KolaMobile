<template>
  <div class="footer">
    <div class="footer_middle">
      <div
        class="clearSelectedBalls"
        @click="clearSelectedBalls"
      >
        清空
      </div>
      <div class="betting-info">
        <cube-input
          v-model="betMoney"
          placeholder="请输入金额"
          class="cube-text-style"
        />
      </div>
      <div
        class="betting"
        @click="betting"
      >
        添加投注
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import types from '@store/modules/mutation-types'
export default {
  props: {
    lotteryObj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      betMoney: ''
    }
  },
  computed: {
    ...mapState('lottery', {
      selectedBallsHandicap: state => state.selectedBallsHandicap,
      orderList: state => state.shoppingBasket
    })
  },
  mounted () {
    // this.$bus.$on('betting-header-params', this.bettingHeaderParams)
  },
  methods: {
    clearSelectedBalls () {
      this.betMoney = ''
      this.clearSelectedBalls()
    },
    // bettingHeaderParams (params) {
    //   this.selectedText = params.selectedText
    // },
    betting () {
      this.selectedBallsHandicap.map(item => {
        this.addShoppingBaskets({
          ballText: item.ballText,
          ballValue: item.ballValue,
          isActive: item.isActive,
          ballIndex: item.ballIndex,
          playCode: item.playCode,
          ballOdd: item.ballOdd,
          totalMoney: this.betMoney,
          notes: 1,
          rowLabel: item.rowLabel || this.lotteryObj.selectedText.playName
        })
      })
      if (this.orderList.length > 0) {
        // this.$bus.$emit('initMainBettingLayout')
        this.betMoney = ''
        this.$router.push({ name: 'CheckOutPage', params: { lotteryName: this.lotteryObj.lotteryName, lotteryMode: this.lotteryObj.lotteryMode } })
      } else {
        this.$toast.showText('至少选择一注')
      }
    },
    ...mapMutations('lottery', {
      addShoppingBaskets: types.SHOPPING_BASKET_ADD,
      clearSelectedBalls: types.SELECTED_BALLS_CLEAR
    })
  }
}
</script>

<style lang="scss" scoped>
.footer {
    height: 90px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    color: white;
    .footer_middle{
      background-color: $color-blue;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 90px;
      .clearSelectedBalls {
        width: 250px;
        height: 90px;
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
        height: 90px;
        font-size: 30px;
        color: white;
        .cube-text-style {
          height: 60px;
          margin: 0 10px;
          line-height: 60px;
          ::v-deep .cube-textarea {
            line-height: 100%;
          }
        }
      }
      .betting {
        width: 250px;
        height: 90px;
        font-size: 30px;
        display: grid;
        align-items: center;
        margin-right: 10px;
        float: right;
      }
    }
  }
  ::v-deep .cube-input::after{
    border-color: rgb(255, 255, 255) transparent transparent transparent;
  }
  ::v-deep .cube-input{
    line-height: none;
  }
  ::v-deep .cube-input-field{
     line-height: normal;
  }
</style>
