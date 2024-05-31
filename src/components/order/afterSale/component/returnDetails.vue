<template>
  <div>
    <div class="goodsReturnBox bgcolor">
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">订单编号</label>
        <span class="goodsInfo_value">{{ serverDetail.orderCode }}</span>
        <span class="copy-icon" @click="copySkuReturnInfo(serverDetail.orderCode)">复制</span>
      </div>
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">服务单号</label>
        <span class="goodsInfo_value">{{ serverDetail.backCode }}</span>
        <span class="copy-icon" @click="copySkuReturnInfo(serverDetail.backCode)">复制</span>
      </div>
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">申请时间</label>
        <span class="goodsInfo_value">{{ serverDetail.createTime }}</span>
      </div>
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">服务类型</label>
        <span class="goodsInfo_value font-13">{{ serverDetail.type == 1 ? '退款' : serverDetail.type == 2 ? '退货' : '换货' }}</span>
      </div>
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">申请原因</label>
        <span class="goodsInfo_value font-13">{{ serverDetail.reason }}</span>
      </div>
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">退款方式</label>
        <span class="goodsInfo_value font-13">原返</span>
      </div>

      <div v-if="mode === 'exchange'" class="goodsInfoDiv">
        <label class="goodsInfo_title">换新商品</label>
        <span class="goodsInfo_value font-13">{{ serverDetail.newSkuName }}</span>
      </div>
    </div>
    <div class="goodsReturnBox">
      <template v-if="mode === 'return' || mode === 'exchange'">
        <div class="bgcolor">
          <div class="goodsInfoDiv">
            <label class="goodsInfo_title">商品退回</label>
            <span class="goodsInfo_value font-13">{{ serverDetail.backType == 1 ? '快递至第三方卖家' : '' }}</span>
          </div>
          <div class="goodsInfoDiv">
            <label class="goodsInfo_title">联系人</label>
            <span class="goodsInfo_value font-13">{{ serverDetail.contactName }}</span>
          </div>
          <div class="goodsInfoDiv">
            <label class="goodsInfo_title">联系电话</label>
            <span class="goodsInfo_value" v-if="serverDetail.contactMobile">
              {{ serverDetail.contactMobile.substr(0, 3) + '****' + serverDetail.contactMobile.substr(7) }}
            </span>
          </div>
        </div>
      </template>

      <template v-if="mode === 'refund'">
        <div class="bgcolor" v-if="serverDetail.status == 2">
          <div class="returnMoney">
            <div class="title">
              <strong>退回金额</strong>
              <strong class="return-price">¥{{ serverDetail.realBackPrice }}</strong>
            </div>
            <div class="pay-Type" v-for="item in serverDetail.backWayPrices" :key="item.id">
              <p>
                {{ payChannelType[item.backChannel] }}
                <span>（预计1-5个工作日到账）</span>
              </p>
              <strong class="disabled-price">¥{{ item.backPrice }}</strong>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- <div class="goodsReturnBox bgcolor" v-if="mode === 'exchange'">
      <template>
        <div class="goodsInfoDiv" style="display: block;">
          <span>收货地址</span>
          <span>（该地址是卖家换货邮寄给您的地址）</span>
        </div>
        <div class="goodsInfoDiv">
          <label class="goodsInfo_title">收货人</label>
          <span class="goodsInfo_value font-13">{{ serverDetail.addressVo && serverDetail.addressVo.name }}</span>
        </div>
        <div class="goodsInfoDiv">
          <label class="goodsInfo_title">联系方式</label>
          <span class="goodsInfo_value">{{ serverDetail.addressVo && serverDetail.addressVo.mobile }}</span>
        </div>
        <div class="goodsInfoDiv">
          <label class="goodsInfo_title">收货地址</label>
          <span class="goodsInfo_value font-13">
            {{
              `${serverDetail.addressVo && serverDetail.addressVo.address && serverDetail.addressVo.address.replaceAll(',', '')} ${serverDetail.addressVo &&
                serverDetail.addressVo.detailAddress}`
            }}
          </span>
        </div>
      </template>
    </div> -->
  </div>
</template>

<script>
  export default {
    props: {
      serverDetail: {
        type: Object,
        default: () => {
          return {}
        },
      },
      // return：退货  exchange：换货  refund：退款
      mode: {
        type: String,
        default: 'return',
      },
    },
    data() {
      return {
        payChannelType: {
          0: '万顺宝余额',
          2: '微信',
          3: '支付宝',
          9: '福气值',
        },
      }
    },
    methods: {
      // 复制寄回信息
      copySkuReturnInfo(code) {
        let oInput = document.createElement('input')
        oInput.value = `${code}`
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$toast('复制成功')
        oInput.remove()
      },
    },
  }
</script>

<style lang="less" scoped>
  .bgcolor {
    background-color: #fff;
    border-radius: 0.4rem;
    margin: 0 0.4rem;
    padding: 0.8rem 0.48rem;
  }
  .goodsReturnBox {
    margin-top: 0.48rem;
    margin-bottom: 10px;
  }
  .goodsInfoDiv {
    font-size: 13px;
    margin-bottom: 19px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:last-child {
      margin-bottom: 0;
    }
    .goodsInfo_title {
      display: inline-block;
      color: #666;
    }
    .font-13 {
      font-size: 11px;
    };
    .goodsInfo_value {
      color: #191919;
      flex: 1;
      text-align: right;
    }
  }
  .returnMoney {
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // font-weight: bold;
      font-size: 13px;
      font-weight: 400;
    }
    .pay-Type {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: right;
      font-size: 14px;
      margin-top: 0.6rem;
      color: #666666;
      .disabled-price {
        color: #000000;
      }
      span {
        font-size: 10px;
        color: #999999;
      }
    }
    .return-price {
      color: #e60113;
      font-size: 14px;
      span {
        font-size: 0.48rem;
      }
    }
  }
  .copy-icon {
    margin-left: 4px;
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
</style>
