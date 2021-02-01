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
          :ball-index="index"
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
      lottery_no: state => state.lottery_no,
      lottery_type: state => state.lottery_type,
      selectPlayId: state => state.lottery_play_id,
      selectedBalls: state => state.selectedBalls
    })
  },
  methods: {
    ballClick (payload) {
      if (this.lottery_type === 2 && /^(4|7|11|14|34|35|36|37|38|39|40)$/.test(this.selectPlayId)) {
        var numCount = 0
        switch (this.selectPlayId) {
          case 4:
          case 7:
          case 35:
            numCount = 2
            break
          case 11:
          case 14:
          case 34:
            numCount = 1
            break
          case 36:
            numCount = 3
            break
          case 37:
            numCount = 4
            break
          case 38:
            numCount = 5
            break
          case 39:
            numCount = 6
            break
          case 40:
            numCount = 7
            break
        }
        let betArray = this.selectedBalls
        if (betArray[0].length === numCount && !(betArray[0].map(item => { return item.ballText }).includes(payload.ballText)) && this.rowObj.ballIndex === 0) {
          payload.isActive = false
          this.$children[payload.ballIndex].toggleBall()
          this.$toast.showText('胆码最多选' + numCount + '个!')
          return
        } else if (this.rowObj.ballIndex === 1) {
          if (betArray[0].length > 0 && betArray[0].map(item => { return item.ballText }).includes(payload.ballText)) {
            payload.isActive = false
            this.$children[payload.ballIndex].toggleBall()
            this.$toast.showText('已选择相应胆码!')
            return
          }
        } else if (this.rowObj.ballIndex === 0) {
          if (betArray[1].length > 0 && betArray[1].map(item => { return item.ballText }).includes(payload.ballText)) {
            payload.isActive = false
            this.$children[payload.ballIndex].toggleBall()
            this.$toast.showText('已选择相应拖码!')
            return
          }
        }
      }
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
    // height: 220px;
    // background-color: white;
    .label_style {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 60px;
      flex-wrap: wrap;
      width: 100px;
      // height: 220px;
      margin: 0 2px;
      color: $color-blue;
      font-size: 30px;
      text-align: center;
      // display: none;
      writing-mode: tb;
    }
    .ball_layout {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      margin: 0 20px;
      .ball_style {
        margin: 0 30px 30px 0;
      }
    }
    .ball_layout_label:after {
      content: "";
      flex: auto;
    }
  }
}
</style>
