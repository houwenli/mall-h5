export default [
  {
    path: '/mobilePhoneAdv/home',
    component: () => import('@/views/mobilePhoneAdv/home.vue'),
    meta: {
      title: '开卡业务'     
    },
  },
  {
    path: '/mobilePhoneAdv/index',
    component: () => import('@/views/mobilePhoneAdv/index'),
    meta: {
      title: '联通广告手机号'     
    },
  },
]
