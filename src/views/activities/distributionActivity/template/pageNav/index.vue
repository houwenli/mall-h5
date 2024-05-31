<template>
  <!-- 页面导航 -->
  <div class="clearfix index_nav">
    <van-swipe class="my-nav-swipe" indicator-color="#FD302C">
      <van-swipe-item v-for="(item,index) in getListData" :key="index">
        <div class="nav-wrapper">
          <div class="nav-item" v-for="(advert, childIndex) in item" :key="advert.id" @click="navigate(advert,childIndex)">
            <img v-if="advert.url" :src="advert.url" />
            <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
            <p :style="{ color: listData.textColor }">{{ advert.btnText }}</p>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
import { Swipe, SwipeItem } from 'vant'
import Cookies from 'js-cookie'
export default {
  props: {
    listData: {
      type: Object,
      default: () => {
        return {
          textColor:'',
          sildeshowList: [
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
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  computed: {
    getListData() {
      const arr = this.listData.sildeshowList
      return this.getTwoGroup(arr, 10)
    }
  },
  data() {
    return {
    }
  },
  methods: {
    navigate(data, index) {
      console.log(data)
      // 流量分析埋点
      let params = {
        name: '页面导航',
        image: data.url || '',
        url: data.link || '',
        index,
        type: 2,
        channel_source: Cookies.get('_wsf_role')
      }
      this.$store.dispatch('BURIED_POINT/advertVisitRequest', params)
      if (!data || !data.link) return
      let isLivePage = data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
      if (isLivePage) {
        toMiniAppDistribution(data.link)
      } else {
        routerPathName(data.link)
      }
    },
    getTwoGroup(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    }
  },
}
</script>

<style scoped lang="less">
  
.index_nav {
  position: relative;
  // top: -16px;
  margin-top: -16px;
  margin-bottom: 8px;
}
.my-nav-swipe {
  background: #fff;
  border-radius: 16px 16px 0 0;
  /deep/ .van-swipe__indicators {
    bottom: 2px;
    .van-swipe__indicator {
      width: 12px;
      height: 3px;
      border-radius: 3px; 
      background: #DDDDDD;
    }
    .van-swipe__indicator:not(:last-child) {
      margin-right: 0;
    }
  }
}
.nav-wrapper {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 16px 14px 0;
  .nav-item {
    width: 20%;
    padding: 0 10px;
    margin-bottom: 16px;
    > img {
      width: 50px;
      height: 50px;
      margin-bottom: 6px;
      border-radius: 50%;
    }
    > p {
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      width: 100%; /*需要配合宽度来使用*/
      display: block !important;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
    }
  }
}
</style>
