<template>
  <div>
    <div class="list-item">
      <p>{{ item.betContent.ballTexts }}</p>
      <p class="p_1">
        <span>{{ playName }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>模式：{{ modeName }}</span>
        <img
          src="@assets/del.png"
          @click="del(index)"
        >
      </p>
      <p class="p_2">
        <span>{{ item.notes }}注</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>{{ item.multipleValue }}倍</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="item_money">{{ item.totalMoney }}</span>元
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    playName () {
      return Object.values(this.item.play.playName).join('-')
    },
    modeName () {
      return this.item.mode[1]
    }
  },
  methods: {
    del (val) {
      this.$emit('orderDelete', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item{
    height: 180px;
    margin: 0 20px 15px 20px;
    border: 2px solid #DCDCDC;
    border-radius: 15px;
    text-align: left;
    padding: 10px 20px 10px 20px;
    font-size: 26px;
    p{
        overflow:hidden;
        white-space:nowrap;
        text-overflow: ellipsis;
        height: 60px;
        line-height: 60px;
        img{
            float: right;
            width: 60px;
            height: 60px;
        }
    }
    .p_1 span{
        width: 50%;
    }
    .p_2 {
      span {
        width: 30%;
      }
      .item_money {
        color: $color-light-red;
        font-size: 40px;
      }

    }
}
</style>
