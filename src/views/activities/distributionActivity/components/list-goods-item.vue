<template>
  <div v-if="item" class="shop-card">
    <div @click="toDetails(item)">
      <div class="layout">
        <!-- 商品主图 -->
        <div class="shop-img" ref="shopImg">
          <img v-if="item.productUrl" :src="item.productUrl" alt="" style="height: 100%; width: 100%;object-fit: cover" />
          <img
            v-else
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAAFWBAMAAADAgaiwAAAAFVBMVEX7+/vt7e3w8PD19fXz8/P5+fn39/ejJ1KzAAADyElEQVR42u3dT3PSQBiA8Xe0m/sm2LNE8Iyu5dy0qedQCGcQ4ft/BHezZSWmUqrTLMw8v5mi1Dg8De/mz/SAGGO2tZy7emk7xabKJVi61qlcho1tXcllSIxcym4V2ciNXIq5XMoIiCRSyaVQtL4JJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOXl3Xlf9jXh5y31Q/VyLL3aGtvL2hfk4qiX2c2KrOv9vKeaHHImt9aCAdPbXqptXk+cMzre992qz31uLIfv2q9fUzrQttVfLYe+v69a2JtiZy1Xvr7NWtS+O+l5lvvbe+e3XrWgc9t1693Jq2W2f7bb7mBx7k7b0/obW2tJXVVvW436a1g8fy9pITWufGD2dmjLmReK1iHFtlpWZv2mot9G+ZLCK0do9cHyQ4bB20W68it/rVPjmpNWm1fjKm6LE1LLBy7/5Yq9qYL9oaNK23IrM+W7snhKrTengcVX5PNq2jsux3vw5f17rw20SZ10S/3Jo7vlUVPjpK6+MJrfVut6tdYth8EqW1OKHVLafrpjUZPk1DjNZEn9DqvjJXqELiMELr48utPmzgvhZ6LzUHppX0odAdzx9fUx2edKQ9tIYRyL3hkVZnMIzZ6kcgOzwtpEda1zFbv2jn42Hr4EjrImKr2q8mb/1Ca6a0NwqPg2Ffre98QmuhZcdaC39TM25mx7hLraKP1u4IKNtmC4+0ykx/b/7HY28z0B0BVTpPF93H7gsGy0itV37FtE9fH3+36u716zaJ1LoOZ0ilg9vQmv259G9EJFKrn0+9al/FTlqtWaGdjXYGVau17O04EEYgrDKv2rf602o4ADirVuu9/1l6aQ0j4P/upeJ7jL+8/vA0F01cGmEGuiPQtLRW2sT3j780773f+Dpa6/vQZoUldB1alcucuKqHpx/mNlrrzB9OQ7g3Dq3NTUCV+CUlqrBJ0VoXpbOShiq9u4l7Yu+v3MvP9cA2pn6Tuc4ktC7arefwcbCLzyKzB/F+jMVSG2PM6kw/DzaEXNCH6f6dqqTrLF9ludv205ps/uuF1PJbOa2kJ2pTltP6X0PzkS3t0/wuHd3vXtdbL83dUI9upHf1z1yneWm2pwTX9eabuzvP77cSh30/tbbBo/vp1v+Su0PVy40pbaaV2tCYmrfVcsl5WZbG2RjHPstdpDeyofG5dZ3rI9xkn9Mpod6Z8s7txcBPR2l2tZwnVe8sM3WP9blGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAi/ULMvopqX0wGS4AAAAASUVORK5CYII="
            alt=""
            style="height: 100%; width: 100%; object-fit: cover"
          />
        </div>
        <!-- 内容 -->
        <div class="shop-info" :class="{ 'disable-status': isStatus }">
          <!-- 商品名称 -->
          <div class="shop-info-name">{{ item.skuName }}</div>
          <!-- 商品副标题-->
          <!-- <div class="shop-info-title" v-if="item.subTitle">{{ item.subTitle }}</div> -->

          <!-- 商品标签-->
          <div class="shop-info-goodstags" v-if="data && data.goodsTagList && data.goodsTagList.length">
            <div v-for="(val, index) in data.goodsTagList.slice(0, 2)" :key="index" class="shop-info-goodstags-box">
              <div class="shop-info-goodstags-item">
                {{ val.tagName }}
              </div>
            </div>
          </div>

          <!-- 商品评论 好评率 -->
          <div v-if="data && (data.baseLabel.comment || data.baseLabel.applauseRate * 1)" class="shop-info-evaluate">
            <span v-if="data.baseLabel.comment">{{ data.baseLabel.comment | filterFraction(1) }}评论</span>
            <span v-if="data.baseLabel.applauseRate * 1">
              <span></span>
              {{ data.baseLabel.applauseRate }}%好评
            </span>
          </div>

          <!-- 商品绩效分-->
          <div v-if="data && data.performanceScoreLabel && data.performanceScoreLabel.performanceScore" class="shop-info-fraction">
            <img src="@/assets/img/jixiao.png" />
            <span class="performate-point">绩效分:{{ data.performanceScoreLabel.performanceScore | filterFraction }}分</span>
          </div>

          <!-- 优惠券和活动 -->
          <div class="shop-coupon-activty" v-if="data && data.couponLable && data.couponLable.length > 0">
            <!-- <div v-for="(item, index) in couponShowlist" :key="index" class="shop-coupon-activty-item">
              {{ item | couponLableFilter }}
            </div> -->
            <div v-for="item in data.couponLable.slice(0, 2)" :key="item.id" class="shop-coupon-activty-item" v-html="couponLableFilter(item)"></div>
          </div>

          <!-- 商品价格 -->
          <div class="shop-info-price">
            <div class="fqz-price" v-if="item.integralPoint > 0">
              <span class="price">{{ item.integralPoint }}</span>
              福气值+<span class="price">{{ item.deductionAfterPrice }}</span>元
            </div>
            <!-- 券后价  -->
            <div class="price" v-else-if="couponShowlist[0] && isLinePice">
              <span class="explain">券后</span>
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(couponShowlist[0].afterCouponPrice)[0] }}</span>
              <span class="decimal" v-if="couponShowlist[0].afterCouponPrice < 10000">.{{ setPrice(couponShowlist[0].afterCouponPrice)[1] }}</span>
              <!-- <div class="tag">{{ couponShowlist[0].couponsType | filterCoupons(couponShowlist[0].faceValue) }}</div> -->
            </div>
            <!-- 实售价 ( 活动价 > 万顺售价 ) -->
            <div class="price" v-else>
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(item.finalPrice)[0] }}</span>
              <span class="decimal">.{{ setPrice(item.finalPrice || item.finalPrice)[1] }}</span>
            </div>
            <!-- 原价 （划线价)  实售价取值拼团价或活动价时展示 -->
            <span class="price oldPrice" v-if="isLinePice">
              <!-- <div class="line"></div> -->
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(item.finalPrice)[0] }}</span>
              <strong class="decimal">.{{ setPrice(item.finalPrice)[1] }}</strong>
            </span>
          </div>
          <!-- 购买人数 -->
          <div class="shop-info-buy" v-if="data && data.baseLabel.salesVolume">
            <!-- <span class="price oldPrice">
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(100)[0] }}</span>
              <strong class="decimal">.{{ setPrice(100)[1] }}</strong>
            </span> -->
            <span>{{ data.baseLabel.salesVolume | filterFraction(1) }}人已买</span>
          </div>

          <!-- <div v-if="isMarkIngLabel" class="shop-info-active" @click.stop="toThematic(data.thematicLabel)">
            <img src="@/assets/img/goodsDetail/pai_hot.png" />
            <span>
              {{ data.thematicLabel.subjectLabel }}
            </span>
            <img src="@/assets/img/goodsDetail/pai_arrow.png" />
          </div> -->

          <div class="share-earn-bt" @click.stop="$emit('shareComm', item)" v-if="!isShare">
            <div class="share-earn-label">预估佣金</div>
            <div>
              <span class="share-earn-price share-earn-price-yuan">{{ item.preCommission ? item.preCommission.toFixed(2).split('.')[0] : '0' }}</span><span class="share-earn-price share-earn-price-fen">{{ item.preCommission ? '.' + item.preCommission.toFixed(2).split('.')[1] : '.00' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatPrice } from '@/utils/utils'
  import { Overlay } from 'vant'

  export default {
    name: 'goodItem',
    inject: ['reload'],
    components: {
      [Overlay.name]: Overlay,
    },
    props: {
      item: {
        type: Object,
        default: () => {
          return {}
        },
      },
      //热销榜单
      isIndex: {
        type: Boolean,
        default: false,
      },
      detailShow: {
        type: Boolean,
      },
      //分享分销商品信息
      promoteInfo: {
        type: Object,
        default: () => {},
      },
      //是否展示商品状态
      isStatus: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        show: true,
        formatPrice,
        data: this.item.skuLable,
        couponsMap: {
          '1': '满减',
          '2': '折扣',
          '3': '立减',
        },
        isShare: !!this.$route.query.promoteInfo,
      }
    },
    computed: {
      couponLableFilter() {
        return function(item) {
          let showLabel = ''
          if (item.couponsType == 2) {
            showLabel = `<span style="font-weight: bold">${item.faceValue}</span>折`
          } else if (item.couponsType == 3) {
            showLabel = `立减<span style="font-weight: bold">${item.faceValue}</span>元`
          } else if (item.couponsType == 1) {
            showLabel = `满<span style="font-weight: bold">${item.amountLimitation}</span>减<span style="font-weight: bold">${item.faceValue}</span>`
          }
          return showLabel
        }
      },
      couponShowlist() {
        let couponlist = (this.data && this.data.couponLable) || []
        let checkedCouponlist = couponlist.filter((item) => {
          return item.checked
        })

        return checkedCouponlist
      },
      // 绩效分信息
      // isPerformanceScoreLa() {
      //   return this.data && this.data.performanceScoreLabel && this.data.performanceScoreLabel.performanceScore
      // },
      // 划线价
      isLinePice() {
        return this.couponShowlist[0] && this.couponShowlist[0].afterCouponPrice != this.item.finalPrice
      },
      //判断是否展示活动信息
      // isMarkIngLabel() {
      //   return this.data && this.data.thematicLabel && this.data.thematicLabel.subjectLabel
      // },
    },
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
      filterCoupons(type, val) {
        let va = parseInt(val * 10) / 10
        let couponsMap = {
          // '1': '满减' + va,
          '2': va + '折',
          '3': '立减' + va,
        }
        return couponsMap[type]
      }
    },

    methods: {
      //详情
      toDetails(item) {
        this.$emit('goDetails', item)
      },
      // 价格展示处理
      setPrice(val) {
        return this.formatPrice(val).split('.')
      },

      // 去往专题活动
      toThematic(item) {
        this.$router.push({
          name: 'ranking',
          query: {
            id: item.id,
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .shop-card {
    position: relative;
    z-index: 2;
    border-radius: 12px;
    margin-bottom: 10px;
    overflow: hidden;
    .shop-info {
      position: relative;
      padding: 5px 8px 8px;
      width: 100%;
      text-align: left;
      background-color: #fff;
      overflow: hidden;
      // 商品名称
      .shop-info-name {
        color: #000000;
        text-align: left;
        max-height: 34px;
        font-size: 14px;
        line-height: 17px;
        // font-weight: bold;
        /* 超出两行隐藏 */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      // 副标题
      .shop-info-title {
        margin-top: 4px;
        color: #e3903f;
        text-align: left;
        font-size: 11px;
        height: 16px;
        // font-weight: bold;
        /* 超出隐藏 */
        overflow: hidden;
      }
      // 商品标签
      .shop-info-goodstags {
        margin-top: 6px;
        display: flex;
        align-items: center;
        .shop-info-goodstags-box {
          border: 0.5px solid transparent;
          padding: 1px;
          border-radius: 4px;
          overflow: hidden;
          margin-right: 4px;
          background-clip: padding-box, border-box;
          background-origin: padding-box, border-box;
          background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, rgba(255, 95, 46, 1), rgba(255, 10, 53, 1));
          &:last-child {
            margin-right: 0;
          }
        }
        .shop-info-goodstags-item {
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff0a35;
          line-height: 10px;
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
          padding: 0 4px;
          // background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/linear_border.png') no-repeat;
          background-size: 100% 100%;
        }
        > .shop-info-goodstags:last-of-type {
          margin-right: 0;
        }
      }
      // 评价
      .shop-info-evaluate {
        margin-top: 6px;
        display: flex;
        overflow: hidden;
        width: 100%;
        font-size: 11px;
        color: #999999;
        span:nth-child(2) {
          display: flex;
          align-items: center;
          span {
            margin: 0 4px;
            width: 1px;
            height: 12px;
            background-color: #c3c3c3;
          }
        }
      }
      // 绩效分
      .shop-info-fraction {
        margin-top: 5px;
        display: flex;
        align-items: center;
        padding: 0 4px 0 0;
        overflow: hidden;
        font-size: 11px;
        color: #008864;
        background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
        border-radius: 4px;
        img {
          width: 16px;
          height: 16px;
        }
      }
      .shop-info-price,
      .shop-info-buy {
        display: flex;
        -webkit-box-align: end;
        align-items: baseline;
        .intPice {
          font-weight: bold;
        }
        .unit,
        .decimal,
        .explain {
          font-size: 11px;
          font-weight: bold;
          font-family: DINAlternate-Bold, DINAlternate;
        }
        .price {
          display: flex;
          -webkit-box-align: end;
          align-items: baseline;
        }
        .oldPrice {
          position: relative;
          font-size: 13px;
          color: #c3c3c3;
          transform: scale(0.92);
          margin-left: 2px;
          .unit {
            font-size: 10px;
          }
          .line {
            width: 100%;
            height: 1px;
            background-color: #999999;
            position: absolute;
            top: 49%;
          }
        }
      }
      // 价格
      .shop-info-price {
        display: flex;
        align-items: baseline;
        line-height: 1;
        color: #ff0a35;
        font-weight: bold;
        font-size: 20px;
        margin-top: 6px;

        .explain {
          font-weight: 400;
        }
        .tag {
          height: 18px;
          line-height: 18px;
          border-radius: 0 9px 9px 0;
          padding: 0px 6px 0px 8px;
          color: #fff;
          font-size: 10px;
          font-weight: 400;
          background-image: url('~@/assets/img/youhuiquan.png');
          background-size: 100% 100%;
        }
        .afterCouponPrice {
          display: flex;
        }
        .fqz-price {
          display: flex;
          font-size: 10px;
          align-items: baseline;
          font-weight: 400;
          .price{
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
      // 购买人数
      .shop-info-buy {
        display: flex;
        font-size: 10px;
        color: #c3c3c3;
        .oldPrice {
          margin: 0 4px 0 0;
        }
        .intPice {
          margin-left: 2px;
        }
      }
      // 专题
      .shop-info-active {
        background: #ffedf0;
        //background-image: url('~@/assets/img/goodsDetail/hdbj.png');
        //background-size: 100% 100%;
        border-radius: 14px;
        height: 24px;
        display: flex;
        align-items: center;
        padding: 4px;
        margin-top: 3px;
        margin-bottom: 6px;
        img:first-of-type {
          width: 16px;
          height: 16px;
        }
        img:last-of-type {
          width: 16px;
          height: 16px;
        }
        span {
          flex: 1;
          padding-left: 3px;
          line-height: 17px;
          font-size: 10px;
          color: #ff0a35;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
      // 活动和优惠券显示
      .shop-coupon-activty {
        margin-top: 6px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        // margin-bottom: 6px;
        .shop-coupon-activty-item {
          background: #ffeee9;
          border-radius: 4px;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff450c;
          line-height: 1;
          padding: 2px 6px;
          margin-right: 4px;
        }
        .shop-coupon-activty-item:last-of-type {
          margin-right: 0;
        }
      }
      .share-earn-bt {
        position: relative;
        margin-top: 8px;
        overflow: hidden;
        padding-left: 8px;
        display: flex;
        align-items: center;
        height: 32px;
        border-radius: 16px;
        color: #6e6e6e;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/share_earn_bg.png') no-repeat;
        background-size: 100% 100%;
        white-space: nowrap;
        .share-earn-label {
          font-size: 11px;
          line-height: 15px;
          padding-right: 2px;
          vertical-align: baseline;
        }
        .share-earn-price {
          font-size: 16px;
          line-height: 20px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #ff450c;
        }
        .share-earn-price-fen {
          font-size: 13px;
          line-height: 15px;
          // line-height: 15px;
        }
        .share-earn-bg {
          position: absolute;
          right: 7px;
          font-weight: 600;
          line-height: 32px;
          font-size: 13px;
          color: #fff;
          text-align: center;
        }
      }
    }
    .shop-img {
      background-color: #fff;
      // width: 172px;
      width: 100%;
      height: 170px;
      position: relative;
      .sell-out {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.2rem;
        height: 2.2rem;
        background-color: #000000;
        opacity: 0.7;
        border-radius: 50%;
        .sell-out-text {
          color: #ffffff;
        }
      }
    }
  }
  // 商品状态 --收藏页面
  .disable-status {
    color: #bababa;
  }
  .add-shopping {
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: 24px;
    height: 24px;
    background: url('~@/assets/img/cat_o@2x.png') no-repeat center center;
    background-size: 100%;
    opacity: 0.9;
  }

  // 分销商品
  .distribution_div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .distribution_gain {
      background: linear-gradient(290deg, rgba(254, 103, 128, 0.12) 0%, rgba(255, 22, 61, 0.12) 100%);
      border-radius: 2px;
      color: #fd302c;
      padding: 0 4px;
      line-height: 14px;
      font-size: 10px;
    }

    .distribution_buy {
      font-size: 12px;
      width: 60px;
      // height: 20px;
      background: #fd302c;
      border-radius: 4px;
      color: #ffffff;
      line-height: 12px;
      padding: 4px 0;
      text-align: center;
      font-weight: bold;
    }
  }
</style>
