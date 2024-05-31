<template>
  <div class="paybox">
    <p class="share-card-wrap-title">订单金额</p>
    <div class="sku_header">
      <div class="sku_header_price">
        <span class="price-icon">￥</span>
        <span>{{ (Number($route.query.orderMoney) || 0).toFixed(2) }}</span>
      </div>
    </div>
    <div class="pay-bt">
      <p>第三方支付方式</p>
      <div v-if="aliPayUse()" class="zfbbox">
        支付宝
        <van-checkbox :value="payType === 1" @click="paway(1)">
          <template #icon="props">
            <img v-if="props.checked" src="@/assets/img/cat_Selected@2x.png" alt="" />
            <img v-else src="@/assets/img/cat_ns@2x.png" alt="" />
          </template>
        </van-checkbox>
      </div>
      <div class="wechatbox">
        微信
        <van-checkbox :value="payType === 2" @click="paway(2)">
          <template #icon="props">
            <img v-if="props.checked" src="@/assets/img/cat_Selected@2x.png" alt="" />
            <img v-else src="@/assets/img/cat_ns@2x.png" alt="" />
          </template>
        </van-checkbox>
      </div>
    </div>
    <div class="share">
      <div class="share-bt" @click="confirmPayment">确认支付</div>
    </div>
  </div>
</template>
<script>
  import { getOpenId } from './service'
  //   import { getPlatformType } from '@/utils/tool'
  import { isWx } from '@/utils/utils'
  import { agencyWechatH5Pay, alipay, agencyWechatOfficialAccountPay } from './service'
  import { Checkbox, Toast } from 'vant'
  export default {
    inject: ['reload'],
    components: {
      [Checkbox.name]: Checkbox,
    },
    data() {
      return {
        payType: 1, // 支付方式 1支付宝，2微信
        isWx: isWx(), // 判断是否是微信
        isSubmit: false,
      }
    },
    created() {
      // 获取微信code回调后删除地址code改存本地，换取openId后删除
      if (this.isWx && this.$route.query.code) {
        sessionStorage.setItem('WXCODE', this.$route.query.code)
        let zfInfo = JSON.parse(sessionStorage.getItem('ZFINFO'))
        this.$router.replace({
          path: this.$route.path,
          query: {
            orderCode: zfInfo.orderCode,
            idNumber: zfInfo.idNumber,
            orderMoney: zfInfo.orderMoney
          }
        })
      }
      // 微信公众号支付获取openId
      if (this.isWx && sessionStorage.getItem('WXCODE')) {
        this.getOpenId()
      }
      if (!this.aliPayUse()) {
        this.payType = 2
      }
    },
    methods: {
      // 选择支付方式
      paway(val) {
        this.payType = val
      },
      confirmPayment() {
        if (this.isSubmit) {
          return false
        }
        this.isSubmit = true
        switch (this.payType) {
          // 支付宝支付
          case 1:
            this.aliPay()
            break
          case 2:
            if (this.isWx) {
              let { idNumber, orderCode, orderMoney } = this.$route.query
              sessionStorage.setItem(
                'ZFINFO',
                JSON.stringify({
                  idNumber,
                  orderCode,
                  orderMoney
                })
              )
              this.getCode()
            } else {
              this.wxPay()
            }
            break
        }
      },
      // 支付宝支付
      async aliPay() {
        let reqData = {
          orderCode: this.$route.query.orderCode,
          idNumber: this.$route.query.idNumber,
          type: 1,
        }
        try {
          let res = await alipay(reqData)
          // 调起阿里支付
          if (res.code == 1) {
            let data = res.data
            switch (data.flag) {
              case 1:
                const div = document.createElement('div')
                div.innerHTML = res.data.data
                document.body.appendChild(div)
                document.forms[0].submit()
                document.body.removeChild(div);
                // TODO
                if (this.$store.getters.phoneType == 'IOS') {
                  setTimeout(() => {
                    this.toPaySuccess()
                  }, 3000)
                }
                break
              case -3:
                this.$toast('已完成支付，不可重复支付')
                break
              default:
                this.$toast('支付出错')
            }
          } else {
            // 支付错误 跳转到订单列表页面
            this.$toast('支付出错')
          }
        } catch (error) {
          this.$toast('支付出错')
          console.log(error)
        }
        this.isSubmit = false
      },
      // 获取code
      getCode() {
        sessionStorage.setItem('getOpenId', 'getOpenId')
        window.location.replace(`https://m.wsfmall.com/static/html/jump.html?backUrl=${window.location.origin}${window.location.pathname}`)
      },
      async getOpenId() {
        let params = {
          code: sessionStorage.getItem('WXCODE'),
        }
        sessionStorage.removeItem('WXCODE')
        try {
          let res = await getOpenId(params)
          if (res.code === 1) {
            let data = res.data
            this.wechatofficialPay(data.openid.replace(/\"/g, ''))
          }
        } catch (error) {
          window.console.log(error)
        }
        // let query = {
        //   ...this.$route.query,
        //   isWx: true,
        // }
        // delete query.code
        // this.$router.replace({
        //   path: this.$route.path,
        //   query,
        // })
      },
      // 判断是否可以使用支付宝
      aliPayUse() {
        let ua = navigator.userAgent.toLowerCase()
        return (
          !this.isWx &&
          navigator.userAgent
            .toLowerCase()
            .toString()
            .indexOf('qqbrowser') < 0 &&
          ua.match(/QQ/i) != 'qq'
        )
      },
      // 微信支付
      async wxPay() {
        try {
          let reqData = {
            orderCode: this.$route.query.orderCode,
            type: 1,
            idNumber: this.$route.query.idNumber,
          }
          let res = await agencyWechatH5Pay(reqData)
          if (res.code === 1) {
            let data = res.data
            switch (data.flag) {
              case 1:
                let form = ''
                form += '<form id="wechatpay_form" action="' + data.data.mwebUrl + '"  method="post" >'
                form += '</form>'
                document.body.innerHTML = form
                document.forms[0].submit()
                break
              case -1:
                Toast('用户不存在')
                break
              case -3:
                Toast('没有待支付的订单')
                break
              case -5:
                Toast('微信生成订单出错')
                break
              case -7:
                Toast('没有设置网站地址')
                break
              case -8:
                Toast('微信缺少配置')
                break
              case -9:
                Toast('没有启用')
                break
              default:
                Toast('未知错误')
                break
            }
          }
        } catch (error) {
          console.log(error)
        }
        this.isSubmit = false
      },
      // 公众号支付
      async wechatofficialPay(openId) {
        try {
          let { idNumber, orderCode } = JSON.parse(sessionStorage.getItem('ZFINFO'))
          let params = {
            type: 1,
            idNumber,
            orderCode,
            openId,
          }
          let res = await agencyWechatOfficialAccountPay(params)
          if (res.code === 1) {
            let data = res.data
            switch (data.flag) {
              case 1:
                this.callPay(data.data)
                break
              case -1:
                Toast('用户不存在')
                break
              case -3:
                Toast('没有待支付的订单')
                break
              case -5:
                Toast('微信生成订单出错')
                break
              case -7:
                Toast('没有设置网站地址')
                break
              case -8:
                Toast('微信缺少配置')
                break
              case -9:
                Toast('没有启用')
                break
              case -10:
                Toast('没有绑定微信')
                break
              default:
                Toast('未知错误')
                break
            }
          }
        } catch (error) {
          window.console.log(error)
        }
      },
      /**
       * 调起支付
       */
      callPay(params) {
        let that = this
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId: params.appid, //公众号名称，由商户传入
            timeStamp: params.time_stamp, //时间戳，自1970年以来的秒数
            nonceStr: params.nonce_str, //随机串
            package: params.package_,
            signType: params.sign_type, //微信签名方式：
            paySign: params.pay_sign, //微信签名
          },
          function(res) {
            // // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            // if (res.err_msg == 'get_brand_wcpay_request:ok') {
            //     that.toPaySuccess();
            // }

            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              Toast('支付成功')
              setTimeout(() => {
                that.$router.push({
                  path: '/qrCodePaySuccess',
                  query: {
                    orderCode: that.$route.query.orderCode,
                    payType: 1
                  },
                })
              }, 300)
              return
            }
            if (res.err_msg == 'get_brand_wcpay_request:cancel') {
              Toast('取消支付')
            }
            if (res.err_msg == 'get_brand_wcpay_request:fail') {
              Toast('支付失败')
            }
          }
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  .paybox {
    .zfbbox,
    .wechatbox {
      margin-top: 25px;
      padding-left: 36px;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;

      /deep/ .van-checkbox__icon {
        img {
          width: 18px;
          height: 18px;
        }
      }
    }

    .zfbbox {
      background: url('~@/assets/img/alipay.png') no-repeat left center;
      background-size: 30px;
    }

    .wechatbox {
      background: url('~@/assets/img/weipay.png') no-repeat left center;
      background-size: 30px;
    }

    .pay-bt {
      background-color: #fff;
      border-radius: 10px;
      padding: 16px;
    }

    .sku_header {
      padding-bottom: 32px;
      border-radius: 0 0 10px 10px;
    }
  }

  .share {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    background-color: #fff;

    .share-bt {
      width: 343px;
      height: 38px;
      line-height: 38px;
      font-weight: 600;
      color: #fff;
      background: #e60113;
      border-radius: 19px;
      text-align: center;
    }
  }

  .share-card-wrap-title {
    padding-top: 32px;
    background-color: #fff;
    text-align: center;
  }

  .sku_header {
    margin-bottom: 12px;
    text-align: center;
    background-color: #fff;

    .sku_header_price {
      font-size: 30px;
      line-height: 42px;
      height: 42px;
      color: #e60113;

      span {
        font-weight: 600;
      }

      .price-icon {
        font-size: 18px;
      }
    }
  }
</style>
