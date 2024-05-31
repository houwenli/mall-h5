<template>
  <div data-desc='公告' class="notice_bar"
  :style="{
    'background-color': listData.bgColor,
      'background-image': 'url(' + listData.bgImage + ')',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'background-position': 'center',

  }">
      <van-notice-bar :speed='40' :left-icon='listData.iconUrl?listData.iconUrl:defaultUrl' :color="listData.color" scrollable :text="listData.textarea" />
      <div class="img_link" @click="navigate(listData)" v-if="listData.link">
          <img v-if="listData.linkImage" :src="listData.linkImage">
          <img v-else style="width:16px; height:16px" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/arraw_red.png" />
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
    data(){
      return{
        defaultUrl:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/notice.png'
      }
    },
    props: {
        listData: {
        type: Object,
        default: () => {
        return {
            radio: 1,
            iconUrl: this.defaultUrl,
            bgColor: '#fff',
            bgImage: '',
            textarea: '',
            color: '#000000',
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
    border-radius: 8px;
    margin: 0 .48rem;
    display: flex;
    align-items: center;
    height: 30px;
    font-size: 13px;
    /deep/ .van-notice-bar {
        flex: 1;
        padding: 0;
        // padding-left: .4rem;
        background-color: rgba(0,0,0,0);
    }
    /deep/ .van-icon__image {
        width: 30px;
        height: 30px;
        margin-right: 8px;
    }
    /deep/ .van-notice-bar__wrap{
        height: 30px;
    }
    .img_link {
        margin-right: 8px;
        margin-left: 8px;
        img {
            display: block;
            width: 16px;
            height: 16px;
        }
    }
	/deep/ .van-notice-bar__wrap{
		height: 30px;
	}
}
</style>
