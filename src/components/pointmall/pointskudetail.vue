<template>
  <div>
    <group class="search-group point-search-group">
      <div class="search-left-arrow" @click="toBack"></div>
      <tab v-model="spuTabIndex" custom-bar-width="60px" class="header-tabBar">
        <tab-item @click.native="toPage">商品</tab-item>
        <tab-item @click.native="toPage">详情</tab-item>
      </tab>
    </group>

    <div ref="spuPage" style="margin-bottom: 50px; padding-top: 51px">
      <swiper :list="carouselPics" :aspect-ratio="1" :show-desc-mask="false" dots-position="center"></swiper>

      <div class="details-colortype">
        <div class="fourth-cells">
          <div class="fourth-cell">
            <div class="product-title">{{ pointSku.name }}</div>
            <div class="product-sub">{{ pointSku.subTitle }}</div>
            <div class="product-price">
              <span style="font-size: 14px; color: #666; margin-right: 10px; vertical-align: text-bottom">积分</span>
              {{ pointSku.point }}
            </div>
            <div class="product-price">
              <span style="font-size: 14px; color: #666; margin-right: 10px; vertical-align: text-bottom">市场参考价&nbsp;&nbsp;¥{{ pointSku.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <group style="margin-top: 10px" v-if="hotPointSkuList.length >= 6">
        <cell title="热门兑换"></cell>
      </group>
      <swiper :aspect-ratio="1.145" :show-desc-mask="false" dots-position="center" v-if="hotPointSkuList.length >= 6">
        <swiper-item>
          <ul class="searchlist-normal clearfix searchlist-square-pic interestPanel">
            <li v-for="(item, index) in hotPointSkuList" v-if="index <= 5" class="normal-list" @click="toPointSkuDetail(item.id)">
              <div class="pro-img"><img :src="!!item.pics ? item.pics.split(',')[0] : ''" :alt="item.name" /></div>
              <div class="product-info-box">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-price-m">
                  <span>积分：</span>
                  <em>
                    <span class="price" style="margin: 0">{{ item.point }}</span>
                  </em>
                </div>
              </div>
            </li>
          </ul>
        </swiper-item>
        <swiper-item v-if="hotPointSkuList.length >= 12">
          <ul class="searchlist-normal clearfix searchlist-square-pic interestPanel">
            <li v-for="(item, index) in hotPointSkuList" v-if="index >= 6 && index <= 11" class="normal-list" @click="toPointSkuDetail(item.id)">
              <div class="pro-img"><img :src="!!item.pics ? item.pics.split(',')[0] : ''" :alt="item.name" /></div>
              <div class="product-info-box">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-price-m">
                  <span>积分：</span>
                  <em>
                    <span class="price" style="margin: 0">{{ item.point }}</span>
                  </em>
                </div>
              </div>
            </li>
          </ul>
        </swiper-item>
        <swiper-item v-if="hotPointSkuList.length >= 18">
          <ul class="searchlist-normal clearfix searchlist-square-pic interestPanel">
            <li v-for="(item, index) in hotPointSkuList" v-if="index >= 12 && index <= 17" class="normal-list" @click="toPointSkuDetail(item.id)">
              <div class="pro-img"><img :src="!!item.pics ? item.pics.split(',')[0] : ''" :alt="item.name" /></div>
              <div class="product-info-box">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-price-m">
                  <span>积分：</span>
                  <em>
                    <span class="price" style="margin: 0">{{ item.point }}</span>
                  </em>
                </div>
              </div>
            </li>
          </ul>
        </swiper-item>
        <swiper-item v-if="hotPointSkuList.length >= 24">
          <ul class="searchlist-normal clearfix searchlist-square-pic interestPanel">
            <li v-for="(item, index) in hotPointSkuList" v-if="index >= 18 && index <= 23" class="normal-list" @click="toPointSkuDetail(item.id)">
              <div class="pro-img"><img :src="!!item.pics ? item.pics.split(',')[0] : ''" :alt="item.name" /></div>
              <div class="product-info-box">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-price-m">
                  <span>积分：</span>
                  <em>
                    <span class="price" style="margin: 0">{{ item.point }}</span>
                  </em>
                </div>
              </div>
            </li>
          </ul>
        </swiper-item>
      </swiper>

      <div ref="detailPage" style="position: relative; top: -41px"></div>
      <group style="margin-top: 10px">
        <cell title="礼品介绍" style="text-align: center"></cell>
      </group>
      <div class="tab-details">
        <div class="clearfix" v-html="pointSku.mobileDesc"></div>
      </div>
    </div>

    <section class="actionbar">
      <div class="action-list">
        <a class="item addtocart" style="background: #85c360" @click="toSubmitPointOrder">立即兑换</a>
      </div>
    </section>
  </div>
</template>

<style>
  .point-search-group .weui-cells {
    height: 50px;
  }
</style>

<script>
  import { Group, Cell, Tab, TabItem, Swiper, SwiperItem } from 'vux'

  import {
    queryPointSkuDetail, // 查询积分商品信息详情
    queryHotPointSkuList, // 查询推荐的积分商品列表
  } from '@/api/pointskudetail'

  export default {
    components: { Group, Cell, Tab, TabItem, Swiper, SwiperItem },
    data() {
      return {
        spuTabIndex: 0, // 当前tab的选中  0 商品 1 详情
        carouselPics: [], // 轮播图片
        pointSku: {}, // 积分商品信息
        hotPointSkuList: [], // 热销的积分商品列表
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryPointSku(this.$route.query.id)
      this.queryHotPointSku(24)
    },
    methods: {
      // 查询积分商品详情信息
      queryPointSku(id) {
        queryPointSkuDetail(id).then((res) => {
          if (res.flag) {
            this.pointSku = res.data
            // 设置轮播图片
            if (this.pointSku.pics) {
              let picArray = this.pointSku.pics.split(',')
              this.carouselPics = picArray.map((image) => {
                return { img: image }
              })
            }
          } else {
            // 跳转到商品已下架页面
            this.$router.push({ path: '/spunotfind' })
          }
        })
      },
      // 查询热销的积分单品列表
      queryHotPointSku(num) {
        queryHotPointSkuList(num).then((res) => {
          this.hotPointSkuList = res
        })
      },
      // 顶部tab切换
      toPage() {
        if (this.spuTabIndex === 0) {
          this.$refs.spuPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        if (this.spuTabIndex === 1) {
          this.$refs.detailPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      },
      // 返回上一页
      toBack() {
        this.$router.go(-1)
      },
      // 跳转到提交积分订单页面
      toSubmitPointOrder() {
        this.$router.push({
          path: '/pointskusubmitorder',
          query: { skuId: this.$route.query.id, point: this.pointSku.point },
        })
      },
    },
  }
</script>
