<template>
  <div class="goods-info-box" @click="toDetails(item)">
    <div class="product-price">
      <price :item="item"></price>
    </div>

    <div class="goods-name text-clamp2">{{ item.name }}</div>
  </div>
</template>

<script>
  import { formatPrice } from '@/utils/utils'
import price from '../../common/price.vue'
  export default {
	components: { price },
    props: {
      item: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    computed: {
      isCouponLable() {
        let skuLable = this.item.skuLable
        return skuLable && skuLable.couponLable && skuLable.couponLable.length != 0 && skuLable.couponLable[0].afterCouponPrice
      },

      finalPrice() {
        let skuLable = this.item.skuLable,
          price = (skuLable && (skuLable.finalPrice || skuLable.baseLabel.price)) || this.item.price
        if (this.isCouponLable) {
          price = skuLable.couponLable[0].afterCouponPrice
        }
        return price
      },
    },

    methods: {
      // 价格展示处理
      setPrice(item) {
        return formatPrice(item).split('.')
      },

      toDetails(item) {
        if (item.id !== 0 && !item.id) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        } else {
          let path = '/spudetail'
          let query = { id: item.id, storeId: this.storeId, sourceType: 2 }

          if (item.goodsSource == 4) {
            path = '/motorCar/detail'
            query = { skuId: item.id }
            if (this.storeId) {
              query = { skuId: item.id, sourceType: 2, storeId: this.storeId }
            }
          } else {
            if (this.detailShow) {
              query = { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 }
              this.$router.push({ path, query })
              this.reload()
            } else if (!this.storeId) {
              query = { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 }
            }
          }

          this.$router.push({ path, query })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .goods-info-box {
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 12px;
    padding: 12px;
    background-color: #fff;
    border-radius: 12px;
    bottom: 60px;
    z-index: 10;
    transform: translateZ(100px);
  }
  .product-price {
    padding-bottom: 12px;
  }

  .goods-name {
    font-size: 16px;
    font-weight: 600;
    color: #111111;
    line-height: 20px;
  }
  
</style>
