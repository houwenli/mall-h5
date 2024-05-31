<template>
  <div v-if="!loading">
    <!-- 属性选择弹窗 -->
    <van-sku
      v-model="showBase"
      class="sku-box"
      :sku="sku"
      :hide-stock="true"
      :goods="goods_info"
      reset-stepper-on-hide
      reset-selected-sku-on-hide
      :initial-sku="initialSku"
      :close-on-click-overlay="true"
      safe-area-inset-bottom
      @sku-selected="skuSelected"
      @buy-clicked="buyNow"
      @add-cart="addShoppingCart"
      ref="vansku"
      :hide-selected-text="true"
    >
      <!---->
      <template #sku-header-price="props">
        <div class="spu_price">
          <span class="spu_price_btn_yuan">
            <span class="spu_price_btn_icon">¥</span>
            <span class="spu_price_btn_pre_price">{{ setPrice(spu.price)[0] }}</span>
            <span class="spu_price_btn_dian_price">.{{ setPrice(spu.price)[1] }}</span>
          </span>

          <span class="spu_price_btn" v-if="spu.afterCouponPrice && spu.afterCouponPrice > 0">
            <span class="spu_price_btn_text">券后</span>
            <span class="spu_price_btn_icon">¥</span>
            <span class="spu_price_btn_pre_price">{{ setPrice(spu.afterCouponPrice)[0] }}</span>
            <span class="spu_price_btn_dian_price">.{{ setPrice(spu.afterCouponPrice)[1] }}</span>
          </span>

          <span class="active-price">
            <div v-if="spu.oldPrice != spu.price && !spu.afterCouponPrice" style="position: relative">
              <span class="line"></span>
              <span class="spu_price_btn_icon">¥</span>
              <span class="spu_price_btn_pre_price">{{ setPrice(spu.oldPrice)[1] }}</span>
              <span class="spu_price_btn_dian_price">.{{ setPrice(spu.oldPrice)[1] }}</span>
            </div>
          </span>
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

        <div class="van-sku-header-item">{{ selectAttribute(selectedSku) }}</div>
      </template>
      <template #sku-stepper="props">
        <div class="van-sku-stepper-stock">
          <div class="van-sku__stepper-title">数量</div>
          <van-stepper
            class="van-stepper van-sku__stepper"
            @change="numChange($event, props)"
            v-model="num"
            integer
            :min="minNum"
            :max="props.selectedSkuComb ? props.selectedSkuComb.stock_num : 0"
            :input-width="(num + '').length > 3 ? ((num + '').length - 3) * 2.14 + 7.2 + 'vw' : '7.2vw'"
          />
          <div
            v-if="spu.marketingVos && spu.marketingVos[0] && spu.marketingVos[0].type == 13 && !spu.marketingVos[0].seckillIsStart"
            style="float: right; color: #e60113; padding-right: 0.8rem"
          >
            限购{{ spu.marketingVos[0].panicBuy.limitNum }}件
          </div>
          <div v-if="isSpecialArea" style="float: right; color: #e60113; padding-right: 0.8rem">
            限购{{ spu.marketingVos.filter((item) => item.type == '16')[0].specialArea.limitNum }}件
          </div>
        </div>
      </template>

      <template #sku-actions="props">
        <div :class="['van-sku-actions']" v-if="isFrom == 1">
          <van-button
            v-if="spu.isVirtual == 0"
            square
            size="large"
            type="warning"
            @click="addShoppingCart(props)"
            :class="spu.sellOut || spu.isGift == 1 ? 'btn-disabled' : ''"
          >
            加入购物车
          </van-button>
        </div>
        <div :class="['van-sku-actions']" v-if="isFrom == 2">
          <van-button
            square
            size="large"
            type="danger"
            @click="buyNow(props)"
            :class="{ 'btn-disabled': spu.sellOut || spu.isGift == 1, 'button-width': spu.isVirtual == 1 }"
          >
            立即购买
          </van-button>
        </div>
      </template>
    </van-sku>
  </div>
</template>

<script>
  import { querySpu, addShoppingCart } from '@/api/spudetail'
  import { checkSkuPanicBuyLimitNum } from '@/api/activities/seckill'

  import { deepClone, formatPrice } from '@/utils/utils'

  import { Sku, Stepper } from 'vant'

  export default {
    props: {
      info: {
        type: Object,
        default: () => {
          return {}
        },
      },
      show: {
        type: Boolean,
        default: false,
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },

    components: {
      [Sku.name]: Sku,
      [Stepper.name]: Stepper,
    },

    data() {
      return {
        sku: {
          list: [],
        },
        spu: {},
        loading: true,
        goods_info: {},
        initialSku: {},
        selectedSku: {},
        showBase: false,
        num: 1,
        minNum: 1,
      }
    },

    watch: {
      show: {
        handler(val) {
          if (val) {
            this.querySpuDetail(this.info.skuId)
          }
        },
        immediate: true,
      },

      showBase(newVal) {
        if (!newVal) {
          setTimeout(() => {
            this.$emit('update:show', false)
          }, 300);
        }
      },
    },

    computed: {
      // 1加入购物车 2立即购买
      isFrom({info}) {
        return info.isFrom
      },

      performanceScore() {
        let skuLable = (this.spu && this.spu.skuLable) || {}
        let performanceScoreLabel = skuLable.performanceScoreLabel || {}
        return performanceScoreLabel.performanceScore || 0
      },

      isSpecialArea() {
        return (
          this.spu.marketingVos &&
          this.spu.marketingVos.map((item) => item.type).includes('16') &&
          this.spu.marketingVos.filter((item) => item.type == '16')[0] &&
          this.spu.marketingVos.filter((item) => item.type == '16')[0].specialArea &&
          this.spu.marketingVos.filter((item) => item.type == '16')[0].specialArea.limitNum > 0
        )
      },
    },

    methods: {
      setPrice(val) {
        return formatPrice(val).split('.')
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
        return `已选${selectAttributeName},${this.num}个`
      },

      skuSelected(skuValue) {
        this.selectedSku = skuValue

        this.num = 1
        if (!this.$refs.vansku.selectedSkuComb) return
        if (this.skuId == this.$refs.vansku.selectedSkuComb.id) return
        let id = this.$refs.vansku.selectedSkuComb.id
        this.skuId = this.$refs.vansku.selectedSkuComb.id
        this.querySpuDetail(id, {
          isInit: false,
        })
      },

      querySpuDetail(
        id,
        params = {
          isInit: true,
        }
      ) {
        let data = {
          skuId: id,
          storeId: this.info.storeId,
          commFlag: this.isDistribution ? 1 : 2,
          sourceType: Number(this.info.sourceType) || 1,
        }
        if (this.recommendToken) {
          data['shareCode'] = this.recommendToken
        }

        querySpu(data)
          .then(async (res) => {
            let initSkuid = (res.data && res.data.sku && res.data.sku.id) || ''
            if (initSkuid != id || params.isInit) {
              this.initialSku = res.data.sku.initialSku
            }

            if (res.data.marketingVos) {
              res.data.marketingVos.forEach((item) => {
                if (item.type == 16) {
                  this.delPrice = true
                }
              })
            }
            this.spu = res.data
            this.skuId = this.spu.id
            if (!this.spu || this.currentIndex != this.info.index) {
              this.$emit('update:show', false)
              return
            }

            this.sku.tree = deepClone(res.data.sku.tree)
            //弹窗属性
            this.sku.tree.forEach((item, index) => {
              item.v.forEach((temp, i) => {
                temp.imgUrl = ''
              })
            })

            this.sku.list = res.data.list

            // 取Sku image 作为规格弹窗头部图片显示
            this.goods_info.picture = res.data.sku.url
            this.loading = false
            setTimeout(() => {
              this.showBase = true
            }, 0);
          })
          .catch((err) => {
            console.log(err)
            console.log('进入报错,导致spu=null')
            this.spu = {}
            this.sku = this.$options.data().sku
            this.$emit('update:show', false)
          })
          .catch(() => {})
      },

      checkLimit(skuId, num, isIgnore = true) {
        let reqData = {
          isIgnoreCartNum: isIgnore,
          buyNowRequestList: [
            {
              num,
              skuId,
              sourceType: this.info.sourceType || 1,
              storeId: this.spu.storeId,
            },
          ],
        }
        return checkSkuPanicBuyLimitNum(reqData).then((res) => {
          return res
        })
      },

      // 改变购买数量
      async numChange(val, e) {
        if (!val) return
        let isActivity =
          this.spu.marketingVos &&
          (this.spu.marketingVos.map((item) => item.type).includes('16') || this.spu.marketingVos.map((item) => item.type).includes('13'))
        if (isActivity) {
          if (this.num > this.skuLimitNum) {
            let isIgnore = this.isFrom == 1 ? false : true
            let res = await this.checkLimit(e.selectedSkuComb.id, this.num, isIgnore)
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
            } else {
              this.saveLimitNum = val
            }
          }
        }
      },

      // 加入购物车
      async addShoppingCart(e) {
        this.isProcess = true
        if (!e.selectedSkuComb || !e.selectedSkuComb.id) {
          this.$toast('请选择完整的商品规格！')
          return
        }
        let isIgnore = false
        let source = this.info.sourceType
        if (source != 2) {
          let res = await this.checkLimit(e.selectedSkuComb.id, this.num, isIgnore)
          if (res.data && res.data.limitNum) {
            if (res.data.hasBoughtNum) {
              this.num = this.saveLimitNum
              this.skuLimitNum = this.saveLimitNum
              this.$toast({
                message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
              })
            } else {
              this.num = this.saveLimitNum
              this.skuLimitNum = this.saveLimitNum
              this.$toast({
                message: `抱歉，该商品限购${res.data.limitNum}件`,
              })
            }
            return
          }
        }
        let param = {
          skuId: e.selectedSkuComb.id,
          num: this.num,
          sourceType: source,
          storeId: this.spu.storeId,
        }
        this.cartSkuId = e.selectedSkuComb.id
        addShoppingCart(param).then((res) => {
          if (res.code == 200) {
            switch (res.data) {
              case 0:
                this.$toast({
                  message: '加入购物车失败，请刷新后重试！',
                })
                break
              case 1:
                this.$storage.removeItem(this.spu.spuId) // 清除分销码信息
                this.$toast({
                  message: '成功加入购物车',
                })
                this.showBase = false
                this.showFlySpu = true
                // 重新查询购物车数量
                this.queryCartCount()

                //重新调详情接口
                break
              case -1:
                this.$toast({
                  message: '库存不足！',
                })
                break
              case -2:
                this.$toast({
                  message: '商品不存在！',
                })
                break
              case -3:
                this.$toast({
                  message: '参数错误！',
                })
                break
              case -4:
                this.$toast({
                  message: '商品已下架！',
                })
                break
              case -5:
                this.$toast({
                  message: '达到商品限购数量！',
                  // position:'bottom'
                })
                break
              case -6:
                this.$toast({
                  message: '预售商品不能加入购物车！',
                })
                break
              case -7:
                this.$toast({
                  message: '商品已过期！',
                })
                break
              default:
                this.$toast({
                  message: '加入购物车失败，请刷新后重试！',
                })
                break
            }
            setTimeout(() => {
              this.isProcess = false
            }, 1000)
          }
        })
      },
      // 立即购买
      async buyNow(e) {
        if (!e.selectedSkuComb || !e.selectedSkuComb.id) {
          this.$toast({
            message: '请选择完整的商品规格！',
            position: 'bottom',
          })
          return
        }
        if (this.spu.sourceType != 2) {
          let res = await this.checkLimit(e.selectedSkuComb.id, this.num)
          if (res.data && res.data.limitNum) {
            if (res.data.hasBoughtNum) {
              // this.num = res.data.limitNum - res.data.hasBoughtNum
              this.skuLimitNum = res.data.limitNum - res.data.hasBoughtNum
              this.$toast({
                message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
              })
            } else {
              // this.num = res.data.limitNum
              this.skuLimitNum = res.data.limitNum
              this.$toast({
                message: `抱歉，该商品限购${res.data.limitNum}件`,
              })
            }
            return
          }
        }
        if (this.$route.query.promoteInfo || this.isDistribution) {
          this.distrInfo = this.$route.query.promoteInfo ? JSON.parse(this.$route.query.promoteInfo) : this.distrInfo
          let data = await this.getShareCode(this.spu)
          this.recommendToken = data.data.data
        }
        let paramData = {
          skuId: e.selectedSkuComb.id,
          recommendToken: this.recommendToken,
          num: this.num,
          sourceType: this.info.sourceType || 1,
          storeId: this.spu.storeId,
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
              temp: 1,
              againBuy: 0, // 再次购买
            }),
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
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

    /deep/ .van-sku-row__item {
      border-radius: 999px;
    }

    /deep/ .van-sku-row__item-name {
      line-height: 1;
      padding: 7px 10px;
      font-weight: 400;
      font-size: 14px;
    }

    /deep/ .van-sku-stepper-stock {
      padding: 4px 16px;
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

  .btn-disabled {
    background: #eeeeee !important;
    color: #c3c3c3 !important;
  }
  .van-sku-actions {
    padding: 4px 12px;
  }
  .van-sku-actions-phone {
    padding-bottom: 17px;
  }

  .van-sku-actions .van-button--warning {
    background: #ffbe0c;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff9e9;
    height: 40px;
  }

  .van-sku-actions .van-button--danger {
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff9e9;
    height: 40px;
  }

  .van-sku-actions .van-button--warning.btn-disabled,
  .van-sku-actions .van-button--danger.btn-disabled {
    background-color: #f2f2f2 !important;
    color: #bababa !important;
  }
</style>
