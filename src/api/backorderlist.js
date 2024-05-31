/**
 * 退单列表路由
 *
 * @author Caizize created on 2019/12/11
 */

import request from '@/utils/request'


/**
 * 分页查询用户退单信息
 *
 * @return 用户退单信息
 */
export function queryCustomerBackOrders(query) {
  return request({
    url: 'backorderlist',
    method: 'get',
    params: query
  })
}

/**
 * 申请退款
 *
 * @param refundOrderData 申请退款请求实体
 * @return -1 订单状态错误  成功>0  失败= 0
 */
export function applyRefund(refundOrderData) {
  return request({
    url: 'applySkuRefundNew',
    method: 'post',
    data: refundOrderData
  })
}

/**
 * 查询订单详情(退货用)
 *
 * @param orderId 订单id
 * @return 返回订单详情
 */
export function queryOrderForReturn(orderId) {
  return request({
    url: 'returnorder/order/' + orderId,
    method: 'get'
  })
}

/**
 * 申请退货
 *
 * @param applyReturnParams 申请退货请求
 * @return -1 订单状态错误 0 失败  成功1
 */
export function applyReturnOrder(applyReturnParams) {
  return request({
    url: 'applyreturn',
    method: 'post',
    data: applyReturnParams
  })
}

/**
 * 填写物流单信息
 *
 * @param logisticsData 物流信息实体
 * @return 成功1 订单号含有中文-2 其他失败
 */
export function fillTheLogistics(logisticsData) {
  return request({
    url: 'fillthelogistics',
    method: 'post',
    data: logisticsData
  })
}

/**
 * 查询退单详情
 *
 * @param id 退单id
 * @return 返回退单详情
 */
export function queryBackOrderDetail(query) {
  return request({
    url: '/backorderdetail' ,
    method: 'get',
    params: query
  })
}

/**
 * 查询售后申请列表（售后申请）
 *
 * @return 返回售后申请列表
 */
export function querySaleApplyList(query) {
  return request({
    url: '/afterSale/pageAfterSaleOrder',
    method: 'get',
    params: query
  })
}

/**
 * 查询售后申请列表（处理中、申请记录）
 *
 * @return 返回售后申请列表
 */
export function querySaledList(query) {
  return request({
    url: '/afterSale/afterSalePage',
    method: 'get',
    params: query
  })
}
/**
 * 查询已解决申请列表（申请记录）
 *
 * @return 返回已解决申请记录列表
 */
export function queryCompletedList(data) {
  return request({
    url: '/backOrder/userConfirmationCompleted',
    method: 'post',
    data: data
  })
}

/**
 * 发起退货申请 - 页面返回详情
 *
 * @return 返回售后申请列表
 */
export function queryorderforreturn(query) {
  return request({
    url: '/queryorderforreturn',
    method: 'get',
    params: query
  })
}

/**
 * 查询物流（处理中、申请记录）
 *
 * @return 返回售后申请列表
 */
export function queryAllLogisCompanyName() {
  return request({
    url: '/queryAllLogisCompanyName',
    method: 'get',
  })
}

/**
 *  取消申请（
 *
 * @return query
 */
export function cancleApplySale(query) {
  return request({
    url: '/afterSale/cancel',
    method: 'get',
    params: query
  })
}

/**
 * 修改申请
 *
 * @return query
 */
export function updateAfterApply(query) {
  return request({
    url: '/afterSale/update',
    method: 'post',
    data: query
  })
}


// 修改物流单号
export function updateLogistics(query) {
  return request({
    url: '/updateLogistics',
    method: 'post',
    data: query
  })
}

// 48小时退货申请中商家端未审批的服务单，自动通过
export function dealApplyOverDue(query) {
  return request({
    url: '/dealApplyOverDue?id=' + query.id,
    method: 'get',
  })
}

//  7*24小时 商家已同意退货，客户未填写订单号的退货服务单，自动关闭
export function dealFillLogisticsOverDue(query) {
  return request({
    url: '/dealFillLogisticsOverDue?id=' + query.id,
    method: 'get',
  })
}

// 删除服务单
export function deleteBackOrder(query) {
  return request({
    url: '/deleteBackOrder',
    method: 'post',
    data: query
  })
}
/*
 * 查询退单进度
 *
 * @param orderCode 订单编号
 */
export function queryBackOrderLog(params) {
  return request({
    url: 'backOrder/log/list',
    method: 'get',
    params
  })
}

/**
 * 用户申请退款超过1天未申请自动通过并退款
 *
 * @param orderCode 订单编号
 */
export function applyRefundPass(params) {
  return request({
    url: 'backOrder/ApplyRefundPass',
    method: 'get',
    params
  })
}

/**
 * 根据售后单号查询物流
 *
 * @param backOrderId 售后单id
 * @param postType 邮寄类型 0用户邮寄商家 1商家邮寄用户
 */

 export function getbackLogisticsById(data) {
  return request({
    url: 'backOrder/queryOrderTraces',
    method: 'post',
    data
  })
}

/**
 * 根据订单号或售后单号查询物流
 *
 * @param id 订单id或售后单id
 * @param type id类型：0订单id 1售后单id 2订单商品子订单id
 */

export function getLogisticsById(params) {
  return request({
    url: 'getLogisticsById',
    method: 'get',
    params
  })
}

/**
 * 用户确认是否收到货
 *
 * @param id 换货单id
 * @param id 是否收到货：0未收货 1已收货
 */
 export function auditReceipt(params) {
  return request({
    url: `backOrder/auditReceipt?id=${params.id}&isReceipt=${params.isReceipt}`,
    method: 'get',
  })
}

/**
 * 用户确认是否收到货
 *
 * @param backOrderId 换货单id
 * 
 */
export function checkOrderTraces(data) {
  return request({
    url: `backOrder/checkOrderTraces`,
    method: 'post',
    data
  })
}

/**
 * 申请换货时校验商品
 *
 * @param num 申请收货的数量，默认1
 * @param skuId 	所选换新的单品id，没有就不填
 * @param spuId 	商品id
 */
 export function checkSpuOrSku(params) {
  return request({
    url: 'afterSale/checkSpuOrSku',
    method: 'get',
    params: params
  })
}

/**
 * 获取售后原因
 *
 * @param after_sale_type 售后类型 0退款 1退货退款
 * @param is_received 是否收到货 0否 1是
 */
export function getReasonList(data) {
  return request({
    url: `/backOrder/getReasonList`,
    method: 'post',
    data
  })
}