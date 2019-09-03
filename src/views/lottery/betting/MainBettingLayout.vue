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
    'sum-layout': () => import('@views/lottery/betting/SumLayout')
  },
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  computed: {
    bettingLayout () {
      return this.getLayout(Play[this.options.kindIndex][this.options.playId]['viewType'])
    },
    itemOptions () {
      return this.getLayoutOptions(Play[this.options.kindIndex][this.options.playId]['viewType'], this.options.kindIndex, this.options.playId)
    }
  },
  methods: {
    initMainBettingLayout (item) {
      this.options = item
      switch (parseInt(Play[this.options.kindIndex][this.options.playId]['viewType'])) {
        case 1:
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
        '5': () => import('@views/lottery/betting/SumLayout')
      }
      return layoutMap[viewType]
    },
    getLayoutOptions (viewType, kindIndex, playId) {
      let optionsMap = {
        '1': Play[kindIndex][playId]['item'],
        '2': Play[kindIndex][playId]['item'],
        '3': Play[kindIndex][playId]['item'],
        '4': Play[kindIndex][playId]['item'],
        '5': Play[kindIndex][playId]['item']
      }
      return optionsMap[viewType]
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
