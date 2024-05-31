<template>
  <!-- 发货单信息 -->
  <div class="bgcolor goodsInfoBox" v-if="isShowBackInfo || serverDetail.addressVo">
    <!-- <div v-if="showReturnLog" class="return-log">
          <h2 class="goodsInfoTitle">
          <strong>发货单信息</strong>
        </h2>
          <div class="goodsInfoDiv">
            <label class="goodsInfo_title">快递单号:</label>
            <span class="goodsInfo_value">{{ serverDetail.waybillCode }}</span>
            <span class="copy-icon" @click="copyInfo(serverDetail.waybillCode)"></span>
          </div>
          <div class="goodsInfoDiv">
            <label class="goodsInfo_title">快递公司:</label>
            <span class="goodsInfo_value">{{ serverDetail.logisCompanyName }}</span>
          </div>
        </div> -->
    <div class="return-log">
      <template v-if="isShowBackInfo">
        <!-- 寄出物流 -->
        <div class="logistics" v-if="showReturnLog" @click="toTraces(0)">
          <img class="log-tag" :src="$oss + '/order/shouhou_jichu.png'" />
          <p class="log-order">
            {{ serverDetail.logisCompanyName }} {{ serverDetail.waybillCode }}
            <img :src="$oss + '/order/shouhou_liebiao_gengduo_xiangxia_jiantou.png'" alt="" />
          </p>
        </div>

        <div class="logistics" v-if="serverDetail.swapOrder && serverDetail.swapOrder.waybillCode" @click="toTraces(1)">
          <img class="log-tag" :src="$oss + '/order/shouhou_jihui.png'" />
          <p class="log-order">
            {{ serverDetail.swapOrder.logisCompanyName }} {{ serverDetail.swapOrder.waybillCode }}
            <img :src="$oss + '/order/shouhou_liebiao_gengduo_xiangxia_jiantou.png'" alt="" />
          </p>
        </div>

        <!-- 寄出地址信息 -->
        <div class="receive-box">
          <div class="receive-info" :style="{ 'margin-top': showReturnLog ? null : 0 }">
            <img :src="$oss + '/order/shouhou_ji_yuan.png'" alt="" />
            <div style="flex: 1;">
              <h3 class="recipient">
                <p>
                  <span class="name">{{ serverDetail.name }}</span>
                  <span class="phone">{{ serverDetail.mobile }}</span>
                </p>
                <span class="copy" @click="copyInfo(serverDetail.detailAddress + ' ' + serverDetail.name + ' ' + serverDetail.mobile)">复制</span>
              </h3>
              <p style="color:red" v-if="serverDetail.yzSource&& serverDetail.yzSource!=0">(备注：退换货详细地址，务必咨询客服后再进行操作)</p>
              <div class="receive-adr">{{ serverDetail.detailAddress }}</div>
            </div>
          </div>
        </div>
      </template>
      <!-- 寄回收货地址信息 -->
      <div class="receive-box" v-if="serverDetail.addressVo">
        <div class="receive-info" :class="{ 'margin-top-20': isShowBackInfo }" :style="{ 'margin-top': isShowBackInfo ? null : 0 }">
          <img :src="$oss + '/order/shouhou_shou_yuan.png'" alt="" />
          <div style="flex: 1;">
            <h3 class="recipient">
              <p>
                <span class="name">{{ serverDetail.addressVo.name }}</span>
                <span class="phone">{{ serverDetail.addressVo.mobile }}</span>
              </p>
              <span
                class="copy"
                @click="
                  copyInfo(
                    `${serverDetail.addressVo.address && serverDetail.addressVo.address.replaceAll(',', '')} ${serverDetail.addressVo &&
                      serverDetail.addressVo.detailAddress}` +
                      ' ' +
                      serverDetail.addressVo.name +
                      ' ' +
                      serverDetail.addressVo.mobile
                  )
                "
              >
                复制
              </span>
            </h3>
            <div class="receive-adr">
              {{
                `${serverDetail.addressVo.address && serverDetail.addressVo.address.replaceAll(',', '')} ${serverDetail.addressVo &&
                  serverDetail.addressVo.detailAddress}`
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 商品寄回信息 -->
  <!-- <div class="bgcolor goodsInfoBox">
        
        <div>
          <h2>
            <strong>商品寄回信息</strong>
            <span class="copy-icon" @click="copyInfo(serverDetail.detailAddress + ' ' + serverDetail.name + ' ' + serverDetail.mobile)"></span>
          </h2>
          <div class="addressBox goodsInfoDiv">
            <label class="goodsInfo_title" style="vertical-align: top">寄回地址:</label>
            <p class="doubleoverline goodsInfo_value">{{ serverDetail.detailAddress }}</p>
          </div>
          <div class="goodsInfoDiv">
            <label class="goodsInfo_title">收件人:</label>
            <span class="goodsInfo_value">{{ serverDetail.name }}</span>
          </div>
          <div class="goodsInfoDiv">
            <label class="goodsInfo_title">联系电话:</label>
            <span class="goodsInfo_value">{{ serverDetail.mobile }}</span>
          </div>
        </div>
      </div> -->
</template>

<script>
  export default {
    props: {
      mode: {
        // return：退货  exchange：换货
        type: String,
        default: 'return',
      },

      serverDetail: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },

    computed: {
      status() {
        return +this.serverDetail.status
      },

      //   商品寄回信息显示控制
      isShowBackInfo() {
        return (
          (this.mode === 'return' && [5, 6, 7, 8, 9, 10, 11, 12].includes(this.status)) ||
          (this.mode === 'exchange' && [15, 16, 18, 19, 20, 21, 22].includes(this.status)) || this.serverDetail.waybillCode
        )
      },

      // 显示商品寄出物流信息
      showReturnLog() {
        return (
          ((this.mode === 'return' && [7, 8, 9, 10, 11].includes(this.status)) || (this.mode === 'exchange' && this.status != 15)) &&
          this.serverDetail.waybillCode
        )
      },
    },
    methods: {
      //复制信息
      copyInfo(info) {
        let oInput = document.createElement('input')
        oInput.value = info
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$toast('复制成功')
        oInput.remove()
      },

      // 查看物流
      toTraces(postType) {
        this.$router.push({
          path: '/tracesOrder',
          query: {
            backOrderId: this.serverDetail.id,
            postType,
            from: 'backOrder',
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .bgcolor {
    background-color: #fff;
    border-radius: 12px;
    margin: 0 0.4rem;
    padding: 16px 12px;
  }
  .goodsInfoBox {
    color: #000;
    margin-top: 12px;
    font-size: 13px;
    .goodsInfoTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .right-btn {
        height: 30px;
        border-radius: 15px;
        border: 1px solid #999;
        padding: 0 12px;
        display: inline-flex;
        align-items: center;
        color: #000;
        font-size: 13px;
      }
    }
    h2 {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
      span {
        display: inline-block;
        width: 1.6rem;
        height: 0.75rem;
        background: #f5f5f5;
        border-radius: 9px;
        margin-left: 10px;
        font-weight: normal;
        text-align: center;
        line-height: 0.75rem;
      }
    }
    .addressBox {
      p {
        width: 10.16rem;
        display: inline-block;
      }
    }
  }
  .copy-icon {
    float: right;
    width: 20px !important;
    height: 20px !important;
    background: url('~@/assets/img/copy.png') no-repeat center center !important;
    background-size: 20px !important;
  }
  .goodsInfoDiv {
    display: flex;
    font-size: 13px;
    margin-top: 20px;
    line-height: 17px;
    .goodsInfo_title {
      flex-shrink: 0;
      display: inline-block;
      width: 2.48rem;
      color: #666;
    }
    .goodsInfo_value {
      flex: 1;
      color: #000;
      text-align: right;
    }
  }
  .return-log {
    .logistics {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 8px;
      background-color: #fafafa;
      .log-tag {
        flex-shrink: 0;
        margin-right: 4px;
        width: 26px;
        height: 16px;
      }
      .log-order {
        flex: 1;
        display: flex;
        justify-content: space-between;
        img {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          transform: rotate(-90deg);
        }
      }
    }
    .receive-box {
      overflow: hidden;
    }
    .receive-info {
      margin-top: 8px;
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
        width: 24px;
        height: 24px;
      }
      .recipient {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 0;
        }
        .name,
        .phone {
          font-size: 13px;
          font-weight: 600;
        }
        .name {
          margin-right: 8px;
        }
        .copy {
          display: inline-block;
          font-size: 11px;
          color: #444444;
          line-height: 15px;
          width: 38px;
          height: 17px;
          line-height: 17px;
          background: #f7f7f7;
          border-radius: 8px;
          text-align: center;
        }
      }
      .receive-adr {
        padding-top: 4px;
        width: 295px;
        font-size: 13px;
        color: #6e6e6e;
        line-height: 18px;
      }
    }
    .margin-top-20 {
      margin-top: 20px;
    }
  }
</style>
