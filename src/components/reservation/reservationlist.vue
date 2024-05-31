<template>
  <div style="height:100%;">

    <scroller
      :on-infinite="infinite"
      ref="scroller"
      :class="{scrollerNoData : pageList.length === 0}"
    >

      <!-- <x-header @on-click-back="backCustomerCenter()" :left-options="{backText: '',preventGoBack:true}">预约到店</x-header> -->

      <group v-for="(reservation,index) in pageList" :key="index" class="orderItem noTopBoderCells">
        <cell>
          <span slot="title">预约时间：{{ reservation.createTime }}</span>
        </cell>
        <cell is-link :link="{path:'/storedetail',query:{storeId:reservation.storeId}}">
          <span slot="title">预约门店：{{ reservation.storeName }}</span>
        </cell>
        <ul class="searchlist-normal clearfix recordlist" style="margin-top: 0">
          <li class="normal-list">
            <div class="pro-img"><img :src="reservation.url"></div>
            <div class="product-info-box">
              <div class="product-name">{{reservation.skuName}}</div>
              <div class="product-price-m">
                <em>¥{{formatPrice(reservation.price)}}</em>
                <span style="float: right">x{{reservation.num}}</span>
              </div>
            </div>
          </li>
        </ul>
        <cell style="margin-top: 10px">合计 ¥{{formatPrice(reservation.totalPrice)}}</cell>
        <cell>
          <span class="orderListBtn">
            <x-button mini plain type="primary" @click.native="cancelReservation(reservation.id)">取消预约</x-button>
          </span>
        </cell>
      </group>

    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, XButton, Divider, Group, Cell} from 'vux'

  import {formatPrice, getBatchSkuPrice} from '@/utils/utils';

  import {queryReservationList, cancelReservation} from '@/api/reservationlist';

  export default {
    components: {
      XHeader, XButton, Divider, Group, Cell
    },
    data() {
      return {
        formatPrice: formatPrice, // 格式化金额
        isProcess: false, // 接口是否处理中
        listQuery: {
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
        queryReservationList(this.listQuery).then(response => {
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
      // 取消预约
      cancelReservation(id) {
        let that = this;
        if (that.isProcess) {
          return;
        }
        that.$vux.confirm.show({
          title: '操作提示',
          content: '您确定要取消该预约吗？',
          onConfirm() {
            that.isProcess = true;
            cancelReservation(id).then(res => {
              that.isProcess = false;
              if (res == '1') {
                that.$vux.toast.text('取消成功', 'middle');
                that.refreshData();
              } else {
                that.$vux.toast.text('取消失败', 'middle')
              }
            });
          }
        })
      },
      // 刷新列表
      refreshData() {
        this.listQuery.pageNum = 0;
        this.pageList = [];
        this.noMore = false;
        this._done();
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({path: '/home'})
      }
    }
  }
</script>
