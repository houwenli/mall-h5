import request from '@/utils/request';


/**
 * 查询门店结算信息
 */
export function queryStoreSettlements(ids) {
  return request({
    url: 'storesettlement',
    method: 'get',
    params: {ids: ids}
  })
}

/**
 * 提交门店订单
 * @param params 提交参数
 */
export function submitStoreOrder(params) {
  return request({
    url: 'storeorder',
    method: 'post',
    data: params
  })
}
