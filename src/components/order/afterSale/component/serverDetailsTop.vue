<template>
  <div>
    <div class="details-top">
      <navBartop :title="serverLog.content" :isConfirm="false" @clickBack="back" class="navtop" :outStyle="outStyle"></navBartop>
      <div class="titleboxWrapper">
        <p class="titlebox">
          本次售后服务将由
          <span>{{ serverDetail.storeName }}</span>
          为你提供
        </p>
      </div>
      <!-- 申请售后流程 -->
      <div class="applyAfterBox">
        <!-- <h3 :class="{ serverFinish: serverLog.finished }">{{ serverLog.content }}</h3> -->
        <div>
          <div class="stepsBoxWrapper" v-if="showSteps">
            <div class="stepsBox">
              <div
                v-for="(item, index) in statusSteps"
                :key="index"
                class="stepsSpan"
                :class="{ 'step--finish': status >= item.status || item.otherStatus === status || setNow(item, index) }"
              >
                <!-- <van-icon name="checked" class="" /> -->
                <div class="step__line"></div>

                <span
                  class="circle"
                  :class="{
                    'finish-circle': status >= item.status || item.otherStatus === status,
                    'now-circle': setNow(item, index),
                  }"
                  :style="{ 'background-image': item.icon ? `url('${$oss + '/order/' + item.icon}')` : null }"
                >
                  <label class="stepsLabel">
                    {{ item.label }}
                  </label>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 售后详情步骤 -->
    <div class="applyAfterDetailBox bgcolor" @click="toRefundDetail">
      <div class="applyAfterDetail_info">
        <div v-if="serverStatusTipsMap[+serverDetail.status]" class="applyAfterDetail-tips">
          <span>{{ serverStatusTipsMap[status].start }}</span>
          <span v-if="serverStatusTipsMap[status].showTime && !showDayTime.includes(status)">
            <van-count-down :time="countDown" @finish="finishTime">
              <template #default="timeData">
                <span>{{ timeData.days }}天{{ timeData.hours }}时{{ timeData.minutes }}分{{ timeData.seconds }}秒</span>
              </template>
            </van-count-down>
          </span>
          <span v-if="serverStatusTipsMap[status].showTime && showDayTime.includes(status)">{{ countDown }}</span>
          <span>{{ serverStatusTipsMap[status].end }}</span>
        </div>
        <p class="transformS problem" v-if="desc">{{ desc }}</p>
      </div>
      <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="" />
    </div>
  </div>
</template>
<script>
  import { CountDown, Step, Steps } from 'vant'
  import navBartop from '@/components/commons/navBartop'
  import { appBack } from '@/utils/utils'

  import { dealFillLogisticsOverDue } from '@/api/backorderlist'
  export default {
    props: {
      serverDetail: {
        type: Object,
        default: () => {
          return {}
        },
      },

      serverStatusTipsMap: {
        type: Object,
        default: () => {
          return {}
        },
      },

      statusSteps: {
        type: Array,
        default: () => {
          return []
        },
      },

      showSteps: {
        type: Boolean,
        default: false,
      },

      // 详情状态标题
      serverLog: {
        type: Object,
        default: () => {
          return {}
        },
      },

      showDayTime: {
        type: Array,
        default: () => {
          return []
        },
      },

      desc: {
        type: String,
        default: '',
      },
    },
    
    components: {
      navBartop,
      [CountDown.name]: CountDown,
      [Step.name]: Step,
      [Steps.name]: Steps,
    },
    
    data() {
      return {
        countDown: '0',
        outStyle:{
          background: 'linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%)'
        }
      }
    },

    watch: {
      serverDetail() {
        let endTime = this.serverDetail.endTime ? this.serverDetail.endTime.replace(/\-/g, '/') : ''
        endTime = new Date(endTime).getTime()
        let nowTime = this.serverDetail.nowTime ? this.serverDetail.nowTime.replace(/\-/g, '/') : ''
        nowTime = new Date(nowTime).getTime()
        if (endTime - nowTime > 0) {
          // 换货和退货都在一个判断里面，状态没有交集，可合并一个判断
          if (this.showDayTime.includes(+this.serverDetail.status)) {
            //向上取整转化成天
            let countDownTime = endTime - nowTime
            let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24))
            this.countDown = countDownDay
          } else {
            this.countDown = endTime - nowTime
          }
        }
      },
    },

    computed: {
      status() {
        return +this.serverDetail.status
      },
    },

    mounted() {
      // 顶部渐变监听
      this.$nextTick(() => {
        let dom = document.getElementsByClassName('scroll-content')[0]
        this.navTop = document.getElementsByClassName('topbox')[0]
        this.headDomHeight = document.getElementsByClassName('details-top')[0].scrollHeight
        dom.addEventListener('scroll', this.scrollFn)
        this.$once('hook:beforeDestroy', () => {
          dom.removeEventListener('scroll', this.scrollFn)
        })
      })
    },

    methods: {
      scrollFn(el) {
        console.log('-----');
        this.navTopStyle(el.target.scrollTop)
      },

      navTopStyle(scroll) {
        let opacity = (scroll / this.headDomHeight).toFixed(1)
        if (scroll > this.headDomHeight) {
          opacity = 1
        } else if (scroll < this.headDomHeight / 10) {
          opacity = 0
        }
        this.navTop.style.background = `linear-gradient(225deg, rgba(255,95,46, ${opacity}) 0%, rgba(255,10,53, ${opacity}) 100%)`
      },

      back() {
        appBack(this)
        // if (window.ws && window.ws.finishActivity) {
        //   // android环境
        //   window.ws.finishActivity();
        // } else if (window.webkit && window.webkit.messageHandlers.finishActivity) {
        //   // ios环境
        //   window.webkit.messageHandlers.finishActivity.postMessage('');
        // } else {          
        //   this.$router.back()
        // }
      },

      setNow(item, index) {
        // 如果有otherStatus字段直接返回false
        if (item.otherStatus) {
          return false
        }
        // 如果是最后一个并且状态大于最后一个直接返回true
        // if (this.statusSteps.at(-1).status <= this.status && index == this.statusSteps.length - 1) {
        //   return true
        // }
        // 如果等于当前状态直接返回true
        if (this.status === item.status) {
          return true
        }
        // 如果没有前一个元素代表第零个直接返回false
        if (!this.statusSteps[index - 1]) {
          return false
        }
        // 如果状态大于前一个小于当前就返回true
        return this.status > this.statusSteps[index - 1].status && this.status < item.status
      },

      // 退款详情进度
      toRefundDetail() {
        let data = {
          type: this.serverDetail.type,
          // expressCode: this.serverDetail.logisticsCode,
          logisticsCompany: this.serverDetail.logisCompanyName,
          orderCode: this.serverDetail.orderCode,
          logisticsCode: this.serverDetail.logisticsCode,
          waybillCode: this.serverDetail.waybillCode,
          customerName: this.serverDetail.contactMobile.substring(this.serverDetail.contactMobile.length - 4, this.serverDetail.contactMobile.length),
        }
        this.$emit('toRefundDetail', data)
      },

      // 倒计时结束
      finishTime() {
        this.$emit('finishTime')
      },
    },
  }
</script>
<style lang="less" scoped>
  .details-top {
    background: linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%);
    /deep/ .topbox {
      background: transparent;
      .van-nav-bar__title {
        color: #fff !important;
        font-size: 20px !important;
        font-weight: 600;
      }
      .van-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background-color: rgba(30, 30, 30, 0.2);
        border-radius: 8px;
        &::before {
          // display: none;
          content: '';
          width: 20px;
          height: 20px;
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/arrow-back-white-2x.png') no-repeat;
          background-size: 20px;
        }

        // display: none;
      }
    }
  }
  .titleboxWrapper {
    text-align: center;
    padding-top: 44px;
    .titlebox {
      display: inline-block;
      line-height: 16px;
      font-size: 11px;
      text-align: center;
      color: #fff;
    }
  }
  .applyAfterBox {
    height: 72px;
    h3 {
      color: #fff;
      font-size: 0.64rem;
      padding-top: 0.8rem;
      padding-left: 0.88rem;
      font-weight: bold;
    }
    .stepsBoxWrapper {
      position: relative;
      margin-top: 8px;
      padding: 0 30px;
      // padding-left: 25px;
      // overflow: hidden;
      .stepsBox {
        display: flex;
        justify-content: center;
        /deep/ .van-icon-checked {
          color: #ffa3aa;
          z-index: 9;
        }
        .stepsSpan {
          position: relative;
          display: flex;
          flex: 1;
          // flex-direction: column;
          justify-content: center;
          align-items: center;
          &:first-child {
            flex: 0;
          }
          .stepsLabel {
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            color: #fff;
            font-size: 11px;
            line-height: 16px;
            font-weight: 500;
            opacity: 0.4;
          }
          .stepsLabelActive {
            color: #fff;
          }
          .van-icon {
            position: relative;
            z-index: 3;
          }
          .circle {
            position: relative;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/status-normal.png) no-repeat;
            background-size: 100%;
            &.finish-circle {
              background: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/status-finished.png) no-repeat;
              background-size: 100%;
            }
            &.now-circle {
              background: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/status-now.png) no-repeat;
              background-size: 100%;
            }
          }
          .step__line {
            flex: 1;
            // position: absolute;
            // top: 10px;
            // // right: calc(50% + 19px);
            // left: 0;
            // transform: translateX(-50%);
            height: 1px;
            // width: 43px;
            margin: 0 8px;
            box-sizing: content-box;
            // width: calc(~'100% - 28px');
            background-color: #fff;
            z-index: 1;
            opacity: 0.4;
          }
          &:first-child .step__line {
            display: none;
          }
        }
        .step--finish {
          .step__line,
          .stepsLabel {
            opacity: 1;
          }
        }
        .colorStatusImg {
          background: url('~@/assets/img/gx_01@2x.png') no-repeat;
          background-size: 0.44rem;
        }
      }
      .bgLineBox {
        height: 0.12rem;
        background-color: #ff6a76;
        width: 92%;
        position: absolute;
        top: 50%;
        left: 6%;
        margin-top: -0.48rem;
      }
      .lightLine1 {
        width: 11%;
        background-color: #fff;
      }
      .lightLine2 {
        width: 33%;
        background-color: #fff;
      }
      .lightLine3 {
        width: 57%;
        background-color: #fff;
      }
      .lightLine4 {
        background-color: #fff;
      }
    }
    .serverFinish {
      text-align: center;
      padding-top: 1.5rem;
    }
  }
  .bgcolor {
    background-color: #fff;
    border-radius: 12px;
    margin: 0 10px;
    padding: 16px 12px;
  }

  .applyAfterDetailBox {
    margin: 0;
    margin-top: -12px;
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    img {
      width: 16px;
      height: 16px;
      margin-left: 8px;
    }
    .applyAfterDetail_info {
      flex: 1;
      .applyAfterDetail-tips {
        font-size: 0;
        white-space: pre-line;
        line-height: initial;
        span {
          font-size: 13px;
          font-weight: bold;
          color: #191919;
        }
        .van-count-down {
          display: inline;
          line-height: 17px;
          font-weight: 13px;
          span {
            color: #ff0a35;
          }
        }
      }
      .problem {
        color: #999;
        margin-top: 8px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 17px;
      }
      .colorred {
        display: inline-block;
        /deep/ .van-count-down {
          color: #e60113;
          font-weight: bold;
          font-size: 13px;
        }
      }
    }
  }
</style>
