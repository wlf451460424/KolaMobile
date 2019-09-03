<template>
  <div class="type_container">
    <span
      v-for="(item, index) in txts"
      :key="index"
      :class="{ active: checks[index] }"
      @click="switchChasing(index)"
    >
      <img :src="require(`@assets/${imgSrc[index]}`)">
      {{ item }}
    </span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      txts: ['同倍追号', '翻倍追号', '利润率追号'],
      imgSrc: ['chasing_number_tongbeishu.png', 'chasing_number_fanbeishu.png', 'chasing_number_lirunlv.png'],
      checks: [true, false, false]
    }
  },
  methods: {
    switchChasing (index) {
      for (let i = 0; i < this.checks.length; i++) {
        this.checks.splice(i, 1, i === index)
      }
      this.$emit('chasing-change', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.type_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  span {
    width: 30%;
    height: 70px;
    line-height: 70px;
    display: inline-block;
    border-radius: 10px;
    color:white;
    background-color: $color-gray;
    img{
      width: 40px;
      height: 40px;
      margin: 12px 10px -12px 0;
    }
  }
  .active {
    background-color: $color-light-green;
  }
}
</style>
