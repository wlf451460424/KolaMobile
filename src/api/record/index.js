import axios from '@api/request'
import base from '@api/base'

// import qs from 'qs'

const record = {

  /**
   *
   * @param {Object} param
   */
  getRecord (params) {
    return axios.post(`${base.address}/getRecord`, JSON.stringify(params))
  },
  // 投注记录
  getBetRecordList (params) {
    return axios.post('/player/bet_order/page_list', params)
  },
  // 投注详情
  getBetRecordDetail (params) {
    return axios.post('/player/bet_order/detail', params)
  },
  // 投注记录撤单
  betRecordCancelOrder (params) {
    return axios.post('/player/bet_order/cancel', params)
  },
  // 帐变记录
  getFundRecord (params) {
    return axios.post('/player/fund/change/page_list', params)
  },
  // 追号记录
  getChaseOrderList (params) {
    return axios.post('/player/chase_plan/page_list', params)
  },
  // 追号记录详情
  getChaseOrderDetail (params) {
    return axios.post('/player/chase_plan/detail', params)
  },
  // 追号记录详情 撤单
  chaseDetailCancelOrder (params) {
    return axios.post('/player/chase_plan/cancel_order', params)
  },
  // 每日统计
  getDailyStatistics (params) {
    return axios.post('/player/report/daily_statistics', params)
  },
  // 系统公告
  getNoticeList () {
    return axios.post('/player/account/system_notice')
  }
}

export default record
