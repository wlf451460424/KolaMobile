<template>
  <div
    v-if="isShow"
    ref="result_div"
    class="result_div"
  >
    <div class="result_head">
      <div class="result_ico">
        <img src="@/assets/lotteryIcon/cqssc.png">
      </div>
      <div class="result_title">
        <p class="p_title">
          <span class="p_title_name">{{ getLotteryName }}&nbsp;&nbsp;</span>第<span class="p_title_iusse">{{ items[0].iusse }}</span>期&nbsp;&nbsp;开奖结果
        </p>
        <p class="p_ball">
          <ul>
            <li
              v-for="(item, index) in items[0].result.split(' ')"
              :key="index"
            >
              <span>{{ item }}</span>
            </li>
          </ul>
        </p>
      </div>
    </div>
    <div class="result_list_div">
      <ul>
        <li
          v-for="(item, index) in items"
          :key="index"
        >
          <span class="iusse">{{ item.iusse }}</span>
          <span class="result">
            <ul>
              <li
                v-for="(it, i) in item.result.split(' ')"
                :key="i"
              >
                <span>{{ it }}</span>
              </li>
            </ul>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: { // 传入的数组  eg:[{ iusse: '201908007000', result: '1 2 3 4 5' }]
      type: Array,
      default: undefined
    },
    isShow: { // 是否显示。也可以直接在父组件定义数据绑定  控制显示。
      type: Boolean,
      default: false
    },
    lotteryName: {
      type: String,
      default: ''
    }
  },
  computed: {
    getLotteryName () {
      return this.lotteryName
    }
  }
}
</script>
<style lang="scss" scoped>
.result_div{
  width: 100%;
  height: 540px;
  background-color: #ffffff;
  margin: 20px;
  .result_head{
    width: 100%;
    height: 140px;
    .result_ico{
      float: left;
      width: 25%;
      height: 100%;
      img{
        width: 120px;
        height: 120px;
      }
    }
    .result_title{
      float: left;
      width: 75%;
      height: 100%;
      text-align: center;
      p {
        // background: #9dbdc5;
      }
      .p_title{
        height: 60px;
        line-height: 60px;
        .p_title_name{
          font-size: 30px;
          font-weight: bold;
        }
        .p_title_iusse{
          font-weight: bold;
          color: $color-blue;
        }
      }
      .p_ball{
        height: 80px;
        line-height: 80px;
        color: #ffffff;
        font-size: 36px;
        ul{
          white-space:nowrap;
          li {
            display: inline;
            list-style-type: none;
            span{
              background-color: #FF605E;
              width: 60px;
              height: 60px;
              line-height: 60px;
              border-radius: 60px;
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
  .result_list_div{
    height: 370px;
    overflow: hidden;
    overflow-y:auto;
  }
  ul li{
    width: 100%;
    height: 60px;
    line-height: 60px;
    span{
      display: inline-block;
      // background: #9dbdc5;
    }
    .iusse{
      width: 25%;
      height: 100%;
    }
    .result{
      width: 75%;
      line-height: 60px;
      height: 60px;
      color: #ffffff;
      font-size: 28px;
      ul li {
        display: inline;
        list-style-type: none;
        span{
          background-color: #5095fd;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 40px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
