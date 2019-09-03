export default [
  {
    name: 'betting',
    path: '/betting/:lottery_kind/:lottery_index',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import(/* webpackChunkName: "lottery" */ '@views/lottery/betting/BettingPage')
  },
  {
    name: 'CheckOutPage',
    path: '/CheckOutPage',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import(/* webpackChunkName: "lottery" */ '@views/lottery/CheckOutPage')
  },
  {
    name: 'ChasingNumberPage',
    path: '/ChasingNumberPage',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import(/* webpackChunkName: "lottery" */ '@views/lottery/chasingNumber/ChasingNumberPage')
  }
]
