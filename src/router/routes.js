import active from './active.js'
import electricMotorCar from './electricMotorCar.js'
import orderSearch from './orderSearch.js'
import linkTogether from './linkTogether.js'

import specialTopic from './specialTopic.js'
import app from './app.js'
import elecBike from './elecBike.js'

export const routes = [
  {
    path: '/',
    component: () => import('@/components/index/index'),
    meta: {
      title: '首页',
      keepalive: true,
    },
  },
  {
    path: '/construction',
    component: () => import('@/components/beUnderConstruction/index'),
    meta: {
      title: '万顺福商城',
    },
  },
  {
    path: '/classify',
    component: () => import('@/components/goodsCategory/index'),
    meta: {
      title: '商品分类',
      keepalive: true,
    },
  },
  {
    path: '/category',
    component: () => import('@/components/category/category'),
    meta: {
      title: '分类',
    },
  },
  {
    path: '/home',
    component: () => import('@/components/userhome/usercenter'),
    meta: {
      title: '个人中心',
    },
  },
  {
    path: '/register',
    component: () => import('@/components/userhome/register'),
    meta: {
      title: '注册',
    },
  },
  {
    path: '/login',
    component: () => import('@/components/userhome/phonelogin'),
    meta: {
      title: '登录/注册',
    },
  },
  // {
  //   path: '/phonelogin',
  //   component: () => import('@/components/userhome/phonelogin'),
  //   meta: {
  //     title: '手机号验证码登录',
  //   },
  // },
  {
    path: '/userAuthorize',
    component: () => import('@/components/userhome/userAuthorize'),
  },
  {
    path: '/forgetpwd',
    component: () => import('@/components/userhome/forgetpwd'),
    meta: {
      title: '忘记密码',
    },
  },
  {
    path: '/confirmpassword',
    component: () => import('@/components/userhome/confirmpassword'),
    meta: {
      title: '忘记密码',
    },
  },
  {
    path: '/search',
    component: () => import('@/views/search'),
    meta: {
      title: '搜索商品',
    },
  },
  {
    path: '/spulist',
    component: () => import('@/components/spus/spulist'),
    meta: {
      title: '商品列表',
    },
  },
  {
    path: '/mycoupon',
    component: () => import('@/components/userhome/mycoupon'),
    meta: {
      auth: true,
      title: '我的优惠券',
    },
  },
  {
    path: '/giftcard',
    name: 'giftcard',
    component: () => import('@/components/userhome/giftcard'),
    meta: {
      auth: true,
      title: '我的礼品卡',
    },
  },
  {
    path: '/bindNewGiftCards',
    name: 'bindNewGiftCards',
    component: () => import('@/components/userhome/bindNewGiftCards'),
    meta: {
      auth: true,
      title: '绑定礼品卡',
    },
  },
  {
    path: '/couponCenter',
    component: () => import('@/components/userhome/couponCenter'),
    meta: {
      auth: true,
      title: '领券中心',
    },
  },
  {
    path: '/useCoupon',
    component: () => import('@/components/userhome/useCoupon'),
    meta: {
      auth: true,
      title: '优惠券',
    },
  },
  {
    path: '/getcoupon',
    component: () => import('@/components/userhome/getcoupon'),
    meta: {
      auth: true,
      title: '券码领券',
    },
  },
  {
    path: '/coupondetails',
    component: () => import('@/components/userhome/coupondetails'),
    meta: {
      auth: true,
      title: '优惠券详情',
    },
  },
  {
    path: '/mypoints',
    component: () => import('@/components/userhome/mypoints'),
    meta: {
      auth: true,
      title: '我的积分',
    },
  },
  {
    path: '/mybonus',
    component: () => import('@/components/userhome/mybonus'),
    meta: {
      auth: true,
      title: '我的红包',
    },
  },
  {
    path: '/bonusdetails',
    component: () => import('@/components/userhome/bonusdetails'),
    meta: {
      auth: true,
      title: '红包详情',
    },
  },
  {
    path: '/mysignin',
    component: () => import('@/components/userhome/mysignin'),
    meta: {
      auth: true,
      title: '我的签到',
    },
  },
  {
    path: '/mynews',
    component: () => import('@/components/userhome/mynews'),
    meta: {
      auth: true,
      title: '我的消息',
    },
  },
  {
    path: '/mycollectsku',
    component: () => import('@/components/userhome/mycollectsku'),
    meta: {
      auth: true,
      title: '我的商品收藏',
    },
  },
  {
    path: '/mycollectstore',
    component: () => import('@/components/userhome/mycollectstore'),
    meta: {
      auth: true,
      title: '店铺关注',
    },
  },
  {
    path: '/bonuscenter',
    component: () => import('@/components/marketing/bonuscenter'),
    meta: {
      title: '红包中心',
    },
  },
  {
    path: '/couponcenter',
    component: () => import('@/components/marketing/couponcenter'),
    meta: {
      title: '优惠券中心',
    },
  },
  {
    path: '/spudetail',
    name: 'SpuDetail',
    component: () => import('@/components/spus/spudetail'),
    meta: {
      title: '商品详情',
      keepalive: true
    },
  },
  {
    //集采商品详情
    path: '/collectionSpudetail',
    name: 'collectionSpudetail',
    component: () => import('@/views/collection/spudetail'),
    meta: {
      title: '商品详情', 
    },
  },
  
  {
    path: '/personalinfo',
    component: () => import('@/components/userhome/personalinfo'),
    meta: {
      auth: true,
      title: '个人中心',
    },
  },
  {
    path: '/personalsetting',
    component: () => import('@/components/userhome/personalsetting'),
    meta: {
      auth: true,
      title: '设置',
    },
  },
  {
    path: '/authorizeManagement',
    component: () => import('@/components/userhome/authorizeManagement'),
    meta: {
      auth: true,
      title: '授权管理',
    },
  },

  {
    path: '/setnickname',
    component: () => import('@/components/userhome/setnickname'),
    meta: {
      auth: true,
      title: '编辑昵称',
    },
  },
  {
    path: '/setusername',
    component: () => import('@/components/userhome/setusername'),
    meta: {
      auth: true,
      title: '编辑用户名',
    },
  },
  {
    path: '/updatepwd',
    component: () => import('@/components/userhome/updatepwd'),
    meta: {
      auth: true,
      title: '修改密码',
    },
  },
  {
    path: '/validateoldmobile',
    component: () => import('@/components/userhome/validateoldmobile'),
    meta: {
      auth: true,
      title: '验证手机号',
    },
  },
  // 有漏洞,如果强跳转可以跳过手机号校验
  // {
  //   path: '/bindnewmobile',
  //   component: () => import('@/components/userhome/bindnewmobile'),
  //   meta: {
  //     auth: true,
  //     title: '绑定新手机',
  //   },
  // },
  {
    path: '/updatepaypwd',
    component: () => import('@/components/userhome/updatepaypwd'),
    meta: {
      auth: true,
      title: '修改支付密码',
    },
  },
  {
    path: '/customeraddresslist',
    component: () => import('@/components/userhome/customeraddresslist'),
    meta: {
      auth: true,
      title: '收货地址',
    },
  },
  {
    path: '/customeraddressdetail',
    component: () => import('@/components/userhome/customeraddressdetail'),
    meta: {
      auth: true,
      title: '编辑地址',
    },
  },
  {
    path: '/orderlist',
    component: () => import('@/components/order/orderlist'),
    meta: {
      auth: true,
      title: '订单列表',
    },
  },
  {
    path: '/myspread',
    component: () => import('@/components/userhome/myspread'),
    meta: {
      auth: true,
      title: '我的分销',
    },
  },
  {
    path: '/myspreadcash',
    component: () => import('@/components/userhome/myspreadcash'),
    meta: {
      auth: true,
      title: '申请提现',
    },
  },
  {
    path: '/myspreadcode',
    component: () => import('@/components/userhome/myspreadcode'),
    meta: {
      auth: true,
      title: '推广链接',
    },
  },
  {
    path: '/myspreadrecord',
    component: () => import('@/components/userhome/myspreadrecord'),
    meta: {
      auth: true,
      title: '佣金记录',
    },
  },
  {
    path: '/mypredeposits',
    component: () => import('@/components/userhome/mypredeposits'),
    meta: {
      auth: true,
      title: '我的钱包',
    },
  },
  {
    path: '/mybrowserecord',
    component: () => import('@/components/userhome/mybrowserecord'),
    meta: {
      auth: true,
      title: '浏览记录',
    },
  },
  {
    path: '/comments',
    component: () => import('@/components/spus/comments'),
    meta: {
      title: '评论',
    },
  },
  {
    path: '/backorderlist',
    component: () => import('@/components/order/backorderlist'),
    meta: {
      auth: true,
      title: '退换售后',
    },
  },
  {
    path: '/applyAfterSale',
    component: () => import('@/components/order/afterSale/applyAfterSale'),
    meta: {
      auth: true,
      title: '选择售后类型',
    },
  },
  {
    path: '/returnGoods',
    component: () => import('@/components/order/afterSale/returnGoods'),
    meta: {
      auth: true,
      title: '退货',
    },
  },
  {
    path: '/applyAfterSuccess',
    component: () => import('@/components/order/afterSale/applyAfterSuccess'),
    meta: {
      auth: true,
      title: '退货申请成功',
    },
  },
  {
    path: '/serverDetails',
    component: () => import('@/components/order/afterSale/serverDetails'),
    meta: {
      auth: true,
      title: '服务单详情',
    },
  },
  {
    path: '/returnGoodsSteps',
    component: () => import('@/components/order/afterSale/returnGoodsSteps'),
    meta: {
      auth: true,
      title: '退货详情进度',
    },
  },
  {
    path: '/invoice',
    component: () => import('@/components/order/afterSale/invoice'),
    meta: {
      auth: true,
      title: '填写发货单',
    },
  },
  {
    path: '/logisInfo',
    component: () => import('@/components/order/afterSale/logisInfo'),
    meta: {
      auth: true,
      title: '选择快递公司',
    },
  },
  {
    path: '/evaluate',
    component: () => import('@/components/order/evaluate'),
    meta: {
      auth: true,
      title: '评价中心',
    },
  },
  {
    path: '/comment',
    component: () => import('@/components/order/comment'),
    meta: {
      auth: true,
      title: '评价',
    },
  },
  {
    path: '/cancelorder',
    component: () => import('@/components/order/cancelorder'),
    meta: {
      auth: true,
      title: '取消订单',
    },
  },
  {
    path: '/filllogisticsinfo',
    component: () => import('@/components/order/filllogisticsinfo'),
    meta: {
      auth: true,
      title: '填写物流',
    },
  },
  {
    path: '/cart',
    component: () => import('@/components/shoppingcart/shoppingcart'),
    meta: {
      title: '购物车',
      keepalive: true,
      scrollTop: 0
    },
  },
  {
    path: '/settlement',
    component: () => import('@/components/settlement/settlement'),
    meta: {
      auth: true,
      title: '结算',
    },
  },
  {
    path: '/refundorder',
    component: () => import('@/components/order/refundorder'),
    meta: {
      auth: true,
      title: '申请退款',
    },
  },
  {
    path: '/refundorder',
    component: () => import('@/components/order/refundorder'),
    meta: {
      auth: true,
      title: '申请退款',
    },
  },
  {
    path: '/refundServerDetails',
    component: () => import('@/components/order/afterSale/refundServerDetails'),
    meta: {
      auth: true,
      title: '申请退款详情',
    },
  },
  {
    path: '/refundServerDetailsSteps',
    component: () => import('@/components/order/afterSale/refundServerDetailsSteps'),
    meta: {
      auth: true,
      title: '申请退款进度',
    },
  },
  {
    path: '/refundSuccess',
    component: () => import('@/components/order/afterSale/refundSuccess'),
    meta: {
      auth: true,
      title: '提交成功',
    },
  },

  {
    path: '/refundDetail',
    component: () => import('@/components/order/refundDetail'),
    meta: {
      auth: true,
      title: '取消/退款进度',
    },
  },
  {
    path: '/backorderdetail',
    component: () => import('@/components/order/backorderdetail'),
    meta: {
      auth: true,
      title: '查看退单',
    },
  },
  {
    path: '/spunotfind',
    component: () => import('@/components/spus/spunotfind'),
    meta: {
      title: '商品不存在',
    },
  },
  {
    path: '/evaluationorderdetail',
    component: () => import('@/components/order/evaluationorderdetail'),
    meta: {
      auth: true,
      title: '查看评价',
    },
  },
  {
    path: '/evaluationorder',
    component: () => import('@/components/order/evaluationorder'),
    meta: {
      auth: true,
      title: '发表评价',
    },
  },
  {
    path: '/orderdetail',
    component: () => import('@/components/order/orderdetail'),
    meta: {
      auth: true,
      title: '查看订单',
    },
  },
  {
    path: '/ordereditaddress',
    component: () => import('@/components/order/ordereditaddress/index'),
    meta: {
      auth: true,
      title: '修改地址',
    },
  },
  {
    path: '/orderdetailinvoice',
    component: () => import('@/components/order/orderdetailinvoice'),
    meta: {
      auth: true,
      title: '发票信息',
    },
  },
  {
    path: '/pay',
    component: () => import('@/components/pay/pay'),
    meta: {
      title: '支付',
    },
  },
  {
    path: '/zhPay',
    component: () => import('@/components/pay/zhPay'),
    meta: {
      title: '支付', // 智慧生活收银台
    },
  },
  {
    path: '/paysuccess',
    component: () => import('@/components/pay/paysuccess'),
    meta: {
      auth: true,
      title: '订单创建成功',
    },
  },
  {
    path: '/panicbuy',
    component: () => import('@/components/marketing/panicbuy'),
    meta: {
      title: '秒杀',
    },
  },
  {
    path: '/presalemarketings',
    component: () => import('@/components/marketing/presalemarketings'),
    meta: {
      title: '预售',
    },
  },
  {
    path: '/trymarketings',
    component: () => import('@/components/marketing/trymarketings'),
    meta: {
      title: '试用',
    },
  },
  {
    path: '/groupmarketings',
    component: () => import('@/components/marketing/groupmarketings'),
    meta: {
      title: '拼团',
    },
  },
  {
    path: '/nopaysuccess',
    component: () => import('@/components/pay/nopaysuccess'),
    meta: {
      auth: true,
      title: '订单创建成功',
    },
  },
  {
    path: '/nearshoplist',
    component: () => import('@/components/store/nearshoplist'),
    meta: {
      title: '附近店铺',
    },
  },
  {
    path: '/onsalestorelist',
    component: () => import('@/components/outlet/onsalestorelist'),
    meta: {
      title: '门店列表',
    },
  },
  {
    path: '/searchshoplist',
    component: () => import('@/components/store/searchshoplist'),
    meta: {
      title: '搜索店铺',
    },
  },
  {
    path: '/storespudetail',
    component: () => import('@/components/outlet/storespudetail'),
    meta: {
      title: '门店商品',
    },
  },
  {
    path: '/nearstorelist',
    component: () => import('@/components/outlet/nearstorelist'),
    meta: {
      title: '附近门店',
    },
  },
  {
    path: '/storedetail',
    component: () => import('@/components/outlet/storedetail'),
    meta: {
      title: '门店详情',
    },
  },
  {
    path: '/storesettlement',
    component: () => import('@/components/outlet/storesettlement'),
    meta: {
      auth: true,
      title: '门店结算',
    },
  },
  {
    path: '/routenavigation',
    component: () => import('@/components/outlet/routenavigation'),
    meta: {
      title: '地图',
    },
  },
  {
    path: '/reservationlist',
    component: () => import('@/components/reservation/reservationlist'),
    meta: {
      auth: true,
      title: '预约列表',
    },
  },
  {
    path: '/storeorderlist',
    component: () => import('@/components/storeorder/storeorderlist.vue'),
    meta: {
      auth: true,
      title: '门店订单',
    },
  },
  {
    path: '/cancelstoreorder',
    component: () => import('@/components/storeorder/cancelstoreorder.vue'),
    meta: {
      auth: true,
      title: '取消门店订单',
    },
  },
  {
    path: '/storeorderdetail',
    component: () => import('@/components/storeorder/storeorderdetail.vue'),
    meta: {
      auth: true,
      title: '查看门店订单',
    },
  },
  {
    path: '/storeorderdetailinvoice',
    component: () => import('@/components/storeorder/storeorderdetailinvoice.vue'),
    meta: {
      auth: true,
      title: '发票信息',
    },
  },
  {
    path: '/storeorderevaluate',
    component: () => import('@/components/storeorder/storeorderevaluate.vue'),
    meta: {
      auth: true,
      title: '发表评价',
    },
  },
  {
    path: '/storeorderevaluatedetail',
    component: () => import('@/components/storeorder/storeorderevaluatedetail.vue'),
    meta: {
      auth: true,
      title: '查看评价',
    },
  },
  {
    path: '/storeindex',
    component: () => import('@/components/index/storeindex'),
    meta: {
      title: '店铺首页',
    },
  },
  {
    path: '/thematic',
    component: () => import('@/components/thematic/thematic'),
    meta: {
      title: '主题',
    },
  },
  {
    path: '/storecategory',
    component: () => import('@/components/category/storecategory'),
    meta: {
      title: '店铺分类',
    },
  },
  {
    path: '/tryspudetail',
    component: () => import('@/components/marketing/tryspudetail'),
    meta: {
      title: '试用商品详情',
    },
  },
  {
    path: '/tryreportlist',
    component: () => import('@/components/marketing/tryreportlist'),
    meta: {
      title: '试用报告',
    },
  },
  {
    path: '/mytryskuapplylist',
    component: () => import('@/components/userhome/mytryskuapplylist'),
    meta: {
      auth: true,
      title: '我的试用申请',
    },
  },
  {
    path: '/submittryreport',
    component: () => import('@/components/userhome/submittryreport'),
    meta: {
      auth: true,
      title: '提交试用报告',
    },
  },
  {
    path: '/tryreportdetail',
    component: () => import('@/components/userhome/tryreportdetail'),
    meta: {
      auth: true,
      title: '查看试用报告',
    },
  },
  {
    path: '/pointskulist',
    component: () => import('@/components/pointmall/pointskulist'),
    meta: {
      title: '积分商品列表',
    },
  },
  {
    path: '/pointskudetail',
    component: () => import('@/components/pointmall/pointskudetail'),
    meta: {
      title: '积分商品详情',
    },
  },
  {
    path: '/pointskusubmitorder',
    component: () => import('@/components/pointmall/pointskusubmitorder'),
    meta: {
      auth: true,
      title: '提交积分订单',
    },
  },
  {
    path: '/submitpointordersuccess',
    component: () => import('@/components/pointmall/submitpointordersuccess'),
    meta: {
      auth: true,
      title: '下单成功',
    },
  },
  {
    path: '/pointorderlist',
    component: () => import('@/components/pointmall/pointorderlist'),
    meta: {
      auth: true,
      title: '积分订单列表',
    },
  },
  {
    path: '/pointorderdetail',
    component: () => import('@/components/pointmall/pointorderdetail'),
    meta: {
      auth: true,
      title: '积分订单详情',
    },
  },
  {
    path: '/storepanicbuy',
    component: () => import('@/components/marketing/storepanicbuy'),
    meta: {
      title: '店铺秒杀',
    },
  },
  {
    path: '/tracesOrder',
    component: () => import('@/components/order/tracesOrder'),
    meta: {
      auth: true,
      title: '订单追踪',
    },
  },
  {
    path: '/share',
    name: 'share',
    component: () => import('@/components/share'),
    meta: {
      auth: false,
      meta: '分享页面',
    },
  },
  {
    path: '/wxPayInApp',
    component: () => import('@/components/pay/wxPayInApp'),
    meta: {
      auth: false,
      title: '万顺福商城 - 微信支付',
    },
  },
  {
    path: '/smartLifeBack',
    component: () => import('@/components/pay/smartLifeBack'),
    meta: {
      auth: false,
      title: '万顺福商城 - 微信支付',
    },
  },
  {
    path: '/distributionIndex',
    component: () => import('@/components/distribution/index'),
    meta: {
      auth: false,
      title: '分销首页',
    },
  },
  {
    path: '/distributionGoodsList',
    component: () => import('@/components/distribution/distributionGoodsList'),
    meta: {
      auth: false,
      title: '分销商品页',
    },
  },
  {
    path: '/revenueRules',
    component: () => import('@/components/distribution/revenueRules'),
    meta: {
      auth: false,
      title: '收益规则解释',
    },
  },
  {
    path: '/distributionSearch',
    component: () => import('@/components/distribution/distributionSearch'),
    meta: {
      auth: false,
      title: '分销搜索',
    },
  },
  {
    path: '/seckill',
    name: 'Seckill',
    component: () => import('@/views/activities/seckill'),
    meta: {
      auth: false,
      title: '秒杀专区',
    },
  },
  {
    path: '/thematicActivity',
    name: 'ThematicActivity',
    component: () => import('@/views/activities/thematicActivity'),
    meta: {
      auth: false,
      title: '手机狂欢',
    },
  },
  {
    path: '/firstOrder',
    name: 'FirstOrder',
    component: () => import('@/views/activities/firstOrder'),
    meta: {
      auth: false,
      title: '活动专区',
    },
  },
  //分销商品
  {
    path: '/distributionActivity',
    name: 'distributionActivity',
    component: () => import('@/views/activities/distributionActivity'),
    meta: {
      auth: false,
      keepalive: true,
      title: '分销专区',
    },
  },
  //推广订单
  {
    path: '/distributionOrder',
    name: 'distributionOrder',
    component: () => import('@/views/activities/distributionActivity/distributionOrder'),
    meta: {
      auth: true,
      title: '推广订单',
    },
  },
  {
    path: '/distributionRule',
    name: 'distributionRule',
    component: () => import('@/views/activities/distributionActivity/distributionRule'),
    meta: {
      auth: false,
      title: '规则说明',
    },
  },
  //推广订单
  {
    path: '/distributionOrderDetail',
    name: 'distributionOrderDetail',
    component: () => import('@/views/activities/distributionActivity/distributionOrderDetail'),
    meta: {
      auth: true,
      title: '推广订单详情',
    },
  },
  //分销跳转页
  {
    path: '/midPage',
    name: 'midPage',
    component: () => import('@/views/activities/distributionActivity/midPage'),
    meta: {
      auth: true,
    },
  },
  //分销商品-详情
  {
    path: '/disDetail',
    name: 'disDetail',
    component: () => import('@/views/activities/distributionActivity/components/detail'),
    meta: {
      auth: false,
      title: '商品详情',
    },
  },
  {
    path: '/promoter',
    name: 'promoter',
    component: () => import('@/views/activities/distributionActivity/promoter'),
    meta: {
      auth: true,
      title: '加入推广员',
    },
  },
  // {
  //   path: '/distributionList',
  //   name: 'distributionList',
  //   component: () => import('@/views/activities/distributionActivity/list'),
  //   meta: {
  //     auth: true,
  //     title: '商品列表',
  //   },
  // },
  {
    path: '/WomenActive',
    name: 'WomenActive',
    component: () => import('@/views/activities/thematicActivity/WomenActive'),
    meta: {
      auth: false,
      title: '女王节',
    },
  },
  {
    path: '/driversDay',
    name: 'driversDay',
    component: () => import('@/views/activities/thematicActivity/driversDay'),
    meta: {
      auth: false,
      title: '司机节',
    },
  },
  {
    path: '/customizedPhone',
    name: 'customizedPhone',
    component: () => import('@/views/activities/thematicActivity/customizedPhone'),
    meta: {
      auth: false,
      title: '万顺定制手机活动',
    },
  },
  {
    path: '/newsLogistics',
    component: () => import('@/components/userhome/newsTemplate/newsLogistics'),
    meta: {
      auth: false,
      title: '交易物流',
    },
  },
  {
    path: '/newsServer',
    component: () => import('@/components/userhome/newsTemplate/newsServer'),
    meta: {
      auth: false,
      title: '服务通知',
    },
  },
  {
    path: '/newsPromotion',
    component: () => import('@/components/userhome/newsTemplate/newsPromotion'),
    meta: {
      auth: false,
      title: '优惠促销',
    },
  },
  {
    path: '/newsAccount',
    component: () => import('@/components/userhome/newsTemplate/newsAccount'),
    meta: {
      auth: false,
      title: '账户通知',
    },
  },
  {
    path: '/exchangeGoods',
    component: () => import('@/components/order/afterSale/exchangeGoods'),
    meta: {
      auth: true,
      title: '换货',
    },
  },
  {
    path: '/exchangeServerDetails',
    component: () => import('@/components/order/afterSale/exchangeServerDetails'),
    meta: {
      auth: true,
      title: '服务单详情',
    },
  },
  {
    path: '/userRegisterAreement',
    component: () => import('@/views/agreement/userRegisterAreement'),
    meta: {
      auth: false,
      title: '万顺福商城用户注册协议',
    },
  },
  {
    path: '/privacyAgreement',
    component: () => import('@/views/agreement/privacyAgreement'),
    meta: {
      auth: false,
      title: '用户隐私协议',
    },
  },
  {
    path: '/abnormalRemind',
    component: () => import('@/components/abnormalRemind/abnormalRemind'),
    meta: {
      auth: false,
      title: '账号异常',
    },
  },
  {
    path: '/copunList',
    name: 'copunList',
    component: () => import('@/components/userhome/copunList'),
    meta: {
      auth: true,
      title: '优惠券',
    },
  },
  {//优惠券使用记录
    path: '/copunRecordList',
    name: 'copunRecordList',
    component: () => import('@/components/userhome/copunRecordList'),
    meta: {
      auth: true,
      title: '使用记录',
    },
  },
  {
    path: '/blessing',
    name: 'blessing',
    component: () => import('@/components/userhome/blessing'),
    meta: {
      auth: false,
      title: '积分流水',
    },
  },
  {
    path: '/version',
    name: 'version',
    component: () => import('@/components/userhome/version'),
    meta: {
      auth: false,
      title: '版本更新提示',
    },
  },
  {
    path: '/qrCodePay',
    component: () => import('@/views/storePay/qrCodePay'),
    meta: {
      auth: false,
      title: '支付',
    },
  },
  {
    path: '/qrCodePaySuccess',
    component: () => import('@/views/storePay/paySuccess'),
    meta: {
      auth: false,
      title: '支付结果',
    },
  },
  {
    path: '/storePay',
    component: () => import('@/views/storePay/pay'),
    meta: {
      auth: false,
      title: '支付',
    },
  },
  {
    path: '/Invoicinged',
    component: () => import('@/components/storeorder/Invoicinged'),
    meta: {
      auth: false,
      title: '发票详情',
    },
  },

  ...active,
  {
    path: '/myStore',
    name: 'myStore',
    component: () => import('@/views/store/myStore'),
    meta: {
      title: '店铺列表'
    }
  },
  {
    path: '/shopSearch',
    name: 'searchPath',
    component: () => import('@/components/search'),
    meta: {
      title: '搜索商品'
    }
  },
  {
    path: '/storeSearch',
    name: 'storeSearch',
    component: () => import('@/views/store/searchresults'),
    meta: {
      title: '搜索商品'
    }
  },
  {
    path: '/selectMap',
    name: 'selectMap',
    component: () => import('@/views/map'),
    redirect: {name: 'chooseMap'},
    children: [
      {
        path: 'map',
        name: 'chooseMap',
        component: () => import('@/views/map/map'),
        meta: {
          auth: false,
          title: '选择地址',
        },
      },
      {
        path: 'selectCity',
        name: 'selectCity',
        component: () => import('@/views/map/selectCity'),
        meta: {
          auth: false,
          title: '选择城市',
        },
      },
      {
        path: 'search',
        name: 'mapSearch',
        component: () => import('@/views/map/search'),
        meta: {
          auth: false,
          title: '定位地址',
        }
      }
    ],
    meta: {
      auth: false,
    },
  },
  // 充值话费
  {
    path: '/phoneCharge',
    name: 'phoneCharge',
    component: () => import('@/views/activities/phoneCharge/index.vue'),
    meta: {
      title: '手机充值',
    },
  },
  {
    path: '/rechargRecord',
    name: 'rechargRecord',
    component: () => import('@/views/activities/phoneCharge/component/rechargRecord.vue'),
    meta: {
      title: '充值记录',
    },
  },
  {
    path: '/oftenPhone',
    name: 'oftenPhone',
    component: () => import('@/views/activities/phoneCharge/component/oftenPhone.vue'),
    meta: {
      title: '常用手机号',
    },
  },
  {
    path: '/editPhone',
    name: 'editPhone',
    component: () => import('@/views/activities/phoneCharge/component/editPhone.vue'),
    meta: {
      title: '编辑联系人',
    },
  },
  {
    path: '/warmReminder',
    name: 'warmReminder',
    component: () => import('@/views/activities/phoneCharge/component/warmReminder.vue'),
    meta: {
      title: '温馨提示',
    },
  },
  {
    path: '/payConfirm',
    name: 'payConfirm',
    component: () => import('@/views/activities/phoneCharge/component/payConfirm.vue'),
    meta: {
      title: '收银台',
    },
  },
  {
    path: '/rechargSuccess',
    name: 'rechargSuccess',
    component: () => import('@/views/activities/phoneCharge/component/rechargSuccess.vue'),
    meta: {
      title: '支付结果',
    },
  },
  {
    path: '/recordDetails',
    name: 'recordDetails',
    component: () => import('@/views/activities/phoneCharge/component/recordDetails.vue'),
    meta: {
      title: '订单详情',
    },
  },
  {
    path: '/smartentry',
    name: 'smartentry',
    component: () => import('@/views/smartentry/smartentry.vue'),
    meta: {
      title: '订单详情',
    },
  },
  ...electricMotorCar,
  // 排行榜
  ...specialTopic,
  // 订单搜索
  ...orderSearch,

  // app内嵌h5页面-非核心页面
  ...app,
  // 联通广告手机号
  ...linkTogether,
  ...elecBike
]
