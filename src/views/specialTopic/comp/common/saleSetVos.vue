<template>
  <div class="sale-box" :style="bgStyle">
    <div class="sale-box-wrapper">
      <div class="sale-item" v-for="(item,index) in data.imgList" :key="index">
        <div class="left" @click="toDetail(item)">
          <img class="main-img" :src="item.imgUrl" alt="商品">
          <div class="price"><span class="coin">￥</span><span class="int-price">{{item.price | getPriceInt}}</span><span class="precision">{{item.price | getPricePrecision}}</span></div>
          <img class="grade" src="@/assets/img/first.png" alt="" v-if="index == 0">
          <img class="grade" src="@/assets/img/second.png" alt="" v-if="index == 1">
          <img class="grade" src="@/assets/img/third.png" alt="" v-if="index == 2">
        </div>
        <img class="add-cart" src="@/assets/img/add-cart.png" alt="" @click="addCart(item)">
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/token'
import { Toast } from 'vant'
import { checkSkuPanicBuyLimitNum} from '@/api/activities/seckill'
import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
import Cookies from 'js-cookie'
import {
    addShoppingCart
  } from '@/api/spudetail'
export default {
  data(){
    return {

    }
  },
  computed:{
    bgStyle(){
      return {
        'background': `url(${this.data.imgUrl})`,
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center'
      }
    }
  },
  filters:{
    getPriceInt(val){
      return Math.floor(val)
    },
    getPricePrecision(val) {
      const num = Number(val).toFixed(2)
      return num.substring(num.length-3, num.length)
    }
  },
  props:{
    data:{
      type: Object,
      default: () => { }
    },
  },
  methods:{
    checkLimit(item, num, isIgnore = true) {
      let reqData = {
        isIgnoreCartNum: isIgnore,
        buyNowRequestList: [
          {
            num,
            skuId:item.skuId,
            sourceType: this.$route.query.sourceType || 1,
            storeId: item.storeId
          },
        ],
      }
      return checkSkuPanicBuyLimitNum(reqData).then((res) => {
        return res
      })
    },
    async addCart(item) {
      if(this.isProcess) return
      this.isProcess = true
        if (getToken()) {
          let isIgnore = false
          let source = this.$route.query.sourceType || 1
          if(source != 2) {
            let res
            try {
              res = await this.checkLimit(item, 1, isIgnore)
            } catch (error) {
              setTimeout(() => {
                this.isProcess = false
              }, 1000)
            }
            if (res.data && res.data.limitNum) {
              if (res.data.hasBoughtNum) {
                this.num = this.saveLimitNum
                this.skuLimitNum = this.saveLimitNum
                Toast({
                  message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
                })
              } else {
                this.num = this.saveLimitNum
                this.skuLimitNum = this.saveLimitNum
                Toast({
                  message: `抱歉，该商品限购${res.data.limitNum}件`,
                })
              }
              return
            }
          }
          let param = {
            skuId: item.id,
            num: 1,
            // recommendToken: this.recommendToken,
            sourceType: source,
            storeId: item.storeId
          }
          addShoppingCart(param).then((res) => {
            if (res.code == 200) {
              switch (res.data) {
                case 0:
                  Toast({
                    message: '加入购物车失败，请刷新后重试！',
                    // position:'bottom'
                  })
                  break
                case 1:
                  Toast({
                    message: '成功加入购物车',
                    // position:'bottom'
                  })
                  break
                case -1:
                  Toast({
                    message: '库存不足！',
                    // position:'bottom'
                  })
                  break
                case -2:
                  Toast({
                    message: '商品不存在！',
                    // position:'bottom'
                  })
                  break
                case -3:
                  Toast({
                    message: '参数错误！',
                    // position:'bottom'
                  })
                  break
                case -4:
                  Toast({
                    message: '商品已下架！',
                    // position:'bottom'
                  })
                  break
                case -5:
                  Toast({
                    message: '达到商品限购数量！',
                    // position:'bottom'
                  })
                  break
                case -6:
                  Toast({
                    message: '预售商品不能加入购物车！',
                    // position:'bottom'
                  })
                  break
                case -7:
                  Toast({
                    message: '商品已过期！',
                    // position:'bottom'
                  })
                  break
                default:
                  Toast({
                    message: '加入购物车失败，请刷新后重试！',
                    // position:'bottom'
                  })
                  break
              }
              setTimeout(() => {
                this.isProcess = false
              }, 1000)
            }
          }).catch(err=>{
            setTimeout(() => {
                this.isProcess = false
              }, 1000)
          })
        } else {
          if (Cookies.get('_wsf_role') == 1) {
            this.$store.commit('SET_REGISTRATIONPROTOCOL', true)
            return
          }
          this.$router.push('/login?url=' + location.pathname + location.search)
        }
    },
    toDetail(item) {
      if (!item || !item.h5JumpUrl) return
      let isLivePage = item.h5JumpUrl.indexOf('pages/livePlayer/livePlayer') !== -1 || item.h5JumpUrl.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
      if (isLivePage) {
        toMiniAppDistribution(item.h5JumpUrl)
      } else {
        routerPathName(item.h5JumpUrl)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sale-box {
  padding-top: 40px;
  background: red;
  height: 269px;
  display: flex;
  align-items: flex-end;
  .sale-box-wrapper {
    border-radius: 8px 8px 0 0;
    // background: #fff;
    background: transparent;
    padding: 18px 8px 12px;
    width: 100%;
    .sale-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 18px;
      &:last-child {
        margin-bottom: 0;
      }
      .left {
        position: relative;
        display: flex;
        align-items: flex-end;
        .main-img {
          width: 50px;
          background: grey;
          height: 50px;
        }
        .grade {
          position: absolute;
          left: -2px;
          top: -10px;
          width: 18px;
        }
        .price {
          color: #FE3718;
          margin-left: 8px;
          .coin {
            font-size: 14px;
          }
          .int-price {
            font-size: 18px;
            font-weight: bold;
          }
          .precision {
            font-size: 12px;
          }
        }
      }
      .add-cart {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>