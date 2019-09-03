<template>
  <div
    class="lotteryItem"
    @click="itemClick"
  >
    <img :src="imgSrc">
    {{ lotteryName }}
  </div>
</template>
<script>
export default {
  props: {
    lotteryName: {
      type: String,
      required: true
    },
    imgSrc: {
      type: String,
      required: true
    }
  },
  computed: {

  },
  methods: {
    itemClick () {
      this.$emit('lottery-item-click')
    }
  }
}
</script>
<style lang="scss" scoped>
.lotteryItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 128px;
    height: 128px;
    margin-bottom: 16px;
  }
  font-size: 20px;
  color: $color-light-black;
}
</style>
