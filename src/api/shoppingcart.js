import request from '@/utils/request'

/**
 * 查询购物车
 */
export function queryCart() {
  return request({
    url: 'cart',
    method: 'get',
  })
}

/**
 * 更新购物车数量
 * @param id 购物车id
 * @param num 数量
 */
export function updateShoppingCartNum(queryParam) {
  return request({
    url: 'cart/num',
    method: 'put',
    data: queryParam,
  })
}

/**
 * 删除购物车
 * @param ids 购物车id
 */
export function deleteCart(ids) {
  return request({
    url: 'cart',
    method: 'delete',
    params: { ids: ids },
  })
}

/**
 * 删除商品的促销（满减满赠满折）
 * @param skuId 单品id
 */
export function queryMarketings(skuId) {
  return request({
    url: 'cart/marketings/' + skuId,
    method: 'get',
  })
}

/**
 * 更新购物车促销信息
 * @param cartId 购物车id
 * @param marketingId 促销id
 */
export function updateShoppingCartMarketing(cartId, marketingId) {
  return request({
    url: 'cart/marketing/' + cartId + '/' + marketingId,
    method: 'put',
  })
}

/**
 * 查询门店购物车
 */
export function queryStoreShoppingCarts() {
  return request({
    url: 'storeshoppingcart',
    method: 'get',
  })
}

/**
 * 更新门店购物车数量
 * @param id 购物车id
 * @param num 数量
 */
export function updateStoreShoppingCartNum(id, num) {
  return request({
    url: 'storeshoppingcart/num',
    method: 'put',
    data: { id: id, num: num },
  })
}

/**
 * 删除门店购物车
 * @param ids 购物车id
 */
export function deleteStoreCart(ids) {
  return request({
    url: 'storeshoppingcart',
    method: 'delete',
    params: { ids: ids },
  })
}

/**
 * 更新购物车规格
 * @param id 购物车id
 * @param skuId 商品id
 */
export function updateCartDec(id, skuId) {
  return request({
    url: '/cart/spec',
    method: 'put',
    data: { id: id, skuId: skuId },
  })
}

/**
 *查询用户购物车数量
 */
export function queryCartCount() {
  return request({
    url: 'cart/count',
    method: 'get',
  })
}

/**
 * 批量领取优惠券
 */
export function receiveCoupons(params) {
  return request({
    url: '/coupon/store/receiveCoupons',
    method: 'post',
    data: params
  })
}

/**
 * 购物车选择商品后，计算价格以及最划算的优惠券
 */
export function bestCoupon(params) {
  return request({
    url: '/storeshoppingcart/summary',
    method: 'post',
    data: params
  })
}


export function cartSummary(params) {
  return request({
    url: '/spuDiscount/cartSummary',
    method: 'post',
    data: params
  })
}

/**
 * 查询优惠列表（新增接口）
 */
export function queryDiscounts(params) {
  return request({
    url: '/spuDiscount/queryDiscounts',
    method: 'post',
    data: params
  })
}