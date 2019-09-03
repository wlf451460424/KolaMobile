<template>
  <div class="double_multiple_container">
    <div>
      起始倍数
      <numeric-input
        v-model="multipleValue"
        :min="1"
        :max="9999"
        :step="1"
        size="74%"
      />
      倍
    </div>
    <div>
      追号期数<input
        v-model.number="issues"
        type="number"
      >期(最多可追120期)
    </div>
    <div class="interval_input">
      追号倍数 隔<span><input
        v-model.number="intervalIssues"
        type="number"
      >期</span>，倍数X <input
        v-model.number="intervalMultiple"
        type="number"
      >倍
    </div>
    <cube-button>生成追号计划</cube-button>
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
      multipleValue: 1,
      issues: 10,
      intervalIssues: 1,
      intervalMultiple: 2
    }
  }
}
</script>
<style lang="scss" scoped>
.double_multiple_container {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-color: $color-gray;
  border-radius: 14px;
  border-style: solid;
  border-width: 1px;
  height: 330px;
  width: 94%;
  padding: 20px;
  font-size: 28px;
  input {
    width: 38%;
    margin: 10px;
    height: 70px;
    border-color: $color-gray;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    padding-left: 20px;
  }
  .interval_input input {
    width: 17%;
    height: 70px;
  }
  ::v-deep .cube-btn {
    background-color: $color-light-green;
    height: 64px;
    line-height: 64px;
    font-size: 24px;
    margin-top: 10px;
    border-radius: 8px;
    width: 98%;
    padding: 0 0;
  }
}
</style>
