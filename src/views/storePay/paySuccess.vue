<template>
  <div class="content">
    <img v-if="payType == 2 && status != 1 && status != 2" class="pay-icon" src="@/assets/img/alipay.png" alt="" />
    <img v-if="payType == 1 && status != 1 && status != 2" class="pay-icon" src="@/assets/img/weipay.png" alt="" />
    <img v-if="status == 1" class="pay-icon" src="@/assets/img/correct.png" />
    <!-- <img v-if="status == 2" class="pay-icon" src="@/assets/img/pay_pail.png" /> -->
    <!-- <p class="pay-result" :class="{ 'pay-success': status === 1, 'pay-fail': status === 2 }">{{ payText }}</p> -->
    <p class="pay-result" :class="{ 'pay-success': status === 1 }">{{ payText }}</p>
    <p class="pay-tips">{{ payTips }}</p>
    <div v-if="(status == 1 || status == 2) && show" class="back-bt" @click="backIndex">返回首页</div>
  </div>
</template>
<script>
  import { queryStatus } from './service'
  export default {
    data() {
      return {
        payType: this.$route.query.payType, //1微信支付,2支付宝支付
        status: 0,
        show: false,
        getNum: 0, // 轮询次数
      }
    },
    computed: {
      payText() {
        // return this.status == 1 ? '支付成功' : this.status == 2 ? '支付失败' : '正在支付…'
        return this.status == 1 ? '支付成功' : '正在支付…'
      },
      payTips() {
        return this.status == 1 ? '谢谢您对万顺商城的支持！' : this.status == 2 ? '很抱歉，支付中出现错误了！' : '请您耐心等待！'
      },
    },
    created() {
      if (window.ws) {
        // android环境
        this.show = true
      } else if (window.webkit) {
        // ios环境
        this.show = true
      }
      this.getOderStatus()
    },
    beforeDestroy() {
      clearTimeout(this.time)
    },
    methods: {
      async getOderStatus() {
        let params = {
          wsOrderCode: this.$route.query.orderCode,
        }
        try {
          let res = await queryStatus(params)
          if (res.code === 1) {
            let data = res.data
            if (data == 2 || data == 3) {
              this.status = 1
            } else {
              this.getNum++
              if (this.getNum <= 30) {
                this.time = setTimeout(() => {
                  this.getOderStatus()
                }, 1000)
              }
            }
          }
        } catch (error) {
          this.getNum++
          if (this.getNum <= 10) {
            this.time = setTimeout(() => {
              this.getOderStatus()
            }, 1500)
          }
          console.log(params)
        }
      },
      backIndex() {
        let orderType = localStorage.getItem('storePayOrderType')
        const reg = /https:\/\/m([-0-9a-zA-Z*]*).wsfmall.com/i
        const result = window.location.origin.match(reg)[1]
        if(orderType == 11) {
          window.location.replace(`https://wssvc${result}.wsecar.com/ecommerce/preorderMerchandise`)
        } else {
          window.location.replace(`https://wssvc${result}.wsecar.com/ecommerce/myStore`)
        }
        
      },
    },
  }
</script>
<style lang="less" scoped>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;
    height: 100vh;
    background-color: #fff;
    color: #999999;
    .pay-icon {
      width: 60px;
      height: 60px;
    }
    .pay-result {
      margin: 16px 0 4px 0;
      font-size: 20px;
      font-weight: 600;
      color: #000000;
      line-height: 28px;
    }
    .pay-tips {
      font-size: 12px;
      line-height: 17px;
    }
    .back-bt {
      margin-top: 24px;
      width: 110px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      box-sizing: border-box;
      border-radius: 20px;
      border: 1px solid #999;
      font-size: 14px;
    }
    .pay-fail {
      color: #e60113;
    }
    .pay-success {
      color: #20b759;
    }
  }
</style>
