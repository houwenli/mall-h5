<template>
  <div :class="showTotal ? 'total-introduce' : 'detailed-introduce'">
    <div class="intro-content" :title="introduce" ref="desc">
      <span class="merchant-desc" v-if="introduce">{{introduce}}</span>
      <div class="unfold" @click="showTotalIntro" v-if="showExchangeButton">
        <img
          v-if="exchangeButton"
          src="../../assets/img/Unfold@2x.png"
          alt
          style="width: 10px;height: 5px;"
        />
        <img v-else src="../../assets/img/stop@2x.png" alt style="width: 10px;height: 5px;" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'comments',
  props: {
    introduce: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // 是否展示所有文本内容
      showTotal: true,
      // 显示展开还是收起
      exchangeButton: true,
      // 是否显示展开收起按钮
      showExchangeButton: false,
      rem: '',
    }
  },
  watch: {
    introduce: {
      immediate: true,
      handler() {
        this.$nextTick(
          function () {
            // 判断介绍是否超过四行
            let rem = parseFloat(this.getRem())
            if (!this.$refs.desc) {
              return
            }
            let descHeight = window.getComputedStyle(this.$refs.desc).height.replace('px', '')
            // console.log('descHeight:' + descHeight)
            // console.log('如果 descHeight 超过' + 3.52 * rem + '就要显示展开按钮')
            if (descHeight > 3.52 * rem) {
              // console.log('超过了四行')
              // 显示展开收起按钮
              this.showExchangeButton = true
              this.exchangeButton = true
              // 不是显示所有
              this.showTotal = false
            } else {
              // 不显示展开收起按钮
              this.showExchangeButton = false
              // 没有超过四行就显示所有
              this.showTotal = true
              // console.log('showExchangeButton', this.showExchangeButton)
              // console.log('showTotal', this.showTotal)
            }
          }.bind(this)
        )
      },
    },
  },
  methods: {
    showTotalIntro() {
      // console.log(this.showTotal)
      this.showTotal = !this.showTotal
      this.exchangeButton = !this.exchangeButton
    },
    getRem() {
      const defaultRem = 25
      let winWidth = window.innerWidth
      // console.log('winWidth:' + winWidth)
      let rem = (winWidth / 375) * defaultRem
      return rem
    },
  },
}
</script>
<style lang="less">
.content {
  width: 100%;
}
.OverContent {
  height: 88px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.top-prove {
    height: 100px;
    width: 100%;
    background: #dddddd;
    text-align: center;
    line-height: 100px;
  }
  .total-introduce {
    height: auto;
    overflow: hidden;
    font-size: 14px;
    color: #434343;
    .intro-content {
      .merchant-desc {
        width: 100%;
        line-height: 21px;
      }
    }
    .unfold {
      display: block;
      z-index: 11;
      float: right;
      width: 20px;
      height: 21px;
      text-align: center;
      p {
        margin: 0;
        line-height: 21px;
        color: #7fbe87;
      }
    }
  }
  .detailed-introduce {
    font-size: 14px;
    color: #434343;
    position: relative;
    overflow: hidden;
    .intro-content {
      // 最大高度设为4倍的行间距
      max-height: 84px;
      line-height: 21px;
      word-wrap: break-word;
      /*强制打散字符*/
      word-break: break-all;
      background: #ffffff;
      /*同背景色*/
      color: #ffffff;
      overflow: hidden;
      .merchant-desc {
        width: 100%;
        line-height: 21px;
      }
      &:after,
      // 这是展开前实际显示的内容
      &:before {
        content: attr(title);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        color: #434343
        // overflow: hidden;
      }
      // 把最后最后一行自身的上面三行遮住
      &:before {
        display: block;
        overflow: hidden;
        z-index: 1;
        max-height: 66px;
        background: #ffffff;
      }
      &:after {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 88px;
        /*截取行数*/
        -webkit-line-clamp: 4;
        text-overflow: ellipsis;
        box-sizing: border-box;
        /*行首缩进字符数，值为[(截取行数-1)*尾部留空字符数]*/
        text-indent: -6em;
        /*尾部留空字符数*/
        padding-right: 2em;
      }
      .unfold {
        z-index: 11;
        width: 20px;
        height: 21px;
        outline: 0;
        position: absolute;
        right: 0;
        bottom: 0;
        text-align: center;
        p {
          margin: 0;
          line-height: 21px;
          color: #7fbe87;
        }
        img{
          width: 10px;
          height: 5px;
        }
      }
    }
  }
  .bottom-prove {
    height: 100px;
    width: 100%;
    background: #dddddd;
    text-align: center;
    line-height: 100px;
  }
  .change-buttom {
    font-size: 14px;
    color: #2371be;
    .long {
      text-align: 21px;
      text-align: center;
      height: 21px;
    }
    .short {
      text-align: 21px;
      text-align: center;
      height: 20px;
    }
  }
</style>