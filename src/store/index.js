import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import mutations from './mutations'
import actions from './actions'
import camelCase from 'camelcase'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const context = require.context('./modules', true, /index.js$/)
let modules = {}

context.keys().forEach(key => {
  const fileName = key.substring(2, key.length - 9)
  const fileNameInCamelCase = camelCase(fileName)
  const fileModule = context(key).default
  modules[fileNameInCamelCase] = {
    ...fileModule,
    namespaced: true
  }
})

// let cookieStorage = {
//   getItem: key => Cookies.get(key),
//   setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
//   removeItem: key => Cookies.remove(key)
// }

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  mutations,
  actions,
  modules,
  plugins: [
    createPersistedState({
      paths: ['userInfo.token'],
      getState: (key) => Cookies.getJSON(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 3 })
    })
  ]
})
