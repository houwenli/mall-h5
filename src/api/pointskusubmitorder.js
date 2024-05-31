/**
 * 提交积分订单路由
 *
 * @author Caizize created on 2020/4/20
 */

import request from '@/utils/request'


/**
 * 查询所有省份(包含下面的市区)
 */
export function queryAllAreas() {
  return request({
    url: 'areas',
    method: 'get',
  })
}

/**
 * 提交积分商城订单
 *
 * @param pointMallOrder 积分商城订单实体
 * @return 1成功 0失败 -1缺少参数 -2库存不足 -3积分商品不存在 -4 积分不足 -5 未发布
 */
export function submitPointMallOrder(pointMallOrder) {
  return request({
    url: 'pointmallorder',
    method: 'post',
    data: pointMallOrder
  })
}
