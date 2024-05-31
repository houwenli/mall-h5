<template>
  <div class="loadding-page">
    <div class="loadding-icon"></div>
    <p class="loadding-text">加载中…</p>
  </div>
</template>
<style lang="less" scoped>
  .loadding-page {
    padding-top: 170px;
    text-align: center;
  }
  .loadding-icon {
    background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/loading-160-80-%202.gif');
    background-size: 100% 100%;
    display: inline-block;
    position: relative;
    width: 80px;
    height: 40px;
  }
  .loadding-text {
    font-size: 10px;
    color: #90969e;
    line-height: 14px;
  }
</style>
