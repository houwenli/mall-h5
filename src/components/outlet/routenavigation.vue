<template>
  <div class="amap-page-container">

    <!-- <x-header :left-options="{backText: ''}">地图</x-header> -->

    <el-amap vid="amap" ref="amap" :plugin="plugin" class="amap" :center="startCenter">
    </el-amap>

  </div>
</template>

<script>
  import {XHeader} from 'vux'

  export default {
    components: {
      XHeader
    },
    data() {
      const self = this;
      return {
        startCenter: [-1,-1], // 起点
        endCenter: [self.$route.query.longitude, self.$route.query.latitude], // 终点
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
            that.startCenter = [result.position.getLng(), result.position.getLat()];
            that.DriveTO();
          } else {
            that.$vux.toast.text('定位失败,请刷新后重试', 'middle');
          }
        });
      },
      // 驾车路线
      DriveTO() {
        let map = new AMap.Map('amap', {
          center: this.startCenter,
        });
        let driveOption = {
          map: map,
          panel: this.$refs.panel,
          hideMarkers: false,
          isOutline: true,
          outlineColor: '#ffeeee',
          autoFitView: true
        };
        let driving = new AMap.Driving(driveOption);

        driving.search(this.startCenter, this.endCenter, function (status, result) {
          // console.log('result', result)
          // result即是对应的驾车路线数据信息
        })
      }
    }
  }
</script>
<style>
  .amap {
    position: absolute;
    top: 47px;
    bottom: 0;
    width: 100%;
  }
  .amap-page-container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
