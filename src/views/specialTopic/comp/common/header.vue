<template>
<div class="fixed">
  <div class="poster-container" >
    <div class="second-box" style="display: flex;">
      <div @click="goBack" class="back-box">
        <i class="backimg"></i>
      </div>
      <van-popover v-model="showRankPopover" trigger="click" :actions="actions" @select="handleSelect" placement="bottom">
        <template #reference>
          <div class="gengduo-box">
            <i class="backimg"></i>
          </div>
        </template>
      </van-popover>
    </div>
    <div class="title">{{ pageTitle || '更多好物，等你挑选' }}</div>
    <div class="box-fill"></div>
  </div>
</div>
</template>

<script>
  import { getToken } from '@/utils/token'
  import { appBack } from '@/utils/utils'
  import { getQueryString, getUsersource } from '@/utils/utils'
  import { smartOpenDeepLink } from '@/utils/hybrid'
  export default {
    props: {
        pageTitle: {
            type: String,
            default: '更多好物，等你挑选'
        }
    },

    data() {
      return {
        isAppEnter: 0,
        // 顶部title区域
        actions: [
          {
            text: '首页',
            icon: require('@/assets/img/goodsDetail/index.png'),
            urls: {
              h5: '',
              smartH5: 'home',
              smartApp: 'home',
            },
          },
          {
            text: '购物车',
            icon: require('@/assets/img/goodsDetail/cart.png'),
            urls: {
              h5: 'cart',
              smartH5: 'shopCart',
              smartApp: 'shopcart',
            },
          },
          {
            text: '个人中心',
            icon: require('@/assets/img/goodsDetail/home.png'),
            urls: {
              h5: 'home',
              smartH5: 'my',
              smartApp: 'mine',
            },
          },
        ],
        showRankPopover: false,
        isLogin: getToken() ? getToken() : false, // 判断是否登录
      }
    },

    created() {
      // 获取专题id
      this.id = getQueryString('id') || ''

      // isAppEnter判断是否是从APP进入 是为1 否则为0
      this.isAppEnter = getQueryString('isAppEnter') || 0
    },

    methods: {
      //返回
      goBack() {
        //isAppEnter参数判断是否是从APP进入
        //从APP弹框或者占位广告进入时 点击返回 返回APP首页
        // if (this.isAppEnter) {
        //   if (window.ws) {
        //     // android环境
        //     window.ws.finishActivity()
        //   } else if (window.webkit) {
        //     // ios环境
        //     window.webkit.messageHandlers.finishActivity.postMessage('')
        //   }
        //   //万顺福商城 或者H5进入时  点击返回 返回万顺福商城首页
        // } else {
        //   appBack(this)
        // }
        appBack(this)
      },
      handleSelect(action) {
        let usersource = getUsersource() //判断那个端
        if (!this.isLogin) {
          //未登录
          if (usersource == 11) {
            //智慧生活APP
            smartOpenDeepLink('wsf://app/login')
          } else {
            this.$router.push({ path: '/login', query: { url: `${location.pathname + location.search}` } })
            return
          }
        } else {
          switch (usersource) {
            case 4:
              //电商H5
              this.$router.push({
                path: `/${action.urls.h5}`,
              })
              break
            case 11:
              //智慧生活APP
              smartOpenDeepLink(`wsf://app/pagehome?tab=${action.urls.smartApp}`)
              break
            default:
              //其他APP内嵌智慧生活H5
              window.location.href = `${process.env.SMART_PAGE_DOMAIN}/${action.urls.smartH5}`
              break
          }
        }
      },	
    },
  }
</script>

<style lang="less" scoped>
.fixed {
  position:fixed;
  background:#fff;
  top: 0;
  width: 100%;
  z-index: 10;
}
  .poster-container,
  .fixed-header {
    width: 100%;
    padding: 6px 12px;
    display: flex;
    .second-box {
      display: flex;
      align-items: center;
    }
    .back-box {
      margin-right: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid rgba(151, 151, 151, 0.2);
      background: rgba(255, 255, 255, 0.9);
      .backimg {
        display: block;
        background: url('~@/assets/img/goodsDetail/left_arrow.png') no-repeat center center;
        background-size: 100%;
        width: 16px;
        height: 16px;
      }
    }
    .gengduo-box {
      margin-right: 12px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      border: 1px solid rgba(151, 151, 151, 0.2);
      .backimg {
        display: block;
        background: url('~@/assets/img/goodsDetail/more.png') no-repeat center center;
        background-size: 100%;
        width: 16px;
        height: 16px;
      }
    }
    .title {
      text-align: center;
      color: #000;
      font-size: 18px;
      height: 32px;
      line-height: 32px;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .box-fill {
      width: 84px;
      flex-shrink: 0;
    }
  }
</style>
