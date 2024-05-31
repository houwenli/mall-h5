<template>
  <div style="height: 100%">
    <keep-alive :include="['chooseMap', 'selectCity']">
      <router-view :cityName.sync="cityName" :positionCity.sync="positionCity" />
    </keep-alive>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cityName: '武汉',
        positionCity: '',
      }
    },
  }
</script>
<style lang="less" scoped>
  /deep/ .now-city {
    display: flex;
    align-items: center;
    height: 100%;
    .now-city-icon {
      position: relative;
      top: 2px;
      margin-left: 7px;
      display: inline-block;
      overflow: hidden;
      width: 6px;
      height: 4px;
      &::after {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        display: inline-block;
        width: 6px;
        height: 4px;
        background-color: #333333;
        transform: rotate(-45deg);
        transform-origin: top left;
      }
    }
  }
</style>
