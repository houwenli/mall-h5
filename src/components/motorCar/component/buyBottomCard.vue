<template>
    <div>
        <div class="buy-popup-bottom">
            <div class="price-detail-box" v-if='chooseCoupon && chooseCoupon.id'>
                <div class="price-detail">
                    <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ic_youhui.png" alt="">
                    <span>小计¥</span>
                    <!-- afterCouponPrice：券后价 -->
                    <span v-if="spu && spu.afterCouponPrice">{{spu && spu.afterCouponPrice}}</span>
                    <span v-else>{{spu && spu.price}}</span>
                    <span class="copun-money" v-if="spu && spu.afterCouponPrice">，优惠劵减¥{{(spu.price - spu.afterCouponPrice).toFixed(2)}}</span>
                </div>
                <div class="copun-detail" @click="openCopunPopup" v-if="type == 'open'">
                    <span class="detail-text">明细</span>
                    <img class="open-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ic_copon_open.png" alt="">
                </div>
                <div class="copun-detail" @click="closeCopunPopup" v-else>
                    <span class="detail-text">明细</span>
                    <img class="open-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ic_flod.png" alt="">
                </div>
            </div>
            <div class="buy-btn" @click="pay">
              立即支付¥  
              <!-- afterCouponPrice：券后价 -->
              <span v-if="spu && spu.afterCouponPrice">{{spu.afterCouponPrice}}</span>
              <span v-else>{{spu && spu.price}}</span>
              </div>
        </div>
    </div>
    
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: 'open',
        },
        spu: {
            type: Object,
            default: () => { }
        },
        chooseCoupon: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {}
    },
    methods: {
        openCopunPopup() {
            this.$emit('openDetail')
        },
        closeCopunPopup() {
            this.$emit('closeDetail')
        },
        //支付
        pay(){
          this.$emit('pay',this.spu.price)
        }
    }
}
</script>

<style lang="less" scoped>
.buy-popup-bottom {
  background: #fff;
  padding: 10px 12px 4px;
  .price-detail-box {
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 10px;
    .price-detail,
    .copun-detail {
      font-size: 13px;
      font-weight: bold;
      color: #191919;
      display: flex;
      align-items: center;
      > img {
        width: 18px;
        height: 18px;
        margin-right: 4px;
        &.open-icon {
          width: 16px;
          height: 16px;
          margin-right: 0;
          margin-left: 2px;
        }
      }
      .copun-money {
        color: #ff0a35;
      }
      .detail-text {
        font-weight: normal;
        color: #ff0a35;
      }
    }
  }

  .buy-btn {
    height: 40px;
    line-height: 20px;
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    border-radius: 20px;
    font-size: 16px;
    color: #fff9e9;
    font-weight: bold;
    padding: 10px;
    text-align: center;
  }
}
</style>


