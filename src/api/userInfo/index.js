import axios from '@api/request'

// import qs from 'qs'

const userInfo = {

  // 玩家信息
  getUserInfo () {
    return axios.post('/player/account/detail')
  },
  getBalance () {
    return axios.post('player/fund/balance')
  }
}

export default userInfo
