<template>
  <div class="boxwrapper" v-if="dialogshow ? true : false" @click="touchClose()">
    <div class="dialogbox">
      <div class="dialog" :class="{ dialogText: textshow }" @click.stop="stopClick()">
        <img v-if="showCloseDialogBtn" class="close-icon" src="@/assets/img/close@2x.png" alt="" @click="touchClose()" />
        <p>{{ title }}</p>
        <div>
          <template v-if="$slots.textp">
            <slot name="textp"></slot>
          </template>
          <template v-else>
            <label v-if="textshow" class="textp">{{ textp }}</label>
          </template>
        </div>
        <div v-if="$slots.buttom">
          <slot name="buttom"></slot>
        </div>
        <template v-else>
          <div class="buttonbox" v-if="columnButton">
            <van-button style="width: 100%; height: 38px" block round type="info" size="small" class="sure" @click="sure">{{ sureText }}</van-button>
          </div>
          <div class="buttonbox" v-else>
            <van-button round type="info" size="small" class="cancle" @click="closedialog">{{ cancleText }}</van-button>
            <van-button v-if="!hideConfirmBtn" round type="info" size="small" class="sure" @click="sure">{{ sureText }}</van-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { Button, Overlay } from 'vant'
  export default {
    name: 'SecondConfirm',
    inject: ['reload'],
    components: {
      [Button.name]: Button,
      [Overlay.name]: Overlay,
    },
    props: {
      // 标题
      title: {
        type: String,
        default: '是否保存本次操作',
      },
      // 取消文案
      cancleText: {
        type: String,
        default: '取消',
      },
      // 确认文案
      sureText: {
        type: String,
        default: '确认',
      },
      // 弹窗显示隐藏
      dialogshow: {
        type: Boolean,
        default: false,
      },
      // 是否有其他文字提示
      textshow: {
        type: Boolean,
        default: false,
      },
      textp: {
        type: String,
      },
      hideConfirmBtn: {
        type: Boolean,
        default: false,
      },
      isNeedTouchClose: {
        type: Boolean,
        default: false,
      },
      columnButton: {
        type: Boolean,
        default: false,
      },
      showCloseDialogBtn: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        backUrl: this.$route.query.url,
      }
    },
    methods: {
      // 确定按钮
      sure() {
        this.$emit('confirm')
      },
      // 取消按钮
      closedialog() {
        this.$emit('cancel', false)
      },
      //关闭弹窗
      touchClose() {
        if (this.isNeedTouchClose) {
          this.$emit('handleCloseDialog', false)
        } else {
          return
        }
      },
      stopClick() {
        return
      },
    },
  }
</script>

<style lang="less" scoped>
  .boxwrapper {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6) !important;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // position: absolute;
    // top: 0;
    // left: 0;
    z-index: 9999;
  }
  .dialogbox {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .dialog {
      width: 12.64rem;
      background: #ffffff;
      border-radius: 0.4rem;
      // margin-top: -5rem;
      padding: 0.9rem 1.12rem 1.2rem;
      position: relative;
      .close-icon {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 12px;
        top: 12px;
      }
      p {
        font-size: 0.64rem;
        font-weight: bold;
        color: #000;
        text-align: center;
        width: 100%;
        font-family: PingFangSC-Medium, PingFang SC;
      }
      .textp {
        color: #666;
        font-size: 0.54rem;
        display: block;
        margin-top: 0.64rem;
        width: 100%;
        text-align: center;
      }
      .buttonbox {
        margin-top: 1.04rem;
        display: flex;
        justify-content: space-around;
        .cancle {
          background-color: #fff;
          color: #e60113;
        }
        .sure {
          background-color: #e60113;
          color: #fff;
        }
        /deep/ .van-button--small {
          width: 4.16rem;
          height: 1.2rem;
          line-height: 1.2rem;
          border: unset;
          font-weight: bold;
          position: relative;
        }
        /deep/ .van-button:after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          border: 1px solid #e60113;
          border-radius: 999px;
          width: 200%;
          height: 200%;
          transform: scale(0.5, 0.5);
          box-sizing: border-box;
        }
      }
    }
    .dialogText {
      padding: 1.12rem 1.12rem 0.88rem;
    }
  }
</style>
