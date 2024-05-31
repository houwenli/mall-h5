<template>
  <div class="view-content">
    <div v-for="item in list" :key="item.id" class="product-item" @click="toDetail(item)">
      <img :src="item.url" alt="" class="product-img" />
      <div class="product-info" v-once>
        <div class="info-name text-clamp2">{{ item.name }}</div>
        <div class="info-price">
          <span v-if="isCouponLable(item.skuLable)" class="info-price-lable">券后</span>
          <span class="info-price-icon font-din">¥</span>
          <span class="info-price-yuan font-din">{{ setPrice(item)[0] }}</span>
          <span class="info-price-fen font-din">.{{ setPrice(item)[1] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatPrice } from '@/utils/utils'
  export default {
    props: {
      list: {
        type: Array,
        default: () => {
          return []
        },
      },
    },

    methods: {
      setPrice(val) {
        let skuLable = val.skuLable,
          price = (skuLable && (skuLable.finalPrice || skuLable.baseLabel.finalPrice)) || val.price

        if (this.isCouponLable(skuLable)) {
          price = skuLable.couponLable[0].afterCouponPrice
        }
        return formatPrice(price).split('.')
      },

      isCouponLable(data) {
        return data && data.couponLable && data.couponLable.length != 0 && data.couponLable[0].afterCouponPrice
      },

      toDetail(item) {
        let path = 'spudetail',
          sourceType = item.sourceType || item.goodsSource,
          id = item.skuId || item.id,
          query = { id, storeId: item.storeId, sourceType: sourceType || 1 }
        this.$router.push({ path, query })
      },
    },
  }
</script>

<style lang="less" scoped>
  .view-content {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .product-item {
      margin-top: 12px;
      margin-right: 12px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      width: calc(~'(100% - 24px) / 3');
      &:nth-child(-n + 3) {
        margin-top: 0;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      .product-img {
        width: 100%;
        height: 109px;
      }
      .product-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 6px 8px;
      }
      .info-name {
        font-size: 13px;
        line-height: 17px;
        font-weight: 600;
        color: #191919;
        line-height: 17px;
      }
      .info-price {
        padding-top: 6px;
        // display: flex;
        // align-items: baseline;
        color: #ff0a35;
        font-weight: 600;
        font-size: 0;
      }
      .info-price-lable {
        font-size: 8px;
        vertical-align: super;
        margin-right: 2px;
        font-weight: 400;
      }
      .info-price-icon {
        font-size: 10px;
      }
      .info-price-yuan {
        font-size: 13px;
      }
      .info-price-fen {
        font-size: 11px;
      }
    }
  }
</style>
