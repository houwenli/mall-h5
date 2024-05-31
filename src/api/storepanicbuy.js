/**
 * 店铺秒杀活动路由
 *
 * @author Caizize created on 2020/5/19
 */

import request from '@/utils/request'


/**
 * 查询秒杀促销图片信息
 *
 * @param storeId 店铺id
 * @return 秒杀促销图片信息
 */
export function queryPanicBuyPic(storeId) {
  return request({
    url: 'panicbuypic/' + storeId,
    method: 'get',
  })
}

/**
 * 分页查询店铺秒杀活动列表
 *
 * @param query 查询条件
 * @return 返回店铺秒杀活动列表
 */
export function queryStorePanicBuyList(query) {
  return request({
    url: 'storepanicbuylist',
    method: 'get',
    params: query
  })
}
