<template>
    <div>
        <div :class="['action-list',isPhone?'action-list-phone' : '']">
            <div class="action-other">
                <div class="action-other-li" @click="callUp">
                    <img src="@/assets/img/goodsDetail/people.png" alt />
                    <span>客服</span>
                </div>

                <share-sheet :spu="spu"></share-sheet>
            </div>
            <a class="to-buy" @click="openBuyPopup">
                立即购买
            </a>
        </div>

        <sku-popup ref="mySkuPopup" v-if='showSku' :initialSku='initialSku' :list='list' :spu="spu" :skuId="skuId" :sku="sku" @openDetail='openDetail' :storeIndex='storeIndex'></sku-popup>
        <van-popup get-container="body" class="copun-detail-popup buy-popup" v-model="showCopunDetail" round position="bottom">
            <div class="store-popup-title">价格明细<img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="showCopunDetail=false"></div>
            <div class="buy-popup-container">
                <div class="money-intro-box">
                    <div class="money-item good-all-money">
                        <span class="label">商品总价</span>
                        <span class="value all-value">¥{{ spu.price }}</span>
                    </div>
                    <div class="money-item copun-money">
                        <span class="label">优惠劵</span>
                        <span class="value">-¥{{ $refs.mySkuPopup&& $refs.mySkuPopup.chooseCoupon && $refs.mySkuPopup.chooseCoupon.couponDiscount }}</span>
                    </div>
                    <div class="money-item real-money">
                        <span class="label">实付款</span>
                        <div class="value">
                            <span class="coin">¥</span><span class="int">{{spu.afterCouponPrice | getPriceInt}}.</span><span class="float">{{spu.afterCouponPrice | getPricePrecision}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <buy-bottom-card type='flowd' :spu="spu" :chooseCoupon="$refs.mySkuPopup&&$refs.mySkuPopup.chooseCoupon" @closeDetail='closeDetail' @pay='toPay'></buy-bottom-card>
        </van-popup>

    </div>
</template>

<script>
import { querySpu } from '@/api/spudetail'
import { getToken } from '@/utils/token'
import { isMobile, location } from '@/utils/utils'

import ShareSheet from './shareSheet.vue'
import SkuPopup from './skuPopup.vue'
import BuyBottomCard from './buyBottomCard.vue'


const { isPhone } = isMobile();
import Cookies from 'js-cookie'

export default {
    props: {
        newUiImgList: {
            type: Array,
            default: () => []
        },
        spu: {
            type: Object,
            default: () => { }
        },
        sku: {
            type: Object,
            default: () => { }
        },
        storeIndex: {
            type: Number,
            default: 0
        },
        skuId: {
          type: String,
          default: ''
        },
        list:{
            type: Array,
            default: ()=>[]
        },
        initialSku: {
          type: Object,
          default: () => { }
        }
    },
    components: {
        ShareSheet,
        SkuPopup,
        BuyBottomCard
    },
    filters:{
		getPriceInt(val){
			return Math.floor(val)
		},
		getPricePrecision(val) {
			const num = Number(val).toFixed(2)
			return num.substring(num.length-3, num.length)
		}
    },
    data() {
        return {
            isPhone,
            showCopunDetail: false,
            showSku: false
        }
    },
    methods: {
        // 联系客服
        toService() {
            let that = this
            if (getToken()) {
                let data = {
                    skuId: that.skuId,
                    storeId: this.spu.storeId,
                    sourceType: this.$route.query.sourceType || 1
                }
                querySpu(data).then((res) => {
                    let storeServiceConfig = undefined,
                        options = {},
                        data = undefined
                    data = res.data
                    storeServiceConfig = res.data.storeServiceConfig
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
                    ysf('config', {
                        ...options,
                        success: function () {
                            that.productFun(data)
                        },
                    })
                })
            } else {
                if (Cookies.get('_wsf_role') == 1) {
                    this.$store.commit('SET_REGISTRATIONPROTOCOL', true)
                    return
                } else {
                    this.$router.push('/login?url=' + location.pathname + location.search)
                }
            }
        },
        productFun(data) {
            ysf('product', {
                show: 1, //1为打开， 其他参数为隐藏（包括非零元素
                title: data.name,
                desc: data.subTitle,
                picture: data.images[0],
                note: `￥${data.price}`,
                url: `https://m.wsfmall.com/motorCar/detail?skuId=${data.id}&storeId=${this.$route.query.storeId || ''}&sourceType=${this.$route.query.sourceType || 1}`, // 跳转客户端商品详情页面
                sendByUser: 0, //自动发送卡片
                tags: [
                    {
                        label: '查看商品详情', // 按钮名字
                        url: `https://m.wsfmall.com/motorCar/detail?skuId=${data.id}&storeId=${this.$route.query.storeId || ''}&sourceType=${this.$route.query.sourceType || 1}`, // 跳转客户端商品详情页面
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
        openBuyPopup() {
            if(this.$parent.getStoreLoading) {
               return this.$toast('门店加载中，请稍后')
            }
            if(this.$parent.positionFail) {
              return this.$toast('定位失败，请开启定位后重试')
            }
            if(!this.list.length){
               return this.$toast('您当前定位所在城市暂未售卖此车型')
            }
            this.showSku = true
            this.$nextTick(()=>{
              this.$refs.mySkuPopup.showAll = true
            })
        },
        openDetail() {
            this.showCopunDetail = true
        },
        closeDetail() {
            this.showCopunDetail = false
        },
        toPay(money) {
          console.log(this.$refs.mySkuPopup.select)
          this.$refs.mySkuPopup.pay(money,this.$refs.mySkuPopup.select)
        }

    }
}
</script>

<style lang="less" scoped>
.action-list {
  display: flex;
  .action-other {
    border-top: unset;
    display: flex;

    .item {
      display: flex;
      align-items: center;
      flex-direction: column;
      border-right: unset;
      color: #666;
      font-size: 0.48rem;
      width: 130px;
      margin: 0 auto;
      img {
        width: 20px;
        height: 20px;
        margin-bottom: 0.16rem;
      }
    }

    .action-other-li {
      display: flex;
      flex-direction: column;
      font-size: 11px;
      color: #999999;
      align-items: center;
      // width: 48px;
      img {
        width: 20px;
        height: 20px;
        margin-bottom: 0 auto 2px;
      }
    }
  }
  .to-buy {
    flex: 1;
    height: 40px;
    text-align: center;
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    border-radius: 20px;
    line-height: 20px;
    color: #fff9e9;
    font-size: 16px;
    padding: 10px 0;
  }
}
.buy-popup {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
  .buy-popup-top {
    position: relative;
    padding: 16px 12px 0;
    > img {
      position: absolute;
      right: 24px;
      top: 15px;
      height: 20px;
      width: 27px;
    }
    .pre-attr-box {
      .attr {
        font-size: 13px;
        color: #999;
        margin-top: 4px;
      }
    }
  }
  .buy-popup-container {
    flex: 1;
  }
}

.copun-detail-popup {
  min-height: 60vh;
  .store-popup-title {
    text-align: center;
    color: #000d1d;
    font-size: 16px;
    line-height: 22px;
    position: relative;
    padding-top: 12px;
    padding-bottom: 12px;
    // background: #fff;
    > img {
      position: absolute;
      right: 24px;
      top: 15px;
      height: 20px;
      width: 27px;
    }
  }
  .money-intro-box {
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    margin: 0 12px;
    .money-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      &:last-child {
        margin-bottom: 0;
      }
      .label {
        color: #191919;
        font-size: 13px;
        line-height: 17px;
      }
      .value {
        color: #ff0a35;
        font-size: 13px;
        line-height: 17px;
        &.all-value {
          color: #191919;
        }
        .coin,
        .float {
          font-size: 11px;
          font-weight: bold;
        }
        .int {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>

