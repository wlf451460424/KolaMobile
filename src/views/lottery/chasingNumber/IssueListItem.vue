<template>
  <div class="issue_list_item">
    <span class="index_number">1</span>
    <span class="iusse_number">20140910101</span>
    <input
      ref="beishu_input"
      v-model.number="initMultiple"
      class="beishu_number"
      type="number"
    >
    <span class="money_number">2</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      initMultiple: 1
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.issue_list_item {
  display: flex;
  padding: 4px 30px;
  align-items: center;
  .index_number{
    width: 10%;
  }
  .iusse_number{
    width: 40%;
  }
  .beishu_number {
    width: 20%;
    margin: 10px;
    height: 44px;
    border-color: $color-gray;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    text-align: center;
  }
  .money_number{
    width: 30%;
    color: $color-light-red;
  }
}
</style>
