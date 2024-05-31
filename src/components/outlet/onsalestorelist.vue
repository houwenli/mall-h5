<template>
  <div style="height:100%;">

    <el-amap :plugin="plugin">
    </el-amap>

    <!-- <x-header :left-options="{backText: ''}">门店列表</x-header> -->

    <group class="noTopBoderCells">
      <popup-picker :data="addressListData" :columns="3" v-model="addressValue" show-name
                    @on-change="queryOnSaleStoreList">
        <div slot="title">
          <div class="address-icon-wrap">当前地区</div>
        </div>
      </popup-picker>
    </group>

    <group v-for="(outStore,index) in outStoreList" :key="index" class="noTopBoderCells" style="margin-top: 10px">
      <cell is-link @click.native="toStoreSpuDetail(outStore.id)">
        <div slot="icon" class="shop-logo"><img :src="outStore.avatarPicture"></div>
        <div slot="title" class="text-clamp1">{{ outStore.storeName }}</div>
        <div slot="inline-desc">{{ outStore.companyAddress }}</div>
      </cell>
      <cell>
        <span slot="title">到店价：<span style="color: #d00">¥{{ formatPrice(outStore.reachPrice) }}</span></span>
      </cell>
    </group>

    <divider v-if="outStoreList.length === 0" class="dividerCenter">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, Divider, Group, Cell, PopupPicker} from 'vux'

  import {formatPrice} from '@/utils/utils';

  import {queryCityById, queryAllAreas, queryOnSaleStoreList} from '@/api/onsalestorelist';

  export default {
    components: {
      XHeader, Divider, Group, Cell, PopupPicker
    },
    data() {
      const self = this;
      return {
        addressListData: [], //地区数组
        addressValue: [],//已选地区信息
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
        outStoreList: [], // 门店列表
        formatPrice: formatPrice, // 格式化金额
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.initAddress()
    },
    methods: {
      // 初始化地址信息
      initAddress() {
        let that = this;
        queryCityById(that.$route.query.cityId).then(res => {
          if (res.flag) {
            that.queryAllAreas(res.data.provinceId, that.$route.query.cityId, that.$route.query.districtId);
          }
        })
      },
      // 查询所有地区信息
      queryAllAreas(provinceId, cityId, districtId) {
        let that = this;
        queryAllAreas().then(res => {
          that.addressListData = res;
          that.addressValue = ['P-' + provinceId, 'C-' + cityId, 'D-' + districtId];
        })
      },
      /* 初始化定位当前位置 */
      GDinit(o, self) {
        let that = this;
        o.getCurrentPosition((status, result) => {
          if (status === 'complete' && result.info === 'SUCCESS') {
            that.longitude = result.position.getLng();
            that.latitude = result.position.getLat();
          } else {
            that.$vux.toast.text('定位失败,请刷新后重试', 'middle');
          }
          that.queryOnSaleStoreList();
        });
      },
      // 根据单品id和市id和定位查询在售门店列表
      queryOnSaleStoreList() {
        let that = this;
        let query = {
          skuId: that.$route.query.skuId,
          cityId: that.addressValue[1].split('-')[1],
          longitude: that.longitude,
          latitude: that.latitude
        };
        queryOnSaleStoreList(query).then(res => {
          if (res && res.length > 0) {
            that.outStoreList = res;
          } else {
            that.outStoreList = [];
          }
        })
      },
      // 门店商品详情
      toStoreSpuDetail(storeId) {
        this.$router.push({
          path: '/storespudetail',
          query: {skuId: this.$route.query.skuId, storeId: storeId, spuId: this.$route.query.spuId}
        })
      },
    }
  }
</script>
