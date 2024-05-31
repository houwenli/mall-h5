<template>
  <div class="swipe">
    <van-swipe class="my-swipe" :show-indicators="showIndicators" :autoplay="3000" :duration="500" indicator-color="white" @change="onChange">
      <van-swipe-item v-for="(item,index) in listData" :key="item.id">
        <img v-if="item.url" @click="navigate(item,index)" :src="item.url" />
        <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
  import { Swipe, SwipeItem } from 'vant'
  import {routerPathName,toMiniAppDistribution} from '@/utils/utils'
  import Cookies from 'js-cookie'
  export default {
    components: {
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
    },
    props: {
      listData: {
        type: Array,
        default: () => [],
        required: true,
      },
      showIndicators: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      navigate(data,index){
        // 流量分析埋点
        let params = {
          name:'轮播图',
          type: 1,
          image:data.url || '',
          url:data.link || '',
          index,
          channel_source:Cookies.get('_wsf_role')
        }
        this.$store.dispatch('BURIED_POINT/advertVisitRequest',params)

        if(!data || !data.link) return
        let isLivePage = data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
        if(isLivePage){
            toMiniAppDistribution(data.link)
          }else{
            routerPathName(data.link)
          }
      },
      onChange(data) {
        this.$emit('swiperChange', JSON.stringify(data))
      }
    },
  }
</script>

<style scoped lang="less">
  .swipe {
    box-sizing: border-box;
    .my-swipe {
      width: 100%;
      img {
        display: block;
        width: 100%;
        height: 140px;
      }
    }
  }
</style>
