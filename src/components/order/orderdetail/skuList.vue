<template>
<!-- 商品信息 -->
<div v-if="orderDetailData.orderDetailVos && orderDetailData.orderDetailVos.length > 0">
    <div v-for="(bigOrder, bigOrderIndex) in orderDetailData.orderDetailVos" :key="bigOrder.id">
        <div class="sku module-com" v-if="bigOrder.orderSkuWithMarketings && bigOrder.orderSkuWithMarketings.length > 0">
            <p class="sku-title">共计{{bigOrder.orderSkuWithMarketings.length}}件商品</p>
            <div class="sku-container">
                <div class="sku-every" v-for="item in bigOrder.orderSkuWithMarketingsCopy" :key="item.id">
                    <div class="sku-info" @click="togoodsdetail(bigOrder,item)">
                        <img :src="item.skuImage" class="sku-every__img" alt="" />
                        <div class="sku-every__content">
                            <div class="sku-every__top">
                                <div class="sku-every__name">{{ item.skuName }}</div>
                                <div class="sku-every__desc">数量:{{ item.num }}{{ item.skuSpecs }}</div>

                                <!-- 买送-->
                                <!-- ui4期产品说没有这块信息 -->
                                <!-- <span
                                class="buygiveboxwrapper"
                                v-for="r in item.marketingVos"
                                :key="r.id"
                                :style="{ 'margin-bottom': r.type == 12 ? '' : '0.56rem', display: r.type == 12 ? '' : 'inline-block' }"
                                >
                                <label class="buygivebox border_half" v-if="r.type == 12">
                                    {{ r.name }}
                                </label>
                                </span> -->

                                <div class="performance" v-if="item.performanceScore && item.performanceScore>0">
                                    <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" alt="">
                                    <div class="num-pannel">绩效分:<span class="num">{{ item.performanceScore }}</span></div>
                                </div>
                            </div>
                            <div class="sku-every__bottom">
                                <div class="sku-every__price-info">
                                    <span class="fqz-price" v-if= "item.integralPoint > 0">
                                      <span>
                                        <span class="special">{{item.integralPoint }}</span>
                                        福气值+<span>{{ item.deductionAfterPrice }}</span>元
                                      </span>
                                    </span>

                                    <div class="sku-every__price" v-else-if="item.oldPrice">
                                        ￥<span>{{ item.oldPrice | getPriceInt }}</span>.{{ item.oldPrice | getPriceDecimal }}
                                    </div>
                                    <div class="sku-every__num">x{{ item.num }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 赠品 -->
                    <!-- ui4期产品说没有赠品 -->
                    <!-- <div class="giveGiftbox" v-if="item.marketingVos">
                        <div v-for="(temp, s) in item.marketingVos" :key="s" v-if="temp.type == 2">
                        <div v-if="temp.fullGiftList.length > 0">
                            <div v-for="g in temp.fullGiftList[0].giftSkuInfos" :key="g.id" class="goodsbox">
                            <img :src="g.url" class="goodsimg" alt="" />
                            <div class="goodsinfo">
                                <p class="goodsname commomover">{{ g.name }}</p>
                                <p class="goods_gg overline">
                                <span>数量:{{ g.num }}</span>
                                <label v-for="(r, e) in filterSkuSpecs(g.skuSpecValues)" :key="e">
                                    <span>{{ r.name }}：{{ r.valueRemark }}</span>
                                    <span class="goods_ggshu"></span>
                                </label>
                                </p>
                                <strong style="margin-top: 0.8rem; display: inline-block; font-size: 0.56rem">赠品</strong>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div> -->
                    <!-- <div class="sku-active">
                        <div
                            class="sku-active__btn"
                            v-if="(item.isDelivery == 1 && (bigOrder.status == 2 || bigOrder.status == 3)&& bigOrder.orderType != 7)"
                            @click="toCheckLogistics(item, 2)"
                        >
                            查看物流
                        </div>
                        <div class="sku-active__btn" @click="torefundDetail(item)" v-if="[1,'1',3,'3'].includes(item.refundStatus)||(item.refundStatus == 2 && bigOrder.oldRefund != 1) ">{{refundTextMap[item.refundStatus]}}</div>
                        <div class="sku-active__btn" v-if="([0,'0',3,'3'].includes(item.refundStatus) && bigOrder.canRefund && bigOrder.orderType != 10)" @click="orderOperation(item,'申请退款')">申请退款</div>
                        <div class="sku-active__btn sku-active__red" v-if="bigOrder.status != 1" @click="addcart(item)">加购物车</div>
                    </div> -->
                    <div class="sku-active">
                        <div
                            class="sku-active__btn"
                            v-for="btnItem in item.btnArr"
                            :key="btnItem.type"
                            :class="btnItem.classOther"
                            @click="btnItem.func"
                        >
                            {{ btnItem.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="sku-more-btn" v-if="bigOrder.orderSkuWithMarketings.length > 3" @click="isHasMore(bigOrderIndex)">
                <img v-if="bigOrder.hasMore" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-btn-btom.png"/>
                <img v-else src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-btn-top.png"/>
            </div>
            <div class="sku-remark" v-if="bigOrder.remark">
                <div class="sku-remark__desc">买家留言</div>
                <div class="sku-remark__detail">{{ bigOrder.remark }}</div>
            </div>
            <div class="sku-service" @click="callUp">
                <img class="sku-service__img" src="@/assets/img/service_new.png">
                联系客服
            </div>
        </div>

    </div>
</div>

</template>
<script>

import { getSplitPrice } from '@/utils/utils'
import action from './mixins/action'
export default {
    mixins: [action],
    components: {
    },
    props: {
        order: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    computed: {
    },
    filters: {
      getPriceInt(val) {
        let temp = getSplitPrice(val)
        return temp && temp.int
      },
      getPriceDecimal(val) {
        let temp = getSplitPrice(val)
        return temp && temp.decimal
      }
    },
    data() {
        return {
            refundTextMap:{
                1: '退款中',
                2: '退款成功',
                3: '退款失败',
            },
            orderDetailData: {}
        }
    },
    watch: {
        order() {
            this.dealDetailData()
        }
    },
    mounted() {

    },
    methods: {
        // 处理传进来的订单详情数据
        dealDetailData () {
            this.orderDetailData = this.order || {}
            // 针对商品处理，主要为了展开收起功能
            if (this.orderDetailData.orderDetailVos) {
                this.orderDetailData.orderDetailVos.forEach(item => {
                    let orderSkuWithMarketings = item.orderSkuWithMarketings || [];
                    if (orderSkuWithMarketings.length > 3) {
                        item.orderSkuWithMarketingsCopy = orderSkuWithMarketings.slice(0, 3)
                        item.hasMore = true
                    } else {
                        item.orderSkuWithMarketingsCopy = orderSkuWithMarketings
                        item.hasMore = false
                    }

                    // 处理商品下按钮，传入大订单
                    this.dealSkuBtn(item)

                })
            }
        },
        // 查看更多按钮切换
        isHasMore(index) {
            let curOrderDetailVos = this.orderDetailData.orderDetailVos[index] || {}
            let orderSkuWithMarketings = curOrderDetailVos.orderSkuWithMarketings || [];

            curOrderDetailVos.hasMore = !curOrderDetailVos.hasMore
            if(curOrderDetailVos.hasMore) {
                curOrderDetailVos.orderSkuWithMarketingsCopy = orderSkuWithMarketings.slice(0, 3)
            } else {
                curOrderDetailVos.orderSkuWithMarketingsCopy = orderSkuWithMarketings
            }
            this.orderDetailData = Object.assign({}, this.orderDetailData)
        },
        // 处理每个商品底部按钮
        dealSkuBtn (bigOrder = {}) {
            let orderSkuWithMarketings = bigOrder.orderSkuWithMarketings || []
            // 遍历订单中的各个商品
            orderSkuWithMarketings.forEach(item => {
                let btnArr = []
                let btnStrategy = this.skuBtnStrategy()
                for (let strategy in btnStrategy) {
                    let strategyRes = btnStrategy[strategy](item, bigOrder)
                    if (strategyRes) {
                        btnArr.push(strategyRes)
                    }
                }
                this.$set(item, 'btnArr', btnArr)
            })
        },
        // 按钮策略判断方法
        skuBtnStrategy () {
            let _that = this
            return {
                // 是否展示查看物流按钮
                logisticsBtn (order, bigOrder) {
                    if (order.isDelivery == 1 && (bigOrder.status == 2 || bigOrder.status == 3) && bigOrder.orderType != 7 && (_that.orderDetailData && !_that.orderDetailData.kdniaoTrackVO) ) {
                        return {
                            type: 'logisticsBtn',
                            name: '查看物流',
                            classOther: '',
                            func: () => {
                                _that.toCheckLogistics(order, 2)
                            }
                        }
                    }
                },
                // 是否展示退款状态按钮
                refundStatusBtn (order, bigOrder) {
                    if ([1, 3].includes(+order.refundStatus)||(order.refundStatus == 2 && bigOrder.oldRefund != 1) ) {
                        return {
                            type: 'refundStatusBtn',
                            name: _that.refundTextMap[order.refundStatus],
                            classOther: '',
                            func: () => {
                                _that.torefundDetail(order)
                            }
                        }
                    }
                },
                // 是否展示申请退款按钮
                canRefundBtn (order, bigOrder) {
                    if ([0, 3].includes(+order.refundStatus) && bigOrder.canRefund && bigOrder.orderType != 10) {
                        return {
                            type: 'canRefundBtn',
                            name: '申请退款',
                            classOther: '',
                            func: () => {
                                _that.orderOperation(order,'申请退款')
                            }
                        }
                    }
                },
                // 是否展示加购物车
                addCartBtn (order, bigOrder) {
                    if(bigOrder.orderType * 1 === 14){
                        // 集采商品不能加购
                        return
                    }
                    if (bigOrder.status != 1) {
                        return {
                            type: 'addCartBtn',
                            name: '加购物车',
                            classOther: 'sku-active__red',
                            func: () => {
                                _that.addcart(order,bigOrder)
                            }
                        }
                    }
                }
            }
        }
    },
}
</script>

<style scoped lang="less">
    .module-com {
        width: 351px;
        background: #FFFFFF;
        border-radius: 12px;
        margin: 10px auto 0;
    }
    .sku {
        padding: 10px;
        &-title {
            height: 15px;
            line-height: 15px;
            font-size: 11px;
            font-weight: 400;
            color: #999999;
            line-height: 15px;
        }
        // &-container {

        // }
        &-every {
            margin-top: 20px;
        }
        &-every:first-of-type {
            margin-top: 10px;
        }
        &-info {
            display: flex;
        }
        &-every__img {
            width: 102px;
            height: 102px;
            border-radius: 8px;
        }
        &-every__content {
            margin-left: 8px;
            width: 220px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;
        }
        &-every__top {
            width: 100%;
        }
        &-every__name {
            font-size: 13px;
            font-weight: 500;
            color: #191919;
            line-height: 17px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
        &-every__desc {
            height: 15px;
            line-height: 15px;
            font-size: 11px;
            font-weight: 400;
            color: #999999;
            margin-top: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }
        .performance {
            display: flex;
            img {
                width: 16px;
                height: 16px;
            }
            .num-pannel {
                color: #008864;
                font-size: 11px;
                .num {
                font-size: 11px;
                font-weight: bold;
                }
            }
        }

        &-every__bottom {
            width: 100%;
        }
        &-every__price-info {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
        }
        &-every__price {
            height: 20px;
            line-height: 20px;
            font-size: 13px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #191919;
            span {
                font-size: 16px;
            }
        }
        &-every__num {
            height: 17px;
            line-height: 17px;
            font-size: 13px;
            font-weight: 400;
            color: #999999;
        }
        &-active {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 8px;
        }
        &-active__btn {
            height: 28px;
            text-align: center;
            border-radius: 16px;
            box-shadow: 0 0 0 0.5px #C3C3C3;
            font-weight: 400;
            color: #191919;
            margin-left: 12px;
            flex-shrink: 0;
            padding: 0px 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &-active__red {
            color: #FF0A35;
            box-shadow: 0 0 0 0.5px #FF0A35;
        }
        &-more-btn {
            width: 61px;
            height: 16px;
            border-radius: 8px;
            margin: 10px auto 0;
            img {
                width: 61px;
                height: 16px;
                display: block;
            }
        }
        &-remark {
            margin-top: 16px;
            background: #FAFAFA;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
        }
        &-remark__desc, &-remark__detail {
            font-size: 13px;
            font-weight: 400;
            color: #444444;
            line-height: 17px;
        }
        &-remark__desc {
            flex-shrink: 0;
        }
        &-remark__detail {
            width: 217px;
            text-align: right;
            word-wrap:break-word;
            word-break:break-all;
        }
        &-service {
            width: 100%;
            border-top: 1px solid #EEEEEE;
            margin-top: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 0 6px;

            line-height: 17px;
            font-size: 13px;
            font-weight: 500;
            color: #444444;
        }
        &-service__img {
            width: 20px;
            height: 20px;
            margin-right: 4px;
        }
        .fqz-price{
            color: #191919;
            font-size: 11px;
            font-family: DINAlternate, DINAlternate;
            font-weight: 600;
            line-height: 17px;
            .special{
              font-size: 16px;
              font-weight: bold;
              line-height: 20px;
            }
        }
    }
</style>
