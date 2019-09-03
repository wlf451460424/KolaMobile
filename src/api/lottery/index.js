import axios from '@api/request'
// import qs from 'qs'

const lottery = {
  // 商户销售彩种
  getMerchSaleLotteryList (params) {
    return axios.post('/player/lottery/sale/list', JSON.stringify(params))
  },
  // 获取开启玩法
  getLotterySalePlay (params) {
    return axios.post('/player/lottery/play/list', JSON.stringify(params))
  },
  // 获取余额
  getMoney (params) {
    return axios.post('/fund/available_balance/get', JSON.stringify(params))
  },
  // 获取期号
  getIssue (params) {
    return axios.post('/player/lottery/current_issue', JSON.stringify(params))
  },
  // 投注/api/player/lottery/order/bet
  bet (params) {
    return axios.post('/player/lottery/order/bet', JSON.stringify(params))
  }
}

export default lottery
