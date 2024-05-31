import request from '@/utils/request';

/**
 * 分页查询用户查询红包
 */
export function getRedEnvelopeList(params) {
  return request({
    url: 'redenvelope',
    method: 'get',
    params: params
  })
}


/**
 * 领取红包
 */
export function receiveRedEnvelope(redEnvelopeId) {
  return request({
    url: 'redenvelope/' + redEnvelopeId,
    method: 'put'
  })
}



