export default [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "home" */ '@views/Login')
  },
  {
    name: 'home',
    path: '/',
    alias: '/home',
    meta: {
      title: '首页',
      requireAuth: true
    },
    component: () => import(/* webpackChunkName: "home" */ '@views/home/Home')
  }
]
