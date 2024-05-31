<template>
  <div class="transition-flex transition" :class="[typeName == 'loading' ? 'ws-loading' : 'ws-default', isPhoneBto ? 'phone-bto' : '']" :style="customStyle">
    <div class="transition-content transition-flex">
      <!-- 展示图片 -->
      <img :src="imgList[typeName]" />
      <!-- 提示文字 -->
      <span>{{ text }}</span>
      <!-- 按钮插槽 -->
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      //居中是否减去IOS底部安全距离
      isPhoneBto: {
        type: [Boolean],
        default: true,
      },
      //自定义样式
      customStyle: {
        type: [Object, String],
        default: '',
      },
      //默认loading文案
      text: {
        type: String,
        default: '加载中...',
      },
      //缺省图类型
      typeName: {
        type: String,
        default: 'loading',
      },
    },
    data() {
      return {
        imgList: {
          loading: `${this.$smartImg}/comm/loading.gif`, //加载中
          noNetwork: `${this.$smartImg}/comm/blank_network.png`, //暂无网络
          noPreferential: `${this.$oss}/coupon/empty.png`, //暂无优惠
        },
      }
    },
    methods: {},
  }
</script>

<style scoped lang="less">
  .transition-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .transition {
    justify-content: center;
    height: 100%;
    width: 100%;
    z-index: 998;
    &-content {
      justify-content: center;
    }
  }
  .phone-bto {
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
  }
  .ws-default {
    .transition-content {
      img {
        width: 160px;
        height: 160px;
      }
      text {
        margin-top: 12px;
        font-size: 13px;
        color: #999999;
        line-height: 17px;
      }
    }
  }
  .ws-loading {
    .transition-content {
      width: 136px;
      height: 136px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 23px;
      img {
        width: 80px;
        height: 40px;
      }
      text {
        margin-top: 2px;
        font-size: 10px;
        font-weight: 400;
        color: #90969e;
        line-height: 14px;
      }
    }
  }
</style>
