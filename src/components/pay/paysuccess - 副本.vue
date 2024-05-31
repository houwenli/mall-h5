<template>
  <div class="boxwrapper">
    <div class="headerboxwrapper">
      <header class="headerbox">
        <div class="header">
          <template v-if="status == 1 || status == 5 || status == 6 || !status">
            <img src="../../assets/img/close@2x.png" class="finishing" alt="" />
            <span class="pay_cg">支付中,钱款到账可能有延迟,请稍后查看</span>
          </template>
          <template v-else>
            <div>
              <img src="../../assets/img/complete@2x.png" class="finishing" alt="" />
              <span class="pay_cg">支付成功</span>
            </div>
          </template>
          <div class="moneyBox" v-if="status != 1 && status != 5 && status !=6 && status != null">
            ¥
            <span style="margin-left: -0.1rem">{{ money }}</span>
          </div>
          <div style="width: 100%; text-align: center">
            <span class="see_order" @click="toOrder">查看订单</span>
            <span class="see_order see_home" @click="finish">继续逛逛</span>
          </div>
        </div>
      </header>
      <div class="tips">注意：万顺福平台及销售商不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作.</div>
    </div>

    <!-- 热销商品 -->
    <div class="xq_wntj" style="margin-top: 0.4rem">
      <shopList :title="'热销商品'" :titleImg="true" :orderCode="this.$route.query.orderCode || wxzfId"></shopList>
    </div>

    <SecondConfirm title="恭喜您获得优惠券礼包" sureText="立即查看" :dialogshow="discountGiftDialog" :isNeedTouchClose="true"
      :columnButton="true" :showCloseDialogBtn="true" @rightEvent="discountGiftConfirm"
      @handleCloseDialog="discountGiftDialog = false">
      <div class="discount-gift-container" slot="textp">
        <div class="discount-gift-text">以下优惠券已发放到您的账户中</div>
        <div class="discount-gift-list">
          <div class="discount-gift-coupon" v-for="(item, index) in platformCouponCodeVoList" :key="index">
            <span class="top-round-corner"></span>
            <span class="bottom-round-corner"></span>
            <div class="stub-ticket">
              <div class="content">
                <span class="text" v-if="item.type != 2">￥</span>
                <span class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : skuPriceInt(item.price)
                }}</span>
                <span class="text" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</span>
                <span class="text" v-else>折</span>
              </div>
            </div>
            <div class="main-ticket">
              <div class="content">
                <div class="title" v-if="item.type != 0">满{{ item.fullPrice }}可用</div>
                <div class="title" v-else>无门槛</div>
                <div class="cate">
                  <template v-if="item.permittedType == 0">全平台商品可用</template>
                  <template v-else-if="item.permittedType == 1">平台部分商品可用</template>
                  <template v-else-if="item.permittedType == 2">限平台部分品类商品</template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecondConfirm>
    <van-overlay v-if="showError" :show="showError">
        <div class="overlay_wrapper" @click.stop>
            <div class="overlay_block">
                <p>支付异常提醒</p>
                <p>1.余额扣款失败，订单已取消，已付金额将予以原路退回，请您留意查收</p>
                <p>2.如还需购买，请您重新加购～</p>
                <div class="overlay_block-btn">
                  <van-button plain color="#E60113" class="overlay_block-btn_confirm" @click="toList">我知道了</van-button>
                </div>
            </div>
        </div>
    </van-overlay>
  </div>
</template>

<script>
import shopList from '@/components/commons/shopList'
import { queryOrderDetail, queryPayInfo } from '@/api/orderlist'
import SecondConfirm from '@/components/commons/SecondConfirm'
export default {
  components: {
    shopList,
    SecondConfirm,
  },
  data() {
    return {
      status: 1,
      money: '',
      discountGiftDialog: false,
      platformCouponCodeVoList: [],
      step: 0,
      showError:false
    }
  },
  computed:{
    wxzfId(){
      return localStorage.getItem('wxzf_id')
    }
  },
  created() {
    console.log(this.$route.query.orderCode, 'this.$route.query.orderCode')
    console.log(localStorage.getItem('wxzf_id'), 'localStorage.getItem("wxzf_id")')
    let localStorage_orderCode = localStorage.getItem('wxzf_id')
    console.log(localStorage_orderCode, 'localStorage_orderCode-----+++++')
    let orderCode = this.$route.query.orderCode
    // 有订单且有wxzf_id 则为其他支付方式，删除wxzf_id
    if (localStorage_orderCode && orderCode) {
      localStorage.removeItem('wxzf_id')
    }
    if (orderCode) {
      this.getPayInfo(orderCode)
    } else if (localStorage_orderCode) {
      setTimeout(() => {
        this.getPayInfo(localStorage_orderCode)
      }, 300)
      setTimeout(() => {
        console.log('30秒结束了，定时取消----')
        this.step = 1
      }, 30500)
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    async getPayInfo(orderCode) {
      console.log(orderCode, 'orderCode-----+++++')
      let res = await queryPayInfo(orderCode).catch((err) => {
        console.log(err)
        this.timer = setTimeout(() => {
          this.getPayInfo(orderCode)
          clearTimeout(this.timer)
        }, 2000)
      })
      if (res && res.code == 200) {
        console.log('-----------------支付成功返回信息-----------------')
        console.log(res, '-----------------支付成功数据-----------------')

        this.money = res.data.price.toFixed(2)
        this.status = res.data.status
        // TODO 支付异常提醒
        // 如果状态为已取消，就弹弹窗提示
        // 会议上说这个弹窗  先不展示！！！！！！！！！！！！！！！！！！！！！！！！！！！
        // 现于【电商重构(支付)＋万顺电商系统V3.2（退款功能优化）】后端 余文博 商议后放开
        if(this.status == 5 || this.status == 6) this.showError = true
        
        if (res.data.platformCouponCodeVoList && res.data.platformCouponCodeVoList.length > 0) {
          this.platformCouponCodeVoList = res.data.platformCouponCodeVoList
          this.discountGiftDialog = true
        }
        let { status } = res.data
        if ((status == 1 || !status || status == 5 || status == 6) && this.step == 0) {
          console.log('支付中状态触发------')
          this.timer = setTimeout(() => {
            this.getPayInfo(orderCode)
            clearTimeout(this.timer)
          }, 2000)
        }
      }
    },
    skuPriceInt(price) {
      let intPrice = 0,
        floatPrice = 0
      if (!price) {
        price = 0
      } else {
        price = price.toFixed(2).split('.')[0]
      }
      return price
    },
    skuPriceFloat(price) {
      let intPrice = 0,
        floatPrice = 0
      if (!price) {
        price = 0
      } else {
        price = price.toFixed(2).split('.')[1]
      }
      return price
    },
    discountGiftConfirm() {
      this.discountGiftDialog = false
      this.$router.push({ path: '/mycoupon', query: { type: 2 } })
    },
    finish() {
      this.$router.push('/')
    },
    toList() {
      this.$router.push({
        path: '/orderlist',
        query: { status: -1 },
      })
    },
    toOrder() {
      // 普通订单
      if (this.$route.query.type == '1') {
        // this.$router.push({path: '/orderlist', query: {orderId: this.$route.query.orderCode}})
        this.$router.push({
          path: '/orderlist',
          query: { status: -1 },
        })
      } else if (this.$route.query.type == '3') {
        // 门店订单
        this.$router.push({
          path: '/storeorderlist',
          query: { status: -1 },
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-overlay {
  z-index: 99;
}
.boxwrapper {
  .headerboxwrapper {
    .headerbox {
      height: 7.96rem;
      background: url('../../assets/img/bg@2x.png') no-repeat;
      background-size: 100%;
      position: relative;

      .header {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

        .finishing {
          width: 0.72rem;
          height: 0.72rem;
          vertical-align: text-bottom;
          color: #fff;
        }

        .pay_cg {
          font-size: 0.72rem;
          font-weight: bold;
          margin: 0.2rem 0 0.4rem;
        }

        .see_order {
          display: inline-block;
          border: 1px solid #fff;
          width: 4.16rem;
          height: 1.2rem;
          line-height: 1.16rem;
          text-align: center;
          border-radius: 0.64rem;
        }
      }

      .finish {
        position: absolute;
        right: 0.8rem;
        top: 0.44rem;
        font-size: 0.64rem;
        font-family: PingFangSC-Medium, PingFang SC;
      }
    }

    .tips {
      color: #999;
      font-size: 0.52rem;
      margin: 0.72rem 0.8rem;
    }
  }

  .xq_wntj {
    text-align: center;

    /deep/ .guess-warp {
      .guess-title {
        height: 0.72rem;
        line-height: 0.72rem;
        margin: 2rem 0 0.48rem;
        padding: unset;
      }
    }
  }

  .moneyBox {
    margin: 0.4rem 0 0.72rem;
    font-size: 0.8rem;
  }

  .see_home {
    background-color: #fff;
    color: #e60113;
    margin-left: 0.4rem;
  }
  .overlay_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .overlay_block {
      width: 90%;
      min-height: 25%;
      border-radius: .5rem;
      padding-top: 1rem;
      background-color: #fff;
      > p {
        padding: 0 1.6rem;
        text-align: left;
        color:#666666;
        font-size: 14px;
        margin-bottom: 8px;
      }
      >p:nth-child(1) {
        color: #333;
        font-weight: 600;
        font-size: .8rem;
        text-align: center;
        margin-bottom: 17px;
      }
      .overlay_block-btn {
        text-align: center;
        padding: .8rem 0 ;
        .overlay_block-btn_confirm {
          border-radius:16px;
          height:30px;
          width:104px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 600;
          line-height: 30px;
        }
      }
    }
  }
}

.discount-gift-container {
  .discount-gift-text {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin: 8px 0;
  }

  .discount-gift-list {
    height: 280px;
    overflow-y: auto;

    .discount-gift-coupon {
      position: relative;
      width: 100%;
      background: #fef4f4;
      border-radius: 10px;
      display: flex;
      height: 70px;
      margin-top: 8px;

      .top-round-corner {
        background-color: #fff;
        position: absolute;
        top: -8px;
        left: 105px;
        transform: translate(-50%, 0);
        height: 14px;
        width: 14px;
        border-radius: 0 0 50% 50%;
        z-index: 2;
      }

      .bottom-round-corner {
        background-color: #fff;
        position: absolute;
        bottom: -8px;
        left: 105px;
        transform: translate(-50%, 0);
        height: 14px;
        width: 14px;
        border-radius: 50% 50% 0 0;
        z-index: 2;
      }

      .stub-ticket {
        width: 105px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-right: 1px dashed #faccd0;

        .content {
          display: inline-flex;
          align-items: baseline;
          color: #e60113;
          font-weight: 600;

          .text {
            font-size: 14px;
            line-height: 20px;
          }

          .price {
            font-size: 30px;
            line-height: 38px;
          }
        }
      }

      .main-ticket {
        display: inline-flex;
        justify-content: center;
        align-items: center;

        .content {
          margin-left: 18px;

          .title {
            font-size: 14px;
            font-weight: 500;
            color: #000;
            line-height: 20px;
          }

          .cate {
            margin-top: 2px;
            color: #666;
            line-height: 16px;
            font-size: 11px;
          }
        }
      }
    }
  }
}
.van-overlay{
    z-index: 1000;
}
</style>
