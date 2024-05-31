<template>
  <div class="boxwrapper" ref="backTop" :class="[returntop ? 'backtopactive' : '']">
    <div class="order-header">
      <!-- header -->
      <header class="headerbox">
        <goods-search ref="headerNav" :showSearch="false" @toBack="back"></goods-search>
        <h2 class="headerbox-title">我的订单</h2>
      </header>

      <div class="searchwrapper">
        <div class="searchbox">
          <input type="text" class="searchinput" v-model="listQuery.queryString" placeholder="搜索我的订单" @click="goToSearch(listQuery.queryString)" />
        </div>
      </div>
      <!-- tabs -->
      <div class="orderwrapper">
        <van-tabs v-model="listQuery.status" @click="tabsActive(listQuery.status)" animated>
          <van-tab v-for="(item, i) in listData" :key="i" :title="item.title" :name="item.name">
            <template #title>
              <van-badge :content="orderMessageCount[item.badgeKey] || null" max="99" :color="orderMessageCount[item.badgeKey] | badgeFilter">
                {{ item.title }}
              </van-badge>
            </template>
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <div class="order-content">
      <!-- 轮播 -->
      <swipe v-if="swipeConfig && swipeConfig.list && swipeConfig.list.length > 0" :config="swipeConfig"></swipe>
      <loadding-page v-if="pageList.length == 0 && !upFinished"></loadding-page>
      <!-- 订单列表 -->
      <!-- 无列表数据 -->
      <div class="nodatabox" v-if="pageList.length == 0 && upFinished">
        <img :src="`${$oss}/order/history_no.png`" alt="" />
        <p>您还没有相关订单～</p>
      </div>

      <div v-if="pageList.length > 0">
        <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" :disabled="true">
          <van-list v-model="isUpLoading" :finished="upFinished" :offset="100" :immediate-check="false" finished-text="我也是有底线的～" @load="onLoadList">
            <order-list-item v-for="(temp, index) in pageList" :key="index" :orderItem="temp" @orderOperation="orderOperation"></order-list-item>
          </van-list>
        </van-pull-refresh>
      </div>

      <!-- 热销商品 -->
      <div class="xq_wntj" v-if="upFinished">
        <shopList :title="'热销商品'" :titleImg="true" :botTip="'见底啦~不如去'"></shopList>
      </div>
    </div>

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop" @click="backtop">
      <img src="@/assets/img/goodsDetail/go_top.png" alt />
      <span>顶部</span>
    </div>

    <orderSecondConfirm ref="orderSecondConfirm" @confirmResearch="confirmResearch"></orderSecondConfirm>
  </div>
</template>

<script>
  import { Button, Toast, Field, Popup, Tab, Tabs, List, PullRefresh, Badge } from 'vant'
  import goodsSearch from '@/components/index/template/header/goodsSearch.vue'
  import swipe from '@/components/index/template/swipe/index.vue'
  import orderListItem from './components/orderListItem.vue'
  import loaddingPage from '@/components/order/components/loaddingPage'
  import orderSecondConfirm from '@/components/order/components/orderSecondConfirm'
  import { formatPrice } from '@/utils/utils'
  import { queryOrderList } from '@/api/orderlist'
  import { queryOrderMessageCount, queryPersonConfigTemp } from '@/api/home'
  import shopList from '@/components/commons/shopList'
  export default {
    components: {
      shopList,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
      [Badge.name]: Badge,
      goodsSearch,
      swipe,
      orderListItem,
      loaddingPage,
      orderSecondConfirm
    },
    filters: {
      badgeFilter(val) {
        if (val < 10) {
          return 'url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge1.png)'
        } else if (val < 100) {
          return 'url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge2.png)'
        } else {
          return 'url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge3.png)'
        }
      },
    },
    data() {
      return {
        listData: [
          { title: '全部', name: '-1' },
          { title: '待付款', name: '1', badgeKey: 'toPayCount' },
          { title: '待收货', name: '2', badgeKey: 'toReceiptAndDeliverCount' },
          { title: '待评价', name: '5', badgeKey: 'toEvaluateCount' },
        ],
        isDownLoading: false, //  否处于加载状态
        isUpLoading: true, //  否处于加载状态
        upFinished: false, //  	是否已加载完成
        isshowtop: false, // 回到顶部
        returntop: false, // 返回顶部
        orderid: '', // 订单id

        formatPrice: formatPrice, // 格式化金额
        listQuery: {
          status: this.$route.query.status, // 查询状态 -1 全部 1 待付款 2 待发货 3 待收货 6 待评价
          queryString: '', // 查询字段, 支持订单号（全词匹配）和商品名（模糊查询)
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        _done: null, //分页控件
        titleMap: { '-1': '全部订单', 1: '待付款订单', 2: '待发货订单', 3: '待收货订单', 6: '待评价订单' }, // 页面标题
        orderType: { 1: '预售', 2: '预售', 3: '拼团', 4: '众筹', 5: '众筹', 6: '众筹', 7: '虚拟', 8: '社区团购' }, // 订单类型
        swipeConfig: null, // 轮播
        orderMessageCount: {}, // 表头数量
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.getData()
      this.queryOrderMessageCount()

      this.queryPersonConfigTemp()
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
    },
    watch: {
      isshowtop(value) {
        if (!value) this.returntop = false
      },
    },
    methods: {
      // 查询轮播配置
      queryPersonConfigTemp() {
        queryPersonConfigTemp(104).then((res) => {
          if (res.code == 200) {
            let swipeConfigswipeConfig = JSON.parse(res.data.content) || {}
            this.swipeConfig = swipeConfigswipeConfig.contentList[0] || null

            // 过滤掉没有图片的轮播
            if (this.swipeConfig && this.swipeConfig.list && this.swipeConfig.list.length > 0) {
              this.swipeConfig.list = this.swipeConfig.list.filter((item) => {
                return item.url
              })
            }
          }
        })
      },

      // 查询订单统计
      queryOrderMessageCount() {
        queryOrderMessageCount().then((res) => {
          this.orderMessageCount = res
        })
      },

      goToSearch() {
        this.$router.push({
          path: '/orderSearch',
        })
      },

      // 确认收货
      async orderOperation(data, text) {
        this.$refs.orderSecondConfirm.orderOperation(data, text)
      },

      // 确认收货删除二次确认弹窗后执行方法
      confirmResearch() {
        this.pageList = []
        this.listQuery.pageNum = 0
        this.getData()
        this.queryOrderMessageCount()
      },

      // 监听滚动
      handleScroll() {
        if (!this.$refs.backTop) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop) // 取绝对值
        // console.log('滚动了', scorllTop)
        if (scorllTop >= 2500) this.isshowtop = true
        else this.isshowtop = false
      },
      // 回到顶部
      backtop() {
        if (this.isshowtop) this.returntop = true
        else this.returntop = false
      },
      // 滚动条与底部距离小于 offset 时触发
      onLoadList() {
        this.listQuery.pageNum++
        this.getData()
      },
      // 上下拉操作
      onDownRefresh() {
        console.log('上拉111')
        this.listQuery.pageNum = 0
        this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
        // this.isDownLoading = false
        this.isUpLoading = false
        // this.isDownLoading = true
        this.getData() // 加载数据
      },
      // 切换tabs
      tabsActive(data) {
        this.isDownLoading = false //  否处于加载状态
        this.isUpLoading = true //  否处于加载状态
        this.upFinished = false //  是否已加载完成
        this.listQuery.pageNum = 0
        this.listQuery.status = data
        this.pageList = []
        this.getData()
      },
      // 返回
      back() {
        this.$router.push('/home')
      },
      //获取数据
      getData() {
        let _self = this
        setTimeout(
          () => {
            queryOrderList(this.listQuery).then((res) => {
              if (res.code == 200) {
                _self.loading = false //数据请成功后
                _self.isUpLoading = false
                _self.isDownLoading = false

                let list = res.data.list || []
                // let list = res.data;
                if (list == null || list.length === 0) {
                  // 加载结束
                  _self.upFinished = true
                }
                if (list.length < _self.listQuery.pageSize) {
                  // 最后一页不足10条的情况
                  _self.upFinished = true
                }
                if (_self.listQuery.pageNum === 0) {
                  _self.pageList = list
                } else {
                  _self.pageList = _self.pageList.concat(list)
                }
              }
            })
          },
          _self.isDownLoading ? 600 : 0
        )
      },

      // 刷新列表
      refreshData() {
        this.listQuery.pageNum = 0
        this.pageList = []
        this.noMore = false
        this._done()
      },
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll, true)
    },
  }
</script>

<style lang="less" scoped>
  .boxwrapper {
    // overflow:auto;
    -webkit-overflow-scrolling: touch;
    .order-header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 999;
    }
    .order-content {
      padding-top: 120px;
      /deep/ .swipe {
        margin-left: 8px;
        margin-right: 8px;
        img {
          border-radius: 12px;
        }
      }
      /deep/ .van-list__finished-text {
        font-size: 11px;
        color: #c3c3c3;
      }
    }
    .searchwrapper {
      padding: 0 12px 6px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      .searchbox {
        width: 100%;
        position: relative;
        .searchinput {
          width: 100%;
          height: 32px;
          line-height: 32px;
          padding-left: 32px;
          border-radius: 19px;
          background: url('https://wsjc-web.wsecar.com/wsf-mall/home/search.png') no-repeat 8px center;
          background-size: 16px;
          background-color: #f2f2f2;
        }
        input::-webkit-input-placeholder {
          color: #c6c6cc !important;
          font-size: 14px;
        }
        input::-moz-placeholder {
          color: #c6c6cc !important;
          font-size: 14px;
        }
        input::-moz-placeholder {
          color: #c6c6cc !important;
          font-size: 14px;
        }
        input::-ms-input-placeholder {
          color: #c6c6cc !important;
          font-size: 14px;
        }
      }
    }
    .orderwrapper {
      // padding-top: 1.76rem;
      z-index: 666;
      /deep/ .van-tab {
        padding-top: 7px;
        align-items: flex-start;
        line-height: 17px;
        .van-tab__text--ellipsis {
          overflow: visible;
        }
        .van-badge {
          min-width: auto;
          top: 2px;
          display: flex;
          height: 14px;
          line-height: 1;
          align-items: center;
          line-height: normal;
          padding: 0 5px;
          font-size: 8px;
          transform: translate(80%, -50%);
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/badge_bg.png') no-repeat;
          background-size: 100% 100% !important;
          border-radius: 0;
          background-color: transparent;
          border: 0;
        }
      }
      /deep/ .van-tabs__nav--line {
        padding-bottom: 0;
      }
      /deep/ .van-tabs--line .van-tabs__wrap {
        height: 38px;
        line-height: 38px;
        z-index: 666;
        // overflow: unset;
      }
      /deep/ .van-tabs__line {
        width: 26px;
        background-image: linear-gradient(#ff5f2e, #ff0a35);
        bottom: 7px;
        height: 4px;
        border-radius: 2px;
      }
      /deep/ .van-tab {
        font-size: 13px;
        color: #000;
      }
      /deep/ .van-tab--active {
        font-weight: bold;
      }
    }
    .swipe {
      margin-top: 10px;
    }
    .nodatabox {
      margin-top: 32px;
      margin-bottom: 52px;
      text-align: center;
      img {
        width: 160px;
        height: 160px;
        margin-bottom: 8px;
      }
      p {
        color: #444444;
        font-size: 13px;
      }
    }
    .xq_wntj {
      padding: 0 12px;
    }
    .returntopBox {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: fixed;
      bottom: 88px;
      right: 12px;
      width: 40px;
      height: 40px;
      z-index: 999;
      opacity: 0.8;
      background: #191919;
      border-radius: 20px;
      > img {
        width: 14px;
        height: 18px;
      }
      span {
        font-size: 11px;
        font-weight: 400;
        color: #fff;
      }
    }
    .headerbox {
      height: 44px;
      display: flex;
      align-items: center;
      background-color: #fff;
      .search {
        width: auto;
      }
      .headerbox-title {
        flex: 1;
        margin-right: 108px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        line-height: 22px;
        text-align: center;
      }
    }
  }
  .backtopactive {
    position: fixed;
    top: 0;
  }
</style>
