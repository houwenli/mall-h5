<template>
  <div class="useCoupon-page">
    <van-nav-bar title="优惠券" left-arrow @click-left="onClickLeft" class="topbox" />
    <div class="coupon-card">
      <div class="coupon-content">
        <p class="coupon-use-detail">
          <span class="text" v-if="pageData.type != 2">￥</span>
          <span class="price" v-if="pageData.type != 2">{{ skuPriceInt(pageData.price) }}</span>
          <span class="price" v-else>{{ parseInt(pageData.discountRate * 100) / 10 }}</span>
          <span class="text" v-if="pageData.type != 2">{{ '.' + skuPriceFloat(pageData.price) }}</span>
          <span class="text" v-else>折</span>
          <span class="text right-text" v-if="pageData.type != 0">订单满{{ pageData.fullPrice }}可用</span>
          <span class="text right-text" v-else>下单即享</span>
        </p>
        <p class="coupon-use-time">
          使用时间：{{ timeFormat(new Date(pageData.validityStartTime).getTime(), 'yyyy.mm.dd hh:MM') }} -
          {{ timeFormat(new Date(pageData.validityEndTime).getTime(), 'yyyy.mm.dd hh:MM') }}
        </p>
      </div>
    </div>
    <!-- 适用商品 -->
    <div class="title">适用商品</div>
    <van-list
      v-model="isUpLoading"
      :finished="upFinished"
      :immediate-check="false"
      :offset="300"
      finished-text=" 我是有底线的 "
      @load="onLoadList"
      v-if="pageList.length > 0"
    >
      <ul
        class="clearfix searchlist-normal"
        :class="{ 'searchlist-square-pic': !switchViewValue }"
        :style="[{ 'background-color': switchViewValue ? '#fff' : '#f5f5f5' }, { padding: switchViewValue ? '0 0.46rem' : '0 0.38rem' }]"
      >
        <li v-for="(item, e) in pageList" :key="e" class="normal-list" @click="tospudetail(item)">
          <div class="pro-img" :class="[switchViewValue ? 'listclass' : 'shuclass']">
            <img :src="item.url" style="text-align: center" />
            <!-- object-fit: contain; 防止图片变形 -->
          </div>
          <div
            class="product-info-box"
            :style="[
              { width: switchViewValue ? '59.71%' : '100%' },
              { margin: switchViewValue ? '' : '0.25rem 0 0 0.3rem' },
              { height: switchViewValue ? 'auto' : '3.92rem' },
            ]"
          >
            <div class="product-name" :class="[switchViewValue ? '' : 'productname']">{{ item.skuName }}</div>

            <div
              class="product-price-m"
              :style="[{ 'margin-top': switchViewValue ? '1.96rem' : '0.48rem' }]"
              :class="[item.price > item.finalPrice && switchViewValue ? 'isactivetype' : item.price == item.finalPrice ? 'unfallprice' : 'unactivetype']"
            >
              <em>
                ¥
                <span class="price">{{ item.isBatchSku == '1' ? item.lowestBatchPrice.toFixed(2) : item.finalPrice.toFixed(2) }}</span>
              </em>
              <span class="oldPrice" v-if="item.price != item.finalPrice">¥{{ item.price }}</span>
            </div>
            <!-- 活动 -->
            <div class="activebox">
              <!-- 直降 -->
              <label class="downpricebox" v-if="r.type == 1" v-for="r in item.marketingVos" :key="r.id">
                <img src="../../assets/img/icon_pc@2x.png" class="pricedownimg" alt="" />
                <span class="downprice" :style="{ top: isWx ? '-0.05rem' : '' }">{{ r.fall.price }}元</span>
              </label>
              <!-- 满赠-->
              <label class="fullgivebox border_half" v-if="r.type == 2" v-for="r in item.marketingVos" :key="r.id">
                <span class="fullgive" :style="{ 'margin-top': isWx ? '0.04rem' : '' }">赠</span>
              </label>
            </div>

            <div class="store">
              <p class="storeInfo">
                <label for class="storename">{{ item.storeName }}</label>
                <span class="jumpstore" @click.stop="jumpDeatail(item.storeId)">进店</span>
                <span class="jumpstore" style="width: 0.2rem; margin-left: 0.12rem">
                  <img src="@/assets/img/you.png" alt style="width: 0.2rem; height: 0.36rem" />
                </span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>
<script>
  import { NavBar, Button, List, PullRefresh } from 'vant'
  import { debounce, formatPrice } from '@/utils/utils'
  import { getCouponDetail } from '@/api/mycoupon'
  import { searchSpus } from '@/api/spulist'
  import timeFormat from '@/utils/timeFormat'
  export default {
    components: { [NavBar.name]: NavBar, [Button.name]: Button, [List.name]: List, [PullRefresh.name]: PullRefresh },
    data() {
      return {
        timeFormat,
        switchViewValue: false,
        noMore: false,
        couponId: '',
        pageData: {},
        pageList: [],
        formatPrice: formatPrice, // 格式化金额
        searchParam: {
          pageNum: 0,
          pageSize: 10,
          attributes: [],
          brandNames: [],
          cateId: '-1',
          queryString: '',
          sortItems: [],
        },
        loading: false,
        isUpLoading: false,
        isDownLoading: false,
        upFinished: false,
      }
    },
    created() {
      if (this.$route.query.id) {
        this.couponId = this.$route.query.id
        this.getDetail()
      }
    },
    methods: {
      onLoadList() {
        // this.isUpLoading = true
        this.searchParam.pageNum++
        this.getList()
      },
      // 返回
      onClickLeft() {
        if (this.backUrl) {
          this.$router.push({ path: this.backUrl })
        } else {
          this.$router.go(-1)
        }
      },
      //查询优惠券详情
      getDetail() {
        getCouponDetail(this.couponId).then((res) => {
          if (res.code == 200) {
            this.pageData = res.data
            if (this.pageData.permittedType == 1) {
              this.searchParam.thirdCateIds = this.pageData.cateIdListForES
            } else if (this.pageData.permittedType == 2) {
              this.searchParam.spuIds = this.pageData.spuIdListForES
            }
            debounce(this.getList())
          }
        })
      },
      skuPriceInt(price) {
        let intPrice = 0,
          floatPrice = 0
        if (!price) {
          price = 0
        } else {
          price = price.toFixed(2).split('.')[0]
        }
        return price
      },
      skuPriceFloat(price) {
        let intPrice = 0,
          floatPrice = 0
        if (!price) {
          price = 0
        } else {
          price = price.toFixed(2).split('.')[1]
        }
        return price
      },
      getList() {
        if (this.noMore) {
          return
        }
        searchSpus(this.searchParam).then((res) => {
          this.loading = false //数据请成功后
          this.isUpLoading = false
          this.isDownLoading = false
          let list = res.data.esSearchResponse.datas
          if (list == null || list.length === 0) {
            // 加载结束
            this.upFinished = true
          }
          if (list.length < this.searchParam.pageSize) {
            // 最后一页不足10条的情况
            this.upFinished = true
          }
          // 处理数据
          if (this.searchParam.pageNum === 0) {
            this.pageList = list
          } else {
            this.pageList = this.pageList.concat(list)
          }
        })
      },
      // 进入店铺
      jumpDeatail(id) {
        if (!id) {
          this.$router.push({ path: '/' })
        } else {
          this.$router.push({
            path: '/storeindex',
            query: { storeId: id },
          })
        }
      },
      // 跳转到商品详情页
      tospudetail(item) {
        this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
      },
    },
  }
</script>
<style lang="less" scoped>
  .useCoupon-page {
    /deep/ .van-list__finished-text {
      background: #f5f5f5;
    }
    .topbox {
      /deep/ .van-icon {
        color: #464646;
        font-size: 0.92rem;
      }
      /deep/ .van-nav-bar__title {
        color: #000;
        font-size: 0.68rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    .coupon-card {
      height: 120px;
      background: url('../../assets/img/activity/couponbg03@2x.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .coupon-content {
        width: 321px;
        height: 88px;

        .coupon-use-detail {
          padding-top: 15px;
          display: flex;
          justify-content: center;
          align-items: baseline;
          color: #e60113;
          font-weight: 500;
          .text {
            font-size: 16px;
            line-height: 22px;
          }
          .price {
            font-size: 40px;
            line-height: 34px;
          }
          .right-text {
            margin-left: 10px;
            line-height: 20px;
          }
        }
        .coupon-use-time {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
      }
    }

    .title {
      background: #f5f5f5;
      padding: 20px 0 10px 20px;
      color: #000;
      font-size: 17px;
      font-weight: 500;
      line-height: 18px;
    }
  }

  .activebox {
    display: flex;
    align-items: center;
    .downpricebox {
      display: inline-block;
      position: relative;
      margin-right: 0.16rem;
      width: 2.2rem;
      height: 0.56rem;
      .pricedownimg {
        position: absolute;
        width: 2.2rem;
        height: 0.56rem;
        border-radius: unset !important;
      }
      .downprice {
        position: absolute;
        top: -0.06rem;
        right: -0.16rem;
        width: 1.36rem;
        text-align: center;
        color: #fff;
        font-size: 0.48rem;
        transform: scale(0.76);
        height: 0.56rem;
        display: flex;
        align-items: center;
        justify-content: center;
        display: inline-block;
      }
    }
    .fullgivebox {
      position: relative;
      margin-right: 0.16rem;
      width: 0.54rem;
      height: 0.54rem;
      .fullgive {
        font-size: 0.48rem;
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
      border-radius: 0.08rem;
      border-color: #e60113;
    }
  }

  .searchlist-normal {
    padding: 0rem 0.38rem;
    background-color: #fff;
  }

  .searchlist-normal .normal-list {
    margin-bottom: 0.48rem;
    border-radius: 0.2rem;
    padding-top: 0;
    height: auto;
    position: relative;
  }

  .searchlist-normal .normal-list .pro-img {
    height: 5.6rem;
    // width: 69%;
    margin-left: 0;
  }

  .searchlist-normal .normal-list .listclass {
    width: 40.645%;
    border-radius: 0.2rem;
    // overflow: hidden;
  }

  .searchlist-normal .normal-list img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    border: none;
    border-radius: 0.2rem;
  }

  .searchlist-normal .normal-list .product-info-box {
    margin-top: 0.15rem;
    width: 58.3%;
  }

  .searchlist-square-pic .normal-list .product-info-box .productname {
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
    width: 100%; /*需要配合宽度来使用*/
    display: block !important;
    height: 0.8rem;
    line-height: 0.8rem;
  }

  // .searchlist-square-pic {
  //   background: linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  //   background: -moz-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  //   background: -webkit-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  //   background: -webkit-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  //   background: -o-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  //   background: -ms-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  // }

  .searchlist-square-pic .normal-list {
    width: 47.4%;
    margin: 0px 1.3% 0.36rem;
    border: 0;
  }

  .searchlist-square-pic .normal-list .product-info-box {
    height: 3.32rem;
  }

  .searchlist-normal .normal-list .product-info-box .product-name {
    color: #000;
    display: -webkit-box;
  }

  .searchlist-normal .normal-list .product-info-box:after {
    display: none;
  }

  .searchlist-normal .normal-list .product-info-box .product-price-m .oldPrice {
    display: inline-block;
    font-size: 0.48rem;
    text-decoration: line-through;
    color: #999;
    transform: scale(0.92);
    margin-left: 0.08rem;
    margin-top: 0.04rem;
  }

  .searchlist-normal .normal-list .product-info-box .product-price-m em {
    font-size: 0.48rem;
    font-family: PingFangSC-Regular, PingFang SC;
  }

  .searchlist-normal .normal-list .product-info-box .product-price-m em span.price {
    font-size: 0.7rem;
    // font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
  }
  .storeBox {
    // width: 100%;
    height: 2.8rem;
    margin: 0.2rem 0.4rem;
    padding: 0 0.48rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f5f5f5;
    border-radius: 0.24rem;

    .storelogo {
      width: 10%;

      img {
        width: 1.28rem;
        height: 1.28rem;
      }
    }

    .store_xx {
      width: 66%;
      font-size: 0.56rem;
      color: #000;
      text-align: left;
      margin-left: 0.48rem;

      .store_gz {
        font-size: 0.4rem;
        color: #666;
        margin-left: -0.48rem;
        transform: scale(0.9);
      }
    }

    .jumoStore {
      text-align: right;
      width: 24%;
      color: #333;
    }
  }

  .store {
    .storeInfo {
      color: #888;
      font-size: 0.48rem;
      height: 1.2rem;
      line-height: 1.2rem;
      display: flex;

      .storename {
        margin-right: 0.4rem;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
        max-width: 60%; /*需要配合宽度来使用*/
      }

      .jumpstore {
        position: relative;
        display: inline-block;

        img {
          width: 0.2rem;
          height: 0.36rem;
          margin-left: 0.12rem;
          position: absolute;
          top: 50%;
          left: unset;
          margin-top: -0.184rem;
        }
      }
    }
  }

  .searchlist-normal .normal-list .product-info-box .gray-pro-info {
    margin-top: 0.32rem;
  }

  .spuListScroll /deep/ .loading-layer {
    background: #f5f5f5;
    margin-top: -0.48rem;
  }

  .searchlist-normal .normal-list .shuclass {
    width: 100%;
    border-radius: 0.2rem 0.2rem 0 0;
  }

  .searchlist-normal .normal-list .shuclass img {
    border-radius: 0.2rem 0.2rem 0 0;
  }
</style>
