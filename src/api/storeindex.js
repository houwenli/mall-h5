/**
 * 店铺首页路由
 *
 * @author Caizize created on 2020/1/3
 */

import request from '@/utils/request'

/**
 * 查询h5店铺首页配置信息
 *
 * @param storeId 店铺id
 * @return 返回h5首页
 */
export function mobileIndex(storeId) {
  return request({
    url: 'mobileindex/' + storeId,
    method: 'get',
  })
}

/**
 * 根据店铺id查询店铺信息
 *
 * @param storeId 店铺id
 * @return 店铺信息
 */
export function queryStoreInfo(storeId) {
  return request({
    url: 'storeinfo/' + storeId,
    method: 'get',
  })
}

/**
 * 实体店店铺的查询
 * 根据店铺id查询店铺信息
 *
 * @param storeId 店铺id
 * @return 店铺信息
 */
export function queryAgencyStore(params) {
  return request({
    url: '/agencystore/queryAgencyStoreByIdNumber',
    method: 'post',
    data: params,
  })
}

/**
 * 根据店铺id查询店铺商品信息
 *
 * @param storeId 店铺id
 * @param onlyQueryNewSpu 是否只查询新品
 * @param pageNum 页容量
 * @param pageSize 页码
 * @return 商品列表信息
 */
export function queryStoreSpusRequest(params) {
  return request({
    url: '/queryStoreSpus',
    method: 'post',
    data: params,
  })
}

/**
 * 查询实体店店铺的
 * 根据店铺id查询店铺商品信息
 *
 * @param storeId 店铺id
 * @param onlyQueryNewSpu 是否只查询新品
 * @param pageNum 页容量
 * @param pageSize 页码
 * @return 商品列表信息
 */
export function pageAgencyStore(params) {
  return request({
    url: '/agencystore/spuList',
    method: 'post',
    data: params,
  })
}

/**
 * 关注店铺
 *
 * @param storeId 店铺id
 * @return 是否成功
 */
export function addStoreAttention(storeId) {
  return request({
    url: '/attention/addStoreAttention',
    method: 'get',
    params: {
      storeId: storeId,
    },
  })
}

/**
 * 取消关注店铺
 *
 * @param storeId 店铺id
 * @return 是否成功
 */
export function cancelStoreAttention(storeId) {
  return request({
    url: '/attention/cancelStoreAttention',
    method: 'get',
    params: {
      storeId: storeId,
    },
  })
}

/**
 * 取消订阅
 *
 * @param storeId 店铺id
 * @return 是否成功
 */
export function newCancelStoreAttention(storeId) {
  return request({
    url: '/agencystore/unfocus',
    method: 'post',
    data: {
      storeId: storeId,
    },
  })
}

/**
 * 关注店铺
 *
 * @param storeId 店铺id
 * @return 是否成功
 */
export function newAddStoreAttention(storeId) {
  return request({
    url: '/agencystore/focus',
    method: 'post',
    data: {
      storeId: storeId,
    },
  })
}

/**
 * 是否关注实体店
 * 0关注 1 未关注
 *
 * @param storeId 店铺id
 * @return 是否成功
 */

export function isStoreAttention(storeId) {
  return request({
    url: '/agencystore/focusStoreState',
    method: 'post',
    data: {
      storeId: storeId,
    },
  })
}

/**
 * 我的小店。根据登录token查询
 *
 *
 * @param storeId 店铺id
 * @return object<Array>
 * {
 *  storeName //店铺名称
 *  agencyNumber //机构编码
 *  idNumber //机构唯一身份编码
 * }
 */

export function getMySotre(storeId) {
  return request({
    url: '/agencystore/stores',
    method: 'post',
    data: {},
  })
}

/**
 * 用户关注实体店列表
 *
 *
 * @param storeId 店铺id
 * @return object<Array>
 * {
 *  storeName //店铺名称
 *  agencyNumber //机构编码
 *  idNumber //机构唯一身份编码
 * }
 */

export function getMyAttentionSotre(storeId) {
  return request({
    url: '/agencystore/focusList',
    method: 'post',
    data: {},
  })
}

/**
 * 店铺分享码
 */

export function storeShareCode(params) {
  return request({
    url: '/agencystore/code',
    method: 'post',
    data: params,
  })
}
