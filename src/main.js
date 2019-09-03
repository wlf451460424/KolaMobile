import Vue from 'vue'
import 'normalize.css'
import '@plugins/cube/cube-ui'
import '@plugins/exception'
import '@plugins/api'
import '@plugins/bus'
import '@plugins/toast'
import AppHeader from '@plugins/app-header'
// import '@/mock'
import 'vc-popup/lib/style.css'
import VmCollapse from '@components/collapse'
import DrawerLayout from 'vue-drawer-layout'
import vueg from 'vueg'
import Navigation from 'vue-navigation'
import PopUp from 'vc-popup'
import request from '@api/request'
import App from './App'
import router from '@router'
import store from '@store'
Vue.use(AppHeader)
Vue.use(VmCollapse)
Vue.use(DrawerLayout)
Vue.use(Navigation, { router, store })
Vue.use(PopUp)
Vue.use(vueg, router, {
  duration: 0.3
})
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

  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.userInfo.token) {
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
