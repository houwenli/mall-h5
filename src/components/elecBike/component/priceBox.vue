<template>
    <div class="spu_price">
        <div class="spu_price_btn_yuan">
            <span class="spu_price_btn_icon">¥</span>
            <span class="spu_price_btn_pre_price">{{ setPrice(spu.price)[0] }}</span>
            <span class="spu_price_btn_dian_price">.{{ setPrice(spu.price)[1] || 26 }}</span>
        </div>
        <div class="spu_price_btn" v-if="spu.afterCouponPrice && spu.afterCouponPrice>0">
            <span class="spu_price_btn_text">券后</span>
            <span class="spu_price_btn_icon">¥</span>
            <span class="spu_price_btn_pre_price">{{ setPrice(spu.afterCouponPrice)[0] || 2600 }}</span><span class="spu_price_btn_dian_price">.{{ setPrice(spu.afterCouponPrice)[1] || 56 }}</span>
        </div>
        <!--有促销价或者用户价格则显示原价  但是预售不显示原价-->
        <div class="active-price">
            <div v-if="spu.oldPrice != spu.price && !spu.afterCouponPrice">
                <span class="line"></span>
                <span class="spu_price_btn_icon">¥</span>
                <span class="spu_price_btn_pre_price">{{ setPrice(spu.oldPrice)[0] }}</span>
                <span class="spu_price_btn_dian_price">.{{ setPrice(spu.oldPrice)[1] }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { formatPrice } from '@/utils/utils'
export default {
    props:{
        spu: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        return {

        }
    },
    methods: {
        setPrice(val) {
            return formatPrice(val).split('.')
        },
    }
}
</script>

<style lang="less" scoped>
.spu_price {
  display: flex;
  align-items: flex-end;
  .spu_price_btn_yuan {
    display: flex;
    align-items: baseline;
    height: 28px;
    line-height: 28px;

    > .spu_price_btn_icon {
      font-size: 16px;
      font-family: AlternateBold;
      font-weight: bold;
      color: #ff0a35;
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
    display: flex;
    margin-left: 4px;
    padding: 2px 8px;
    color: #fff;
    font-weight: normal;
    width: fit-content;
    height: 28px;
    line-height: 24px;
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    border-radius: 15px 15px 15px 2px;
    align-items: baseline;

    .spu_price_btn_text {
      font-size: 11px;
      font-weight: bold;
      color: #ffffff;
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
      // line-height: 26px;
    }

    .spu_price_btn_dian_price {
      font-size: 13px;
      font-family: AlternateBold;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .active-price {
    display: flex;
    align-items: baseline;
    height: 20px;
    line-height: 20px;
    margin-top: 8px;
    margin-left: 3px;

    > div {
      display: flex;
      position: relative;
      align-items: baseline;

      .spu_price_btn_icon {
        font-size: 11px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #c3c3c3;
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

      .line {
        width: 100%;
        height: 1px;
        background-color: #999999;
        position: absolute;
        top: 50%;
      }
    }
  }
}
</style>


