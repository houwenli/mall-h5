<template>
  <div class="content">
    <headTab :tab-list="tabList" @resetSearchParams="resetSearchParams"></headTab>
    <div v-show="payment === 1" ref="shareCard" class="share-card-wrap">
      <p class="share-card-wrap-title">订单金额</p>
      <div class="sku_header">
        <div class="sku_header_price">
          <span class="price-icon">￥</span>
          <span>{{ (Number($route.query.orderMoney) || 0).toFixed(2) }}</span>
        </div>
      </div>
      <div class="qrcode-wrap">
        <img :src="qrCodeImgUrl" class="qrcode-img" />
        <div class="qrcode-wrap-c">
          <div>
            <p class="qrcode-wrap-tip">1、保存图片至相册；</p>
            <p class="qrcode-wrap-tip">2、打开微信/支付宝扫一扫。</p>
          </div>
          <img src="@/assets/img/wsf_mall_logo.png" class="wechart-img" alt="" />
        </div>
      </div>
      <div class="share">
        <div class="share-bt" @click="showShare = true">分享给好友</div>
      </div>
    </div>

    <div v-show="payment === 2" class="paybox">
      <p class="share-card-wrap-title">订单金额</p>
      <div class="sku_header">
        <div class="sku_header_price">
          <span class="price-icon">￥</span>
          <span>{{ (Number($route.query.orderMoney) || 0).toFixed(2) }}</span>
        </div>
      </div>
      <div class="pay-bt">
        <p>第三方支付方式</p>
        <div class="zfbbox">
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
      <div v-if="$route.query.orderType == 11" class="offline-payment" @click="toPayment">
        支付失败，选择线下打款
        <van-icon name="arrow" color="#49a0fb" />
      </div>
      <div class="share">
        <div class="share-bt" @click="confirmPayment">确认支付</div>
      </div>
    </div>
    <van-share-sheet v-model="showShare" title="分享至" :options="options" @select="onSelect" @cancel="onCancel" />
    <share ref="shareP" @getCode="getCode" @onClose="onCancel">
      <template #title>
        <div>
          <p class="share-card-wrap-title">订单金额</p>
          <div class="sku_header">
            <div class="sku_header_price">
              <span class="price-icon">￥</span>
              <span>{{ (Number($route.query.orderMoney) || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </template>
    </share>
  </div>
</template>
<script>
  import { ShareSheet, Checkbox } from 'vant'
  import headTab from './components/headTab'
  import share from './components/share'
  import { alipay, agencyWechatH5Pay } from './service'
  export default {
    components: {
      [ShareSheet.name]: ShareSheet,
      [Checkbox.name]: Checkbox,
      headTab,
      share,
    },
    data() {
      return {
        tabList: [
          {
            sort: 1,
            name: '扫码支付',
            hasSort: false,
          },
          {
            sort: 2,
            name: '自己支付',
            hasSort: false,
          },
        ],
        payment: 1,
        shareImgUrl: '',
        postSpuName: '',
        showQrcode: '',
        qrCodeImgUrl: '',
        payType: 1,
        showShare: false,
        shareType: 1,
        isSubmit: false,
      }
    },
    computed: {
      options() {
        if (this.shareType == 1) {
          return [
            { name: '微信', icon: 'wechat', type: 1 },
            { name: '分享海报', icon: require('@/assets/img/pt@2x.png'), type: 2 },
          ]
        } else {
          return [
            {
              name: '保存图片',
              icon: require('@/assets/img/icon-save.png'),
              type: 3,
            },
            { name: '微信好友', icon: require('@/assets/img/WeChat@2x.png'), type: 4 },
            // { name: 'QQ好友', icon: require('@/assets/img/QQ@2x.png'), type: 5 },
          ]
        }
      },
    },
    mounted() {
      let { orderCode, orderMoney, idNumber, orderType } = this.$route.query
      this.$refs.shareP.payCode(`/qrCodePay?orderCode=${orderCode}&orderMoney=${orderMoney}&idNumber=${idNumber}`)
      localStorage.setItem('storePayOrderType', orderType)
    },
    methods: {
      resetSearchParams(val) {
        this.payment = val
      },

      // 选择支付方式
      paway(val) {
        this.payType = val
      },
      // 分享
      async onSelect(option) {
        switch (option.type) {
          case 1:
          case 4:
          case 5:
            let { orderCode, orderMoney, idNumber } = this.$route.query
            const reg = /https:\/\/m([-0-9a-zA-Z*]*).wsfmall.com/i
            const result = window.location.origin.match(reg)[1]
            let shareData = {
              sharePlatformList: [
                {
                  title: '万顺云办公',
                  //   userName: 'gh_9f935e6e53bc',
                  // appId: 'wx2c4dc6427b1b83ff',
                  //   miniprogramType: +isTest, //小程序 —— 0=正式版，1=测试版，2=体验版
                  path: `https://m${result}.wsfmall.com/qrCodePay?orderCode=${orderCode}&orderMoney=${orderMoney}&idNumber=${idNumber}`,
                  imgUrl: 'https://wsjc-web.wsecar.com/carMobile/images/im/stations-share.jpg',
                  url: `https://m${result}.wsfmall.com/qrCodePay?orderCode=${orderCode}&orderMoney=${orderMoney}&idNumber=${idNumber}`,
                  description: '邀请您关注实体店',
                  platformTag: 3, // 1 = QQ好友，2= QQ空间,3= 微信好友，4= 微信朋友圈，5= 保存图片
                  shareType: 1, //分享类型（1=分享H5，2=小程序，3=分享图片
                },
              ],
            }
            if (option.type === 4 || option.type === 5) {
              shareData.sharePlatformList[0].shareType = 3
              if (!this.$refs.shareP.shareImgUrl) {
                await this.$refs.shareP.createImg()
              }
              shareData.sharePlatformList[0]['imgBase64'] = this.$refs.shareP.shareImgUrl
            }
            if (option.type === 5) {
              shareData.sharePlatformList[0].platformTag = 1
            }
            if (this.$store.getters.phoneType == 'Android') {
              window.ws.wsShare(JSON.stringify(shareData))
            } else if (this.$store.getters.phoneType == 'IOS') {
              window.webkit.messageHandlers.wsShare.postMessage(JSON.stringify(shareData))
            }
            break
          case 2:
            this.shareType = 2
            this.$refs.shareP.openShow()
            break
          case 3:
            this.$refs.shareP.saveImge()
            break
        }
      },
      onCancel() {
        if (this.shareType === 1) {
          this.showShare = false
        } else {
          this.shareType = 1
          this.showShare = false
          this.$refs.shareP.closeShow()
        }
      },
      getCode(url) {
        this.qrCodeImgUrl = url
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
            this.wxPay()
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
                document.body.removeChild(div)
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
          console.log(error)
          this.$toast('支付出错')
        }

        this.isSubmit = false
      },
      // 微信支付
      async wxPay() {
        let reqData = {
          orderCode: this.$route.query.orderCode,
          type: 1,
          idNumber: this.$route.query.idNumber,
        }
        try {
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
                console.log(form, 'form____________________')
                break
              case -1:
                this.$toast('用户不存在')
                break
              case -3:
                this.$toast('没有待支付的订单')
                break
              case -5:
                this.$toast('微信生成订单出错')
                break
              case -7:
                this.$toast('没有设置网站地址')
                break
              case -8:
                this.$toast('微信缺少配置')
                break
              case -9:
                this.$toast('没有启用')
                break
              default:
                this.$toast('未知错误')
                break
            }
          }
        } catch (error) {
          console.log(error)
        }
        this.isSubmit = false
      },
      toPaySuccess() {
        let { orderCode, orderMoney, idNumber } = this.$route.query
        this.$router.push({
          path: '/qrCodePaySuccess',
          query: {
            orderCode,
            payType: 2,
          },
        })
      },

      // 线下打款
      toPayment() {
        const reg = /https:\/\/m([-0-9a-zA-Z*]*).wsfmall.com/i
        const result = window.location.origin.match(reg)[1]
        window.location.href = `https://wssvc${result}.wsecar.com/ecommerce/registerPay?orderCode=${this.$route.query.orderCode}`
      },
    },
  }
</script>
<style lang="less" scoped>
  .content {
    font-size: 14px;
    line-height: 20px;
    color: #666;

    .wholesale-tabs {
      /deep/ .tab {
        position: relative;
        flex: 1;
        margin-right: 0;

        &:first-child::after {
          position: absolute;
          top: -20px;
          right: 0;
          content: '';
          display: block;
          width: 1px;
          height: 60px;
          transform: scale(0.5);
          background-color: #d8d8d8;
        }
      }
    }
  }

  .share-card-wrap-title {
    padding-top: 32px;
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
        margin-right: -10px;
      }
    }
  }

  .share-card-wrap {
    padding: 0 0 40px 0;
    border-radius: 0px 0px 10px 10px;
    background-color: #fff;
  }

  .qrcode-wrap {
    width: 217px;
    margin: 0 auto;

    .qrcode-img {
      display: block;
      width: 217px;
      height: 217px;
    }

    .qrcode-wrap-c {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;

      .qrcode-wrap-tip {
        width: 145px;
      }

      .wechart-img {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
      }
    }
  }

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

  .van-share-sheet {
    z-index: 8888 !important;
    /deep/ .van-share-sheet__title {
      color: #666;
    }

    /deep/ .van-share-sheet__cancel {
      color: #000;
      font-weight: 600;

      &::before {
        position: absolute;
        left: -50%;
        width: 200%;
        height: 1px;
        scale: 0.5;
        background-color: #f2f2f2;
      }
    }
  }
  .offline-payment {
    position: fixed;
    bottom: 66px;
    color: #49a0fb;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    width: 100%;
  }
</style>
