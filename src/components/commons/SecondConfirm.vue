<template>
  <!-- <div class="boxwrapper" v-if="dialogshow ? true : false" @touchmove.prevent> -->
  <div class="boxwrapper" v-if="dialogshow ? true : false" @click="touchClose()">
    <div class="dialogbox">
      <div class="dialog" :class="{ dialogText: textshow }" @click.stop="stopClick()">
        <img v-if="showCloseDialogBtn" class="close-icon" src="@/assets/img/close@2x.png" alt="" @click="touchClose()" />
        <p v-if="title" class="dialog-title">{{ title }}</p>
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
      showCancle:{
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {
        backUrl: this.$route.query.url,
      }
    },
    watch: {
      dialogshow: {
        handler(val) {
          if(val) {
            document.body.classList.add('van-overflow-hidden');
          } else {
            document.body.classList.remove('van-overflow-hidden');
          }
        }
      },
    },
    methods: {
      // 右边按钮
      sure() {
        this.$emit('rightEvent')
      },
      // 左边按钮
      closedialog() {
        this.$emit('closeBack', false)
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
    background-color: rgba(0, 13, 29, 0.5) !important;
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
      max-width: 80%;
      min-width: 236px;
      background: #ffffff;
      border-radius: 12px;
      // margin-top: -5rem;
      padding: 32px 16px 20px 16px;
      position: relative;
      .close-icon {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 12px;
        top: 12px;
      }
      p {
        font-size: 15px;
        color: #191919;
        text-align: center;
        width: 100%;
        font-family: PingFangSC-Medium, PingFang SC;
      }
      .textp {
        margin-bottom: 22px;
        color: #191919;
        font-size: 15px;
        line-height: 19px;
        display: block;
        width: 100%;
        text-align: center;
      }
      .buttonbox {
        display: flex;
        justify-content: space-evenly;
        .cancle {
          background-color: #fff;
          color: #000;
        }
        .sure {
          background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
          color: #fff;
          &::before {
            display: none;
          }
          &::after {
            display: none;
          }
        }
        /deep/ .van-button--small {
          min-width: 80px;
          font-size: 15px;
          line-height: normal;
          border: unset;
          position: relative;
        }
        /deep/ .van-button:after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 999px;
          width: 200%;
          height: 200%;
          transform: scale(0.5, 0.5);
          box-sizing: border-box;
        }
      }
    }
    .dialog-title {
      margin-bottom: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #191919;
      line-height: 22px;
    }
  }
</style>
