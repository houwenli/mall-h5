<template>
  <div class="navbarbox">
    <div class="positionBar">
      <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickBack"
      @click-right="onClickRight"
      class="topbox"
      :class="{ radiusActive: isradius }"
      :right-text="isRight ? rightText : ''"
    />
    </div>

  </div>
</template>

<script>
import { NavBar } from 'vant'
export default {
  components: {
    [NavBar.name]: NavBar
  },
  props: {
    // 标题
    title: {
      type: String,
      default: '标题',
    },
    // 是否需要二次确认
    isConfirm: {
      type: Boolean,
      default: false,
    },
    // 是否需要border-radius
    isradius: {
      type: Boolean,
      default: false,
    },
    isRight: {
      type: Boolean,
      default: false,
    },
    rightText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  mounted() {
    // this.$refs.positionBar.style.top = JSON.parse(localStorage.getItem('appData')).statusHeight + 'px'
  },
  methods: {
    // 返回
    onClickBack() {
      // console.log('返回', this.isConfirm)
      this.$emit('clickBack', this.isConfirm)
    },
    onClickRight() {
      this.$emit('clickRight')
    },
  },
}
</script>

<style lang="less" scoped>
.positionTop {
    position: fixed;
    top: 0;
    width: 100%;
    z-index:10
}
.positionBar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index:10
}
.navbarbox {
  height: 44px;
  /deep/ .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  /deep/ .van-nav-bar {
    height: 1.76rem;

    /deep/ .van-nav-bar__right {
      .van-nav-bar__text {
        color: #000;
        font-size: 0.48rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
  }
  .topbox {
    // position: fixed;
    // top: 0;
    // width: 100%;
    /deep/ .van-icon {
      color: #464646;
      font-size: 0.92rem;
    }
    /deep/ .van-nav-bar__title {
      color: #000;
      font-size: 0.68rem;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    /deep/ .van-nav-bar__text {
      color: #000000;
    }
  }
  .radiusActive {
    border-radius: 0 0 0.4rem 0.4rem;
  }
}
</style>
