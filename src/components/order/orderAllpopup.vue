<template>
    <div class="order-pop">
        <van-popup v-model="isorderShowPoup" @close="poupUpdate" round position="bottom">
            <h3 class="title">温馨提示</h3>
            <p class="tips">
                <span>以下订单一起提交，需合并支付</span>
                <span>如不想一起支付可以先取消不需要的订单再付款</span>
            </p>
            <ul>
                <li v-for="item in isWsorder.orderInfoVos" :key="item.orderCode" @click="tolistdetail(item)">
                    <div class="order-list">
                        <div class="order-code">订单号：{{ item.orderCode }}</div>
                        <div class="order-num">(共{{ item.num }}件)</div>
                    </div>
                    <div class="order-img-box">
                        <img class="order-img" :src="val" v-for="(val, index) in item.skuImgUrls" :key="index" alt="">
                    </div>
                    <div class="order-price">￥{{ item.price }}</div>
                </li>
            </ul>
            <div class="puop-bottom">
                <div class="fqz-item" v-if="isWsorder.fqzPrice && isWsorder.fqzPrice>0">
                    <div class="l">
                        <span class="label">福气值已抵扣：</span>
                        <span class="val">￥{{isWsorder.fqzPrice}}</span>
                    </div>
                    <div class="r">
                        <span class="label">仍需支付：</span>
                        <span class="val">￥{{isWsorder.orderFqzAmount || (isWsorder.totalAmount - isWsorder.fqzPrice).toFixed(2)}}</span>
                    </div>
                </div>
                <div>
                    <van-button class="cancel" @click="$emit('input')" round>再想想</van-button>
                    <van-button color="#E60113" round @click="goToPay">确认支付</van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { regFenToYuan } from '@/utils/utils'
import { Toast } from 'vant'
export default {
    props: {
        isorderShowPoup: {
            default: false,
            type: Boolean
        },
        isWsorder: {
            default: () => {},
            type: Object
        }
    },
    data() {
        return {

        }
    },
    methods: {
        poupUpdate() {
            this.$emit('input', false)
        },
        commonPay(sendMoney, orderNo, appData){            
            let payParams = {
                "configRequestParams": {
                    uid: appData.userId, // 用户id
                    businessType: 100, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
                    amount: sendMoney* 100, // 待支付金额
                    platform: 1 // 客户端 1.APP 2.微信小程序 3.H5
                },  // 拉取收银台参数
                "payRequestParams": {
                    orderNo, // 智慧生活业务订单号                   
                    userId: appData.userId, // 用户ID
                    businessType: 100, // 业务类型   
                    paySceneType: 101                                                     
                }, // 收银台支付接口参数
                "showInfo": {
                    amount: sendMoney* 100, // 展示金额
                    businessTypeName: "电商优选", // 业务线名称
                    expirationTimeStr: "" // 如果需要显示支付倒计时就传
                }
            }     
            if (window.ws) {
                window.ws.appCashierPay(
                    JSON.stringify(payParams)              
                )     
                window.appCashierPayResult  = (res) => {
                    res = JSON.parse(res) 
                    if(res.payStatus == 'PAID'){
                        sessionStorage.removeItem('wxzf_payResult') 
                        this.$router.push({
                            path: '/paysuccess',
                            query: { payResult: res },
                        })
                    } else {
                        Toast(res.msg)
                    }
                }         
            } else if (window.webkit) {
                window.webkit.messageHandlers.appCashierPay.postMessage(payParams)            
                window.appCashierPayResult = (res) => {
                    if(res.payStatus == 'PAID'){
                        sessionStorage.removeItem('wxzf_payResult') 
                        this.$router.push({
                            path: '/paysuccess',
                            query: { payResult: res },
                        })
                    } else {
                        Toast(res.msg)
                    }
                }         
            } else {
                Toast('当前版本app不支持收银台支付，请升级app后重试')
            }
        },
        goToPay() {
           
            let sendMoney = this.isWsorder.orderFqzAmount || (this.isWsorder.totalAmount - this.isWsorder.fqzPrice).toFixed(2)
            let appData = JSON.parse(localStorage.getItem('appData'))
            if(appData && appData.appScheme == 'wsf') {
                this.commonPay(sendMoney, this.isWsorder.wsOrderCode, appData) 
            } else {
                this.$router.push({
                    path: '/zhPay',
                    query: { money: sendMoney, orderCode: res.orderCode, type: 1, id: this.orderId, serviceType: 100 },
                })
                // this.$router.push({
                //     path: '/pay',
                //     query: {
                //         money: this.isWsorder.orderFqzAmount || (this.isWsorder.totalAmount - this.isWsorder.fqzPrice).toFixed(2),
                //         orderCode: this.isWsorder.wsOrderCode,
                //         type: 1,
                //     },
                // })
            }
                                
        },
        tolistdetail(data) {
            this.$router.push({ path: '/orderdetail', query: { orderId: data.orderId, backStatus: data.backStatus } })
            this.isorderShowPoup = false
        },
    }
}
</script>
<style lang="less" scoped>
.order-pop {
    text-align: center;
    .title {
        padding-top: 20px;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        color: #000;
    }

    .tips {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 9px;
        padding-bottom: 20px;
        font-size: 14px;
        color: #90969E;
        line-height: 18px;
    }

    ul {
        max-height: 394px;
        overflow-y: scroll;
        padding: 0 24px;
    }

    li {
        padding-top: 20px;
        line-height: 24px;
        font-size: 14px;
        &:first-of-type {
            padding-top: 0;
        }
    }

    .order-list {
        display: flex;
        justify-content: space-between;
        color: #000;
    }
    .order-price {
        margin-top: 10px;
        color: #DE3A38;
        font-weight: 600;
        text-align: right;
        line-height: 17px;
    }
    .order-num {
        color: #999;
        font-size: 12px;
    }
    .order-img-box {
        display: flex;
        flex-wrap: wrap;
        .order-img {
            margin-top: 12px;
            margin-right: 10px;
            width: 74px;
            height: 74px;
        }
        .order-img:nth-child(4n) {
            margin-right: 0;
        }
    }

    .puop-bottom {
        margin-top: 30px;
        border-top: 0.5px solid #D5D5D5;
        padding-top: 10px;
        padding-bottom: 6px;
        .fqz-item {
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
            .l {
                margin-right: 16px;
            }
            .l, .r {
                font-size: 12px;
                color: #000;
                .val {
                    color: #DE3A38;
                    font-weight: bold;
                }
            }
        }
        .van-button {
            width: 164px;
            line-height: 40px;
            height: 40px;
            box-sizing: border-box;
        }

        .cancel {
            border: 1px solid #E60113;
            color: #E60113;
        }
    }
}
</style>