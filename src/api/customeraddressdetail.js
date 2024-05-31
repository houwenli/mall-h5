import request from '@/utils/request';

/**
 * 新增用户收货地址
 */
export function addAddress(params) {
  return request({
    url: 'address',
    method: 'post',
    data: params
  })
}


/**
 * 修改收货地址
 */
export function updateAddress(params) {
  return request({
    url: 'address',
    method: 'put',
    data: params
  })
}

/**
 * 删除地址
 */
export function deleteCustomerAddressById(addressId) {
  return request({
    url: 'address/' + addressId,
    method: 'delete',
  })
}

/**
 * 根据收货地址id查询收货地址
 */
export function queryCustomerAddress(id) {
  return request({
    url: 'address/' + id,
    method: 'get',
  })
}

/**
 * 查询所有省份(包含下面的市区)
 */
export function queryAllAreas() {
  return request({
    url: 'areas',
    method: 'get',
  })
}
