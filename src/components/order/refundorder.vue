<template>
  <div class="boxwrapper">
    <!-- 头部 -->
    <top-header class="nav-top" :title="'申请退款'" @clickBack="back"></top-header>
    <!-- 内容 -->
    <div class="contentbox">
      <div class="goodsbox">
        <img :src="orderData.skuImage" class="goodsimg" alt=""/>
        <div class="goodsinfo">
          <p class="goodsname">{{ orderData.skuName }}</p>
          <p class="goods_gg">
            <span>{{ orderData.skuSpecs }}</span>
            <span class="num">x{{ orderData.num }}</span>
          </p>
        </div>
      </div>
      <div class="refundinfobox" >
        <van-cell-group>
          <van-field v-model="refundReason.reason" label="退款原因" placeholder="请选择退款原因" readonly class="iconimg" @click="chooseReason" />
          <van-field label-width="90px" label="申请退款金额" class="refundMoney">
            <template #input>
              <div class="goodsinfo">
                <p class="goodsname">¥{{ orderData.price.toFixed(2) }}</p>
                <p class="goods_gg">
                  <span>单价:¥{{ orderData.skuPrice.toFixed(2) }}</span>
                  <span>申请数量:{{ orderData.num }}</span>
                </p>
              </div>
            </template>
          </van-field>
        </van-cell-group> 
      </div>
    </div>
    <div class="footer-btn">
      <van-button
        type="danger"
        @click="submitrefund"
        round
        :disabled="!issubmitshow"
        class="submitbox"
        :class="{ isopacity: issubmitshow}"
      >
        申请退款
      </van-button>
    </div>
    <!-- 弹出层 -->
    <ordercancelpopup :isMotorCar='!!$route.query.isMotorCar' :isShowPoup="isShowPoup" @closePoup="closePoup" @submitPoup="submitPoup" :isRefund="true" :isThird="isThird"></ordercancelpopup>
  </div>
</template>

<script>
import TopHeader from './components/topHeader.vue'
import ordercancelpopup from './ordercancelpopup'
import { applyRefund , queryorderforreturn} from '@/api/backorderlist'
import { Button, Toast, Field,  CellGroup } from 'vant'
export default {
  components: {
    TopHeader,
    ordercancelpopup,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Toast.name]: Toast,
  },
  data() {
    return {
      isShowPoup: false,
      issubmitshow: false,
      refundReason: { 
        orderSkuId:this.$route.query.orderSkuId||'',
        orderId: this.$route.query.orderId||'',
        isarrive: 1,
        reason: '',
        addCart: false,
        tradeNo: this.$route.query.orderCode||'', //  请求流水号
        reasonType: '', // 第三方原因id
      },
      orderData:{
        skuPrice:0,
        price:0
      },
      isThird: false, // 订单类型是否是第三方，为3时需要请求第三方售后原因
    }
  },
  watch: {
    'refundReason.reason': function (value) {
      if (value) {
        this.issubmitshow = true
      } else this.issubmitshow = false
    },
  },
  created() {
    this.getList()
  },
  methods: {
    //获取详情
    getList(){
      let param={
        orderSkuId:this.refundReason.orderSkuId,
        orderId: this.refundReason.orderId,
      }
      queryorderforreturn(param).then((res) => {
        if(res.code==200){
          this.orderData = (res.data || {}).returnSku
          this.isThird = (res.data || {}).placeOrderType == 3
        }
      })
    },
    // 提交退款原因
    submitrefund() {
      try {
        applyRefund(this.refundReason).then((res) => {
          if (res.code==200) {
            this.$router.replace({
              path: '/refundSuccess',
              query: {
                id: res.data,
                type:1
              },
            })
            return
          } else{
            Toast('订单状态已发生变化')
          } 
          this.$router.back()
        })
      } catch (error) {
        Toast('申请退款失败')
      }
    },
    // 选择原因弹出层
    chooseReason() {
      this.isShowPoup = true
    },
    // 提交弹出层
    submitPoup(data) {
      this.refundReason.reasonType = data.reasonType || ''
      this.refundReason.reason = data.reason
      this.refundReason.addCart = data.addCart
      this.isShowPoup = false
    },
    // 关闭弹出层
    closePoup(data) {
      this.isShowPoup = data
    },
    back() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="less">
.boxwrapper {
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  height: 100%;
  .contentbox {
    padding: 10px;
    color: #000;
    font-size: 13px;
    flex: 1;
    overflow-y: auto;

    .goodsbox {
      display: flex;
      background: #fff;
      border-radius: 12px;
      margin-bottom: 10px;
      padding: 10px;
      overflow: hidden;
      .goodsimg {
        width: 74px;
        height: 74px;
        border-radius: 8px;
        margin-right: 8px;
      }
      .goodsinfo {
        flex: 1;
        overflow: hidden;
        .goodsname {
          color: #191919;
          font-size: 13px;
          font-weight: bold;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .goods_gg {
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #999;
        }
      }
    }
    h3 {
      font-weight: bold;
    }
  
    .refundinfobox {
      .goodsname {
        font-size: 13px;
      }
      .goods_gg {
        color: #999;
        font-size: 11px;
        span {
          &:first-child {
            margin-right: 10px;
          }
        }
      }
      .iconimg {
        /deep/ .van-field__value {
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png') no-repeat right center;
          background-size: 16px 16px;
        }
      } 
      /deep/ .van-field__value {
        padding-right: 22px;
        .van-field__control {
          text-align: right;
          font-size: 11px;
          &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #999;
            font-size: 11px;
          }
        }
        
      }
      /deep/ .van-field__label {
        color: #191919;
        font-size: 13px;
        display: flex;
        align-items: center;
      }
      /deep/ .van-field__control {
        color: #191919;
        font-size: 13px;
      }
      .van-cell-group {
        background: transparent;
      }
      /deep/ .van-cell {
        padding: 10px 12px;
        overflow: hidden;
        margin-bottom: 10px;
        border-radius: 12px;
      }
      /deep/ .van-cell::after {
        right: -0.72rem;
        bottom: 0;
        left: 3.96rem;
        border-color: #f2f2f2;
      }

      /deep/ .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border-top: 0;
        // left: -39px;
        border-color: #f2f2f2;
      }
      /deep/ .van-field__body {
        justify-content: flex-end;
        .van-field__control--custom {
          justify-content: flex-end;
        }
        input::-webkit-input-placeholder {
          color: #bababb !important;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #bababb !important;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #bababb !important;
        }
        input::-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #bababb !important;
        }
      }
     
      .mobilefiled::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: -0.72rem;
        bottom: 0;
        left: 3.96rem;
        border-bottom: 1px solid #f2f2f2;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
  }
  .footer-btn {
    padding: 4px 12px;
    padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
    box-shadow: 0px -2px 10px 0px rgba(189,194,204,0.2);
    .submitbox {
      display: block;
      width: 100%;
      height: 40px;
      border: none;
      border-radius: 20px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      font-weight: bold;
      background: #eee;
      color: #999;
    }
    .isopacity {
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      color: #fff;
    }
  }
}
</style>
