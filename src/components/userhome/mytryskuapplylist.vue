<template>
  <div style="height:100%;">

    <scroller
      :on-infinite="infinite"
      ref="scroller"
      :class="{scrollerNoData : pageList.length === 0}"
    >

      <!-- <x-header @on-click-back="backCustomerCenter()" :left-options="{backText: '',preventGoBack:true}">
        我的试用
      </x-header> -->

      <group v-for="(trySkuApply,index) in pageList" :key="index" class="trySkuApplyItem noTopBoderCells">
        <cell>
          <span slot="title">申请时间：{{ trySkuApply.applyTime.split(' ')[0] }}</span>
          <span>{{trySkuApplyStatus[trySkuApply.status]}}</span>
        </cell>
        <ul class="searchlist-normal clearfix recordlist" style="margin-top: 0">
          <li class="normal-list">
            <div class="pro-img"><img :src="trySkuApply.sku.url"></div>
            <div class="product-info-box">
              <div class="product-name"><i class="self-sell">
                {{trySkuApply.tryMarketing.type == '1'?'付邮试用':'返券试用'}}</i>{{trySkuApply.sku.name}}
              </div>
              <div class="product-price-m">
                <em>¥{{formatPrice(trySkuApply.sku.price)}}</em>
                <span style="float: right">x1</span>
              </div>
            </div>
          </li>
        </ul>
        <cell>
          <span class="trySkuApplyListBtn">
            <!--已获得试用资格可以购买-->
            <x-button mini plain type="primary" v-if="trySkuApply.status=='1'"
                      @click.native="buyNow(trySkuApply.skuId)">购买试用商品</x-button>
            <!--下单成功和已完成都可以查看订单-->
            <x-button mini plain v-if="trySkuApply.status == '3' || trySkuApply.status == '4'"
                      @click.native="toOrderDetail(trySkuApply)">查看订单</x-button>
            <!--下单成功可以提交试用报告-->
            <x-button mini plain type="primary" v-if="trySkuApply.status == '3'"
                      @click.native="toSubmitReport(trySkuApply.id)">提交试用报告</x-button>
            <!--已完成可以查看试用报告-->
            <x-button mini plain v-if="trySkuApply.status=='4'"
                      @click.native="toViewReport(trySkuApply.id)">查看试用报告</x-button>
          </span>
        </cell>
      </group>

    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, XButton, Divider, Group, Cell} from 'vux'

  import {formatPrice} from '@/utils/utils';

  import {queryTrySkuApplys, hasAuthToAddTryReport,} from '@/api/mytryskuapplylist';

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
        trySkuApplyStatus: {'0': '试用申请中', '1': '已获得试用资格', '2': '试用申请失败', '3': '下单成功', '4': '已完成'}, // 试用申请状态
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
        queryTrySkuApplys(this.listQuery).then(response => {
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
      // 立即购买
      buyNow(skuId) {
        this.$router.push({
          path: '/settlement',
          query: {
            params: JSON.stringify({
              ids: '',
              addressId: 0,
              skuInfo: skuId + ',1',
              isGroup: 0,
              groupId: 0
            })
          }
        })
      },
      // 跳转到订单详情页
      toOrderDetail(temp) {
        this.$router.push({path: '/orderdetail', query: { orderId: temp.orderId, backStatus: temp.backStatus}})
      },
      // 提交试用报告
      toSubmitReport(id) {
        let that = this;
        hasAuthToAddTryReport(id).then(res => {
          if (res == 1) {
            // 跳转到提交试用报告页面
            that.$router.push({path: '/submittryreport', query: {tryApplyId: id}});
          } else if (res == -1) {
            that.$vux.toast.text('您无法提交此商品的试用报告', 'middle');
          } else if (res == -2) {
            that.$vux.toast.text('您还没有购买此商品', 'middle');
          } else if (res == -3) {
            that.$vux.toast.text('确认收货后才能提交试用报告', 'middle');
          } else if (res == -4) {
            that.$vux.toast.text('您已提交过试用报告', 'middle');
          } else {
            that.$vux.toast.text('您无法提交试用报告', 'middle');
          }
        })
      },
      // 查看试用报告
      toViewReport(id) {
        this.$router.push({path: '/tryreportdetail', query: {tryApplyId: id}});
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({path: '/home'})
      }
    }
  }
</script>
