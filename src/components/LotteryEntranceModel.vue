<template>
  <div class="app">
    <img src="@/assets/ic_lottery/lottery_1@2x.png">
    <p>{{ inputName }}</p>
  </div>
</template>

<script>
export default {
  props: {
    inputName: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped lang="scss">
  .app {
    margin:0 auto;
    width:100pt;
    height:100pt;
    text-align:center;
    border: 1px solid #999999;
    // box-shadow:2px 2px 2px #000
  }
  img {
    width:59pt;
    height:59pt;
    text-align:center;
  }
  p {
    // width: 100%;
    // height: 30px;
    font-size: 10pt;
    text-align: center;
    margin-top: 10pt;
  }
</style>
