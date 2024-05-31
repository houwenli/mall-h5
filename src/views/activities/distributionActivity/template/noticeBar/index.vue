<template>
  <div class="notice_bar"
  :style="{
    'background-color': listData.bgColor,
      'background-image': 'url(' + listData.bgImage + ')',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'background-position': 'center',
  }">
      <van-notice-bar :speed='40' :left-icon='listData.proclamationIcon?listData.proclamationIcon:"https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f82bdd6e54e60521019fef5b028df1f7.png"' :color="listData.textareaColor" scrollable :text="listData.textarea" />
      <div class="img_link" @click="navigate(listData)">
          <img v-if="listData.linkImage" :src="listData.linkImage">
          <img v-else style="width:5px;height: 11px" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/030b60269aa6ce13b8bf3a53a7e4a0d0.png" />
      </div>
    </div>
</template>

<script>
  import { NoticeBar } from 'vant'
  import {routerPathName,toMiniAppDistribution} from '@/utils/utils'
  export default {
    components: {
      [NoticeBar.name]: NoticeBar,
    },
    props: {
        listData: {
        type: Object,
        default: () => {
        return {
            radio: 1,
            proclamationIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f82bdd6e54e60521019fef5b028df1f7.png',
            bgColor: '#fff',
            bgImage: '',
            textarea: '公告 / 通知栏, 内容过长时向左滚动显示 公告 / 通知栏, 内容过长时向左滚动显示 公告 / 通知栏, 内容过长时向左滚动显示',
            textareaColor: '#000000',
            linkImage: '',
            link: '',
        }
        },
        required: true
    }
  },
    methods: {
        navigate(data) {
          if(!data || !data.link) return
          let isLivePage = data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
          if(isLivePage){
            toMiniAppDistribution(data.link)
          }else{
            routerPathName(data.link)
          }
        },
    },
  }
</script>

<style scoped lang='less'>
.notice_bar {
    background-color: #fff;
    border-radius: .4rem;
    margin: 0 .48rem;
    display: flex;
    align-items: center;
    /deep/ .van-notice-bar {
        flex: 1;
        padding: 0;
        padding-left: .4rem;
        background-color: rgba(0,0,0,0);
    }
    /deep/ .van-icon__image {
        width: .88rem;
        height: .88rem;
    }
    .img_link {
        margin-right: .4rem;
        margin-left: .2rem;
        img {
            display: block;
            width: .88rem;
            height: .88rem;
        }
    }
}
</style>
