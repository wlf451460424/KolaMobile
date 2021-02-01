<template>
  <span
    class="ball"
    :class="{active: isActive}"
    @click="ballClick"
  >
    {{ ballText }}
  </span>
</template>
<script>
export default {
  props: {
    ballText: {
      type: String,
      required: true,
      default: ''
    },
    ballValue: {
      type: String,
      default () {
        return this.ballText
      }
    },
    ballIndex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    ballClick () {
      this.isActive = !this.isActive
      this.$emit('ball-click', { ballText: this.ballText, ballValue: this.ballValue, isActive: this.isActive, ballIndex: this.ballIndex })
      this.$bus.$emit('calcNotes')
    },
    toggleBall () {
      this.isActive = !this.isActive
    }
  }
}
</script>
<style lang="scss" scoped>
.ball {
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 4px solid $color-blue;
  border-radius: 50%;
  background-color: white;
  font-size: 36px;
  font-weight: bold;
  color: $color-blue;
}
.active {
  background-color: $color-blue;
  color: white;
}
</style>
