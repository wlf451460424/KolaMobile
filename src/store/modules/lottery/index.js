import * as types from './mutation-types'

const Lottery = {
  state: {
    selectedBalls: [[], [], [], [], []],
    shoppingBasket: []
  },
  getters: {

  },
  mutations: {
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
    [types.SELECTED_BALLS_CLEAR] (state) {
      state.selectedBalls.forEach(item => {
        item.splice(0, item.length)
      })
    },
    [types.SHOPPING_BASKET_ADD] (state, payload) {
      state.shoppingBasket.unshift(payload)
    },
    [types.ORDER_DELETE] (state, payload) {
      state.shoppingBasket.splice(payload, 1)
    },
    [types.DELETE_ALL_ORDERS] (state) {
      state.shoppingBasket.splice(0, state.shoppingBasket.length)
    }
  },
  actions: {

  }

}

export default Lottery
