import axios from '@api/request'
// import qs from 'qs'

const login = {

  // 登录
  login (params) {
    return axios.post('/player/account/login', JSON.stringify(params))
  }
}

export default login
