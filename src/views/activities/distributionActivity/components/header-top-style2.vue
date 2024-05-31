<template>
  <div>
    <div class="header-title header-box" :class="{ brunet: bgType == 2 }">
      <!-- 浅色 -->
      <template v-if="bgType == 2">
        <div class="header-title">
          <div class="header-back" @click="goBack">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/arrow-back-white-2x.png" alt="" />
          </div>

          <div class="header-more" @click="handShowOverlay">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/feature-list-icon-white-2x.png" alt="" />
          </div>

          <img  class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-white-2x.png" alt="" />
        </div>
        <div @click.stop="toOrder" class="headet-order"></div>
      </template>

      <!-- 深色 -->
      <template v-else>
        <div class="header-title">
          <div class="header-back" @click="goBack">
            <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt="" />
          </div>

          <div class="header-more" @click="handShowOverlay">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/more-freature-icon-list-2x.png" alt="" />
          </div>

          <img class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-grey-2x.png" alt="" />
        </div>
        <div @click.stop="toOrder" class="headet-order dark-order"></div>
      </template>
    </div>
    <div v-if="showOverlay" class="indicator_">
      <div class="img_"><img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-triangle.png" alt="" /></div>
      <div class="listTime" @click="navigationTo('/')">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-homePage.png" alt="" />
        <span>首页</span>
      </div>
      <div class="listTime" @click="navigationTo('/cart')">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-shoppingTrolley.png" alt="" />
        <span>购物车</span>
      </div>
      <div class="listTime" @click="navigationTo('/home')">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-personage.png" alt="" />
        <span>个人中心</span>
      </div>
      <!-- <div class="listTime" @click="navigationTo('/mycollectsku')">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-collect.png" alt="" />
        <span>我的收藏</span>
      </div>
      <div class="listTime" @click="navigationTo('/mybrowserecord')">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-record.png" alt="" />
        <span>浏览记录</span>
      </div> -->
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      bgType: {
        type: [String, Number],
      },
    },
    data() {
      return {
        showOverlay: false,
      }
    },
    methods: {
      goBack() {
        // 分享进来返回商城首页
        // if (this.enterType === 'share') {
        //     this.$wsf.go('Index');
        // }
        //   返回上一个小程序
        if (window.history.state) {
          this.$router.back(-1)
        } else {
          if (this.$store.getters.phoneType == 'IOS') {
            window.webkit.messageHandlers.finishActivity.postMessage('')
          } else {
            window.ws.finishActivity()
          }
        }
      },

      goCart() {
        this.showOverlay = false
        this.$router.replace('/car')
      },
      goRecord() {
        this.showOverlay = false
        this.$router.replace('/home')
      },
      goIndex() {
        this.showOverlay = false
        this.$router.replace('/index')
      },
      /* 跳转 */
      navigationTo(sceneName) {
          this.showOverlay = false
         this.$router.replace(sceneName)
      },

      toOrder() {
        console.log('----');
        this.$router.push('/distributionOrder')
      },

      handShowOverlay() {
        this.showOverlay = !this.showOverlay
      },
    },
  }
</script>
<style lang="less" scoped>
  .header-title {
    display: flex;
    align-items: center;
    box-sizing: content-box;
    padding-left: 12px;
    height: 44px;
    .header-back {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      border: 1px solid rgba(151, 151, 151, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 8px;
      img {
        width: 20px;
        height: 20px;
      }
    }
    .header-more {
      margin-right: 8px;
      width: 32px;
      height: 32px;
      img {
        width: 100%;
        height: 100%;
        margin-right: 8px;
      }
    }

    .header-icon {
      margin-left: 4px;
      width: 116px;
      height: 22px;
    }
    .headet-order {
      width: 68px;
      height: 32px;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/order-icon-white-2x.png') no-repeat;
      background-size: cover;
    }
    .dark-order {
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/order-icon-2x.png') no-repeat;
      background-size: cover;
    }
  }
  .header-box {
    justify-content: space-between;
    padding-left: 0;
    padding-right: 12px;
  }
  .brunet {
    .header-back {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
  .indicator_ {
    position: fixed;
    z-index: 999;
    left: 0;
    width: 116px;
    box-shadow: 0 -3px 10px 0 rgba(189, 194, 204, 0.04), 0 -2px 8px 0 rgba(189, 194, 204, 0.08), 0 -1px 6px 0 rgba(189, 194, 204, 0.06);
    background: #ffffff;
    border-radius: 8px;
    margin-left: 12px;
    margin-top: 8px;
    padding: 4px 12px;
    .img_ {
      position: absolute;
      width: 5px;
      height: 4px;
      top: -13px;
      left: 49%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .listTime {
      height: 40px;
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
      span {
        font-size: 13px;
        color: #444444;
        padding-left: 12px;
      }
    }
  }
</style>
