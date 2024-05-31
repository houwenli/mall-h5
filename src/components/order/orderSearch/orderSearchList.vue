<template>
  <div class="contentBox">
    <div class="order-header">
      <header-search @toBack="toBack"></header-search>

      <div class="searchBox">
        <div class="inputBox" @click="toSearch">
          <input ref="search" v-model.trim="searchValue" type="text" class="searchinput" placeholder="输入商品名称/订单编号" />
        </div>     
      </div>
    </div>


    <!-- 订单列表 -->
    <div class="order-content">
      <!-- 轮播 -->  
      <div class="swiper-box" v-if="swipeConfig && swipeConfig.list && swipeConfig.list.length > 0">
        <swipe :config="swipeConfig"></swipe>
      </div>
      <loadding-page v-if="pageList.length == 0 && !upFinished"></loadding-page>
      <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" :disabled="true" v-else>
        <van-list v-model="isUpLoading" :finished="upFinished" :offset="100" finished-text="没有更多数据" @load="onLoadList" v-if="pageList.length > 0">
          <order-list-item v-for="(temp, index) in pageList" :key="index" :orderItem="temp" @orderOperation="orderOperation"></order-list-item>
        </van-list>
        <!-- 无列表数据 -->
        <div class="nodatabox" v-if="pageList.length == 0">
          <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png" alt="" />
          <p>您暂时没有相关订单～</p>
          <div class="nodata-btn" @click="goToGoods">去选购相关商品</div>
        </div>
      </van-pull-refresh>
    </div>

    <!-- 热销商品 -->
    <div class="xq_wntj" v-if="upFinished">
      <shopList :title="'热销商品'" :titleImg="true" :botTip="'见底啦~不如去'"></shopList>
    </div>

    <orderSecondConfirm ref="orderSecondConfirm" @confirmResearch="confirmResearch"></orderSecondConfirm>
   
  </div>
</template>

<script>
  import headerSearch from './headerSearch.vue'
  import {  Toast } from 'vant'
  import swipe from '@/components/index/template/swipe/index.vue'
  import { queryOrderList, judgeRefund, selectWsOrderInfoByOrderId, deleteOrder, confirmReceipt } from '@/api/orderlist'
  import orderListItem from '../components/orderListItem.vue'
  import { queryPersonConfigTemp } from '@/api/home'
  import orderSecondConfirm from '@/components/order/components/orderSecondConfirm'
  import loaddingPage from '@/components/order/components/loaddingPage'
  import shopList from '@/components/commons/shopList'
  export default {
    name: 'searchPath',
    components: {  
      headerSearch,
      [Toast.name]: Toast,
      swipe,
      orderListItem,
      loaddingPage,
      orderSecondConfirm,
      shopList
    },
    data() {
      return {      
        searchValue: this.$route.query.queryString || '', // 搜索的内容
        historyData: [], // 搜索历史数据     
        swipeConfig: null,
        isDownLoading: true, //  否处于加载状态
        isUpLoading: false, //  否处于加载状态
        upFinished: false, //  	是否已加载完成
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        listQuery: {   
          status: -1, // TODO暂且留着     
          queryString: this.$route.query.queryString, // 查询字段, 支持订单号（全词匹配）和商品名（模糊查询)
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
      }
    },   
    mounted() {    
      this.queryPersonConfigTemp()    
      this.getData() 
    },
    methods: {
      // 查询轮播配置
      queryPersonConfigTemp(){
        queryPersonConfigTemp(104).then(res=>{
          if(res.code==200){
            let swipeConfigswipeConfig  = JSON.parse(res.data.content) || {}
            this.swipeConfig = swipeConfigswipeConfig.contentList[0] || null
            // 过滤掉没有图片的轮播
            if (this.swipeConfig && this.swipeConfig.list && this.swipeConfig.list.length > 0) {
              this.swipeConfig.list = this.swipeConfig.list.filter((item) => {
                return item.url
              })
            }
          } else {
            this.swipeConfig = null
          }
        }).catch(()=>{
          this.swipeConfig = null
        })
      },
      goToGoods(){
        this.$router.push({
          path: '/spulist',
          query: { queryString: this.$route.query.queryString },
        })
      },
      toSearch(){
        // this.$router.replace({ path: '/orderSearch', query: {  placeholderText: this.$route.query.queryString } }) 
        this.$router.replace({ path: '/orderSearch', query: {  queryString: this.$route.query.queryString } })      
      },
      // 滚动条与底部距离小于 offset 时触发
      onLoadList() {     
        this.listQuery.pageNum++
        this.getData()
      },
      // 上下拉操作
      onDownRefresh() {      
        this.listQuery.pageNum = 0
        this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件     
        this.isUpLoading = false       
        this.getData() // 加载数据
      },
       //获取数据
       getData() {
        let that = this
        setTimeout(
          () => {
            queryOrderList(this.listQuery).then((res) => {
              if (res.code == 200) {
                that.loading = false //数据请成功后
                that.isUpLoading = false
                that.isDownLoading = false

                let list = res.data.list || []
                list.forEach(item => {
                  if(item.status == 1) {
                    let nowTime = new Date().getTime()
                    let orderCreatedTime = '2023-4-7 15:59:00'
                    item.time = 30 * 60 * 1000 - (nowTime - new Date(orderCreatedTime.replace(/-/g, '/')).getTime())
                  }
                })              
                if (list == null || list.length === 0) {
                  // 加载结束
                  that.upFinished = true
                }
                if (list.length < that.listQuery.pageSize) {
                  // 最后一页不足10条的情况
                  that.upFinished = true
                }
                if (that.listQuery.pageNum === 0) {
                  that.pageList = list
                } else {
                  that.pageList = that.pageList.concat(list)
                }
              }
            })
          },
          that.isDownLoading ? 600 : 0
        )
      },
      toBack() {                
        this.$router.go(-1)       
      },

      // 确认收货
      async orderOperation(data, text) {
        this.$refs.orderSecondConfirm.orderOperation(data, text)
      },

      // 确认收货删除二次确认弹窗后执行方法
      confirmResearch() {
        this.pageList = []
        this.listQuery.pageNum = 0
        this.getData()
      }
    },
  }
</script>

<style scoped lang="less">
  .contentBox {
    background: #F6F6F6;
    height: 100vh;
  }
   .order-header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 999;   
    .searchBox {
      padding-left: 12px;
      padding-right: 12px;
      display: flex;
      height: 50px;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      .backleft {
        margin: 0 10px;
        width: 24px;
        height: 24px;
        .searchLeft {
          width: 24px;
          height: 24px;
        }
      }
      .inputBox {
        height: 32px;
        border-radius: 18px;
        font-size: 14px;
        // width: 100%;
        flex: 1;
        position: relative;
        // margin-right: 6px;
        background: url('~@/assets/img/search_grey@2x.png') no-repeat 8px center #f2f2f2;
        background-size: 24px;
        .searchinput {
          position: absolute;
          top: 0;
          left: 35px;
          width: 235px;
          height: 100%;
          background-color: #f2f2f2;
          border: none;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000;
          &::-webkit-input-placeholder {          
            color: #C6C6C6;
          }
        }
      }
      input.searchinput {
        caret-color: rgba(255, 15, 54, 1);
      }   
    } 
  }
  .swiper-box{
    margin-top: 10px;
  }
  .order-content{
    padding-top: 94px;
  }
  .nodatabox {
    margin-top: 32px;
    margin-bottom: 52px;
    text-align: center;
    img {
      width: 160px;
      height: 160px;
      margin-bottom: 8px;
    }
    p {
      color: #444444;
      font-size: 13px;
    }
    .nodata-btn{
      width: 160px;
      height: 40px;
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      border-radius: 20px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFF9E9;
      line-height: 40px;
      margin: 10px auto;
    }
  }
  .loading-style{
    margin-top: 4px;
    height: 500px;
    max-height: 600px;
    background: #F5F5F8;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    .loading-style-box{
      padding-top: 185px;
      display: flex;
      align-items: center;
      flex-direction: column;
      header{
        width: 80px;
        margin-bottom: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        span{
          background: #DE3A38;
          border-radius: 50%;
        }
        span:nth-of-type(1){
          width: 10px;
          height: 10px;
        }
        span:nth-of-type(2){
          width: 16px;
          height: 16px;
          margin: 0 11px;
        }
        span:nth-of-type(3){
          width: 10px;
          height: 10px;
        }
      }
      footer{
        width: 80px;
        text-align: center;
        font-size: 10px;
        color: #90969E;
      }
    }
}
.xq_wntj {
  padding: 0 12px;
}
/deep/ .swipe {  
  margin: 0 8px!important;
  img {
    border-radius: 12px;
  }
}
</style>
