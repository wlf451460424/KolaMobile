import * as types from './mutation-types'

const Lottery = {
  state: {
    selectedBalls: [[], [], [], [], []],
    selectedBallsHandicap: [],
    selectedBallsPosition: [],
    shoppingBasket: [],
    lottery_no: 0,
    lottery_name: '',
    lottery_type: 1,
    lottery_rebate: 1900,
    merchant_rebate: 1900,
    bet_single_amount: 2,
    lottery_play_id: 3
  },
  getters: {

  },
  mutations: {
    [types.SELECTED_BALLS_POSITION] (state, payload) {
      state.selectedBallsPosition = []
      state.selectedBallsPosition = payload.positionArray
    },
    [types.SINGLE_NUMBER_ADD_RENXUAN] (state, payload) {
      state.selectedBallsPosition = []
      state.selectedBallsPosition = payload.positionArray
      state.selectedBalls[0] = []
      state.selectedBalls[0].push({
        ballText: payload.numberArr,
        ballValue: payload.numberArr
      })
    },
    [types.SINGLE_NUMBER_ADD] (state, payload) {
      state.selectedBalls[0] = []
      state.selectedBalls[0].push({
        ballText: payload.numberArr,
        ballValue: payload.numberArr
      })
    },
    [types.BALL_CLICK] (state, payload) {
      payload.balls.forEach(element => {
        if (element.isActive) {
          if (!state.selectedBalls[payload.labelIndex].map(item => { return item.ballText }).includes(element.ballText)) {
            state.selectedBalls[payload.labelIndex].push({ ballText: element.ballText, ballValue: element.ballValue })
          }
        } else {
          state.selectedBalls[payload.labelIndex].splice(state.selectedBalls[payload.labelIndex].findIndex(item => item.ballText === element.ballText), 1)
        }
      })
    },
    [types.BALL_CLICK_HANDICAP] (state, payload) {
      if (payload.isActive) {
        if (!state.selectedBallsHandicap.map(item => { return item.playCode }).includes(payload.playCode)) {
          state.selectedBallsHandicap.push(payload)
        }
      } else {
        state.selectedBallsHandicap.splice(state.selectedBallsHandicap.findIndex(item => item.playCode === payload.playCode), 1)
      }
    },
    [types.SELECTED_BALLS_CLEAR] (state) {
      state.selectedBalls.forEach(item => {
        item.splice(0, item.length)
      })
      state.selectedBallsHandicap.splice(0, state.selectedBallsHandicap.length)
    },
    [types.SHOPPING_BASKET_ADD] (state, payload) {
      let shoppingIndex = ''
      state.shoppingBasket.map((item, index) => {
        if (payload.playCode === item.playCode) {
          shoppingIndex = index
        }
      })
      if (shoppingIndex !== '') {
        state.shoppingBasket[shoppingIndex] = payload
      } else {
        state.shoppingBasket.unshift(payload)
      }
    },
    [types.ORDER_DELETE] (state, payload) {
      state.shoppingBasket.splice(payload, 1)
    },
    [types.DELETE_ALL_ORDERS] (state) {
      state.shoppingBasket.splice(0, state.shoppingBasket.length)
    },
    [types.SAVE_LOTTERY_CONFIG] (state, payload) {
      state.merchant_rebate = payload.merchant_rebate
      state.bet_single_amount = payload.bet_single_amount
    },
    [types.SAVE_LOTTERY_INFO] (state, payload) {
      state.lottery_rebate = payload.lottery_rebate
      state.lottery_no = payload.lottery_no
      state.lottery_name = payload.lottery_name
      state.lottery_type = payload.lottery_type
    },
    [types.SAVE_LOTTERY_PLAY_INFO] (state, payload) {
      state.lottery_play_id = payload.lottery_play_id
    }
  },
  actions: {
    getChaseIssue ({ commit }, params) {
      return new Promise((resolve, reject) => {
        this.$api.lottery.getChaseIssue(params).then(result => {
          const data = result.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }

}

export default Lottery
