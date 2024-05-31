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
      <div class="right-pic-item" v-for="(item, index) in config.list.slice(0,2)" :key="index">
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
  name: 'style-1',
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
    width: 158px;
    height: 208px;
    // max-width: 49%;
    .my-swipe .van-swipe-item {
      width: 100%;
      border-radius: 12px;
      color: #fff;
    }
    img {
      width: 158px;
      height: 208px;
      border-radius: 12px;
    }
  }
  .cube-image-left-no {
    width: 170px;
    height: 232px;
    img {
      width: 170px;
      height: 232px;
    }
  }
  .cube-image-right {
    max-width: 49%;
    max-height: 49%;
    .right-pic-item:first-child {
      margin-bottom: 4px;
    }
    .right-pic-item {
      img {
        width: 158px;
        height: 100px;
        // border-radius: 12px;
      }
      .right-pic-item-pic{
        border-radius: 12px;
      }
      .cube-img-default-logo {
        width: 158px;
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
  }
  .cube-image-right-no{
    .right-pic-item {
      img {
        width: 170px;
        height: 110px;
        border-radius: 12px;
      }
    }
  }
}
</style>
