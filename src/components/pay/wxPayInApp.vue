<template>
  <div class="mobile-pay-wrap">
    <img class="wx-pay-icon" src="../../assets/img/WeChat@2x.png" alt="" />

    <p v-if="platform == 1" class="wx-pay-text-header">正在支付中</p>

    <p class="wx-pay-text-tips">谢谢您对万顺福的支持！</p>
    <!--  返回安卓乘客APP  -->
    <a v-if="platform == 1 && role == 1" class="back-to-app" href="wsjc://www.wsecar.com">返回商城</a>
    <!--  返回安卓司机APP  -->
    <a v-if="platform == 1 && role == 2" class="back-to-app" href="wsjcsj://com.wsecar.wsjcsj/splash?type=1">返回商城</a>
    <!--  返回Ios乘客APP  -->
    <a v-if="platform == 2 && role == 1" class="back-to-app" href="wsjc://www.wsecar.com">返回商城</a>
    <!--  返回Ios司机APP  -->
    <!-- wscz://www.wsecar.com -->
    <a v-if="platform == 2 && role == 2" class="back-to-app" href="https://wsjcdriver.wsecar.com/ ">返回商城</a>
  </div>
</template>

<script>
import { getToken } from '@/utils/token'
import Cookies from 'js-cookie'
export default {
  name: 'wxPayInApp',
  data() {
    return {
      channel: '',
      platform: '', // 1 - 安卓  2 - ios
      role: '', // 1 - 乘客 2 - 司机
      orderId: '',
      rechargeOrder: '', //1 - 话费充值
      orderCode: ''
    }
  },
  created() {
    if(this.getQueryString('businessType')=='insurance'){
      let url = window.location.href.split('.');
      if (url[1] == 'wsfmall') {
        let env = url[0].split('-').length > 1 ? '-' + url[0].split('-')[1] : ''
        if(env){
          window.location.replace(`https://driver-h5${env}.wsecar.com/carInsurance`)
        }else {
          window.location.replace(`https://wswyc.xa-online.com/carInsurance`)
        }
      }

    }
    this.orderId = this.getQueryString('orderId') || ''
    this.rechargeOrder = this.getQueryString('rechargeOrder') || ''
    this.orderCode = this.getQueryString('orderCode') || ''
    this.checkCookieReturn(this.rechargeOrder)
    this.channel = this.getQueryString('channel') || ''
    this.role = Cookies.get('_wsf_role')
    if (this.channel == 1050) {
      this.platform = 2
      this.role = 1
    }
    if (this.channel == 2050) {
      this.platform = 2
      this.role = 2
    }
    // this.checkChannel(this.channel)
  },
  methods: {
    schemeApp() {
      /**
       * android拉取app地址：
       * 乘客：wsjc://www.wsecar.com
       * 司机：wsjcsj://com.wsecar.wsjcsj/splash?type=1
       * ios 唤醒app地址:
       * 乘客: wsjc://www.wsecar.com
       * 司机: wscz://www.wsecar.com
       * */
    },
    /** 返回url的参数值 */
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      console.log('window.location: ', window.location)
      let result = decodeURI(window.location.search.substr(1)).match(reg)
      return result ? unescape(result[2]) : null
    },
    /** Ios 唤醒app **/
    isIosInstalled() {
      if (this.platform != 2 || this.role <= 0) return
      if (this.role == 1) {
        window.location.href = 'wsjc://www.wsecar.com' // ios 乘客端
      } else if (this.role == 2) {
        window.location.href = 'wscz://www.wsecar.com' // ios 司机端
      }
    },
    /** Android 唤醒app **/
    isAndroidInstalled() {
      if (this.platform != 1 || this.role <= 0) return
      if (this.role == 1) {
        window.location.href = 'wsjc://www.wsecar.com' // 安卓 乘客端
      } else if (this.role == 2) {
        window.location.href = 'wsjcsj://com.wsecar.wsjcsj/splash?type=1' // 安卓 司机端
      }
    },
    /**
     * @method 识别channel 渠道值判别用户类型
     * android乘客：1010
     * android司机：2010
     * ios乘客：1050
     * ios司机：2050
     *
     */
    checkChannel(channel) {
      console.log('开始转换渠道值 channel: ', channel)
      let typeCode = `${channel}`.substring(0, 4)
      console.log('typeCode: ', typeCode)
      switch (typeCode) {
        case '1010':
          this.platform = 1
          this.role = 1
          this.isAndroidInstalled()
          break
        case '2010':
          this.platform = 1
          this.role = 2
          this.isAndroidInstalled()
          break
        case '1050':
          this.platform = 2
          this.role = 1
          this.isIosInstalled()
          console.log(this.platform, 'this.platform')
          console.log(this.role, 'this.role')
          break
        case '2050':
          this.platform = 2
          this.role = 2
          this.isIosInstalled()
          console.log(this.platform, 'this.platform')
          console.log(this.role, 'this.role')
          break
        default:
          this.platform = 0
          this.role = 0
          break
      }
    },
    checkCookieReturn(data) {
      console.log('getToken()', getToken())
      if (getToken()) {
        if (data == 1) { //话费充值
          this.$router.replace(`/rechargSuccess?orderCode=${this.orderCode}`)
        } else {
          this.$router.replace(`/paysuccess?type=1&id=${this.orderId}&businessType=100`)
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.mobile-pay-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .wx-pay-icon {
    margin-top: 4.16rem;
    margin-bottom: 0.96rem;
    width: 2.4rem;
    height: 2.4rem;
  }

  .wx-pay-text-header {
    font-size: 0.8rem;
    font-weight: 400;
    color: #000000;
    line-height: 0.8rem;
    margin-bottom: 0.48rem;
  }

  .wx-pay-text-tips {
    font-size: 0.52rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 0.8rem;
    margin-bottom: 1.76rem;
  }

  .back-to-app {
    width: 4.4rem;
    height: 1.4rem;
    line-height: 1.4rem;
    text-align: center;
    border-radius: 0.72rem;
    border: 1px solid #666666;
    text-decoration: none;
    color: #000000;
  }
}
</style>
