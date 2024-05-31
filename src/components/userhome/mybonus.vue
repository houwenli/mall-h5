<template>
  <div style="height:100%;">


    <scroller
      ref="scroller"
      :on-infinite="infinite"
      :class="{scrollerNoData : pageList.length === 0}"
    >
      <x-header @on-click-back="backCustomerCenter()" :left-options="{backText: '',preventGoBack:true}">我的红包</x-header>

      <div class="couponlist" style="padding: 0 10px">
        <div v-for="item in pageList" class="couponbox"
             :class="(item.status == '2' || item.status == '3' || new Date(item.endTime) < new Date())? 'disabledCoupon' : ''"
             @click="toCouponDetails(item)">
          <ul>
            <li><span>¥</span><i>{{ item.redEnvelope.price}}</i></li>
            <li>
              <p>平台红包</p>
              <p>部分店铺可用</p>
              <p>满{{ item.redEnvelope.fullPrice }}元可用</p>
            </li>
          </ul>
          <div class="clearfix">
            <p class="fll">红包使用说明</p>
            <p class="flr">{{ item.redEnvelope.startTime.split(' ')[0]}}--{{ item.redEnvelope.endTime.split(' ')[0]
              }}</p>
          </div>
        </div>
      </div>

    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider>


  </div>
</template>

<script>
  import {XHeader, XButton, Divider} from 'vux'
  import {
    queryRedEnvelopes,//分页查询用户查询红包
  } from '@/api/mybonus'

  import {
    isEmpty// 是否为空
  } from '@/utils/validate'
  export default {
    components: {
      XHeader, XButton, Divider
    },
    data() {
      return {
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
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
      getData() {
        queryRedEnvelopes(this.listQuery).then(response => {
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
      //红包详情
      toCouponDetails(item) {
        let stores = '商城自营';
        if (item.redEnvelopeStores != null) {
          for (let i = 0; i < item.redEnvelopeStores.length; i++) {
            if (!isEmpty(item.redEnvelopeStores[i].storeName)) {
              stores += '、' + item.redEnvelopeStores[i].storeName;
            }
          }
        }
        this.$router.push({path: '/bonusdetails', query: {desc: item.redEnvelope.desc, stores: stores}});
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({path: '/home'})
      }
    }
  }
</script>
