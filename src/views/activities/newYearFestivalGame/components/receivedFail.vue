<template>
  <van-popup v-model="isShow" :close-on-click-overlay="false" class="sussess-popup">
    <img class="receivedFail" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupons-empty.png" />
    <div class="text">
      <p>哎呀，活动太火爆了</p>
      <p>券没抢到。。。</p>
    </div>
    <div class="button">
      <div class="restart" @click="goTo('answer')">再玩一次</div>
      <div class="view-coupons" @click="goTo('myCoupon')">查看我的优惠券</div>
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
      isAppEnter: {
        type: Number,
        default: null,
      },
    },
    methods: {
      goTo(name) {
        if (name === 'answer') {
          //   this.$router.go(0)
          this.$emit('resetDate')
        } else {
          this.$router.replace({
            name,
            query: {
              activityId: this.activityId,
              isAppEnter: this.isAppEnter,
            },
          })
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
        background: linear-gradient(0deg, #feede6 0%, #fff7f1 100%);
        color: #ea3f53;
        margin-bottom: 5px;
      }
      .view-coupons {
        border: 1px solid #ffffff;
        color: #ffffff;
        margin-bottom: 17px;
      }
    }
  }
</style>
