<template>
  <div class="container">
    <ball-layout
      v-for="(item, index) in itemOptions"
      :key="index"
      :ball-texts="itemOptions[index].ballText"
      :row-obj="{ ballIndex: index,ballLabel: itemOptions[index].ballLabel, isHiddenLabel: itemOptions[index].ballLabel === '' }"
      class="ball_layout_style"
    />
  </div>
</template>
<script>
import BallLayout from '@components/ball/BallLayout'
export default {
  components: {
    BallLayout
  },
  props: {
    itemOptions: {
      type: Array,
      required: true
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
