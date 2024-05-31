<template>
    <div class="order-detail-page">
        <div class="order-container" v-if='!initLoading'>
            <header-nav :countdown='countdown' :data="data" @timeOutCancle='timeOutCancle'></header-nav>
            <div class="order-wrapper">
                <div class="back-card item-card" v-if="data.status == 6 && data.orderSkuWithMarketings[0].refundStatus == 2">
                    <span class="label">已原路退回</span>
                    <div class="value">
                        <span class="coin">￥</span>
                        <span class="int-price">{{ setPrice(data.realBackPrice)[0] }}.</span>
                        <span class="float-price">{{ setPrice(data.realBackPrice)[1] }}</span>
                    </div>
                </div>
                <!-- 取车码 -->
                <div class="get-car-card item-card" v-if='showGetCarCode'>
                    <span class="label">请到店后出示<span class="code-label">取车码</span></span>
                    <div class="value code-value">{{data.deliveryGoodsCode}}</div>
                </div>
                <!-- 自提门店 -->
                <stores-card :class="{'no-code':!showGetCarCode}" haveNavigation haveTime haveDisTance :storeInfo='storeInfo'></stores-card>
                <div class="order-goods-card">
                    <order-good-item :data="skuData"></order-good-item>
                    <div class="buy-detail-wrapper">
                        <div class="buy-detail-item">
                            <span class="label">商品总价</span>
                            <span class="value" v-if="data.totalSalePrice">¥{{data.totalSalePrice.toFixed(2)}}</span>
                        </div>
                        <div class="buy-detail-item" v-if="data.retailerCouponPrice && data.retailerCouponPrice > 0">
                            <span class="label">优惠劵</span>
                            <span class="value copun-value">-¥{{ data.retailerCouponPrice.toFixed(2) }}</span>
                        </div>
                        <div class="buy-detail-item">
                            <span class="label">实付款</span>
                            <div class="value"><span class="coin">¥</span>
                                <span class="int-money">{{ setPrice(data.price)[0] }}.</span>
                                <span class="float-money">{{ setPrice(data.price)[1] }}</span></div>
                        </div>
                    </div>

                    <div class="order-help-wrapper">
                        <div class="helper-item" v-if='showBillServerBtn' @click="Invoicinged">
                            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/invoice-icon.png" alt="">
                            <span v-if="data.invoiceFlag == 1">查看发票</span>
                            <span v-else>发票服务</span>
                            
                        </div>
                        <div class="helper-item" @click="callUp">
                            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/chat-icon.png" alt="">
                            <span>联系客服</span>
                        </div>
                    </div>
                </div>
                <div class="order-other-card">
                    <div class="other-item">
                        <span class="label">订单编号</span>
                        <div class="value">
                            <span>{{ data.orderCode }}</span>
                            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ic_copy.png" @click="copyOrder(data.orderCode)" alt="">
                        </div>
                    </div>
                    <div class="other-item">
                        <span class="label">创建时间</span>
                        <div class="value">{{data.createTime}}</div>
                    </div>
                    <div class="other-item" v-if='data.payTime'>
                        <span class="label">付款时间</span>
                        <div class="value">{{data.payTime}}</div>
                    </div>
                    <div class="other-item" v-if="data.receivingTime">
                        <span class="label">成交时间</span>
                        <div class="value">{{data.receivingTime}}</div>
                    </div>
                    <div class="other-item note" v-if="data.remark">
                        <span class="label">订单备注</span>
                        <div class="value">{{data.remark}}</div>
                    </div>
                </div>

                <div class="license-guide-card item-card">
                    <div class="label">
                        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/license-icon.png" alt="">
                        <span>上牌说明</span>
                    </div>
                    <div class="value" @click="toGetLicensePage">
                        <span>自行上牌指南</span>
                        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
                    </div>
                </div>
            </div>
        </div>

        <div class="order-footer" v-if="data.status == 1">
            <div class="left-btn" @click="cancleOrder">取消订单</div>
            <div @click="toPay(data)">
                继续付款
            </div>
        </div>
        <div class="order-footer" v-if="[5,6,7].includes(data.status * 1) || [1,2].includes(data.refundStatus * 1)">
            <div @click="reBuy(data)">
                重新下单
            </div>
        </div>
        <el-amap :plugin="plugin" v-show=" false"></el-amap>
    </div>
</template>

<script>
import HeaderNav from './component/headerNav.vue'
import StoresCard from './component/storesCard.vue'
import OrderGoodItem from './component/orderGoodItem.vue'
import { Dialog, Toast } from 'vant'
import { queryOrderDetail, cancelOrder, deliveryGoods } from '@/api/orderlist'
import { formatPrice } from '@/utils/utils'
export default {
    components: {
        HeaderNav,
        StoresCard,
        OrderGoodItem
    },
    data() {
        return {
            formatPrice,
            //剩余时间
            countdown: 1800000,
            //订单详情
            data: {},
            //取货信息
            storeInfo: {},
            //SKU商品信息
            skuData: {},
            setTimer: () => { },
            plugin: [
                {
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: 10000, // 超过30秒后停止定位，默认：无穷大
                    zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    showButton: false, // 显示定位按钮，默认：true
                    pName: 'Geolocation',
                    events: {
                        init: (o) => {
                            this.GDinit(o, this) // 获取当前位置
                        },
                    },
                },
            ],
            longitude: '',
            latitude: '',
            cityCode: '',
            initLoading: true
        }
    },
    async created() {
        if (sessionStorage.getItem('motorPotionParams')) {
            let motorPotionParams = JSON.parse(sessionStorage.getItem('motorPotionParams')) || {}
            this.longitude = motorPotionParams.longitude
            this.latitude = motorPotionParams.latitude
            this.cityCode = motorPotionParams.cityCode
            this.getData(true)
            
        }
        this.setTimer = setInterval(this.getData, 60000)
    },
    beforeDestroy() {
        clearInterval(this.setTimer)
    },
    methods: {
        timeOutCancle() {
            clearInterval(this.setTimer)
        },
        // 价格展示处理
        setPrice(val) {
            return this.formatPrice(val).split('.')
        },
        copyOrder(code) {
            let oInput = document.createElement('input')
            oInput.value = code
            document.body.appendChild(oInput)
            oInput.select() // 选择对象;
            document.execCommand('Copy') // 执行浏览器复制命令
            this.$toast('复制成功')
            oInput.remove()
        },
        toGetLicensePage() {
            this.$router.push({
                path: '/motorCar/licenseGuide'
            })
        },
        Invoicinged() {
            if(this.data.invoiceFlag == 1) {
                this.$router.push({
                    path: '/Invoicinged',
                    query: {
                        id: this.data.id,
                        price: this.data.price
                    },
                })
            } else {
                Dialog.confirm({
                    message: '非自营订单的发票由商家开具，具体金额以实际开票为准。如有疑问，请联系商家。',
                    confirmButtonText:'联系商家',
                    cancelButtonText: '取消'
                }).then(() => {
                    
                })
            }
            
        },
        // 查询当前经纬度
        async GDinit(o) {
            if (sessionStorage.getItem('motorPotionParams')) {
                return
            }
            await this.getData()
            let that = this
            o.getCurrentPosition((status, result) => {
                if (status === 'complete' && result.info === 'SUCCESS') {
                    that.longitude = result.position.getLng()
                    that.latitude = result.position.getLat()
                    let { adcode } = result.addressComponent
                    that.cityCode = adcode.slice(0, 4) + '00'
                    const motorString = JSON.stringify({
                        longitude: that.longitude,
                        latitude: that.latitude,
                        cityCode: that.cityCode
                    })
                    sessionStorage.setItem('motorPotionParams', motorString)
                    that.deliveryGoods()
                } else {
                    // this.deliveryGoods()
                    this.$toast('定位失败,请刷新后重试')
                    this.initLoading = false
                }
            })

        },
        //获取取货信息
        deliveryGoods() {
            //测试 经纬度
            let params = {
                longitude: this.longitude || 114.40852,//经度
                latitude: this.latitude || 30.476683,//纬度
                idNumber: this.data.storeId,
                orderId: this.$route.query.orderId
            }
            deliveryGoods(params).then((res) => {
                if (res.code == 200) {
                    this.storeInfo = {
                        ...res.data,
                        storeName: res.data.name,
                        checked: true,
                        idNumber: this.data.storeId
                    }
                }
            })
        },
        //获取订单详情
        async getData(bool) {
            queryOrderDetail({ id: this.$route.query.orderId }).then((res) => {
                if (res.code == 200) {
                    this.data = res.data
                    this.skuData = {
                        ...res.data.orderSkuWithMarketings[0],
                        canRefund: res.data.canRefund
                    }
                    if(bool) {
                        this.deliveryGoods()
                    }
                    // 订单超时
                    if (this.data.status == 1) {
                        let overtime = new Date(this.data.createTime.replace(/-/g, '/')).getTime() + 1800000
                        let time = overtime - new Date().getTime()
                        this.countdown = time
                        if (this.countdown < 0) {
                            this.autoSubmit({ addCart: false, reason: '订单超时自动取消' })
                        } else {
                            setTimeout(function () {
                                this.autoSubmit({ addCart: false, reason: '订单超时自动取消' })
                            }, time)
                        }
                    }
                }
                this.initLoading = false
            }).catch(err => {
                this.initLoading = false
            })
        },
        // 自动取消订单
        autoSubmit(data) {
            let params = {
                orderId: this.data.id,
                addCart: data.addCart,
                reason: data.reason,
            }
            cancelOrder(params).then((res) => {
                if (res == 1) {
                    this.getData()
                }
            })
        },
        cancleOrder() {
            Dialog.confirm({
                message: '是否确认取消订单？',
            }).then(() => {
                this.autoSubmit({ addCart: false, reason: '用户主动取消' })
            })
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
        async toPay(data) {           
            let appData = JSON.parse(localStorage.getItem('appData'))
            if(appData && appData.appScheme == 'wsf') {
                this.commonPay(data.price, data.orderCode, appData)  
            } else {
                this.$router.push({
                    path: '/zhPay',
                    query: { money: data.price, orderCode: data.orderCode, type: 1, id: this.$route.query.orderId, serviceType: 100 },
                })
                // this.$router.push({
                //     path: '/pay',
                //     query: {
                //         id: this.$route.query.orderId,
                //         money: data.price,
                //         orderCode: data.orderCode,
                //         type: 1,
                //     },
                // })
            }         
        },
        reBuy(data) {
            this.$router.push({
                path: '/motorCar/detail',
                query: {
                    skuId: data.orderSkuIds[0]
                }
            })
        },
        // 联系客服
        toService() {
            let that = this
            let storeServiceConfig = undefined,
                options = {},
                data = undefined,
                pt_is_sj = false
            data = that.data
            storeServiceConfig = that.data.storeServiceConfig
            //  过滤值为空的字段
            Object.keys(storeServiceConfig).forEach((key) => {
                if (storeServiceConfig[key]) {
                    if (key == 'staffId') {
                        options.staffid = storeServiceConfig[key]
                    } else {
                        options[key] = storeServiceConfig[key]
                    }
                }
            })
            //  options.staffid = '6014114' //指定客服
            options.staffid ? (pt_is_sj = true) : (pt_is_sj = false)
            console.log(options, '👩')
            ysf('config', {
                ...options,
                success: function () {
                    that.productFun(data, pt_is_sj)
                },
            })
        },
        productFun(data, pt_is_sj) {
            let that = this,
                tagsUrl = '',
                pt = '',
                sj = '',
                title = '',
                status = 0
            status = that.data.status
            pt = `https://platform.wsfmall.com/ordermagamemt/storeorder/storeorderdetail?id=${that.$route.query.orderId}&backStatus=${that.$route.query.backStatus}`
            sj = `https://merchant.wsfmall.com/ordermanagement/mallorder/orderdetail?id=${that.$route.query.orderId}&backStatus=${that.$route.query.backStatus}`
            // 判断：指定客服id为空，则跳转平台端订单详情，否则跳转商家端订单详情
            pt_is_sj ? (tagsUrl = sj) : (tagsUrl = pt)
            ysf('product', {
                show: 1, //1为打开， 其他参数为隐藏（包括非零元素
                title: `订单号: ${that.data.orderCode}`,
                desc: data.orderSkuWithMarketings[0].skuName,
                picture: data.orderSkuWithMarketings[0].skuImage,
                note: `￥${data.orderSkuWithMarketings[0].price}`,
                url: `https://m.wsfmall.com/motorCar/orderDetail?orderId=${data.id}&backStatus=${data.backStatus}`, // 跳转客户端商品详情页面
                sendByUser: 0, //自动发送卡片
                tags: [
                    {
                        label: '查看订单详情', // 按钮名字
                        url: tagsUrl, // 跳转客户端商品详情页面
                    },
                ],
                success: function () {
                    ysf('open') //打开客服窗口
                },
                error: function () {
                    console.warn('连接客服失败')
                },
            })
        },
    },
    computed: {
        showBillServerBtn() {
            return this.data.status != 5 && this.data.status != 6 && this.data.status != 7
        },
        showGetCarCode(){
           return (this.data.status == 2 || this.data.status == 3) 
           && (!this.data.backOrderLogVO || (this.data.backOrderLogVO.status != 2 && this.data.backOrderLogVO.status != 1))
        }
    }
}
</script>
<style lang="less" scoped>
.order-detail-page {
  background: #f6f6f6;
  height: 100%;
  display: flex;
  flex-direction: column;
  .order-container {
    flex: 1;
    overflow-y: auto;
    .order-wrapper {
      padding: 10px 12px;
      .no-code {
        margin-top: 0;
      }
      .item-card {
        background: #fff;
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label {
          color: #111111;
          font-size: 16px;
          font-weight: bold;
          .code-label {
            color: #ff0a35;
          }
        }
        .value {
          font-size: 11px;
          color: #ff0a35;
          font-weight: bold;
          .int-price {
            font-size: 20px;
          }
          &.code-value {
            font-size: 24px;
            line-height: 28px;
          }
        }
      }
      .order-goods-card {
        background: #fff;
        padding: 12px 12px 8px;
        border-radius: 12px;
        margin-bottom: 10px;
        margin-top: 10px;
        overflow: hidden;
        .buy-detail-wrapper {
          margin-top: 10px;
          padding: 10px 0;
          position: relative;
          .buy-detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 18px;
            align-items: center;
            &:last-child {
              margin-bottom: 0;
            }
            .label {
              font-size: 13px;
              color: #191919;
            }
            .value {
              font-size: 13px;
              color: #191919;
              &.copun-value {
                color: #ff0a35;
              }
              .coin,
              .float-money {
                color: #ff0a35;
                font-size: 11px;
                font-weight: bold;
              }
              .int-money {
                color: #ff0a35;
                font-weight: bold;
                font-size: 20px;
              }
            }
          }
          &::before {
            content: '';
            width: 200%;
            height: 1px;
            background: #eeeeee;
            position: absolute;
            top: 0;
            left: -16px;
            opacity: 0.6;
          }
          &::after {
            content: '';
            width: 200%;
            height: 1px;
            background: #eeeeee;
            position: absolute;
            bottom: 0;
            left: -16px;
            opacity: 0.6;
          }
        }
        .order-help-wrapper {
          padding-top: 8px;
          display: flex;
          position: relative;
          .helper-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            > img {
              width: 20px;
              height: 20px;
              margin-right: 4px;
            }
            > span {
              color: #646a72;
              font-size: 12px;
            }
          }
          &::after {
            content: '';
            position: absolute;
            width: 1px;
            height: 16px;
            background: #eaeaea;
            left: 50%;
            top: 13px;
            transform: translateX(-50%);
            opacity: 0.6;
          }
        }
      }
      .order-other-card {
        background: #fff;
        padding: 12px;
        border-radius: 12px;
        .other-item {
          display: flex;
          align-items: center;
          margin-bottom: 18px;
          &:last-child {
            margin-bottom: 0;
          }
          .label {
            color: #c3c3c3;
            font-size: 13px;
            margin-right: 12px;
          }
          .value {
            color: #191919;
            font-size: 13px;
            line-height: 17px;
            flex: 1;
            word-break: break-all;
            & > img {
              width: 12px;
              height: 12px;
              margin-left: 4px;
            }
          }
          &.note {
            align-items: flex-start;
            .label {
                line-height: 17px;
            }
          }
        }
      }
      .license-guide-card {
        margin-top: 10px;
        .label {
          color: #191919;
          font-weight: bold;
          font-size: 16px;
          display: flex;
          align-items: center;
          > img {
            width: 24px;
            height: 24px;
            margin-right: 4px;
          }
        }
        .value {
          font-size: 11px;
          color: #999;
          display: flex;
          align-items: center;
          font-weight: normal;
          > img {
            width: 16px;
            height: 16px;
            margin-left: 4px;
          }
        }
      }
    }
  }
  .order-footer {
    height: 48px;
    padding: 4px 12px;
    background: #fff;
    display: flex;
    > div {
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      height: 40px;
      padding: 10px 0;
      color: #fff9e9;
      font-size: 16px;
      text-align: center;
      border-radius: 20px;
      line-height: 20px;
      flex: 1;
      border: 1px solid transparent;
      &:nth-child(2) {
        margin-left: 8px;
      }
      &.left-btn {
        background: #fff;
        color: #FF0D34;
        position: relative;
        &::after {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            top: 0;
            left: 0;
            transform-origin: 0 0;
            border-color: #ff450c;
            border-width: 1px;
            border-style: solid;
            transform: scale(0.5, 0.5);
            border-radius: 40px;
            box-sizing: border-box;
            pointer-events: none;
        }
      }
    }
  }
}
</style>


