<template>
  <!-- 多列图 -->
  <div class="img_list_box">
    <div class="img_list">
      <div class="image" v-for="(item, index) in listData[row - 1].sildeshowList" :key="index">
        <img v-if="item['url_' + listData[row - 1].radio]" :style="{
            width: '100%',
            height: listData[row - 1].radio / 25 + 'rem',
          }" :src="item['url_' + listData[row - 1].radio]" @click="navigate(item,index)" />
          <img v-else :style="{
            width: '100%',
            height: listData[row - 1].radio / 25 + 'rem',
          }" :src="imageArr[row - 1].sildeshowList[index]['url_' + listData[row - 1].radio]" @click="navigate(item,index)" />
      </div>
    </div>
  </div>
</template>

<script>
// 废弃，已经采用其他实现 src\views\home\components\group-image
import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
import Cookies from 'js-cookie'
export default {
  props: {
    row: {
      type: Number,
      default: 1,
      required: false,
    },
    listData: {
      type: Array,
      default: () => [
        {
          radio: 100,
          sildeshowList: [],
        },
        {
          radio: 100,
          sildeshowList: [],
        },
        {
          radio: 100,
          sildeshowList: [],
        },
        {
          radio: 100,
          sildeshowList: [],
        },
      ],
      required: true,
    },
  },
  data() {
    return {
      imageArr: [
        {
          sildeshowList: [
            {
              id: 'u763419801',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f4ab976c42c8839cd18889776801a6ee.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/16f7e6e4e2f8df712b7ed9b088e9e91b.png',
            },
          ],
        },
        {
          sildeshowList: [
            {
              id: 'u147542210',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/7969652262ea22bd87217d1e834c800c.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/3e04fa9f2e487d701b0a978db89f086d.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/4ff35b4dd400a1a45e79f63c8c777f45.png',
            },
            {
              id: 'u061424050',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/7969652262ea22bd87217d1e834c800c.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/3e04fa9f2e487d701b0a978db89f086d.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/4ff35b4dd400a1a45e79f63c8c777f45.png',
            },
          ],
        },
        {
          sildeshowList: [
            {
              id: 'u230297030',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b2b177e6a991e4d84d14ab3d7e35b95c.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/623b23d7675dca56b719da22291353ad.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/efe1d17d8029ed4b982ed0f0a37dafe7.png',
            },
            {
              id: 'u028196068',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b2b177e6a991e4d84d14ab3d7e35b95c.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/623b23d7675dca56b719da22291353ad.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/efe1d17d8029ed4b982ed0f0a37dafe7.png',
            },
            {
              id: 'u214342952',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b2b177e6a991e4d84d14ab3d7e35b95c.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/623b23d7675dca56b719da22291353ad.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/efe1d17d8029ed4b982ed0f0a37dafe7.png',
            },
          ],
        },
        {
          sildeshowList: [
            {
              id: 'u738913719',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
            },
            {
              id: 'u712080121',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
            },
            {
              id: 'u386134174',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
            },
            {
              id: 'u386155308',
              url_100: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1659aa73068d6a0aab735f4c85a6e255.png',
              url_120: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/175b62346b46cc7aba0be3d900ccc868.png',
              url_140: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/c69e4b4249c65748f9dc5ed4cdb1199b.png',
            },
          ],
        },
      ],
    }
  },
  methods: {
    navigate(data, index) {
      let urlName = '',
        titleArr = ["单列图", "双列图", "三列图", "四列图"],
        type = [3, 4, 5, 6],
        name = 'url_' + this.listData[this.row - 1].radio
      if (data[name]) {
        urlName = data[name]
      } else {
        urlName = this.imageArr[this.row - 1].sildeshowList[index][name]
      }
      // 流量分析埋点
      let params = {
        name: titleArr[this.row - 1],
        image: urlName || '',
        url: data.link || '',
        index,
        type: type[this.row - 1],
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
  },
}
</script>

<style scoped lang="less">
.img_list_box {
  margin: 0 12px;
}
.img_list {
  overflow: hidden;
  width: 100%;
  display: flex;
  .image {
    width: 100%;
    margin-left: 0.2rem;
    img {
      border-radius: 0.4rem;
      display: block;
    }

  }
  .image:first-child {
    margin-left: 0px;
  }
}
</style>
