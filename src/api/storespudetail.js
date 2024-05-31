import request from '@/utils/request'

/**
 * 查询门店商品详情
 * @param skuId 单品id
 * @param storeId 店铺id
 */
export function queryStoreSkuDetail(skuId, storeId) {
  return request({
    url: 'storeskudetail/' + skuId + '/' + storeId,
    method: 'get',
  })
}

/**
 * 查询店铺信息
 * @param storeId 店铺id
 */
export function queryStoreInfo(storeId) {
  return request({
    url: 'storeinfo/' + storeId,
    method: 'get',
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
 * 新增门店预约
 */
export function addReservation(reservation) {
  return request({
    url: 'reservation',
    method: 'post',
    data: reservation,
  })
}

/**
 * 新增门店购物车
 * @param cart 门店购物车
 */
export function addStoreShoppingCart(cart) {
  return request({
    url: 'storeshoppingcart',
    method: 'post',
    data: cart,
  })
}
