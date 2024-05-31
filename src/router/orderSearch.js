export default [
  {
    path: '/orderSearch',
    component: () => import('@/components/order/orderSearch/index'),
    meta: {
      title: '我的订单',
    },
  },
  {
    path: '/orderSearchList',
    component: () => import('@/components/order/orderSearch/orderSearchList'),
    meta: {
      title: '我的订单',
    },
  },  
]