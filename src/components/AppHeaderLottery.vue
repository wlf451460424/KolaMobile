<template>
  <header class="app-header-lottery">
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
    <!-- <div class="header-title-lottery" v-text="title"></div> -->

    <cube-select
      v-model="value"
      :options="options"
      @change="change"
    />

    <div class="rightItem-lottery">
      <slot name="right" />
    </div>
  </header>
</template>
<script>
import LotteryUtils from '@utils/lottery-utils'
export default {
  name: 'AppHeaderLottery',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: [],
      value: '',
      supportedMode: 1
    }
  },
  mounted () {
    this.getLotterySupportedMode()
    this.value = this.title + '(官)'
    this.options = []
    if (this.supportedMode === 1) {
      this.options.push(this.title + '(官)')
    } else if (this.supportedMode === 2) {
      this.options.push(this.title + '(信)')
    } else {
      this.options.push(this.title + '(官)')
      this.options.push(this.title + '(信)')
    }
  },
  methods: {
    leftMenuClick () {
      this.$emit('left-click')
    },
    getLotterySupportedMode () {
      this.supportedMode = LotteryUtils.supportedMode
      this.$bus.$emit('lottery-beting-mode', this.supportedMode === 2 ? 1 : 0)
    },
    change (value, index, text) {
      // 官方、信用玩法切换
      this.$bus.$emit('lottery-beting-mode', index)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@styles/_var.scss';
.app-header-lottery {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 88px;
  background-color: $color-blue;
  .leftItem {
    width: 30vw;
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
  .header-title-lottery {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 88px;
    font-size: 36px;
    color: white;
  }
  .rightItem-lottery {
    width: 30vw;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 20px;
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
.cube-select{
  color: #ffffff !important;
  background: rgba($color: #ffffff, $alpha: 0) !important;
}
::v-deep .cube-select-icon{
  border-color: rgb(255, 255, 255) transparent transparent transparent;
}

</style>
