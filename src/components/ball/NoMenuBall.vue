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
  </div>
</template>
<script>
import NumberBall from './NumberBall'
import types from '@store/modules/mutation-types'
import { mapMutations } from 'vuex'
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
    }
  },
  methods: {
    ballClick (payload) {
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: new Array(payload)
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
    display: flex;
    height: 220px;
    background-color: white;
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
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0 20px;
      .ball_style {
        margin-right: 30px;
      }
    }
    .ball_layout_label:after {
      content: "";
      flex: auto;
    }
  }
}
</style>
