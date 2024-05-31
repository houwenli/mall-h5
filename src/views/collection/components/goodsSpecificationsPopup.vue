<template>
  <van-sku
    v-model="showSku"
    :sku="skuData"
    :goods="goods"
    :quota="0"
    :hide-stock="true"
    :start-sale-num="sku.entPurchaseNum"
    show-add-cart-btn
    reset-stepper-on-hide
    :initial-sku="sku"
    :properties="properties"
    @sku-selected="skuSelected"
    @sku-close="closePopup"
    :hide-selected-text="true"
    class="sku-popup"
  >
    <template #sku-header-price>
      <div class="van-sku__goods-price">
        <div>
          <div class="sku-price">
            <span class="sku-price-icon">￥</span>
            <span class="sku-price-text">{{ floatPrice(sku.entPurchasePrice) }}</span>
          </div>
          <div v-if="sku.performanceScore && sku.performanceScore > 0" class="performate-point">绩效分{{ sku.performanceScore }}</div>
        </div>
        <div v-if="sku.skuId" class="van-sku-id">编号：{{ sku.skuId }}</div>
      </div>
    </template>
    <template #sku-stepper="props">
      <div class="van-sku-stepper-stock">
        <div class="van-sku__stepper-title">{{ `数量(${sku.entPurchaseNum}件起购)` }}</div>
        <van-stepper
          v-model="num"
          integer
          :min="minNum"
          :max="props.selectedSkuComb ? props.selectedSkuComb.stock_num : 0"
          class="van-stepper van-sku__stepper"
          @change="stepperChange"
        />
      </div>
    </template>
    <template #sku-actions="props">
      <div class="footer-btn">
        <div class="red-btn" @click="buyNow(props)">
          立即购买
        </div>
      </div>
    </template>
  </van-sku>
</template>

<script>
  import { Sku, Stepper } from 'vant'
  export default {
    components: {
      [Stepper.name]: Stepper,
      [Sku.name]: Sku,
    },
    name: 'goodsSpecificationsPopup',
    data() {
      return {
        properties: null,
        goods: { picture: null },
        showSku: false,
        minNum: 1,
        num: 1,
      }
    },
    props: {
      storeId: {
        type: String,
        default: '',
      },
      showBase: {
        type: Boolean,
        default: false,
      },
      skuData: {
        type: Object,
        default: () => {},
      },
      sku: {
        type: Object,
        default: () => {},
      },
      dialogType: {
        type: Number,
        default: 0,
      },
      skuNum: {
        type: Number,
        default: 0,
      },
    },
    watch: {
      showBase(newVal) {
        this.showSku = newVal
      },
      sku: {
        deep: true,
        immediate: true,
        handler(newVal) {
          // 当前选中的sku图片
          this.goods.picture = newVal.url
          // 最低购买数量
          this.minNum = newVal.entPurchaseNum
          this.num = newVal.entPurchaseNum
        },
      },
    },
    methods: {
      // 立即购买
      async buyNow(e) {
        if (!e.selectedSkuComb || !e.selectedSkuComb.id) {
          this.$toast('请选择完整的商品规格！')
          return false
        }
        let paramData = {
          skuId: e.selectedSkuComb.id,
          num: this.skuNum,
          sourceType: 5,
          storeId: this.storeId,
        }
        this.$router.push({
          path: '/settlement',
          query: {
            params: JSON.stringify({
              ids: [],
              addressId: 0,
              buyNowRequestList: [paramData],
              isGroup: 0,
              groupId: 0,
              enterpriseId: this.$route.query.enterpriseId,
              orderType: 14,
            }),
          },
        })
      },
      // 改变数量时触发
      stepperChange() {
        this.$emit('updateNumber', this.num)
      },
      floatPrice(price) {
        if (!price || Number(price) === 0) {
          return '0.00'
        } else {
          return Number(price).toFixed(2)
        }
      },
      skuSelected(skuValue) {
        console.log(skuValue, skuValue.selectedSkuComb)
        this.$emit('skuSelected', skuValue.selectedSkuComb)
      },
      closePopup() {
        this.$emit('update:showBase', false)
      },
    },
  }
</script>

<style lang="less" scoped>
  .sku-popup {
    /deep/.van-hairline--bottom::after {
      border: none;
    }
    /deep/.van-sku-row__title,
    /deep/.van-sku__stepper-title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    .performate-point {
      color: #e60113;
      font-size: 10px;
      padding: 1px 4px;
      border-radius: 2px;
      border: 1px solid #e60113;
      width: fit-content;
      line-height: 14px;
      box-sizing: border-box;
    }
    /deep/.van-sku-row__item {
      background: #f2f2f2;
      border-radius: 15px;
      border: 1px solid #f2f2f2;
      padding: 8px 16px 7px 16px;
      height: 32px;
      .van-sku-row__item-name {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 17px;
        padding: 0px;
      }
    }
    /deep/.van-sku-row__item--disabled {
      background: #f6f6f6 !important;
      .van-sku-row__item-name {
        color: #999999 !important;
      }
    }
    /deep/.van-sku-row__item--active {
      color: #e60113;
      background-color: #fff;
      border: 1px solid #e60113;
      &::before {
        background: #fff;
        //   opacity: 0;
      }
      .van-sku-row__item-name {
        color: #e60113;
      }
    }
    /deep/.van-sku-row__item-img {
      display: none;
    }
    .van-sku__goods-price {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .sku-price-icon {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #e60113;
      }
      .sku-price-text {
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #e60113;
      }
    }
    .van-sku-id {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    /deep/ .van-stepper__minus,
    /deep/ .van-stepper__plus {
      background: none;
      width: 20px;
      height: 20px;
      color: #000000;
    }
    /deep/.van-stepper__minus--disabled,
    /deep/.van-stepper__plus--disabled {
      color: #d8d8d8;
    }
    /deep/ .van-stepper__input {
      width: 40px;
      height: 20px;
      background: #f5f5f5;
      border-radius: 5px;
    }
    /deep/.van-button {
      width: 163px;
      padding: 10px 0px;
      border-radius: 20px;
      font-weight: 500;
      line-height: 20px;
    }
    .van-button--warning {
      background: #e60113;
      margin-right: 16px;
    }
    .van-button--danger {
      background: #ffa000;
    }
    /deep/.van-sku__stepper-quota {
      display: none;
    }
    .isOneButton {
      height: 40px;
      background: #e60113;
      border-radius: 19px;
      width: 100% !important;
      margin-right: 0px;
    }
    .footer-btn {
      padding: 4px 12px;
      padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
      padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
    }
    .red-btn {
      background: linear-gradient(270deg, #fe3040 0%, #ff8011 100%);
      border-radius: 20px;
      height: 40px;
      color: #ffffff;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      font-weight: 500;
    }
  }
</style>
