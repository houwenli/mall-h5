<template>
  <div style="height: 100%">

    <!-- <x-header @on-click-back="back()" :left-options="{backText: '',preventGoBack:true}">推荐组合</x-header> -->

    <div style="padding-bottom: 50px">

      <div class="cart_section" style="margin: 0">
        <div class="head_wrap">
          <div class="item">
            <div class="goods type_additional">
              <i class="icon_select"></i>
              <img class="image" :src="mainSku.url">
              <div class="goodscontent">
                <div class="name">{{mainSku.name}}</div>
                <div style="height: 21px"></div>
                <div class="goods_line">
                  <p class="price">¥ <em class="int">{{mainSku.price.toFixed(2).toString().split('.')[0]}}</em>.{{mainSku.price.toFixed(2).toString().split('.')[1]}}
                  </p>
                  <p>×{{mainSku.limitBatchNum}}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-for="(combination, index) in combinations" :key="index" class="item">
            <div class="goods" :class="combination.isCheck?'selected':''">
              <i @click="checkSku(combination)" class="icon_select"></i>
              <img class="image" :src="combination.url">
              <div class="goodscontent">
                <div class="name">{{combination.name}}</div>
                <div style="height: 21px"></div>
                <div class="goods_line">
                  <p class="price">¥ <em class="int">{{combination.price.toFixed(2).toString().split('.')[0]}}</em>.{{combination.price.toFixed(2).toString().split('.')[1]}}
                  </p>
                  <p>×{{combination.limitBatchNum}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="fixBar">
      <div class="total">
        <p style="padding-top: 0; line-height: 50px; height: auto">合计：<strong>¥{{price.toFixed(2)}}</strong></p>
        <a href="javascript:;" v-if="isLogin" class="buy" @click="buy()">购买组合</a>
        <a href="javascript:;" v-if="!isLogin" class="buy" @click="toLogin">去登录购买</a>
      </div>
    </div>

  </div>
</template>

<script>
  import {XHeader} from 'vux'
  import {
    addShoppingCart
  } from '@/api/spudetail';
  import { getToken } from '@/utils/token'

  export default {
    components: {XHeader},
    props: ["spu", "combination"],
    data() {
      return {
        // isLogin: window.isLogin, // 是否登录
        isLogin: getToken()?getToken():false, // 判断是否登录
        mainSku: {price: 0}, // 主的商品
        combinations: [],// 商品组合
        price: 0// 总的价格
      }
    },
    created: function () {
      document.body.removeAttribute('class', 'gray-bg')
      this.mainSku = this.getMainSku();
      this.combinations = this.getCombinations();
      this.price = this.mainSku.price;
    },
    methods: {
      // 购买商品组合
      buy() {
        // 购买商品组合
        let skus = new Array();
        skus.push(this.mainSku.skuId);
        this.combinations.map((v) => {
          if (v.isCheck) {
            skus.push(v.skuId);
          }
        })

        let result = 0;


        for (let i = 0; i < skus.length; i++) {
          addShoppingCart({skuId: skus[i], num: 1}).then(res => {
            result = res;
            // 最后一个
            if (i == skus.length - 1) {
              switch (res) {
                case 0:
                  this.$vux.toast.text('加入购物车失败，请刷新后重试！', 'bottom')
                  break;
                case 1:
                  this.$router.push({path: '/cart', query: {from: 'spudetail'}})
                  break;
                case -1:
                  this.$vux.toast.text('库存不足！', 'bottom')
                  break;
                case -2:
                  this.$vux.toast.text('商品不存在！', 'bottom')
                  break;
                case -3:
                  this.$vux.toast.text('参数错误！', 'bottom')
                  break;
                case -4:
                  this.$vux.toast.text('商品已下架！', 'bottom')
                  break;
                case -5:
                  this.$vux.toast.text('达到商品限购数量！', 'bottom')
                  break;
                case -6:
                  this.$vux.toast.text('预售商品不能加入购物车！', 'bottom')
                  break;
                case -7:
                  this.$vux.toast.text('商品已过期！', 'bottom')
                  break;
                default:
                  this.$vux.toast.text('加入购物车失败，请刷新后重试！', 'bottom')
                  break;
              }
            }
          })
        }
      },
      // 商品的选择
      checkSku(combination) {
        combination.isCheck = !combination.isCheck;
        this.price = this.calcPrice();
      },
      // 计算价格
      calcPrice() {
        let price = parseFloat(this.mainSku.price);
        this.combinations.map((v) => {
          if (v.isCheck) {
            price = price + parseFloat(v.price);
          }
        })
        return price;
      },
      // 跳转到登录页
      toLogin() {
        this.$router.push({path: '/login'})
      },
      // 返回商品详情页面
      back() {
        this.$emit('back');
      },
      //获得组合商品
      getCombinations() {
        const combinations = new Array();
        this.combination.map((v) => {
          combinations.push({
            skuId: v.id,
            url: v.images[0],
            isCheck: false,
            price: v.isBatchSku === '1' ? this.getBatchPrice(v.skuBatchList[0].batchNum, v.skuBatchList) : v.price,
            name: v.name,
            limitBatchNum: v.isBatchSku === '1' ? v.skuBatchList[0].batchNum : 1,
          });
        })
        return combinations;
      },
      // 获得主的单品
      getMainSku() {
        let price = this.spu.price;

        if (this.spu.memberPrice && this.spu.memberPrice.memberPrice) {
          price = this.spu.memberPrice.price;
        }

        return {
          skuId: this.spu.id,
          url: this.spu.images[0],
          isCheck: true,
          price: this.spu.sku.isBatchSku === '1' ? this.getBatchPrice(this.spu.sku.limitBatchNum, this.spu.sku.skuBatchList) : price,
          name: this.spu.name,
          limitBatchNum: this.spu.sku.isBatchSku === '1' ? this.spu.sku.limitBatchNum : 1,
        };
      },
      // 获得起批价格
      getBatchPrice(num, skuBatchList) {
        let price = 0;
        for (let i = 0; i < skuBatchList.length; i++) {
          if (num < skuBatchList[i].batchNum) {
            break;
          }
          price = skuBatchList[i].batchPrice;
        }

        return price;
      },
      toSettlement() {
        this.$router.push({path: '/settlement'})
      }
    }
  }
</script>
