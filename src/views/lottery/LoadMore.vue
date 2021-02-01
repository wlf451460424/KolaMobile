<template>
  <div
    class="load-more-wrapper"
    @touchstart="touchStart($event)"
    @touchend="touchEnd($event)"
  >
    <div class="inner">
      <slot />
      <div
        v-show="enableLoadMore"
        class="load-more"
      >
        {{ loadMoreText }}
      </div>
      <div
        v-show="!enableLoadMore"
        class="load-end"
      >
        <!-- 我是有底线的！ -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoadMore',
  props: {
    enableLoadMore: {
      type: Boolean,
      default: true
    },
    onLoadMore: {
      type: Function,
      default: undefined,
      require: false
    }
  },
  data () {
    return {
      loadMoreText: '加载更多',
      startX: 0,
      startY: 0,
      isLoading: false
    }
  },
  methods: {
    touchStart (e) {
      this.startY = e.targetTouches[0].pageY
      this.startX = e.targetTouches[0].pageX
    },
    scrollToEnd (e) {
      let scrollHeight = this.$el.scrollHeight
      let clientHeight = this.$el.clientHeight
      let scrollTop = this.$el.scrollTop

      if (scrollTop + clientHeight >= scrollHeight || this.enableLoadMore) {
        this.doLoadMore()
      }
    },
    touchEnd (e) {
      if (this.isLoading) {
        return
      }

      let endX = e.changedTouches[0].pageX
      let endY = e.changedTouches[0].pageY
      let dy = this.startY - endY
      let dx = endX - this.startX
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return
      }
      if (endY < this.startY) {
        this.scrollToEnd(e)
      }
    },
    doLoadMore () {
      this.isLoading = true
      this.loadMoreText = '加载中...'
      this.onLoadMore(this.loadDone)
    },
    loadDone () {
      this.isLoading = false
      this.loadMoreText = '加载更多'
    }
  }
}
</script>
<style lang="scss" scoped>
.load-more-wrapper {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    transition-duration: 300ms;
    .load-more, .load-end {
        color: #999;
        font-size: .3rem;
        margin: .5rem 0;
        text-align: center;
    }
}
</style>
