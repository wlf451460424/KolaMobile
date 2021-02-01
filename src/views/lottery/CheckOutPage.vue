<template>
  <div class="checkoutPage">
    <app-header
      :title="title"
      @left-click="back"
    />
    <div class="content">
      <div
        class="content_btn"
      >
        <a @click="manualSelect"><img src="@assets/checkoutpage_shoudong.png">手动选号</a>
        <a
          v-if="lotteryMode === 0"
          @click="addChasingNumber"
        ><img src="@assets/checkoutpage_zhuihao.png">添加追号</a>

        <div
          v-if="lotteryMode === 1"
          style="display:flex;flex-direction: row;background: #ffffff;align-items: center;padding:6px 10px"
        >
          <cube-input
            v-model="quickMoney"
            type="number"
            placeholder="请输入金额"
            class="cube-text-style"
          />
          <div
            class="divStyle"
            @click="quickMoneySelect"
          >
            <span style="height:100%;display:flex;align-items: center;">确定</span>
          </div>
        </div>
      </div>
      <div
        class="contentInfo"
        :class="{aa:lotteryMode}"
      >
        <cube-scroll
          :data="orderList"
        >
          <ul>
            <li
              v-for="(order, index) in orderList"
              :key="order.keyId"
            >
              <CheckoutPageListItem
                :index="index"
                :item="order"
                :lottery-mode="lotteryMode"
                @changeOrderMoney="changeMoney"
                @orderDelete="deleteItem"
              />
            </li>
          </ul>
        </cube-scroll>
      </div>
    </div>
    <div class="footer">
      <div class="footer_top">
        <div>共<span>{{ notes }}</span>注, <span>{{ money }}</span>元</div>
        <div
          class="footer_clean_btn"
          @click="clearShoppingBasket"
        >
          清空
        </div>
      </div>
      <cube-button @click="goBetting">
        立即投注
      </cube-button>
    </div>
  </div>
</template>
<script>
import CheckoutPageListItem from './CheckoutPageListItem'
import MathUtils from '@utils/math-utils'
import LotteryUtils from '@utils/lottery-utils'
import types from '@store/modules/mutation-types'
import { mapState, mapMutations } from 'vuex'
import DialogUtils from '@common/dialog'
export default {
  components: {
    CheckoutPageListItem
  },
  data () {
    return {
      lottery: this.$route.params,
      currentIusse: '',
      title: this.$route.params.lotteryMode === 0 ? this.$route.params.lotteryName : this.$route.params.lotteryName + '(信)',
      lotteryMode: this.$route.params.lotteryMode,
      money: 0,
      quickMoney: ''
    }
  },
  computed: {
    notes () {
      return this.orderList.map(item => {
        return item.notes
      }).reduce((prev, cur) => {
        return MathUtils.add(prev, cur)
      }, 0)
    },
    // money () {
    //   return this.orderList.map(item => {
    //     return item.totalMoney === '' ? 0 : item.totalMoney
    //   }).reduce((prev, cur) => {
    //     return MathUtils.add(prev, cur)
    //   }, 0)
    // },
    ...mapState('lottery', {
      orderList: state => state.shoppingBasket,
      lottery_type: state => state.lottery_type,
      lottery_no: state => state.lottery_no
    })
  },
  mounted () {
    this.getMoney()
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    changeMoney (o) {
      this.shoppingBasketAdd({
        ballText: o.itemObj.ballText,
        ballValue: o.itemObj.ballValue,
        isActive: o.itemObj.isActive,
        ballIndex: o.itemObj.ballIndex,
        playCode: o.itemObj.playCode,
        ballOdd: o.itemObj.ballOdd,
        totalMoney: o.betMoney,
        notes: 1,
        rowLabel: o.itemObj.rowLabel
      })
      this.getMoney()
    },
    quickMoneySelect () {
      this.orderList.map(item => {
        this.shoppingBasketAdd({
          ballText: item.ballText,
          ballValue: item.ballValue,
          isActive: item.isActive,
          ballIndex: item.ballIndex,
          playCode: item.playCode,
          ballOdd: item.ballOdd,
          totalMoney: this.quickMoney,
          notes: 1,
          rowLabel: item.rowLabel
        })
      })
      this.getMoney()
    },
    deleteItem (val) {
      this.deleteOrder(val)
      this.getMoney()
    },
    manualSelect () {
      this.$router.go(-1)
    },
    autoSelect () {
    },
    addChasingNumber () {
      this.$router.push({ name: 'ChasingNumberPage', params: this })
    },
    goBetting () {
      if (this.orderList.length > 0) {
        let flag = true
        this.orderList.some(item => {
          if (!item.totalMoney) {
            flag = false
            return true
          }
        })
        if (!flag) {
          this.$toast.showText('投注金额不能为空')
          return false
        }
        const singleMode = LotteryUtils.singleMode
        const singleQuota = LotteryUtils.singleQuota
        // 获取当前期号
        var param = '{ "lottery_no":' + this.lottery_no + ' }'
        this.$api.lottery.getIssue(param).then(res => {
          this.currentIusse = res.data.data.issue_no
          if (this.currentIusse !== '') {
            if (this.lotteryMode === 0) {
              if (singleMode === 1) { // 单期风险控制提醒
                DialogUtils.showText('该彩种单期最高奖金' + singleQuota + '元，请确认', this.produceBettingContent)
              } else {
                this.produceBettingContent()
              }
            } else {
              this.produceBettingContent()
            }
          }
        })
      } else {
        this.$toast.showText('投注信息不能为空')
      }
    },
    produceBettingContent () {
      const paramList = LotteryUtils.getBetParams(this.lotteryMode)
      const _data = {
        lottery_no: Number(this.lottery_no),
        issue_no: this.currentIusse,
        play_mode: this.lotteryMode === 0 ? 1 : 2
      }
      _data.bet = paramList
      this.$api.lottery.bet(_data).then(res => {
        if (res.data.code === 200) {
          this.clearShoppingBasket()
          DialogUtils.showText('投注成功', this.back, this.goRecord, '继续投注', '查看记录')
        } else {
          this.$toast.showText(res.data.msg)
        }
      })
    },
    goRecord () {
      this.$router.push({ name: 'BettingRecord' })
    },
    getMoney () {
      this.money = this.orderList.map(item => {
        return item.totalMoney === '' ? 0 : item.totalMoney
      }).reduce((prev, cur) => {
        return MathUtils.add(prev, cur)
      }, 0)
    },
    clearShoppingBasket () {
      this.money = 0
      this.quickMoney = ''
      this.deleteAllOrders()
    },
    ...mapMutations('lottery', {
      shoppingBasketAdd: types.SHOPPING_BASKET_ADD,
      deleteOrder: types.ORDER_DELETE,
      deleteAllOrders: types.DELETE_ALL_ORDERS
    })
  }
}
</script>
<style lang="scss" scoped>
.checkoutPage{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: $color-light-gray;
  .content{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    .contentInfo{
      height: calc(72vh);
      padding-top: 16px;
      background-color: white;
    }
    .content_btn{
      width: 100%;
      a{
        width: 30%;
        height: 70px;
        line-height: 70px;
        display: inline-block;
        margin: 10px;
        border-radius: 10px;
        color:#ffffff;
        background-color: $color-light-green;
        line-height: 70px;
        img{
          width: 32px;
          height: 32px;
          margin: 10px 10px -10px 0;
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
        width: 126px;
        height: 42px;
        line-height: 42px;
        border-radius: 50px;
        color: #666;
      }
    }
  }
}
::v-deep .cube-input{
  line-height: 1;
  height: 8vw;
  width: 100%;
}
::v-deep .cube-input::after{
  // border-color: rgb(255, 255, 255) transparent transparent transparent;
  // border-color: rgba($color: #000000, $alpha: 0.3)
  border: 4px solid #DCDCDC;
}
::v-deep .cube-input-field{
    line-height: normal;
    padding: 2vw;
}

.divStyle{
  display: flex;
  width: 26vw;
  height: 9vw;
  background: #5095fd;
  border-radius: 5px;
  color: #ffffff;
  margin-left: 20px;
  justify-content: center;
}
.aa{
  height: calc(65vh) !important;
}
</style>
