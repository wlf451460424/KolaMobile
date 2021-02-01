import axios from '@api/request'

// import qs from 'qs'

const lottery = {

  // 配置信息
  getConfigInfo () {
    return axios.post('/player/global_info/get')
  },
  // 商户销售彩种
  getMerchSaleLotteryList (params) {
    return axios.post('/player/lottery/sale/list', JSON.stringify(params))
  },
  // 获取开启玩法
  getLotterySalePlay (params) {
    return axios.post('/player/lottery/play/list', params)
  },
  // 获取期号
  getIssue (params) {
    return axios.post('/metadata/current_issue', params)
  },
  // 投注/api/player/lottery/order/bet
  bet (params) {
    return axios.post('/player/lottery/bet', params)
  },
  getHisnumList (params) {
    return axios.get('/metadata/lottery/history_number?lotteryNo=' + params.lotteryNo + '&size=10')
  },
  getLotteryNav () {
    return axios.post('/player/lottery/nav_list')
  },
  // 获取彩种玩法奖金
  getLotteryAward (params) {
    return axios.post('/player/lottery/award_level/get', params)
  },
  getChaseIssue (params) {
    return axios.post('/metadata/lottery/issue', params)
  },
  getSoloInfo (params) {
    return axios.post('/player/lottery/solo/get', params)
  },
  getHandicapAward (params) {
    return axios.post('/player/lottery/award_level/credit_mode/get', params)
  }
}

export default lottery
