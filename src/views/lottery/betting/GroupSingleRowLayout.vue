<template>
  <div class="container">
    <div
      v-if="itemOptions.positionShow"
      style="display:flex;width:100%;padding:4vw"
    >
      <span>位置：</span>
      <span
        v-for="(item, index) in options"
        :key="index"
        style="display:flex;align-items: center;"
        @click="checkClick"
      >
        <input
          :id="index"
          ref="checks"
          type="checkbox"
          :value="item.value"
          :checked="itemOptions.position[index]"
        >
        <span style="padding:0 10px 0 3px">{{ item.label }}</span>
      </span>
    </div>
    <ball-layout
      v-for="(item, index) in itemOptions.item"
      :key="index"
      :ball-texts="itemOptions.item[index].ballText"
      :row-obj="{ ballIndex: index,ballLabel: itemOptions.item[index].ballLabel, isHiddenLabel: itemOptions.item[index].ballLabel === '' }"
      class="ball_layout_style"
    />
    <!-- <ball-layout
      v-for="(item, index) in itemOptions"
      :key="index"
      :ball-texts="itemOptions[index].ballText"
      :row-obj="{ ballIndex: index,ballLabel: itemOptions[index].ballLabel, isHiddenLabel: itemOptions[index].ballLabel === '' }"
      class="ball_layout_style"
    /> -->
  </div>
</template>
<script>
import BallLayout from '@components/ball/BallLayout'
import types from '@store/modules/mutation-types'
import { mapMutations } from 'vuex'
// import store from '@store'
export default {
  components: {
    BallLayout
  },
  props: {
    itemOptions: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      arr: [],
      options: [
        { 'label': '万位',
          'value': '万位' },
        { 'label': '千位',
          'value': '千位' },
        { 'label': '百位',
          'value': '百位' },
        { 'label': '十位',
          'value': '十位' },
        { 'label': '个位',
          'value': '个位' }
      ]
    }
  },
  mounted () {
    if (this.itemOptions.positionShow) {
      this.checkClick()
    }
  },
  methods: {
    checkClick () {
      this.arr = []
      var checkList = this.$refs.checks
      checkList.forEach(element => {
        var index = element.id
        if (checkList[index].checked) {
          this.arr.push(element.value)
        }
      })

      this.singleSelected({
        positionArray: this.arr
      })
      this.$bus.$emit('calcNotes')
      // console.log(store.state.lottery.selectedBalls)
      // console.log(store.state.lottery.selectedBallsPosition)
    },
    initBettingLayout () {
      this.$children.forEach(ballLayout => {
        ballLayout.clearSelectedClick()
      })
    },
    ...mapMutations('lottery', {
      singleSelected: types.SELECTED_BALLS_POSITION
    })
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  .ball_layout_style {
    margin-top: 20px;
  }
}
</style>
