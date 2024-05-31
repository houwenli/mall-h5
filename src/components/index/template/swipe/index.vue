<template>
  <div class="swipe" data-desc='轮播图'>
    <van-swipe class="my-swipe" :height="swipeHeight" :width="swipeWidth" :autoplay="3000" :duration="500" indicator-color="white" :show-indicators='config.type === "horizontal"' :vertical='config.type === "vertical"'>
      <van-swipe-item v-for="(item,index) in config.list" :key="item.id">
        <img v-if="item.url" @click="navigate(item,index)" :src="item.url" />
        <img v-else @click="navigate(item,index)" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/zhanwei.png" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
  import { Swipe, SwipeItem } from 'vant'
  import {routerPathName,toMiniAppDistribution} from '@/utils/utils'
  import Cookies from 'js-cookie'

  export default {
    name: 'swipe',
    components: {
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            id: 'u695256381',
            list: [
              {
                url: '',
                link: '',
              },
            ],
          }
        },
        required: true,
      },
    },

    data() {
      return {
        swipeHeight: 0,
        swipeWidth: 0
      }
    },

    created() {
      // this.swipeHeight = Math.round(window.innerWidth / 100 * 16) + 'px'
      this.swipeHeight = window.innerWidth / 100 * 16
      this.swipeWidth = '100%'
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
      }
    },
  }
</script>

<style scoped lang="less">
  .swipe {
    height: 60px;
    box-sizing: border-box;
    margin: 0 12px;   
    .my-swipe {
		width: 100%;
		// 加上这个， 在手机上滑动屏幕到swipe只有的一点点的时候，就不会有问题
		height: 100%;
		border-radius: 8px;
		img {
			display: block;
			width: 100%;
			// height: 60px;
      height: 100%;
      border-radius: 8px;
		}
    }
  }
</style>
