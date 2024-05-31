<template>
  <div class="shop-card isIndex" :class="{'isWaterfall':isWaterfall}">
    <advert v-if="item.type == 'advert'" :data='item'></advert>
    <saleSetVos v-else-if="item.type == 'sale'" :data='item'></saleSetVos>
    <div v-else @click="toDetails(item)">
      <div class="shop-img" ref="shopImg">
        <img v-if="item.url" :src="item.url" alt="" style="height: 100%; width: 100%; object-fit: cover">
        <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAAFWBAMAAADAgaiwAAAAFVBMVEX7+/vt7e3w8PD19fXz8/P5+fn39/ejJ1KzAAADyElEQVR42u3dT3PSQBiA8Xe0m/sm2LNE8Iyu5dy0qedQCGcQ4ft/BHezZSWmUqrTLMw8v5mi1Dg8De/mz/SAGGO2tZy7emk7xabKJVi61qlcho1tXcllSIxcym4V2ciNXIq5XMoIiCRSyaVQtL4JJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOXl3Xlf9jXh5y31Q/VyLL3aGtvL2hfk4qiX2c2KrOv9vKeaHHImt9aCAdPbXqptXk+cMzre992qz31uLIfv2q9fUzrQttVfLYe+v69a2JtiZy1Xvr7NWtS+O+l5lvvbe+e3XrWgc9t1693Jq2W2f7bb7mBx7k7b0/obW2tJXVVvW436a1g8fy9pITWufGD2dmjLmReK1iHFtlpWZv2mot9G+ZLCK0do9cHyQ4bB20W68it/rVPjmpNWm1fjKm6LE1LLBy7/5Yq9qYL9oaNK23IrM+W7snhKrTengcVX5PNq2jsux3vw5f17rw20SZ10S/3Jo7vlUVPjpK6+MJrfVut6tdYth8EqW1OKHVLafrpjUZPk1DjNZEn9DqvjJXqELiMELr48utPmzgvhZ6LzUHppX0odAdzx9fUx2edKQ9tIYRyL3hkVZnMIzZ6kcgOzwtpEda1zFbv2jn42Hr4EjrImKr2q8mb/1Ca6a0NwqPg2Ffre98QmuhZcdaC39TM25mx7hLraKP1u4IKNtmC4+0ykx/b/7HY28z0B0BVTpPF93H7gsGy0itV37FtE9fH3+36u716zaJ1LoOZ0ilg9vQmv259G9EJFKrn0+9al/FTlqtWaGdjXYGVau17O04EEYgrDKv2rf602o4ADirVuu9/1l6aQ0j4P/upeJ7jL+8/vA0F01cGmEGuiPQtLRW2sT3j780773f+Dpa6/vQZoUldB1alcucuKqHpx/mNlrrzB9OQ7g3Dq3NTUCV+CUlqrBJ0VoXpbOShiq9u4l7Yu+v3MvP9cA2pn6Tuc4ktC7arefwcbCLzyKzB/F+jMVSG2PM6kw/DzaEXNCH6f6dqqTrLF9ludv205ps/uuF1PJbOa2kJ2pTltP6X0PzkS3t0/wuHd3vXtdbL83dUI9upHf1z1yneWm2pwTX9eabuzvP77cSh30/tbbBo/vp1v+Su0PVy40pbaaV2tCYmrfVcsl5WZbG2RjHPstdpDeyofG5dZ3rI9xkn9Mpod6Z8s7txcBPR2l2tZwnVe8sM3WP9blGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAi/ULMvopqX0wGS4AAAAASUVORK5CYII=" alt="" style="height: 100%; width: 100%; object-fit: cover">
      </div>
      <div class="shop-info">
        <div class="shop-info-name">
          {{ item.name || item.spuName }}
        </div>
        
        <div class="shop-info-price" :class="{'mt12': !item.afterCouponPrice}" v-if="!storeId">
          <span v-if="item.afterCouponPrice" class="beforeCouponPriceCoin">¥</span>
          <span class="beforeCouponPrice" v-if="item.afterCouponPrice">{{item.afterCouponPrice.toFixed(2)}}</span>
          <span class="beforeCouponPriceLabel" v-if="item.afterCouponPrice">券后价</span>
          <span class="hasAfterCouponPrice" v-if="item.afterCouponPrice">¥{{ formatPrice(item.finalPrice) }}</span>
          <em v-else>
            ¥
            <span class="price">{{ formatPrice(item.finalPrice) }}</span>
          </em>
          <span class="oldPrice" v-if="item.price != item.finalPrice && !item.afterCouponPrice">¥{{ item.price }}</span>
        </div>
        <div class="shop-info-price" v-if="storeId">
          <em>
            ¥
            <span class="price">{{ formatPrice(item.price) }}</span>
          </em>
        </div>
        
        <div class="small-icon-box">
          <!-- 活动 -->
          <template class="activebox" v-if="item.couponLabelList && item.couponLabelList.length">
            <span class="copun-icon" v-for="(tag,index) in item.couponLabelList" :key="index">
              {{ tag.text }}
            </span>
          </template>
          <span class="performate-point" v-if="item.performanceScore && item.performanceScore>0">
            绩效分{{item.performanceScore}}
          </span>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { formatPrice, isWx } from '@/utils/utils'
import saleSetVos from './saleSetVos.vue'
import advert from './advert.vue'
export default {
  name: 'goodItem',
  inject: ['reload'],
  components: {
    saleSetVos,
    advert
  },
  props: {
    item: {
      type: Object,
      default: () => { }
    },
    isIndex: {
      type: Boolean,
      default: false
    },
    isWaterfall: {
      type: Boolean,
      default: false
    },
    detailShow: {
      type: Boolean,
    },
    storeId: {
      default: '',
    },
  },
  data() {
    return {
      formatPrice,
      isWx: isWx(), // 判断是否是微信
    }
  },
  computed: {
    itemData() {
      const list = {
        ...this.item,
        avtiveOneList: this.item.marketingVos && this.item.marketingVos.filter(item => item.item == 1),
        avtiveTwoList: this.item.marketingVos && this.item.marketingVos.filter(item => item.item == 2),
      }
      return list
    }
  },
  methods: {
    toDetails(item) {
      if (item.id !== 0 && !item.id) {
        this.$vux.toast.text('缺少参数', 'middle')
        return
      } else {
        let path = '/spudetail'
        let query = { id: item.id, storeId: this.storeId, sourceType: 2 }
      
        if(item.goodsSource == 4) {
          path = '/motorCar/detail',
          query = {skuId: item.id}
          if(this.storeId) {
            query = {skuId: item.id, sourceType: 2, storeId: this.storeId,}
          }
        } else {
          if (this.detailShow) {
            query = { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 }
            this.$router.push({ path, query })
            this.reload()
          } else if(!this.storeId){
            query = { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 }
          }
        }
        
        this.$router.push({ path, query })
      }
    },
  }
}
</script>

<style lang="less" scoped>
.shop-card {
  position: relative;
  z-index: 2;
  width: 49%;
  border-radius: 8px;
  margin-bottom: 0.36rem;
  overflow: hidden;
  .shop-info {
    background-color: #fff;
    border-radius: 0rem 0rem 0.2rem 0.2rem;
    overflow: hidden;
    padding: 0.28rem 0.64rem 0.64rem 0.4rem;
    height: 4.1rem;
    .shop-info-name {
      color: #000000;
      font-size: 0.56rem;
      line-height: 0.76rem;
      height: 1.52rem;
      text-align: left;
      /* 超出两行隐藏 */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .hasAfterCouponPrice {
      font-size: 10px;
      line-height: 10px;
      color: #666;
      font-weight: normal;
    }
    .shop-info-price {
      color: #e60113;
      margin-top: 0.38rem;
      margin-bottom: 0.26rem;
      text-align: left;
      height: 16px;
      .price {
        font-size: 12px;
        display: inline-block;
        height: 0.64rem;
        line-height: 0.64rem;
      }
      .oldPrice {
        display: inline-block;
        font-size: 0.48rem;
        text-decoration: line-through;
        color: #999;
        transform: scale(0.92);
        margin-left: 0.08rem;
        margin-top: 0.04rem;
      }
      .beforeCouponPriceCoin {
        font-size: 12px;
        color: #FD302C;
        font-weight: bold;
        margin-right: 2px;
      }
      .hasAfterCouponPrice {
        font-size: 10px;
        line-height: 16px;
        color: #666;
        font-weight: normal;
      }
      .beforeCouponPriceLabel {
        color: #FD302C;
        font-size: 10px;
        font-weight: normal;
        line-height: 16px;
        margin-right: 4px;
      }
      .beforeCouponPrice{
        color: #FD302C;
        font-size: 14px;
        margin-right: 2px;
        line-height: 16px;
      }
    }
    .small-icon-box {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .downpricebox {
        display: inline-block;
        position: relative;
        margin-right: 0.16rem;
        width: 2.2rem;
        height: 0.56rem;
        .pricedownimg {
          position: absolute;
          left: 0;
          top: 0;
          width: 2.2rem;
          height: 0.56rem;
          border-radius: unset !important;
        }
        .downprice {
          // display: inline-block;
          position: absolute;
          top: -0.1rem;
          right: -0.16rem;
          width: 1.36rem;
          text-align: center;
          color: #fff;
          font-size: 0.48rem;
          transform: scale(0.76);
          // height: 0.56rem;
          display: flex;
          align-items: center;
          justify-content: center;
          display: inline-block;
        }
      }
      .fullgivebox {
        position: relative;
        margin-right: 0.16rem;
        width: 0.54rem;
        height: 0.54rem;
        .fullgive {
          font-size: 0.48rem;
          transform: scale(0.82);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #e60113;
        }
      }
      .fullgivebox::after {
        border-radius: 0.08rem;
        border-color: #e60113;
      }
      .copun-icon {
        padding: 0px 2px;
        border: 1px solid #FD302C;
        border-radius: 2px;
        color: #FD302C;
        font-size: 10px;
        margin-right: 4px;
        line-height: 14px;
        margin-bottom: 2px;
      }
    }
  }
  .shop-img {
    background-color: #fff;
    width: 172px;
    height: 172px;
  }
  &.isIndex {
    height: 269px;
    .shop-img {
      // height: auto;
    }
    .shop-info {
      width: 100%;
      padding: 8px 9px 4px;
      text-align: left;
      .shop-info-name {
        height: 36px;
        font-size: 13px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        // margin-bottom: 8px;
        line-height: 18px;
      }
      .shop-info-price {
        margin-bottom: 0;
        font-size: 12px;
        color: #fd302c;
        font-weight: bold;
        margin-top: 0;
        display: flex;
        align-items: center;
        >em {
          line-height: 14px;
        }
        &.mt12 {
          // margin-top: 12px;
        }
        
        .price {
          color: #fd302c;
          font-size: 14px;
          line-height: 15px;
        }

      }
      .performate-point {
          display: inline-block;
          // margin-top: 8px;
          border: 1px solid #fd302c;
          border-radius: 2px;
          padding: 1px 4px;
          color: #fd302c;
          font-size: 10px;
          font-weight: normal;
          line-height: 12px;
        }
    }
  }
}
</style>