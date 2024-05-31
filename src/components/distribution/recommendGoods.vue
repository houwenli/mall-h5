<template>
  <div class="guess-warp recommend">
    <div class="bg_gradient"></div>
    <div class="guess-title" v-if="title">
      <span v-if="titleImg">
        <img src="../../assets/img/a@2x.png" alt="" style="width: 24px; height: 5px; margin: 0 11px 3px 0" />
      </span>
      {{ title }}
      <span v-if="titleImg">
        <img src="../../assets/img/b@2x.png" alt="" style="width: 24px; height: 5px; margin: 0 0 3px 11px" />
      </span>
    </div>
    <div class="guess-list">
      <template v-for="(item, index) in shopList">
        <div class="shop-card" @click="toDetails(item)" :key="index">
          <div class="shop-img" ref="shopImg" :style="`height: ${imgHeight}px`">
            <van-image style="height: 100%; width: 100%; object-fit: cover" :src="`${item.url}?imageView2/1/w/513`">
              <!-- <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template> -->
            </van-image>
          </div>
          <div class="shop-info">
            <div class="shop-info-name">
              <span>{{ item.name }}</span>
            </div>
            <div class="shop-info-price">
              <em>
                ¥
                <span class="price">{{ formatPrice(item.finalPrice) }}</span>
              </em>
              <span class="oldPrice" v-if="item.price != item.finalPrice">¥{{ item.price }}</span>
            </div>
          </div>
          <div class="footerGoodsBox">
            <img src="../../assets/img/distribution/share@2x.png" alt="" />
            <i>赚 ¥</i>
            <span class="sharePrice">{{ formatPrice(item.finalPrice) }}</span>
          </div>
        </div>
      </template>
    </div>
    <div class="guess-load-more-tips" v-if="noMore" ref="backTop">没有更多数据</div>
    <div class="guess-load-more-tips" v-else ref="backTop">正在加载中...</div>
  </div>
</template>

<script>
import { Toast, Image as VanImage } from 'vant'
import { isWx } from '@/utils/utils'
import { debounce, formatPrice } from '@/utils/utils'
import { getRecommendList } from '@/api/home' //分页查询为你推荐

let isxhr = false
export default {
  inject: ['reload'],
  name: 'shopList',
  props: {
    title: {
      type: String,
    },
    detailShow: {
      type: Boolean,
    },
    titleImg: {
      type: Boolean,
      default: false,
    },
    queryRcommendData: {
      type: String,
    },
  },
  components: {
    [Toast.name]: Toast,
    [VanImage.name]: VanImage,
  },
  data() {
    return {
      lazyComponent: true,
      isWx: isWx(), // 判断是否是微信
      shopList: [],
      formatPrice: formatPrice, // 格式化金额
      listQuery: {
        pageNum: 0, // 当前页码
        pageSize: 10, // 每页显示记录数
      },
      noMore: false, //没有更多
      loading: false, //正在加载
      isProcess: false, // 接口是否处理中
      imgHeight: 0, // 屏幕宽度
      isDetail: this.detailShow,
    }
  },
  created() {
    isxhr = false
    window.resetRecommendData = this.resetData
  },
  mounted() {
    window.addEventListener('scroll', this.scrollBottom, true)
    debounce(this.getData())
    window.onresize = () => {
      return (() => {
        this.setImgHeight()
      })()
    }
  },
  methods: {
    resetData() {
      console.log('免密登录时是否触发-------1-------->')
      this.shopList = []
      this.listQuery.pageNum = 0
      this.noMore = false
      this.getData()
    },
    getData() {
      if (this.noMore) {
        return
      }
      getRecommendList(this.listQuery).then((response) => {
        let list = response.data
        this.listQuery.pageNum++
        if (list.length > 0) {
          this.shopList = this.shopList.concat(list)
          this.setImgHeight()
        }

        this.loading = false
        if (list.length < 10) {
          this.noMore = true
        }
      })
    },
    setImgHeight() {
      this.$nextTick(() => {
        try {
          let imgBox = this.$refs.shopImg
          let wImgbox = imgBox[0].getBoundingClientRect().width
          this.imgHeight = wImgbox
        } catch (error) {
          console.log('setImgHeight: ', error)
        }
      })
    },
    // 跳转商品/店铺详情
    toDetails(item) {
      if (item.id !== 0 && !item.id) {
        Toast('缺少参数')
        return
      } else {
        if (this.isDetail) {
          this.$router.push({ path: '/spudetail', query: { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 } })
          this.reload()
        } else {
          this.$router.push({ path: '/spudetail', query: { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 } })
        }
      }
    },
    // 监听滚动高度
    scrollBottom() {
      let scorllTop, boxheight
      try {
        scorllTop = this.$refs.backTop.getBoundingClientRect().top // 加载盒子距顶部高度
        boxheight = this.$refs.backTop.getBoundingClientRect().height // 加载盒子高度
        // console.log('盒子顶部距顶部高度', scorllTop)
      } catch (error) {
        console.log('scrollBottom: ', error)
      }

      const windowHeight = window.screen.height // 可视区高度
      // console.log('可视区高度',windowHeight);
      if (scorllTop > 210) {
        if (scorllTop <= windowHeight) {
          if (!this.finished && !this.loading && isxhr) {
            this.loading = true
            // 请求的数据未加载完成时
            this.getData()
          }
          isxhr = true
        }
      }
    },
  },

  beforeDestroy() {
    window.removeEventListener('srcoll', this.scrollBottom)
  },
}
</script>

<style scoped lang="less">
.activebox {
  display: flex;
  align-items: center;
  .downpricebox {
    display: inline-block;
    position: relative;
    margin-right: 4px;
    width: 55px;
    height: 14px;
    .pricedownimg {
      position: absolute;
      left: 0;
      top: 0;
      width: 55px;
      height: 14px;
      border-radius: unset !important;
    }
    .downprice {
      position: absolute;
      top: -2.5px;
      right: -4px;
      width: 34px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      transform: scale(0.76);
      display: flex;
      align-items: center;
      justify-content: center;
      display: inline-block;
    }
  }
  .fullgivebox {
    position: relative;
    margin-right: 4px;
    width: 13.5px;
    height: 13.5px;
    .fullgive {
      font-size: 12px;
      transform: scale(0.82);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #e60113;
    }
  }
  .fullgivebox::after {
    border-radius: 2px;
    border-color: #e60113;
  }
}
.guess-warp {
  padding: 9px 12px 0;
  position: relative;
  .bg_gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
    z-index: -9;
  }
  .guess-title {
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    height: 35px;
    line-height: 16px;
    padding: 10px 0 10px 10px;
  }
}

.guess-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.shop-card {
  // width: 49%;
  width: 171px;
  border-radius: 5px;
  margin-bottom: 9px;
  overflow: hidden;
}

.shop-card .shop-img {
  width: 100%;
  height: 100%;
}

.shop-card .shop-info {
  background-color: #fff;
  overflow: hidden;
  padding: 7px 16px 0 10px;
  // padding: 8px 16px 0 10px;
  height: 80px;
}
.footerGoodsBox {
  width: 100%;
  height: 27px;
  background: linear-gradient(90deg, #ff5b10 0%, #e60113 100%);
  border-radius: 0px 0px 5px 5px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 11px;
    height: 11px;
  }
  i {
    display: inline-block;
    transform: scale(0.92);
    font-size: 12px;
    margin-left: 4px;
  }
  .sharePrice {
    font-size: 14px;
    font-weight: 500;
  }
}

.shop-card .shop-info .shop-info-name {
  color: #000000;
  font-size: 14px;
  line-height: 19px;
  height: 38px;
  text-align: left;
  /* 超出两行隐藏 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.shop-card .shop-info .shop-info-price {
  color: #e60113;
  margin-top: 9.5px;
  margin-bottom: 6.5px;
  height: 16px;
  text-align: left;
  font-size: 12px;
}

.shop-card .shop-info .shop-info-price .price {
  font-size: 17px;
  font-weight: bold;
  display: inline-block;
  height: 16px;
  line-height: 16px;
}
.shop-card .shop-info .shop-info-price .oldPrice {
  display: inline-block;
  font-size: 12px;
  text-decoration: line-through;
  color: #999;
  transform: scale(0.92);
  margin-left: 2px;
  margin-top: 1px;
}

.guess-load-more-tips {
  padding: 10px 0;
  text-align: center;
  color: #888888;
}
</style>
