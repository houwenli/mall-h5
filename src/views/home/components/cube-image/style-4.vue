<template>
  <div class="cube-list">
    <div :class="{
        'cube-image-left': config.hasBackground == '1',
        'cube-image-left cube-image-left-no': config.hasBackground == '0'
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
        'cube-image-right': config.hasBackground == '1',
        'cube-image-right cube-image-right-no': config.hasBackground == '0'
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
  name: 'style-4',
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
  display: flex;
  justify-content: space-between;
  .cube-image-left {
    max-width: 49%;
    .my-swipe .van-swipe-item {
      border-radius: 12px;
      color: #fff;
      font-size: 20px;
    }
    img {
      width: 158px;
      height: 158px;
      border-radius: 12px;
    }
  }
  .cube-image-left-no{
    img{
      width: 170px;
      height: 170px;
    }
  }
  .cube-image-right {
    max-width: 49%;
    display: flex;
    flex-wrap: wrap;
    .right-pic-item:nth-child(1) {
      margin: 0 10px 5px 0;
    }
    .right-pic-item:nth-child(3) {
      margin: 0 10px 0 0;
    }
    .right-pic-item {
      img {
        width: 74px;
        height: 74px;
        // border-radius: 12px;
      }
      .right-pic-item-pic{
        border-radius: 12px;
      }
      .cube-img-default-logo {
        width: 74px;
        height: 74px;
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
  .cube-image-right-no{
    .right-pic-item {
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>