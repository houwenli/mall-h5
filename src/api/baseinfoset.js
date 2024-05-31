/**
 * 系统设置路由
 *
 * @author Caizize created on 2019/12/2
 */

import request from '@/utils/request'

/**
 * 查询基本信息和高级信息设置
 *
 * @return 基本信息和高级信息设置实体类
 */
export function queryBaseInfoSet() {
  return request({
    url: 'baseinfoset',
    method: 'get'
  })
}
