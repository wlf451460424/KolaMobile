<template>
  <div class="betting">
    <app-header-lottery
      :title="title"
      @left-click="back"
    >
      <template v-slot:right>
        <a ref="iconRight">
          <i
            class="cubeic-more"
            @click="openDropMenu"
          />
        </a>
      </template>
    </app-header-lottery>

    <div class="betting-container">
      <main-betting-header />
      <div
        class="content"
        :class="{aa:lotteryMode}"
      >
        <cube-scroll
          ref="scroll"
          :data="bettingData"
        >
          <main-betting-layout
            ref="mainBettingLayout"
            :options="options"
          />
        </cube-scroll>
      </div>
      <main-betting-footer
        v-if="lotteryMode === 0"
        ref="mainBettingFooter"
        :lottery-obj="lotteryObj"
      />
      <main-betting-handicap-footer
        v-else
        ref="MainBettingHandicapFooter"
        :lottery-obj="lotteryObj"
      />
    </div>
  </div>
</template>
<script>
import MainBettingHeader from './MainBettingHeader'
import MainBettingLayout from './MainBettingLayout'
import MainBettingFooter from './MainBettingFooter'
import MainBettingHandicapFooter from './MainBettingHandicapFooter'
import { mapState } from 'vuex'
export default {
  name: 'Betting',
  components: {
    MainBettingHeader,
    MainBettingLayout,
    MainBettingFooter,
    MainBettingHandicapFooter
  },
  data () {
    return {
      bettingData: this.selectedValue,
      data: [],
      options: { kindIndex: this.$route.params.lottery_kind, playId: Number(this.$route.params.lottery_kind) === 0 ? 3 : 1 },
      selectedVal: { play: 0, playId: 1 },
      playExplain: '',
      lotteryMode: 0,
      selectedText: ''
    }
  },
  computed: {
    title () {
      return this.lottery_name
    },
    lotteryObj () {
      return {
        lotteryIndex: this.lotteryIndex,
        lotteryKindIndex: this.lotteryKindIndex,
        selectedVal: this.selectedVal,
        lotteryName: this.lottery_name,
        lotteryMode: this.lotteryMode,
        selectedText: this.selectedText,
        currentIusse: this.currentIusse,
        options: this.options
      }
    },
    lotteryIndex () {
      return this.$route.params.lottery_index // 彩种json下标
    },
    lotteryKindIndex () {
      return this.$route.params.lottery_kind // 彩种种类json下标
    },
    ...mapState('lottery', {
      orderList: state => state.shoppingBasket,
      bet_single_amount: state => state.bet_single_amount,
      lottery_no: state => state.lottery_no,
      lottery_name: state => state.lottery_name,
      lottery_type: state => state.lottery_type
    })
  },

  // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted () {
    this.Popover = new this.$popup.Popover({
      refDom: this.$refs.iconRight,
      refCorner: 'bottom right',
      relativeToCorner: 'below before',
      propsData: {
        items: [
          {
            name: '投注记录',
            click: e => console.log('btn0 clicked'),
            src: 'https://gw.alipayobjects.com/zos/rmsportal/tOtXhkIWzwotgGSeptou.svg'
          }, {
            name: '走势图',
            click: e => this.Popover.close(e),
            src: 'https://gw.alipayobjects.com/zos/rmsportal/PKAgAqZWJVNwKsAJSmXd.svg'
          }, {
            name: '玩法帮助',
            click: e => this.Popover.close(e),
            src: 'https://gw.alipayobjects.com/zos/rmsportal/uQIYTFeRrjPELImDRrPt.svg'
          }
        ]
      }
    })
    this.$bus.$on('betting-header-params', this.bettingHeaderParams)
    this.$bus.$on('lottery-beting-mode', this.lotteryBettingMode)
  },
  beforeDestroy () {
    this.$bus.$off('betting-header-params')
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    openDropMenu () {
      this.Popover.open()
    },
    bettingHeaderParams (params) {
      this.options = params.options
      this.selectedVal = params.selectedVal
      this.currentIusse = params.currentIusse
      this.selectedText = params.selectedText
    },
    lotteryBettingMode (lotteryMode) {
      this.lotteryMode = lotteryMode
      if (Number(this.$route.params.lottery_kind) === 0) {
        if (lotteryMode === 0) {
          this.options.playId = 3
        } else {
          this.options.playId = 1
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.betting{
  display: flex;
  flex-direction: column;
  .betting-container {
    position: fixed;
    top: 88px;
    left: 0;
    bottom: 0;
    width: 100%;
    align-items: center;
    background-color: #F9F9F9;
    ::v-deep .cube-btn {
      background-color:  #F9F9F9;
      color: #666666;
    }
    ::v-deep .cube-drawer-item {
      text-align: left;
    }
    .content{
      height: calc(63vh);
      margin-top: 10px;
      select{
        width: 100%;
      }
    }
  }
}
.aa{
  height: calc(72vh) !important;
}
</style>
