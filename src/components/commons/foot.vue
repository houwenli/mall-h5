<template>
  <!-- 底部tab -->
  <div class="footer_position" id="footer-position-fixed" data-desc='底部导航栏'>
    <div :class="[phoneType==='IOS' ? 'is_ios' : 'is_other', 'footer']">
      <div
        class="footer_bg_image"
        :style="getFooterBgStyle"
      ></div>
      <div class="tab_item" @click="tabChange(item, index)" v-for="(item, index) in tabList" :key="index">
        <div class="image">
          <img v-show="gifIconShow(item)" :src="item.gifIcon?item.gifIcon:item.defaultIcon" alt="">
          <img v-show="IconShow(item)" :src="title == item.title ? item.activeIcon : item.defaultIcon" />
        </div>
        <div :style="{ fontSize: '.4rem', color: title == item.title ? tabData.activeColor : tabData.color }">{{ item.title }}</div>
      </div>
    </div>

    <!-- 预加载tab的所有图片，保证切换图片流程加载 -->
    <div v-show='false'>
      <img :src="item" alt="" v-for='(item, index) in picList' :key='index'>
    </div>
  </div>
</template>

<script>
  import { mapGetters,mapState } from 'vuex'
  export default {
    name: 'tabbar',
    props: {
      title: {
        type: String,
        default: '首页',
      }
    },
    data() {
      return {
        gifLateImage: false
      }
    },
    computed: {
      ...mapState({
        gifTime: (state) => state.HOME_PAGE_CONFIG.gifTime
      }),
      ...mapGetters(['phoneType','tabData']),
      // tabData处理一下，去除掉分享购tab，20240104，产品需求：商品下架 非福气值商品 
      tabList() {
        let { tabList = [] } = this.tabData || {};
        // tabList = tabList.filter(item => item.title !== '分享购')

        return tabList
      },

      getFooterBgStyle() {
        let style = {
          opacity: this.tabData.opacity
        }

        if(this.tabData.bgColor) {
          style.background = this.tabData.bgColor
        } else {
          style.backgroundImage = `url(${this.tabData.bgImage})`
        }

        return style
      },

      picList() {
        let arr = []
        let tabConfig = this.tabData || {}

        let tabList = tabConfig.tabList || []

        tabList.forEach(item => {
          if (item.activeIcon) arr.push(item.activeIcon)

          if (item.defaultIcon) arr.push(item.defaultIcon)

          if (item.gifIcon) arr.push(item.gifIcon)

          return item
        })

        return arr
      }
    },

    methods: {
      gifIconShow(item){
        let isShow = this.gifTime && this.title == item.title && item.gifIcon
        return isShow
      },
      IconShow(item){
        let isShow = this.gifTime && this.title == item.title && item.gifIcon
        return !isShow
      },
      // 底部tab点击事件
      tabChange(item, index) {
        // 避免重复点击
//         let active =  sessionStorage.getItem("activeIndex") || 0
//         if (+active === +index) {
//           return
//         }
//         sessionStorage.setItem("activeIndex", index)
// 
//         this.$store.commit('HOME_PAGE_CONFIG/updataTabData', false)
// 
//         switch (item.title) {
//           case '首页':
//             this.$emit('tabChange',0)
//             this.$router.push('/')
//             break
//           case '分类':
//             this.$router.push('/classify')
//             break
//           case '分享购':
//           this.$router.push('/distributionActivity')
//             break
//           case '购物车':
//             this.$router.push('/cart')
//             break
//           case '我的':
//             this.$router.push('/home')
//             break
//           default:
//             this.$router.push('/')
//             break
//         }

          let pathMap = new Map([['首页', '/'],['分类', '/classify'], ['分享购', '/distributionActivity'], ['购物车', '/cart'], ['我的', 'home']])

          let path = pathMap.get(item.title) || '/'

          if(this.$route.path === path) {
            this.$emit('tabChange', 0)
            return false
          }

          this.$router.push(path)


      },
    },
  }
</script>
<style lang="less" scoped>
  * {  
    -webkit-touch-callout:none;  
    -webkit-user-select:none;  
    -khtml-user-select:none;  
    -moz-user-select:none;  
    -ms-user-select:none;  
    user-select:none;
  }
  .is_ios {
    height: 80px;
    padding-bottom: 40px;
  }
  .is_other {
    height: 50px;
    padding-bottom: 0.2rem;
  }
  .footer_position {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background-color: #fff;
    // z-index: 9;
    z-index: 2;
    .footer {
      width: 100vw;
      height: 50px;
      box-sizing: border-box;
      padding: 0.2rem 0rem 0.2rem 0rem;
      display: flex;
      justify-content: space-between;
      // border-top: 1px solid #f2f2f2;
      position: relative;
      .footer_bg_image {
        z-index: -1;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
      .tab_item {
        width: 100%;
        text-align: center;
        .image {
          display: flex;
          justify-content: center;
          height: 0.96rem;
          img {
            display: block;
            width: 0.96rem;
            height: 0.96rem;
          }
        }
      }
    }
  }
</style>
