<template>
  <div class="bg-container">
    <div class="goods-catogry-name">
      <img class="catogry-name-pic" :src="categoryLink" alt="" />
    </div>

    <!-- 主图 -->
    <div class="main-pic" @click="goGoodsDetail(mainPic)">
      <img class="goods-pic" :src="mainPic.url"/>

      <div class="right">
        <div class="text-ellipsis main-pic-desc">
          {{ mainPic.name }}
        </div>
        <div class="main-pic-price-wrap">
          <div class="left">
            <div>活动价:</div>
            <div class="price">{{ mainPic.price }}</div>
            <div class="unit">元</div>
          </div>
          <img
            class="shopping-car-icon"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/new-year-shopping-car.png"
            alt=""
          />
        </div>
      </div>
    </div>

    <!-- 附图 -->
    <div class="sub-pic-list">
      <div class="sub-pic-item" v-for="(item, index) in subList" :key="index" @click="goGoodsDetail(item)">
        <div class="goods-pic">
          <img :src="item.url" alt=""  />
        </div>

        <div class="text-ellipsis goods-desc">
          {{ item.name }}
        </div>

        <div class="goods-price-wrap">
          <div class="left">
            <div>活动价:</div>
            <div class="price">{{ item.price }}</div>
            <div class="unit">元</div>
          </div>
          <!-- 购物车图标 -->
          <img
            class="shopping-car"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/new-year-shopping-car.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bargainVisit } from '@/api/visit.js'

const categoryLinks = {
  // 新春好物
  1: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/new-year-xin-chun-hao-wu.png',
  // 休闲零食
  2: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/new-year-snacks.png',
  // 年货特产
  3: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/new-year-specialty.png'
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

  computed: {
    /**
     * 主图商品
     */
    mainPic () {
      return this.list[0]
    },
    /**
     * 商品列表
     */
    subList () {
      return this.list.filter((p, index) => index > 0)
    }
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
      if(window.__wxjs_environment === 'miniprogram'){
        window.wx.miniProgram.navigateTo({
          url: "/productModule/pages/skuDetail/skuDetail?skuId="+item.sku
        });
        return;
      }

      this.$router.push({
        path: "/spudetail",
        query: {
          id: item.sku
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.bg-container {
  width: 100%;
  padding-left: 11px;
  padding-right: 11px;
  margin-bottom: 40px;
  box-sizing: border-box;
  background: rgb(206, 69, 44);
}
.goods-catogry-name {
  text-align: center;
  .catogry-name-pic {
    width: 265px;
    height: 95px;
  }
}

// 主图
.main-pic {
  display: flex;
  width: 100%;
  height: 153px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 16px;
  overflow: hidden;

  .goods-pic {
    width: 210px;
    height: 153px;
    margin-right: 11px;
    background: #fff;
  }
  .right {
    flex: 1;
    box-sizing: border-box;
    padding-top: 18px;

    .main-pic-desc {
      width: 106px;
      font-size: 15px;
      line-height: 20px;
      margin-right: 22px;
      margin-bottom: 44px;
    }

    .main-pic-price-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: baseline;
        color: #f10e0e;
        font-size: 12px;
        font-family: Alibaba PuHuiTi;
      }

      .price {
        font-size: 21px;
      }
    }

    .shopping-car-icon {
      width: 19px;
      height: 19px;
      margin-right: 8px;
      margin-bottom: -2px;
    }
  }
}

.sub-pic-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .sub-pic-item {
    width: 169px;
    margin-bottom: 14px;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
  }

  .goods-pic {
    width: 100%;
    height: 164px;
    background: #fff;
    margin-bottom: 12px;
    overflow: hidden;

    img {
      width: 106%;
      height: 101%;
      margin-left: -6px;
      margin-top: -6px;
      max-width: auto;
      max-height: auto;
    }
  }

  // 商品标题
  .goods-desc {
    width: 140px;
    font-size: 15px;
    line-height: 20px;
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    color: #000000;
    margin-left: 10px;
    margin-right: 21px;
    margin-bottom: 14px;
  }

  .goods-price-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    margin-left: 9px;

    .left {
      display: flex;
      align-items: baseline;
      color: #f10e0e;
      font-size: 12px;
      font-family: Alibaba PuHuiTi;
    }

    .shopping-car {
      width: 19px;
      height: 19px;
      margin-right: 10px;
      margin-bottom: -2px;
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
  font-size: 21px;
  font-family: Alibaba PuHuiTi;
  font-weight: 700;
  margin-left: 5px;
}
</style>
