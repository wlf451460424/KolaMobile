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
              v-for="i in 10"
              :key="i"
            />
          </div>
        </cube-scroll>
      </div>
    </div>
    <div class="footer">
      <div class="footer_top">
        <div>共<span>{{ notes }}</span>注, <span>{{ money }}</span>元</div>
        <div class="footer_clean_btn">
          中奖停追
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
      lottery: this.$route.params,
      currentIndex: 0,
      notes: 0,
      money: 0
    }
  },
  computed: {
    title () {
      return this.lottery.lotteryName
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
      orderList: state => state.shoppingBasket
    })
  },
  created () {
    console.log(this.orderInfo[0].betContent.ballTexts)
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    chasingChange (index) {
      this.currentIndex = index
    },
    goChasing () {

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
