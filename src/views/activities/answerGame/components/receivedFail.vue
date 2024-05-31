<template>
  <van-popup v-model="isShow" :close-on-click-overlay="false" class="sussess-popup">
    <img class="receivedFail" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/huobao.png" />
    <div class="button">
      <div class="restart" @click="goTo('again')">再玩一次</div>
      <div class="view-coupons" @click="goTo('coupon')">查看优惠券</div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: 'receivedFail',
    props: {
      isShow: {
        type: Boolean,
        default: true,
      },
      activityId: {
        type: Number,
        default: null,
      },
    },
    methods: {
      goTo(name) {
        this.$router.push({name:'answerGame',} )
        if(name==='coupon'){
          localStorage.setItem('openCouponType','openCoupon' )
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .van-popup {
    height: 100vh;
  }
  .sussess-popup {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    padding: 0px 15px;
    .receivedFail {
      width: 100%;
    }
    img {
      width: 100%;
    }
    .text {
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      color: #ffffff;
      text-align: center;
      margin-bottom: 31px;
    }

    .button {
      display: flex;
      z-index: 10;
      flex-direction: column;
      div {
        width: 144px;
        height: 49px;
        border-radius: 24px;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .restart {
          width: 227px;
          height:71px;
          margin: 0 auto;
          margin-top: 45px;
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_xiayiti.png') no-repeat;
          background-size: 227px 71px;
          margin-bottom: 24px;
          font-size: 25px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 9px;
          text-shadow: 0px 1px 1px #000000;
        }
      .view-coupons {
        border: 1px solid #ffffff;
        font-size: 25px;
        font-family: Source Han Sans CN;
        font-weight: 300;
        color: #FFFFFF;
        margin-bottom: 17px;
        margin-left: 6px;
        width: 220px;
        height: 56px;
        border-radius: 29px;
      }
    }
  }
</style>
