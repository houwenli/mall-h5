<template>
  <div class="distribution-page">
    <!-- <configuration></configuration> -->
    <configurationUI3></configurationUI3>
    <div class="tabs distribuFoot" v-if="!isSharedPage">
      <foot ref="footRef" title="分享购" />
    </div>
  </div>
</template>

<script>
  // import commodityList from './components/commodityList.vue'
  // import configuration from './components/configuration.vue'
  import configurationUI3 from './components/configurationUI3.vue'
  import foot from '@/components/commons/foot'
  export default {
    components: {
      // commodityList,
      // configuration,
      configurationUI3,
      foot,
    },
    data() {
      return {
        listName: [
          {
            name: '商品列表',
            id: 0,
            component: 'commodityList',
          },
          {
            name: '分销订单',
            id: 1,
            component: 'distrOrder',
          },
        ],
        isSharedPage: !!this.$route.query.promoteInfo || !!this.$route.query.deepLink,
        curScrollTop: 0,
      }
    },
    activated() {
      // 获取上次滚动条位置
      this.$nextTick(() => {
        if (this.curScrollTop != 0) {
          document.documentElement.scrollTo(0, this.curScrollTop)
          document.body.scrollTop = this.curScrollTop
        }
      })

      this.isSharedPage = !!this.$route.query.promoteInfo || !!this.$route.query.deepLink
    },
    beforeRouteLeave(to, from, next) {
      // 记录滚动条位置

      // document.documentElement.scrollTop || document.body.scrollTop
      this.curScrollTop = document.documentElement.scrollTop || document.body.scrollTop
      next()
    },
    methods: {
      getEleDom(domAttr) {
        return document.querySelector(domAttr)
      },
    },
  }
</script>

<style lang="less" scoped>
  .distribution-page {
    background: #f5f6fa;
    min-height: 100%;
    // // height: 100%;
    // display: flex;
    // flex-direction: column;
  }
</style>
