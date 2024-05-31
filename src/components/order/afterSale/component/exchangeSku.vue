<template>
  <div>
    <!-- 属性选择弹窗 -->
    <van-sku
      v-model="showBase"
      :hide-stock="true"
      :sku="sku"
      :goods="goods_info"
      :initial-sku="initialSku"
      :hide-selected-text="true"
      class="sku-box"
      @sku-selected="skuSelected"
    >
      <template #sku-header-price="props">
        <div class="spu_price">
          <span class="spu_price_btn_yuan">
            <span class="spu_price_btn_icon">¥</span>
            <span class="spu_price_btn_pre_price">{{ skuPriceInt(props.price, 'spec') }}</span>
            <span class="spu_price_btn_dian_price">.{{ skuPriceFloat(props.price, 'spec') }}</span>
          </span>

          <!-- <span class="spu_price_btn" v-if="spu.afterCouponPrice && spu.afterCouponPrice > 0">
            <span class="spu_price_btn_text">券后</span>
            <span class="spu_price_btn_icon">¥</span>
            <span class="spu_price_btn_pre_price">{{ setPrice(spu.afterCouponPrice)[0] }}</span>
            <span class="spu_price_btn_dian_price">.{{ setPrice(spu.afterCouponPrice)[1] }}</span>
          </span>

          <span class="active-price">
            <div v-if="spu.oldPrice != spu.price && !spu.afterCouponPrice" style="position: relative">
              <span class="line"></span>
              <span class="spu_price_btn_icon">¥</span>
              <span class="spu_price_btn_pre_price">{{ setPrice(spu.oldPrice)[0] }}</span>
              <span class="spu_price_btn_dian_price">.{{ setPrice(spu.oldPrice)[1] }}</span>
            </div>
          </span> -->
        </div>
        <!-- <div class="expression" v-if="performanceScore > 0">
          <div class="performance">
            <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" alt="" />
            <div class="num-pannel">
              绩效分:
              <span class="num">{{ performanceScore }}</span>
            </div>
          </div>
        </div> -->

        <div class="van-sku-header-item">{{ selectAttribute(selectedSku) }}</div>
      </template>
      <!-- <template #sku-header-extra="props">
        <div class="collection-id">编号:{{ sku.collection_id }}</div>
      </template> -->
      <template #sku-stepper="props">
        <div class="van-sku-stepper-stock"></div>
      </template>
      <template #sku-actions="props">
        <div class="exchange-goods-hint-text" v-if="isExchangeGoods">
          <van-icon name="warning-o" />
          <span>商品更换结果请以商家审核后实际确认为准</span>
        </div>
        <div class="van-sku-actions">
          <van-button square size="large" type="danger" @click="changeAttr(props)">确定</van-button>
        </div>
      </template>
    </van-sku>
  </div>
</template>

<script>
  import { Sku } from 'vant'
  import { formatPrice } from '@/utils/utils'
  import { backQuerySpu } from '@/api/spudetail'
  export default {
    components: {
      [Sku.name]: Sku,
    },
    props: {
      show: {
        type: Boolean,
        require: true,
        default: false,
      },
      skuId: {
        type: [String, Number],
        require: true,
      },
      isExchangeGoods: {
        type: Boolean,
        default: false,
      },
      storeId: {
        type: [String, Number],
        default: '',
      },
      orderType: {
        type: [String, Number],
        default: '',
      },
      applyNum: {
        type: [Number, String],
        default: 1
      }
    },
    data() {
      return {
        showBase: false,
        sku: {
          collection_id: '',
          tree: [],
          list: [],
        },
        goods_info: {
          picture: '',
        },
        initialSku: {},
        spu: {},
        selectedSku: {},
      }
    },
    watch: {
      show(newVal) {
        if (newVal) {
          this.showAttr()
        }
      },
      showBase(newVal) {
        if (newVal === false) {
          this.$emit('handleClose')
        }
      },
    },
    computed: {
      performanceScore() {
        let skuLable = (this.spu && this.spu.skuLable) || {}
        let performanceScoreLabel = skuLable.performanceScoreLabel || {}
        return performanceScoreLabel.performanceScore || 0
      },
    },
    methods: {
      setPrice(val) {
        return formatPrice(val * 1).split('.')
      },
      // 属性弹框
      showAttr() {
        let data = {
          skuId: this.skuId,
          // skuId: '168445979777510',
          sourceType: 1,
        }
        if (this.orderType == 9) {
          data.sourceType = 2
          data.storeId = this.storeId
        }
        backQuerySpu(data).then((res) => {
          if (res.flag == 1) {
            this.spu = res.data
            this.id = res.data.id
            this.sku.tree = res.data.sku.tree
            this.sku.list = res.data.list
            this.goods_info.picture = res.data.sku.url
            this.initialSku = res.data.sku.initialSku

            this.sku.collection_id = res.data.list[0].id
            this.sku.price = res.data.sku.price.toFixed(2)

            this.sku.tree.forEach((item, index) => {
              // if (index != 0) {
              //   item.v.forEach((temp, i) => {
              //     temp.imgUrl = ''
              //   })
              // } else {
              //   item.v.forEach((temp, i) => {
              //     temp.previewImgUrl = temp.imgUrl
              //   })
              // }
              item.v.forEach((temp, i) => {
                temp.imgUrl = ''
              })
            })
            this.showBase = true
          } else {
            this.$emit('update:show', false)
          }
        }).catch(() => {
          this.$emit('update:show', false)
        })
      },
      skuSelected({ skuValue, selectedSku, selectedSkuComb }) {
        this.sku.collection_id = selectedSkuComb.id
        this.selectedSku = { skuValue, selectedSku, selectedSkuComb }
        this.goods_info.picture = selectedSkuComb.imgUrl
      },
      //更改商品属性
      changeAttr(e) {
        let data = e.selectedSkuComb
        this.showBase = false
        this.$emit('handleSumit', data)
      },

      skuPriceInt(data, name) {
        let price = 0
        if (data) {
          price = data
          if (name == 'sku') {
            price = price.toFixed(2).split('.')[0]
          } else if (name == 'spec') {
            sessionStorage.setItem('lastPrice', price)
            price = price && price.split('.')[0]
          }
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice ? lastPrice.split('.')[0] : 0
        }
        return price
      },
      skuPriceFloat(data, name) {
        let price = '00'
        if (data) {
          price = data
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice
        }
        if (name == 'sku') {
          price = price.toFixed(2).split('.')[1]
        } else if (name == 'spec') {
          sessionStorage.setItem('lastPrice', price)
          price = price.split('.')[1]
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice ? lastPrice.split('.')[1] : '00'
        }
        return price
      },

      // 已选中的规格
      selectAttribute(val) {
        let arr = [],
          index = 0,
          selectAttributeName = ''
        for (const key in val.selectedSku) {
          if (!val.selectedSku[key]) {
            arr.push(this.sku.tree[index].k)
          }
          index++
        }
        if (arr.length > 0) {
          this.canBuy = false
          return `请选择 ${arr.join(' ')}`
        }
        if (!val.selectedSkuComb) {
          return ''
        }
        selectAttributeName = val.selectedSkuComb.name
        return `已选${selectAttributeName},${this.applyNum}个`
      },
    },
  }
</script>

<style scoped lang="less">
  .sku-box {
    height: 440px;
    /deep/ .van-sku-header__img-wrap {
      img {
        object-fit: fill !important;
      }
    }
    /deep/ .van-sku-header__goods-info {
      justify-content: flex-start;
    }

    /deep/ .van-sku-header-item {
      font-size: 13px;
      color: #999;
    }
    /deep/.van-sku-row__item-img {
      display: none;
    }
    /deep/ .van-sku-row__title {
      font-size: 13px;
      color: #191919;
      padding-bottom: 8px;
    }

    /deep/ .van-sku-row__item--active {
      box-shadow: 0px 0px 0px 0.5px #ff0a35;
      color: #ff0a35;
    }
    /deep/ .van-sku-row__item--active::before {
      background: rgba(255, 231, 235, 0.5);
      opacity: 1;
    }

    /deep/ .van-sku-row__item-name {
      padding: 5px 16px;
      font-weight: 400;
      line-height: 17px;
    }

    /deep/ .van-sku-stepper-stock {
      padding: 4px 16px;
    }
    /deep/ .van-sku-row__item {
      border-radius: 14px;
    }

    /deep/ .van-popup__close-icon {
      top: 15px;
      right: 12px;
      width: 27px;
      height: 20px;
      background: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png) no-repeat;
      background-size: 100% 100%;

      &::before {
        display: none;
      }
    }
    /deep/ .van-sku-header__img-wrap {
      width: 102px;
      height: 102px;
    }
    /deep/ .van-sku-header__img-wrap img {
      border-radius: 8px;
    }

    /deep/ .van-stepper__minus,
    /deep/ .van-stepper__plus {
      height: 14px;
      width: 14px;
      background-color: transparent;
    }
    /deep/ .van-stepper__input {
      width: 27px;
      height: 22px;
      background-color: #f6f6f6;
      font-size: 13px;
      font-weight: bold;
      color: #191919;
      margin: 0 7px;
      border-radius: 4px;
      font-family: DINAlternate-Bold, DINAlternate;
    }

    /deep/ .van-hairline--bottom::after {
      border: none;
    }
  }
  .van-sku-actions {
    // position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 4px 12px;
    padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
  }

  .van-sku-actions .van-button--danger {
    font-size: 16px;
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    color: #fff9e9;
  }
  .exchange-goods-hint-text {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    padding-bottom: 4px;
    font-size: 12px;
    color: #999;
    span {
      padding-left: 6px;
    }
  }
  .spu_price {
    color: #e60113;
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
      // color: #999999;
      // font-size: 14px;
      // position: relative;
      // margin-left: 4px;
      // display: block;
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
  .performance {
    display: flex;
    img {
      width: 16px;
      height: 16px;
    }
    .num-pannel {
      color: #008864;
      font-size: 11px;
      .num {
        font-size: 11px;
        font-weight: bold;
      }
    }
  }
</style>
