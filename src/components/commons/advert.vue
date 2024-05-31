<template>
  <div>
    <van-swipe class="advert-swipe" :autoplay="3000" :duration="500" indicator-color="#fff">
      <van-swipe-item v-for="(item,index) in data.imgList" :key="index">
        <img v-if="item.imgUrl" @click="navigate(item,index)" :src="item.imgUrl" />
        <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  data() {
    return {

    }
  },
  methods: {
    navigate(item, index) {
      if (!item || !item.h5JumpUrl) return
      let isLivePage = item.h5JumpUrl.indexOf('pages/livePlayer/livePlayer') !== -1 || item.h5JumpUrl.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
      if (isLivePage) {
        toMiniAppDistribution(item.h5JumpUrl)
      } else {
        routerPathName(item.h5JumpUrl)
      }
    }
  },
}
</script>

<style lang="less" scoped>
.advert-swipe {
  height: 269px;
  width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>