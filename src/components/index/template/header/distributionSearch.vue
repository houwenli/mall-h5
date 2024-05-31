<template>
  <div :class="showLogo?'search':'search'">
    <!-- !(headerData&&headerData.iconMassageUrl) -->
    <div class="search_box" :class="{'isIndex':showLogo,'no_search_icon':true}">
      <div :class="showLogo?'search_input no_search':'search_input'" @click="toSearch">
        <img src="https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/orgManager/5/file_YTiqd.png" style="width: 16px; margin-left: 0.07rem" />
        <div style="color: #999999; margin-left: 0.24rem; font-size: 0.56rem">请输入搜索内容</div>
         <span class="search-text">搜索</span>
      </div>
      <!-- <div v-if="headerData&&headerData.iconMassageUrl" class="search_icon" @click="toMyNews">
        <van-badge  :dot="unreadMessageNum>0">
          <img :src="headerData.iconMassageUrl">
        </van-badge>
      </div> -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { queryNewsReadNums } from '@/api/mynews'
import { getToken } from '@/utils/token'
import { Badge } from 'vant';
export default {
  components: {
    [Badge.name]: Badge
  },
  props: {
    // 目前根据这个属性判断是不是首页的搜索
    showLogo: {
      type: Boolean,
      default: true
    },
    bgColorIndex: {
      type: String,
      default: '0'
    },
    isInTop:{
      type: Boolean,
      default: true
    },
    headerData:{
      type: [Object,String],
      default: ()=>{}
    }
  },
  computed: {
    // ...mapGetters(['headerData']),
    bgStyle() {
      if(this.showLogo) {
        return {
          'background': this.headerData.slideshowImageList && this.headerData.slideshowImageList[this.bgColorIndex].bgColor
        }
      } else{
        return {}
      }
      
    }
  },
  data() {
    return {
      unreadMessageNum: 0,
      showPopover: false
    }
  },
  mounted() {
    // let { passengerId } = this.$store.getters.userInfo
    // console.log(passengerId,"passengerId")
    if (getToken()) {
      this.unreadMessage()
    }
    if (!localStorage.getItem('isClose') || localStorage.getItem('isClose') != 2) {
      setTimeout(() => {
        if (this.showLogo) this.showPopover = true
      }, 1500)
    }
  },
  beforeRouteLeave(to, from, next) {
    // ...
  },
  methods: {
    // 是否为首次进入
    // getflag() {

    // },
    unreadMessage() {
      queryNewsReadNums().then(res => {
        if (res.code === 200) {
          this.unreadMessageNum = res.data.reduce((total, item) => {
            return total + (item.receiverType == 2 ? item.count : 0)
          }, 0)
        }
      })
    },
    onSelect() {

    },
    closePopover() {
      this.showPopover = false
      localStorage.setItem('isClose', 2)
    },
    // 跳转到搜索页面
    toSearch() {
       this.$router.push({
              path: '/shopSearch',
              query: {
                  path: '/spulist',
                  from: '/distributionActivity',
                  promoteInfo:this.$route.query.promoteInfo
              }
          });
    },
    // 跳转到我的消息页面
    toMyNews() {
      // fromFlag 跳转标记，1 从首页跳转 2 从个人中心跳转
      this.$router.push({ path: '/mynews', query: { fromFlag: '1' } })
    },
    // 根据条件返回万顺叫车app或者去到下载页
    toNext() {
      // let userSource = this.$store.getters.getUserSource
      // console.log(userSource, 'userSource')
      // if (userSource && userSource != 3) {  //返回app
        if (window.ws) {
          // android环境
          window.ws.finishActivity();
        } else if (window.webkit) {
          // ios环境
          window.webkit.messageHandlers.finishActivity.postMessage('');
        }
      // } else if (userSource && userSource == 3) { //自主登录
      //   window.location.href = "https://s.wsecar.com/p/uRLj"
      // }
    }
  },
}
</script>

<style scoped lang="less">
.search {
  width: 100%;
  // height: 4.8rem;
  box-sizing: border-box;
  .top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    .left,
    .right {
      width: 20px;
      height: 20px;
    }
    .center {
      width: 48px;
    }
  }
  &.nologoSerach {
    width: 100%;
  }
  > p {
    text-align: center;
  }
        .search-text {
          color: #333;
          font-size: 12px;
          padding-left: 8px;
          font-weight: bold;
          position: relative;
          margin-left: 130px;
          &::after {
            content: '';
            width: 1px;
            height: 15px;
            position: absolute;
            background: #999;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
    .no_search_icon{
      padding: 0.40rem 0 0.40rem 0.40rem;
      .search_input{
        width: 335px !important;
      }
      .search-text{
        margin-left: 145px;
      }
    }
  .search_box {
    z-index: 3;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    position: relative;
    &.isIndex {
      // padding: 0 12px;
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: auto;
      .index_search_box {
        display: flex;
        height: 32px;
        width: 100%;
        background: #fff;
        border-radius: 16px;
        // justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        position: relative;
        // top: 16px;
        transition: 0.2s all;
        &.isNotInTop {
          margin-bottom: 28px;
        }
        .left-icon {
          display: flex;
          align-items: center;
          > img {
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
          > span {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }

    .search_input {
      width: 317px;
      height: 32px;
      background: #fff;
      border-radius: 16px;
      padding-left: 0.6rem;
      margin-left: 0.48rem;
      display: flex;
      align-items: center;
      &.no_search {
        margin-left: 12px;
      }
      .search_logo {
        height: 0.72rem;
        display: flex;
        align-items: center;
        padding-right: 0.6rem;
        border-right: 0.04rem solid #d8d8d8;
      }
      .search_popover {
        padding: 10px;
      }
    }
    .search_icon {
      width: 24px;
      height: 24px;
      line-height: 24px;
      margin: 0.40rem 0 0.40rem 0.40rem;
      display: flex;
      background-size: cover;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .no_search_icon{
      margin: 0.40rem 0 0.40rem 0.40rem;
    }
  }
}
</style>
