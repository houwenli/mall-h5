export default [
  {
    path: '/elecBike/index',
    component: () => import('@/components/elecBike/index'),
    meta: {
      title: '电动车',
    },
  },
  {
    path: '/elecBike/detail',
    component: () => import('@/components/elecBike/detail'),
    meta: {
      title: '商品详情',
    },
  }, 
  {
    path: '/elecBike/licenseGuide',
    component: () => import('@/components/elecBike/licenseGuide'),
    meta: {
      title: '上牌指引',
    },
  },
  {
    path: '/elecBike/morestore',
    component: () => import('@/components/elecBike/morestore'),
    meta: {
      title: '门店列表',
    },
  }, 
  {
    path: '/elecBike/morestoreDetail',
    component: () => import('@/components/elecBike/morestoreDetail'),
    meta: {
      title: '门店详情',
    },
  }, 
  
  
]