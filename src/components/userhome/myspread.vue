<template>
    <div style="height:100%;">
        <scroller
            :on-infinite="infinite"
            ref="scroller"
            :class="{scrollerNoData : pageList.length === 0}"
        >
            <!-- <x-header
                @on-click-back="backCustomerCenter()"
                :left-options="{backText: '',preventGoBack:true}"
            >我的分销</x-header> -->

            <div class="data_h clearfix">
                <div class="content_head">
                    <div
                        class="income_commission fll"
                        style="text-align: center"
                        @click="toMySpreadRecord"
                    >
                        <p style="margin-top: .6rem">余额</p>
                        <strong>{{customerInfo.commission.toFixed(2)}}元</strong>
                    </div>
                    <div class="income_commission flr">
                        <group class="extend-cells">
                            <cell title="二维码" isLink @click.native="toSpreadCode"></cell>
                            <cell title="推广链接" isLink @click.native="toSpreadCode"></cell>
                            <cell>
                                <span slot="title">推广码：{{customerInfo.selfRecommendCode}}</span>
                            </cell>
                            <cell>
                                <span slot="title">下级数量：{{spreadCount}}</span>
                            </cell>
                        </group>
                    </div>
                </div>
            </div>

            <tab v-model="tabValue">
                <tab-item @on-item-click="tabChange(0)">我的分销订单</tab-item>
                <tab-item @on-item-click="tabChange(1)">我的分销商品</tab-item>
            </tab>

            <divider v-if="pageList.length === 0 && tabValue === 0" class="dividerCenter" style="margin-top: 100px">您还没有分销订单</divider>
            <group
                v-if="tabValue === 0"
                v-for="(element,index) in pageList" :key="index"
                class="orderItem noTopBoderCells"
            >

                <cell>
                    <span slot="title">订单号：{{ element.orderCode }}</span>
                    <span v-if="element.status === '1'">待付款</span>
                    <span v-if="element.status === '2'">待发货</span>
                    <span v-if="element.status === '3'">待收货</span>
                    <span v-if="element.status === '4'">已完成</span>
                    <span v-if="element.status === '5'">取消订单</span>
                    <span v-if="element.status === '6'">退款通过</span>
                    <span v-if="element.status === '7'">退货通过</span>
                </cell>
                <ul class="searchlist-normal clearfix recordlist" style="margin-top: 0">

                    <li v-for="(item,i) in element.orderSkus" :key="i" class="normal-list">
                        <div class="pro-img">
                            <img :src="item.skuImage" />
                        </div>
                        <div class="product-info-box">
                            <div class="product-name">
                                <i v-if="item.orderType === 3" class="self-sell">拼团</i>
                                {{ item.skuName }}
                            </div>
                            <div class="product-price-m">
                                <em>¥{{ (item.price / item.num).toFixed(2) }}</em>
                                <em v-if="element.commissionLevel=='1'">
                                    比例:
                                    <i style="color:#d43f3a">{{ item.commissionRate | rate}}%</i>
                                </em>
                                <em v-if="element.commissionLevel=='1'">
                                    佣金:
                                    <i style="color:#d43f3a">
                                        {{ (item.price * item.commissionRate
                                        / item.num).toFixed(2) }}
                                    </i>
                                </em>
                                <em v-if="element.commissionLevel=='2'">
                                    比例:
                                    <i style="color:#d43f3a">
                                        {{ item.scommissionRate |
                                        rate}}%
                                    </i>
                                </em>
                                <em v-if="element.commissionLevel=='2'">
                                    佣金:
                                    <i style="color:#d43f3a">
                                        {{ (item.price *
                                        item.scommissionRate / item.num).toFixed(2) }}
                                    </i>
                                </em>
                                <span style="float: right">x{{item.num}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <cell style="margin-top: 10px">合计 ¥{{element | sum}}</cell>


            </group>

            <div v-if="tabValue === 1 && suggestType === false">
                <group style="margin-top: 1.176em">
                    <x-input placeholder="输入推荐码" :max="10" v-model="recommendCode"></x-input>
                </group>
                <div class="weui-btn-area">
                    <x-button type="primary" @click.native="bindRecommendCode">保存</x-button>
                </div>
            </div>

            <divider v-if="pageList.length === 0 && tabValue === 1 && suggestType === true" class="dividerCenter" style="margin-top: 100px">没有可分销商品</divider>
            <ul
                v-if="tabValue === 1 && suggestType === true"
                class="searchlist-normal clearfix recordlist"
                style="margin-top: 0"
            >
                <li v-for="(item,num) in pageList" :key="num" class="normal-list" @click="tospudetail(item)">
                    <div class="pro-img">
                        <img :src="item.url" />
                    </div>
                    <div class="product-info-box">
                        <div class="product-name">{{item.name}}</div>
                        <!--<i v-if="item.selfSell" class="self-sell">自营</i>-->
                        <div class="product-price-m">
                            <em>
                                ¥
                                <span class="price">{{item | skuPrice}}</span>
                            </em>
                        </div>
                    </div>
                </li>
            </ul>
        </scroller>

    </div>
</template>

<script>
import {
    XHeader,
    Divider,
    Group,
    Cell,
    Tab,
    TabItem,
    XInput,
    XButton
} from 'vux'

import {
    querySpreadCustomerByCustomerIdCount, // 根据用户id查询分销下级用户数量
    bindRecommendCode, // 绑定推荐码
    queryCustomerPersonalInfo, // 根据用户id查询用户个人信息
    queryPageData // 分页查询页面数据
} from '@/api/myspread'

import { queryBaseInfoSet } from '@/api/baseinfoset'

export default {
  components: {
    XHeader,
    Divider,
    Group,
    Cell,
    Tab,
    TabItem,
    XInput,
    XButton
  },
  data () {
    return {
      spreadCount: 0, // 下级用户数量
      customerInfo: {
        commission: 0,
        selfRecommendCode: ''
      }, // 用户详情
      _done: null, // 无限加载插件
      suggestType: false, // 有没有上级
      tabValue: 0, // table类型  0 订单 1 商品
      pageList: [], // 页面数据源
      listQuery: {
        pageNum: 0, // 当前页码
        pageSize: 10 // 每页显示记录数
      },
      noMore: false, // 没有更多
      loading: false, // 正在加载
      isProcess: false, // 接口是否处理中
      basePath: '', // 上下文
      recommendCode: '', // 推荐码
      requestUrl: ['distribution', 'distribution/sku'] // 0 分销订单请求路径  1 分销单品请求路径
    }
  },
  created () {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.querySpread()
    this.queryCustomerInfo()
  },
  filters: {
    rate (value) {
      if (value) {
        return value * 100
      }
    },
    sum (value) {
      let price = 0
      if (value.orderSkus) {
        for (let i = 0; i < value.orderSkus.length; i++) {
          if (value.commissionLevel == '1') {
            price +=
                            value.orderSkus[i].price *
                            value.orderSkus[i].commissionRate
          } else {
            price +=
                            value.orderSkus[i].price *
                            value.orderSkus[i].scommissionRate
          }
        }
      }
      return price.toFixed(2)
    },
    skuPrice (value) {
      if (value == null || value == undefined) {
        return ''
      }
      let price = parseFloat(value.price).toFixed(2)
      if (value.isBatchSku == '1') {
        price = parseFloat(value.lowestBatchPrice).toFixed(2) + '起'
      }
      return price
    }
  },
  methods: {
    infinite (done) {
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
        // 查询下级数量
    querySpread () {
      querySpreadCustomerByCustomerIdCount().then(res => {
        this.spreadCount = res
      })
    },
        // 查询用户信息
    queryCustomerInfo () {
      queryCustomerPersonalInfo().then(res => {
        if (res.flag == '1') {
          this.customerInfo.commission = res.data.commission
          this.customerInfo.selfRecommendCode =
                        res.data.selfRecommendCode
          if (res.data.recommended != -1) {
            this.suggestType = true
          }
          queryBaseInfoSet().then(baseInfo => {
            if (baseInfo.flag == 1) {
              this.basePath = baseInfo.data.h5CallBackDomain
            }
          })
        }
      })
    },
        // 分页查询页面数据
    getData () {
      queryPageData(this.listQuery, this.requestUrl[this.tabValue]).then(
         response => {
           let list = response.data
           this.listQuery.pageNum++
           if (list.length > 0) {
             this.pageList = this.pageList.concat(list)
           }
           this.loading = false
           if (list.length < 10) {
             this.noMore = true
           }
         }
      )
    },
        // 跳转到推广链接 和 推广二维码
    toSpreadCode () {
      this.$router.push({
        path: '/myspreadcode',
        query: {
          basePath: this.basePath,
          selfRecommendCode: this.customerInfo.selfRecommendCode
        }
      })
    },
        // 修改列表类型
    tabChange (index) {
            // 页面数据清空
      this.pageList = []
            // 页码归零
      this.listQuery.pageNum = 0
            // 重置标记
      this.noMore = false
            // 如果没有下级且是单品列表 不开启无限加载插件
      if (!this.suggestType && index == 1) {
          // 这是啥
      } else {
                // 重新开启无限加载插件
        this._done()
      }
    },
        // 保存推荐码
    bindRecommendCode () {
      if (!this.recommendCode || this.recommendCode.trim() == '') {
        this.$vux.toast.text('请输入推荐码', 'middle')
        return
      }

      if (this.isProcess) {
        return
      }
      this.isProcess = true

      bindRecommendCode(this.recommendCode).then(res => {
        this.isProcess = false
        if (res == 1) {
          this.suggestType = true
                    // 重新开启无限加载插件
          this._done()
        } else if (res == -1) {
          this.$vux.toast.text('用户不存在', 'middle')
        } else if (res == -2) {
          this.$vux.toast.text('您已经绑定过推荐码', 'middle')
        } else if (res == -3) {
          this.$vux.toast.text('推荐人不存在', 'middle')
        } else if (res == -4) {
          this.$vux.toast.text('推荐人不能是自己', 'middle')
        } else {
          this.$vux.toast.text('未知错误，请刷新后重试', 'middle')
        }
      })
    },
        // 跳转佣金记录页面
    toMySpreadRecord () {
      this.$router.push({ path: '/myspreadrecord' })
    },
        // 跳转商品详情页
    tospudetail (item) {
      this.$router.push({ path: '/spudetail', query: { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 } })
    },
        // 返回用户个人中心页面
    backCustomerCenter () {
      this.$router.push({ path: '/home' })
    }
  }
}
</script>
