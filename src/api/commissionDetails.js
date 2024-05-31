import request from '@/utils/request'


export function queryDistributionOrdersByMonth(data) {
    return request({
        url: 'queryDistributionOrdersByMonth',
        method: 'get',
        params: data
    })
}