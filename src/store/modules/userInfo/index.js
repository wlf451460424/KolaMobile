import * as types from './mutation-types'

const UserInfo = {
  state: {
    token: '',
    playerName: '',
    playerId: 0,
    rebate: 1900,
    balance: 0
  },
  getters: {
    token (state) {
      return state.token
    }
  },
  mutations: {
    [types.SAVE_TOKEN] (state, payload) {
      state.token = payload.token
    },
    [types.SAVE_USER_INFO] (state, payload) {
      state.playerId = payload.playerId
      state.playerName = payload.playerName
      state.rebate = payload.rebate
    },
    [types.SAVE_BALANCE] (state, payload) {
      state.balance = payload.balance
    }
  },
  actions: {
    getBalance ({ commit }) {
      return new Promise((resolve, reject) => {
        this.$api.userInfo.getBalance()().then(({ data }) => {
          commit('SAVE_BALANCE', { balance: data })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }

}

export default UserInfo
