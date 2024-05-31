import request from '@/utils/request';

/**
 * 根据用户id查询分销下级用户数量
 */
export function querySpreadCustomerByCustomerIdCount() {
  return request({
    url: 'distribution/spread',
    method: 'get',
  })
}


/**
 * 分页查询页面数据
 */
export function queryPageData(params, url) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

/**
 * 绑定推荐码
 */
export function bindRecommendCode(recommendCode) {
  return request({
    url: 'distribution/' + recommendCode,
    method: 'put',
  })
}


/**
 * 根据用户id查询用户个人信息
 */
export function queryCustomerPersonalInfo() {
  return request({
    url: 'customer/personalinfo',
    method: 'get',
  })
}


