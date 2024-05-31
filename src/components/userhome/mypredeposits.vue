<template>
  <div style="height:100%;">
    <scroller :on-infinite="infinite" ref="scroller" :class="{ scrollerNoData: pageList.length === 0 }">
      <!-- <x-header @on-click-back="backCustomerCenter()" :left-options="{ backText: '', preventGoBack: true }">我的钱包</x-header> -->

      <div class="profit-box">
        <div class="title">预存款余额（元）</div>
        <div class="money">{{ formatPrice(totalPredeposit) }}</div>
      </div>

      <tab v-model="tabValue">
        <tab-item style="background: none" @on-item-click="changeTable">全部</tab-item>
        <tab-item style="background: none" @on-item-click="changeTable">收入</tab-item>
        <tab-item style="background: none" @on-item-click="changeTable">支出</tab-item>
      </tab>

      <group>
        <cell v-for="(item, index) in pageList" :key="index" :title="item.remark">
          <div style="font-size: 1rem" :style="item.transType == '3' || item.transType == '1' || item.transType == '4' ? 'color: #ffc927' : ''">
            <span v-if="item.transType == '3' || item.transType == '1' || item.transType == '4'">+</span>
            <span v-else>-</span>
            {{ item.money }}
          </div>
        </cell>
      </group>
    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter" style="margin-top: 400px">暂无数据</divider>
  </div>
</template>

<script>
  import { XHeader, Divider, Group, Cell, Tab, TabItem } from 'vux'

  import { formatPrice } from '@/utils/utils'

  import { queryAllPredeposit, queryPredeposits } from '@/api/mypredeposits'

  export default {
    components: {
      XHeader,
      Divider,
      Group,
      Cell,
      Tab,
      TabItem,
    },
    data() {
      return {
        tabValue: 0, // 列表切换
        formatPrice: formatPrice, // 格式化金额
        totalPredeposit: null, // 预存款总额
        listQuery: {
          filterType: '1', // 过滤状态 1 全部 2 收入 3 支出
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
      document.body.removeAttribute('class', 'gray-bg')
      this.queryAllPredeposit()
    },
    methods: {
      // 查询预存款总额
      queryAllPredeposit() {
        queryAllPredeposit().then((res) => {
          this.totalPredeposit = res
        })
      },
      // 下拉触发
      infinite(done) {
        this._done = done
        // 没有更多数据
        if (this.noMore) {
          // 关闭无限加载
          this.$refs.scroller.finishInfinite(true)
          return
        }
        // 正在查询中  不请求
        if (this.loading) {
          done()
          return
        }
        // 设置正在查询中
        this.loading = true
        // 查询
        this.getData()
        done()
      },
      // 获取数据
      getData() {
        queryPredeposits(this.listQuery).then((response) => {
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
      // 切换列表
      changeTable(index) {
        this.listQuery.filterType = (index + 1).toString()
        this.refreshData()
      },
      // 刷新列表
      refreshData() {
        this.listQuery.pageNum = 0
        this.pageList = []
        this.noMore = false
        this._done()
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({ path: '/home' })
      },
    },
  }
</script>
