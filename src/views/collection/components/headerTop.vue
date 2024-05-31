<template>
  <div id="headerwrapper" class="headerwrapper defaultimg">
    <header class="headerbox">
      <goods-search ref="headerNav" :shareflag="shareflag" @toIndex="toIndex" @toBack="toBack"></goods-search>
    </header>
    <header id="headerbox" class="headerbox headerbox-tab">
      <group class="search-group">
        <tab v-model="tabIndex" custom-bar-width="2.4rem" class="header-tabBar">
          <tab-item @click.native="toPage">
            <span class="header-tabBar-item">
              商品
            </span>
          </tab-item>
          <tab-item @click.native="toPage">
            <span class="header-tabBar-item">
              详情
            </span>
          </tab-item>
          <tab-item @click.native="toPage">
            <span class="header-tabBar-item">
              评价
            </span>
          </tab-item>
          <tab-item @click.native="toPage">
            <span class="header-tabBar-item">
              优选
            </span>
          </tab-item>
        </tab>
      </group>
    </header>
  </div>
</template>

<script>
  import { Group, Tab, TabItem } from 'vux'
  import goodsSearch from '@/components/index/template/header/goodsSearch.vue'
  import { getUsersource } from '@/utils/utils'
  import { getToken } from '@/utils/token'
  import { smartOpenDeepLink } from '@/utils/hybrid'
  export default {
    components: { Group, Tab, TabItem, goodsSearch },
    data() {
      return {
        tabIndex: 0, // 当前tab的选中  0 商品 1 评价 2 详情 3 推荐
      }
    },
    props: {
      shareflag: {
        type: Boolean,
        default: false,
      },
      // 当前tab的选中  0 商品 1 评价 2 详情 3 推荐
      spuTabIndex: {
        type: Number,
        default: 0,
      },
    },
    watch: {
      spuTabIndex(newVal) {
        this.tabIndex = newVal
      },
    },
    methods: {
      // 顶部tab切换
      toPage() {
        console.log(this.tabIndex, 'spuTabIndex')
        this.$emit('toPage', this.tabIndex)
      },
      toIndex() {
        // 跳转智慧生活首页
        let usersource = getUsersource() //判断那个端
        if (!getToken()) {
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
                path: '/',
              })
              break
            case 11:
              //智慧生活APP
              smartOpenDeepLink('wsf://app/pagehome?tab=home')
              break
            default:
              //其他APP内嵌智慧生活H5
              window.location.href = `${process.env.SMART_PAGE_DOMAIN}/home`
              break
          }
        }
      },
      toBack() {
        // appBack()
        this.$router.go(-1)
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
</style>
