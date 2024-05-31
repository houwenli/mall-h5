<template>
  <div class="spu_price">
    <div class="spu_price_btn_yuan">
      <span class="spu_price_btn_icon">¥</span>
      <span class="spu_price_btn_pre_price">{{ setPrice(prePrice)[0] }}</span>
      <span class="spu_price_btn_dian_price">.{{ setPrice(prePrice)[1] }}</span>
    </div>

    <div :class="{ spu_price_btn: isCouponLable, 'active-price': !isCouponLable }" v-if="prePrice != finalPrice">
      <span class="spu_price_btn_text" v-if="isCouponLable">券后</span>
      <span class="spu_price_btn_icon" :style="{ 'text-decoration': !isCouponLable ? 'line-through' : null }">¥</span>
      <span class="spu_price_btn_pre_price" :style="{ 'text-decoration': !isCouponLable ? 'line-through' : null }">{{ setPrice(finalPrice)[0] }}</span>
      <span class="spu_price_btn_dian_price" :style="{ 'text-decoration': !isCouponLable ? 'line-through' : null }">.{{ setPrice(finalPrice)[1] }}</span>
    </div>
  </div>
</template>
<script>
  import { formatPrice } from '@/utils/utils'
  export default {
    props: {
      item: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {}
    },

    computed: {
      isCouponLable() {
        let skuLable = this.item.skuLable
        return skuLable && skuLable.couponLable && skuLable.couponLable.length != 0 && skuLable.couponLable[0].afterCouponPrice
      },

      finalPrice() {
        let skuLable = this.item.skuLable,
          price = this.item.price
        if (this.isCouponLable) {
          price = skuLable.couponLable[0].afterCouponPrice
        }
        return price
      },

      prePrice({item}) {
        let price = item.price
        if (!this.isCouponLable || (this.isCouponLable && item.price != item.skuLable.finalPrice)) {
          price = item.skuLable.finalPrice
        }

        return price
      }
    },

    methods: {
      // 价格展示处理
      setPrice(item) {
        return formatPrice(item).split('.')
      },
    },
  }
</script>
<style lang="less" scoped>
  .spu_price {
    color: #e60113;
    font-weight: bold;
    display: flex;
    align-items: center;
    .spu_price_btn_yuan {
      font-size: 0;
      line-height: 28px;
      height: 28px;
      > .spu_price_btn_icon {
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ff0a35;
        vertical-align: super;
      }
      > .spu_price_btn_pre_price {
        font-size: 30px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ff0a35;
        white-space: nowrap;
      }
      > .spu_price_btn_dian_price {
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ff0a35;
      }
    }
    .spu_price_btn {
      height: 28px;
      line-height: 28px;
      margin-left: 4px;
      padding: 0 8px;
      color: #fff;
      font-weight: normal;
      width: fit-content;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 15px 15px 15px 2px;
      font-size: 0;
      .spu_price_btn_text {
        margin-right: 4px;
        font-size: 11px;
        font-weight: bold;
        color: #ffffff;
        vertical-align: super;
      }
      .spu_price_btn_icon {
        font-size: 13px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ffffff;
      }
      .spu_price_btn_pre_price {
        font-size: 20px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ffffff;
      }
      .spu_price_btn_dian_price {
        font-size: 13px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ffffff;
      }
    }
    .active-price {
      color: #c3c3c3;
      display: flex;
      align-items: baseline;
      height: 20px;
      line-height: 20px;
      margin-top: 8px;
      margin-left: 3px;

      display: flex;
      position: relative;
      align-items: baseline;
      .spu_price_btn_icon {
        font-size: 11px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #c3c3c3;
        vertical-align: super;
      }
      .spu_price_btn_pre_price {
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #c3c3c3;
      }
      .spu_price_btn_dian_price {
        font-size: 11px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #c3c3c3;
      }
    }
  }
</style>
