<template>
  <div>
    <div class="goods-catogry-name">
      <img class="catogry-name-pic" :src="categoryLink" alt="" />
    </div>
    <!-- 附图 -->
    <div class="sub-pic-list">
      <div class="sub-pic-item" v-for="(item, index) in list" :key="index"
        @click="goGoodsDetail(item)">
        <div class="goods-pic">
          <img :src="item.url" alt="" />
        </div>
        <div class="text-ellipsis goods-desc">
          {{ item.name }}
        </div>

        <!-- 存在活动价 -->
        <template v-if="hasDiscount">
          <div class="active-price">
            <div>原价: ￥</div>
            <div>{{ item.price }}</div>
          </div>

          <!-- 券后价icon -->
          <img class="quan-hou-jia-icon"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-quan-hou-jia-2x.png"
            alt="">
        </template>

        <div class="goods-price-wrap" :class="{'has-voucher': hasDiscount}">
          <div class="left">
            <div class="money-unit">￥</div>
            <div class="price">{{ item.discountPrice }}</div>
          </div>
          <div class="right">
            <div v-show="hasDiscount" class="white-line"></div>
            <!-- 购物车图标 -->
            <img class="shopping-car"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-shopping-car-2x.png"
              alt="" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bargainVisit } from '@/api/visit.js'

const categoryLinks = {
  // 欢度元宵
  1: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-huan-du-yuan-xiao-2x.png',
  // 春季养生
  2: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-chun-ji-yang-sheng-2x.png',
  // 零食狂欢
  3: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-lin-shi-kuang-huan-2x.png'
}

export default {
  name: 'goods-pannel',
  props: {
    type: {
      type: [String, Number],
      require: true
    },
    list: {
      type: Array,
      default: () => []
    },

    /**
     * 是否有活动
     */
    hasDiscount: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 标题背景图
      categoryLink: ''
    }
  },

  created () {
    this.categoryLink = categoryLinks[this.type]
  },

  methods: {
    /**
     * 跳转商品详情
     */
    goGoodsDetail (item) {

      // 埋点
      bargainVisit({
        // 具体商品
        isBargain: 0,
        skuId: item.sku,
        spuId: item.spu,
        category: this.type
      }).then(() => { }).catch(e => { })

      // 跳转到微信小程序原生详情页面
      if (window.__wxjs_environment === 'miniprogram') {
        window.wx.miniProgram.navigateTo({
          url: "/productModule/pages/skuDetail/skuDetail?skuId=" + item.sku
        });
        return;
      }

      this.$router.push({
        path: "/spudetail",
        query: {
          id: item.sku,
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.goods-list-container {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 40px;
  box-sizing: border-box;
}

.goods-catogry-name {
  width: 100%;
  margin-bottom: 15px;

  .catogry-name-pic {
    width: 291px;
    height: 56px;
    display: block;
    margin: 0 auto;
  }
}

.sub-pic-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  margin-bottom: 19px;

  .sub-pic-item {
    width: 117px;
    margin-bottom: 5px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
  }

  .goods-pic {
    width: 100%;
    height: 117px;
    background: #fff;
    margin-bottom: 4px;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  // 商品标题
  .goods-desc {
    width: 96px;
    height: 38px;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #000000;
    margin-left: 10px;
    margin-right: 12px;
  }

  .goods-price-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 11px;

    height: 27px;
    margin-bottom: 10px;
    margin-left: 9px;
    margin-right: 5px;
    border-radius: 4px;
    color: #F10E0E;

    .left {
      display: flex;
      align-items: baseline;
      font-size: 12px;
      font-family: Alibaba PuHuiTi;
    }

    .right {
      display: flex;
      align-items: center;
    }

    .money-unit {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: bold;
    }

    .shopping-car {
      margin-right: 5px;
      // margin-bottom: -2px;
      width: 21px;
      height: 21px;
      padding: 2px;
      background: #F10E0E;
      border-radius: 5px;
      box-sizing: border-box;
    }
  }

  // 有券
  .has-voucher {
    background: #F10E0E;
    color: #fff;
    margin-top: 0;
    .price {
      color: #fff;
    }

    .money-unit {
      margin-left: 5px;
    }

    .shopping-car {
      padding: 0;
    }
  }
}

.text-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  text-overflow: ellipsis;
  overflow-wrap: break-word;
  white-space: normal;
  word-break: break-all;
}

.price {
  font-size: 20px;
  font-family: Arial;
  font-weight: bold;
  color: #F10E0E;
}

.active-price {
  display: flex;
  font-size: 12px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #F10E0E;
  margin-left: 10px;
  margin-bottom: 11px;
}

// 券后价icon
.quan-hou-jia-icon {
  width: 100%;
  display: block;
  height: 27px;
}

.wrap-text-name {
  height: 28px;
}

.white-line {
  width: 1px;
  height: 17px;
  background: #fff;
  margin-left: 4px;
  margin-right: 5px;
}
</style>

<style>
img[src=''],
img:not([src]) {
  opacity: 0;
}
</style>
