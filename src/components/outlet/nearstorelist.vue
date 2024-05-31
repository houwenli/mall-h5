<template>
  <div style="height:100%;">

    <el-amap :plugin="plugin">
    </el-amap>

    <!-- <x-header :left-options="{backText: ''}">附近门店</x-header> -->

    <group v-for="(outStore,i) in outStoreList" :key="i" class="noTopBoderCells" style="margin-top: 10px">
      <cell is-link :link="{path:'/storedetail',query:{storeId:outStore.id}}">
        <div slot="icon" class="shop-logo"><img :src="outStore.avatarPicture"></div>
        <div slot="title" class="text-clamp1">{{ outStore.storeName }}</div>
        <div slot="inline-desc">{{ outStore.companyAddress }}</div>
      </cell>
    </group>

    <divider v-if="outStoreList.length === 0" class="dividerCenter">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, Divider, Group, Cell, PopupPicker} from 'vux'

  import {formatPrice} from '@/utils/utils';

  import {queryNearStoreList} from '@/api/nearstorelist';

  export default {
    components: {
      XHeader, Divider, Group, Cell, PopupPicker
    },
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
        outStoreList: [], // 门店列表
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
    },
    methods: {
      /* 初始化定位当前位置 */
      GDinit(o, self) {
        let that = this;
        o.getCurrentPosition((status, result) => {
          if (status === 'complete' && result.info === 'SUCCESS') {
            that.longitude = result.position.getLng();
            that.latitude = result.position.getLat();
            that.queryNearStoreList();
          } else {
            that.$vux.toast.text('定位失败,请刷新后重试', 'middle');
          }
        });
      },
      // 根据定位查询附近门店列表
      queryNearStoreList() {
        let that = this;
        queryNearStoreList(that.longitude, that.latitude).then(res => {
          if (res && res.length > 0) {
            that.outStoreList = res;
          } else {
            that.outStoreList = [];
          }
        })
      }
    }
  }
</script>
