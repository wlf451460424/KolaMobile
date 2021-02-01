import 'normalize.css'
import '@plugins/cube/cube-ui'
import '@plugins/exception'
import '@plugins/api'
import '@plugins/bus'
import '@plugins/toast'
import 'vc-popup/lib/style.css'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import AppHeader from '@plugins/app-header'
import AppHeaderLottery from '@plugins/app-header-lottery'
import DrawerLayout from 'vue-drawer-layout'
import ElementUI from 'element-ui'
import Navigation from 'vue-navigation'
import PopUp from 'vc-popup'
import VmCollapse from '@components/collapse'
import Vue from 'vue'
import { getToken } from '@/utils/auth'
import request from '@api/request'
import router from '@router'
import store from '@store'
import vueg from 'vueg'

// import '@/mock'

Vue.use(AppHeader)
Vue.use(AppHeaderLottery)
Vue.use(VmCollapse)
Vue.use(DrawerLayout)
Vue.use(Navigation, { router, store })
Vue.use(PopUp)
Vue.use(vueg, router, {
  duration: 0.3
})
Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || to.name
  // 路由发生变化时取消当前页面网络请求
  Object.keys(request.sources).forEach(item => {
    request.sources[item]('取消当前页面请求')
  })
  for (var key in request.sources) {
    delete request.sources[key]
  }
  const hasToken = getToken(to.query.token)
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (hasToken) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
        replace: true
      })
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
