<template>
  <van-popup v-model="isShow" :close-on-click-overlay="false" class="sussess-popup">
    <div class="box">
      <img class="light" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-success-light.png" />
      <img class="doll" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-success-doll.png" />
      <img class="containert" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-success-containert.png" />
      <div class="top">
        <p class="text">恭喜您！领取成功</p>
        <div class="coupon">
          <div class="left">
            <div class="right-top"></div>
            <div class="right-bottom"></div>
            <div class="coupon-img">
              <img :src="successCoupon.url" />
            </div>
            <div class="info">
              <p class="goods-name">{{ successCoupon.showName }}</p>
              <p class="goods-time">{{ successCoupon.packCouponTimeLimitTxt }}</p>
            </div>
          </div>
          <div class="right">
            <div class="left-top"></div>
            <div class="left-bottom"></div>
            <div class="goods-pire">
              <div v-if="successCoupon.couponsType == 1 || successCoupon.couponsType == 3">
                <span class="pire-icon">￥</span>
                <span class="pire">{{ successCoupon.faceValue / 100 }}</span>
              </div>
              <div v-else>
                <span class="pire">{{ successCoupon.faceValue / 100 }}</span>
                <span class="pire-type">折</span>
              </div>
            </div>
            <div class="goods-rule">{{ successCoupon.couponUseInfoTxt }}</div>
          </div>
        </div>
      </div>

      <div class="button">
        <div class="restart" @click="goTo('answer')">再玩一次</div>
        <div class="view-coupons" @click="goTo('myCoupon')">查看我的优惠券</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: 'selectCoupon',
    props: {
      isShow: {
        type: Boolean,
        default: true,
      },
      successCoupon: {
        type: Object,
        default: () => {},
      },
      activityId: {
        type: [Number, String],
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
    .box {
      height: 300px;
      width: 300px;
      margin-top: 200px;
      position: relative;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      padding: 0px 15px;
      .light {
        width: 311px;
        height: 300px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -67%);
      }
      .doll {
        width: 106px;
        height: 141px;
        position: absolute;
        left: 50%;
        top: -100px;
        transform: translate(-50%, 0%);
      }
      .containert {
        width: 100%;
        position: absolute;
        left: 50%;
        top: -5px;
        transform: translate(-50%, 0%);
      }
      .top {
        z-index: 10;
        margin-top: 25px;
        .text {
          font-size: 21px;
          font-family: Source Han Sans CN;
          font-weight: 800;
          color: #fe4748;
          text-align: center;
        }
        .coupon {
          margin-top: 10px;
          display: flex;
          height: 69px;

          .left {
            background: #ffffff;
            flex: 1;
            padding: 8px 8px 9px 7.5px;
            display: flex;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            position: relative;
            .coupon-img {
              background: rgb(173, 172, 172);
              min-width: 51px;
              max-width: 51px;
              height: 51px;
              border-radius: 5px;
              margin-right: 10px;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .right-bottom {
              position: absolute;
              width: 5px;
              height: 5px;
              background: #f7e1df;
              bottom: 0px;
              right: 0px;
              border-top-left-radius: 100%;
            }
            .right-top {
              position: absolute;
              width: 5px;
              height: 5px;
              background: #f7e1df;
              top: 0px;
              right: 0px;
              border-bottom-left-radius: 100%;
            }
            .info {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .goods-name {
              font-size: 12px;
              font-family: Source Han Sans CN;
              font-weight: bold;
              color: #000000;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden; //溢出内容隐藏
              text-overflow: ellipsis; //文本溢出部分用省略号表示
              display: -webkit-box; //特别显示模式
              -webkit-line-clamp: 2; //行数
              line-clamp: 2;
              -webkit-box-orient: vertical; //盒子中内容竖直排列
            }
            .goods-time {
              font-size: 10px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #000000;
              line-height: 14px;
            }
            img {
              height: 100%;
              background: #8f8f8f;
              border-radius: 5px;
            }
          }
          .right {
            background: #ffffff;
            width: 88px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            position: relative;
            .left-bottom {
              position: absolute;
              width: 5px;
              height: 5px;
              background: #f7e1df;
              bottom: 0px;
              left: 0px;
              border-top-right-radius: 100%;
            }
            .left-top {
              position: absolute;
              width: 5px;
              height: 5px;
              background: #f7e1df;
              top: 0px;
              left: 0px;
              border-bottom-right-radius: 100%;
            }
            .goods-pire {
              display: flex;
              color: #fe4947;
              height: 26px;
              line-height: 26px;

              .pire-icon {
                font-size: 10px;
                font-weight: bold;
              }
              .pire {
                font-size: 22px;
                font-family: Arial;
                font-weight: bold;
              }
              .pire-type {
                font-size: 12px;
                font-family: Source Han Sans CN;
                font-weight: bold;
              }
            }
          }
          .goods-rule {
            font-size: 10px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #fe4947;
          }
        }
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
        }
      }
    }
  }
</style>
