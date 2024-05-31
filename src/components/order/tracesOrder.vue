<template>
  <div class="wraper">
    <navBartop :title="$route.meta.title" @clickBack="toBack" class="navtop" :class="{ 'top-height': expressData }"  :outStyle="outStyle"></navBartop>
    <template v-if="expressData">
      <div>
        <div class="main">
          <!-- 订单状态 -->
          <div class="orderdetail module-com" :class="{ 'margin-top-20': expressData }">
            <div class="orderdetail-every">
              <label>订单编号</label>
              <div class="orderdetail-every__value" v-if="expressData.orderCode">
                <span>{{ expressData.orderCode }}</span>
                <span class="orderdetail-every__copy" @click.stop="copyValue(expressData.orderCode)">复制</span>
              </div>
            </div>
            <div class="orderdetail-every">
              <label>承运公司</label>
              <div class="orderdetail-every__value" v-if="expressData.expressCompany">
                <span>{{ expressData.expressCompany }}</span>
              </div>
            </div>
            <div class="orderdetail-every">
              <label>运单编号</label>
              <div class="orderdetail-every__value" v-if="expressData.logisticCode">
                <span>{{ expressData.logisticCode }}</span>
                <span class="orderdetail-every__copy" @click.stop="copyValue(expressData.logisticCode)">复制</span>
              </div>
            </div>
          </div>
          <!-- 物流信息 -->
          <div class="mobile-tracking-time-line">
            <div ref="timeLineContain" id="time-line-contain" :class="{ 'time-line-contain': hasMoreIcon }">
              <van-steps direction="vertical" :active="0" active-color="#E60113">
                <!-- <template slot="activeIcon">
              <view>123</view>
            </template> -->
                <van-step v-for="(item, idx) in tracesList" :key="idx">
                  <div class="u-order-title" :style="{ color: idx <= 0 ? '#191919' : '#999' }">
                    <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/receipt-new.png" />
                    {{ item.action }}
                  </div>
                  <div class="u-order-desc-contain">
                    <div v-for="(subItem, subIdx) in item.children" :key="subIdx" class="u-order-desc-wraper">
                      <div>
                        <div class="u-order-desc" :style="{ color: idx <= 0 && subIdx <= 0 ? '#6E6E6E' : '#999' }">
                          {{ subItem.acceptStation }}
                        </div>
                        <div class="u-order-time">{{ subItem.acceptTime }}</div>
                      </div>
                    </div>
                  </div>
                </van-step>
              </van-steps>
            </div>
            <div class="sku-more-btn" v-if="hasMore" @click="isHasMore()">
              <img v-if="hasMoreIcon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-btn-btom.png" />
              <img v-else src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-btn-top.png" />
            </div>
          </div>
        </div>
        <!-- 热销商品 -->
        <div class="xq_wntj" style="margin-top: 0.4rem">
          <shopList :title="'热销商品'" :titleImg="true"></shopList>
        </div>
      </div>
    </template>
    <div class="nodata" v-else>
      <img :src="$oss + '/order/shouhou_quesheng.png'" alt="" />
      <p>暂无页面</p>
    </div>
  </div>
</template>

<script>
  import navBartop from '@/components/commons/navBartop'
  import { Step, Steps, Toast } from 'vant'
  import { getExpress, getSingleExpress } from '@/api/orderlist'
  import { getLogisticsById, getbackLogisticsById } from '@/api/backorderlist'
  import detailHeader from './orderdetail/header'
  import shopList from '@/components/commons/shopList'

  export default {
    components: {
      navBartop,
      vanStep: Step,
      vanSteps: Steps,
      detailHeader,
      shopList,
    },
    name: 'tracesOrder',
    data() {
      return {
        expressData: {
          orderCode: null,
          expressCompany: null,
          logisticCode: null,
        },
        expressInfo: {
          expressCode: undefined, // 快递公司编号
          expressCompany: undefined, // 快递公司名字
          orderCode: undefined, // 订单编号
          logisticCode: undefined, // 快递编号
          customerName: undefined, // 客户手机号后4位 - 部分快递需求
        },

        hasMore: false, // 是否需要查看更多物流
        hasMoreIcon: false, // 物流展开还是收起

        tracesList: [
          {
            action: '正在等待揽收中',
            children: [
              {
                acceptStation: '暂无物流信息',
                acceptTime: '',
              },
            ],
          },
        ],
        outStyle:{
          background: 'linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%)'
        }
      }
    },
    created() {
      this.expressInfo = this.$route.query
      console.log(this.$route.query, '****')
      this.loadTraces()
    },
    methods: {
      toBack() {
        this.$router.back()
      },
      // 获取物流详情
      loadTraces() {
        let data = JSON.parse(JSON.stringify(this.expressInfo))

        let postMethond = this.$route.query.from ? getbackLogisticsById : getLogisticsById
        postMethond(data).then((res) => {
          if (!res.data) {
            this.expressData = null
            return
          }
          let { orderCode, expressCompany, trackingNumber } = res.data || {}
          let expressData = {
            orderCode,
            expressCompany,
            logisticCode: trackingNumber,
          }
          this.expressData = expressData
          if (res.data.tracesList) {
            this.tracesList = this.filterTracesList(res.data.tracesList)
          }

          // 获取物流区域高度
          this.getTraceHeight()
        })
      },
      // 复制到剪贴板
      copyValue(value) {
        // console.log('订单编号',code);
        let oInput = document.createElement('input')
        oInput.value = value
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        // console.log(oInput.value)
        document.execCommand('Copy') // 执行浏览器复制命令
        Toast('复制成功')
        oInput.remove()
      },
      // 过滤物流数组
      filterTracesList(tracesList) {
        let list = []
        let result = []
        tracesList.forEach((el) => {
          const listIdx = list.indexOf(el.action)
          if (listIdx < 0) {
            list.push(el.action)
            result.push({
              action: el.action,
              children: [{ acceptStation: el.acceptStation, acceptTime: el.acceptTime }],
            })
          } else {
            result[listIdx].children.push({
              acceptStation: el.acceptStation,
              acceptTime: el.acceptTime,
            })
          }
        })
        return result
      },
      // 获取物流区域高度
      getTraceHeight() {
        this.$nextTick(() => {
          let height = this.$refs.timeLineContain.offsetHeight
          if (height >= 167) {
            this.hasMore = true
            this.hasMoreIcon = true
          }
        })
      },

      // 是否有查看更多物流按钮
      isHasMore() {
        this.hasMoreIcon = !this.hasMoreIcon
      },
    },
  }
</script>

<style lang="less" scoped>
  .wraper {
    background-color: #f5f5f5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .navtop /deep/ .topbox {
    background: linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%);
    z-index: 10;
  }
  .navtop {
    background: linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%);
  }
  .top-height {
    height: 72px !important;
  }
  .margin-top-20 {
    margin-top: -20px !important;
  }
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
  .header {
    .nav {
      width: 100%;
      height: 44px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 5;
      background-color: #fff;
    }
    .nav-title {
      display: flex;
      align-items: center;
      height: 44px;
      line-height: 44px;
      width: 100%;
      text-align: center;
      justify-content: center;
      margin-right: 84px;
    }
    .nav-title__word {
      font-size: 20px;
      color: #ff0a35;
      font-weight: 500;
      margin-left: 4px;
    }

    .content {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: 4px;
    }
    .content-status {
      font-size: 13px;
      font-weight: 500;
      color: #191919;
      height: 17px;
      line-height: 17px;
      display: flex;
      align-items: center;
      .van-count-down {
        color: #191919;
        font-size: 13px;
        margin: 0;
      }
    }
    .content-status__desc {
      display: flex;
      margin: 0 10px;
    }

    .topay {
      width: 104px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #ff0a35;
      box-shadow: 0px 4px 16px 0px rgba(86, 2, 16, 0.1);
      border-radius: 16px;
      font-size: 13px;
      font-weight: 400;
      color: #ffffff;
      margin-top: 16px;
    }
  }

  .main {
    .module-com {
      background: #ffffff;
      border-radius: 12px;
      margin: 10px auto 0;
    }
    .orderdetail {
      padding: 6px 0;
      &-every {
        display: flex;
        justify-content: space-between;
        line-height: 17px;
        font-size: 13px;
        font-weight: 400;
        color: #191919;
        padding: 10px 10px 9px 10px;
      }
      &-every__value {
        max-width: 237px;
        word-break: break-all;
      }
      &-every__copy {
        display: inline-block;
        width: 38px;
        height: 17px;
        line-height: 17px;
        text-align: center;
        background: #f7f7f7;
        border-radius: 9px;
        font-size: 11px;
        font-weight: 400;
        color: #444444;
        margin-left: 4px;
      }
    }

    .mobile-tracking-time-line {
      width: 351px;
      margin: 10px auto 0;
      padding: 12px 12px 12px 0;
      background-color: #fff;
      border-radius: 8px;
      .time-line-contain {
        height: 167px;
        overflow: hidden;
      }
      .sku-more-btn {
        width: 61px;
        height: 16px;
        border-radius: 8px;
        margin: 10px auto 0;
        img {
          width: 61px;
          height: 16px;
          display: block;
        }
      }
      /deep/ .van-steps--vertical {
        padding: 0 0 0 27px;
      }
      /deep/ .van-steps__items {
        .van-step {
          width: 312px;
          border-radius: 8px;
          padding: 8px;
          margin-top: 8px;
          background: rgba(246, 246, 246, 0.5);
          &::after {
            border-bottom-width: 0px;
          }
        }
        .van-step:first-of-type {
          margin-top: 0px;
        }
        .van-step__circle-container {
          left: -10px;
        }
        .van-step__circle {
          width: 11px;
          height: 11px;
          background-color: #c3c3c3;
          border: 2px solid #f7f7f7;
          border-radius: 50%;
        }
        .van-icon-checked {
          &::before {
            content: '';
            width: 7px;
            height: 7px;
            background-color: #ff0a35;
            border: 2px solid #ffe6ea;
            border-radius: 50%;
          }
        }
        .van-step__line {
          top: 23px;
          left: -10px;
          background-color: #eee;
        }
      }

      .u-order-title {
        line-height: 17px;
        font-size: 13px;
        font-weight: 400;
        color: #191919;
        display: flex;
        img {
          width: 16px;
          height: 17px;
          margin-right: 4px;
          opacity: 0.5;
        }
      }
      /deep/ .van-steps__items {
        .van-step:first-of-type {
          .u-order-title img {
            opacity: 1;
          }
        }
      }
      .u-order-desc-contain {
        .u-order-desc-wraper {
          margin-top: 16px;
        }
        .u-order-desc-wraper:first-of-type {
          margin-top: 4px;
        }
      }

      .u-order-desc {
        line-height: 15px;
        font-size: 11px;
        font-weight: 400;
        color: #6e6e6e;
      }

      .u-order-time {
        line-height: 15px;
        font-size: 11px;
        font-weight: 400;
        color: #999999;
        margin-top: 4px;
      }
    }
  }

  .xq_wntj {
    padding: 0 0.48rem;
    text-align: center;
    /deep/ .guess-warp {
      .guess-title {
        height: 0.72rem;
        line-height: 0.72rem;
        margin: 1.2rem 0 0.48rem;
        padding: unset;
      }
    }
  }
  .nodata {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 160px;
      height: 160px;
    }
    p {
      margin-top: 8px;
      font-size: 13px;
      color: #444;
      line-height: 17px;
    }
  }
</style>
