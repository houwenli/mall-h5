/**
 * 门店详情路由
 *
 * @author Caizize created on 2019/12/26
 */

import request from '@/utils/request'


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
