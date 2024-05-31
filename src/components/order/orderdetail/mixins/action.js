/**
 * 依赖了order，使用时确保this.order存在
 */
import { Toast } from 'vant'
import { addShoppingCart } from '@/api/spudetail'
export default {
    methods: {
        // 商品详情页
        // bigOrder：商家维度的订单商品，data：sku维度的订单商品
        togoodsdetail(bigOrder,data) {
            // orderType 14 集采订单
            let path = bigOrder.orderType * 1 === 14 ? '/collectionSpudetail' : '/spudetail'
            let query = bigOrder.orderType * 1 === 14 ? {
                id: data.skuId,
                storeId: bigOrder.storeId,
                enterpriseId: bigOrder.enterpriseId
            } : {
                id: data.skuId,
                sourceType: bigOrder.sourceType || 1,
                storeId: bigOrder.storeId
            }
            this.$router.push({
                path,
                query
            })
        },
        // 退款详情
        torefundDetail(data,val) {
            let path=val?'/refundDetail':'/refundServerDetails'
            let query=val? { orderId: data.id,orderCode: data.orderCode,cancelTime: data.cancelTime,}:{ id: data.backOrderId }
            this.$router.push({
                path,
                query,
            })
        },
        // 查看物流
        toCheckLogistics(data, type) {
            if (type == 1) {
                if (data.status < 2 || data.status > 4 || (data.status == 4 && data.deliverGoodsMode == 2)) return
                this.$router.push({
                    path: '/tracesOrder',
                    query: {
                    id: data.id,
                    type: 0,
                    },
                })
            } else if (type == 2) {
                this.$router.push({
                    path: '/tracesOrder',
                    query: {
                        id: data.id,
                        type: 2,
                    },
                })
            }
        },
        // 加入购物车
        addcart(data,bigOrder) {
            addShoppingCart({ skuId: data.skuId, num: data.num, storeId: bigOrder.storeId, sourceType: bigOrder.sourceType }).then((res) => {
                this.isProcess = false
                if (res.code == 200) {
                    switch (res.data) {
                        case 0:
                            Toast('加入购物车失败，请刷新后重试！')
                            break
                        case 1:
                            Toast('成功加入购物车')
                            // 重新查询购物车数量
                            // this.queryCartCount()
                            //重新调详情接口
                            break
                        case -1:
                            Toast('库存不足！')
                            break
                        case -2:
                            Toast('商品不存在！')
                            break
                        case -3:
                            Toast('参数错误！')
                            break
                        case -4:
                            Toast('商品已下架！')
                            break
                        case -5:
                            Toast('达到商品限购数量！')
                            break
                        case -6:
                            Toast('预售商品不能加入购物车！')
                            break
                        case -7:
                            Toast('商品已过期！')
                            break
                        default:
                            Toast('加入购物车失败，请刷新后重试！')
                            break
                    }
                }
            })
        },
        //申请退款   
        async orderOperation(data, text) {
            if (text == '申请退款') {
                this.$router.push({
                    path: 'refundorder',
                    query: {
                        orderSkuId:data.id,//订单商品ID
                        orderId: data.orderId,//订单ID
                    },
                })
            }
        },
        // 联系客服
        toService(bigOrder) {
            let that = this
            let storeServiceConfig = undefined,
                options = {},
                data = undefined,
                pt_is_sj = false
                data = bigOrder || that.order
                storeServiceConfig = that.order.storeServiceConfig
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
                success: function() {
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
                status = data.status
                pt = `https://platform.wsfmall.com/ordermagamemt/storeorder/storeorderdetail?id=${that.$route.query.orderId}&backStatus=${that.$route.query.backStatus}`
                sj = `https://merchant.wsfmall.com/ordermanagement/mallorder/orderdetail?id=${that.$route.query.orderId}&backStatus=${that.$route.query.backStatus}`
                // 判断：指定客服id为空，则跳转平台端订单详情，否则跳转商家端订单详情
                pt_is_sj ? (tagsUrl = sj) : (tagsUrl = pt)
            ysf('product', {
                show: 1, //1为打开， 其他参数为隐藏（包括非零元素
                title: `订单号: ${data.orderCode}`,
                desc: data.orderSkuWithMarketings[0].skuName,
                picture: data.orderSkuWithMarketings[0].skuImage,
                note: `￥${data.orderSkuWithMarketings[0].price}`,
                url: `https://m.wsfmall.com/orderdetail?orderId=${data.id}&backStatus=${data.backStatus}`, // 跳转客户端商品详情页面
                sendByUser: 0, //自动发送卡片
                tags: [
                    {
                    label: '查看订单详情', // 按钮名字
                    url: tagsUrl, // 跳转客户端商品详情页面
                    },
                ],
                success: function() {
                    ysf('open') //打开客服窗口
                },
                error: function() {
                    console.warn('连接客服失败')
                },
            })
        },
    },
}