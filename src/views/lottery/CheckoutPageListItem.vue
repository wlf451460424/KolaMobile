<template>
  <div>
    <div
      v-if="lotteryMode === 0"
      class="list-item"
    >
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
    <div
      v-else
      class="list-item"
    >
      <p>{{ item.rowLabel }}：{{ item.ballText }}</p>
      <p class="p_1">
        <span>赔率：{{ item.ballOdd }}</span>
        <img
          src="@assets/del.png"
          @click="del(index)"
        >
      </p>
      <p class="p_2">
        <cube-input
          v-model="betAmount"
          type="number"
          :placeholder="item.totalMoney || '请输入金额'"
          class="cube-text-style"
          @change="changeOrderMoney"
        />
        <span>元</span>
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
    },
    lotteryMode: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      betAmount: ''
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
  mounted () {
    // this.betAmount = this.item.totalMoney
  },
  updated () {
    // this.betAmount = this.item.totalMoney
  },
  methods: {
    changeOrderMoney (val) {
      this.$emit('changeOrderMoney', { itemObj: this.item, betMoney: this.betAmount })
    },
    del (val) {
      this.$emit('orderDelete', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item{
    height: 190px;
    margin: 0 20px 20px 20px;
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
            width: 50px;
            height: 50px;
        }
    }
    .p_1 span{
        width: 50%;
    }
    .p_2 {
      width: 80%;
      display: flex;
      span {
        width: 30%;
        margin-left: 4vw;
      }
      .item_money {
        color: $color-light-red;
        font-size: 40px;
      }

    }
}

.cube-input{
  line-height: 1;
  height: 8vw;
}
::v-deep .cube-input::after{
  // border-color: rgb(255, 255, 255) transparent transparent transparent;
  // border-color: rgba($color: #000000, $alpha: 0.3)
  border: 2vw solid #DCDCDC;
}
::v-deep .cube-input-field{
     line-height: normal;
     padding: 2vw;
  }
</style>
