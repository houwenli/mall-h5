<template>
  <div>
    <navBartop :title="$route.meta.title" @clickBack="back" class="navtop"></navBartop>
    <div class="mobile-tracking-order">
      <!-- 订单追踪头部信息展示 -->
      <div class="mobile-tracking-order-header">
        <div class="mobile-tracking-order-header-info">
          <div class="mobile-tracking-order-header-info-key">订单编号:</div>
          <div class="mobile-tracking-order-header-info-value">{{ expressData.orderCode }}</div>
          <div class="mobile-tracking-order-header-info-copy" @click.stop="copyValue(expressData.orderCode)">复制</div>
        </div>
        <div class="mobile-tracking-order-header-info u-flex u-row-left u-row-center">
          <div class="mobile-tracking-order-header-info-key">承运公司:</div>
          <div class="mobile-tracking-order-header-info-value">{{ expressData.expressCompany }}</div>
        </div>
        <div class="mobile-tracking-order-header-info u-flex u-row-left u-row-center">
          <div class="mobile-tracking-order-header-info-key">运单编号:</div>
          <div class="mobile-tracking-order-header-info-value">{{ expressData.logisticCode }}</div>
          <div class="mobile-tracking-order-header-info-copy" @click.stop="copyValue(expressData.logisticCode)">复制</div>
        </div>
      </div>
      <!-- 物流信息内容 -->
      <div class="mobile-tracking-time-line">
        <van-steps direction="vertical" :active="0" active-color="#E60113">
          <template slot="activeIcon">
            <view>123</view>
          </template>
          <template v-for="(item, idx) in tracesList">
            <van-step :key="idx">
              <div class="u-order-title" :style="{ color: idx <= 0 ? '#000000' : '#999999' }">{{ item.action }}</div>
              <template v-for="(subItem, subIdx) in item.children">
                <div :key="subIdx">
                  <div class="u-order-desc" :style="{ color: idx <= 0 && subIdx <= 0 ? '#000000' : '#999999' }">
                    {{ subItem.acceptStation }}
                  </div>
                  <div class="u-order-time">{{ subItem.acceptTime }}</div>
                </div>
              </template>
            </van-step>
          </template>
        </van-steps>
        <!--        <u-time-line>-->
        <!--          <template v-for="(item, idx) in tracesList">-->
        <!--            <u-time-line-item :key="idx" nodeTop="8">-->
        <!--              <template v-slot:node>-->
        <!--                <div class="u-node" :class="{ 'u-node-select': idx <= 0 }"></div>-->
        <!--              </template>-->
        <!--              <template v-slot:content>-->
        <!--                <div>-->
        <!--                  <div class="u-order-title" :style="{ color: idx <= 0 ? '#000000' : '#999999' }">{{ item.action }}</div>-->
        <!--                  <template v-for="(subItem, subIdx) in item.children">-->
        <!--                    <div :key="subIdx">-->
        <!--                      <div class="u-order-desc" :style="{ color: idx <= 0 && subIdx <= 0 ? '#000000' : '#999999' }">{{ subItem.acceptStation }}</div>-->
        <!--                      <div class="u-order-time">{{ subItem.acceptTime }}</div>-->
        <!--                    </div>-->
        <!--                  </template>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </u-time-line-item>-->
        <!--          </template>-->
        <!--        </u-time-line>-->
      </div>
    </div>
  </div>
</template>

<script>
  import navBartop from '@/components/commons/navBartop'
  import { Step, Steps, Toast } from 'vant'
  import { getExpress, getSingleExpress } from '@/api/orderlist'
  import { getLogisticsById } from '@/api/backorderlist'

  export default {
    components: {
      navBartop,
      vanStep: Step,
      vanSteps: Steps,
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
      }
    },
    created() {
      this.expressInfo = this.$route.query
      console.log(this.$route.query,'****');
      this.loadTraces()
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 获取物流详情
      loadTraces() {
        let data = JSON.parse(JSON.stringify(this.expressInfo))
        getLogisticsById(data).then(res => {
          this.expressData.orderCode = res.data.orderCode
          this.expressData.expressCompany = res.data.expressCompany
          this.expressData.logisticCode = res.data.trackingNumber
          if (res.data.tracesList) {
            this.tracesList = this.filterTracesList(res.data.tracesList)
          }
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
    },
  }
</script>

<style lang="less" scoped>
  .mobile-tracking-order {
    background-color: #f5f5f5;
    min-height: 100vh;
  }

  .mobile-tracking-order-header {
    height: 4.84rem;
    flex-direction: column;
    align-items: flex-start;
    background-color: #fff;
    margin-bottom: 0.48rem;
    padding: 0.8rem 0.72rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .mobile-tracking-order-header-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .mobile-tracking-order-header-info-key {
        margin-right: 0.32rem;
        color: #666666;
        font-size: 0.56rem;
      }

      .mobile-tracking-order-header-info-value {
        margin-right: 0.24rem;
        font-size: 0.56rem;
        color: #000;
      }

      .mobile-tracking-order-header-info-copy {
        width: 1.36rem;
        height: 0.72rem;
        background: #f5f5f5;
        border-radius: 0.32rem;
        font-size: 0.48rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
      }
    }
  }

  .mobile-tracking-time-line {
    padding: 0.8rem 0.72rem 1.2rem;
    background-color: #fff;

    .u-order-title {
      font-size: 0.6rem;
      font-weight: 500;
      color: #999999;
      line-height: 0.8rem;
      margin-bottom: 0.32rem;
    }

    .u-order-desc {
      font-size: 0.48rem;
      color: #999999;
      line-height: 0.8rem;
      margin-bottom: 0.32rem;
    }

    .u-order-time {
      font-size: 0.44rem;
      color: #999999;
      line-height: 0.48rem;
      margin-bottom: 0.8rem;
    }
  }

  //.mobile-tracking-time-line {
  //  border-radius: 20px;
  //  padding: 40px 36px;
  //  margin-bottom: 60px;
  //  background-color: #fff;
  //  .u-node {
  //    width: 18px;
  //    height: 18px;
  //    background: #dbdbdb;
  //    border: 4px solid #eeeeee;
  //    border-radius: 18px;
  //    overflow: hidden;
  //    box-sizing: content-box;
  //  }
  //  .u-node-select {
  //    background: #e60113;
  //    border: 4px solid #ffd8db;
  //  }
  //
  //  .u-order-title {
  //    font-size: 30px;
  //    font-weight: 500;
  //    color: #999999;
  //    line-height: 40px;
  //    margin-bottom: 16px;
  //  }
  //  .u-order-desc {
  //    font-size: 24px;
  //    color: #999999;
  //    line-height: 40px;
  //    margin-bottom: 16px;
  //  }
  //  .u-order-time {
  //    font-size: 22px;
  //    color: #999999;
  //    line-height: 24px;
  //    margin-bottom: 40px;
  //  }
  //  /deep/ .u-time-axis-item {
  //    margin-bottom: 0;
  //  }
  //}
</style>
