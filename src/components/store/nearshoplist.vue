<template>
  <div style="height: 100%">

    <!-- <x-header :left-options="{backText: ''}">附近店铺</x-header> -->

    <el-amap :plugin="plugin">
    </el-amap>

    <div v-for="storeInfo in storeInfoList" class="shop-item">
      <div class="shop-top">
        <ul>
          <li>{{ storeInfo.storeName }}</li>
          <li>销量{{ storeInfo.saleCount }}&nbsp;&nbsp;共{{ storeInfo.skusCount }}件宝贝</li>
          <li>距离您当前位置{{ formatPrice(storeInfo.distance) }}km</li>
        </ul>
        <x-button mini type="primary" class="shop-btn" @click.native="toStoreIndex(storeInfo.id)">进店</x-button>
      </div>
      <div v-if="storeInfo.skus !== []" class="shop-goods">
        <div v-for="(sku,index) in storeInfo.skus" v-if="index <= 2" class="shop-goods-item"
             @click="toSpuDetail(sku.id)">
          <div class="imgBox"><img :src="sku.url"></div>
          <span>¥{{ getBatchSkuPrice(sku) }}</span>
        </div>
      </div>
    </div>

    <divider v-if="storeInfoList.length === 0" class="dividerCenter">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, Group, Divider, XButton} from 'vux'

  import {formatPrice, getBatchSkuPrice} from '@/utils/utils';

  import {queryNearShopList} from '@/api/nearshoplist';

  export default {
    components: {XHeader, Group, Divider, XButton},
    data() {
      const self = this;
      return {
        plugin: [{
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 30000,          // 超过30秒后停止定位，默认：无穷大
          zoomToAccuracy: true,     // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          showButton: false, // 显示定位按钮，默认：true
          pName: 'Geolocation',
          events: {
            init: (o) => {
              self.GDinit(o, self); // 获取当前位置
            }
          }
        }],
        longitude: -1, // 经度
        latitude: -1, // 纬度
        storeInfoList: [], // 店铺列表
        formatPrice: formatPrice, // 格式化金额
        getBatchSkuPrice: getBatchSkuPrice, // 获取单品价格
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      // 跳转商品详情
      toSpuDetail(id) {
        this.$router.push({path: '/spudetail', query: {id: id}})
      },
      /* 初始化定位当前位置 */
      GDinit(o, self) {
        let that = this;
        o.getCurrentPosition((status, result) => {
          if (status === 'complete' && result.info === 'SUCCESS') {
            that.longitude = result.position.getLng();
            that.latitude = result.position.getLat();
            that.queryNearShopList();
          } else {
            that.$vux.toast.text('定位失败,请刷新后重试', 'middle');
          }
        });
      },
      // 根据定位查询附近店铺列表
      queryNearShopList() {
        let that = this;
        queryNearShopList(that.longitude, that.latitude).then(res => {
          if (res && res.length > 0) {
            that.storeInfoList = res;
          } else {
            that.storeInfoList = [];
          }
        })
      },
      // 跳转到店铺首页
      toStoreIndex(storeId) {
        this.$router.push({path: '/storeindex', query: {storeId: storeId}})
      },
    }
  }
</script>
