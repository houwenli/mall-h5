import { post } from './request';
import api from './api';
// 支付宝支付
export const alipay = params => {
    return post({
        // baseURL: 'http://10.208.2.57:10531',
        url: api.alipay,
        params
    });
};
// 微信公众号支付
export const agencyWechatOfficialAccountPay = params => {
    return post({
        // baseURL: 'http://10.208.2.57:10531',
        url: api.agencyWechatOfficialAccountPay,
        params
    });
};
// 微信H5支付
export const agencyWechatH5Pay = params => {
    return post({
        // baseURL: 'https://wssvc-fat05.wsecar.com/api/orgManager',
        url: api.agencyWechatH5Pay,
        params
    });
};
// 获取openid
export const getOpenId = params => {
    return post({
        // baseURL: 'http://10.208.2.57:10531',
        url: api.getOpenId,
        params
    });
};
// 查询订单状态
export const queryStatus = params => {
    return post({
        // baseURL: 'http://10.208.2.57:10531',
        url: api.queryStatus,
        params
    });
};
