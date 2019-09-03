<template>
  <div class="checkoutPage">
    <app-header
      :title="title"
      @left-click="back"
    />
    <div class="content">
      <div class="content_btn">
        <a @click="manualSelect"><img src="@assets/checkoutpage_shoudong.png">手动选号</a>
        <a @click="autoSelect"><img src="@assets/checkoutpage_zhuihao.png">自动选号</a>
        <a @click="addChasingNumber"><img src="@assets/checkoutpage_zhuihao.png">添加追号</a>
      </div>
      <div class="contentInfo">
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
import types from '@store/modules/mutation-types'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    CheckoutPageListItem
  },
  data () {
    return {
      lottery: this.$route.params,
      currentIusse: ''
    }
  },
  computed: {
    title () {
      return this.lottery.lotteryName
    },
    notes () {
      return this.orderList.map(item => {
        return item.notes
      }).reduce((prev, cur) => {
        return MathUtils.add(prev, cur)
      }, 0)
    },
    money () {
      return this.orderList.map(item => {
        return item.totalMoney
      }).reduce((prev, cur) => {
        return MathUtils.add(prev, cur)
      }, 0)
    },
    ...mapState('lottery', {
      orderList: state => state.shoppingBasket
    })
  },
  created () {
    console.log(this.orderList[0].betContent.ballTexts)
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    deleteItem (val) {
      this.deleteOrder(val)
    },
    manualSelect () {
      this.$router.go(-1)
    },
    autoSelect () {
    },
    addChasingNumber () {
      this.$router.push({ name: 'ChasingNumberPage', params: this.lottery })
    },
    goBetting () {
      // 获取当前期号
      var param = '{ "lottery_no":' + this.lottery.lotteryId + ' }'
      this.$api.lottery.getIssue(param).then(res => {
        console.log(res.data.data)
        this.currentIusse = res.data.data.issue_no
      })
      if (this.currentIusse === '') {
        return
      }
      this.produceBettingContent()
    },
    produceBettingContent () {
      var currentIusse = ''
      var param = '{ "lottery_no":' + this.lottery.lotteryId + ' }'
      this.$api.lottery.getIssue(param).then(res => {
        console.log(res.data.data)
        currentIusse = res.data.data.issue_no
        if (currentIusse === '') {
          return this.toast.showText('获取期号失败')
        }
      })
      // 装载投注内容
      var paramList = []
      this.orderList.map(
        item => {
          var checkoutParam = {
            toString: function () {
              return JSON.stringify(this)
            }
          }
          checkoutParam.bet_mode = item.mode[0]
          checkoutParam.bet_count = item.notes
          checkoutParam.bet_multiple = item.multipleValue
          checkoutParam.bet_amount = item.totalMoney
          checkoutParam.bet_content = item.betContent.ballValues
          // 暂时没有返回  写死
          checkoutParam.bet_rebate = '1980'
          checkoutParam.play_code = item.play.playId
          // checkoutParam.PlayName = item.play.playName.play + '_' + item.play.playName.playName
          paramList.push(checkoutParam)
        }
      )
      var params = '{"lottery_no":' + this.lottery.lotteryId + ',"issue_no":"' + this.currentIusse + '","bet":[' + paramList.join(',') + '],"issue_list":[]}'
      console.log(params)
      this.$toast.showText(`接口未实现`)
      // this.$api.lottery.bet(params).then(res => {
      //   console.log(res.data.data)
      //   this.save(res.data.data)
      //   // this.$router.push('/')
      //   this.$toast.showText(`投注成功`)
      // })
    },
    clearShoppingBasket () {
      this.deleteAllOrders()
    },
    ...mapMutations('lottery', {
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
</style>
