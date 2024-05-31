import request from '@/utils/request'

/**
 * 首页查询秒杀展示Sku 4条
 */
export function querySeckillScene() {
  return request({
    url: 'seckillscene/sku',
    method: 'get',
  })
}

/**
 * 查询秒杀场次
 */
export function querySeckilldetail() {
  return request({
    url: 'seckilldetail',
    method: 'get',
  })
}

/**
 * 分页查询指定场次下的秒杀商品spu列表
 */
export function querySeckillSceneSpu(params) {
  return request({
    url: 'panicBuy/seckillscene',
    method: 'get',
    params,
  })
}

/**
 * 秒杀专区查询商品详情
 */
export function querySeckillSceneSpuDetail(params) {
  return request({
    url: `seckillscene/spu`,
    method: 'get',
    params,
  })
}

/**
 * 秒杀/首单活动校验商品信息
 */
export function checkSkuPanicBuyLimitNum(params) {
  return request({
    url: `checkSkuLimitNum`,
    method: 'post',
    data: params,
  })
}

/**
 * 结算前校验所选商品是否达到秒杀限制数
 */
export function checkLimitNumBeforeSettlement(params) {
  return request({
    url: `checkMarketingLimitBeforeSettlement`,
    method: 'post',
    data: params,
  })
}
