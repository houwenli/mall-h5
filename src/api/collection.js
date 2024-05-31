import request from '@/utils/request';

/**
 * 查询集采商品详情
 * @param skuId
 */
export function querySpu(data) {
  return request({
    url: '/enterPriseGoods/detail',
    method: 'post',
    data,
  })
}