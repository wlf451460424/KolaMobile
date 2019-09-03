import Vue from 'vue'
import Router from 'vue-router'
import Home from '@router/home'
import Lottery from '@router/lottery'
import Record from '@router/record'
import NotFound from '@components/NotFound'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...Home,
    ...Lottery,
    ...Record,
    {
      path: '*', component: NotFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
