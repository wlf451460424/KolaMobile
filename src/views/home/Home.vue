<template>
  <vue-drawer-layout
    ref="drawer"
    :enable="true"
    :animatable="true"
    :content-drawable="true"
    :backdrop="true"
    :z-index="0"
    :backdrop-opacity-range="[0,0.4]"
    @slide-start="handleSlideStart"
    @slide-move="handleSlideMove"
    @slide-end="handleSlideEnd"
    @mask-click="handleMaskClick"
  >
    <template
      v-slot:drawer
      class="drawer-content"
    >
      <!-- drawer-content -->
      <draw-menu />
    </template>
    <template v-slot:content>
      <!-- main-content -->
      <draw-content
        @open-drawer="openDrawer"
      />
    </template>
  </vue-drawer-layout>
</template>

<script>
// @ is an alias to /src
import DrawMenu from '@views/home/DrawMenu'
import DrawContent from '@views/home/DrawContent'
export default {
  name: 'Home',
  components: {
    DrawMenu,
    DrawContent
  },
  data () {
    return {
    }
  },
  methods: {
    handleSlideStart () {

    },
    handleSlideMove () {

    },
    handleSlideEnd () {

    },
    handleMaskClick () {
      this.$refs.drawer.toggle(false)
    },
    openDrawer () {
      this.$refs.drawer.toggle(true)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
