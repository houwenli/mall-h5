<template>
    <div class="copun-item">
        <div class="copun-item-wrapper" v-if="true ||spu.haveCoupon" @click="showCouponList">
            <span class="label">优惠劵</span>
            <div class="value">
                <span class="use-copun" v-if='copyChooseCoupon.couponDiscount>0'>-¥{{ copyChooseCoupon.couponDiscount }}</span>
                <span v-else-if='couponList.length'>不使用优惠券</span>
                <span v-else-if='!couponList.length'>暂无优惠劵可用</span>
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
            </div>
        </div>

        <van-popup get-container="body" v-model="couponListVisible" closeable close-icon="close" round position="bottom" :style="{ height: '21.28rem', padding: '0.64rem 0.72rem' }">
            <div class="copun-box">
                <div style="text-align: center; font-size: 0.64rem; color: #000; font-weight: 600">优惠</div>

                <div class="copun-list-wrapper">
                    <div class="copun-detail-box">
                        <div class="real-price">
                            <p>¥{{ chooseCoupon && chooseCoupon.id ?chooseCoupon.afterCouponPrice.toFixed(2) : (spu && spu.price.toFixed(2)) }}</p>
                            <p>预估到手</p>
                        </div>
                        <div class="choose-detail">
                            <p class="choose-title">当前购买可使用以下优惠</p>
                            <p v-if="chooseCoupon && chooseCoupon.id" class="reduce-detail">
                                <span v-if="chooseCoupon.couponsType == 1 || chooseCoupon.couponsType == 3">¥{{chooseCoupon.beforeCouponPrice.toFixed(2)}} - ¥{{ chooseCoupon.faceValue }}</span>
                                <span v-if="chooseCoupon.couponsType == 2">¥{{chooseCoupon.beforeCouponPrice.toFixed(2)}} * {{ chooseCoupon.faceValue }}折</span>
                            </p>
                            <div v-if="chooseCoupon && chooseCoupon.id" class="choose-detail-wrapper">
                                <div>
                                    <p>¥{{chooseCoupon.beforeCouponPrice.toFixed(2)}}</p>
                                    <p>当前售价</p>
                                </div>
                                <div>
                                    <p v-if="chooseCoupon.couponsType == 1">满{{chooseCoupon.amountLimitation}}减{{chooseCoupon.faceValue}}</p>
                                    <p v-if="chooseCoupon.couponsType == 2">{{chooseCoupon.faceValue}}折</p>
                                    <p v-if="chooseCoupon.couponsType == 3">满{{chooseCoupon.faceValue}}减{{chooseCoupon.faceValue}}</p>
                                    <p>商品券</p>
                                </div>
                            </div>
                            <p class="no-use-tip" v-else>不使用优惠券</p>
                        </div>

                    </div>

                    <p class="copun-title" v-if="couponList && couponList.length">可用</p>
                    <div v-for="(item, index) in couponList" :key="item.id" class="copun-use-item" @click="chooseCopun(item, index)">
                        <div class="left">
                            <div class="cost-money" v-if="item.couponsType == 1 || item.couponsType == 3">
                                <span class="coin">￥</span>
                                <span class="price" :class="{'bigPrice':item.faceValue>999}">{{item.faceValue}}</span>
                            </div>
                            <div class="cost-money" v-if="item.couponsType == 2">
                                <span class="price">{{item.faceValue}}</span>
                                <span class="coin">折</span>
                            </div>
                            <div class="use-condition">
                                <p class="condition-price" v-if="item.couponsType == 1">满{{item.amountLimitation}}可用</p>
                                <p class="condition-price" v-if="item.couponsType == 2 ">无门槛</p>
                                <p class="condition-price" v-if="item.couponsType == 3">满{{ item.faceValue }}元可用</p>
                                <p class="condition-time">{{ item.effectiveStartTime | filterTime }}-{{ item.effectiveEndTime | filterTime }}</p>
                            </div>
                        </div>
                        <div class="right">
                            <img v-if="item.checked" src="@/assets/img/copun-selected.png" alt="">
                            <img v-else src="@/assets/img/copun-choose.png" alt="">
                        </div>
                        <span class="top-icon">商品券</span>
                    </div>
                    <p class="copun-title" v-if="disCouponList && disCouponList.length">当前不可用</p>
                    <div v-for="(item) in disCouponList" :key="item.id" class="copun-use-item no-use">
                        <div class="left">
                            <div class="cost-money" v-if="item.couponsType == 1 || item.couponsType == 3">
                                <span class="coin">￥</span>
                                <span class="price" :class="{'bigPrice':item.faceValue>999}">{{item.faceValue}}</span>
                            </div>
                            <div class="cost-money" v-if="item.couponsType == 2">
                                <span class="price">{{item.faceValue}}</span>
                                <span class="coin">折</span>
                            </div>
                            <div class="use-condition">
                                <p class="condition-price" v-if="item.couponsType == 1">满{{item.amountLimitation}}可用</p>
                                <p class="condition-price" v-if="item.couponsType == 2 ">无门槛</p>
                                <p class="condition-price" v-if="item.couponsType == 3">满{{ item.faceValue }}元可用</p>
                                <p class="condition-time">{{ item.effectiveStartTime | filterTime }}-{{ item.effectiveEndTime | filterTime }}</p>
                                <!-- <p class="dis-reson">结算商品中没有该商品或结算金额不符合条件</p> -->
                            </div>
                        </div>

                        <div class="right">
                            <img src="@/assets/img/copun-choose.png" alt="">
                        </div>
                        <span class="top-icon">商品券</span>
                    </div>
                </div>
                <div class="handle-sure-btn" @click="sureCopun">确认</div>
            </div>

        </van-popup>
    </div>
</template>

<script>
import { deepClone } from '@/utils/utils'
import { getUserSpuCoupons } from '@/api/mycoupon'
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        },
    },
    inject:[
      'setAfterPrice'
    ],
    filters:{
        filterTime(val) {
            return val.split(` `)[0].replace(/-/g,".")
        },
    },
    data() {
        return {
            couponListVisible: false,
            couponList: [], //优惠券列表
            disCouponList: [], // 不可用优惠券列表
            chooseCoupon: {},
            copyChooseCoupon: {},
        }
    },
    watch: {
        "spu.price": {
            handler(val) {
              if(!this.$route.query.storeId) {
                this.getCopunList()
              }
            },
            immediate: true,
            deep: true
        },
    },
    methods: {
        showCouponList() {
            this.chooseCoupon = deepClone(this.copyChooseCoupon)
            this.couponList.forEach(ele => {
                ele.checked = this.chooseCoupon && this.chooseCoupon.id && ele.id == this.chooseCoupon.id
            })
            this.couponListVisible = true
        },
        sureCopun() {
            this.copyChooseCoupon = deepClone(this.chooseCoupon)
            this.couponListVisible = false
            this.setAfterPrice(this.copyChooseCoupon.afterCouponPrice)
            this.$emit('setData',this.copyChooseCoupon,'chooseCoupon')
        },
        chooseCopun(item, index) {
            this.couponList.forEach((ele, i) => {
                if (index == i) {
                    if (!item.checked) {
                        this.chooseCoupon = item
                    } else {
                        this.chooseCoupon = {}
                    }
                    item.checked = !item.checked
                } else {
                    ele.checked = false
                }
            })

        },
        getCopunList() {
            const spuParam = [
                {
                    spuId: this.spu.spuId,
                    skuId: this.spu.id,
                    num: 1,
                    beforeCouponPrice: this.spu.price
                }
            ]
            getUserSpuCoupons(spuParam).then((res) => {
                this.couponList = res.data.filter(item => item.usable)
                this.disCouponList = res.data.filter(item => !item.usable)
                this.couponList.forEach(item => {
                    if (item.checked) {
                        this.chooseCoupon = deepClone(item)
                        console.log(this.chooseCoupon,55555555555555)
                        this.copyChooseCoupon = deepClone(item)
                        this.$emit('setData',this.copyChooseCoupon,'chooseCoupon')
                    }
                })
            }).catch(err => {
                console.log(err)
            })
        },
    }
}
</script>

<style lang="less" scoped>
.copun-item {
  margin-bottom: 18px;
  
}
.copun-item-wrapper {
    display: flex;
    justify-content: space-between;
    .label {
      font-size: 13px;
      color: #191919;
      line-height: 17px;
      font-weight: bold;
    }
    .value {
      color: #6e6e6e;
      font-size: 13px;
      display: flex;
      align-items: center;
      .use-copun {
        color: #e60113;
      }
      > img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .copun-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .copun-list-wrapper {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 12px;
      .copun-detail-box {
        text-align: center;
        .real-price {
          display: inline-block;
          background: #ffe4e7;
          border: 1px solid #ffb1b8;
          border-radius: 4px;
          padding: 10px 16px;
          color: #e60113;
          font-size: 12px;
          margin-top: 24px;
          min-width: 100px;
          > p:first-child {
            font-size: 18px;
            font-weight: bold;
          }
        }
        .choose-detail {
          border: 1px solid #e60113;
          margin-top: 12px;
          border-radius: 14px;
          padding: 24px 52px 32px;
          height: 212px;
          .choose-title {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            margin-bottom: 16px;
          }
          .reduce-detail {
            font-size: 18px;
            color: #e60113;
            font-weight: bold;
            margin-bottom: 16px;
          }
          .choose-detail-wrapper {
            display: flex;
            justify-content: space-between;
            > div {
              background: #ffe4e7;
              border: 1px solid #ffb1b8;
              border-radius: 4px;
              padding: 10px 6px;
              color: #e60113;
              font-size: 12px;
              min-width: 100px;
              margin-right: 12px;
              > p:first-child {
                font-size: 16px;
                font-weight: bold;
              }
            }
          }
          .no-use-tip {
            margin-top: 60px;
            color: #999;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
  .handle-sure-btn {
    font-size: 14px;
    color: #fff;
    background: #e60113;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
  }
  .copun-title {
    font-size: 16px;
    color: #000;
    padding-left: 8px;
  }
  .copun-use-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fef4f4;
    margin-top: 12px;
    padding: 30px 18px;
    border-radius: 10px;
    position: relative;
    &.no-use {
      background: #f2f2f2;
      .top-icon {
        color: #fff;
        font-size: 10px;
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 18px;
        background: url('~@/assets/img/copun-gery-icon-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
      }
      .left {
        .cost-money {
          color: #999;
        }
        .use-condition {
          .condition-price {
            color: #999;
          }
          .condition-time {
            color: #999;
          }
          .dis-reson {
            font-size: 11px;
            color: #999;
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
          }
        }
      }
    }
    .top-icon {
      color: #fff;
      font-size: 10px;
      position: absolute;
      top: 0;
      left: 0;
      width: 50px;
      height: 18px;
      background: url('~@/assets/img/copun-icon-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
    }
    .left {
      display: flex;
      align-items: center;
      .cost-money {
        color: #e60113;
        font-size: 14px;
        margin-right: 18px;
        font-weight: bold;
        .price {
          font-size: 32px;
          line-height: 38px;
          &.bigPrice {
            font-size: 22px;
          }
        }
      }
      .use-condition {
        flex: 1;
        overflow: hidden;
        .condition-price {
          font-size: 12px;
          color: #000;
          font-weight: bold;
        }
        .condition-time {
          font-size: 11px;
          color: #666;
        }
      }
    }
    .right {
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
</style>

