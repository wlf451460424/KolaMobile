<template>
  <div id="app">
    <navigation>
      <router-view v-transition />
    </navigation>
  </div>
</template>

<style lang="scss">
// @import "@styles/common.scss";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
}
.cube-toast-tip {
  max-height: 100% !important;
}
.cube-select::after{
  border: rgba($color: #fff, $alpha: 0);
}
</style>
