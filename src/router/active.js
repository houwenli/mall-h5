/**
 * 营销页、临时页面、活动页 路由
 */
export default [
  {
    // 2022年年货节临时使用
    path: '/active/h5/newYearShoppingFestival',
    name: 'newYearShoppingFestival',
    component: () => import('@/views/activities/newYearShoppingFestival/index.vue'),
    meta: {
      title: '年货节',
    },
  },
  {
    path: '/active/h5/GameLandingPage',
    name: 'GameLandingPage',
    component: () => import('@/views/activities/answerGame/landingPage.vue'),
    meta: {
      title: '万顺福女神节',
    },
  },
  //
  //年货节返场答题游戏
  {
    path: '/active/h5/answerGame',
    name: 'answerGame',
    component: () => import('@/views/activities/answerGame/index.vue'),
    meta: {
      title: '万顺福女神节',
    },
  },
  {
    path: '/active/h5/noActivity',
    name: 'noActivity',
    component: () => import('@/views/activities/answerGame/noActivity.vue'),
    meta: {
      title: '万顺福女神节',
    },
  },
  {
    path: '/active/h5/answer',
    name: 'answer',
    component: () => import('@/views/activities/answerGame/answer.vue'),
    meta: {
      title: '答题游戏',
    },
  },
]
