<template>
  <div class="details-colortype">
    <div class="fourth-cells">
      <div class="fourth-cell">
        <div class="product-price price_p">
          <div class="left-price-wraaper">
            <span class="spu_price" v-if="shelvesStatus == '1'">
              <span class="spu_price_btn_yuan">
                <span class="spu_price_btn_icon">¥</span>
                <span class="spu_price_btn_pre_price">{{ setPrice(sku.entPurchasePrice)[0] }}</span>
                <span class="spu_price_btn_dian_price">.{{ setPrice(sku.entPurchasePrice)[1] }}</span>
              </span>

              <!--有促销价或者用户价格则显示原价  但是预售不显示原价-->
              <span class="active-price">
                <span class="line"></span>
                <span class="spu_price_btn_icon">¥</span>
                <span class="spu_price_btn_pre_price">{{ setPrice(sku.wsPrice)[0] }}</span>
                <span class="spu_price_btn_dian_price">.{{ setPrice(sku.wsPrice)[1] }}</span>
              </span>
            </span>
            <span class="no-price" v-else>暂无报价</span>
          </div>
        </div>

        <div data-desc="活动标签" class="copun-item" v-if="spu.haveCoupon && couponShowlist.length > 0" @click="showCouponList">
          <div class="left">
            <span class="copun-icon" v-for="(tag, index) in couponShowlist" :key="index">
              {{ tag.text }}
            </span>
          </div>
          <div class="right">
            <span>查看</span>
            <img src="@/assets/img/goodsDetail/pai_arrow.png" alt="" />
          </div>
        </div>

        <div
          class="active"
          v-if="spu.skuLable && spu.skuLable.thematicLabel && spu.skuLable.thematicLabel.subjectLabel"
          @click="toThematic(spu.skuLable.thematicLabel)"
        >
          <div class="active-content">
            <img class="active-hot" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-actity.png" alt="" />
            <div class="active-word">{{ spu.skuLable.thematicLabel.subjectLabel }}</div>
          </div>
          <img class="active-check" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-red.png" alt="" />
        </div>
        <div data-desc="标签" class="tag-pannel" v-if="spu.skuLable && spu.skuLable.goodsTagList && spu.skuLable.goodsTagList.length > 0">
          <div class="tag-list">
            <div class="tag-every" v-for="tags in spu.skuLable.goodsTagList" :key="tags.id">
              <div class="tag-inner">
                {{ tags.tagName }}
              </div>
            </div>
          </div>
          <div class="expression" v-if="performanceScore > 0">
            <div class="performance">
              <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" alt="" />
              <div class="num-pannel">
                绩效分:
                <span class="num">{{ performanceScore }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="product-title">
          {{ sku.skuName }}
          <img v-if="sellOut === 1 && shelvesStatus == '1'" class="soldout" src="@/assets/img/cat_soldout@2x.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatPrice } from '@/utils/utils'
  export default {
    data() {
      return {
        shelvesStatus: '1', // 0下架 1上架 2违规下架
        sellOut: 0, //0未售罄  1已售罄
      }
    },
    props: {
      spu: {
        type: Object,
        default: () => {},
      },
      sku: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      // 价格展示处理
      setPrice(val) {
        return formatPrice(val).split('.')
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
  .spu_price {
    color: #ff450c;
    font-size: 0.64rem;
    font-weight: bold;
    display: flex;
    .spu_price_btn_yuan {
      display: flex;
      align-items: baseline;
      height: 28px;
      line-height: 28px;
      > .spu_price_btn_icon {
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
      }
      > .spu_price_btn_pre_price {
        font-size: 30px;
        font-family: AlternateBold;
        font-weight: bold;
        white-space: nowrap;
      }
      > .spu_price_btn_dian_price {
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
      }
    }
    .coin {
      font-size: 18px;
      font-weight: bold;
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
      background: #ff450c;
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
</style>
