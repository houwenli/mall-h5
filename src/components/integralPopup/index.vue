<template>
  <div class="integral-popup" v-if="showUse">
    <slot :integralMoney="integralMoney" :openGoodFortuneValue="openGoodFortuneValue">
      <van-cell
        :title="blessTitle"
        :is-link="integral > 0"
        :value="integral > 0 ? blessValue : '无可用'"
        @click="openGoodFortuneValue"
        center
        :value-class="valueClass"
      />
    </slot>

    <van-popup v-model="goodFortunePopup" class="bless-popup" safe-area-inset-bottom :closeable="false">
      <div class="good-fortune-popup">
        <div class="title">
          <div class="fqz-title">
            福气值
            <span class="fqz">(剩余{{ integral }})</span>
          </div>
          <img
            class="close"
            src="@/assets/img/close-icon.png"
            @click="
              goodFortunePopup = false
              fqzFocus = false
            "
          />
        </div>
        <div class="container-fqz">
          <div class="fqz-use-title wsf-grey">抵扣福气值</div>
          <div class="input-wrapper" hover-class="none" hover-stop-propagation="false">
            <input
              ref="integralInput"
              :autofocus="fqzFocus"
              @focus="onFocus"
              v-model="useIntegral"
              class="good-fortune-input"
              type="tel"
              pattern="[0-9]*"
              @input="inputGoodFortuneData($event)"
              @blur="getFqzMoney()"
            />
            <span @click="setAllFqz" class="wsf-red">全部</span>
          </div>

          <div class="discount-amount">
            抵扣
            <span class="money">¥{{ tempIntegralMoney.toFixed(2) }}</span>
          </div>
        </div>
        <div class="confirm-btn-wrapper">
          <button class="confirm-btn" @click="goodFortuneConfirm()">确定</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { BUSINESS_TYPE } from '@/constants/order'

  import { getIntegralAccountAndCfg } from '@/api/smart/pay'
import { getToken } from '@/utils/token'

  export default {
    name: 'integral-popup',
    props: {
      /**
       * @type {BUSINESS_TYPE}
       */
      businessType: {
        validator(value) {
          return Object.values(BUSINESS_TYPE).includes(value)
        },
      },

      // 订单金额
      orderLastTotalPrice: {
        type: [String, Number],
        default: 0,
      },

      // 优惠券抵扣金额
      sumUserCouponDiscount: {
        type: [String, Number],
        default: 0,
      },

      // 是否总是显示
      alwaysShow: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        useIntegral: '', // 使用福气值数量
        tempIntegralMoney: 0, // 输入福气值时候 计算抵扣金额
        integralMoney: 0, // 福气值抵扣金额
        integral: 0, // 福气值数量
        configRate: 100000, //福气值比率 1元=xxx福气值

        goodFortunePopup: false,
        fqzFocus: false,
        configStatus: 2, // 抵扣配置状态:1-启用 2-禁用
      }
    },

    computed: {
      showUse() {
        return (this.alwaysShow || this.integral) && this.configStatus === 1
      },

      blessTitle({ integral }) {
        return `福气值(共${integral})`
      },

      blessValue({ integralMoney }) {
        if (integralMoney <= 0) {
          return '去使用'
        } else {
          return '-¥' + this.integralMoney.toFixed(2)
        }
      },

      valueClass({ integral, useIntegral }) {
        if (integral > 0 && useIntegral > 0) {
          return 'wsf-red'
        } else if (integral <= 0) {
          return 'no-use'
        } else {
          return ''
        }
      },

      // 金额单位是否为元， 不在集合内则为分
      amountUnitYuan({ businessType }) {
        const unitYuanMap = {
          [BUSINESS_TYPE.mall]: 'yuan',
        }

        return unitYuanMap[businessType] === 'yuan'
      },

      // 订单价格
      orderPrice() {
        return this.amountUnitYuan ? ~~(this.orderLastTotalPrice * 100).toPrecision(12) : this.orderLastTotalPrice
      },

      // 使用优惠券价格
      useCouponPrice() {
        return this.amountUnitYuan ? ~~(this.sumUserCouponDiscount * 100).toPrecision(12) : this.sumUserCouponDiscount
      },
    },

    mounted() {
      setTimeout(() => {
        getToken() && this.getConfig()
      }, 1000);
    },

    methods: {
      async getConfig() {
        try {
          const { code, data } = await getIntegralAccountAndCfg({
            serviceType: this.businessType,
          })

          if (code === 200) {
            this.integral = data.integralPointAvailable
            this.configRate = data.integralPoint / data.integralPrice
            this.configStatus = data.status
            this.$emit('update:integralCfgId', data.cfgId)
          }
        } catch (error) {
          console.log('error', error)
        }
      },

      onFocus() {
        this.fqzFocus = true

        document.activeElement.scrollIntoView(true)
      },

      openGoodFortuneValue() {
        if (this.integral <= 0) return

        this.goodFortunePopup = true

        this.fqzFocus = true

        this.$nextTick(() => {
          this.$refs.integralInput.focus()
        })
      },

      /** 只保留小数点后两位, 后面的小数全部舍弃 */
      formatePrice(price) {
        return Math.floor((price * 100).toPrecision(12)) / 100
      },

      /** 输入福气值计算抵扣金额*/
      getFqzMoney(type) {
        // this.fqzFocus = false
        const configRate = this.configRate
        // if (!useIntegral || !configRate) return
        let money = this.formatePrice(this.useIntegral / configRate)
        const orderPrice = this.formatePrice(this.orderPrice - this.useCouponPrice)

        // 如果输入的福气值不是configRate倍数，则向下取整抵扣  计算出使用福气值数量
        if (type !== 'input') {
          if (this.useIntegral % configRate !== 0) {
            this.useIntegral = ~~money * configRate
            money = this.formatePrice(this.useIntegral / configRate)
          }
          
          // 如果输入的福气值大于订单价格 则将福气值置为订单价格
          if (money > orderPrice) {
            this.useIntegral = Math.floor(this.formatePrice(orderPrice * configRate))
            money = this.formatePrice(this.useIntegral / configRate)
          }
        }

        this.tempIntegralMoney = this.useIntegral ? money / 100 : 0
      },

      // 福气值超界 将福气值置为可用最大
      checkIntegralNum(useIntegral) {
        this.getFqzMoney()

        // 如果超界  则修改使用福气值数量
        if (useIntegral > this.useIntegral) {
          this.goodFortuneConfirm()
        }
      },

      setAllFqz() {
        this.useIntegral = this.integral
        this.getFqzMoney()
      },

      /** 只保留整数 */
      checkNum(num) {
        num = num.replace(/[^\d]/g, '') // 清除“数字”和“.”以外的字符
        // num = num.replace(/^0*/, '') // 验证第一个字符是否为数字

        if (num != '') {
          num = parseInt(num) // 将字符串转换成数字
        }

        return num
      },

      /** 输入福气值 只允许输入整数 */
      inputGoodFortuneData(e) {
        let value = this.checkNum(e.target.value)

        if (value > this.integral) {
          value = this.integral
        }

        this.$nextTick(() => {
          console.log('value',value)
          this.useIntegral = value

          this.getFqzMoney('input')
        })
      },

      /** 确认福气值抵扣 */

      goodFortuneConfirm() {
        if (this.useIntegral || this.useIntegral === 0) {
          this.$nextTick(() => {
            this.integralMoney = this.tempIntegralMoney
            this.goodFortunePopup = false
            this.fqzFocus = false
            const money = this.amountUnitYuan ? this.integralMoney : ~~(this.integralMoney * 100).toPrecision(12)

            this.$emit('update:integralMoney', money)
            this.$emit('update:useIntegral', this.useIntegral)
            this.$emit('saveIntegral')
          })
        } else {
          this.$toast('请输入福气值')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .van-cell {
    padding: 10px 12px;
    font-size: 13px;
    line-height: 24px;
    .van-cell__right-icon {
      margin-left: 2px;
      width: 16px;
      font-size: 12px;
      height: auto;
    }
  }

  .integral-popup .no-use {
    color: #c3c3c3;
    padding-right: 18px;
  }
  .integral-popup .wsf-red {
    color: #ff0a35;
  }

  .wsf-grey {
    color: #999;
  }

  .point-content {
    padding: 20rpx 24rpx 18rpx;

    &.no-right {
      padding-right: 30px;
    }

    &.bill-item {
      padding: 0 12px;
    }

    .label {
      color: #191919;
    }

    .more-icon {
      width: 16px;
      height: 16px;
      margin-left: 2px;
    }

    .activity-label {
      color: #ff0a35;
      border: 1px solid #ff0a35;
      height: 14px;
      font-size: 10px;
      line-height: 14px;
      padding: 0 6px;
      border-radius: 4px;
      margin-left: 4px;
    }

    /deep/ .u-input__input {
      height: 14px;
      min-height: 14px !important;
      line-height: 14px;
      font-size: 11px;
    }

    /deep/ .u-input__right-icon {
      height: 28rpx;
    }
  }

  .bless-popup {
    padding: 0;
    border-radius: 10px;
    background: #f6f6f6;
    width: 90%;
  }
  .good-fortune-popup {
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 0;
      text-align: center;
      font-size: 15px;
      line-height: 18px;
      position: relative;

      .fqz-title {
        color: #000d1d;
        font-size: 16px;
      }

      .fqz {
        color: #444;
        font-size: 11px;
      }
    }

    .close {
      position: absolute;
      right: 12px;
      top: 13px;
      width: 27px;
      height: 20px;
    }
  }

  .container-fqz {
    background: #fff;
    border-radius: 12px 12px 0 0;
    padding: 36px 20px 20px 24px;
    font-size: 13px;

    .input-wrapper {
      display: flex;
      align-items: center;
      height: 38px;
      margin: 8px 0;
      border-bottom: 1px solid #eee;

      .good-fortune-input {
        height: 100%;
        background: #fff;
        font-size: 32px;
        text-align: left;
        flex: 1;
        display: block;
        overflow: hidden;
        caret-color: #ff450c;
      }
    }
  }

  .discount-amount {
    color: #444;
    font-size: 13px;
    .money {
      font-size: 13px;
      color: #ff0a35;
    }
  }

  .confirm-btn-wrapper {
    background: #fff;
    padding: 0 12px 8px;

    .confirm-btn {
      width: 100%;
      text-align: center;
      height: 40px;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 20px;
      font-size: 16px;
      color: #fff;
      line-height: 40px;
      font-weight: 600;
    }
  }
</style>
