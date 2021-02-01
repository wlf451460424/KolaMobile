<template>
  <div class="container">
    <div class="top_layout">
      <div
        v-if="!isLabel"
        class="label_style"
      >
        {{ rowLabel }}
      </div>
      <div
        class="ball_layout"
        :class="{ ball_layout_label: isLabel }"
      >
        <number-ball
          v-for="(item, index) in ballTexts"
          :key="index"
          :ball-text="item"
          :ball-value="ballValues[index]"
          class="ball_style"
          @ball-click="ballClick"
        />
      </div>
    </div>
    <div class="ball_menu">
      <ul>
        <li @click="allClick">
          全
        </li>
        <li @click="bigClick">
          大
        </li>
        <li @click="smallClick">
          小
        </li>
        <li @click="oddClick">
          奇
        </li>
        <li @click="evenClick">
          偶
        </li>
        <li @click="clearSelectedClick">
          清
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import NumberBall from './NumberBall'
import types from '@store/modules/mutation-types'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'BallLayout',
  components: {
    NumberBall
  },
  props: {
    rowObj: {
      type: Object,
      default: undefined
    },
    ballTexts: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    ballValues: {
      type: Array,
      default () {
        return this.ballTexts
      }
    }
  },
  computed: {
    rowLabel () {
      return this.rowObj.ballLabel
    },
    isLabel () {
      return this.rowObj.isHiddenLabel
    },
    ...mapState('lottery', {
      lottery_type: state => state.lottery_type
    })
  },
  methods: {
    ballClick (payload) {
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: new Array(payload)
      })
      this.$bus.$emit('calcNotes')
    },
    allClick () {
      this.$children.forEach(item => {
        item.isActive = true
      })
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: this.$children
      })
      this.$bus.$emit('calcNotes')
    },
    bigClick () {
      this.clearSelectedClick()
      this.$children
        .filter((item, index) => {
          return index >= (this.$children.length - 1) / 2
        })
        .forEach(item => {
          item.isActive = true
        })
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: this.$children.filter((item, index) => index >= (this.$children.length - 1) / 2)
      })
      this.$bus.$emit('calcNotes')
    },
    smallClick () {
      this.clearSelectedClick()
      this.$children
        .filter((item, index) => index < (this.$children.length - 1) / 2)
        .forEach(item => {
          item.isActive = true
        })
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: this.$children.filter((item, index) => index < (this.$children.length - 1) / 2)
      })
      this.$bus.$emit('calcNotes')
    },
    oddClick () {
      this.clearSelectedClick()
      this.$children
        .filter((item, index) => {
          if (this.lottery_type === 2) {
            return (index + 1) % 2 !== 0
          } else {
            return index % 2 !== 0
          }
        })
        .forEach(item => {
          item.isActive = true
        })
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: this.$children.filter((item, index) => {
          if (this.lottery_type === 2) {
            return (index + 1) % 2 !== 0
          } else {
            return index % 2 !== 0
          }
        })
      })
      this.$bus.$emit('calcNotes')
    },
    evenClick () {
      this.clearSelectedClick()
      this.$children
        .filter((item, index) => {
          if (this.lottery_type === 2) {
            return (index + 1) % 2 === 0
          } else {
            return index % 2 === 0
          }
        })
        .forEach(item => {
          item.isActive = true
        })
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: this.$children.filter((item, index) => {
          if (this.lottery_type === 2) {
            return (index + 1) % 2 === 0
          } else {
            return index % 2 === 0
          }
        })
      })
      this.$bus.$emit('calcNotes')
    },
    clearSelectedClick () {
      this.$children.forEach(item => {
        item.isActive = false
      })
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: this.$children
      })
      this.$bus.$emit('calcNotes')
    },
    ...mapMutations('lottery', {
      ballSelected: types.BALL_CLICK
    })
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  .top_layout {
    display: inline-flex;
    // background-color: white;
    .label_style {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 60px;
      flex-wrap: wrap;
      width: 100px;
      height: 220px;
      margin: 0 2px;
      color: $color-blue;
      font-size: 30px;
      text-align: center;
      // display: none;
    }
    .ball_layout {
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0 30px;
      .ball_style {
        margin:0 30px 30px 0;
      }
    }
    .ball_layout_label:after {
      // content: "";
      flex: auto;
    }
  }
  .ball_menu {
    display: inline-flex;
    ul {
      display: flex;
      justify-content: center;
      margin:0 auto;
      height: 60px;
      background-color: $color-light-green;
      width: 80%;
      height: 60px;
      border-radius:0px 0px 60px 60px;
      li {
        width: 30px;
        height: 30px;
        padding: 20px;
        color: white;
        margin-right: 10px;
        font-size: 24px;
      }
    }
  }
}
</style>
