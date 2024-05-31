/**
 * 搜索店铺路由
 *
 * @author Caizize created on 2019/12/25
 */

import request from '@/utils/request'


/**
 * 分页搜索店铺
 *
 * @param query 查询参数
 * @return 店铺信息
 */
export function queryStoreInfoForSearch(query) {
  return request({
    url: 'searchstore',
    method: 'get',
    params: query
  })
}
