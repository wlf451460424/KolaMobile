export default [
  {
    name: 'BettingRecord',
    path: '/BettingRecordPage',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@views/lottery/BettingRecordPage/')
  },
  {
    name: 'BettingRecordDetail',
    path: '/BettingRecordDetail',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@views/lottery/BettingRecordDetail/')
  },
  {
    name: 'AccountChangeRecord',
    path: '/AccountChangeRecord',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@views/lottery/AccountChangeRecord/')
  },
  {
    name: 'ChaseRecordPage',
    path: '/ChaseRecordPage',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@views/lottery/ChaseRecordPage/')
  },
  {
    name: 'ChaseRecordDetail',
    path: '/ChaseRecordDetail',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@views/lottery/ChaseRecordDetail/')
  },
  {
    name: 'DailyRecordPage',
    path: '/DailyRecordPage',
    meta: {
      title: '',
      requireAuth: true
    },
    component: () => import('@views/lottery/DailyRecordPage/')
  }
]
