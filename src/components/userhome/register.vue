<template>
  <div class="boxwrapper" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <van-nav-bar :title="isWx ? '注册' : '注册'" left-arrow @click-left="onClickLeft" class="topbox" />
    <ul v-show="isWx" class="reg_tip">
      <li>您正在使用{{ siteName }}购物，请补全账号信息或登录账号。</li>
      <li>补全或登录后，您的商城账号将与微信账号关联，可使用快捷登录{{ siteName }}APP及PC网站。</li>
      <li>{{ siteName }}承诺保障您的手机号码及账号隐私安全。</li>
    </ul>

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
      <van-field v-model="password" maxlength="20" ref="mobile" clearable placeholder="设置登录密码" :disabled="showcode" />
      <p class="passwordtips errorinfo" v-if="phoneerror">{{ msg }}</p>
      <p class="passwordtips" v-else>必须由6-20字母、数字、下划线组成，至少包含两种</p>
      <div style="margin: 20px 16px 20px" class="loginbox">
        <van-button round block type="danger" maxlength="20" native-type="submit" @click="confirm" :disabled="disabledconfirmshow">确认</van-button>
      </div>
    </van-form>
    <!-- <van-overlay :show="dialogshow" v-if="dialogshow" class="dialogbox">
      <div class="dialog">
        <p>点击"返回"将中断注册，确认返回？</p>
        <div class="buttonbox">
          <van-button round type="info" size="small" class="cancle" @click="dialogshow = false">取消</van-button>
          <van-button round type="info" size="small" class="sure" @click="sure">确认</van-button>
        </div>
      </div>
    </van-overlay> -->
    <SecondConfirm
      :title="'点击返回将中断注册，确认返回？'"
      :cancleText="'取消'"
      :sureText="'确定'"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
    ></SecondConfirm>
  </div>
</template>

<script>
  import { NavBar, Form, Field, Button, Dialog, Overlay, Toast } from 'vant'
  import { checkPassword } from '@/utils/validate'
  import { isWx } from '@/utils/utils'
  import { queryBaseInfoSet } from '@/api/baseinfoset'
  import { login, bindaccount } from '@/api/login'
  import { setToken, removeToken } from '@/utils/token'
  import { checkMobileExist, register } from '@/api/register'
  import { sendSmsCoderegister, verificationCode } from '@/api/forgetpwd'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import Cookies from 'js-cookie'
  import {customerDetail} from '@/api/home'

  export default {
    components: {
      [NavBar.name]: NavBar,
      [Form.name]: Form,
      [Field.name]: Field,
      [Button.name]: Button,
      [Dialog.name]: Dialog,
      [Overlay.name]: Overlay,
      [Toast.name]: Toast,
      SecondConfirm,
    },
    data() {
      return {
        isGoIndexShowCoupon: false,
        isWx: isWx(), // 判断是否是微信
        siteName: '万顺福商城',
        isProcess: false, // 接口是否处理中
        sendSms: true, // 是否允许发送验证码
        msg: '', // 错误提示
        backUrl: this.$route.query.url,
        countdown: 60, // 倒计时
        mobile: '', // 手机号码
        code: '', // 验证码
        password: '', // 密码
        recommendCode: '',
        checkPassword: checkPassword, // 验证密码
        phoneerror: false, // 错误信息提示
        disabledconfirmshow: true,
        showcode: true,
        // passwordshow: true,
        dialogshow: false,
        codecolorshow: false,
      }
    },
    created: function() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryBaseInfoSet()
      // if (this.isWx) {
      //   getlogininfo().then((res) => {
      //     this.handleResult(res)
      //   })
      // }
    },
    watch: {
      // 监听验证码
      code(val) {
        if (val.length == 6 && this.password.length >= 6) {
          this.disabledconfirmshow = false
        } else this.disabledconfirmshow = true
      },
      // 监听密码
      password(value) {
        if (value.length >= 6 && this.code.length == 6) {
          this.disabledconfirmshow = false
        } else this.disabledconfirmshow = true
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
      //       this.showcode = false
      //       // this.checkMobileExist()
      //     }
      //   } else {
      //     this.phoneerror = true
      //     this.msg = '请输入手机号'
      //     return false
      //   }
      // },
      onFailed(errorInfo) {},
      // 查询网址基础信息
      queryBaseInfoSet() {
        queryBaseInfoSet().then((res) => {
          if (res.flag) {
            this.siteName = res.data.siteName
            // this.siteRegisterProtocol = res.data.siteRegisterProtocol
          }
        })
      },
      // 发送验证码
      sendSmsCode() {
        let val = this.mobile
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
          if (res > 0) {
            this.phoneerror = true
            this.showcode = true
            this.codecolorshow = false
            this.msg = '您的手机号已经注册过！'
          } else {
            sendSmsCoderegister(this.mobile).then((res) => {
              if (res === -1) {
                this.phoneerror = true
                this.showcode = true
                this.codecolorshow = false
                this.msg = '您的手机号已经注册过！'
              } else if (res.code === 200 || res == 0) {
                this.settime()
                this.phoneerror = false
                this.showcode = false
              } else if (res == 1) {
                this.phoneerror = true
                this.showcode = true
                this.codecolorshow = false
                this.msg = '发送失败，请重试！'
              } else {
                this.phoneerror = true
                this.showcode = true
                this.codecolorshow = false
                this.msg = '未知错误！'
              }
            })
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
      // 确认
      confirm() {
        let value = this.password.replace(/\s/g, '') //去除空格
        let regs = /^(?!^[\d]+$)(?!^[_]+$)(?!^[a-zA-Z]+$)[\w-]{6,20}$/
        if (value.length > 0) {
          if (!regs.test(value)) {
            Toast('必须由6-20字母、数字、下划线组成，至少包含两种')
            return false
          } else {
            let registerData = {
              mobile: this.mobile,
              code: this.code,
              password: this.password,
              recommendCode: this.recommendCode,
            }
            register(registerData).then((res) => {
              this.isProcess = false
              if (res == -1) {
                this.msg = '手机验证码错误！'
                this.phoneerror = true
                this.disabledconfirmshow = true
                return false
              } else if (res == -2) {
                // Toast('参数错误！')
                this.msg = '参数错误！'
                this.phoneerror = true
                this.disabledconfirmshow = true
                return false
              } else if (res == -3) {
                this.msg = '手机号码已存在'
                this.phoneerror = true
                this.disabledconfirmshow = true
                return false
              } else if (res == 0) {
                this.msg = '注册失败，请刷新后重试！'
                this.phoneerror = true
                this.disabledconfirmshow = true
                return false
              } else if (res == -10) {
                // this.msg = '未知错误，请刷新后重试！'
                this.msg = '推荐人不存在'
                this.phoneerror = true
                this.disabledconfirmshow = true
                return false
              } else if (res == 1 || res == 2) {
                this.isGoIndexShowCoupon = res == 2 ? true : false
                if (!this.isWx) {
                  login({ username: this.mobile, password: this.password }).then((res) => {
                    this.handleResult(res)
                  })
                } else {
                  bindaccount({ username: this.mobile, password: this.password }).then((res) => {
                    this.handleResult(res)
                  })
                }
              } else {
                this.msg = '未知错误，请刷新后重试！'
                this.phoneerror = true
                this.disabledconfirmshow = true
              }
            })
          }
        }
      },
      // 处理绑定或者登录结果
      handleResult(res) {
        // -1 用户名或密码错误  -2 账号冻结  -3 账号锁定 1 成功  -4 验证码错误
        let keyCode = res.code
        if (keyCode == -1) {
          // this.showError('用户名或密码错误！')
          Toast('用户名或密码错误！')
          return false
        } else if (keyCode == -2) {
          // this.showError('账号被冻结！')
          Toast('账号被冻结！')
          return false
        } else if (keyCode == -3) {
          // this.showError('账号被锁定！')
          Toast('账号被锁定！')
          return false
        } else if (keyCode == -4) {
          // this.showError('验证码错误！')
          Toast('验证码错误！')
          return false
        } else if (keyCode == -9) {
          // this.showError('该账号已绑定其他微信号！')
          Toast('该账号已绑定其他微信号！')
          return false
        } else if (keyCode == 200) {
          // 设置成登录状态
          // window.isLogin = true;
          setToken(res.data) // 登录成功  设置保存token
          this.setWebFunny()
          Toast('注册登录成功')
          if (this.isGoIndexShowCoupon) {
            this.$router.push({ path: '/', query: { isShowCoupon: true } })
          } else {
            this.$router.push({ path: '/home' })
          }
        }
      },
      setWebFunny() {
        let channelName = Cookies.get('_wsf_channel_name')
        customerDetail().then((response) => {
          if (response.flag == 1) {
            window.localStorage.wmUserInfo = JSON.stringify({ userId: response.data.id, userTag: channelName, projectVersion: 'V1.8.0' })
            //覆盖未登录uid
            this.$store.commit('SET_NOTLOGINUID', response.data.id)
          }
        })
      },
      // 返回
      onClickLeft() {
        if (this.mobile || this.code || this.password) {
          this.dialogshow = true
        } else {
          if (this.backUrl) {
            this.$router.push({ path: this.backUrl })
          } else {
            this.$router.go(-1)
          }
        }
      },
      // 确认返回
      sure() {
        if (this.backUrl) {
          this.$router.push({ path: this.backUrl })
        } else {
          this.$router.go(-1)
        }
      },
      rightEvent() {
        if (this.backUrl) {
          this.$router.push({ path: this.backUrl })
        } else {
          this.$router.go(-1)
        }
      },
      // 取消返回关闭弹窗
      closeBack() {
        this.dialogshow = false
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
      .passwordtips {
        font-size: 0.56rem;
        color: #bababa;
        margin-top: 0.4rem;
        padding: 0 0.64rem;
      }
      .errorinfo {
        color: #e60113;
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
    .dialogbox {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .dialog {
        width: 12.64rem;
        height: 6.2rem;
        background: #ffffff;
        border-radius: 0.4rem;
        margin-top: -4rem;
        padding: 0px 1.12rem;
        p {
          font-size: 0.64rem;
          font-weight: bold;
          color: #000;
          text-align: center;
          width: 100%;
          padding-top: 1.72rem;
          font-family: PingFangSC-Medium, PingFang SC;
        }
        .buttonbox {
          margin-top: 1.04rem;
          display: flex;
          justify-content: space-around;
          .cancle {
            background-color: #fff;
            color: #e60113;
          }
          .sure {
            background-color: #e60113;
            color: #fff;
          }
          /deep/ .van-button--small {
            width: 4.16rem;
            height: 1.2rem;
            line-height: 1.2rem;
            border: unset;
            font-weight: bold;
            position: relative;
          }
          /deep/ .van-button:after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            border: 1px solid #e60113;
            border-radius: 999px;
            width: 200%;
            height: 200%;
            transform: scale(0.5, 0.5);
            box-sizing: border-box;
          }
        }
      }
    }
  }
</style>
