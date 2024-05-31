import { post } from './request'
import api from './api'
// 智慧生活request
import smartRequest from '@/utils/smartRequest'
// 查询联通手机号
export const queryMobileNumber = (params) => {
  return smartRequest({
    url: api.queryMobileNumber,
    method: 'post',
    data: params,
  })
}

// 查询省市区
export const queryAreas = (params) => {
  return smartRequest({
    url: api.queryAreas,
    method: 'post',
    data: params,
  })
}

// 身份证号校验
export const checkIdNumber = (params) => {
  return smartRequest({
    url: api.checkIdNumber,
    method: 'post',
    data: params,
  })
}

// 保存领取的手机号
export const saveMobileNumber = (params) => {
  return smartRequest({
    url: api.saveMobileNumber,
    method: 'post',
    data: params,
  })
}

// 获取初始信息
export const queryDriverInfo = (params) => {
  return smartRequest({
    url: api.queryDriverInfo,
    method: 'post',
    data: params,
  })
}

// 套餐列表查询
export const queryPackageCfgList = (params) => {
    return smartRequest({
      url: api.queryPackageCfgList,
      method: 'post',
      data: params,
    })
  }