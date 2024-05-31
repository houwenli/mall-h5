<template>
  <div class="single-content">
    <header class="content-header">
      <div class="back-icon" @click="back">
        <img :src="$oss + '/distribution/arrow-back-white-2x.png'" alt="" />
      </div>
      <!-- <div class="header-title"></div> -->
    </header>
    <swiper ref="mySwiper" v-if="list.length > 0" :options="swiperOption">
      <swiper-slide v-for="(item, index) in list" :key="item.skuId" :class="{ 'active-top': index <= 3 && currentIndex + 1 === index }">
        <swiperControl :carouselPics="item.carouselPics" :video="item.video" :videoPic="item.videoPic"></swiperControl>

        <goodsInfo :item="item"></goodsInfo>

        <div class="foot-box">
          <div class="favouritebox">
            <img src="@/assets/img/goodsDetail/favourite2_2.png" alt v-if="!item.hasAtten" @click="favouriteChange(item)" />
            <img src="@/assets/img/goodsDetail/favourite2_1.png" alt v-else @click="favouriteChange(item)" />
            <span class="favourite-text">{{ item.hasAtten ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="foot-bt">
            <van-button round color="#FFBE0C" @click="shopping(item, 1, index)">加入购物车</van-button>
            <van-button round color="linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%)" @click="shopping(item, 2, index)">
              立即购买
            </van-button>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <skuPopup v-if="skuShow" :show.sync="skuShow" :info="skuInfo" :current-index="currentIndex"></skuPopup>
  </div>
</template>
<script>
  import { cancelAttention, addAttention } from '@/api/spudetail'

  import swiperControl from './components/swiper.vue'

  // 由于vant-swiper动态添加个数时候，滑动高度会被重写计算，导致每个滑动高度出错，所以使用swiper组件
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
  import skuPopup from '@/views/specialTopic/comp/singlePage/components/skuPop.vue'
  import goodsInfo from './components/goodsInfo'
  import { getsiglePageSpuList } from '@/api/specialTopic/ranking' //分页查询为你推荐

  export default {
    name: 'singlePage',
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },

    components: {
      swiperControl,
      Swiper,
      SwiperSlide,

      skuPopup,
      goodsInfo,
    },

    data() {
      return {
        swiperOption: {
          direction: 'vertical',
          // autoHeight: true,
          slidesPerView: 'auto',
          speed: 80,
          // height: window.innerHeight,
          on: {
            transitionEnd: this.pageChange,
          },
        },

        height: window.innerHeight,
        list: [],

        skuShow: false,
        skuInfo: {},

        loadding: true,
        finished: false,
        showSkuPopup: false,

        pageNum: 0,
        pageSize: 10,
        currentIndex: 0,
      }
    },
    created() {
      // this.pageChange(-1)
      this.queryList()
    },

    methods: {
      back() {
        appBack(this)
      },
      pageChange(index) {
        if (index === undefined) {
          index = this.$refs.mySwiper.$swiper.activeIndex
        }

        this.currentIndex = index

        if (index === this.list.length - 1 && !this.loadding && !this.finished) {
          this.queryList()
        }
      },

      shopping(item, isFrom, index) {
        this.skuShow = true
        this.skuInfo = { skuId: item.skuId, storeId: item.storeId, sourceType: item.sourceType, isFrom, index }
      },

      async queryList() {
        this.loadding = true
        let param = {
          spuId: this.$route.query.spuId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          recommendNum: this.config.showNum,
        }
        try {
          let res = await getsiglePageSpuList(param)
          if (res.code === 200) {
            let data = (res.data || []).map((item) => {
              return this.dataConfig(item)
            })
            this.list = this.list.concat(data)
            this.pageNum++

            if (data.length < this.pageSize) {
              this.finished = true
            }
          }
        } catch (error) {
          console.log(error)
        }
        this.loadding = false
      },

      dataConfig(data) {
        // 轮播图片
        let carouselPics = (data.spuImages || [{ url: data.url }]).map((item) => {
          let image = item.url.split('?')[0]
          let imgUrl = image.split('/')
          let img = imgUrl.join('/')
          img += '?imageView2/1/w/750'
          return img
        })

        let video = data.video
        let videoPic = ''
        if (video) {
          videoPic = carouselPics[0]
          carouselPics.unshift(videoPic)
        }

        return {

          carouselPics,
          id: data.skuId,
          ...data,
          video,
          videoPic,
        }
      },

      // 收藏或者取消收藏商品
      favouriteChange(item) {
        // 收藏或者取消收藏商品
        let params = {
          skuId: item.id,
          sourceType: item.sourceType || 1,
          storeId: item.storeId,
        }
        if (item.hasAtten) {
          cancelAttention(params).then((res) => {
            // 大于0成功， 0 失败  -1已经关注
            if (res.code == 200 && res.data > 0) {
              item.hasAtten = false
              this.$toast('已取消收藏')
            } else {
              this.$toast('取消收藏失败')
            }
          })
        } else {
          addAttention(params).then((res) => {
            if (res.code == 200 && res.data > 0) {
              item.hasAtten = true
              this.$toast('收藏成功')
            } else {
              this.$toast('收藏失败')
            }
          })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .single-content {
    height: 100vh;
    overflow-y: hidden;
  }
  .content-header {
    background: rgba(0, 0, 0, 0.1);
    width: 100%;
    padding: 12px 18px;
    .back-icon {
      width: 20px;
      height: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .swiper-container {
    backdrop-filter: blur(10px);
    height: calc(~'100% - 44px');
  }
  .swiper-slide {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  .swiper-slide:nth-child(-n + 3) {
    height: 90%;
  }
  .active-top {
    background-color: #fff;
    /deep/ .my-swipe {
      border-radius: 24px 24px 0 0;
    }
  }

  .foot-box {
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 12px 0 8px;
    .favouritebox {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img {
        width: 21px;
        height: 20px;
      }
      .favourite-text {
        font-size: 11px;
        color: #999999;
        line-height: 15px;
      }
    }
    .foot-bt {
      .van-button {
        padding: 0;
        width: 130px;
        height: 40px;
        line-height: 40px;
        color: #fff9e9;
        text-align: center;
      }
    }
  }
</style>
