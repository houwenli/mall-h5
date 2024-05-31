<template>
  <div style="height:100%;">
    <scroller :on-infinite="infinite" ref="scroller" :class="{ scrollerNoData: pageList.length === 0 }">
      <!-- <x-header :left-options="{ backText: '' }">预售中心</x-header> -->

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
            @on-change="changeCate"
            :radio-required="true"
            default-item-class="classifyitem"
            selected-item-class="classifyitem_selected"
          >
            <checker-item v-for="(item, index) in tabData" :key="index" :value="item.value">{{ item.name }}</checker-item>
          </checker>
        </ul>
      </div>

      <ul class="searchlist-normal searchlist-square-pic clearfix">
        <li v-for="(item, index) in pageList" :key="index" class="normal-list" @click="toSpuDetail(item.sku)">
          <div class="pro-img"><img :src="item.sku.skuImages[0].url" /></div>
          <div class="product-info-box">
            <div class="product-name">
              <i v-if="item.preSale.type == '1'" class="self-sell">定金预售</i>
              <i v-if="item.preSale.type == '2'" class="self-sell">全款预售</i>
              {{ item.sku.name }}
            </div>
            <div class="product-price-m">
              <span v-if="item.preSale.type == '1'">定金：</span>
              <span v-if="item.preSale.type == '2'">全款：</span>
              <em>
                ¥
                <span class="price">{{ item | price }}</span>
              </em>
            </div>
          </div>
        </li>
      </ul>
      <divider v-if="pageList.length === 0" class="dividerCenter" style="margin-top: 100px">暂无数据</divider>
    </scroller>
  </div>
</template>

<script>
  import { XHeader, Tab, TabItem, Checker, CheckerItem, Divider } from 'vux'

  import {
    queryPreSalePic, // 查询预售促销图片信息
    queryMarketingCateList, // 查询预售促销分类列表
    queryPreSaleList, // 分页查询预售促销列表
  } from '@/api/presalemarketings'

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
      this.loadPreSalePic()
      this.loadPreSaleCate()
    },
    filters: {
      price(value) {
        if (value.preSale.type == '1') {
          return (value.sku.price * value.preSale.depositPre).toFixed(2)
        } else {
          return value.sku.price.toFixed(2)
        }
      },
    },

    methods: {
      // 加载预售促销图片
      loadPreSalePic() {
        queryPreSalePic(this.storeId).then((res) => {
          if (!!res.flag && res.data) {
            this.bannerImg = res.data.mobilePic
          }
        })
      },
      // 加载预售促销分类
      loadPreSaleCate() {
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
        queryPreSaleList(this.listQuery).then((response) => {
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
      toSpuDetail(item) {
        this.$router.push({ path: '/spudetail', query: { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 } })
      },
    },
  }
</script>
