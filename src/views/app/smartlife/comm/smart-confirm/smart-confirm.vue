<template>
  <div class="smartconfirm">
    <van-popup v-model="show" :closeable="false">
      <div class="smartconfirm--title flex" v-if="title != ''">
        {{ title }}
      </div>
      <!-- 插槽 -->
      <slot />
      <div class="smartconfirm__content flex" v-if="contentText != ''">
        {{ contentText }}
      </div>
      <div class="smartconfirm__btn flex" :class="{ 'smartconfirm__btn--dir': isDirection }">
        <!-- 第一个按钮插槽 -->
        <slot name="firstBtn" />
        <span class="smartconfirm__btn--cancel" v-if="cancelText != ''" @click="cancel">
          {{ cancelText }}
        </span>
        <span class="smartconfirm__btn--confirm" v-if="confirmText != ''" @click="confirm">
          {{ confirmText }}
        </span>
        <!-- 最后一个按钮插槽 -->
        <slot name="lastBtn" />
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    props: {
      //是否显示
      show: {
        type: Boolean,
        default: false,
      },
      // 标题
      title: {
        type: String,
        default: '',
      },
      //内容文本
      contentText: {
        type: String,
        default: '',
      },
      //取消文本
      confirmText: {
        type: String,
        default: '',
      },
      //确认文本
      cancelText: {
        type: String,
        default: '',
      },
      //按钮是否纵向排列
      isDirection: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    methods: {
      cancel() {
        this.$emit('cancel')
      },
      confirm() {
        this.$emit('confirm')
      },
    },
  }
</script>

<style lang="less" scoped>
  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .van-drawer__scroll-div {
    padding: 32px 24px 0;
  }
  .van-popup {
    width: 320px;
    background: #ffffff;
    border-radius: 16px;
  }
  .smartconfirm {
    font-family: PingFangSC-Regular, PingFang SC;
    &--title {
      padding: 32px 24px 0;
      font-size: 18px;
      font-weight: 600;
      color: #191919;
      line-height: 22px;
    }
    &__content {
      margin-top: 18px;
      padding: 0 24px;
      font-size: 15px;
      font-weight: 400;
      color: #999999;
      line-height: 19px;
    }
    &__btn {
      margin-top: 32px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      &--cancel,
      &--confirm {
        text-align: center;
        height: 55px;
        font-size: 17px;
        font-weight: 600;
        line-height: 55px;
        color: #191919;
      }
      &--confirm {
        color: #0a75d9;
      }
      span {
        flex: 1;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
      }
      span:last-child {
        border-right: none;
      }
    }
    &__btn--dir {
      flex-direction: column;
      span {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      span:last-child {
        border-bottom: none;
      }
    }
  }
</style>
