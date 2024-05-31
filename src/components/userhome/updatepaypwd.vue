<template>
  <div class="update-pay-pwd">
    <van-nav-bar title="设置支付密码" left-arrow fixed @click-left="backCustomerCenter" />
    <div class="update-pay-pwd-form">
      <van-cell-group>
        <van-field v-model="hideMobile" maxlength="11" placeholder="请输入手机号" disabled ref="mobile" />
        <div class="line"></div>
        <van-field
          v-model="code"
          type="number"
          maxlength="6"
          placeholder="请输入收到的验证码"
          :right-icon="code ? 'cross' : ''"
          @click-right-icon="clearInput('code')"
          ref="code"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="!sendSms"
              @click="sendSmsCode"
              :class="[sendSms ? 'fication-code-red' : 'fication-code-gray', 'get-verification-code']"
            >
              {{ sendSms ? '获取验证码' : leftTime(countdown) }}
            </van-button>
          </template>
        </van-field>
        <div class="line"></div>
        <van-field
          v-model="password"
          type="password"
          :right-icon="password ? 'cross' : ''"
          @click-right-icon="clearInput('password')"
          maxlength="20"
          placeholder="设置密码，6-20位字母+数字或符号组合"
          ref="password"
        />
        <div class="pwd-warn fication-code-red">
          <p v-show="isShowPwdWarn">密码格式错误</p>
        </div>
      </van-cell-group>
    </div>
    <div class="save-btn-area">
      <van-button round type="danger" :disabled="hideMobile === ''" @click.native="updatePayPassword">保存</van-button>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, NavBar, Field, Button, Toast } from 'vant'
import { checkPassword } from '@/utils/validate'

import { checkMobileExist } from '@/api/register'
import { queryCustomerPersonalInfo } from '@/api/personalinfo'
import { sendSmsCode, updatePayPassword } from '@/api/updatepaypwd'

export default {
  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast,
  },
  data() {
    return {
      isProcess: false, // 接口是否处理中
      sendSms: true, // 是否允许发送验证码
      countdown: 60, // 倒计时
      mobile: '', // 手机号码
      code: '', // 验证码
      password: '', // 密码
      hideMobile: '', // 展示的手机号码
      checkPassword: checkPassword, // 验证密码
      isShowPwdWarn: false, // 密码错误提示
    }
  },
  created: function () {
    // document.getElementsByTagName('body')[0].className = 'gray-bg';
    document.body.removeAttribute('class', 'gray-bg')
    this.queryCustomerPersonalInfo()
  },
  watch: {},
  methods: {
    keyboardDown() {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    },
    backCustomerCenter() {
      this.$router.push({ path: '/home' })
    },
    // 查询用户个人信息
    queryCustomerPersonalInfo() {
      let that = this
      queryCustomerPersonalInfo().then((res) => {
        if (res.flag) {
          that.mobile = res.data.mobile
          that.hideMobile = res.data.mobile.substring(0, 3) + '****' + res.data.mobile.substring(7)
        }
      })
    },
    clearInput(type) {
      this[type] = ''
    },
    // validPassword(val) {
    //   this.isShowPwdWarn = checkPassword(val).valid ? false : true;
    // },
    // 发送验证码
    sendSmsCode() {
      if (!this.mobile) {
        this.showError('请输入正确的手机号码！')
        return
      }
      // checkMobileExist(this.mobile).then(res => {
      //   if (res < 1) {
      //     this.showError('您的手机号尚未注册！');
      //   } else {
      sendSmsCode(this.mobile).then((res) => {
        if (res === 1) {
          this.showError('发送失败，请重试！')
        } else if (res === 0) {
          this.settime()
        } else {
          this.showError('未知错误！')
        }
      })
      // }
      // })
    },
    // 修改支付密码
    updatePayPassword() {
      if (!this.mobile) {
        this.showError('请输入正确的手机号码！')
        return
      }
      if (!checkPassword(this.password).valid) {
        this.isShowPwdWarn = true // 密码不合规 显示错误提示
        return
      }
      this.isShowPwdWarn = false
      // checkMobileExist(this.mobile).then(res => {
      //   if (res < 1) {
      //     this.showError('您的手机号尚未注册！');
      //   } else {
      if (!this.$refs.code.value) {
        this.showError('请输入验证码！')
        return
      }
      // if (!this.$refs.password.value) {
      //   if (!this.password) {
      //     this.showError('请输入密码！');
      //   } else {
      //     this.showError(this.$refs.password.errors.format);
      //   }
      //   return;
      // }
      let updatePayPwdBean = {
        mobile: this.mobile,
        code: this.code,
        password: this.password,
      }
      if (this.isProcess) {
        return
      }
      this.isProcess = true
      updatePayPassword(updatePayPwdBean).then((res) => {
        this.isProcess = false
        if (res == -1) {
          this.showError('参数错误！')
        } else if (res == -2) {
          this.showError('验证码错误！')
        } else if (res == -3) {
          this.showError('用户不匹配！')
        } else if (res == 0) {
          this.showError('保存失败，请刷新后重试！')
        } else if (res == 1) {
          this.$toast({
            message: '保存成功',
            position: 'top',
            type: 'success',
          })
          this.$router.go(-1)
        } else {
          this.showError('未知错误！')
        }
      })
      // }
      // })
    },
    // 倒计时时间
    leftTime(time) {
      return `重新获取(${time}s)`
    },
    // 构造一个倒计时函数叫settime
    settime() {
      // 开始判断倒计时是否为0
      if (this.countdown === 0) {
        this.sendSms = true
        this.countdown = 60
        // 立即跳出settime函数，不再执行函数后边的步骤
        return
      } else {
        this.sendSms = false
        this.countdown--
      }
      let _this = this
      // 过1秒后执行倒计时函数
      setTimeout(function () {
        _this.settime()
      }, 1000)
    },
    // 错误提示
    showError(msg) {
      this.$toast({
        message: msg,
        position: 'top',
      })
    },
  },
}
</script>
<style lang="less" scoped>
.update-pay-pwd {
  height: 100%;
  .van-nav-bar__left .van-icon {
    color: #6d6d6d;
  }
  .update-pay-pwd-form {
    margin-top: 1.84rem;
    padding-top: 1.8rem;
    .line {
      margin: 0 24px 20px;
      height: 0.02rem;
    }
    .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: none;
    }
    .fication-code-red {
      color: #e60113;
    }
    .fication-code-gray {
      color: #999;
    }
    .get-verification-code {
      padding: 0px 0.76rem;
      font-size: 0.56rem;
      background-color: #fff;
      border: none;
    }
    .pwd-warn {
      height: 30px;
      padding: 4px 16px;
      font-size: 14px;
    }
    .van-button__content {
      font-size: 14px;
    }
    /deep/ .van-button:before {
      background-color: unset;
    }
    /deep/ .van-button:after {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      // height: 200%;
      height: 50px;
      border-color: #dddddd;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      opacity: 0.9;
      content: ' ';
      border-left: 1px solid #dddddd;
      margin-top: 6px;
    }
  }
  .save-btn-area {
    height: 50px;
    margin: 0 15px;
    .van-button {
      width: 100%;
      height: 100%;
    }
  }
}
.van-toast--html,
.van-toast--text {
  padding: 15px 12px;
}
.van-toast--top {
  top: 24%;
}
</style>