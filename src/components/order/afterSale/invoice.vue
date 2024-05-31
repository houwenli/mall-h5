<template>
  <div class="boxwrapper">
    <top-header :title="'填写发货单'" @clickBack="back"></top-header>
    <div class="scorll-content">
      <div class="writeInvoiceBox bgcolor">
        <h2>包裹信息</h2>
        <div class="formBox">
          <van-form>
            <van-field
              v-model="params.logisCompanyName"
              name="快递公司"
              label="快递公司:"
              placeholder="请选择快递公司"
              :right-icon="$oss + '/order/shouhou_liebiao_gengduo_xiangxia_jiantou.png'"
              @click="chooseLogistics"
              class="iconImg"
            >
              <!-- <template #image>
              <van-image width="100" height="100" src="../../../assets/img/unfoldGray@2x.png" class="img" />
              <img src="../../../assets/img/unfoldGray@2x.png" alt="" />
            </template> -->
            </van-field>
            <!-- :rules="[{ required: true, message: '请选择快递公司' }]" -->

            <van-field
              v-model.trim="params.waybillCode"
              name="快递单号:"
              class="padding-right-22 font-13"
              maxlength="50"
              clearable
              label="快递单号:"
              placeholder="请填写快递单号"
            />
            <!-- :rules="[{ required: true, message: '请填写快递单号:' }]" -->
          </van-form>
        </div>
        <p class="tipsBox transformS">
          <img :src="$oss + '/order/shouhou_liebiao_shangpin_tishi.png'" />
          温馨提示：您购买的三方卖家商品发生退货时，经三方卖家判断为个人原因导致，将无法为您报销商品寄回三方卖家的运费，
          运费您可与卖家确定，感谢您的理解与支持。
        </p>
      </div>
      <!-- 包裹信息 -->
      <div class="InvoiceGoodsBox bgcolor" style="margin-top: 0">
        <h2>包裹内商品信息</h2>
        <div class="goodsInfoBox">
          <p>
            <label class="goods_title">服务单号:</label>
            <span class="padding-right-22">{{ serverDetail.backCode }}</span>
          </p>
          <p>
            <label class="goods_title">申请时间:</label>
            <span class="padding-right-22">{{ serverDetail.createTime }}</span>
          </p>
        </div>
        <!-- 商品信息 -->
        <div class="goodsBox" v-if="serverDetail.returnSku">
          <img :src="serverDetail.returnSku.skuImage" alt="" />
          <div class="goodsInfo">
            <p class="doubleoverline">{{ serverDetail.returnSku.skuName }}</p>
            <p class="applyNum transformS">申请数量：{{ serverDetail.returnSku.applyNum }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <!-- <div class="footerBox">
      <span class="submit" @click="submit">提交</span>
    </div> -->
    <van-button class="footerBox" :disabled="disabled" @click="submit">提交</van-button>
  </div>
</template>

<script>
  import TopHeader from '../components/topHeader.vue'
  import { Button, Toast, Field, Form } from 'vant'
  import { queryAllLogisCompanyName, fillTheLogistics, updateLogistics, queryBackOrderDetail } from '@/api/backorderlist'
  import { getUserSource, smartOpenDeepLink } from '@/utils/hybrid.js'
  import { USER_SOURCE } from '@/constants/userinfo.js'

  export default {
    components: {
      TopHeader, // navtop顶部
      [Button.name]: Button,
      [Toast.name]: Toast,
      [Field.name]: Field,
      [Form.name]: Form
    },
    data() {
      return {
        showPopup: false,
        // returnSku: JSON.parse(this.$route.query.returnSku),
        // backCode: this.$route.query.backCode,
        // createTime: this.$route.query.createTime,
        params: {
          id: this.$route.query.id,
          waybillCode: '',
          logisCompanyName: '',
        },
        serverDetail: '',
      }
    },

    computed: {
      disabled({ params }) {
        return !params.waybillCode || !params.logisCompanyName
      }
    },

    created() {
      let waybillCode = sessionStorage.getItem('waybillCode')
      if (waybillCode) {
        this.params.waybillCode = waybillCode
      }
      this.getDetail()
    },
    methods: {
      // 选择物流
      chooseLogistics() {
        this.$router.push({
          path: '/logisInfo',
          query: {},
        })
        if (this.params.waybillCode) {
          sessionStorage.setItem('waybillCode', this.params.waybillCode)
        }
      },
      // 提交
      submit() {
        this.params.id = this.serverDetail.id
        if (!this.params.logisCompanyName) {
          Toast('请选择快递公司')
          return
        }
        if (!this.params.waybillCode) {
          Toast('请填写快递单号')
          return
        } else {
          let reg = /^[A-Za-z0-9]+$/
          if (!reg.test(this.params.waybillCode)) {
            Toast('请输入正确的快递发货单号')
            return
          }
        }

        /**
         * 提交 - 如果在智慧生活app中，则直接跳转到智慧生活App的订单列表； 其他app或者纯h5,跳转到H5自己的订单列表
         */
        const toNextPage = () => {
          let appData = JSON.parse(localStorage.getItem('appData')) || {}
          let { channel } = appData
          let userSource = getUserSource(channel)

          // 智慧生活APP内嵌H5场景
          if (userSource == USER_SOURCE.smartLife) {
            // 直接调回到app的订单列表
            smartOpenDeepLink('wsf://app/orderList?finish=1')
            return
          }

          // 跳以前H5自己的订单列表
          localStorage.removeItem('logistics')
          this.$router.push({
            path: '/backorderlist',
            query: {
              activedata: 3,
            },
          })
        }

        //  更改发货单
        if (this.serverDetail.waybillCode) {
          updateLogistics(this.params).then((res) => {
            if (res.code == 200) {
              toNextPage()
            }
          })
        } else {
          //  填写发货单
          fillTheLogistics(this.params).then((res) => {
            if (res.code == 200) {
              toNextPage()
            }
          })
        }
      },
      // 查询详情
      getDetail() {
        let param = {
          id: this.params.id,
        }
        queryBackOrderDetail(param).then((res) => {
          if (res.code == 200) {
            this.serverDetail = res.data
            if (this.serverDetail.waybillCode) {
              this.params = {
                waybillCode: this.serverDetail.waybillCode,
                logisCompanyName: this.serverDetail.logisCompanyName,
              }
            }
            if (localStorage.getItem('logistics')) {
              this.params.logisCompanyName = localStorage.getItem('logistics')
            }
          }
        })
      },
      back() {
        this.$router.back()
        localStorage.removeItem('logistics')
        sessionStorage.removeItem('waybillCode')
      },
    },
    beforeDestroy() {
      localStorage.removeItem('logistics')
    },
  }
</script>

<style lang="less" scoped>
  .boxwrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f6f6f6;
  }
  .scorll-content {
    flex: 1;
    overflow-y: scroll;
  }
  .bgcolor {
    margin: 10px;
    padding: 10px 12px;
    background-color: #fff;
    border-radius: 12px;
    font-size: 13px;
    color: #191919;
    h2 {
      height: 17px;
      font-size: 13px;
      font-weight: 600;
      color: #191919;
      line-height: 17px;
    }
    .van-cell {
      display: flex;
      align-items: center;
      padding: 0;
      line-height: 17px;
      padding: 10px 0;
      &:first-child {
        margin-top: 10px;
      }
      &::after {
        display: none;
      }
      /deep/ .van-field__label {
        font-size: 13px;
        color: #191919;
      }
      /deep/ .van-field__control {
        text-align: right;
        font-size: 11px;
        color: #191919;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
      /deep/ .van-field__right-icon {
        padding: 0;
        padding-left: 6px;
        margin: 0;
        .van-icon {
          width: 16px;
          height: 16px;
          img {
            transform: rotate(-90deg);
          }
          // &::before {
          //   background: url();
          // }
        }
      }
    }
    .tipsBox {
      display: flex;
      margin-top: 10px;
      font-size: 11px;
      color: #6e6e6e;
      line-height: 15px;
      img {
        flex-shrink: 0;
        margin-right: 6px;
        width: 14px;
        height: 14px;
      }
    }
  }
  .InvoiceGoodsBox {
    .goodsInfoBox {
      margin-top: 10px;
      p {
        display: flex;
        align-items: center;
        line-height: 17px;
        padding: 10px 0;
        span {
          flex: 1;
          text-align: right;
        }
      }
    }
    .goodsBox {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      img {
        width: 74px;
        height: 74px;
        background: #ebebeb;
        border-radius: 8px;
        margin-right: 8px;
      }
      .goodsInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 13px;
        width: 100%;
        line-height: 17px;
        font-weight: 600;
        .applyNum {
          font-weight: 400;
          color: #999;
          margin-top: 0.08rem;
        }
      }
    }
  }
  .footerBox {
    height: auto;
    padding: 4px 12px;
    padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
    box-sizing: content-box;
    color: #fff;
    font-size: 16px;
    font-weight: 600;

    .van-button__content {
      height: 40px;
      border-radius: 20px;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    }
    &.van-button--disabled {
      opacity: 1;
      color: #999;
      .van-button__content {
        background: #eee;
      }
    }
  }
  .padding-right-22 {
    padding-right: 22px !important;
  }
  .font-13 {
    /deep/ .van-field__control {
      font-size: 13px !important;
      &::-webkit-input-placeholder {
        font-size: 11px !important;
      }
    }
  }
</style>
