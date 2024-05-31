<template>
  <div class="boxwrapper">
    <van-nav-bar :title="isWx ? '登录/注册' : '登录/注册'" left-arrow @click-left="rightEvent" class="topbox" />
    <ul v-show="isWx" class="reg_tip">
      <li>您正在使用{{ siteName }}购物，请登录账号。登录后，您的商城账号将与微信账号关联，可使用快捷登录{{ siteName }}APP及PC网站。</li>
      <li>{{ siteName }}承诺保障您的手机号码及账号隐私安全。</li>
    </ul>

    <van-form validate-first @failed="onFailed" class="formbox">
      <!-- :rules="[{ validator, message: '请输入正确的手机号' }]" -->
      <!-- @blur="validatorPhone(mobile)" -->
      <van-field v-model="mobile" ref="mobile" clearable placeholder="请输入手机号" />

      <van-field v-model="code" ref="code" :maxlength="codeLength" center clearable placeholder="请输入收到的验证码" :disabled="showcode">
        <template #button>
          <van-button size="small" type="primary" @click="sendSmsCode" class="forgetpassword" :disabled="sendSms">
            <span v-if="sendSms">{{ leftTime(countdown) }}</span>
            <span v-else :class="[codecolorshow ? 'redcolor' : '']">获取验证码</span>
          </van-button>
        </template>
      </van-field>
      <p class="errorinfo" v-if="phoneerror">{{ msg }}</p>
      <div style="margin: 30px 16px 20px" class="loginbox">
        <van-button round block type="danger" native-type="submit" @click="phonelogin" :disabled="disablednext">登录
        </van-button>
      </div>
    </van-form>
    <SecondConfirm :title="'点击返回将登录失败，确认返回？'" :cancleText="'取消'" :sureText="'确定'" :textshow="textshow"
      :dialogshow="dialogshow" @closeBack="dialogshow = false" @rightEvent="onClickLeft"></SecondConfirm>
    <!-- <div class="ortherbox">
      <span @click="tologin">账号密码登录</span>
      <span @click="toregister">新用户注册</span>
    </div> -->
  </div>
</template>

<script>
import { NavBar, Form, Field, Button, Toast } from 'vant'
import { checkPassword } from '@/utils/validate'
import { isWx } from '@/utils/utils'
import { setToken, removeToken } from '@/utils/token'
import { login, bindaccount, getcode, codelogin, getlogininfo, signInSignUpApp, getcodeSmart } from '@/api/login'
import { selectOneByCondition } from '@/api/personalinfo'
import SecondConfirm from '@/components/commons/SecondConfirm'

import { SIGNINTYPE, SMSCODETYPE } from '@/constants/userinfo'
export default {
  components: { [NavBar.name]: NavBar, [Form.name]: Form, [Field.name]: Field, [Button.name]: Button, [Toast.name]: Toast, SecondConfirm },
  data() {
    return {
      isWx: isWx(), // 判断是否是微信
      isProcess: false, // 接口是否处理中
      sendSms: false, // 是否允许发送验证码
      msg: '', // 错误提示
      backUrl: this.$route.query.url,
      siteName: '万顺福商城',
      countdown: 60, // 倒计时
      mobile: '', // 手机号码
      code: '', // 验证码
      password: '', // 密码
      checkPassword: checkPassword, // 验证密码
      errorPhone: false, // 手机号验证是否正确
      phoneerror: false, // 登录失败
      disablednext: true,
      showcode: true,
      codeLength: null, // 验证码长度
      codecolorshow: false,
      textshow: false,
      dialogshow: false,
    }
  },
  created: function () {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    if (this.isWx) {
      getlogininfo().then((res) => {
        this.handleResult(res)
      })
    }
  },
  watch: {
    code(val) {
      if (val.length == this.codeLength && !this.phoneerror) {
        this.disablednext = false
      } else this.disablednext = true
    },
    mobile(val) {
      let value = val.replace(/\s/g, '') //去除空格
      if (value.length == 11) this.codecolorshow = true
      else this.codecolorshow = false
    },
  },
  methods: {
    // 处理绑定或者登录结果
    handleResult(res) {
      let keyCode = res.code
      if (keyCode != 200) {
        this.loginerror = true
        this.msg = res.description || res.desc
        // this.showError(res.description || res.desc)
        return
      }
      if (!res.data) return
      setToken(res.data)
      // 如果有返回的url 就返回到url没有就返回到上一个页面
      console.log('this.backUrl------', this.backUrl)
      this.setWebFunny()

      // return
      if (this.backUrl) {
        console.log('*********************---', this.backUrl)
        if (localStorage.getItem('LOG888')) {
          this.$router.replace({ path: '/home' })
        } else {
          this.$router.go(-1)
        }

        // this.$router.replace({ path: this.backUrl })
      } else {
        //去掉，在微信中会重复打开页面
        // this.$router.push('/')
      }
      this.loginerror = false
      // -1 用户名或密码错误  -2 账号冻结  -3 账号锁定 1 成功  -4 验证码错误
    },
    rightEvent() {
      this.dialogshow = true
    },
    onFailed(errorInfo) { },
    // 发送验证码
    sendSmsCode() {
      let val = this.$refs.mobile.value
      if (!val) {
        this.phoneerror = true
        this.msg = '请输入手机号'
        return
      } else {
        let value = val.replace(/\s/g, '') //去除空格
        let regs = /^1(3|4|5|6|7|8|9)\d{9}$/
        if (!regs.test(value)) {
          console.log('手机号格式错误')
          this.msg = '手机号格式错误'
          this.phoneerror = true
          this.codecolorshow = false
          return false
        } else {
          this.checkMobileExist(val)
        }
      }
    },
    checkMobileExist(val) {
      let data = {
        phone: val,
        smsCodeType: SMSCODETYPE.signIn
      }
      getcodeSmart(data).then((res) => {
        console.log(res, '验证码')
        if (res === -1) {
          // this.showError('发送失败，请重试！')
          this.phoneerror = true
          this.showcode = true
          this.codecolorshow = false
          this.msg = '发送失败，请重试！'
        } else if (res.code === 200) {
          this.settime()
          this.phoneerror = false
          this.showcode = false
          // 重置验证码长度判断
          let data = res.data || {}
          this.codeLength = data.length || 6
        } else if (res.code === 100010) {
          // 验证码已发送
          this.phoneerror = false
          this.showcode = false
          Toast(res.description || res.desc)
        } else {
          // this.showError('未知错误！')
          this.phoneerror = true
          this.showcode = true
          this.codecolorshow = false
          this.msg = res.description || res.desc
        }
      })
    },
    // 登录
    async phonelogin() {
      //  this.$store.dispatch('user/getUserInfo')
      let appData
      try {
        appData = JSON.parse(localStorage.getItem('appData')) || {}
      } catch(e) {
        appData = {}
      }
      let data = {
        signInType: SIGNINTYPE.messAuth,
        smsCode: this.code,
        mobile: this.mobile,
        isWeChat: this.isWx ? 1 : 0,
        deviceId: appData.deviceId || ''
      }

      try {
        const res = await signInSignUpApp(data)
        if (res.code === 200) {
          let data = res.data || {}
          let token = data.token
          setToken(token) // 登录成功  设置保存token
          await this.$store.dispatch('user/getUserInfo') // 获取用户信息
        } else if (res.code == 2021) {  //查询到两个乘客ID，登录时跳异常提醒页
          this.$router.push('/abnormalRemind')
          return
        } else {
          return Toast(res.description || res.desc)
        }
        if (this.backUrl) {
          this.$router.replace(this.backUrl)
        } else {
          this.$router.replace('/')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 倒计时时间
    leftTime(time) {
      return '重新获取(' + time + ')' + '秒'
    },
    // 构造一个倒计时函数叫settime
    settime() {
      let _this = this
      // 开始判断倒计时是否为0
      if (_this.countdown === 0) {
        _this.sendSms = false
        _this.countdown = 60
        // 立即跳出settime函数，不再执行函数后边的步骤
        return
      } else {
        _this.sendSms = true
        _this.countdown--
        // 过1秒后执行倒计时函数
        setTimeout(function () {
          _this.settime()
        }, 1000)
      }
    },
    // 返回
    onClickLeft() {
      this.$router.go(-1)
    },
    tologin() {
      this.$router.push({ path: '/login' })
    },
    toregister() {
      this.$router.push({ path: '/register' })
    },

  },
}
</script>

<style lang="less" scoped>
.boxwrapper {
  background-color: #fff;
  position: absolute;
  height: 100%;
  width: 100%;

  /deep/ .van-hairline--bottom::after {
    border-bottom-width: 0;
  }

  .topbox {
    /deep/ .van-icon {
      color: #464646;
      font-size: 0.92rem;
    }

    /deep/ .van-nav-bar__title {
      color: #000;
      font-size: 0.68rem;
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }

  .formbox {
    margin-top: 1.8rem;
    padding: 0 0.32rem;
    position: relative;

    /deep/ .van-cell {
      padding: 0.52rem 0.64rem;
      font-size: 0.64rem;
    }

    /deep/ .van-field__control {
      color: #000;
    }

    .phoneshow {
      /deep/ .van-field__error-message {
        position: relative;
        bottom: -0.52rem;
      }
    }

    /deep/ .phoneshow:after {
      bottom: 0.96rem !important;
    }

    .forgetpassword {
      padding: 0px 0.76rem;
      color: #999999;
      font-size: 0.56rem;
      background-color: #fff;
      border: none;

      .redcolor {
        color: #e60113;
      }
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

    .errorinfo {
      position: absolute;
      color: #e60113;
      font-size: 0.56rem;
      padding-left: 0.64rem;
      margin-top: 0.12rem;
    }

    .loginbox {
      /deep/ .van-button--disabled {
        opacity: 0.2;
      }

      /deep/ .van-button--danger {
        background-color: #e60113;
        border: 1px solid #e60113;
      }
    }

    /deep/ .van-field__body {
      input::-webkit-input-placeholder {
        color: #999999 !important;
      }

      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999999 !important;
      }

      input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #999999 !important;
      }

      input:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #999999 !important;
      }
    }
  }

  .ortherbox {
    padding: 0 0.96rem;
    font-size: 0.56rem;
    display: flex;
    justify-content: space-between;

    span {
      color: #666666;
    }
  }
}
</style>
