<template>
  <div class="page-container">
    <header v-if="!isH5" class="fixed-header">
      <div class="back" @click="$router.go(-1)"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">{{ $route.meta.title }}</div>
      <div class="more"></div>
    </header>
    
    <div class="content">
      <div v-if="isH5"  @click="$router.replace({ path: '/' })" class="back-box"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <img class="top-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/datiye_background_top.png" />
            <img class="bottom-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/datiye_background_bottom.png" />
            <img class="wuquan-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_wuquan.png" />
      <div class="text-title">券已经发完！</div>
      <div class="text-Subtitle">抱歉！您来晚了~</div>
      <div class="go-mall-index-buttom" @click="$router.replace({ path: '/' })">到商城首页逛逛</div>
      <!-- <image
        class="bgc-bottom"
        src="../../../../static/组 277@2x (1).png"
      ></image> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "notActivity",
  data() {
    return {
      mallImg: this.$mallImg,
      searchBarTop: 0,
      searchBarHeight: 0,
      isH5:this.$store.state.userSource == 3,
    };
  },
  methods: {
    goBack() {
        // this.$wsf.go("GameLandingPage",{},'redirectTo');
    },
    goTo() {
      // this.$wsf.go("Index");
    },
  },
};
</script>

<style lang="less" scoped>
.page-container {
  // height: 100vh;
  // padding: 68px 13px;
  background: linear-gradient(90deg, #ffadb1 0%, #ffcbce 100%);
  padding-bottom: 76px;
  padding-top: 71px;
    // height: 100%;
  .back-box{
  width: 50px;
  height: 28px;
  position: absolute;
  background: #fff;
  opacity: 0.8;
  top: -42px;
    z-index: 10;
  left: 14px;
  border-radius: 15px;
  img{
    margin-left: 8px;
    width: 27px;
  }

}
  .fixed-header {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 44px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;

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
  .back-but {
    width: 50px;
    border-radius: 16px;
    background: rgba(253, 244, 244, 0.8);
    position: fixed;
    left: 10px;
    z-index: 10;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .back-img {
      width: 11px;
      height: 20px;
      margin-right: 3px;
    }
  }
  .bgc-top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 101px;
  }
  .bgc-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 152px;
  }
  .top-img{
    position: absolute;
    width: 375px;
    height: 101px;
    top: -73px;
    z-index: 4;
  }
  .bottom-img{
    position: absolute;
    width: 375px;
    height: 152px;
    bottom: -64px;
    z-index: 4;
  }
  .wuquan-img{
    width: 124px;
    height: 106px;
    margin-top: 156px;
    margin-bottom: 19px;
  }
  .content {
    box-shadow: 0px 3px 12px #f98a8a;
    // height: 77%;
    // margin-top: 28px;
    margin-left: 10px;
    margin-right: 10px;
    background: #f7f3f7;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .gift-img {
    width: 124px;
    height: 106px;
    margin-bottom: 19px;
  }
  .text-title {
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #000000;
    margin-bottom: 27rpx;
  }
  .text-Subtitle {
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: 300;
    color: #999999;
    margin-bottom: 33px;
  }
  .go-mall-index-buttom {
    width: 220px;
    height: 58px;
    border: 1px solid #f54695;
    border-radius: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #f54695;
    margin-bottom: 234px;
  }
}
</style>
