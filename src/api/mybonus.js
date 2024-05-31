import request from '@/utils/request';


/**
 * 分页查询用户查询红包
 */
export function queryRedEnvelopes(params) {
  return request({
    url: 'myredenvelope',
    method: 'get',
    params: params
  })
}
