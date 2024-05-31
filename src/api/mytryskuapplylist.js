/**
 * 我的试用路由
 *
 * @author Caizize created on 2020/1/9
 */

import request from '@/utils/request'


/**
 * 分页查询试用申请
 *
 * @param query 查询参数
 * @return 试用申请列表
 */
export function queryTrySkuApplys(query) {
  return request({
    url: 'tryskuapplylist',
    method: 'get',
    params: query
  })
}

/**
 * 判断有没有填写试用报告的资格
 *
 * @param tryApplyId 试用申请id
 * @return 1:有资格 -1:用户没有资格 -2:没有订单 -3没有确认收货 -4已提交过报告
 */
export function hasAuthToAddTryReport(tryApplyId) {
  return request({
    url: 'hasauthtoaddtryreport/' + tryApplyId,
    method: 'get',
  })
}
