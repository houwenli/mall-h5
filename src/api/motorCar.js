import request from '@/utils/request'

// 智慧生活request
import smartRequest from '@/utils/smartRequest'

// 上牌指引
export function guidances(params) {
  return request({
    url: '/agencystore/guidances',
    method: 'post',
    data: params,
  })
}

// 附近门店
export function nearStations(params) {
  return request({
    url: '/agencystore/nearStation',
    method: 'post',
    data: params,
  })
}

// 首页
export function elecSpus(params) {
  return request({
    url: '/agencystore/elecSpus',
    method: 'post',
    data: params,
  })
}

// 隐私号绑定
export function bindPhone(params) {
  return request({
    url: '/agencystore/bindPhone',
    method: 'post',
    data: params,
  })
}


// 新版获取电动车首页
export function getElecBike(params) {
  return smartRequest({
    url: '/electricMotorcycle/app/motorcycle/appQueryPage',
    method: 'post',
    data: params,
  })
}

// 新版获取电动车附近门店
export function queryNearbyStores(params) {
  return smartRequest({
    url: '/electricMotorcycle/app/motorcycle/queryNearbyStores',
    method: 'post',
    data: params,
  })
}

// 新版获取电动车详情
export function appQueryDetail(params) {
  return smartRequest({
    url: '/electricMotorcycle/app/motorcycle/appQueryDetail',
    method: 'post',
    data: params,
  })
}
