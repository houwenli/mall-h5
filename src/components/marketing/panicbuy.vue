<template>
  <div style="height:100%;">
    <scroller :on-infinite="infinite" ref="scroller" :class="{ scrollerNoData: seckillList.length === 0 }">
      <!-- <x-header :left-options="{ backText: '' }">秒杀</x-header> -->

      <img :src="topImgUrl" width="100%" style="display: block" />

      <tab v-if="seceneList.length > 0" v-model="tabValue" class="secKillNav" :scroll-threshold="5">
        <tab-item v-for="(item, index) in seceneList" :key="index" @on-item-click="changeSecene(item)">
          <div style="font-size: 15px">{{ item.secen }}</div>
          <div style="font-size: 12px">{{ item.status == '1' ? '正在秒杀' : '即将开始' }}</div>
        </tab-item>
      </tab>

      <ul v-if="seckillList.length > 0" class="searchlist-normal clearfix">
        <li v-for="(item, index) in seckillList" :key="index" class="normal-list" style="height: 130px" @click="toSpuDetail(item)">
          <div class="pro-img" style="width: 120px; height: 120px">
            <img :src="item.image" style="max-width: 120px; height: 120px" />
          </div>
          <div class="product-info-box" style="height: 118px">
            <div class="product-name" style="margin-bottom: 28px">{{ item.name }}</div>
            <div class="product-price-m">
              <em>
                ¥
                <span class="price">{{ item.price.toFixed(2) }}</span>
              </em>
              <del style="font-size: 14px; margin-left: 10px; color: #666">{{ item.oldPrice.toFixed(2) }}</del>
            </div>
            <div class="gray-pro-info">
              <span>{{ selectedSecene.status == '1' ? '已售' + item.saleNum + '件' : '限时秒杀 抢先提醒' }}</span>
            </div>
          </div>
          <div v-if="selectedSecene.status == '1'" class="secKillBtn">立即抢购</div>
          <div v-else class="secKillBtn" style="background: #999">即将开始</div>
        </li>
      </ul>
    </scroller>
    <divider v-if="seckillList.length === 0" class="dividerCenter" style="margin-top: 400px">暂无数据</divider>
  </div>
</template>

<script>
  import { XHeader, Tab, TabItem, Checker, CheckerItem, Divider } from 'vux'

  import {
    querySeckills, // 分页查询秒杀活动列表
    querySeckillSceneDetail, // 查询秒杀场次
  } from '@/api/panicbuy'

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
        topImgUrl: '', // 秒杀活动图片
        seceneList: [], // 秒杀场次列表
        seckillList: [], // 秒杀活动列表
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
          seckillTime: '', // 秒杀时间
        }, // 查询参数
        selectedSecene: {}, // 选中的场次
        noMore: false, // 没有更多
        loading: false, // 正在加载
        _done: null, // 分页控件
        tabValue: 0, //表格下标  0 开始
        isLoad: false, // 是否可以加载
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.querySeckillSecneList()
    },
    methods: {
      // 查询秒杀场次
      querySeckillSecneList() {
        let that = this
        querySeckillSceneDetail().then((res) => {
          if (!!res.flag && res.data) {
            that.topImgUrl = res.data.mobilePic
            if (!!res.data.secenes && res.data.secenes.length > 0) {
              that.seceneList = res.data.secenes
              that.selectedSecene = that.seceneList[0]
              that.listQuery.seckillTime = that.selectedSecene.seckillTime
              this.isLoad = true
              this.seckillList = []
              //页码归零
              this.listQuery.pageNum = 0
              //重置标记
              this.noMore = false
              this._done()
            }
          }
        })
      },
      // 页面数据
      getData() {
        querySeckills(this.listQuery).then((response) => {
          let list = response.data
          this.listQuery.pageNum++
          if (list.length > 0) {
            this.seckillList = this.seckillList.concat(list)
          }
          this.loading = false
          if (list.length < 10) {
            this.noMore = true
          }
        })
      },
      infinite(done) {
        this._done = done
        if (!this.isLoad) {
          return
        }
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
      // 切换场次
      changeSecene(secene) {
        this.selectedSecene = secene
        this.listQuery.seckillTime = this.selectedSecene.seckillTime
        this.seckillList = []
        //页码归零
        this.listQuery.pageNum = 0
        //重置标记
        this.noMore = false
        this._done()
      },
      // 跳转到商品详情页
      toSpuDetail(item) {
        if (this.selectedSecene.status == '0') {
          return
        }
        this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
      },
    },
  }
</script>
