<template>
  <div class="container">
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
              v-for="(i, index) in history_open_number"
              :key="index"
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
      :data="playData"
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
            <span class="p_title_name">{{ title }}&nbsp;&nbsp;</span>第<span class="p_title_iusse">{{ history_issue_number }}</span>期&nbsp;&nbsp;开奖结果
          </p>
          <p class="p_ball">
            <ul>
              <li
                v-for="(item, index) in history_open_number"
                :key="index+300"
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
            v-for="(item, index) in history_number_list"
            :key="index+100"
          >
            <span class="iusse">{{ item.issue_number }}</span>
            <span class="result">
              <ul>
                <li
                  v-for="(it, i) in item.open_number.split(',')"
                  :key="i+200"
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
  </div>
</template>

<script>
import Toast from '@common/toast'
import Lottery from '@common/lottery-json'
import LotteryHandicap from '@common/lottery-handicap-json'
import MathUtils from '@utils/math-utils'
import LotteryUtils from '@utils/lottery-utils'
import types from '@store/modules/mutation-types'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      playData: [],
      timerId: '',
      currentLotterySalePlayInfo: [],
      currentLotterySalePlayIdArray: [],
      currentIusse: '',
      currentTime: '',
      isShow: false,
      items: [],
      options: { kindIndex: this.$route.params.lottery_kind, playId: Number(this.$route.params.lottery_kind) === 0 ? 3 : 1 },
      // playText: '选择玩法',
      selectedIndex: [0, 0], //  默认选中玩法索引
      selectedVal: { play: 0, playId: 1 }, // 默认选中玩法
      selectedValue: 1,
      selectedText: { play: '五星', playName: '直选复式' },
      history_open_number: [],
      history_number_list: [],
      history_issue_number: '',
      lotteryMode: 0
    }
  },
  computed: {
    title () {
      return this.lottery_name
    },
    lotteryIndex () {
      return this.$route.params.lottery_index // 彩种json下标
    },
    lotteryKindIndex () {
      return this.$route.params.lottery_kind // 彩种种类json下标
    },
    ...mapState('userInfo', {
      currentMoney: state => state.balance
    }),
    ...mapState('lottery', {
      orderList: state => state.shoppingBasket,
      bet_single_amount: state => state.bet_single_amount,
      lottery_no: state => state.lottery_no,
      lottery_name: state => state.lottery_name,
      lottery_type: state => state.lottery_type
    }),
    playText () {
      return this.selectedText.play + '_' + this.selectedText.playName
    }
  },
  // 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  created () {
    // 获取开启玩法
    this.getLotterySalePlay()
  },
  mounted () {
    this.$bus.$on('lottery-beting-mode', this.lotteryBettingMode)
    // 获取当前期号 时间
    this.getCurrentIssueTime()
    this.getLotteryHistoryNumber()
  },
  methods: {
    showPopUp () {
      this.$refs.drawer.show()
    },
    // 获取开启玩法
    getLotterySalePlay () {
      var params = '{ "lottery_no":' + this.lottery_no + ' }'
      this.$api.lottery.getLotterySalePlay(params).then(res => {
        this.currentLotterySalePlayInfo = []
        this.currentLotterySalePlayIdArray = []
        this.currentLotterySalePlayInfo = res.data.data
        this.currentLotterySalePlayInfo.map((item, index) => {
          if (item.sale_status === 1) {
            this.currentLotterySalePlayIdArray.push(item.play_code)
          }
        })
        this.playData = [
          this.getPlay(),
          this.getPlayName(0)
        ]
        // Toast.showText(`获取开启玩法·成功`)
      })
    },
    // 获取当前期号
    getCurrentIssueTime () {
      var params = '{ "lottery_no":' + this.lottery_no + ' }'
      this.$api.lottery.getIssue(params).then(res => {
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
      let playList
      if (this.lotteryMode === 0) {
        playList = Lottery[this.lotteryKindIndex]['play']
      } else {
        playList = LotteryHandicap[this.lotteryKindIndex]['play']
      }
      this.selectedText.play = playList[0].kind
      let temp = []
      playList.map((item, index) => {
        temp.push({ text: item['kind'], value: index })
      })
      return temp
    },
    getPlayName (playIndex) {
      let play
      if (this.lotteryMode === 0) {
        play = Lottery[this.lotteryKindIndex]['play'][playIndex]
      } else {
        play = LotteryHandicap[this.lotteryKindIndex]['play'][playIndex]
      }
      this.selectedVal.playId = play['data'][0].playId
      this.selectedVal.play = 0
      this.selectedValue = play['data'][0].playId
      this.selectedText.playName = play['data'][0].playName
      let temp = []
      play['data'].map((item, index) => {
        if (this.lotteryMode === 0) {
          if (this.currentLotterySalePlayIdArray) {
            if (this.currentLotterySalePlayIdArray.includes(Number(item['playId']))) {
              temp.push({ text: item['playName'], value: item['playId'] })
            }
          }
        } else {
          temp.push({ text: item['playName'], value: item['playId'] })
        }
      })
      // this.playText = this.selectedText.play + '_' + this.selectedText.playName
      this.$bus.$emit('betting-header-params', {
        selectedVal: this.selectedVal,
        options: this.options,
        selectedText: this.selectedText,
        currentIusse: this.currentIusse
      })
      return temp
    },
    changeHandler (index, item, selectedVal, selectedIndex, selectedText) {
      setTimeout(() => {
        let data
        if (index === 0) {
          let play
          if (this.lotteryMode === 0) {
            play = Lottery[this.lotteryKindIndex]['play'][item.value]
          } else {
            play = LotteryHandicap[this.lotteryKindIndex]['play'][item.value]
          }
          let temp = []
          play['data'].map((item, index) => {
            if (this.currentLotterySalePlayIdArray && this.lotteryMode === 0) {
              if (this.currentLotterySalePlayIdArray.includes(Number(item['playId']))) {
                temp.push({ text: item['playName'], value: item['playId'] })
              }
            } else {
              temp.push({ text: item['playName'], value: item['playId'] })
            }
          })
          data = temp
        }
        // refill panel(index + 1) data
        this.$refs.drawer.refill(index + 1, data)
      }, 200)
    },
    selectHandler (selectedVal, selectedIndex, selectedText) {
      this.selectedVal.play = selectedIndex[0]
      this.selectedVal.playId = selectedVal[1]
      this.selectedText.play = this.lotteryMode === 0 ? Lottery[this.lotteryKindIndex]['play'][selectedIndex[0]]['kind'] : LotteryHandicap[this.lotteryKindIndex]['play'][0]['kind']
      this.selectedText.playName = selectedText[1]
      // this.playText = this.selectedText.play + '_' + selectedText[1]
      this.options.kindIndex = this.lotteryKindIndex
      this.options.playId = this.selectedVal.playId
      this.selectedValue = this.selectedVal.playId
      this.addPlayId({
        lottery_play_id: Number(this.selectedValue)
      })
      this.$bus.$emit('betting-header-params', {
        selectedVal: this.selectedVal,
        options: this.options,
        selectedText: this.selectedText,
        currentIusse: this.currentIusse
      })
      if (this.lotteryMode === 0) {
        this.getAwards(this.selectedValue)
      }
      this.clearData()
    },
    cancelHandler () {
      console.log('cancel')
    },
    shuomingHandler () {
      const playDesc = this.currentLotterySalePlayInfo.filter(
        e => e.play_code === Number(this.selectedValue)
      )
      this.playExplain = playDesc[0].play_explain
      Toast.showText(this.playExplain)
    },
    showResultList () {
      this.isShow = !this.isShow
    },
    getLotteryHistoryNumber () {
      const _data = {
        lotteryNo: this.lottery_no
      }
      this.$api.lottery.getHisnumList(_data).then(result => {
        const rs = result.data
        if (rs.code === 200) {
          this.history_number_list = rs.data
          const _data = rs.data[0]
          if (rs.data[0]) {
            this.history_issue_number = _data.issue_number
            this.history_open_number = _data.open_number.split(',')
          }
          this.getAwards(this.lottery_type === 1 ? 3 : this.selectedValue)
        }
      })
    },
    getAwards (playCode) {
      this.$api.lottery.getLotteryAward({ lottery_no: this.lottery_no, play_code: playCode }).then(res => {
        let awardArr = []
        const _result = res.data.data
        for (const i in _result) {
          awardArr.push(_result[i])
        }
        /**
       * 后台配置奖级大小无规律（时时彩后三特殊号）、需要从大到小排序后、返回最大值和最小值、
       */
        awardArr = awardArr.sort((a, b) => {
          return MathUtils.minus(b, a)
        })
        const resultArr = []
        const max = awardArr[0]
        if (typeof max === 'undefined') {
          return [0, 0]
        }
        resultArr.push(max)
        if (awardArr.length > 1) {
          const min = awardArr[awardArr.length - 1]
          if (max > min) {
            resultArr.push(min)
          }
        }
        LotteryUtils.awardInfo = resultArr
        LotteryUtils.getLotterySoloInfo(playCode)
      })
    },
    lotteryBettingMode (lotteryMode) {
      this.lotteryMode = lotteryMode
      this.playData = [
        this.getPlay(),
        this.getPlayName(0)
      ]
      if (Number(this.$route.params.lottery_kind) === 0) {
        if (lotteryMode === 0) {
          this.options.playId = 3
        } else {
          this.options.playId = 1
        }
      }
      // this.playText = '选择玩法'
      this.selectedIndex = [0, 0] //  默认选中玩法索引
      this.selectedVal = { play: 0, playId: 1 } // 默认选中玩法
      this.selectedValue = 1
    },
    clearData () {
      this.clearSelectedBalls()
    },
    ...mapMutations('lottery', {
      clearSelectedBalls: types.SELECTED_BALLS_CLEAR,
      addPlayId: types.SAVE_LOTTERY_PLAY_INFO
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
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
        align-items: center;
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
  .active_result_div{
    position:absolute;
    display: block;
    margin-top: 100px;
    z-index: 99;
  }
  .noactive_result_div{
    position:absolute;
    display: none;
    z-index: -99;
  }
}
</style>
