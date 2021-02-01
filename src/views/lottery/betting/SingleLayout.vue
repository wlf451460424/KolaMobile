<template>
  <div class="content">
    <cube-textarea
      v-model="textContent"
      placeholder="请输入号码"
      class="cube-text-style"
      @blur="onBlur"
    />
    <div style="padding:0 4vw 4vw 4vw;">
      <cube-button
        :primary="true"
        :inline="true"
        class="button-style"
        @click="textareaRepeat"
      >
        去重复号
      </cube-button>
      <cube-button
        :primary="true"
        :inline="true"
        class="button-style button-style-mid"
        @click="clearNumber"
      >
        清空号码
      </cube-button>
      <!-- <cube-button
        :primary="true"
        :inline="true"
        class="button-style"
        @click="textareaRepeat"
      >
        去错误号
      </cube-button> -->
    </div>
    <div
      class="introduce-style"
      v-html="itemOptions.introduce"
    />
  </div>
</template>
<script>
import types from '@store/modules/mutation-types'
import { mapMutations } from 'vuex'
import LotteryUtils from '@utils/lottery-utils'
export default {
  props: {
    itemOptions: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      textContent: ''
    }
  },
  methods: {
    // 去重
    textareaRepeat () {
      this.$bus.$emit('textareaRepeat')
      this.textContent = LotteryUtils.textContent
      this.onBlur()
    },
    clearNumber () {
      this.textContent = ''
      this.$bus.$emit('clearData')
    },
    onBlur (event) {
      this.singleSelected({
        numberArr: this.textContent
      })
      if (this.textContent.length <= 0) {
        return false
      }
      this.$bus.$emit('textareaAssist')
      this.textContent = LotteryUtils.textContent
      this.singleSelected({
        numberArr: this.textContent
      })
    },
    ...mapMutations('lottery', {
      singleSelected: types.SINGLE_NUMBER_ADD
    })
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: calc(62vh);
  margin-top: 10pt;
  select {
    width: 100%;
  }
}
.cube-text-style{
  height:20vh;
  margin:2vw
}
.button-style{
  color: #ffffff !important;
  width:32%;
  background:$color-blue !important;
}
.button-style-mid{
  margin: 0 2%;
}
.introduce-style{
  padding:0 4vw;
  text-align:left;
  line-height: 5vw;
}
.cube-checkbox-wrap-1{
  display: block !important;
}
</style>
