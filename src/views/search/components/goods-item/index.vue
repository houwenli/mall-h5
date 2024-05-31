<template>
  <div class="shop-card" @click="toDetails()">
    <div class="shop-img" ref="shopImg">
      <img v-if="info.url" :src="info.url" alt="" />
      <img
        v-else
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAAFWBAMAAADAgaiwAAAAFVBMVEX7+/vt7e3w8PD19fXz8/P5+fn39/ejJ1KzAAADyElEQVR42u3dT3PSQBiA8Xe0m/sm2LNE8Iyu5dy0qedQCGcQ4ft/BHezZSWmUqrTLMw8v5mi1Dg8De/mz/SAGGO2tZy7emk7xabKJVi61qlcho1tXcllSIxcym4V2ciNXIq5XMoIiCRSyaVQtL4JJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOXl3Xlf9jXh5y31Q/VyLL3aGtvL2hfk4qiX2c2KrOv9vKeaHHImt9aCAdPbXqptXk+cMzre992qz31uLIfv2q9fUzrQttVfLYe+v69a2JtiZy1Xvr7NWtS+O+l5lvvbe+e3XrWgc9t1693Jq2W2f7bb7mBx7k7b0/obW2tJXVVvW436a1g8fy9pITWufGD2dmjLmReK1iHFtlpWZv2mot9G+ZLCK0do9cHyQ4bB20W68it/rVPjmpNWm1fjKm6LE1LLBy7/5Yq9qYL9oaNK23IrM+W7snhKrTengcVX5PNq2jsux3vw5f17rw20SZ10S/3Jo7vlUVPjpK6+MJrfVut6tdYth8EqW1OKHVLafrpjUZPk1DjNZEn9DqvjJXqELiMELr48utPmzgvhZ6LzUHppX0odAdzx9fUx2edKQ9tIYRyL3hkVZnMIzZ6kcgOzwtpEda1zFbv2jn42Hr4EjrImKr2q8mb/1Ca6a0NwqPg2Ffre98QmuhZcdaC39TM25mx7hLraKP1u4IKNtmC4+0ykx/b/7HY28z0B0BVTpPF93H7gsGy0itV37FtE9fH3+36u716zaJ1LoOZ0ilg9vQmv259G9EJFKrn0+9al/FTlqtWaGdjXYGVau17O04EEYgrDKv2rf602o4ADirVuu9/1l6aQ0j4P/upeJ7jL+8/vA0F01cGmEGuiPQtLRW2sT3j780773f+Dpa6/vQZoUldB1alcucuKqHpx/mNlrrzB9OQ7g3Dq3NTUCV+CUlqrBJ0VoXpbOShiq9u4l7Yu+v3MvP9cA2pn6Tuc4ktC7arefwcbCLzyKzB/F+jMVSG2PM6kw/DzaEXNCH6f6dqqTrLF9ludv205ps/uuF1PJbOa2kJ2pTltP6X0PzkS3t0/wuHd3vXtdbL83dUI9upHf1z1yneWm2pwTX9eabuzvP77cSh30/tbbBo/vp1v+Su0PVy40pbaaV2tCYmrfVcsl5WZbG2RjHPstdpDeyofG5dZ3rI9xkn9Mpod6Z8s7txcBPR2l2tZwnVe8sM3WP9blGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAi/ULMvopqX0wGS4AAAAASUVORK5CYII="
        alt=""
      />
    </div>
    <div class="shop-info">
      <div class="shop-info-name">
        {{ info.name || info.spuName }}
      </div>
      <div class="shop-info-price">
        <span v-if="info.afterCouponPrice" class="before-coupon-price-icon">¥</span>
        <!-- afterCouponPrice券后价 -->
        <span class="before-coupon-price" v-if="info.afterCouponPrice">{{ info.afterCouponPrice.toFixed(2) }}</span>
        <span class="before-coupon-price-label" v-if="info.afterCouponPrice">券后价</span>
        <!-- finalPrice现价 -->
        <span class="after-coupon-price" v-if="info.afterCouponPrice">¥{{ formatPrice(info.finalPrice) }}</span>
        <!-- 没有优惠券的价格用红色加粗样式 -->
        <div class="not-coupon-finalPrice" v-else>
          <span class="not-coupon-finalPrice-icon">¥</span>
          <span class="price">{{ formatPrice(info.finalPrice) }}</span>
        </div>
        <!-- price原价也是划线价 -->
        <span class="old-price" v-if="info.price != info.finalPrice && !info.afterCouponPrice">¥{{ info.price }}</span>
      </div>
      <div class="tag-box">
        <!-- 活动 -->
        <div class="activebox" v-if="info.couponLabelList && info.couponLabelList.length">
          <span class="copun-icon" v-for="(tag, index) in info.couponLabelList" :key="index">
            {{ tag.text }}
          </span>
        </div>
        <span class="performate-point" v-if="info.performanceScore && info.performanceScore > 0">绩效分{{ info.performanceScore }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatPrice } from '@/utils/utils'
  // 单个商品
  export default {
    name: 'goods-item',
    props: {
      // 商品信息
      info: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        formatPrice,
      }
    },
    methods: {
      toDetails() {
        if (this.info.id !== 0 && !this.info.id) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        }
        this.$router.push({ path: '/spudetail', query: { id: this.info.id, storeId: this.info.storeId, sourceType: this.info.sourceType || 1 } })
      },
    },
  }
</script>

<style lang="less" scoped>
  .shop-card {
    width: 49%;
    overflow: hidden;
    height: 280px;
    width: 172px;
    margin-top: 12px;
    background: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    border-radius: 16px 16px 8px 8px;
    overflow: hidden;
    .shop-img {
      width: 172px;
      height: 172px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .shop-info {
      flex: 1;
      padding: 8px 9px 4px;
      overflow: hidden;
      .shop-info-name {
        width: 151px;
        height: 40px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #111111;
        line-height: 20px;
        /* 超出两行隐藏 */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .shop-info-price {
        text-align: left;
        .old-price {
          display: inline-block;
          text-decoration: line-through;
          color: #999;
          transform: scale(0.92);
          font-weight: bold;
        }
        .before-coupon-price-icon {
          font-size: 12px;
          color: #fd302c;
          font-weight: bold;
        }
        .before-coupon-price-label {
          color: #fd302c;
          font-size: 10px;
          font-weight: normal;
          line-height: 18px;
        }
        .before-coupon-price {
          color: #fd302c;
          font-size: 14px;
          font-weight: bold;
        }
        .after-coupon-price {
          font-size: 10px;
          line-height: 18px;
          color: #666;
          font-weight: normal;
        }
        .not-coupon-finalPrice {
          display: inline-block;
          .not-coupon-finalPrice-icon {
            font-size: 12px;
            color: #fd302c;
            font-weight: bold;
          }
          .price {
            color: #fd302c;
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
      .tag-box {
        display: flex;
        .performate-point {
          display: inline-block;
          border: 1px solid #fd302c;
          border-radius: 2px;
          padding: 1px 4px;
          color: #fd302c;
          font-size: 10px;
          font-weight: normal;
          line-height: 12px;
        }
        .activebox {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .copun-icon {
            padding: 0 2px;
            border: 1px solid #fd302c;
            border-radius: 2px;
            color: #fd302c;
            font-size: 10px;
            margin: 0px 2px 2px 0px;
            line-height: 14px;
          }
        }
      }
    }
  }
</style>
