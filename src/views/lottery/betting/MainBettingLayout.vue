<template>
  <div class="container">
    <component
      :is="bettingLayout"
      :item-options="itemOptions"
    />
  </div>
</template>
<script>
// import Lottery from '@common/lottery-json'
import Play from '@common/play-json'
import PlayHandicap from '@common/play-handicap-json'
import LotteryUtils from '@utils/lottery-utils'
export default {

  components: {
    // 复式多行 mark = 1
    'duplex-ball-layout': () => import('@views/lottery/betting/DuplexBallLayout'),
    // 单式 mark = 2
    'single-layout': () => import('@views/lottery/betting/SingleLayout'),
    // 组选（部分）跨度 mark = 3
    'group-singleRow-layout': () => import('@views/lottery/betting/GroupSingleRowLayout'),
    // 非数字布局（eg:大小单双）  mark = 4
    'non-num-layout': () => import('@views/lottery/betting/NonNumLayout'),
    // 和值   mark = 5
    'sum-layout': () => import('@views/lottery/betting/SumLayout'),
    // 任选单式   mark = 6
    'single-layout-renxuan': () => import('@views/lottery/betting/SingleLayoutRenxuan'),
    'handicap-integration-layout': () => import('@views/lottery/betting/HandicapIntegrationLayout'),
    'handicap-dragon-tiger-fight-layout': () => import('@views/lottery/betting/HandicapDragonTigerFightLayout'),
    'handicap-five-select-one-layout': () => import('@views/lottery/betting/HandicapFiveSelectOneLayout')
  },
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lotteryMode: 0,
      handicapAward: []
    }
  },
  computed: {
    bettingLayout () {
      return this.getLayout(this.lotteryMode === 0 ? Play[this.options.kindIndex][this.options.playId]['viewType'] : PlayHandicap[this.options.kindIndex][this.options.playId]['viewType'])
    },
    itemOptions () {
      return this.getLayoutOptions(this.lotteryMode === 0 ? Play[this.options.kindIndex][this.options.playId]['viewType'] : PlayHandicap[this.options.kindIndex][this.options.playId]['viewType'], this.options.kindIndex, this.options.playId)
    }
  },
  mounted () {
    this.$bus.$on('initMainBettingLayout', this.initMainBettingLayout)
    this.$bus.$on('lottery-beting-mode', this.lotteryBettingMode)
    this.getHandicapAward()
  },
  beforeDestroy () {
    this.$bus.$off('initMainBettingLayout')
  },
  methods: {
    getHandicapAward () {
      const _data = {
        lottery_no: this.$store.state.lottery.lottery_no
      }
      this.$api.lottery.getHandicapAward(_data).then(res => {
        const result = res.data
        if (result.code === 200 && result.data.length > 0) {
          this.handicapAward = result.data
        }
      })
    },
    initMainBettingLayout () {
      let viewType = 1
      if (this.lotteryMode === 0) {
        viewType = parseInt(Play[this.options.kindIndex][this.options.playId]['viewType'])
      } else {
        viewType = parseInt(PlayHandicap[this.options.kindIndex][this.options.playId]['viewType'])
      }
      switch (viewType) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 9:
          this.$children[0].initBettingLayout()
          break
      }
    },
    getLayout (viewType) {
      let layoutMap = {
        '1': () => import('@views/lottery/betting/DuplexBallLayout'),
        '2': () => import('@views/lottery/betting/SingleLayout'),
        '3': () => import('@views/lottery/betting/GroupSingleRowLayout'),
        '4': () => import('@views/lottery/betting/NonNumLayout'),
        '5': () => import('@views/lottery/betting/SumLayout'),
        '6': () => import('@views/lottery/betting/SingleLayoutRenxuan'),
        '7': () => import('@views/lottery/betting/HandicapIntegrationLayout'),
        '8': () => import('@views/lottery/betting/HandicapDragonTigerFightLayout'),
        '9': () => import('@views/lottery/betting/HandicapFiveSelectOneLayout')
      }
      return layoutMap[viewType]
    },
    getLayoutOptions (viewType, kindIndex, playId) {
      let optionsMap = {}
      if (this.lotteryMode === 0) {
        optionsMap = {
          '1': Play[kindIndex][playId]['item'],
          '2': Play[kindIndex][playId],
          '3': Play[kindIndex][playId],
          '4': Play[kindIndex][playId],
          '5': Play[kindIndex][playId]['item'],
          '6': Play[kindIndex][playId]
        }
      } else {
        optionsMap = {
          '7': PlayHandicap[kindIndex][playId]['item'],
          '8': PlayHandicap[kindIndex][playId]['item'],
          '9': PlayHandicap[kindIndex][playId]['item']
        }
        optionsMap[viewType].map(itemObj => {
          itemObj.playCode.map(item => {
            itemObj.ballOdd.push(LotteryUtils.getOdds(item, this.handicapAward))
          })
        })
      }
      return optionsMap[viewType]
    },
    lotteryBettingMode (lotteryMode) {
      this.lotteryMode = lotteryMode
    }
  }
}
</script>
<style lang="scss" scoped>
.constainer {
  display: flex;
  flex-direction: column;
}
</style>
