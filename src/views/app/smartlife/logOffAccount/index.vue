<template>
  <div class="logOff-wrap">
    <div class="logOff-userInfo">
      <img class="logOff-userInfo-icon" :src="`${this.$oss}/usercenter/sign.png`" />
      <p class="logOff-userInfo-title">注销账号</p>
      <p class="logOff-userInfo-info">
        <span>将</span>
        <span class="logOff-userInfo-phone">{{ phone ? phone.slice(0, 3) + '****' + phone.substr(-4) : '' }}</span>
        <span>所绑定的账号注销</span>
      </p>
    </div>
    <div class="logOff-describe">
      <p class="logOff-describe-note">检测到您的账户有以下未处理的内容，请仔细查阅，按照下述提示进行处理后再进行注销。</p>
      <p>·进行中的订单</p>
      <p class="logOff-describe-prompt">尚有未完成的订单，请前往【智慧生活APP/小程序-个人中心-订单】取消或完成相应订单后重试</p>
      <p class="logOff-describe-special">此外注销账号以下信息将被清空且无法找回：</p>
      <p>·个人账户信息</p>
      <p>·账单信息</p>
      <p>·优惠券</p>
      <p>·业务订单及交易记录</p>
      <p>·以及您在智慧生活存留的其他信息</p>
    </div>
    <div class="logOff-footer">
      <p class="logOff-flex logOff-footer-isRead">
        <img class="logOff-footer-icon" @click="onSelect(selected)" :src="`${smartImg}${selectImgs[selected]}`" />
        <span>已阅读并同意</span>
        <span class="logOff-footer-agreement" @click="toIndex('logOffAgreement')">《用户注销协议》</span>
      </p>
      <van-button :class="['logOff-footer-btn', selected == 0 ? 'unable-btn' : '']" round type="info" color="linear-gradient(90deg, #FF8011 0%, #FE3040 100%)" @click="onLogOff">注销账号</van-button>
    </div>
    <!-- 二次确认 -->
    <smartConfirm
      :show="showConfirm"
      :title="'注销账号'"
      :contentText="'注销账号会清空所有的信息和数据，您是否确认注销?'"
      :cancelText="'取消'"
      :confirmText="'注销账号'"
      @cancel="showConfirm = false"
      @confirm="confirm"
    />
  </div>
</template>

<script>
  // 公共组件
  import navbartop from '@/components/commons/navBartop'
  import smartConfirm from "../comm/smart-confirm/smart-confirm.vue"
  import { Toast } from 'vant'
  // 接口
  import { logoutApp } from '@/api/smart/logOffAccount'

  export default {
    components: { navbartop, smartConfirm, [Toast.name]: Toast },
    data() {
      return {
        smartImg: this.$smartImg,
        selected: 0,
        selectImgs: {
          0: '/cart/cart-sku-nomal.png',
          1: '/cart/2023-09-25/cart-sku-select.png',
        },
        showConfirm: false,
        phone: '',
        appData: {}, //app公参
      }
    },
    created() {
      let appData
      try {
        appData = JSON.parse(localStorage.getItem('appData')) || {}
      } catch (e) {
        appData = {}
      }
      this.appData = appData
      this.phone = this.appData.mobile
    },
    methods: {
      // 返回
      toBack() {
        this.$router.back()
      },
      // 是否勾选协议
      onSelect(val) {
        this.selected = val == 1 ? 0 : 1
      },
      //注销账号
      onLogOff() {
        if (this.selected != 1) {
          Toast('请手动勾选注销须知')
          return
        }
        this.showConfirm = true
      },
      //确认注销账号
      confirm() {
        let params = {
          mobile: this.phone,
          deviceId: this.appData.deviceId || '',
        }
        logoutApp(params)
          .then((res) => {
            this.showConfirm = false
            if (res.code == 200) {
              this.sharePro()
            } else {
              if (res.msg) {
                Toast(res.msg)
              }
            }
          })
          .catch((err) => {
            this.showConfirm = false
          })
      },
      //判别手机类型调用APP方法
      sharePro() {
        if (window.ws) {
          //安卓
          window.ws.logoutSuccess()
        } else if (window.webkit) {
          //IOS
          window.webkit.messageHandlers.logoutSuccess.postMessage({})
        } else {
          console.log('页面跳转失败')
        }
      },
      //去往对应页面
      toIndex(name) {
        this.$router.push(name)
      },
    },
  }
</script>

<style lang="less" scoped>
  .logOff-flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logOff-wrap {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
  }
  .logOff-userInfo {
    padding: 28px 16px 16px 16px;
    &-icon {
      width: 68px;
      height: 68px;
    }
    &-title {
      margin-top: 19px;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      line-height: 20px;
    }
    &-info {
      margin-top: 11px;
      font-size: 13px;
      font-weight: 400;
      color: #191919;
      line-height: 17px;
      .logOff-userInfo-phone {
        color: #ff450c;
      }
    }
  }
  .logOff-describe {
    flex: 1;
    padding: 16px;
    background: #ffffff;
    border-radius: 12px 12px 0 0;
    font-size: 13px;
    font-weight: 500;
    color: #191919;
    line-height: 17px;
    &-note {
      margin-bottom: 10px;
    }
    &-prompt {
      margin: 20px 0;
    }
    &-special {
      margin-bottom: 10px;
      font-weight: 400;
    }
  }
  .logOff-footer {
    position: fixed;
    bottom: 0;
    padding: 8px 12px 4px;
    width: 100vw;
    background: #ffffff;
    box-shadow: 0px -2px 10px 0px rgba(189, 194, 204, 0.2);
    font-size: 12px;
    font-weight: 400;
    color: #c3c3c3;
    // ios安全区域
    padding-bottom: calc(~'constant(safe-area-inset-bottom) + 4px'); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(~'env(safe-area-inset-bottom) + 4px'); /* 兼容 iOS >= 11.2 */
    &-isRead {
      height: 16px;
    }
    &-icon {
      margin-right: 4px;
      width: 16px;
      height: 16px;
    }
    &-agreement {
      color: #191919;
    }
    &-btn {
      margin-top: 8px;
      width: 100%;
      height: 40px;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      opacity: 1;
      /deep/ .van-button__text {
        color: #ffffff;
      }
    }
    .unable-btn {
      opacity: 0.6;
      /deep/ .van-button__text {
        color: #6e6e6e;
      }
    }
  }
</style>
