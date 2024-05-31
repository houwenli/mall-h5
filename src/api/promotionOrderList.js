import request from '@/utils/request'

/**
 * 推广商品列表
 * @param {} data 
 */
export function DistributionOrder(data) {
    return request({
        url: 'distributionOrder/page',
        method: 'post',
        data: data
    })
}

/**
 * 推广商品详情
 * @param {} data 
 */
export function distributionOrderDetail(data) {
    return request({
        url: 'distributionOrder/detail',
        method: 'get',
        params: data
    })
}