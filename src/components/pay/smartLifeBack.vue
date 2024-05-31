<template>
  <div class="mobile-pay-wrap">
    <img class="wx-pay-icon" src="../../assets/img/WeChat@2x.png" alt="" />

    <p class="wx-pay-text-tips">谢谢您对万顺福的支持！</p>
    <!--  万顺叫车乘客端  -->
    <a v-if="userSource === 'passenger'" class="back-to-app" href="wsjc://www.wsecar.com">返回商城</a>
    <!--  万顺叫车车主端  -->
    <a v-if="userSource === 'driver'" class="back-to-app" href="wscz://app">返回商城</a>
    <!--  万顺云办公  -->
    <a v-if="userSource === 'work'" class="back-to-app" href="wsservice://">返回商城</a>
    <!--  万顺叫车代驾端  -->
    <a v-if="userSource === 'valetDriving'" class="back-to-app" href="https://wsjcdriver.wsecar.com/ ">返回商城</a>
  </div>
</template>

<script>
  export default {
    name: 'smartLifeBack',
    data() {
      return {
        userSource: ''
      }
    },
    created() {
      this.userSource = this.getQueryString('userSource')
      this.$router.go(-2)
    },
    methods: {
      /** 返回url的参数值 */
      getQueryString(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        console.log('window.location: ', window.location)
        let result = decodeURI(window.location.search.substr(1)).match(reg)
        return result ? unescape(result[2]) : null
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
