<template>
  <div class="container">
    <handicap-layout
      v-for="(item, index) in itemOptions"
      ref="handicapLayout"
      :key="index"
      :ball-texts="itemOptions[index].ballText"
      :ball-values="itemOptions[index].ballValue"
      :ball-odds="itemOptions[index].ballOdd"
      :play-codes="itemOptions[index].playCode"
      :row-obj="{ ballIndex: index, ballLabel: itemOptions[index].ballLabel, isHiddenLabel: itemOptions[index].ballLabel === '' }"
      class="ball_layout_style"
    />
  </div>
</template>

<script>
import HandicapLayout from '@components/ball/HandicapLayout'
export default {
  components: {
    HandicapLayout
  },
  props: {
    itemOptions: {
      type: Array,
      required: true
    }
  },
  methods: {
    initBettingLayout () {
      this.$children.forEach(handicapLayout => {
        handicapLayout.clearSelectedClick()
      })
    }
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
