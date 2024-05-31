<template>
  <!-- 支付成功页 -->
  <div style="height: 100%">
    <navbartop :title="'支付结果'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <div class="pay-success">
      <!-- 支付成功的展示 -->
      <div v-if="status" class="main">
        <img class="img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/pay_success%402x.png" alt="" />
        <span class="status">支付成功！</span>
        <span class="text">预计10分钟左右到账，请关注短信</span>
        <div class="btn">
          <van-button class="btn-round mall" round plain color="#FF0A35" @click="onBack">商城首页</van-button>
          <van-button class="btn-round onemore" round @click="onBuy">再次购买</van-button>
        </div>
      </div>
      <!-- 其他情况 -->
      <div v-else class="main failure">
        <van-loading type="spinner" color="#999999" vertical>支付结果查询中</van-loading>
      </div>
    </div>
  </div>
</template>

<script>
import { queryOrderStatus } from '@/api/phoneCharge'
import navbartop from '@/components/commons/navBartop' // 导航栏
export default {
  components: {
    navbartop,
  },
  data() {
    return {
      status: 0,
      step: 0
    }
  },
  computed: {
    wxzfId() {
      return localStorage.getItem('wxzf_id')
    },
  },
  created() {
    let localStorage_orderCode = localStorage.getItem('wxzf_id')
    let orderCode = this.$route.query.orderCode
    // 有订单且有wxzf_id 则为其他支付方式，删除wxzf_id
    if (localStorage_orderCode && orderCode) {
      localStorage.removeItem('wxzf_id')
    }
    this.queryOrderStatus(orderCode)
    setTimeout(() => {
      this.step = 1
    }, 12500)
  },
  methods: {
    // 回到商城首页
    onBack() {
      this.$router.push({ path: '/' })
    },
    // 再次购买话费
    onBuy() {
      this.$router.push({ path: '/phoneCharge' })
    },
    async queryOrderStatus(orderCode) {
      let res = await queryOrderStatus({ orderNo: orderCode }).catch((err) => {
        this.toPolling(orderCode)
      })
      this.status = res.data
      if(this.step !== 1) { //查询
        this.toPolling(orderCode)
      } else { //失败的回到首页，否则停留在当前页
        if (res && res.code == 200) {
          if(!this.status) {
            this.toPhoneCharge()
          }
        }
      }
    },
    toPolling(val) {
      if(this.step !== 1) {
          let timer = setTimeout(() => {
          this.queryOrderStatus(val)
            clearTimeout(timer)
          }, 3500)
        } else {
          this.toPhoneCharge()
        }
    },
    toPhoneCharge() {
      this.$toast({
        message: '支付取消',
        duration: 2000,
      }).$on(
        'close',
        () => {
          this.$router.push({ path: '/phoneCharge' })
        }
      )
    },
    backLastPage() {
      this.$router.push({ path: '/phoneCharge' })
    }
  }
}
</script>
<style lang="less" scoped>
@import './style/rechargSuccess.less';
</style>