<template>
  <div class="boxwrapper">
    <div class="payres-wraper">
      <!-- 支付结果 -->
      <div class="payres">
        <top-header v-if="payResult.orderType*1 !== 14" class="nav-top" :title="'支付结果'" @clickBack="backLastPage"></top-header>
        <!-- 提示语 -->
        <div class="payres-box">
        <div class="notice-box">
          <div
            class="notice-img"
          >
            <van-notice-bar
              color="#444"
              background="#F6F6F6"
              left-icon="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_message.png"
              scrollable
              speed="80"
            >
              注意：万顺福平台不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，如有收到此类短信，请您忽略或联系平台处理！
            </van-notice-bar>
          </div>
        </div>

        <!-- 内容 -->
        <div class="payres-content" v-if="!isPayLoading">
          <div class="payres-content__img" v-if="orderType == 'PAID'"></div>
          <div class="payres-content__img_fail" v-else></div>
          <div class="payres-content__money"  v-if="orderType == 'PAID'">
            <div class="payres-content__desc">支付成功</div>
            <div class="pay-money">¥{{ money }}</div>
          </div>
          <div class="payres-content__desc" v-if="orderType == 'FAILED' || orderType == 'PAYING'">支付失败</div>
          <div class="payres-content__btn-wraper" :style="[btnWraperStyle]">
            <!-- 100: '电商业务', 200: '充值业务', 300: '换电业务', 400: '票务业务', 500: '酒店业务'  -->
            <div class="payres-content__btn" @click.stop="toOrder" v-if="orderType == 'PAID' && (businessType == 200 || businessType == 100)">查看订单</div>
            <div v-if="businessType==100">
              <div class="payres-content__btn special" @click.stop="finish" v-if="orderType == 'PAID'">继续逛逛</div>
              <div class="payres-content__btn special" @click.stop="goToPay" v-if="orderType == 'FAILED' || orderType == 'PAYING'">继续支付</div>
            </div>
            <div v-else-if="businessType==200">
              <div class="payres-content__btn special" @click.stop="goNextOne">再来一笔</div>
            </div>
          </div>
        </div>
        <div v-else class="payres-content" >
          订单支付中...
        </div>
    </div>
    </div>
</div>

    <!-- 热销商品 -->
     <!-- 集采不要热销商品 -->
     <div class="xq_wntj" v-if="payResult.orderType*1 !== 14">
      <shopList :title="'热销商品'" :titleImg="true" :orderCode="this.$route.query.orderCode || orderCode || wxzfId"></shopList>
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
import SecondConfirm from '@/components/commons/SecondConfirm'
import { NoticeBar, Toast } from 'vant'
import { regFenToYuan, getUsersource } from '@/utils/utils'
import topHeader from '@/components/order/components/topHeader'
import { smartOpenDeepLink } from '@/utils/hybrid'
import { orderPayCheck } from '@/api/orderlist'
export default {
  components: {
    shopList,
    SecondConfirm,
    [NoticeBar.name]: NoticeBar,
    topHeader
  },
  data() {
    return {
      status: 1,
      money: '',
      discountGiftDialog: false,
      platformCouponCodeVoList: [],
      step: 0,
      showError:false,
      orderType: '', // 订单状态 PENDING-待支付 ,PAYING-支付中,PAID-已支付,CANCELED-已取消,FAILED-支付失败,TIMEOUT_CANCELED-超时已取消
      isPaySuccess: true,
      businessType: '',// 业务类型
      payResult: {}, // 支付结果页
      orderCode: '',
      timer: null,
      iosZhiPayResult: {},
      isPayLoading: false
    }
  },
  computed:{
    wxzfId(){
      return localStorage.getItem('wxzf_id')
    },
    btnWraperStyle() {
      return {
        marginTop: (this.isPaySuccess ? `15px` : `24px`)
      }
    }
  },
  created() {
    if(this.$route.query.payResult){
      if(this.$route.query.agentType == 'HTML') {
        this.payResult = JSON.parse(this.$route.query.payResult)
      } else {
        this.payResult = this.$route.query.payResult
      }
      if (sessionStorage.getItem('wxzf_payResult')){
        this.payResult = JSON.parse(sessionStorage.getItem('wxzf_payResult'))
      }
      this.money = regFenToYuan(this.payResult.paidMoney)
      this.orderType = this.payResult.payStatus;
      this.businessType = this.payResult.businessType || ''// 业务类型
      this.orderCode = this.payResult.orderCode
    } else {
      this.isPayLoading = true
      this.iosZhiPayResult = JSON.parse(this.$route.query.iosZhiPayResult)
      this.businessType = this.iosZhiPayResult.businessType || ''// 业务类型
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.loadOrderDetail()
        }, 3000)
      }

    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('wxzf_payResult')
    window.clearInterval(this.timer)
    this.timer =  null
  },
  methods: {
    backLastPage(){
      // this.$router.back()
      if(getUsersource() == 11) {
        smartOpenDeepLink('wsf://app/pagehome?tab=home')
      } else {
        this.$router.push('/')
      }
    },
    // 充值订单再来一笔
    goNextOne(){
      sessionStorage.setItem('wxzf_payResult', JSON.stringify(this.payResult))
      this.$router.push('phoneCharge')
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
    goToPay(){
      // 支付场景 101电商订单；201充值订单
      let paySceneType = ''
      paySceneType = this.businessType == 100 ? 101 : 201
      let appData = JSON.parse(localStorage.getItem('appData'))
      if(appData && appData.appScheme == 'wsf') {
        this.commonPay(this.money, this.orderCode, appData)
      } else {
        sessionStorage.setItem('wxzf_payResult', JSON.stringify(this.payResult))
        this.$router.push({
          path: '/zhPay',
          query: { orderMoney: this.money*100, orderCode: this.orderCode, businessType: this.businessType, paySceneType: paySceneType },
        })
      }
    },
    async loadOrderDetail() {
      let res = await orderPayCheck(this.iosZhiPayResult).catch((err) => {
      })
      console.log(res,'成功支付======================');
      if (res && res.code == 200) {
        this.money = res.data.paidMoney ? res.data.paidMoney.toFixed(2) : '';
        this.orderType = res.data ? res.data.payStatus ? res.data.payStatus : '': '';
        if(orderType == 'PAID' || orderType == 'FAILED') {
          this.timer = null;
          this.isPayLoading = false
        } else {
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
      sessionStorage.setItem('wxzf_payResult', JSON.stringify(this.payResult))
        if(this.payResult.orderType*1 === 14){
            // 集采订单返回集采首页
            const reg = /https:\/\/m([-0-9a-zA-Z*]*).wsfmall.com/i
            let result = window.location.origin.match(reg)
            console.log(result,'result')
            window.location.replace(`https://wssvc${result[1]}.wsecar.com/ecommerceCollection/index`)
            // window.location.replace(`http://10.208.2.63:8080/ecommerceCollection/index`)
            return
        }
      if(getUsersource() == 11) {
        smartOpenDeepLink('wsf://app/pagehome?tab=home')
      } else {
        this.$router.push('/')
      }
    },
    toList() {
      sessionStorage.setItem('wxzf_payResult', JSON.stringify(this.payResult))
      this.$router.push({
        path: '/orderlist',
        query: { status: -1 },
      })
    },
    toOrder() {
      sessionStorage.setItem('wxzf_payResult', JSON.stringify(this.payResult))
      // 普通订单
      if (this.$route.query.type == '3') {
        // 门店订单
        if(getUsersource() == 11) {
					smartOpenDeepLink('wsf://app/orderList')
          if (this.$store.getters.phoneType == 'IOS') {
          } else {
            window.ws.finishActivity()
          }
				} else {
          this.$router.push({
            path: '/storeorderlist',
            query: { status: -1 },
          })
        }
      } else {
        // this.$router.push({path: '/orderlist', query: {orderId: this.$route.query.orderCode}})
        if(this.payResult.orderType*1 === 14){
            const reg = /https:\/\/m([-0-9a-zA-Z*]*).wsfmall.com/i
            let result = window.location.origin.match(reg)
            window.location.replace(`https://wssvc${result[1]}.wsecar.com/ecommerceCollection/order`)
            // window.location.replace(`http://10.208.2.69:8080/ecommerceCollection/order`)
            return
        }
        if(getUsersource() == 11) {
          smartOpenDeepLink('wsf://app/orderList')
          if (this.$store.getters.phoneType == 'IOS') {
          } else {
            window.ws.finishActivity()
          }
          return
				}
        // 其他app，跳转壳子
        if(getUsersource() != 4) {
          window.location.href = `${process.env.SMART_PAGE_DOMAIN}/myOrder?status=0`
          return
        }
        this.$router.push({
          path: '/orderlist',
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
    height: 100%;
    background: #F6F6F6;
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
    margin-top: -26px;
    border-radius: 12px;
    padding: 6px 12px;
    background: #F6F6F6;
    /deep/ .guess-warp {
      .guess-title {
        height: 0.72rem;
        line-height: 0.72rem;
        margin: 14px 0 10px;
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
.payres-wraper {
  .notice-box {
    width: 343px;
    margin: 0 auto;
    position: relative;
    padding: 8px 0px 8px 0px;
  }
  .payres-box{
     height: 324px;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/2023-09-25/pay_results.png);
    background-size: 100% 100%;
  }
  .notice-img {
    width: 100%;
  }
  .payres-content {
    width: 343px;
    height: 219px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
  }
  .payres-content__img {
    width: 80px;
    height: 80px;
    background: #F1F1F1;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/cart.gif);
    background-size: 100% 100%;
  }
  .payres-content__img_fail{
    width: 80px;
    height: 80px;
    background: #F1F1F1;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_fail.png);
    background-size: 100% 100%;
  }
  .payres-content__desc {
    font-size: 18px;
    font-weight: 600;
    color: #191919;
    line-height: 22px;
    margin-top: 4px;
  }
  .pay-money{
    margin-top: 6px;
  }
  .payres-content__money {
    font-size: 16px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #C3C3C3;
    line-height: 20px;
    margin-top: 6px;
    text-align: center;
  }
  .payres-content__btn-wraper {
    display: flex;
    align-items: center;
  }
  .payres-content__btn {
    width: 130px;
    height: 40px;
    background: #F6F6F6;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #6E6E6E;
    line-height: 40px;
    text-align: center;
    margin: 0 6px;
  }
  .payres-content__btn.special {
    background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    color: #FFFFFF;
  }

}
/deep/ .van-notice-bar{
  border-radius: 12px;
  height: 30px;
  padding: 5px 8px;
}
/deep/.van-notice-bar__left-icon, /deep/.van-notice-bar__right-icon{
  font-size: 24px;
  margin-right: 4px;
}
/deep/.top-header{
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/2023-09-25/pay_header.png) !important;
    background-size: 100% 100% !important;
  .search-left{
    border: none !important;
    background: transparent !important;
  }
  .title-wrapper{
    color: #191919;
  }
}
</style>
