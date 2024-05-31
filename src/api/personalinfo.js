/**
 * 用户个人信息路由
 *
 * @author Caizize created on 2019/12/5
 */

import request from '@/utils/request'


/**
 * 根据用户id查询用户个人信息
 *
 * @return 用户个人信息
 */
export function queryCustomerPersonalInfo() {
  return request({
    url: 'customer/personalinfo',
    method: 'get'
  })
}

/**
 * 更新用户个人信息
 *
 * @param customer 用户实体类
 * @return 成功返回1 失败返回0
 */
export function updateCustomerPersonalInfo(customer) {
  return request({
    url: 'customer/personalinfo',
    method: 'put',
    data: customer
  })
}


/**
 * 退出登录
 */
export function logout() {
  return request({
    url: 'logout',
    method: 'put'
  })
}

/**
 * 解绑账号
 */
export function unbindAccount() {
  return request({
    url: 'unbindaccount',
    method: 'put'
  })
}

/**
 * 上传图片
 */

export function uploadToQqOSSYun(param){
  return request({
    url: 'uploadToQqOSSYun',
    method: 'post',
    formData: param
  })
}

/**
 * 修改用户名
 */
export function editCustomerUserName(param){
  return request({
    url: 'customer/editCustomerUserName',
    method: 'put',
    data: param
  })
}

/**
 * @return 获取版本号
 */
 export function getVersion() {
  return request({
    url: 'getVersion',
    method: 'get'
  })
}


/**
 * 查询用户是否授权
 * @param phone 手机号
 * @param customerId 客户ID
 * @param driverId 司机ID
 * @param passengerId 乘客ID
 */
export function selectOneByCondition(params) {
  return request({
    url: '/empower/temp/selectOneByCondition',
    method: 'post',
    data: params,
  })
}

export function selectOneDriverByCondition(params) {
  return request({
    url: '/empower/driver/selectOneByCondition',
    method: 'post',
    data: params,
  })
}

/**
 * 用户授权
 * @param phone 手机号
 * @param source 来源
 */
export function addCustomerEmpowern(params) {
  return request({
    url: '/empower/temp/addCustomerEmpower',
    method: 'post',
    data: params,
  })
}

/**
 * app授权
 * @param phone 手机号
 * @param source 来源
 */
 export function addCustomerEmpower(params) {
  return request({
    url: '/empower/driver/addCustomerEmpower',
    method: 'post',
    data: params,
  })
}

/**
 * 修改用户授权
 * @param customerId 客户ID
 * @param passengerEmpowerStatus 乘客授权状态 0.未授权 1.授权
 */
export function updateCustomerEmpower(params) {
  return request({
    url: '/empower/updateCustomerEmpower',
    method: 'post',
    data: params,
  })
}