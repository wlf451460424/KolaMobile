<template>
  <div style="display:flex;flex-direction: column;margin-bottom: 2vw;">
    <number-ball
      v-if="isNum"
      :ball-text="ballText"
      :ball-value="ballValue"
      :ball-odd="ballOdd"
      :play-code="playCode"
      @ball-click="ballClick"
    />
    <rect-number-ball
      v-else
      :ball-text="ballText"
      :ball-value="ballValue"
      :ball-odd="ballOdd"
      :play-code="playCode"
      @ball-click="ballClick"
    />
    <span style="line-height:20px">{{ ballOdd }}</span>
  </div>
</template>

<script>
import NumberBall from './NumberBall'
import RectNumberBall from './RectNumberBall'
export default {
  components: {
    NumberBall,
    RectNumberBall
  },
  props: {
    ballOdd: {
      type: String,
      require: true,
      default: ''
    },
    ballText: {
      type: String,
      required: true,
      default: ''
    },
    ballValue: {
      type: String,
      required: true,
      default: ''
    },
    playCode: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    isNum () {
      return !isNaN(Number(this.ballText))
    }
  },
  methods: {
    getBall () {
      return this.$children[0]
    },
    ballClick (payload) {
      payload.playCode = this.playCode
      payload.ballOdd = this.ballOdd
      this.$emit('ball-click', payload)
    },
    clearBallSelected () {
      this.$children.forEach(item => {
        item.isActive = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
