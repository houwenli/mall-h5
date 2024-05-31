<template>
  <div style="height:100%;">
    <!-- <x-header @on-click-back="back()" :left-options="{ backText: '', preventGoBack: true }">
      商品清单
      <span slot="right" style="color: #666">共{{ num }}件</span>
    </x-header> -->

    <group class="noTopBoderCells">
      <cell v-for="(sku, i) in skus" class="spuListCell" :key="i" style="padding: 1px 15px">
        <ul slot="title" class="searchlist-normal clearfix cartSpuList" style="margin-top: 0">
          <li class="normal-list">
            <div class="pro-img"><img :src="sku.image" /></div>
            <div class="product-info-box">
              <div class="product-name">
                <i v-if="sku.isGift" class="self-sell" style="background-color: #e4393c; border: 1px solid #e4393c">满赠</i>
                <div>{{ sku.name }}</div>
              </div>
              <div style="color: #999">x{{ sku.num }}</div>
              <div class="product-price-m">
                <em>¥{{ sku.price.toFixed(2) }}</em>
              </div>
            </div>
          </li>
        </ul>
      </cell>
    </group>
  </div>
</template>

<script>
  import { XHeader, Group, Cell } from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      Cell,
    },
    props: ['skus', 'num'],
    created() {
      document.body.removeAttribute('class', 'gray-bg')
    },
    methods: {
      // 返回结算页主页面
      back() {
        this.$emit('back')
      },
    },
  }
</script>
