<template>
  <div class="cube-list">
    <div :class="{
        'cube-image-item-pic': config.hasBackground == '1',
        'cube-image-item-pic cube-image-item-pic-no': config.hasBackground == '0'
      }">
      <img class="right-pic-item-pic" v-if="config.list[0].url" :src="config.list[0].url" @click="toPage(config.list[0], 5)" />
      <div v-else class="cube-img-default-logo">
        <img
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png"
        />
      </div>
    </div>
    <div :class="{
        'cube-image-center': config.hasBackground == '1',
        'cube-image-center cube-image-center-no': config.hasBackground == '0'
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
        'cube-image-item-pic': config.hasBackground == '1',
        'cube-image-item-pic cube-image-item-pic-no': config.hasBackground == '0'
      }">
      <img class="right-pic-item-pic" v-if="config.list[1].url" :src="config.list[1].url" @click="toPage(config.list[1], 6)" />
      <div v-else class="cube-img-default-logo">
        <img
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { toPage } from './data.js'
export default {
  name: 'style-5',
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
  .cube-image-center {
    width: 163px;
    height: 100px;
    margin: 0 4px;
    .my-swipe .van-swipe-item {
      border-radius: 12px;
      color: #fff;
      font-size: 20px;
    }
    img {
      border-radius: 12px;
      width: 163px;
      height: 100px;
    }
  }
  .cube-image-center-no{
    width: 174px;
    img {
      width: 174px;
      height: 100px;
    }
  }
  .cube-image-item-pic {
    img {
      width: 74px;
      height: 100px;
      // border-radius: 12px;
    }
    .right-pic-item-pic{
        border-radius: 12px;
      }
    .cube-img-default-logo {
      width: 74px;
      height: 100px;
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
  .cube-image-item-pic-no{
    img {
      width: 80px;
      height: 100px;
      border-radius: 12px;
    }
  }
}
</style>