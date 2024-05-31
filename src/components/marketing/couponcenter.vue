<template>
  <div style="height:100%;">


    <scroller
      ref="scroller"
      :on-infinite="infinite"
      :class="{scrollerNoData : pageList.length === 0}"
    >
      <!-- <x-header :left-options="{backText: ''}">领券中心</x-header> -->

      <div class="couponlist" style="padding: 0 10px 10px">
        <div v-for="item in pageList" class="couponbox" :class="item.runOut ? 'disabledCoupon' : '' ">
          <ul>
            <li><span>¥</span>
              <i v-if="item.type =='1' ">{{ item.couponFull.price}}</i>
              <i v-if="item.type !='1' ">{{ item.couponFall.price}}</i>
            </li>
            <li>
              <p>{{ item.storeId == 0 ? '商城自营' : item.storeName }}</p>
              <p v-if="item.type == '1' ">满{{ item.couponFull.fullPrice }}元使用</p>
              <p v-if="item.type != '1' ">使用立减</p>
            </li>
          </ul>
          <div class="clearfix">
            <p class="fll">{{ item.startTime.split(" ")[0] }}--{{ item.endTime.split(" ")[0] }}</p>
            <p class="flr" v-if="item.runOut"><span>已领完</span></p>
            <p class="flr" v-if="!item.runOut"><span class="quan_btn" @click="acquireCoupon(item.id)">立即领取</span></p>
          </div>
        </div>
      </div>
    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider>


  </div>
</template>

<script>
  import {XHeader, Divider} from 'vux'

  import {
    getCouponList,//分页查询优惠券
    receiveCoupon,//领取优惠券
  } from '@/api/couponcenter'


  export default {
    components: {
      XHeader, Divider
    },
    data() {
      return {
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
          storeId: this.$route.query.storeId ? this.$route.query.storeId : -1, // 店铺id
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        isProcess: false, // 接口是否处理中
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {

      //下拉触发
      infinite: function (done) {
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
        getCouponList(this.listQuery).then(response => {
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
      //领取优惠券
      acquireCoupon(id) {
        if (this.isProcess) {
          return;
        }
        this.isProcess = true;
        receiveCoupon(id).then(response => {
          this.isProcess = false;
          if (response == 1) {
            this.$vux.toast.text('领取成功', 'middle')
          } else if (response == -2) {
            this.$vux.toast.text('活动已过期', 'middle')
          } else if (response == -3) {
            this.$vux.toast.text('优惠券已领完', 'middle')
          } else if (response == -4) {
            this.$vux.toast.text('用户领取的优惠券已达上限', 'middle')
          } else if (response == -5) {
            this.$vux.toast.text('优惠券已失效', 'middle')
          } else if (response == -6) {
            this.$vux.toast.text('系统繁忙,请重试', 'middle')
          } else {
            this.$vux.toast.text('系统繁忙', 'middle')
          }
        });
      },
    }
  }
</script>
