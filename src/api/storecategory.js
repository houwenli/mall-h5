/**
 * 店铺分类路由
 *
 * @author Caizize created on 2020/1/6
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

/**
 * 查询店铺所有分类
 *
 * @param storeId 店铺id
 * @return 分类集合
 */
export function querySortedAllStoreCategory(storeId) {
  return request({
    url: 'allstorecategory/' + storeId,
    method: 'get',
  })
}
