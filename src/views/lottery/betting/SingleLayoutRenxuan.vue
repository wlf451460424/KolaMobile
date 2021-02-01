<template>
  <div class="content">
    <div
      v-if="itemOptions.positionShow"
      style="display:flex;width:100%;padding:0 4vw"
    >
      <span>位置：</span>
      <span
        v-for="(item, index) in options"
        :key="index"
        style="display:flex;align-items: center;"
        @click="checkClick"
      >
        <input
          :id="index"
          ref="checks"
          type="checkbox"
          :value="item.value"
          :checked="itemOptions.position[index]"
        >
        <span style="padding:0 10px 0 3px">{{ item.label }}</span>
      </span>
    </div>
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
        清空号吗
      </cube-button>
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
// import store from '@store'
export default {
  props: {
    itemOptions: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      textContent: '',
      arr: [],
      options: [
        { label: '万位', value: '万位' },
        { label: '千位', value: '千位' },
        { label: '百位', value: '百位' },
        { label: '十位', value: '十位' },
        { label: '个位', value: '个位' }
      ]
    }
  },
  methods: {
    // 去重
    textareaRepeat () {
      this.$bus.$emit('textareaRepeat', true)
      this.textContent = LotteryUtils.textContent
      this.onBlur()
    },
    clearNumber () {
      this.textContent = ''
      this.$bus.$emit('clearData')
    },
    checkClick () {
      this.onBlur()
    },
    onBlur (event) {
      this.arr = []
      var checkList = this.$refs.checks
      checkList.forEach(element => {
        var index = element.id
        if (checkList[index].checked) {
          this.arr.push(element.value)
        }
      })
      this.singleSelected({
        numberArr: this.textContent,
        positionArray: this.arr
      })
      if (this.textContent.length <= 0) {
        return false
      }
      // console.log(store.state.lottery.selectedBallsPosition)
      this.$bus.$emit('textareaAssist', true)
      this.textContent = LotteryUtils.textContent
      this.singleSelected({
        numberArr: this.textContent,
        positionArray: this.arr
      })
    },
    ...mapMutations('lottery', {
      singleSelected: types.SINGLE_NUMBER_ADD_RENXUAN
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
.cube-text-style {
  height: 20vh;
  margin: 2vw;
}
.button-style {
  color: #ffffff !important;
  width: 32%;
  background: $color-blue !important;
}
.button-style-mid {
  margin: 0 2%;
}
.introduce-style {
  padding: 0 4vw;
  text-align: left;
  line-height: 5vw;
}
.cube-checkbox-wrap-1 {
  display: block !important;
}
</style>
