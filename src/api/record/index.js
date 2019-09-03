import base from '@api/base'
import axios from '@api/request'
// import qs from 'qs'

const record = {

  /**
   *
   * @param {Object} param
   */
  getRecord (params) {
    return axios.post(`${base.address}/getRecord`, JSON.stringify(params))
  }

}

export default record
