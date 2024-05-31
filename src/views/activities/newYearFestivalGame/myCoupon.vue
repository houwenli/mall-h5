<template>
  <div class="page-container">
    <header class="fixed-header" v-if="isAppEnter">
      <div class="back" @click="$router.go(-1)"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">{{ $route.meta.title }}</div>
      <div class="more"></div>
    </header>
    <div class="main-container">
      <div class="coupon-list">
        <div class="coupon-item" v-for="(item, index) in couponList" :key="index">
          <div class="left">
            <div class="coupon-img">
              <img :src="item.url" />
            </div>
            <div class="info">
              <p class="goods-name">{{ item.commodityName }}</p>
              <div>
                <p v-if="item.effectiveEndTime" class="goods-time">有效日期至：{{ item.effectiveEndTime.split(' ')[0] }}</p>
                <p v-if="item.unavailableReasonList" class="goods-time" >不可用原因：{{ item.unavailableReasonList.join('、') }}</p>
              </div>
            </div>
          </div>
          <div class="right">
            <div v-if="item.couponsType == 1 || item.couponsType == 3" class="prie-box">
              <span class="pire-icon">￥</span>
              <span class="pire">{{ item.faceValue / 100 }}</span>
            </div>
            <div v-else class="prie-box">
              <span class="pire">{{ item.faceValue / 100 }}</span>
              <span class="pire-type">折</span>
            </div>
            <p class="condition" v-if="item.couponsType == 1">满{{ item.amountLimitation / 100 }}元可用</p>
            <p class="condition" v-if="item.couponsType == 2">无门槛</p>
            <p class="condition" v-if="item.couponsType == 3">满{{ item.faceValue / 100 }}元可用</p>
            <span class="to-use" @click="goGoodsDetail(item)">立即使用</span>
          </div>
          <!-- 不可用优惠券加图层置灰 -->
          <div class="mask" v-if="item.unavailableReasonList"></div>
        </div>
      </div>
    </div>
    <van-popup v-model="isShow" :close-on-click-overlay="false" class="popup">
      <img class="receivedFail" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-nohave-coupon.png" />
      <div class="text">
        <p>您还没有优惠券</p>
        <p>游戏挑战成功即有机会领取</p>
      </div>
      <div class="restart" @click="$router.go(-1)">去玩游戏</div>
    </van-popup>
  </div>
</template>

<script>
  import { getMyCouponList } from '@/api/activities/games.js'
  import { bargainVisit } from '@/api/visit.js'
  export default {
    name: 'myCoupon',
    data() {
      return {
        couponList: [],
        isShow: false,
        isWeChat: false, //是否从小程序进
        isAppEnter: false, //是否从app进
      }
    },
    created() {
      this.isAppEnter = Number(this.$route.query.isAppEnter)
      this.isWeChat = window.__wxjs_environment === 'miniprogram'
      this.selectCoupon()
    },
    methods: {
      goGoodsDetail(item) {
        // 埋点
        bargainVisit({
          // 具体商品
          isBargain: 0,
          skuId: item.skuId,
          spuId: item.spuId,
        })
          .then(() => {})
          .catch((e) => {})

        // 跳转到微信小程序原生详情页面
        if (window.__wxjs_environment === 'miniprogram') {
          console.log('/productModule/pages/skuDetail/skuDetail?spuId=' + item.spuId)
          window.wx.miniProgram.navigateTo({
            url: '/productModule/pages/skuDetail/skuDetail?spuId=' + item.spuId,
          })
          return
        }

        this.$router.push({
          path: '/spudetail',
          query: { isGame: 'true', spuId: item.spuId, storeId: item.storeId, sourceType: item.sourceType || 1 },
        })
      },
      selectCoupon() {
        getMyCouponList()
          .then((res) => {
            if (res.code === 200) {
              this.couponList = res.data.userCouponList || []
              this.isShow = res.data.userCouponList ? false : true
            }
          })
          .catch((error) => {
            console.error(error)
          })
      },
    },
    goTo(name) {
      this.$router.replace({
        name,
        query: {
          activityId: this.$route.query.activityId,
          id: this.$route.query.id,
        },
      })
    },
  }
</script>

<style lang="less" scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .fixed-header {
    width: 100%;
    height: 44px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      margin-left: 12px;
      img {
        width: 24px;
      }
    }
    .title {
      text-align: center;
      color: #000;
      font-size: 18px;
      line-height: 44px;
    }

    .more {
      width: 28px;
      height: 20px;
      line-height: 20px;
      margin-right: 20px;
      color: #333;
      font-size: 14px;
    }
  }
  .main-container {
    background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-ranking-bgc.jpg');
    background-size: 100% 100%;
    overflow: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0px 9px 20px 9px;
    .coupon-list {
      .coupon-item {
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupon-bgc.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 10px;
        display: flex;
        height: 101px;
        position: relative;
        .mask {
          background: rgba(0, 0, 0, 0.3) !important;
          height: 100%;
          position: absolute;
          width: 100%;
          border-radius: 5px;
        }

        .left {
          flex: 1;
          padding: 6px;
          display: flex;

          .coupon-img {
            min-width: 91px;
            max-width: 91px;
            min-height: 91px;
            height: 100%;
            border-radius: 5px;
            margin-right: 10px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
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
          }
          img {
            height: 100%;
            background: #8f8f8f;
            border-radius: 5px;
          }
        }
        .right {
          width: 102px;
          height: 100%;
          //   background: linear-gradient(135deg, #ff6b77 0%, #e60113 100%);
          position: relative;
          color: #fff;
          text-align: center;
          padding-top: 8px;
          .prie-box{
            height: 35px;
          }
          .pire-icon {
            font-size: 10px;
            font-weight: bold;
            color: #ffffff;
          }
          .pire {
            font-size: 25px;
            font-family: Arial;
            font-weight: bold;
            color: #ffffff;
          }
          .pire-type {
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #ffffff;
          }
          .condition {
            font-size: 12px;
            line-height: 17px;
          }
          .to-use {
            display: inline-block;
            height: 22px;
            line-height: 22px;
            background: #fff;
            border-radius: 15px;
            color: #e60113;
            font-size: 9px;
            margin-top: 8px;
            padding: 0px 15px;
          }
        }
        .use-buttom {
          width: 60px;
          height: 20px;
          background: #ffffff;
          border-radius: 10px;
          color: #fe4c47;
          text-align: center;
        }
      }
    }
  }
  .van-popup {
    height: 100vh;
  }
  .popup {
    background: none;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px 40px;
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

    .restart {
      width: 144px;
      height: 49px;
      border: 1px solid #ffffff;
      border-radius: 24px;
      line-height: 49px;
      text-align: center;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }
  }
</style>
