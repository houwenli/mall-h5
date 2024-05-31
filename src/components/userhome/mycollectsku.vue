<template>
  <div class="goods-sku-collection" ref="backTop" :class="[returntop ? 'backtopactive' : '']">
    <van-nav-bar title="商品收藏" left-arrow fixed  @click-left="backCustomerCenter" @click-right="clearCollection">
      <template #right>
        <img src="@/assets/img/goodsDetail/close.png" />清空
      </template>
    </van-nav-bar>
    
    <div class="background-line gray-bg"></div>
    
    <!-- <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider> -->
    <div class="loading" v-if="isLoading">
      <van-loading />
      <span class="tag">正在加载中</span>
    </div>
     <!-- 缺省页 -->
    <div v-else>
      <van-list
        v-if="pageList.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="我也是有底线的~"
        :immediate-check="false"
        :offset="100"
        @load="onLoad"
      >
        <ul v-if="pageList.length > 0" class="sku-list clearfix gray-bg">
          <li v-for="(item, index) in pageList" :key="index" class="sku-list-item">
            <van-swipe-cell>
              <productList
                class="productList"
                ref="productList"
                :item="item"
                :key="pageList.length"
                :isStatus="true"
                :isCart="true"
                @addShoppingCart="addShoppingCart"
              ></productList>
              <template #right>
                <van-button square type="danger" @click="RemoveSku($event, item.id, item)">
                  <p>取消</p>
                  <p>收藏</p>
                </van-button>
              </template>
            </van-swipe-cell>
          </li>
        </ul>
      </van-list>
      <div v-else class="wrap">
        <img style="width: 90px; height: 90px" src="../../assets/img/cat_e@2x.png" alt="" />
        <div class="news-text">没有收藏任何商品~</div>
      </div>
    </div>

   

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop" @click="backtop" >
      <img src="@/assets/img/goodsDetail/go_top.png" alt />
        <span>顶部</span>
    </div>
  </div>
</template>

<script>
import { SwipeCell, List, Dialog, Toast , Divider,Loading } from 'vant'
import { addShoppingCart } from '@/api/spudetail' // 加入购物车接口
import { getSpuDiscountList } from '@/api/mycoupon'
import {
  queryAttentions, //查询用户收藏的单品信息
  removeAttentionsSku, // 取消用户收藏的商品信息
  clearAttentionsSku, // 清空用户收藏的商品信息
} from '@/api/mycollect'
import productList from '@/components/commons/productList.vue'

export default {
  components: {
    [SwipeCell.name]: SwipeCell,
    [List.name]: List,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    [Divider.name]: Divider,
    [Loading.name]: Loading,
    productList,
  },
  data() {
    return {
      listQuery: {
        pageNum: 0, // 当前页码
        pageSize: 10, // 每页显示记录数
      },
      incomeType: this.$route.query.type,
      pageList: [], //页面数据源
      loading: false, //正在加载
      finished: false,
      removeSku: {
        skuId: '',
      },
      isshowtop: false, // 回到顶部
      returntop: false, // 返回顶部
      isLoading: true
    }
  },
  created() {
    document.body.removeAttribute('class', 'gray-bg')
    this.getData()
  },
  filters: {
    price(value) {
      // if (value == null || value == undefined) {
      //   return ''
      // }
      // let price = parseFloat(value.price).toFixed(2)
      // if (value.isBatchSku == '1') {
      //   price = parseFloat(value.lowestBatchPrice).toFixed(2) + '起'
      // }
      if (!value) {
        return ''
      }
      let price = parseFloat(value).toFixed(2)
      return price
    },
  },
  mounted() {
    // 滚动条的获取
    window.addEventListener('scroll', this.handleScroll, true)
  },
  watch: {
    isshowtop(value) {
      if (!value) this.returntop = false
    },
    pageList:{
      handler(newVal, oldVal) {
        this.pageList.map((item,index)=>{
          this.pageList[index].status=item.sku.status
        })
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 监听滚动
    handleScroll() {
      if (!this.$refs.backTop) return
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop) // 取绝对值
      // console.log('滚动了', scorllTop)
      if (scorllTop >= 2500) this.isshowtop = true
      else this.isshowtop = false
    },
    // 回到顶部
    backtop() {
      if (this.isshowtop) this.returntop = true
      else this.returntop = false
    },
    clearCollection() {
      Dialog.confirm({
        message: '是否确认清空所有商品？',
      }).then(() => {
        clearAttentionsSku().then((res) => {
          this.pageList = []
          this.listQuery.pageNum = 0
          this.getData()
        })
      })
    },
    RemoveSku(position, skuId, item) {
      let params = {
        skuId: item.skuId,
        storeId: item.storeId,
        sourceType: item.sourceType
      }
      removeAttentionsSku(params).then((res) => {
        let idx = this.pageList.indexOf(item)
        this.pageList.splice(idx, 1)
        Toast({
          message: '取消收藏成功',
          position: 'top',
        })
      })
    },
    onLoad() {
      this.listQuery.pageNum++
      this.getData()
    },
    addShoppingCart(item) {      
      let params = {
        skuId: item.skuId,
        sourceType: item.sourceType,
        storeId: item.storeId,
        num: 1,
      }
      addShoppingCart(params).then((res) => {
        if (res.code == 200) {
          switch (res.data) {
            case 0:
              Toast('加入购物车失败，请刷新后重试！')
              break
            case 1:
              Toast('成功加入购物车')
              // 重新查询购物车数量
              // this.queryCartCount()
              //重新调详情接口
              break
            case -1:
              Toast('库存不足')
              break
            case -2:
              Toast('商品不存在')
              break
            case -3:
              Toast('参数错误')
              break
            case -4:
              Toast('商品已下架')
              break
            case -5:
              Toast('达到商品限购数量')
              break
            case -6:
              Toast('预售商品不能加入购物车')
              break
            case -7:
              Toast('商品已过期')
              break
            default:
              Toast('加入购物车失败，请刷新后重试')
              break
          }
        }
      })
    },
    getData() {
      try {
        this.isLoading=true
        queryAttentions(this.listQuery).then((response) => {
          this.isLoading=false
          let list = response.data.list
          if (list.length > 0) {
            this.pageList = this.pageList.concat(list)
            this.handleCouponList(list)
          }
          this.loading = false
          if (list.length < 10) {
            this.finished = true
          }
        })
      } catch (error) {
        console.log(error)
      }
      
    },
    async handleCouponList(list) {
      try {
        const spuParam = list.map(item=>{
          return {
            spuId: item.sku.spuId,
            skuId: item.sku.id,
            beforeCouponPrice: item.salePrice || item.sku.price
          }
        })
        const res = await getSpuDiscountList(spuParam) || {}
        if(res.data) {
          this.pageList = this.pageList.map(item=>{
            let afterCouponPrice = '', couponLabelList=item.couponLabelList || []
            res.data.forEach(ele=>{
              if(item.skuId == ele.skuId) {
                afterCouponPrice = ele.afterCouponPrice
                couponLabelList = ele.couponLabelList
              }
            })
            couponLabelList = couponLabelList.map(tag=>{
              return {
                ...tag,
                text: tag.couponsType == 3?`立减￥${tag.faceValue}` : tag.couponsType == 2 ?`${tag.faceValue}折` : `满￥${tag.amountLimitation}减￥${tag.faceValue}`
              }
            })
            return {
              ...item,
              afterCouponPrice,
              couponLabelList
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    //跳转商品详情页
    tospudetail(data) {
      if (data.sku.status == 4) {
        return false
      } else {
        this.$router.push({ path: '/spudetail', query: { id: data.skuId, storeId: data.storeId, sourceType: data.sourceType || 1 } })
      }
    },
    // 返回
    backCustomerCenter() {
      this.$router.go(-1)
    },
  },
}
</script>
<style lang="less" scoped>
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2500;
  .tag{
    padding-top: 20px;
    color: #c8c9cc;
  }
}
body {
  overflow: visible;
}
.van-list{
  padding: 10px 8px;
  min-height: 100vh;
  background-color:#F6F6F6;
  /deep/.van-list__finished-text{
    color: #C3C3C3 !important;
    line-height: 14px;
    padding: 10px 0  40px;
    font-size: 11px;
  }
}
.goods-sku-collection {
  height: 100%;
  background-color: #F6F6F6;
  .wrap {
    margin-top: 3.6rem;
    text-align: center;
  }
  .news-text {
    font-size: 0.56rem;
    line-height: 0.8rem;
    color: #999999;
    margin-top: 1.2rem;
  }
  /deep/ .van-nav-bar__left .van-icon {
    color: #6d6d6d;
  }
}

.goods-sku-collection {
  height: 100%;
  .van-nav-bar__left .van-icon {
    color: #6d6d6d;
  }
  /deep/ .van-nav-bar__right {
    font-size: 11px;
    color: #999999;
    img{
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
      
  }
  .background-line {
    height: 46px;
  }
  .van-nav-bar {
    border-radius: 0 0 0.4rem 0.4rem;
  }
  .sku-list {
    .sku-list-item {
      margin-bottom: 10px;
      border-radius: 8px;
      .van-swipe-cell__wrapper {
          .shop-card{
              margin: 0;   
            }
          .van-button {
            margin-left: 8px;
            width: 70px;
            height: 100%;
            border-radius: 12px;
          }
        }
      }
    }
  }
.van-dialog {
  .van-dialog__content {
    .van-dialog__message {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .van-hairline--top::after {
    border-top-width: 0px;
  }
  .van-hairline--left::after {
    border-left-width: 0px;
  }
  .van-dialog__footer {
    height: 60px;
    .van-dialog__cancel {
      left: 10px;
      bottom: 0px;
      .van-button__text {
        color: #e60113;
      }
    }
    .van-dialog__confirm {
      left: -10px;
      bottom: 0px;
      .van-button__text {
        background-color: #e60113;
        color: #ffffff;
      }
    }
    .van-button__content {
      .van-button__text {
        border: 1px solid #e60113;
        padding: 7px 35px;
        border-radius: 15px;
        font-size: 12px;
      }
    }
  }
}
.returntopBox {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 88px;
  right: 12px;
  width: 40px;
  height: 40px;
  z-index: 99;
  opacity: 0.8;
  background: #191919;
  border-radius: 20px;
  >img {
    margin-top: 4px;
    width: 14px;
    height: 18px;
  }
  span{
    font-size: 11px;
    font-weight: 400;
    color: #FFF;
  }
}
.backtopactive {
  position: fixed;
  top: 0;
}
</style>
