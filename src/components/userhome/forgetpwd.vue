<template>
  <div class="boxwrapper">
    <van-nav-bar title="忘记密码" left-arrow @click-left="onClickLeft" class="topbox" />

    <van-form validate-first @failed="onFailed" class="formbox">
      <!-- :rules="[{ validator, message: '请输入正确的手机号' }]" -->
      <!-- @blur="validatorPhone(mobile)" -->
      <van-field v-model="mobile" ref="mobile" clearable placeholder="请输入手机号" />

      <van-field v-model="code" ref="code" maxlength="6" center clearable placeholder="请输入收到的验证码" :disabled="showcode">
        <template #button>
          <van-button size="small" type="primary" @click="sendSmsCode" :disabled="!sendSms" class="forgetpassword">
            <!-- {{ sendSms ? '获取验证码' : leftTime(countdown) }} -->
            <span v-if="!sendSms">{{ leftTime(countdown) }}</span>
            <span v-else :class="[codecolorshow ? 'redcolor' : '']">获取验证码</span>
          </van-button>
        </template>
      </van-field>
      <p class="errorinfo" v-if="phoneerror">{{ msg }}</p>
      <div style="margin: 30px 16px 20px;" class="loginbox">
        <van-button round block type="danger" native-type="submit" @click="confirmpassword" :disabled="disablednext">下一步</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  import { NavBar, Form, Field, Button } from 'vant'
  import { checkPassword } from '@/utils/validate'

  import { checkMobileExist } from '@/api/register'
  import { sendSmsCode, verificationCode } from '@/api/forgetpwd'

  export default {
    components: { [NavBar.name]: NavBar, [Form.name]: Form, [Field.name]: Field, [Button.name]: Button },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        sendSms: true, // 是否允许发送验证码
        msg: '', // 错误提示
        countdown: 60, // 倒计时
        mobile: '', // 手机号码
        code: '', // 验证码
        password: '', // 密码
        checkPassword: checkPassword, // 验证密码
        errorPhone: false, // 手机号验证是否正确
        phoneerror: false, // 登录失败
        disablednext: true,
        showcode: true,
        codecolorshow: false,
      }
    },
    created: function() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    watch: {
      code(val) {
        if (val.length == 6) {
          this.disablednext = false
        } else {
          this.disablednext = true
        }
      },
      mobile(val) {
        if (val.length == 11) this.codecolorshow = true
        else this.codecolorshow = false
      },
    },
    methods: {
      // validatorPhone(val) {
      //   let value = val.replace(/\s/g, '') //去除空格
      //   let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
      //   if (value.length > 0) {
      //     if (!regs.test(value)) {
      //       this.msg = '手机号格式错误'
      //       this.phoneerror = true
      //       return false
      //     } else {
      //       this.phoneerror = false
      //       // this.checkMobileExist()
      //     }
      //   } else {
      //     this.phoneerror = true
      //     this.msg = '请输入手机号'
      //     return false
      //   }
      // },
      onFailed(errorInfo) {},
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
            console.log('手机号正确')
            this.checkMobileExist(val)
          }
        }
      },
      checkMobileExist() {
        checkMobileExist(this.mobile).then((res) => {
          if (res < 1) {
            // this.showError('您的手机号尚未注册！')
            this.phoneerror = true
            this.showcode = true
            this.codecolorshow = false
            this.msg = '您的手机号尚未注册！'
          } else {
            sendSmsCode(this.mobile).then((res) => {
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
              } else if (res.code === 100010) {
                // 验证码已发送
                this.phoneerror = true
                this.showcode = false
              } else {
                // this.showError('未知错误！')
                this.phoneerror = true
                this.showcode = true
                this.codecolorshow = false
                this.msg = '未知错误！'
              }
            })
          }
        })
      },
      // 下一步
      confirmpassword() {
        let data = {
          code: this.code,
          mobilePhone: this.mobile,
        }
        verificationCode(data).then((res) => {
          if (res.code == 200) {
            this.$router.push({ path: '/confirmpassword', query: { mobile: this.mobile, code: this.code } })
          } else {
            this.disablednext = true
            this.msg = res.description
            this.phoneerror = true
          }
        })
      },
      // 倒计时时间
      leftTime(time) {
        return '重新获取(' + time + ')' + '秒'
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
        setTimeout(function() {
          _this.settime()
        }, 1000)
      },

      // 返回
      onClickLeft() {
        if (this.backUrl) {
          this.$router.push({ path: this.backUrl })
        } else {
          this.$router.go(-1)
        }
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
        color: #999;
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
      /deep/ .van-field__control {
        color: #000;
      }
      .loginbox {
        /deep/ .van-button--danger {
          background-color: #e60113;
          border: 1px solid #e60113;
        }
        /deep/ .van-button--disabled {
          opacity: 0.2;
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
  }
</style>
