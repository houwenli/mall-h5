import request from '@/utils/request'

/**
 * 查询分销员信息(含支付宝信息)
 */
export function queryDistributionUserPayInfoByUserId() {
    return request({
        url: 'queryDistributionUserPayInfoByUserId',
        method: 'get'
    })
}

/**
 * 绑定/修改支付宝账号和姓名
 * @param {string} realName 姓名
 * @param {string} accountName 支付宝账号
 * @param {string} code  验证码
 */
export function updateAccountNameByUserId(data) {
    return request({
        url: 'updateAccountNameByUserId',
        method: 'put',
        data
    })
}

/**
 * 获取绑定支付宝的验证码
 * @param {string} code 验证码 
 */
export function updateAccountSendcode(data) {
    return request({
        url: 'updateAccountSendcode',
        method: 'post',
        data
    })
}
/**
 * 分销员发起提现申请
 * @param {string} accountName 账户名称(与账户类型对应)
 * @param {number} accountType 账户类型1我的钱包2支付宝
 * @param {number} amount 提现金额 
 */
export function addWithdrawalRecord(data) {
    return request({
        url: 'addWithdrawalRecord',
        method: 'post',
        data
    })
}

/**
 * 分页查询所有提现记录			
 * pageNum	起始页码			
 * pageSize	每页尺寸		
 * @param {*} data 
 */
export function queryWithdrawalRecords(data) {
    return request({
        url: 'queryWithdrawalRecords',
        method: 'get',
        params: data
    })
}
/**
 * 分页查询已结算记录
 * pageNum	起始页码			
 * pageSize	每页尺寸
 * @param {*} data 
 */
export function queryAllPayWithdrawalRecords(data) {
    return request({
        url: 'queryAllPayWithdrawalRecords',
        method: 'get',
        params: data
    })
}