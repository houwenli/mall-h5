<template>
  <div class="view-content" @click="toDetail">
    <div class="goods-img">
      <img :src="item.url" alt="" />
    </div>

    <!-- 价格和促销-->
    <div class="details-colortype">
      <div class="product-price price_p">
        <div class="left-price-wraaper">
          <price :item="item"></price>
        </div>
      </div>

      <div v-if="couponShowlist.length > 0" class="shop-coupon-activty">
        <div v-for="(item, index) in couponShowlist" :key="index" class="shop-coupon-activty-item" v-html="item.showFaceValue"></div>
      </div>

      <div data-desc="标签" class="tag-pannel" v-if="item.skuLable">
        <div class="tag-list" v-if="item.skuLable.goodsTagList && item.skuLable.goodsTagList.length > 0">
          <div class="tag-every" v-for="tags in item.skuLable.goodsTagList.slice(0,2)" :key="tags.id">
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
              <span class="num">{{ performanceScore | filterFraction }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="product-title">
        {{ item.name }}
      </div>

      <!-- 商品评论 好评率 -->
      <div class="shop-info-evaluate" v-if="item.skuLable && item.skuLable.baseLabel">
        <span v-if="item.skuLable.baseLabel.comment">{{ item.skuLable.baseLabel.comment | filterFraction(1) }}评论</span>
        <label v-if="item.skuLable.baseLabel.applauseRate * 1">
          <span v-if="item.skuLable.baseLabel.comment">|</span>
          {{ item.skuLable.baseLabel.applauseRate }}%好评
        </label>
        <label v-if="item.skuLable.baseLabel.salesVolume" class="">
          <span v-if="item.skuLable.baseLabel.applauseRate * 1 || item.skuLable.baseLabel.comment">|</span>
          {{ item.skuLable.baseLabel.salesVolume | filterFraction(1) }}人已买
        </label>
      </div>
    </div>
  </div>
</template>
<script>
  import swiper from '@/views/specialTopic/comp/singlePage/components/swiper'
  import price from '../../../common/price.vue'

  export default {
    filters: {
      filterFraction(val, make) {
        let len = (val + '').length
        switch (len) {
          case 3:
          case 4:
            if (make && val == 1000) {
              val = '999+'
            } else {
              val = parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) + '+'
            }
            break
          case 5:
          case 6:
          case 7:
            if (make) {
              val = '999+'
            } else {
              val = parseInt((val / 10000) * 10) / 10 + '万'
            }
            break
          default:
            break
        }
        return val
      },
    },

    props: {
      item: {
        type: Object,
        default: () => {
          return []
        },
      },
    },

    components: {
      swiper,
      price
    },

    data() {
      return {
        favoriteText: '收藏',
      }
    },

    computed: {
      performanceScore() {
        let skuLable = (this.item && this.item.skuLable) || {}
        let performanceScoreLabel = skuLable.performanceScoreLabel || {}
        return performanceScoreLabel.performanceScore || 0
      },

      couponShowlist() {
        let obj = this.item.skuLable || {}
        let couponlist = []
        // 活动和优惠券标签，最多显示3个标签
        if (obj.markIngLabel && obj.markIngLabel.length) {
          if ([1, 3].includes(obj.markIngLabel[0].ruleType)) {
            // 固定金额和自定义规则: 只显示优惠券标签，最多显示2个按照优惠力度由大到小排列
            couponlist = obj.couponLable ? obj.couponLable.slice(0, 2) : []
          } else if (obj.markIngLabel[0].ruleType == 2) {
            // 固定折扣活动: 显示活动标签为【XX折】+1个优惠券标签，按照优惠力度由大到小排列
            if (obj.markIngLabel && obj.markIngLabel[0].fixedDiscount) {
              couponlist.push({ showFaceValue: `<span style='font-weight:bold;'>${obj.markIngLabel[0].fixedDiscount}</span>折` })
            }
            // if(obj.couponLable){
            // 	couponlist = [...couponlist, ...obj.couponLable.slice(0,1)]
            // }
          } else if ([4, 5].includes(obj.markIngLabel[0].ruleType)) {
            // 满减或满折活动，商品参加满减或满折活动，显示活动标签为2个，取基数较小的2个标签，显示为【满200减20】，【满300减30】或【满200打8折】，【满300打7折】
            if (obj.markIngLabel && obj.markIngLabel[0].tiredPricingList.length) {
              // couponlist =  obj.markIngLabel[0].tiredPricingList.slice(0, 2)
              couponlist = obj.markIngLabel[0].tiredPricingList.slice(0, 1)
              couponlist.forEach((item) => {
                if (obj.markIngLabel[0].ruleType == 4) {
                  item.showFaceValue = `满<span style='font-weight:bold;'>${item.amountLimitation}</span>减<span style='font-weight:bold;'>${item.faceValue}</span>`
                } else {
                  item.showFaceValue = `满<span style='font-weight:bold;'>${item.amountLimitation}</span>打<span style='font-weight:bold;'>${item.faceValue}</span>折`
                }
              })
            } else if (obj.couponLable) {
              couponlist = [...obj.couponLable.slice(0, 1)]
            }
          }
        } else {
          couponlist = obj.couponLable ? obj.couponLable.slice(0, 1) : []
        }
        couponlist.forEach((item) => {
          if (item.couponsType == 2) {
            item.showFaceValue = `<span style='font-weight:bold;'>${item.faceValue}</span>折`
          } else if (item.couponsType == 3) {
            item.showFaceValue = `立减<span style='font-weight:bold;'>${item.faceValue}</span>元`
          }
        })
        return couponlist
      }
    },

    methods: {
      toDetail() {
        let item = this.item,
          path = 'spudetail',
          sourceType = item.sourceType || item.goodsSource,
          query = { id: item.id, storeId: item.storeId, sourceType: sourceType || 1 }
        this.$router.push({ path, query })
      }
    },
  }
</script>

<style lang="less" scoped>
  .view-content {
    margin-top: 12px;
    padding-bottom: 12px;
    background-color: #fff;
    border-radius: 24px;
    overflow: hidden;
    &:first-of-type {
      margin-top: 0;
    }
  }
  .goods-img {
    width: 100%;
    height: 351px;
    border-radius: 24px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .details-colortype {
    padding: 0 12px;
    border-radius: 12px;
    background-color: #fff;
    .left-price-wraaper {
      display: flex;
      align-items: flex-end;
    }
    .product-price {
      margin-top: 12px;
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
    .shop-coupon-activty {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      // margin-bottom: 6px;
      margin-top: 6px;
      &-item {
        background: #ffeee9;
        border-radius: 4px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff450c;
        line-height: 14px;
        padding: 2px 6px;
        margin-right: 4px;
      }
      &-item:last-of-type {
        margin-right: 0;
      }
    }
    .tag-pannel {
      display: flex;
      margin-top: 10px;
      .tag-list {
        display: flex;
      }
      .tag-every {
        // border: 1px solid #FF5F2E;
        border: 1px solid transparent;
        overflow: hidden;
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, rgba(255, 95, 46, 1), rgba(255, 10, 53, 1));

        padding: 1px;
        color: #ff0a35;
        border-radius: 4px;
        font-size: 10px;
        line-height: 10px;
        margin-right: 4px;

        .tag-inner {
          font-weight: 400;
          padding: 0 6px;
          border-radius: 4px;
          background: #fff;
        }
      }
    }

    .product-title {
      padding-right: 0;
      font-weight: 600;
    }

    .shop-info-evaluate {
      display: flex;
      overflow: hidden;
      width: 100%;
      font-size: 11px;
      color: #999999;
      label > span {
        padding: 0 4px;
      }
    }
  }
</style>
