<template>
  <span
    class="rectball"
    :class="{rectballactive: isActive}"
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
      this.$emit('ball-click', { ballText: this.ballText, ballValue: this.ballValue, isActive: this.isActive })
    }
  }
}
</script>
<style lang="scss" scoped>
.rectball {
  width: 90px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border: 4px solid $color-blue;
  border-radius: 4px;
  background-color: white;
  font-size: 28px;
  font-weight: bold;
  color: $color-blue;
}
.rectballactive {
  background-color: $color-blue;
  color: white;
}
</style>
