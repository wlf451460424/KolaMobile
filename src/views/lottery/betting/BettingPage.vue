<template>
  <div class="betting">
    <app-header
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
    </app-header>
    <div class="betting-container">
      <div class="titleInfo">
        <cube-button
          class="cube-button-playSelect"
          icon="cubeic-pulldown"
          @click="showPopUp"
        >
          {{ playText }}
        </cube-button>
        <cube-button
          class="cube-button-result"
          @click="showResultList"
        >
          <span>最新开奖&nbsp;&nbsp;</span>
          <span class="result_show">
            <ul>
              <li
                v-for="i in 5"
                :key="i"
              >
                <span>{{ i }}</span>
              </li>
            </ul>
          </span>
        </cube-button>
      </div>
      <cube-drawer
        ref="drawer"
        title="玩法选择"
        :data="data"
        :selected-index="selectedIndex"
        @change="changeHandler"
        @select="selectHandler"
        @cancel="cancelHandler"
      />
      <div
        v-if="isShow"
        ref="result_div"
        class="result_div"
        :class="{active_result_div:isShow}"
      >
        <div class="result_head">
          <div class="result_ico">
            <img src="@assets/ic_lottery/lottery_1@2x.png">
          </div>
          <div class="result_title">
            <p class="p_title">
              <span class="p_title_name">重庆时时彩&nbsp;&nbsp;</span>第<span class="p_title_iusse">{{ items[0].iusse }}</span>期&nbsp;&nbsp;开奖结果
            </p>
            <p class="p_ball">
              <ul>
                <li
                  v-for="(item, index) in items[0].result.split(' ')"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </li>
              </ul>
            </p>
          </div>
        </div>
        <div class="result_list_div">
          <ul>
            <li
              v-for="(item, index) in items"
              :key="index"
            >
              <span class="iusse">{{ item.iusse }}</span>
              <span class="result">
                <ul>
                  <li
                    v-for="(it, i) in item.result.split(' ')"
                    :key="i"
                  >
                    <span>{{ it }}</span>
                  </li>
                </ul>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="iusse_time_money">
        <p><span class="p_1">{{ currentIusse }}</span>期&nbsp;&nbsp;截止时间：<span class="p_2">{{ currentTime }}</span>&nbsp;&nbsp;余额：<span class="p_3">{{ currentMoney }}</span>元</p>
        <span class="p_4"><img
          src="@assets/wen.png"
          @click="shuomingHandler"
        ></span>
      </div>
      <div class="content">
        <cube-scroll
          ref="scroll"
          :data="bettingData"
        >
          <main-betting-layout
            ref="mainBettingLayout"
            :options="options"
          />
        </cube-scroll>
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
      </div>
    </div>
  </div>
</template>
<script>
import Toast from '@common/toast'
import Lottery from '@common/lottery-json'
// import Play from '@common/play-json'
import MainBettingLayout from './MainBettingLayout'
import NumericInput from '@components/NumericInput'
import YuanJiaoFenLi from './YuanJiaoFenLi'
import calcLotteryNotes from '@common/notes'
import getBetContent from '@common/betContent'
import MathUtils from '@utils/math-utils'
import types from '@store/modules/mutation-types'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Betting',
  components: {
    MainBettingLayout,
    NumericInput,
    YuanJiaoFenLi
  },
  data () {
    return {
      timerId: '',
      currentLotterySalePlayInfo: [],
      currentLotterySalePlayIdArray: [],
      currentMoney: '',
      currentIusse: '',
      currentTime: '',
      isShow: false,
      items: [
        { iusse: '201908007000', result: '1 2 3 4 5' },
        { iusse: '201908007001', result: '1 2 3 4 5' },
        { iusse: '201908007002', result: '1 2 3 4 5' },
        { iusse: '201908007003', result: '1 2 3 4 5' },
        { iusse: '201908007004', result: '1 2 3 4 5' },
        { iusse: '201908007005', result: '1 2 3 4 5' },
        { iusse: '201908007006', result: '1 2 3 4 5' },
        { iusse: '201908007007', result: '1 2 3 4 5' },
        { iusse: '201908007008', result: '1 2 3 4 5' },
        { iusse: '201908007009', result: '1 2 3 4 5' }
      ],
      lotteryIndex: this.$route.params.lottery_index, // 彩种json下标
      lotteryKindIndex: this.$route.params.lottery_kind, // 彩种种类json下标
      playText: '选择玩法',
      selectedIndex: [0, 0], //  默认选中玩法索引
      selectedVal: { play: 0, playId: 1 }, // 默认选中玩法
      selectedValue: 0,
      bettingData: this.selectedValue,
      selectedText: { play: '五星', playName: '通选单式' },
      data: [
        this.getPlay(),
        this.getPlayName(0)
      ],
      options: { kindIndex: this.$route.params.lottery_kind, playId: 1 },
      mode: [0, '元'], // 模式
      multipleValue: 1, // 倍数
      notes: 0, //  注数
      bonus: 0, //  奖金
      profit: 0 //  盈利
    }
  },
  computed: {
    modeValue () {
      return Math.pow(10, -this.mode[0])
    },
    totalMoney () {
      return MathUtils.multiply(MathUtils.multiply(this.notes, isNaN(this.multipleValue) ? 0 : this.multipleValue), MathUtils.multiply(this.modeValue, 2))
    },
    title () {
      return Object.values(Lottery[this.lotteryKindIndex])[0][this.lotteryIndex].lotteryName
    },
    ...mapState('lottery', {
      orderList: state => state.shoppingBasket
    })
  },
  // 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  created: function () {
    // 获取开启玩法
    this.getLotterySalePlay()
  },
  // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted () {
    // 获取当前期号 时间
    this.getCurrentIssueTime()
    // 获取当前余额
    this.getCurrentMoney()

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
    this.$bus.$on('calcNotes', this.calcNotes)
  },
  beforeDestroy () {
    this.$bus.$off('calcNotes')
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    // 获取开启玩法
    getLotterySalePlay () {
      var params = '{ "lottery_no":' + Object.values(Lottery[this.lotteryKindIndex])[0][this.lotteryIndex].lotteryId + ' }'
      this.$api.lottery.getLotterySalePlay(params).then(res => {
        console.log(res.data.data)
        this.currentLotterySalePlayInfo = []
        this.currentLotterySalePlayIdArray = []
        this.currentLotterySalePlayInfo = res.data.data
        this.currentLotterySalePlayInfo.map((item, index) => {
          this.currentLotterySalePlayIdArray.push(item.play_code)
        })
        Toast.showText(`获取开启玩法·成功`)
      })
    },
    // 获取当前余额
    getCurrentMoney () {
      this.$api.lottery.getMoney().then(res => {
        console.log(res.data.data)
        this.currentMoney = res.data.data.available_balance
        Toast.showText(`获取余额·成功`)
      })
    },
    // 获取当前期号
    getCurrentIssueTime () {
      var params = '{ "lottery_no":' + Object.values(Lottery[this.lotteryKindIndex])[0][this.lotteryIndex].lotteryId + ' }'
      this.$api.lottery.getIssue(params).then(res => {
        console.log(res.data.data)
        this.currentIusse = res.data.data.issue_no
        if (this.timerId != null) {
          clearInterval(this.timerId)
        }
        // 判断倒计时 为0或小于0 的临界点
        if (Number(res.data.data.ss) > 0) {
          this.startTimer(res.data.data.ss)
        } else {
          this.getCurrentIssueTime()
        }
      })
    },
    // 倒计时
    startTimer (remainTime) {
      this.timerId = setInterval(() => {
        var countTime = remainTime--
        var h = Math.floor(countTime / 3600)
        var m = Math.floor(((countTime - h * 3600)) / 60)
        var s = Math.floor(countTime - h * 3600 - m * 60)
        h = (h > 9 ? h : '0' + h)
        m = (m > 9 ? m : '0' + m)
        s = (s > 9 ? s : '0' + s)
        this.currentTime = h + ':' + m + ':' + s
        if (countTime === 0) {
          clearInterval(this.timerId)
          this.getCurrentIssueTime()
        }
      }, 1000)
    },
    getPlay () {
      let playList = Lottery[0]['play']
      let temp = []
      playList.map((item, index) => {
        temp.push({ text: item['kind'], value: index })
      })
      return temp
    },
    getPlayName (playIndex) {
      let play = Lottery[0]['play'][playIndex]
      let temp = []
      play['data'].map((item, index) => {
        temp.push({ text: item['playName'], value: item['playId'] })
      })
      return temp
    },
    openDropMenu () {
      this.Popover.open()
    },
    showPopUp () {
      this.$refs.drawer.show()
    },
    changeHandler (index, item, selectedVal, selectedIndex, selectedText) {
      setTimeout(() => {
        let data
        if (index === 0) {
          let play = Lottery[0]['play'][item.value]
          let temp = []
          play['data'].map((item, index) => {
            temp.push({ text: item['playName'], value: item['playId'] })
          })
          data = temp
        }
        // refill panel(index + 1) data
        this.$refs.drawer.refill(index + 1, data)
      }, 200)
    },
    selectHandler (selectedVal, selectedIndex, selectedText) {
      this.selectedVal.play = selectedIndex[0]
      this.selectedVal.playId = Lottery[0]['play'][selectedIndex[0]]['data'][selectedIndex[1]]['playId']
      this.selectedText.play = Lottery[0]['play'][selectedIndex[0]]['kind']
      this.selectedText.playName = Lottery[0]['play'][selectedIndex[0]]['data'][selectedIndex[1]]['playName']
      this.playText = `${this.selectedText.play}_${this.selectedText.playName}`
      this.options.lotteryIndex = 0
      this.options.playId = this.selectedVal.playId
      this.selectedValue = this.selectedVal.playId
    },
    cancelHandler () {
      console.log('cancel')
    },
    addShoppingBasket () {
      if (this.notes >= 1) {
        this.addShoppingBaskets({
          lottery: Object.values(Lottery[this.lotteryKindIndex])[0][this.lotteryIndex],
          betContent: getBetContent(this.lotteryKindIndex, this.selectedVal.playId),
          play: { playName: this.selectedText, playId: this.selectedVal.playId },
          mode: this.mode,
          notes: this.notes,
          multipleValue: this.multipleValue,
          totalMoney: this.totalMoney,
          keyId: new Date().getTime()
        })
      }
      if (this.orderList.length > 0) {
        this.$refs.mainBettingLayout.initMainBettingLayout(this.options)
        this.$router.push({ name: 'CheckOutPage', params: Object.values(Lottery[this.lotteryKindIndex])[0][this.lotteryIndex] })
      } else {
        this.$toast.showText('至少选择一注')
      }
    },
    oneKeyBetting () {

    },
    shuomingHandler () {
      Toast.showText(`玩法说明待加载……`)
    },
    calcNotes () {
      this.notes = calcLotteryNotes(this.lotteryKindIndex, this.selectedVal.playId)
    },
    modeChanged (mode) {
      this.mode = Object.values(mode)
    },
    showResultList () {
      this.isShow = !this.isShow
    },
    ...mapMutations('lottery', {
      addShoppingBaskets: types.SHOPPING_BASKET_ADD,
      clearSelectedBalls: types.SELECTED_BALLS_CLEAR
    })
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
    background-color: #F9F9F9;
    ::v-deep .cube-btn {
      background-color:  #F9F9F9;
      color: #666666;
    }
    ::v-deep .cube-drawer-item {
      text-align: left;
    }
    .titleInfo{
      display: flex;
      .cube-button-playSelect{
        width: 30%;
        height: 100px;
        padding: 0 0 0 10px ;
        border-bottom: 1px solid #999999;
        border-right: 1px solid #999999;
      }
      .cube-button-result{
        display: flex;
        width: 70%;
        height: 100px;
        padding: 0 0 0 10px ;
        border-bottom: 1px solid #999999;
        span{
          height: 60px;
          line-height: 60px;
        }
        .result_show{
          color: #ffffff;
          ul li {
            display: inline-block;
            list-style-type: none;
            background-color: $color-blue;
            width:60px;
            height: 60px;
            line-height: 60px;
            border-radius: 60px;
            margin-right: 5px;
          }
        }
      }
    }
    .iusse_time_money{
      display: flex;
      height: 80px;
      border-bottom: 1px solid #999999;
      p{
        width: 90%;
        height: 50px;
        line-height: 50px;
        margin-top: 20px;
        .p_1{
          color: $color-blue;
        }
        .p_2{
          color: #FF0000;
        }
        .p_3{
          color: $color-blue;
        }
      }
      .p_4{
        width: 10%;
        height: 50px;
        margin-top: 20px;
        img{
          width: 40px;
          height: 40px;
          float: right;
          margin-right: 15px;
        }
      }
    }
    .content{
      height: calc(62vh);
      margin-top: 10px;
      select{
        width: 100%;
      }
    }
  }
  .footer {
    height: 220px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
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
}
.active_result_div{
  position:absolute;
  display: block;
  z-index: 99;
}
.noactive_result_div{
  position:absolute;
  display: none;
  z-index: -99;
}
.result_div{
  width: 100%;
  height: 540px;
  background-color: #ffffff;
  padding: 20px;
  .result_head{
    width: 100%;
    height: 140px;
    .result_ico{
      float: left;
      width: 25%;
      height: 100%;
      img{
        width: 120px;
        height: 120px;
      }
    }
    .result_title{
      float: left;
      width: 75%;
      height: 100%;
      text-align: center;
      .p_title{
        height: 60px;
        line-height: 60px;
        .p_title_name{
          font-size: 30px;
          font-weight: bold;
        }
        .p_title_iusse{
          font-weight: bold;
          color: $color-blue;
        }
      }
      .p_ball{
        height: 80px;
        line-height: 80px;
        color: #ffffff;
        font-size: 36px;
        ul{
          white-space:nowrap;
          li {
            display: inline;
            list-style-type: none;
            span{
              background-color: #FF605E;
              width: 60px;
              height: 60px;
              line-height: 60px;
              border-radius: 60px;
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
  .result_list_div{
    height: 380px;
    overflow: hidden;
    overflow-y:auto;
  }
  ul li{
    width: 100%;
    height: 60px;
    line-height: 60px;
    span{
      display: inline-block;
      // background: #9dbdc5;
    }
    .iusse{
      width: 25%;
      height: 100%;
    }
    .result{
      width: 75%;
      line-height: 60px;
      height: 60px;
      color: #ffffff;
      font-size: 28px;
      ul li {
        display: inline;
        list-style-type: none;
        span{
          background-color: $color-blue;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 40px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
