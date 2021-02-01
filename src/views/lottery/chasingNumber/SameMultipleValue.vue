<template>
  <div class="same_multiple_container">
    <div>
      起始倍数
      <numeric-input
        v-model="addMultiple"
        :min="1"
        :max="9999"
        :step="1"
        size="74%"
        @click="change_beishu"
      />
      倍
    </div>
    <div>
      追号期数<input
        v-model.number="issues"
        type="number"
      >期
    </div>
    <cube-button @click="produceIusse">
      生成追号计划
    </cube-button>
  </div>
</template>
<script>
import NumericInput from '@components/NumericInput'
export default {
  components: {
    NumericInput
  },
  data () {
    return {
      issues: 10,
      addMultiple: 1
    }
  },
  methods: {
    change_beishu () {
      // console.log(this.multipleValue)
    },
    produceIusse () {
      this.$bus.$emit('produceIusse', this)
    }
  }
}
</script>
<style lang="scss" scoped>
.same_multiple_container {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-color: $color-gray;
  border-radius: 14px;
  border-style: solid;
  border-width: 1px;
  height: 240px;
  width: 94%;
  padding: 20px;
  font-size: 28px;
  input {
    width: 70%;
    margin: 10px;
    height: 70px;
    border-color: $color-gray;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    padding-left: 20px;

  }
  ::v-deep .cube-btn {
    background-color: $color-light-green;
    height: 64px;
    line-height: 64px;
    font-size: 24px;
    margin-top: 10px;
    border-radius: 8px;
    width: 96%;
    padding: 0 0;
  }
}
</style>
