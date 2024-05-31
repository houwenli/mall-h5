<template>
  <div style="height:100%;">
    <scroller :on-infinite="infinite" ref="scroller" :class="{ scrollerNoData: pageList.length === 0 }">
      <!-- <x-header @on-click-back="backCustomerCenter()" :left-options="{ backText: '', preventGoBack: true }">
        {{ titleMap[listQuery.status] }}
      </x-header> -->

      <group v-for="(pointOrder,index) in pageList" :key="index" class="orderItem noTopBoderCells">
        <cell>
          <span slot="title">订单号：{{ pointOrder.code }}</span>
          <span>{{ orderStatus[pointOrder.status] }}</span>
        </cell>
        <ul class="searchlist-normal clearfix recordlist" style="margin-top: 0" @click="toPointOrderDetail(pointOrder.id)">
          <li v-if="!!pointOrder.skuDetail" class="normal-list">
            <div class="pro-img"><img :src="pointOrder.skuDetail.pic" /></div>
            <div class="product-info-box">
              <div class="product-name">{{ pointOrder.skuDetail.name }}</div>
              <div class="product-price-m">
                <em>积分 {{ pointOrder.skuDetail.point }}</em>
                <span style="float: right">x{{ pointOrder.num }}</span>
              </div>
            </div>
          </li>
        </ul>
        <cell style="margin-top: 10px">合计：积分 {{ pointOrder.point }}</cell>
        <cell v-if="pointOrder.status == '1'">
          <span class="orderListBtn">
            <x-button mini plain type="primary" v-if="pointOrder.status == '1'" @click.native="toConfirmPointOrder(pointOrder.id)">确认收货</x-button>
          </span>
        </cell>
      </group>
    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider>
  </div>
</template>

<script>
  import { XHeader, XButton, Divider, Group, Cell } from 'vux'

  import {
    queryPointOrderList, // 分页查询用户积分商城订单列表
    confirmReceiptPointOrder, // 积分商城订单确认收货
  } from '@/api/pointorder'

  export default {
    components: {
      XHeader,
      XButton,
      Divider,
      Group,
      Cell,
    },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        listQuery: {
          status: this.$route.query.status ? this.$route.query.status : '-1', // 查询状态 -1 全部 0 待发货 1 待收货
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        _done: null, //分页控件
        titleMap: { '-1': '全部积分订单', '0': '待发货积分订单', '1': '待收货积分订单' }, // 页面标题
        orderStatus: { '0': '待发货', '1': '待收货', '2': '已完成' }, // 订单状态
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      //下拉触发
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
      //获取数据
      getData() {
        queryPointOrderList(this.listQuery).then((response) => {
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
      // 确认收货
      toConfirmPointOrder(pointOrderId) {
        let that = this
        if (that.isProcess) {
          return
        }
        that.$vux.confirm.show({
          title: '操作提示',
          content: '是否确认收货？',
          onConfirm() {
            that.isProcess = true
            confirmReceiptPointOrder(pointOrderId).then((res) => {
              that.isProcess = false
              if (res > 0) {
                that.$vux.toast.text('确认收货成功', 'middle')
                that.refreshData()
              } else {
                that.$vux.toast.text('确认收货失败', 'middle')
              }
            })
          },
        })
      },
      // 刷新列表
      refreshData() {
        this.listQuery.pageNum = 0
        this.pageList = []
        this.noMore = false
        this._done()
      },

      // 跳转到积分订单详情页
      toPointOrderDetail(pointOrderId) {
        this.$router.push({ path: '/pointorderdetail', query: { pointOrderId: pointOrderId } })
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({ path: '/home' })
      },
    },
  }
</script>
