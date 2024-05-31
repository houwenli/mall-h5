<template>
  <!-- 回到顶部  -->
  <div class="returntopBox">
    <img :src="$oss + imgName" alt />
    <span>{{ text }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      //文字描述
      text: {
        type: String,
        default: '顶部',
      },
      //图片路径
      imgName: {
        type: String,
        default: '/commons/returnTop.png',
      },
    }
  }
</script>

<style lang="less" scoped>
  .returntopBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    bottom: 88px;
    right: 12px;
    width: 40px;
    height: 40px;
    z-index: 99;
    opacity: 0.8;
    background: #191919;
    border-radius: 20px;
    > img {
      margin-top: 4px;
      width: 14px;
      height: 18px;
    }
    span {
      font-size: 11px;
      font-weight: 400;
      color: #ffffff;
      line-height: 13px;
    }
  }
</style>
