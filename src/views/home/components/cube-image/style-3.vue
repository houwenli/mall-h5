<template>
  <div class="cube-list">
    <div :class="{
        'cube-image-top': config.hasBackground == '1',
        'cube-image-top cube-image-top-no': config.hasBackground == '0'
      }">
      <van-swipe class="my-swipe" :autoplay="3000" :duration="500" indicator-color="white" v-if='config.slideshowImageList.length'>
        <van-swipe-item v-for="(item, index) in config.slideshowImageList" :key="index">
          <img class="left-pic-item-pic" v-if="item.url" :src="item.url" @click="toPage(item, index)" />
          <img class="left-pic-item-pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png" />
        </van-swipe-item>
      </van-swipe>
      <div v-else class="cube-img-default-logo">
        <img
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png"
        />
      </div>
    </div>
    <div :class="{
        'cube-image-down': config.hasBackground == '1',
        'cube-image-down cube-image-down-no': config.hasBackground == '0'
      }">
      <div class="right-pic-item" v-for="(item, index) in config.list" :key="index">
        <img class="right-pic-item-pic" v-if="item.url" :src="item.url" @click="toPage(item, index+5)" />
        <div v-else class="cube-img-default-logo">
          <img
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toPage } from './data.js'
export default {
  name: 'style-3',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          list: []
        }
      },
    },
  },
  data () {
    return {

    }
  },
  methods: {
    toPage
  }
}
</script>

<style lang="less" scoped>
.cube-list {
  .cube-image-top {
    margin-bottom: 6px;
    .my-swipe .van-swipe-item {
      border-radius: 12px;
      color: #fff;
      font-size: 20px;
    }
    img {
      width: 327px;
      height: 100px;
      border-radius: 12px;
    }
  }
  .cube-image-top-no{
    img {
      width: 351px;
      height: 100px;
    }
  }
  .cube-image-down {
    display: flex;
    justify-content: space-between;
    .right-pic-item {
      max-width: 33%;
      img {
        width: 102px;
        height: 102px;
        // border-radius: 12px;
      }
      .right-pic-item-pic{
        border-radius: 12px;
      }
      .cube-img-default-logo {
        width: 102px;
        height: 102px;
        background: #fbfbfb;
        border-radius: 12px;
        position: relative;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 74px;
          height: 28px;
        }
      }
    }
  }
  .cube-image-down-no{
    .right-pic-item {
      img {
        width: 110px;
        height: 110px;
      }
    }
  }
}
</style>