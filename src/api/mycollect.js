import request from '@/utils/request'

/**
 * 查询用户收藏的单品信息
 */
export function queryAttentions(params) {
  return request({
    url: 'attention/queryAttentionSku',
    method: 'post',
    data: params,
  })
}

/**
 * 查询用户收藏的店铺信息
 */
export function queryAttentionStore(params) {
  return request({
    url: '/attention/queryAttentionStore',
    method: 'post',
    data: params,
  })
}
/**
 * 取消用户关注的商品信息
 */
export function removeAttentionsSku(data) {
  return request({
    url: 'attention/cancelSkuAttention',
    method: 'post',
    data
  })
}
/**
 * 清空用户关注的商品信息
 */
export function clearAttentionsSku(query) {
  return request({
    url: 'attention/clearSkuAttention',
    method: 'get',
    params: query
  })
}
/**
 * 取消用户收藏的店铺信息
 */
export function removeAttentionStore(query) {
  return request({
    url: '/attention/cancelStoreAttention',
    method: 'get',
    params: query
  })
}
/**
 * 清空用户收藏的店铺信息
 */
export function clearAttentionStore(query) {
  return request({
    url: '/attention/clearStoreAttention',
    method: 'get',
    params: query
  })
}
