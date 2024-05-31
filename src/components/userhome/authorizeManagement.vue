<template>
  <div v-if="show">
    <van-nav-bar title="授权管理" left-arrow @click-left="backCustomerCenter" />
    <div class="authorize-content">

      <div class="authorize-img">
        <img class="log" src="@/assets/img/wsf_mall_logo.png" alt="" />
        <img class="icon-shouquan" src="@/assets/img/icon_shouquan.png" alt="" />
        <img class="log" src="@/assets/img/ws_jc_logo.png" alt="" />
      </div>
      <div class="authorize-info">
        您的
        <strong>万顺福账号{{ phone | phoneSubstr }}</strong>
        已绑定
        <strong>万顺叫车账号（{{ userPhone | phoneSubstr }}）</strong>
        ，用于跨端免登录以及万顺宝余额宝支付。
      </div>
      <p class="authorize-tips">
        以下信息从万顺叫车获得授权：
      </p>
      <div class="authorize-agree">
        <span>万顺宝余额支付</span>
        <van-switch :value="isAgree" @change="changeAgree" />
      </div>
      <van-dialog v-model="dialogshow" :show-confirm-button="false" get-container=".authorize-content">
        <div class="authorize-dialog">
          <div class="authorize-title">关闭开关后将无法使用万顺宝余额 支付，请您确认</div>
          <div class="authorize-button">
            <div class="authorize-button-sure" @click="sure">确认{{ isAgree ? '关闭' : '开启' }}</div>
            <div class="authorize-button-cancel" @click="dialogshow = false">我在想想</div>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
  <div class="no-authorize" v-else>
    <van-nav-bar title="授权管理" left-arrow @click-left="backCustomerCenter" v-if="$store.state.userSource === 3" />
    <div class="content">
      <img src="@/assets/img/authorizeManagement.png" alt="">
      <p class="tips">暂无授权应用</p>
    </div>
  </div>
</template>
<script>
import { selectOneByCondition, updateCustomerEmpower } from '@/api/personalinfo'
import { Dialog } from 'vant'
import phoneSubstr from '@/utils/phoneSubstr'
export default {
  name: 'authorizeManagement',
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  filters: {
    phoneSubstr: phoneSubstr.phoneSubstr,
  },
  data() {
    return {
      isAgree: false,
      dialogshow: false,
      customerId: '',
      phone: this.$store.getters.userInfo.mobile || '',
      userPhone: '',
      first: false,
      show: false
    }
  },
  created() {
    this.getAuthorize()
  },
  methods: {
    getAuthorize() {
      let { passengerId } = this.$store.getters.userInfo
      let params = {
        passengerId,
        phone: this.phone,
      }
      selectOneByCondition(params).then((res) => {
        if (res.code === 200) {
          let data = res.data
          if (data.passengerId && data.passengerPhone) {
            this.show = true
          }
          this.userPhone = data.passengerPhone || ''
          this.isAgree = data.passengerEmpowerStatus === 1
          this.customerId = data.customerId
        }
      })
    },
    async changeAgree(val) {
      if (!this.isAgree) {
        let params = {
          customerId: this.customerId,
          passengerEmpowerStatus: this.isAgree ? 0 : 1,
        }
        let res =
          (await updateCustomerEmpower(params).catch((err) => {
            this.dialogshow = false
          })) || {}
        if (res.code === 200) {
          this.isAgree = !this.isAgree
        }
      } else {
        this.dialogshow = true
      }

    },
    async sure() {
      let params = {
        customerId: this.customerId,
        passengerEmpowerStatus: this.isAgree ? 0 : 1,
      }
      let res =
        (await updateCustomerEmpower(params).catch((err) => {
          this.dialogshow = false
        })) || {}
      if (res.code === 200) {
        this.isAgree = !this.isAgree
      }
      this.dialogshow = false
    },
    backCustomerCenter() {
      this.$router.go(-1)
    }
  },
}
</script>
<style lang="less" scoped>


.authorize-content {
  padding: 15px 24px;

  .authorize-img {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .log {
      width: 78px;
      height: 78px;
    }

    .icon-shouquan {
      margin: 0 19px;
      width: 24px;
      height: 24px;
    }
  }

  .authorize-info {
    margin: 24px 0;
    color: #000d1d;
    font-size: 16px;
    line-height: 22px;
  }

  .authorize-tips {
    color: #666666;
    font-size: 13px;
    line-height: 24px;
  }

  .authorize-agree {
    padding: 16px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    color: #333333;
    font-size: 15px;
    background-color: #f7f7f7;
  }

  .van-dialog {
    width: 256px;
  }

  .authorize-dialog {
    .authorize-title {
      padding: 24px 14px 14px 14px;
      color: #000d1d;
      font-size: 14px;
      text-align: center;
    }

    .authorize-button {
      display: flex;
      border-top: 1px solid #eeeeee;

      .authorize-button-cancel,
      .authorize-button-sure {
        flex: 1;
        text-align: center;
        height: 50px;
        line-height: 50px;
        box-sizing: border-box;
        font-size: 18px;
        font-weight: 500;
      }

      .authorize-button-sure {
        border-right: 1px solid #eeeeee;
        color: #90969e;
      }

      .authorize-button-cancel {
        color: #093ee2;
      }
    }
  }

  /deep/ .van-dialog .van-dialog__footer {
    height: 0;
  }
}

.no-authorize {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #FAFAFB;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 180px;
      height: 180px;
    }
    .tips {
      margin-top: 10px;
      font-size: 15px;
      color: #999999;
    }
  }
}

/deep/ .van-nav-bar__left .van-icon {
  color: #6d6d6d;
}
</style>
