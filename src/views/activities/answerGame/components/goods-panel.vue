<template>
  <div class="content-box">
    <div class="goods-catogry-name">
      <img class="catogry-name-pic" :src="categoryLink" alt="" />
    </div>
    <!-- 附图 -->
    <div class="sub-pic-list">
      <div class="sub-pic-item" v-for="(item, index) in list" :key="index" @click="goGoodsDetail(item)">
        <div class="goods-pic">
          <img :src="item.url" alt="" />
        </div>
        <div class="text-ellipsis goods-desc goods-desc">
          {{ item.name }}
        </div>

        <!-- 存在活动价 -->
        <template v-if="hasDiscount">
          <div class="active-price">
            <div>原价: ￥</div>
            <div style="
              text-decoration: line-through;"> {{ item.price }}</div>
          </div>
        </template>

        <div class="goods-price-wrap" :class="{ 'has-voucher': hasDiscount }">
          <div class="left">
            <div class="money-unit">￥</div>
            <div class="price">{{ getPriceFirst(item.discountPrice) }}</div>
            <div class="price-second">{{ getPriceSecond(item.discountPrice) }}</div>
          </div>
          <div class="right">
          </div>

        </div>
      </div>
    </div>
</div>
</template>

<script>





import { bargainVisit } from '@/api/visit.js'

const categoryLinks = {
  // 颜值能量站
  1: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_nengliang.png',
  // 美味能量站
  2: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_meiwei.png',
  // 养身能量站
  3: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_yangshen.png'
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
  data() {
    return {
      // 标题背景图
      categoryLink: ''
    }
  },
  // computed: {
  //   priceFirst() {
  //     let list=item.discountPrice

  //   }
  // },
  created() {
    this.categoryLink = categoryLinks[this.type]
  },

  methods: {
    getPriceFirst(val) {
      let list = val.split('.')
      return list[0]
    },
    getPriceSecond(val) {
      let list = val.split('.')
      if (list[1]) {
        return `.${list[1]}`
      } else {
        return ''
      }

    },
    /**
     * 跳转商品详情
     */
    goGoodsDetail(item) {

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
.content-box {
  background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_sahngpinbeijing.png') no-repeat;
  background-size: 100% 531px;
  height: 531px;
  margin-bottom: 15.5px;
}

.goods-list-container {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 40px;
  box-sizing: border-box;
}

.goods-catogry-name {
  width: 100%;
  margin-bottom: 8px;

  .catogry-name-pic {
    width: 227px;
    height: 44px;
    display: block;
    margin: 0 auto;
    padding-top: 18.5px;
  }
}

.sub-pic-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 5px;
  padding-right: 6px;
  box-sizing: border-box;
  margin-bottom: 19px;

  .sub-pic-item {
    width: 120px;
    margin-bottom: 2.5px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
    height: 231px;
    background: linear-gradient(0deg, #FFFFFF 0%, #FFA6D0 100%);
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
    // height: 38px;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #000000;
    margin-left: 10px;
    margin-right: 12px;
    min-height: 32px;
    line-height: 16px;
  }

  .goods-price-wrap {
    margin-top: 11px;

    height: 42px;
    margin-bottom: 10px;
    // margin-left: 9px;
    margin-right: 5px;
    border-radius: 4px;
    color: #F10E0E;

    .left {
      display: flex;
      align-items: baseline;
      font-size: 12px;
      font-family: Alibaba PuHuiTi;
      margin-left: 5px;
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
    // background: #F10E0E;
    background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_jiagebeijing.png');
    background-size: cover;
    color: #fff;
    margin-top: 0;

    .price {
      color: #fff;
    }

    .price-second {
      font-size: 12px;
      color: #fff;
      font-family: Arial;
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
  color: #7C7C7C;
  margin-left: 10px;
  // margin-bottom: 11px;
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
