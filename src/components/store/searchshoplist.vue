<template>
  <div style="height: 100%">

    <group class="search-group">
      <div class="search-left-arrow" @click="toBack"></div>
      <x-input ref="search" v-model="listQuery.keyword" placeholder="请输入搜索关键字" class="search-input"
               style="margin-left: 0" @click.native="toSearch">
        <i class="weui-icon-search" slot="label" style="padding-right:10px;display:block;"></i>
      </x-input>
    </group>

    <div style="padding-top: 50px; position: relative; z-index: 2">
      <tab v-model="navTabValue">
        <tab-item @on-item-click="changeTable">综合排序</tab-item>
        <tab-item @on-item-click="changeTable">销量优先</tab-item>
        <tab-item @on-item-click="changeTable">评论数</tab-item>
      </tab>
    </div>

    <scroller
      :on-infinite="infinite"
      ref="scroller"
      :class="{scrollerNoData : pageList.length === 0}"
    >
      <div style="padding-top: 94px">
        <div v-for="storeInfo in pageList" class="shop-item">
          <div class="shop-top">
            <ul>
              <li>{{ storeInfo.storeName }}</li>
              <li>销量{{ storeInfo.saleCount }}&nbsp;&nbsp;共{{ storeInfo.skusCount }}件宝贝</li>
            </ul>
            <x-button mini type="primary" class="shop-btn" @click.native="toStoreIndex(storeInfo.id)">进店</x-button>
          </div>
          <div v-if="storeInfo.skus !== []" class="shop-goods">
            <div v-for="(sku,index) in storeInfo.skus" v-if="index <= 2" class="shop-goods-item"
                 @click="toSpuDetail(sku.id)">
              <div class="imgBox"><img :src="sku.url"></div>
              <span>¥{{ getBatchSkuPrice(sku) }}</span>
            </div>
          </div>
        </div>
      </div>
    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider>

  </div>
</template>

<script>
  import {Group, XInput, Divider, Tab, TabItem, XButton} from 'vux'

  import {getBatchSkuPrice} from '@/utils/utils';

  import {queryStoreInfoForSearch} from '@/api/searchshoplist';

  export default {
    components: {Group, XInput, Divider, Tab, TabItem, XButton},
    data() {
      return {
        navTabValue: 0, // 列表切换
        getBatchSkuPrice: getBatchSkuPrice, // 获取单品价格
        totalPredeposit: null, // 预存款总额
        listQuery: {
          keyword: this.$route.query.keyword ? this.$route.query.keyword : '', // 关键字
          orderBy: '0', // 排序条件 0:综合 1:销量 2:评论数
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        _done: null, //分页控件
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      toBack() {
        this.$router.go(-1)
      },
      //下拉触发
      infinite(done) {
        this._done = done;
        //没有更多数据
        if (this.noMore) {
          //关闭无限加载
          this.$refs.scroller.finishInfinite(true);
          return;

        }
        //正在查询中  不请求
        if (this.loading) {
          done();
          return;
        }
        //设置正在查询中
        this.loading = true;
        //查询
        this.getData();
        done();
      },
      //获取数据
      getData() {
        queryStoreInfoForSearch(this.listQuery).then(response => {
          let list = response.data;
          this.listQuery.pageNum++;
          if (list.length > 0) {
            this.pageList = this.pageList.concat(list);
          }
          this.loading = false;
          if (list.length < 10) {
            this.noMore = true;
          }
        });
      },
      // 切换列表
      changeTable(index) {
        this.listQuery.orderBy = index.toString();
        this.refreshData();
      },
      // 刷新列表
      refreshData() {
        this.listQuery.pageNum = 0;
        this.pageList = [];
        this.noMore = false;
        this._done();
      },
      // 跳转到搜索页
      toSearch() {
        this.$router.push({path: '/search', query: {action: 'replace'}})
      },
      // 跳转到商品详情页
      toSpuDetail(id) {
        this.$router.push({path: '/spudetail', query: {id: id}})
      },
      // 跳转到店铺首页
      toStoreIndex(storeId) {
        this.$router.push({path: '/storeindex', query: {storeId: storeId}})
      },
    },
    watch: {
      '$route'() {
        this.loading = false;
        this.pageList = [];
        this.noMore = false;
        this.listQuery = {
          keyword: this.$route.query.keyword, // 关键字
          orderBy: '0', // 排序条件 0:综合 1:销量 2:评论数
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        };
        this.$refs.scroller.finishInfinite(false);
      }
    }
  }
</script>
