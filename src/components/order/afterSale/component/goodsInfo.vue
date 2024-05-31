<template>
  <div class="goodsBox bgcolor">
    <div class="returnGoodsBox" v-if="serverSku">
      <img :src="serverSku.skuImage" alt="" />
      <div class="goods_right">
        <div class="goods_right_top">
          <p class="overline">{{ serverSku.skuName }}</p>
          <p class="goodsNum transformS">
            <span>申请数量：{{ serverDetail.num }}</span>
          </p>
        </div>
        <p class="goodsPrice" v-if= "serverSku.integralPoint > 0">
          <span class="fqz-price" >
            <span>
              <span class="special">{{serverSku.integralPoint }}</span>
              福气值+<span>{{ serverSku.deductionAfterPrice }}</span>元
            </span>
          </span>
        </p>
        <p class="goodsPrice" v-else>
          <span class="coin">¥</span>
          <span>{{ setPrice(serverSku.unitPrice)[0] }}</span>
          <span class="float">.{{ setPrice(serverSku.unitPrice)[1] }}</span>
        </p>
      </div>
    </div>
    <div class="customerService">
      <span @click="callUp">联系客服</span>
    </div>
  </div>
</template>
<script>
  import { formatPrice } from '@/utils/utils'
  export default {
    props: {
      serverDetail: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    computed: {
      serverSku() {
        return this.serverDetail.type != 1 ? this.serverDetail.returnSku : this.serverDetail.refundSku
      }
    },
    methods: {
      setPrice(val) {
        return formatPrice(val).split('.')
      },
      // 联系客服
      toService() {
        let that = this
        let storeServiceConfig = undefined,
          options = {},
          data = undefined,
          pt_is_sj = false
        data = that.serverDetail
        storeServiceConfig = that.serverDetail.storeServiceConfig
        //  过滤值为空的字段
        Object.keys(storeServiceConfig).forEach((key) => {
          if (storeServiceConfig[key]) {
            if (key == 'staffId') {
              options.staffid = storeServiceConfig[key]
            } else {
              options[key] = storeServiceConfig[key]
            }
          }
        })
        //  options.staffid = '6014114' //指定客服
        options.staffid ? (pt_is_sj = true) : (pt_is_sj = false)
        console.log(options, '👩')
        ysf('config', {
          ...options,
          success: function() {
            that.productFun(data, pt_is_sj)
          },
        })
      },
      productFun(data, pt_is_sj) {
        let that = this,
          tagsUrl = '',
          pt = '',
          sj = ''
        pt = `https://platform.wsfmall.com/ordermagamemt/storeorder/storereturnreview?id=${data.id}`
        sj = `https://merchant.wsfmall.com/ordermanagement/mallorder/returnreview?id=${data.id}`
        // 判断：指定客服id为空，则跳转平台端订单详情，否则跳转商家端订单详情
        pt_is_sj ? (tagsUrl = sj) : (tagsUrl = pt)
        ysf('product', {
          show: 1, //1为打开， 其他参数为隐藏（包括非零元素
          title: `售后单号: ${data.backCode}`,
          desc: data.orderSkus[0].skuName,
          picture: data.orderSkus[0].skuImage,
          note: `￥${data.orderSkus[0].skuPrice}`,
          url: `https://m.wsfmall.com/serverDetails?id=${data.id}`, // 跳转客户端商品详情页面
          sendByUser: 0, //自动发送卡片
          tags: [
            {
              label: '查看订单详情', // 按钮名字
              url: tagsUrl, // 跳转客户端商品详情页面
            },
          ],
          success: function() {
            ysf('open') //打开客服窗口
          },
          error: function() {
            console.warn('连接客服失败')
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .bgcolor {
    margin: 10px 12px 0;
    background-color: #fff;
    border-radius: 12px;
    padding: 16px 12px;
  }
  .goodsBox {
    .returnGoodsBox {
      color: #000;
      display: flex;
      img {
        width: 102px;
        height: 102px;
        border-radius: 8px;
        margin-right: 8px;
      }
      .goods_right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        overflow: hidden;
        .goods_right_top {
          overflow: hidden;
          width: 100%;
          .overline {
            width: 100%;
            color: #191919;
            font-size: 13px;
            font-weight: bold;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            line-height: 17px;
          }
          .goodsNum {
            color: #999;
            margin-top: 0.08rem;
          }
        }
        .goodsPrice {
          font-size: 16px;
          font-weight: bold;
          color: #191919;
          display: flex;
          align-items: baseline;
          .coin {
            font-size: 12px;
          }
          .float {
            font-size: 13px;
          }
          .fqz-price{
            color: #191919;
            font-size: 11px;
            font-family: DINAlternate, DINAlternate;
            font-weight: 600;
            line-height: 17px;
            .special{
              font-size: 16px;
              font-weight: bold;
              line-height: 20px;
            }
        }
        }
      }
    }
    .customerService {
      margin-top: 16px;
      padding-top: 15px;
      border-top: 1px solid #f6f6f6;
      text-align: center;
      span {
        font-size: 13px;
        display: inline-block;
        padding-left: 24px;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/chat-icon.png') no-repeat left center;
        background-size: 20px;
      }
    }
  }
</style>
