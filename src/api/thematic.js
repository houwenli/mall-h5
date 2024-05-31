/**
 * 专题路由
 *
 * @author Caizize created on 2020/1/3
 */

import request from '@/utils/request'


/**
 * 查询h5专题配置信息
 *
 * @param id 专题id
 * @return 返回h5首页
 */
export function mobileThematic(id) {
  return request({
    url: 'mobilethematic/' + id,
    method: 'get',
  })
}
