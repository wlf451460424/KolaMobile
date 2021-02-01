<template>
  <div class="container">
    <span
      v-for="(item, index) in modes"
      :key="index"
      :class="{ active: checks[index] }"
      @click="selectMode(index)"
    >
      {{ item }}
    </span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modes: ['元', '角', '分', '厘'],
      checks: [true, false, false, false]
    }
  },
  methods: {
    selectMode (index) {
      for (let i = 0; i < this.checks.length; i++) {
        this.checks.splice(i, 1, i === index)
      }
      this.$emit('modeChange', { index: index, modeName: this.modes[index] })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: inline;
  margin-left: 40px;
  span {
    display: inline-block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    background-color: $color-gray;
    color: white;
    margin-left: 14px;
    border-radius: 60px;
  }
  .active {
    background-color: $color-light-green;
  }
}
</style>
