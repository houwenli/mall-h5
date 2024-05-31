/**
 * 提交试用报告路由
 *
 * @author Caizize created on 2020/1/9
 */

import request from '@/utils/request'


/**
 * 根据id查找试用申请详情
 *
 * @param id 试用申请id
 * @return 试用申请实体
 */
export function queryTrySkuApplyById(id) {
  return request({
    url: 'tryskuapplybyid/' + id,
    method: 'get',
  })
}

/**
 * 提交试用报告
 *
 * @param tryReport 试用报告实体
 * @return 1:成功 -1:用户没有资格 -2:没有订单 -3没有确认收货 -4已提交过报告
 */
export function submitTryReport(tryReport) {
  return request({
    url: 'submittryreport',
    method: 'post',
    data: tryReport
  })
}

/**
 * 根据id查询试用报告
 *
 * @param tryApplyId 试用申请id
 * @return 试用报告实体
 */
export function queryTryReport(tryApplyId) {
  return request({
    url: 'tryreport/' + tryApplyId,
    method: 'get',
  })
}
