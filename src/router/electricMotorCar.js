export default [
  {
    path: '/motorCar/index',
    component: () => import('@/components/motorCar/index'),
    meta: {
      title: '万顺电动车',
    },
  },
  {
    path: '/motorCar/detail',
    component: () => import('@/components/motorCar/detail'),
    meta: {
      title: '商品详情',
    },
  },
  {
    path: '/motorCar/orderDetail',
    component: () => import('@/components/motorCar/orderDetail'),
    meta: {
      title: '订单详情',
    },
  },
  {
    path: '/motorCar/licenseGuide',
    component: () => import('@/components/motorCar/licenseGuide'),
    meta: {
      title: '上牌指引',
    },
  }
]