<template>
  <div style="height:100%;">

    <scroller
      :on-infinite="infinite"
      ref="scroller"
      :class="{scrollerNoData : storePanicBuyList.length === 0}"
    >

      <!-- <x-header :left-options="{backText: ''}">秒杀</x-header> -->

      <img :src="topImgUrl" width="100%" style="display: block">

      <ul v-if="storePanicBuyList.length > 0" class="searchlist-normal clearfix">
        <li v-for="item in storePanicBuyList" class="normal-list" style="height: 130px"
            @click="toSpuDetail(item.skuId,item.status)">
          <div class="pro-img" style="width: 120px; height: 120px">
            <img :src="item.image" style="max-width: 120px; height: 120px">
          </div>
          <div class="product-info-box" style="height: 118px">
            <div class="product-name" style="margin-bottom: 28px">{{item.name}}</div>
            <div class="product-price-m"><em>¥<span class="price">{{item.price.toFixed(2)}}</span></em>
              <del style="font-size: 14px; margin-left: 10px; color: #666">{{ item.oldPrice.toFixed(2) }}</del>
            </div>
            <div class="gray-pro-info"><span>{{item.status=='1'?'已售'+item.saleNum+'件':'限时秒杀 抢先提醒'}}</span>
            </div>
          </div>
          <div v-if="item.status=='1'" class="secKillBtn">立即抢购</div>
          <div v-else class="secKillBtn" style="background: #999">即将开始</div>
        </li>
      </ul>

    </scroller>

    <divider v-if="storePanicBuyList.length === 0" class="dividerCenter" style="top: 60%">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, Tab, TabItem, Checker, CheckerItem, Divider} from 'vux'

  import {
    queryPanicBuyPic, // 查询秒杀促销图片信息
    queryStorePanicBuyList, // 分页查询店铺秒杀活动列表
  } from '@/api/storepanicbuy'

  export default {
    components: {
      XHeader, Tab, TabItem, Checker, CheckerItem, Divider
    },
    data() {
      return {
        topImgUrl: '', // 秒杀活动图片
        storePanicBuyList: [], // 店铺秒杀活动列表
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
          storeId: this.$route.query.storeId, // 店铺id
        }, // 查询参数
        noMore: false, // 没有更多
        loading: false, // 正在加载
        _done: null, // 分页控件
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.queryPanicBuyPic();
    },
    methods: {
      // 查询秒杀促销图片信息
      queryPanicBuyPic() {
        queryPanicBuyPic(this.listQuery.storeId).then(res => {
            if (!!res.flag && res.data) {
              this.topImgUrl = res.data.mobilePic;
            }
          }
        );
      },
      // 页面数据
      getData() {
        queryStorePanicBuyList(this.listQuery).then(response => {
          let list = response.data;
          this.listQuery.pageNum++;
          if (list.length > 0) {
            this.storePanicBuyList = this.storePanicBuyList.concat(list);
          }
          this.loading = false;
          if (list.length < 10) {
            this.noMore = true;
          }
        });
      },
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
      // 跳转到商品详情页
      toSpuDetail(id, status) {
        if (status == '0') {
          return;
        }
        this.$router.push({path: '/spudetail', query: {id: id}})
      },
    }
  }
</script>
