import request from '@/utils/request'

/**
 * 判断是否登陆
 */
export function isLogin() {
  return request({
    url: 'islogin',
    method: 'get',
  })
}

/**
 * 查询用户未读的站内信
 */
export function queryUnReadMessagecount(params) {
  return request({
    url: 'station/letter/queryUnreadCountByGroup',
    method: 'get',
    params: params
  })
}

/**
 * 猜你喜欢
 */
export function recommend(types) {
  return request({
    url: 'search',
    method: 'post',
    data: { pageSize: 12, typeIds: types },
  })
}

/**
 * 查询浏览纪录的单品类型
 */
export function queryBrowseSkuType() {
  return request({
    url: 'customer/browsesku/type',
    method: 'get',
  })
}

/**
 * 查询用户基本信息
 *
 * @return 返回用户基本信息
 */
export function customerDetail() {
  return request({
    url: 'customerdetail',
    method: 'get',
  })
}

/**
 * 订单统计
 *
 * @return 返回订单消息总数返回实体
 */
export function queryOrderMessageCount() {
  return request({
    url: 'order/count',
    method: 'get',
  })
}

/**
 * 门店订单统计
 *
 * @return 返回门店订单消息总数返回实体
 */
export function queryStoreOrderMessageCount() {
  return request({
    url: 'storeorder/count',
    method: 'get',
  })
}
/**
 * 分页查询为你推荐
 */
export function getRecommendList(params) {
  return request({
    // url: 'recommend/spus',
    url: 'individualization/recommend/recommendCommodity',
    method: 'post',
    data: params,
  })
}

/**
 * 根据会员id查询会员的店铺收藏 商品收藏 和浏览记录数量
 */
export function getCustomerStatistics() {
  return request({
    url: 'customer/customerStatistics',
    method: 'get',
  })
}


/**
 * 查询优惠券数量
 */
export function getUsableCount () {
  return request({
    url: '/coupon/user/count',
    method: 'get',
  })
}

/**
 * 查询用户是否有分销权限
 */
export function queryIsAllowDistribution() {
  return request({
    url: 'queryIsAllowDistribution',
    method: 'get',
  })
}

/**
 * 查询是否显示首页活动弹窗
 */
export function queryPerformanceFlag() {
  return request({
    url: 'queryPerformanceFlag',
    method: 'get',
  })
}

// 查询积分
export function getFqzStreamMobile(params) {
  return request({
    url: '/fqz/stream/getFqzStreamMobile',
    method: 'post',
    data: params
  })
}

/**
 * 查询是否为分销员
 */
 export function isDistributionCheck(params) {
  return request({
    url: '/distributionRegister/isDistributionCheck',
    method: 'post',
    data:params
  })
}

/**
 * 查询是否为分销员(车主无感注册)
 */
 export function isDistribution(params) {
  return request({
    url: '/distributionRegister/isDistribution',
    method: 'post',
    data:params
  })
}

/**
 * 查询个人中心待付款和待收货轮播信息
 */
export function queryOrderRotographList() {
  return request({
    url: '/order/queryOrderRotographList',
    method: 'get',
  })
}
/**
 * 查询个人中心配置
 * @params
 * templateCode: 103个人中心配置、104订单列表配置
 */
export function queryPersonConfigTemp(templateCode) {
  return request({
    url: '/order/queryPersonConfigTemp',
    method: 'post',
    data: {
      templateCode
    }
  })
}


