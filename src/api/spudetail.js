import request from '@/utils/request'

/**
 * 查询商品信息
 * @param skuId 单品id
 */
export function querySpu(data) {
  return request({
    url: 'spu',
    method: 'get',
    params: data,
  })
}


/**
 * 换货查询商品信息
 * @param skuId 单品id
 */
export function backQuerySpu(data) {
  return request({
    url: 'querySwapSpuDetail',
    method: 'post',
    data,
  })
}

/**
 * 查询推荐
 * @param typeId 类型id
 */
export function queryRecommend(typeId) {
  return request({
    url: 'recommend',
    method: 'post',
    data: { pageSize: 24, typeIds: [typeId] },
  })
}

/**
 * 查询商品的规格信息
 * @param spuId 商品id
 */
export function querySpuSpecs(spuId) {
  return request({
    url: 'spuspecs/' + spuId,
    method: 'get',
  })
}

/**
 * 查询商品下所有单品的规格信息
 * @param spuId 商品id
 */
export function querySkuSpecs(spuId) {
  return request({
    url: 'skuspecs/' + spuId,
    method: 'get',
  })
}

/**
 * 查询所有的省市区
 */
export function queryAllAreas() {
  return request({
    url: 'areas',
    method: 'get',
  })
}

/**
 * 查询所有的省市区
 */
export function queryAllCity() {
  return request({
    url: 'areas/allCity',
    method: 'get',
  })
}

/**
 * 领取优惠券
 */
export function receiveCoupon(id) {
  return request({
    url: 'coupon/' + id,
    method: 'put',
  })
}

/**
 * 计算运费
 * @param skuId 单品id
 * @param storeId 店铺id
 * @param cityId 市id
 * @param num 数量
 */
export function calculatefreight(skuId, storeId, cityId, num) {
  return request({
    url: 'calculatefreight/' + skuId + '/' + storeId + '/' + cityId + '/' + num,
    method: 'get',
  })
}

/**
 * 添加收藏
 * @param skuId 单品id
 */
export function addAttention(data) {
  return request({
    url: 'attention/addSkuAttention',
    method: 'post',
    data
  })
}

/**
 * 取消收藏
 * @param skuId 单品id
 */
export function cancelAttention(data) {
  return request({
    url: 'attention/cancelSkuAttention',
    method: 'post',
    data
  })
}

/**
 * 查询抢购促销
 * @param skuId 单品id
 */
export function queryPanicBuyMarketing(skuId) {
  return request({
    url: 'panicbuymarketing/sku/' + skuId,
    method: 'get',
  })
}

/**
 * 查询营销规则
 */
export function queryMarketingSetting() {
  return request({
    url: 'marketingsetting',
    method: 'get',
  })
}

/**
 * 查询拼团订单
 * @param marketingId 促销id
 * @param skuId 单品id
 */
export function queryGroupOrders(marketingId, skuId) {
  return request({
    url: 'grouporders/spudetail',
    params: { marketingId: marketingId, skuId: skuId },
    method: 'get',
  })
}

/**
 * 查询前2条好评
 * @param skuId 单品id
 */
export function querySkuComments(skuId) {
  return request({
    url: 'comments/' + skuId + '/-1' + '/0',
    method: 'get',
    params: { pageSize: 2, pageNum: 0 },
  })
}

/**
 *查询用户购物车总数
 */
export function queryShoppingCartCount() {
  return request({
    url: 'cart/total',
    method: 'get',
  })
}

/**
 * 新增购物车
 * @param params 购物车参数
 */
export function addShoppingCart(params) {
  return request({
    url: 'cart',
    method: 'post',
    data: params,
  })
}

/**
 * 添加浏览记录
 * @param skuId 单品id
 */
export function addBrowseRecord(data) {
  return request({
    url: 'customer/browserecord',
    method: 'post',
    data
  })
}

/**
 * 查询商品组合
 * @param skuId 商品id
 */
export function queryCombination(skuId) {
  return request({
    url: 'combination/' + skuId,
    method: 'get',
  })
}

/**
 *检查是否在团购中
 * @param groupId 团购id
 */
export function checkIsInGroup(groupId) {
  return request({
    url: 'checkisingroup/' + groupId,
    method: 'get',
  })
}

/**
 * 查询预售促销规则信息
 */
export function queryPreSaleRule() {
  return request({
    url: 'presale/rule',
    method: 'get',
  })
}

/**
 * 查询店铺优惠券列表
 * @param storeId 店铺id
 */
export function queryCouponListOld(params) {
  return request({
    url: '/coupon/store/couponList',
    method: 'get',
    params: params,
  })
}

/**
 * 查询平台商家优惠券(商详，购物车)
 * @param storeId 店铺id
 * @param spuId 商品id
 */
export function queryCouponList(params) {
  return request({
    url: '/userActivity/getCouponList',
    method: 'get',
    params: params,
  })
}

/**
 * 转化图片为base64
 * @param params 图片路径
 */
export function downloadCosUrl(params) {
  return request({
    url: '/cos/download',
    method: 'get',
    params: params,
    responseType: 'blob',
  })
}
