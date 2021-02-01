<template>
  <header class="app-header">
    <div
      class="leftItem"
      @click="leftMenuClick"
    >
      <slot name="left">
        <a>
          <i class="cubeic-back" />
        </a>
      </slot>
    </div>
    <div
      class="header-title"
      v-text="title"
    />
    <div class="rightItem">
      <slot name="right" />
    </div>
  </header>
</template>
<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    leftMenuClick () {
      this.$emit('left-click')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@styles/_var.scss';
.app-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 88px;
  background-color: $color-blue;
  .leftItem {
    width: 40vw;
    height: 88px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    a {
      display: block;
      text-decoration: none;
      color: white;
      font-size: 36px;
      img {
        padding: 10px 10px;
        width: 24px;
        height: 24px;
      }
    }
  }
  .header-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 88px;
    font-size: 36px;
    color: white;
  }
  .rightItem {
    width: 40vw;
    height: 88px;
    display: flex;
    align-items: center;
    margin-right: 20px;
    justify-content: flex-end;
    a {
      display: block;
      text-decoration: none;
      color: white;
      font-size: 24px;
      img {
        padding: 10px 10px;
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
