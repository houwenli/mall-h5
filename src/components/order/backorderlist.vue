<template>
  <div class="boxwrapper" ref="backTop" :class="[returntop ? 'backtopactive' : '']" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <top-header class="nav-top" :title="'退换/售后'" @clickBack="back"></top-header>
    <div class="search-box">
      <div class="input-wrapper">
        <img class="input-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/search-icon.png" alt="" />
        <input class="value-box" @input="search" type="text" placeholder="商品名称/订单编号/服务单号" v-model="datalist.name" />
      </div>
      <div class="right-filter" @click="openFilter">
        <span>筛选</span>
        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/filter-icon.png" alt="" />
      </div>
    </div>

    <van-tabs v-model="activedata" @change="tabsActive(activedata)" animated class="tanbsbox">
      <van-tab v-for="(item, i) in listData" :key="i" :title="item.title" :name="item.name"></van-tab>
    </van-tabs>

    <!-- 列表 -->
    <div v-if="ComentListData && ComentListData.length > 0" class="van_lits_box">
      <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" :disabled="true" class="listbox">
        <van-list
          v-model="isUpLoading"
          :finished="upFinished"
          :offset="100"
          finished-text="没有更多订单了~"
          @load="onLoadList"
          v-if="ComentListData.length > 0"
        >
          <!-- 退换售后订单 -->
          <afterSaleGoods
            :ComentListData="ComentListData"
            :activedata="activedata"
            @getdataList="getdataList"
            @operationOrder="operationOrder"
            @toTabs="toTabs"
            @toTabsResolved="toTabsResolved"
          ></afterSaleGoods>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="nodata" v-if="!ComentListData">
      <img src="../../assets/img/cat_d@2x.png" class="nodataimg" alt="" />
      <p>没有退款/售后的商品哦〜</p>
    </div>

    <!-- 二次确认 -->
    <SecondConfirm
      textshow
      :title="titieTextMap[isType]"
      :textp="textpMap[isType]"
      :cancleText="cancleTextMap[isType]"
      :sureText="sureTextMap[isType]"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
      class="SecondConfirmbox"
    ></SecondConfirm>

    <!-- 筛选弹窗 -->
    <filter-dialog ref="filterDialog" @changeFilter="changeFilter"></filter-dialog>

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop">
      <img :src="$oss + '/distribution/back_top.png'" class="returntop" @click="backtop" alt="" />
    </div>
  </div>
</template>

<script>
  import afterSaleGoods from './afterSale/afterSaleGoods'
  import TopHeader from './components/topHeader.vue'
  import FilterDialog from './components/filterDialog.vue'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import { Toast, Tab, Tabs, List, PullRefresh, Rate } from 'vant'
  import { querySaleApplyList, querySaledList, cancleApplySale, queryCompletedList, auditReceipt, checkOrderTraces } from '@/api/backorderlist'
  import { confirmReceipt, judgeRefund } from '@/api/orderlist'
  import { debounce } from '@/utils/utils'
  export default {
    components: {
      TopHeader, // navtop顶部
      SecondConfirm, // 二次确认弹窗
      afterSaleGoods, // 售后商品
      [Tabs.name]: Tabs,
      [Tab.name]: Tab,
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
      [Rate.name]: Rate,
      FilterDialog,
    },
    data() {
      return {
        titieTextMap: {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '确认申请重新邮寄',
        },
        textpMap: {
          1: '你是否已经收到商品',
          2: '抱歉，您已错过售后申请时效',
          3: '确认取消售后申请？',
          5: '您是否收到该订单商品？',
          6: '订单中商品已存在申请退款商品,是否确认收货？',
          7: '根据物流显示商品已签收，请仔细核实商品状态，否则商家可能会拒绝重新邮寄',
        },
        cancleTextMap: {
          1: '未收货',
          2: '取消',
          3: '返回',
          5: '未收货',
          7: '再想想',
        },
        sureTextMap: {
          1: '已收货',
          2: '联系商家',
          3: '确认取消',
          5: '已收货',
          7: '提交',
        },
        ComentListData: null,
        listData: [
          { title: '售后申请', name: '1' },
          { title: '处理中', name: '2' },
          { title: '申请记录', name: '3' },
        ],
        isDownLoading: false, //  清空列表数据
        isUpLoading: false, //  自定义底部加载中提示
        upFinished: false, //  	自定义加载完成后的提示文案
        // activedata: this.$route.query.activedata ? this.$route.query.activedata : 1,
        activedata: 1,
        datalist: {
          pageNum: 0,
          pageSize: 10,
          orderSkuId: '',
          name: '',
          timeType: '0',
        },
        isType: '', // 1 :收货弹窗   2：申请售后
        dialogshow: false, // 二次确认弹窗
        orderid: '',
        id: '',
        isshowtop: false, // 回到顶部
        returntop: false, // 返回顶部
        backOrderType: null,
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'

      console.log('this.$route.query.activedata', this.$route.query.activedata)
      if (this.$route.query.activedata && this.$route.query.activedata == 3) {
        this.activedata = 3
        this.tabsActive(3)
      } else {
        this.getdataList()
      }
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('scroll', this.handleScroll, true)
      })
    },
    watch: {
      isshowtop(value) {
        if (!value) this.returntop = false
      },
    },
    methods: {
      // 监听滚动
      handleScroll() {
        if (!this.$refs.backTop) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop) // 取绝对值
        // console.log('滚动了', scorllTop)
        if (scorllTop >= 200) this.isshowtop = true
        else this.isshowtop = false
      },
      // 回到顶部
      backtop() {
        if (this.isshowtop) this.returntop = true
        else this.returntop = false
      },
      // 切换至tabs 3
      toTabs(data) {
        this.datalist.queryType = 0
        this.datalist.orderSkuId = data.orderSkuId
        this.tabsActive(3)
      },
      toTabsResolved(data) {
        // 点击已解决 跳转获取已解决申请记录列表
        let params = {
          id: data.id,
        }
        queryCompletedList(params).then((res) => {
          this.tabsActive(3)
        })
      },
      //操作
      async operationOrder(param) {
        console.log('param', param)
        this.backOrderType = param.goodsInfo.backOrderType
        this.isType = param.isType
        this.orderid = param.orderid
        this.id = param.id
        if (this.isType == 1) {
          try {
            let res = await judgeRefund({ orderId: this.orderid })
            if (res.code == 200) {
              //有退款
              if (res.data == 2002) {
                this.isType = 6
              } else {
                this.isType = 1
              }
            } else {
              Toast(res.msg)
              return
            }
          } catch (error) {
            console.log(error)
            return
          }
          // 确认收货弹窗
          this.dialogshow = param.dialogshow
        }
        if (this.isType == 2) {
          if (param.goodsInfo.overDueStatus == 1) {
            // 售后时间已过
            this.dialogshow = param.dialogshow
          } else {
            console.log(param.receivingTime, 111111111111)
            // 申请售后
            this.$router.push({
              path: '/applyAfterSale',
              query: {
                orderId: this.orderid,
                overDueStatus: param.goodsInfo.overDueStatus,
                storeName: param.goodsInfo.storeName,
                skuInfo: JSON.stringify(param.goodsInfo.skuList[param.index]),
                orderType: param.goodsInfo.orderType,
                receivingTime: param.receivingTime,
              },
            })
          }
        }
        if (this.isType == 3) {
          this.dialogshow = param.dialogshow
        } else if (this.isType == 4) {
          //查看物流
          this.$router.push({
            path: '/tracesOrder',
            query: {
              backOrderId: param.id,
              postType: 1,
              from: 'backOrder',
            },
          })
        } else if (this.isType == 5) {
          //换货 确认收货
          this.id = param.id
          this.dialogshow = param.dialogshow
        }
      }, // 弹窗左按钮
      closeBack() {
        if (this.backOrderType == 4) {
          //第三方供应商，直接关闭弹窗即可
          this.dialogshow = false
          return
        }
        if (this.isType == 5) {
          checkOrderTraces({ backOrderId: this.id })
            .then((res) => {
              if (res.code === 200) {
                this.noReceipt()
              } else {
                this.$nextTick(() => {
                  this.isType = 7
                  this.dialogshow = true
                })
              }
            })
            .catch((err) => {
              this.$nextTick(() => {
                this.confirmType = 3
              })
            })
        }
        this.dialogshow = false
      },

      noReceipt() {
        let param = {
          id: this.id,
          isReceipt: 0,
        }
        auditReceipt(param).then((res) => {
          if (res.code == 200) {
            this.dialogshow = false
            Toast('操作成功')
            this.getdataList()
          } else {
            Toast(res.description)
          }
        })
      },

      // 弹窗右按钮
      rightEvent() {
        if (this.isType == 1 || this.isType == 6) {
          confirmReceipt(this.orderid).then((res) => {
            this.dialogshow = false // 关闭弹窗
            if (res.code == 200) {
              Toast('确认收货成功')
              this.getdataList()
            } else {
              // Toast('确认收货失败')
              Toast(res.description)
            }
          })
        } else if (this.isType == 2) {
          window.ysf('open')
          // let a = document.createElement('a')
          // a.setAttribute('href', 'tel:0755-23061865')
          // a.click()
          // a.remove()
        } else if (this.isType == 3) {
          console.log('确认取消')
          let param = {
            id: this.id,
          }
          cancleApplySale(param).then((res) => {
            console.log(res, 'quxiao')
            if (res.code == 200) {
              this.dialogshow = false
              this.getdataList()
            } else {
              Toast(res.description)
            }
          })
        } else if (this.isType == 5) {
          let data = {
            id: this.id,
            isReceipt: 1,
          }
          auditReceipt(data).then((res) => {
            this.dialogshow = false // 关闭弹窗
            if (res.code == 200) {
              Toast('确认收货成功')
              this.getdataList()
            } else {
              Toast(res.description)
            }
          })
        } else if (this.isType === 7) {
          this.noReceipt()
        }
      },
      onDownRefresh() {
        this.datalist.pageNum = 0
        this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
        this.isDownLoading = true
        // this.isUpLoading = true
        this.getdataList() // 加载数据
      },
      // 滚动条与底部距离小于 offset 时触发
      onLoadList() {
        this.datalist.pageNum++
        this.getdataList()
      },
      // 列表
      getdataList() {
        let _self = this
        // 待评价列表
        if (this.activedata == 1) {
          querySaleApplyList(this.datalist).then((res) => {
            if (res.code == 200) {
              let data = (res.data.list || []).map((item) => {
                return { ...item, more: true }
              })
              this.freshdata(data)
            }
          })
        } else {
          querySaledList(this.datalist).then((res) => {
            if (res.code == 200) {
              let data = res.data.list || []
              this.freshdata(data)
            }
          })
        }
      },
      // 列表
      freshdata(data) {
        let _self = this
        _self.isUpLoading = false
        _self.isDownLoading = false
        if (!data || data.length == 0) {
          _self.isUpLoading = false
        }
        if (data.length < _self.datalist.pageSize) {
          // 最后一页不足10条的情况
          _self.upFinished = true
        }
        if (_self.datalist.pageNum === 0) {
          _self.ComentListData = data && data.length > 0 ? data : null
        } else {
          _self.ComentListData = _self.ComentListData.concat(data)
        }
        //  售后申请数量跳转后清空
        if (this.datalist.orderSkuId) {
          this.datalist.orderSkuId = ''
        }
      },
      // 切换
      tabsActive(val) {
        if (val) {
          this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
          this.isDownLoading = false
          this.isUpLoading = false
          this.activedata = val.toString()
          this.datalist.pageNum = 0
          this.datalist.pageSize = 10
          this.datalist.name = ''
          this.datalist.timeType = '0'
          if (val == 2) this.datalist.queryType = 1
          else if (val == 3) this.datalist.queryType = 0
          this.ComentListData = []
          this.getdataList()
        }
      },
      back() {
        this.$router.push({
          path: '/home',
        })
      },
      openFilter() {
        this.$refs.filterDialog.init({
          timeType: this.datalist.timeType,
        })
      },
      changeFilter(data) {
        this.datalist.timeType = data.id || '0'
        this.datalist.pageNum = 0
        this.datalist.pageSize = 10
        this.ComentListData = []
        this.getdataList()
      },
      search: debounce(
        function() {
          this.datalist.pageNum = 0
          this.datalist.pageSize = 10
          this.ComentListData = []
          this.getdataList()
        },
        500,
        false
      ),
    },
  }
</script>

<style scoped lang="less">
  .boxwrapper {
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    .tabswrapper {
      width: 100%;
      // background-color: #fff;
      border-radius: 0 0 0.4rem 0.4rem;
      flex: 1;
      .tanbsbox {
        width: 100%;
        display: flex;
        flex-direction: column;
        /deep/ .van-tabs__wrap {
          height: 38px;
          // position: fixed;
          left: 0px;
          top: 88px;
          width: 100%;
          // z-index: 1;
        }
        /deep/ .van-tabs__line {
          bottom: 22px;
          width: 27px;
          height: 4px;
          border-radius: 2px;
          z-index: unset;
          background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
        }
        /deep/ .van-tab {
          color: #000;
          padding-top: 6px;
          padding-bottom: 15px;
        }
        /deep/ .van-tab--active {
          font-weight: bold;
        }
        /deep/ .van-tabs__content {
          flex: 1;
          // padding-top: 126px;
          // padding-bottom: 48px;
        }
        .listbox {
          color: #000;
          /deep/ .van-list__finished-text {
            font-size: 11px;
            color: #c3c3c3;
          }
        }
      }
    }

    .van_lits_box {
      flex: 1;
      overflow: auto;
    }

    .nodata {
      display: block;
      margin: 0 auto;
      position: absolute;
      left: 50%;
      top: 50%;
      text-align: center;
      transform: translate(-50%, -50%);
      .nodataimg {
        width: 3.6rem;
        height: 3.6rem;
      }
      p {
        color: #999;
        font-size: 0.56rem;
        margin-top: 0.2rem;
      }
    }
    // .nav-top {
    // position: fixed;
    // width: 100%;
    // z-index: 1;
    // top: 0;
    // }
    .search-box {
      // position: fixed;
      width: 100%;
      // z-index: 1;
      top: 44px;
      background: #fff;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      height: 44px;
      .input-wrapper {
        flex: 1;
        background: #f2f2f2;
        height: 32px;
        border-radius: 16px;
        margin-right: 12px;
        padding-left: 8px;
        display: flex;
        align-items: center;
        .input-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        .value-box {
          flex: 1;
          background: transparent;
          font-size: 14px;
          &::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */
            color: #c6c6c6;
            font-size: 14px;
          }
        }
      }
      .right-filter {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #444;
        > img {
          width: 16px;
          height: 16px;
          margin-left: 6px;
        }
      }
    }
  }
  .nodatabg {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  .returntopBox {
    width: 100%;
    .returntop {
      width: 1.6rem;
      height: 1.6rem;
      position: fixed;
      bottom: 2.6rem;
      right: 0.48rem;
    }
  }
  .backtopactive {
    position: fixed;
    top: 0;
  }
</style>
