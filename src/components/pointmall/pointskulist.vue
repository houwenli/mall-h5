<template>
  <div style="height:100%;">
    <scroller :on-infinite="infinite" ref="scroller" :class="{ scrollerNoData: pageList.length === 0 }">
      <!-- <x-header :left-options="{ backText: '' }">积分商城</x-header> -->

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
        <li v-for="(item, index) in pageList" :key="index" class="normal-list" @click="toPointSkuDetail(item.id)">
          <div class="pro-img"><img :src="item.pics.split(',')[0]" /></div>
          <div class="product-info-box">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-price-m">
              <span>积分：</span>
              <em>
                <span class="price" style="margin: 0">{{ item.point }}</span>
              </em>
            </div>
          </div>
        </li>
      </ul>
    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter" style="margin-top: 400px">暂无数据</divider>
  </div>
</template>

<script>
  import { XHeader, Tab, TabItem, Checker, CheckerItem, Divider } from 'vux'

  import {
    queryPointSkuList, // 分页查询积分商品信息
    queryAllPointCates, // 查询所有积分商品分类
    queryMarketingSetting, // 查询促销设置
  } from '@/api/pointskulist'

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
        allClassifyVisible: false, // 是否展示下拉全部分类
        tabValue: 0, // 表格下标  0 开始
        bannerImg: '', // 活动广告图片
        tabData: [], // 表头数据列表
        listQuery: {
          cateId: null, // 分类id
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, // 没有更多
        pageList: [], // 页面数据源
        loading: false, // 正在加载
        _done: null, // 分页控件
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryAllPointCates()
      this.queryMarketingSetting()
    },
    methods: {
      // 查询所有积分商城分类
      queryAllPointCates() {
        this.tabData = []
        queryAllPointCates().then((res) => {
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
      // 页面数据
      getData() {
        queryPointSkuList(this.listQuery).then((response) => {
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
      // 查询促销设置
      queryMarketingSetting() {
        queryMarketingSetting().then((res) => {
          if (res) {
            this.bannerImg = res.data.mobilePointPic
          }
        })
      },
      // 切换分类
      changeCate() {
        if (this.tabValue) {
          this.listQuery.cateId = this.tabData[this.tabValue - 1].id
        } else {
          this.listQuery.cateId = null
        }
        this.pageList = []
        //页码归零
        this.listQuery.pageNum = 0
        //重置标记
        this.noMore = false
        this._done()
      },
      // 跳转到积分商城商品详情
      toPointSkuDetail(id) {
        this.$router.push({ path: '/pointskudetail', query: { id: id } })
      },
    },
  }
</script>
