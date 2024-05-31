<template>
  <div class="boxwrapper" :class="{'nodatabg':ComentListData.length == 0}">
    <navBartop :title="'评价中心'" :isConfirm="false" @clickBack="back" class="navtop"></navBartop>

    <div class="tabswrapper">
      <van-tabs v-model="activedata" @click="tabsActive(activedata)" animated class="tanbsbox">
        <van-tab v-for="(item,i) in listData" :key="i" :title='item.title' :name='item.name'>
          <!-- 列表 -->
          <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" :disabled="true" class="listbox">
            <van-list
              v-model="isUpLoading"
              :finished="upFinished"
              :offset="100"
              finished-text="没有更多数据"
              @load="onLoadList"
              v-if="ComentListData.length > 0"
            >
              <div class="commentbox" v-for="(tes,i) in ComentListData" :key="i">
                <!-- <p class="storename" @click="tostore(tes.storeId)">
                  <img src="../../assets/img/Shop2.png" class="storeimg" alt="">
                  <span class="name">{{tes.storeName}}</span> 
                  <img src="../../assets/img/cat_more@2x.png" class="storeRightimg" alt="">
                </p> -->
                <div class="goodsbox">
                  <img :src="tes.skuImage" alt="" class="goodsimg" @click="togoodsdetail(tes)">
                  <div class="goodsnamebox" v-if="activedata == 1" @click="togoodsdetail(tes)">
                    {{tes.skuName}}
                  </div>
                  <div class="goodsInfoBox" v-else>
                    <p class="overline goodsname">{{tes.skuName}}</p>
                    <div class="goodsInfo">
                      <div>
                        <label class="grade">评分</label>
                        <van-rate v-model="tes.score" :size="10" color="#E60113" void-icon="star" void-color="#eee" readonly />
                      </div>
                      <span class="anonymous" v-if="tes.anonymous == 1">已匿名</span>
                    </div>
                  </div>
                </div>

                <div class="comment" @click="comment(tes)"  v-if="activedata == 1">
                  <span class="border_half">评价</span>
                </div>
                <div v-else class="commentcontent">
                  {{tes.comment}}
                </div>
              </div>
              
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <!-- <van-tab :name='2' title='已评价'></van-tab> -->
      </van-tabs>
    </div>
    
    <div class="nodata" v-if="ComentListData.length == 0">
      <img src="../../assets/img/cat_d@2x.png" class="nodataimg" alt="">
      <p>没有已评价的商品哦〜</p>
    </div>
  </div>
</template>

<script>
import navBartop from '@/components/commons/navBartop'
import { Button, Toast, Field, Popup,Tab, Tabs, List, PullRefresh, Rate } from 'vant'

import { unevaluatedList, evaluatedList } from '@/api/comments'
import { appBack }  from '@/utils/utils'
export default {
  components:{
    navBartop,
    [Tabs.name]:Tabs,
    [Tab.name]:Tab,
    [List.name]:List,
    [PullRefresh.name]:PullRefresh,
    [Rate.name]:Rate,
  },
  data() {
    return{
      ComentListData:[],
      listData:[
        {title:'待评价',name:'1'},
        {title:'已评价',name:'2'},
      ],
      isDownLoading:false,  //  清空列表数据
      isUpLoading:false,  //  自定义底部加载中提示
      upFinished:false,  //  	自定义加载完成后的提示文案
      activedata:1,
      datalist:{
        pageNum:0,
        pageSize:10,
        orderIds: JSON.parse(this.$route.query.orderIds)
      }
    }
  },
  created() {
    this.getdataList()
  },  
  methods:{ 
    onDownRefresh() {
      this.datalist.pageNum = 0
      this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.isDownLoading = true
      // this.isUpLoading = true
      this.getdataList() // 加载数据
    },
    // 滚动条与底部距离小于 offset 时触发
    onLoadList() {
      this.datalist.pageNum ++;
      this.getdataList()
    },
    // 列表
    getdataList() {
      let _self = this
      // 待评价列表
      if (this.activedata == 1) {
        // setTimeout(() => {
          unevaluatedList(this.datalist).then(res => {
            console.log('待评价', res);
            if(res.code == 200) {
              let data = res.data.list
              this.freshdata(data)
            }
          })
        // },400)
      } else {
        evaluatedList(this.datalist).then(res => {
          console.log('已评价', res);
          if(res.code == 200) {
            let data = res.data.list
            this.freshdata(data)
          }
        })
      }
    },
    // 跳转商品详情
    togoodsdetail(tes) {
      if(tes.goodsSource == 4) {
        this.$router.push({ path: '/motorCar/detail', query:{skuId: tes.skuId}})
      } else {
        this.$router.push({path: '/spudetail', query: {id: tes.skuId}})
      }
      
    },
    freshdata(data) {
      let _self = this
      _self.isUpLoading = false
      _self.isDownLoading = false
      if (!data || data.length == 0){
        _self.isUpLoading = false
      }
      if (data.length < _self.datalist.pageSize) {
        // 最后一页不足10条的情况
        _self.upFinished = true
      }
      if (_self.datalist.pageNum === 0) {
        _self.ComentListData = data;
      } else {
        _self.ComentListData = _self.ComentListData.concat(data)
      }
    },
    // 去评价页
    comment(data) {
      // console.log('评价商品',data);
      this.$router.push({
        path:'/comment',
        query:data
      })
    },
    // 跳转店铺
    tostore(id) {
      this.$router.push('/storeindex?storeId=' + id)
    },
    // 切换评价
    tabsActive(val) {
      if (val) {
        this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
        // this.isDownLoading = false
        this.isUpLoading = false
        this.isDownLoading = true
        this.activedata = val
        this.datalist.pageNum = 0;
        this.datalist.pageSize = 10;
        this.ComentListData = []
        this.getdataList()
      }
    },
    back() {
      appBack(this)   
    },
  }
}
</script>

<style scoped lang="less">
  .boxwrapper{
    background-color: #F5F5F5;
    .tabswrapper{
        width: 100%;
        // background-color: #fff;
        border-radius: 0 0 0.4rem 0.4rem;
        .tanbsbox{
          width: 100%;
          /deep/ .van-tabs__wrap{
            height: 2rem;
            border-radius: 0 0 0.4rem 0.4rem; 
            position: fixed;
            left: 0px;
            top: 1.76rem;
            width: 100%;
            z-index: 1;
          }
          /deep/ .van-tabs__line{
              bottom: 0.96rem;
              width: 1.2rem;
              border-radius: 6rem;
              z-index: unset;
          }
          /deep/ .van-tab{
              color: #000;
          }
          /deep/ .van-tab--active{
            font-weight:bold;
          }
          /deep/ .van-tabs__content{
            margin-top: 2rem;
          }
          .listbox{
            color: #000;
            .commentbox{
              background-color: #fff;
              border-radius: 0.4rem;
              margin-top: 0.48rem;
              padding: 0.6rem 0.72rem 0.8rem;
              .storename{
                font-weight: bold;
                font-size: 0.6rem;
                display: flex;
                align-items: center;
                .storeimg{
                  width: 0.64rem;
                  height: 0.64rem;
                }
                .storeRightimg{
                  width: 0.16rem;
                  height: 0.4rem;
                  margin-top: 0.08rem;
                }
                .name{
                  display: inline-block;
                  max-width: 8.4rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  margin: 0 0.36rem 0 0.12rem;
                }
              }
              .goodsbox{
                display: flex;
                align-items: flex-start;
                margin-top: 0.6rem;
                width: 100%;
                // position: relative;
                .goodsimg{
                  width: 3.2rem;
                  height: 3.2rem;
                  border-radius: 0.2rem;
                  border: 1px solid #eee;
                }
                .goodsnamebox{
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  width: 9.8rem;
                  font-size: 0.52rem;
                  margin-left: 0.48rem;
                }
                .goodsInfoBox{
                  width: 9.92rem;
                  display: flex;
                  justify-content: space-around;
                  flex-direction: column;
                  margin: 0.4rem 0 0.4rem 0.48rem;
                  font-size: 0.52rem;
                  .goodsname{
                    color: #999;
                  }
                  .goodsInfo{
                    display: flex;
                    justify-content: space-between;
                    margin-top: 0.56rem;
                    .grade{
                      margin-right: 0.12rem;
                    }
                    .anonymous{
                      color: #ccc;
                    }
                  }
                }
              }
              .comment{
                text-align: right;
                margin-top: -0.4rem;
                span{
                  width: 3.04rem;
                  height: 1.2rem;
                  text-align: center;
                  line-height: 1.2rem;
                  // border: 1px solid #E60113;
                  color: #E60113;
                  display: inline-block;
                  border-radius: 0.6rem;
                  position: relative;
                }
                .border_half::after{
                  border-color: #E60113;
                }
              }
              .commentcontent{
                margin-top: 0.48rem;
                font-size: 0.52rem;
                word-break: break-all;
                word-wrap: break-word;
              }
            }
          }
        }
        
    }
    
    .nodata{
      margin: 4.4rem auto 0;
      text-align: center;
      .nodataimg{
        width: 3.6rem;
        height: 3.6rem;
      }
      p{
        color: #999;
        font-size: 0.56rem;
        margin-top: 0.2rem;
      }
    }
  }
  .nodatabg{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
</style>