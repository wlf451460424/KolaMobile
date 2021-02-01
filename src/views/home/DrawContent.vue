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
      <template v-slot:right>
        <cube-select
          v-model="value"
          :options="options"
          @change="change"
        />
      </template>
    </app-header>
    <el-carousel
      height="30px"
      indicator-position="none"
      arrow="never"
    >
      <div
        v-show="isSystemNotify === '1'"
        style="display:flex;"
      >
        <div style="display:flex;height:30px;align-items: center;text-align: left;padding:0 5px;background-color:#ffffff;z-index:2">
          公告：
        </div>
        <div style="height:30px;background-color:#ffffff;z-index:1">
          <el-carousel-item
            v-for="(item, i) in newsData"
            :key="i"
          >
            <div>{{ item.title }}</div>
            <!-- <div>【{{ item.title }}】: {{ item.content }}</div> -->
          </el-carousel-item>
        </div>
      </div>
    </el-carousel>

    <div class="collapsePanel">
      <cube-scroll
        ref="scroll"
        :data="allLotteryList"
      >
        <vm-collapse
          v-model="activityNames"
          closable
        >
          <vm-collapse-item
            v-for="(item, index) in allLotteryList"
            :key="index"
            :name="item.type_code"
          >
            <template v-slot:header>
              <div class="categoryHeader">
                {{ item.lottery_type_name }}
                <i class="cubeic-select" />
              </div>
            </template>
            <div class="collapseItem">
              <lottery-item
                v-for="(lottery, i) in item.lottery_list"
                :key="i"
                class="lotteryItem"
                :lottery-name="lottery.lottery_name"
                :img-src="require(`@assets/ic_lottery/lottery_${lottery.lottery_no > 35 ? 1 : lottery.lottery_no}@2x.png`)"
                @lottery-item-click="itemClick(index, i, lottery,item.lottery_type_no)"
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
import types from '@store/modules/mutation-types'
import { mapMutations } from 'vuex'
import LotteryUtils from '@utils/lottery-utils'
export default {
  components: {
    LotteryItem
  },
  data () {
    return {
      SaleLotteryList: [],
      allLotteryList: [],
      newsData: [],
      isSystemNotify: '1',
      options: ['中文', '英文'],
      value: '中文'
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
    this.getAllLotteryList()
  },
  methods: {
    change (value, index, text) {
      console.log(index + ':' + value)
    },
    getAllLotteryList () {
      this.$api.lottery.getLotteryNav().then(res => {
        this.allLotteryList = res.data.data
        this.getMerchSaleLotteryList()
        this.getPlayerInfo()
        this.getCurrentMoney()
        this.getLotteryConfig()
        this.getNoticeList()
      })
    },
    getMerchSaleLotteryList () {
      this.$api.lottery.getMerchSaleLotteryList().then(res => {
        // this.save(res.data.data)
        res.data.data.map(
          item => {
            this.SaleLotteryList.push(item.lottery_no)
          }
        )
      })
    },
    itemClick (lotteryKind, lottery, lotteryObj, lotteryType) {
      this.saveLotteryInfo({
        lottery_no: lotteryObj.lottery_no,
        lottery_name: lotteryObj.lottery_name,
        lottery_rebate: lotteryObj.rebate,
        lottery_type: lotteryType
      })
      LotteryUtils.singleQuota = lotteryObj.single_quota
      LotteryUtils.supportedMode = lotteryObj.supported_play_mode
      if (this.SaleLotteryList.indexOf(Number(lotteryObj.lottery_no)) === -1) {
        return this.$toast.showText(`彩种已停售`)
      } else {
        this.$router.push({ path: `/betting/${lotteryKind}/${lottery}` })
      }
    },
    openDrawer () {
      this.$emit('open-drawer')
    },
    // 玩家信息
    getPlayerInfo () {
      this.$api.userInfo.getUserInfo().then(res => {
        const result = res.data.data
        this.saveUserInfo({
          playerName: result.player_name,
          playerId: result.player_id,
          rebate: result.rebate
        })
      })
    },
    // 获取当前余额
    getCurrentMoney () {
      this.$api.userInfo.getBalance().then(res => {
        this.saveBalance({
          balance: res.data.data
        })
      })
      // this.$store.dispatch('userInfo.getBalance')
    },
    getLotteryConfig () {
      this.$api.lottery.getConfigInfo().then(res => {
        const result = res.data.data
        LotteryUtils.maxBetMultiple = result.max_bet_multiple
        this.saveConfig({
          merchant_rebate: result.rebate,
          bet_single_amount: result.bet_single_amount ? result.bet_single_amount : 2
        })
        LotteryUtils.singleMode = result.single_mode
        LotteryUtils.soloMode = result.solo_mode
        this.isSystemNotify = result.is_system_notify
      })
    },
    getNoticeList () {
      this.$api.record.getNoticeList().then(res => {
        const newNoticeList = []
        const _noticeList = res.data.data
        Object.keys(_noticeList).forEach(key => {
          _noticeList[key].content = decodeURIComponent(
            _noticeList[key].content
          ).replace(/<[^>]+>/g, '')
          newNoticeList.push(_noticeList[key])
        })
        this.newsData = newNoticeList
      })
    },
    ...mapMutations('userInfo', {
      saveUserInfo: types.SAVE_USER_INFO,
      saveBalance: types.SAVE_BALANCE
    }),
    ...mapMutations('lottery', {
      saveConfig: types.SAVE_LOTTERY_CONFIG,
      saveLotteryInfo: types.SAVE_LOTTERY_INFO
    })
  }
}
</script>
<style lang="scss" scoped>
@import '@styles/_var.scss';
.collapsePanel {
  display: flex;
  flex-direction: column;
  margin-top: 1vw;
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
.el-carousel__item{
  // position: inherit !important;
  align-items: center;
  display: flex;
  background-color: white;
}
.el-carousel__item div {
  // color: #475669;
  font-size: 14px;
  opacity: 0.75;
  // line-height: 60px;
  // height: 60px;
  margin: 0;
  text-align: left;
  padding-left: 15vw;
}

.cube-select{
  color: #ffffff !important;
  background: rgba($color: $color-blue, $alpha: 1) !important;
}
::v-deep .cube-select-icon{
  border-color: rgb(255, 255, 255) transparent transparent transparent;
}
</style>
