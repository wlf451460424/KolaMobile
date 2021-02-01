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
        :class="{ ball_layout_label: isLabel}"
      >
        <handicap-rect-or-number-ball
          v-for="(item, index) in ballTexts"
          :key="index"
          :ball-text="item"
          :ball-value="ballValues[index]"
          :ball-odd="ballOdds[index]"
          :play-code="playCodes[index]"
          class="ball_style"
          @ball-click="ballClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HandicapRectOrNumberBall from './HandicapRectOrNumberBall'
import types from '@store/modules/mutation-types'
import { mapMutations } from 'vuex'
export default {
  name: 'HandicapLayout',
  components: { HandicapRectOrNumberBall },
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
    },
    ballOdds: {
      type: Array,
      default () {
        return this.ballOdds
      }
    },
    playCodes: {
      type: Array,
      default () {
        return this.playCodes
      }
    }
  },
  data () {
    return {
      betMoney: 0
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
      payload.rowLabel = this.rowLabel
      payload.betMoney = this.betMoney
      this.ballSelected(payload)
    },
    clearSelectedClick () {
      this.$children.forEach(item => {
        item.clearBallSelected()
      })
      this.ballSelected({
        labelIndex: this.rowObj.ballIndex,
        balls: this.$children
      })
    },
    ...mapMutations('lottery', {
      ballSelected: types.BALL_CLICK_HANDICAP
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
    flex-direction: column;
    .label_style {
      display: flex;
      width: 100%;
      height: 8vw;
      align-items: center;
      color: $color-blue;
      margin: 0 40px;
      font-weight: bold;
      font-size: 30px;
      // display: none;
      padding-top: 20px;
    }
    .ball_layout {
      display: inline-flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      justify-content: center;
      margin: 0 40px;
      .ball_style {
        margin-right: 30px;
      }
    }
    .ball_layout_label:after {
        // content: "";
        flex: auto;
    }
  }
}
</style>
