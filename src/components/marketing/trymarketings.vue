<template>
  <div style="height:100%;">
    <scroller :on-infinite="infinite" ref="scroller" :class="{ scrollerNoData: pageList.length === 0 }">
      <!-- <x-header :left-options="{ backText: '' }">试用中心</x-header> -->

      <img :src="bannerImg" width="100%" style="display: block" />

      <div class="classifyTabNav">
        <tab v-model="tabValue" class="panicBuyNav">
          <tab-item style="background: #fff">全部分类</tab-item>
          <tab-item v-for="(item, index) in tabData" :key="index" style="background: #fff">{{ item.name }}</tab-item>
        </tab>
        <div class="nav_more" @click="allClassifyVisible = !allClassifyVisible"></div>
        <ul v-show="allClassifyVisible" class="all_classify">
          <checker
            class="clearfix"
            slot="inline-desc"
            v-model="tabValue"
            :radio-required="true"
            @on-change="changeCate"
            default-item-class="classifyitem"
            selected-item-class="classifyitem_selected"
          >
            <checker-item v-for="(item, index) in tabData" :key="index" :value="item.value">{{ item.name }}</checker-item>
          </checker>
        </ul>
      </div>

      <ul class="searchlist-normal searchlist-square-pic clearfix">
        <li v-for="(item, index) in pageList" :key="index" class="normal-list" @click="toTrySpuDetail(item.tryMarketing.id)">
          <div class="pro-img"><img :src="item.tryMarketing.sku.skuImages[0].url" /></div>
          <div class="product-info-box">
            <div class="product-name">
              <i v-if="item.tryMarketing.type !== '2'" class="self-sell">付邮试用</i>
              <i v-if="item.tryMarketing.type === '2'" class="self-sell">返券试用</i>
              {{ item.tryMarketing.sku.name }}
            </div>
            <div class="product-price-m">
              <span>
                原价：
                <del>{{ item.tryMarketing.sku.price.toFixed(2) }}</del>
              </span>
            </div>
            <div class="product-price-m">
              <span>
                提供
                <font style="color: #c81623">{{ item.tryMarketing.tryNum }}</font>
                份/已有
                <font style="color: #c81623">{{ item.tryMarketing.alerdyApplyNum }}</font>
                人申请
              </span>
            </div>
          </div>
        </li>
      </ul>
    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter" style="margin-top: 550px">暂无数据</divider>
  </div>
</template>

<script>
  import { XHeader, Tab, TabItem, Checker, CheckerItem, Divider } from 'vux'

  import {
    queryTryPic, // 查询试用促销图片信息
    queryMarketingCateList, // 查询试用促销分类列表
    queryTryMarketingList, // 分页查询试用促销列表
  } from '@/api/trymarketings'

  export default {
    components: {
      XHeader,
      Tab,
      TabItem,
      Checker,
      CheckerItem,
      Divider,
    },
    data() {
      return {
        storeId: this.$route.query.storeId ? this.$route.query.storeId : 0, // 店铺id
        allClassifyVisible: false,
        tabValue: 0, //表格下标  0 开始
        bannerImg: '', //宣传图片
        tabData: [], //表头
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
          cateId: 0, //默认全部
          storeId: this.$route.query.storeId ? this.$route.query.storeId : 0, // 店铺id
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        _done: null, //分页控件
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.loadTryPic()
      this.loadTryCate()
    },
    methods: {
      // 加载试用促销图片
      loadTryPic() {
        queryTryPic(this.storeId).then((res) => {
          if (!!res.flag && res.data) {
            this.bannerImg = res.data.mobilePic
          }
        })
      },
      // 加载试用促销分类
      loadTryCate() {
        this.tabData = []
        queryMarketingCateList(this.storeId).then((res) => {
          if (res && res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              let cate = {
                name: res[i].name,
                value: i + 1,
                id: res[i].id,
              }
              this.tabData.push(cate)
            }
          }
        })
      },
      //页面数据
      getData() {
        queryTryMarketingList(this.listQuery).then((response) => {
          let list = response.data
          this.listQuery.pageNum++
          if (list.length > 0) {
            this.pageList = this.pageList.concat(list)
          }
          this.loading = false
          if (list.length < 10) {
            this.noMore = true
          }
        })
      },
      infinite(done) {
        this._done = done
        //没有更多数据
        if (this.noMore) {
          //关闭无限加载
          this.$refs.scroller.finishInfinite(true)
          return
        }
        //正在查询中  不请求
        if (this.loading) {
          done()
          return
        }
        //设置正在查询中
        this.loading = true
        //查询
        this.getData()
        done()
      },
      changeCate() {
        if (this.tabValue == 0) {
          this.listQuery.cateId = 0
        } else {
          this.listQuery.cateId = this.tabData[this.tabValue - 1].id
        }
        this.pageList = []
        //页码归零
        this.listQuery.pageNum = 0
        //重置标记
        this.noMore = false
        this._done()
      },
      toTrySpuDetail(id) {
        this.$router.push({ path: '/tryspudetail', query: { tryId: id } })
      },
    },
  }
</script>
