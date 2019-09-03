import * as types from './mutation-types'

const UserInfo = {
  state: {
    token: ''
  },
  getters: {
    token (state) {
      return state.token
    }
  },
  mutations: {
    [types.SAVE_TOKEN] (state, payload) {
      state.token = payload.token
    }
  },
  actions: {

  }

}

export default UserInfo
