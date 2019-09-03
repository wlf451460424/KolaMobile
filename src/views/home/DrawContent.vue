<template>
  <div>
    <app-header title="首页">
      <template v-slot:left>
        <a>
          <i
            class="cubeic-person"
            @click="openDrawer"
          />
        </a>
      </template>
    </app-header>
    <div class="collapsePanel">
      <cube-scroll
        ref="scroll"
        :data="activeLottery"
      >
        <vm-collapse
          v-model="activityNames"
          closable
        >
          <vm-collapse-item
            v-for="(item, index) in activeLottery"
            :key="index"
            :name="item.key"
          >
            <template v-slot:header>
              <div class="categoryHeader">
                {{ item.key }}
                <i class="cubeic-select" />
              </div>
            </template>
            <div class="collapseItem">
              <lottery-item
                v-for="(lottery, i) in item.values"
                :key="i"
                class="lotteryItem"
                :lottery-name="lottery.lotteryName"
                :img-src="require(`@assets/ic_lottery/lottery_${lottery.lotteryId}@2x.png`)"
                @lottery-item-click="itemClick(index, i, lottery.lotteryId)"
              />
            </div>
          </vm-collapse-item>
        </vm-collapse>
      </cube-scroll>
    </div>
  </div>
</template>
<script>
import LotteryItem from './LotteryItem'
// import MathUtils from '@utils/math-utils'
import Lottery from '@common/lottery-json'
export default {
  components: {
    LotteryItem
  },
  data () {
    return {
      SaleLotteryList: []
    }
  },
  computed: {
    activityNames: {
      get () {
        return this.activeLottery.map(item => {
          return item.key
        })
      },
      set () {

      }
    },
    activeLottery: {
      get () {
        return Lottery.map(item => {
          return { key: Object.keys(item)[0], values: Object.values(item)[0] }
        })
      },
      set (val) {
      }
    }
  },
  mounted () {
    // 获取当前期号 时间
    this.getMerchSaleLotteryList()
  },
  methods: {
    getMerchSaleLotteryList () {
      this.$api.lottery.getMerchSaleLotteryList().then(res => {
        // this.save(res.data.data)
        res.data.data.map(
          item => {
            this.SaleLotteryList.push(item.lottery_number)
          }
        )
      })
    },
    itemClick (lotteryKind, lottery, lotteryId) {
      if (this.SaleLotteryList.indexOf(Number(lotteryId)) === -1) {
        return this.$toast.showText(`彩种已停售`)
      } else {
        this.$router.push({ path: `/betting/${lotteryKind}/${lottery}` })
      }
    },
    openDrawer () {
      this.$emit('open-drawer')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@styles/_var.scss';
.collapsePanel {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  height: calc(90vh);
  .categoryHeader {
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
    border-left-width: 6px;
    border-left-style: solid;
    border-color: $color-light-green;
    font-size: 24px;
    font-weight: bold;
    i {
      margin-left: auto;
      margin-right: 20px;
    }
  }
  .collapseItem {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: $color-light-gray;
    .lotteryItem {
      margin-top: 0.3%;
      background-color: white;
      margin-left: 0.3333%;
      width: 33%;
      height: calc(100vw/3);
    }
    .lotteryItem:nth-child(3n+1) {
      margin-top: 0.3%;
      background-color: white;
      width: 33%;
      height: calc(100vw/3);
    }
  }
  .collapseItem:after {
    content: "";
    flex: auto;
  }
}
</style>
