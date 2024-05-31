<template>
  <div style="height:100%;">

    <scroller
      :on-infinite="infinite"
      ref="scroller"
      :class="{scrollerNoData : pageList.length === 0}"
    >

      <!-- <x-header :left-options="{backText: ''}">拼团中心</x-header> -->

      <img :src="bannerImg" width="100%" style="display: block">

      <div class="classifyTabNav">
        <tab v-model="tabValue" class="panicBuyNav">
          <tab-item style="background: #fff">全部分类</tab-item>
          <tab-item v-for="(item,index) in tabData" :key="index" style="background: #fff">{{ item.name }}</tab-item>
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
            <checker-item v-for="(item,index) in tabData" :key="index" :value="item.value">{{ item.name }}</checker-item>
          </checker>
        </ul>
      </div>

      <divider v-if="pageList.length === 0" class="dividerCenter" style="margin-top:100px">暂无数据</divider>
      <ul class="searchlist-normal searchlist-square-pic clearfix">
        <li v-for="(item,index) in pageList" :key="index" class="normal-list" @click="toSpuDetail(item.sku.id )">
          <div class="pro-img"><img :src="item.sku.url"></div>
          <div class="product-info-box">
            <div class="product-name"><i class="self-sell">拼团</i>{{item.sku.name}}</div>
            <div class="product-price-m"><span>拼团价：</span><em>{{item.groupMarketing.price.toFixed(2)}}</em></div>
            <div class="product-price-m"><span>成团人数：<font style="color: #c81623">{{item.groupMarketing.groupNum}}</font>人成团</span>
            </div>
          </div>
        </li>
      </ul>

    </scroller>


  </div>
</template>

<script>
  import {XHeader, Tab, TabItem, Checker, CheckerItem, Divider} from 'vux'
  import {
    queryGroupPic, // 查询拼团促销图片信息
    queryMarketingCateList, // 查询拼团促销分类列表
    queryGroupMarketingList, // 分页查询拼团促销列表
  } from '@/api/groupmarketings';


  export default {
    components: {
      XHeader, Tab, TabItem, Checker, CheckerItem, Divider
    },
    data() {
      return {
        storeId: this.$route.query.storeId ? this.$route.query.storeId : 0, // 店铺id
        allClassifyVisible: false,
        tabValue: 0, //表格下标  0 开始
        bannerImg: '',// 促销图片
        tabData: [],  //表头
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
          cateId: 0,//默认全部
          storeId: this.$route.query.storeId ? this.$route.query.storeId : 0, // 店铺id
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        _done: null,//分页控件
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.loadGroupPic();
      this.loadGroupCate();
    },
    methods: {
      // 加载拼团促销图片
      loadGroupPic() {
        queryGroupPic(this.storeId).then(res => {
            if (!!res.flag && res.data) {
              this.bannerImg = res.data.mobilePic;
            }
          }
        );
      },
      // 加载拼团促销分类
      loadGroupCate() {
        this.tabData = [];
        queryMarketingCateList(this.storeId).then(res => {
          if (res && res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              let cate = {
                name: res[i].name,
                value: i + 1,
                id: res[i].id,
              };
              this.tabData.push(cate);
            }
          }
        });
      },
      //页面数据
      getData() {
        queryGroupMarketingList(this.listQuery).then(response => {
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
      changeCate() {
        if (this.tabValue == 0) {
          this.listQuery.cateId = 0;
        } else {
          this.listQuery.cateId = this.tabData[this.tabValue - 1].id;
        }
        this.pageList = [];
        //页码归零
        this.listQuery.pageNum = 0;
        //重置标记
        this.noMore = false;
        this._done();
      },
      toSpuDetail(id) {
        this.$router.push({path: '/spudetail', query: {id: id}})
      }
    }
  }
</script>
