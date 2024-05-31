<template>
  <!-- 图片魔方 -->
  <div
    class="cube_image"
    :style="{
      'background-color': listData.bgColor,
      'background-image': 'url(' + listData.bgImage + ')',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
    }"
  >
    <div class="item item_1">
      <van-swipe class="my-swipe" :autoplay="3000" :duration="500" indicator-color="white">
        <van-swipe-item v-for="(item,index) in listData.slideshowImageList" :key="item.id">
          <img v-if="item.url" :src="item.url" @click="navigate(item,index)" />
          <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="item item_2">
      <div class="item_img up">
        <img v-if="listData.imageRightUp.url" :src="listData.imageRightUp.url" @click="navigate(listData.imageRightUp,5)" />
        <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png" />
      </div>
      <div class="item_img down">
        <img v-if="listData.imageRightDown.url" :src="listData.imageRightDown.url" @click="navigate(listData.imageRightDown,6)" />
        <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png" />
      </div>
    </div>
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
        type: Object,
        default: () => {
          return {
            // 1 背景色 2 背景图片
            radio: 1,
            bgColor: '#fff',
            bgImage: '',
            // 轮播图列表
            slideshowImageList: [
              {
                id: 1,
                url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png',
                link: '',
              },
            ],
            imageRightUp: {
              url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png',
              link: '',
            },
            imageRightDown: {
              url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png',
              link: '',
            },
          }
        },
        required: true,
      },
    },
    methods: {
      navigate(data,index) {
        console.log(data)
        // 流量分析埋点
        let params = {
          name:'图片魔方',
          image:data.url || '',
          url:data.link || '',
          type: 8,
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
        // window.location.href = data.link
      },
    },
  }
</script>

<style scoped lang="less">
  .cube_image {
    box-sizing: border-box;
    padding: 0.4rem;
    border-radius: 0.4rem;
    display: flex;
    margin: 0 0.48rem;
    .item {
      flex: 1;
    }
    .item_1 {
      margin-right: 0.2rem;
      .my-swipe {
        width: 6.52rem;
      }
      img {
        display: block;
        width: 6.52rem;
        height: 9.4rem;
        border-radius: 0.4rem;
      }
    }
    .item_2 {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      .up {
        margin-bottom: 0.2rem;
      }
      .item_img {
        flex: 1;
        img {
          display: block;
          width: 100%;
          height: 4.6rem;
          border-radius: 0.4rem;
        }
      }
    }
  }
</style>
