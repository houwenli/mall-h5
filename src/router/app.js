/**
 * app所需要的H5页面-非核心逻辑页面
 * 例如： 政策文件等
 */

export default [
  {
    path: '/app/smartlife',
    component: () => import('@/layout/emptyLayout.vue'),
    children: [
      {
        path: 'certificateInfomation',
        component: () => import('@/views/app/smartlife/certificateInfomation.vue'),
        meta: {
          title: '证件信息',
        },
      },
      {
        path: 'listOfThirdPartyInformationSharing',
        component: () => import('@/views/app/smartlife/listOfThirdPartyInformationSharing.vue'),
        meta: {
          title: '第三方信息共享清单',
        },
      },
      {
        path: 'personalInformationList',
        component: () => import('@/views/app/smartlife/personalInformationList.vue'),
        meta: {
          title: '个人信息收集清单',
        },
      },
      {
        path: 'privacyPolicySummary',
        component: () => import('@/views/app/smartlife/privacyPolicySummary.vue'),
        meta: {
          title: '隐私政策摘要',
        },
      },
      {
        path: 'userAgreement',
        component: () => import('@/views/app/smartlife/userAgreement.vue'),
        meta: {
          title: '用户协议',
        },
      },
      {
        path: 'logOffAccount',
        name: 'logOffAccount',
        component: () => import('@/views/app/smartlife/logOffAccount/index.vue'),
        meta: {
          title: '注销账号',
        },
      },
      {
        path: 'logOffAgreement',
        name: 'logOffAgreement',
        component: () => import('@/views/app/smartlife/logOffAccount/agreement.vue'),
        meta: {
          title: '用户注销须知',
        },
      },
      {
        path: 'modifyPhone',
        name: 'modifyPhone',
        component: () => import('@/views/app/smartlife/modifyPhone/index.vue'),
        meta: {
          title: '修改手机号',
        },
      },
      {
        path: 'serviceagreement',
        name: 'serviceagreement',
        component: () => import('@/views/app/smartlife/serviceagreement.vue'),
        meta: {
          auth: false,
          title: '万顺福用户注册协议',
        },
      },
      {
        path: 'privacypolicy',
        name: 'privacypolicy',
        component: () => import('@/views/app/smartlife/privacypolicy.vue'),
        meta: {
          auth: false,
          title: '隐私政策',
        },
      },
      {
        path: 'smartCoupon',
        name: 'smartCoupon',
        component: () => import('@/views/app/smartlife/coupon/index.vue'),
        meta: {
          title: '优惠券',
        },
      },

    ],
  },
]
