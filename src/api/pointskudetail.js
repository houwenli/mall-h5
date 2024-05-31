/**
 * 积分商品详情路由
 *
 * @author Caizize created on 2020/4/20
 */

import request from '@/utils/request'

/**
 * 查询积分商品信息详情
 *
 * @param id 积分商品id
 * @return 积分商品实体
 */
export function queryPointSkuDetail(id) {
  return request({
    url: 'pointskudetail/' + id,
    method: 'get',
  })
}

/**
 * 查询推荐的积分商品列表
 *
 * @param num 推荐单品的数量
 * @return 返回推荐的积分商品列表
 */
export function queryHotPointSkuList(num) {
  return request({
    url: 'hotpointskulist/' + num,
    method: 'get',
  })
}

/**
 * 查询所有的省份
 */
export function queryAllProvinces() {
  return request({
    url: 'provinces',
    method: 'get',
  })
}

/**
 * 根据省份id查询下面的市
 * @param provinceId 省份id
 */
export function queryCityByProvinceId(provinceId) {
  return request({
    url: 'city/' + provinceId,
    method: 'get',
  })
}

/**
 * 根据市id查询下面的区县
 * @param cityId   市id
 */
export function queryDistrictByCityId(cityId) {
  return request({
    url: 'district/' + cityId,
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
