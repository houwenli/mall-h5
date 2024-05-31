<template>
  <div class="content">
    <navbartop :title="'定位地址'" @clickBack="$router.go(-1)" :isConfirm="true" class="navtop"></navbartop>
    <van-search v-model="value" class="search-box" @focus="$router.push({ name: 'mapSearch' })" placeholder="小区/写字楼/学校等">
      <template #label>
        <div class="now-city" @click="$router.push({name: 'selectCity'})">
          {{ cityName }}
          <div class="now-city-icon"></div>
        </div>
      </template>
      <template #left-icon>
        <img class="icon-search" src="@/assets/img/search_grey@2x.png" alt="" />
      </template>
    </van-search>
    <el-amap ref="amap" vid="amapDemo" :center="mapCenter" :zoom="zoom" class="amap-demo" :plugin="plugin" :events="events">
      <el-amap-marker :position="marker" zIndex="110">
        <template>
          <img class="position-icon" src="@/assets/img/food_icon_position.png" alt="" />
        </template>
      </el-amap-marker>
      <el-amap-circle
        :center="marker"
        :radius="20"
        fillColor="#FF6951"
        :fillOpacity="0.18"
        strokeColor="#FF6951"
        :strokeOpacity="0.18"
        :strokeWeight="0"
      ></el-amap-circle>
    </el-amap>
    <div class="address-list-box" :class="{ 'is-expand': isExpand }">
      <div class="expand" @click.stop="expand">
        <img src="@/assets/img/map_icon_down.png" alt="" />
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :error="error"
        error-text="获取位置信息失败"
        finished-text="没有更多了"
        class="address-list"
        @load="getAddress"
      >
        <van-cell v-for="(item, index) in addressList" :key="index" class="address-item" @click="toDetail(item)">
          <div class="flex-left">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-bottom">{{ `${item.pname}${item.cityname}${item.adname}${item.address}` }}</div>
          </div>
          <img v-if="index == 0" class="flex-right" src="@/assets/img/cat_Selected@2x.png" alt="" />
        </van-cell>
      </van-list>
    </div>
    <div id="panel" style="display: none"></div>
    <!-- <ul class="address-list">
      <li v-for="(item, index) in addressList" :key="index" class="address-item">
        <div class="item-top">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-distance">{{ item.distance }}米</div>
        </div>
        <div class="item-bottom">
          <div class="itme-address">{{ item.address }}</div>
        </div>
      </li>
    </ul> -->
  </div>
</template>
<script>
  import { debounce } from '@/utils/utils'
  import { Search } from 'vant'
  import navbartop from '@/components/commons/navBartop'
  export default {
    name: 'chooseMap',
    props: {
      cityName: {
        type: String,
        default: '',
      },
    },
    components: {
      [Search.name]: Search,
      navbartop
    },
    data() {
      return {
        value: '',
        marker: [121.59996, 31.197646],
        mapCenter: [121.59996, 31.197646],
        zoom: 12,
        addressList: [],
        cityCode: '',
        pageIndex: 1,
        pageSize: 10,
        loading: true,
        finished: false,
        error: false,
        isExpand: false,
        positionIcon: require('@/assets/img/food_icon_position.png'),
        plugin: [
          {
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 30000, // 超过30秒后停止定位，默认：无穷大
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: 'RB',
            pName: 'Geolocation',
            showCircle: false,
            // markerOptions: {
            //     bubble: true
            // },
            bubble: true,
            events: {
              //   init: (o) => {
              //     self.GDinit(o, self) // 获取当前位置
              //   },
              init: this.GDinit,
            },
          },
        ],
        events: {
          mapmove: this.draggingMap,
          moveend: this.getAddress,
        },
      }
    },
    methods: {
      draggingMap: function() {
        let { R, Q } = this.Map.getCenter()
        this.marker = [R, Q]
        this.pageIndex = 1
      },
      getAddress: debounce(function() {
        if (this.pageIndex === 1) {
          this.loading = true
          this.addressList = []
          this.finished = false
          this.error = false
        }
        let geocoder = new AMap.PlaceSearch({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: this.cityName,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          type: '公司企业|商务住宅|政府机构及社会团体|科教文化服务|银行|保险公司|金融保险服务机构|住宿服务|医疗保健服务|体育休闲服务|公司企业',
          // map: map, // 展现结果的地图实例
          panel: 'panel', // 结果列表将在此容器中进行展示。
          // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都
        })
        geocoder.searchNearBy(
          '',
          this.marker,
          500,
          (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              let data = result.poiList.pois
              if (data.length < this.pageSize) {
                this.finished = true
              }
              this.pageIndex++
              this.addressList = this.addressList.concat(data)
            } else {
              this.error = true
            }
            this.$nextTick(() => {
              this.loading = false
            })
          },
          400,
          false
        )
      }),
      // 查询当前经纬度
      GDinit(o) {
        // 地图实例
        this.Map = this.$refs.amap.$$getInstance()
        o.getCurrentPosition((status, result) => {
          if (status === 'complete' && result.info === 'SUCCESS') {
            this.cityCode = result.addressComponent.citycode
            this.$emit('update:cityName', result.addressComponent.city)
            this.$emit('update:positionCity', result.addressComponent.city)
            this.mapCenter = [result.position.lng, result.position.lat]
            this.marker = [result.position.lng, result.position.lat]
            this.zoom = 18
            //获取定位地址填入默认送货地址
            // this.setLocationAdress(result.addressComponent)
          } else {
            // Toast('定位失败,请刷新后重试')
          }
        })
      },
      onSearchResult(pois) {
        this.marker = [pois[0].lng, pois[0].lat]
        this.mapCenter = [pois[0].lng, pois[0].lat]
      },
      toDetail(item) {
        console.log(item, '---------');
        let { address, pname, adname, cityname, name, adcode, location } = item
        let positionName = {
          positionName: name,
          positionStreet: `${pname}${cityname}${adname}${address}`,
          cityname: adcode.slice(0, 4) + '00',
        }
        sessionStorage.setItem('positionAddress', JSON.stringify(positionName))
        let posiotionLonAndLat = {
          lat: location.lat,
          lng: location.lng,
          areaCode: adcode
        }
        localStorage.setItem('posiotionLonAndLat', JSON.stringify(posiotionLonAndLat))
        this.$router.back({
          name: 'SpuDetail'
        })
      },
      expand() {
        this.isExpand = !this.isExpand
        console.log(this.isExpand)
      },
    },
  }
</script>
<style lang="less" scoped>
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    /deep/ .amap-logo {
      display: none !important;
    }
    /deep/ .amap-copyright {
      display: none !important;
    }
    /deep/ .amap-controls {
      .amap-geo {
        background-image: url(~@/assets/img/map_icon_gps.png);
        width: 50px;
        height: 50px;
        background-size: 50px;
        border: 0;
        background-color: transparent;
      }
    }
  }

  .amap-demo {
    flex: 1;
  }
  .address-list-box {
    position: relative;
    top: -5px;
    background-color: #fff;
    overflow: hidden;
    height: 60vh;
    display: flex;
    flex-direction: column;
    border-radius: 10px 10px 0 0;
    transition: all 0.5s;
    .expand {
      transition: all 0.5s;
      height: 30px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 28px;
        height: 12px;
      }
    }

    .address-list {
      transition: all 0.5s;
      flex: 1;
      overflow-y: scroll;
      .address-item {
        padding: 10px 16px;
        &:first-of-type {
          padding-top: 0;
        }
        /deep/ .van-cell__value {
          display: flex;
          align-items: center;
        }
        .flex-left {
          width: 311px;
        }
        .item-name,
        .item-bottom {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .item-name {
          font-size: 16px;
          line-height: 24px;
          color: #333;
        }
        .item-bottom {
          color: #666;
          font-size: 14px;
          line-height: 20px;
        }
        .flex-right {
          margin-left: 12px;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
      }
    }
  }
  .is-expand {
    height: 30vh;
    .expand {
      transform: rotateX(180deg);
    }
  }
  .position-icon {
    width: 22px;
    height: 38px;
  }
  .search-box {
    padding: 6px 10px;
    .icon-search {
      width: 24px;
      height: 24px;
    }
    /deep/ .van-field__control {
      color: #999;
    }
    /deep/.van-search__label {
      padding: 0 10px 0 0;
    }
    /deep/ .van-cell {
      line-height: 24px;
    }
    /deep/ .van-field__left-icon {
      width: 24px;
      height: 24px;
    }
    /deep/ .van-cell--borderless {
      padding: 0;
      align-items: center;
      height: 32px;
    }
    /deep/ .van-field__control {
      color: #999;
    }
    /deep/ .van-search__content {
      height: 32px;
      border-radius: 16px;
      background-color: #ededed;
    }
  }
</style>
