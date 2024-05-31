/**
 * 秒杀活动路由
 *
 * @author Caizize created on 2020/5/18
 */

import request from '@/utils/request'


/**
 * 分页查询秒杀活动列表
 *
 * @param query 查询条件
 * @return 返回秒杀活动列表
 */
export function querySeckills(query) {
  return request({
    url: 'seckills',
    method: 'get',
    params: query
  })
}

/**
 * 查询秒杀场次
 *
 * @return 返回秒杀场次
 */
export function querySeckillSceneDetail() {
  return request({
    url: 'seckilldetail',
    method: 'get',
  })
}
