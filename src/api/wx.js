
import request from '@/utils/request'

// 获取jssdk参数
export function getjssdk(params) {
    return request({
        url: `share/sign?url=${params}`,
        method: 'get',
    })
}
