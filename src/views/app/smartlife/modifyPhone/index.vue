<template>
  <div class="modify-wrap">
    <div class="modify-userInfo">
      <img class="modify-userInfo-icon" :src="headPictureUrl" />
      <p class="modify-userInfo-title">修改手机号</p>
      <p class="modify-userInfo-info">
        <span>当前手机号:</span>
        <span class="modify-userInfo-phone" v-if="data.mobile">{{ currentMobile }}</span>
      </p>
    </div>
    <div class="modify-phoneInfo">
      <van-field
        class="modify-phoneInfo-field"
        v-model.trim="data.newmobile"
        type="tel"
        label="新手机号"
        placeholder="请输入手机号"
        @input="onInput($event, 'newmobile')"
        maxlength="11"
      />
      <van-field
        class="modify-phoneInfo-field"
        v-model.trim="data.smsCode"
        type="digit"
        label="验证码"
        placeholder="请输入验证码"
        :maxlength="codeLength"
        :disabled='!codeLength'
        @input="onInput($event, 'smsCode')"
      >
        <template #button>
          <span v-if="sendSms" class="modify-phoneInfo-code" :class="smsCodeGrey ? '' : 'unable-code'" @click="smsCodeGrey ? startCode() : ''">获取验证码</span>
          <van-count-down v-else class="modify-phoneInfo-code unable-code" :time="countdown" format="重新发送(ss)秒" @finish="sendSms = !sendSms" />
        </template>
      </van-field>
      <p class="modify-phoneInfo-tip">*变更的手机号需未注册智慧生活账号。更换成功后，下次登录需使用变更后的手机号</p>
    </div>
    <div class="modify-footer">
      <van-button class="modify-footer-btn" round type="info" color="linear-gradient(90deg, #FF8011 0%, #FE3040 100%)" :disabled="mobileBtnShow" @click="!mobileBtnShow ? onReplace() : ''">
        更换手机号
      </van-button>
    </div>
  </div>
</template>

<script>
  // 公共组件
  import { CountDown, Toast } from 'vant'
  import navbartop from '@/components/commons/navBartop'
  // 公共方法
  import { isMobilePhone } from '@/utils/validate'
  import { debounce } from '@/utils/utils'
  // 公共数据
  import { SMSCODETYPE } from '@/constants/userinfo'
  // 接口
  import { send, modifyUserInfoApp, logoutApp, modifyUserInfo4CheckApp } from '@/api/smart/modifyPhone'
  export default {
    components: { navbartop, [CountDown.name]: CountDown, [Toast.name]: Toast },
    data() {
      return {
        data: {
          newmobile: '',
          mobile: '',
          smsCode: '',
        },
        headPictureUrl: `${this.$oss}/usercenter/edit.png`,
        countdown: 60 * 1000, // 倒计时
        sendSms: true, // 是否允许发送验证码
        appData: {}, //app公参
        codeLength: null, // 验证码长度
      }
    },
    computed: {
      // 当前手机号
      currentMobile() {
        return this.data.mobile.slice(0, 3) + '****' + this.data.mobile.substr(-4)
      },
      //验证码是否置灰
      smsCodeGrey() {
        if (!this.data.newmobile || this.data.newmobile.length != 11) {
          return false
        }
        return true
      },
      //修改手机号
      mobileBtnShow() {
        if (!this.data.newmobile || !this.data.smsCode) {
          return true
        }
        return false
      },
    },
    created() {
      let appData
      try {
        appData = JSON.parse(localStorage.getItem('appData')) || {}
      } catch (e) {
        appData = {}
      }
      this.appData = appData
      this.data.mobile = this.appData.mobile || ''
    },
    methods: {
      // 输入事件
      onInput(event, name) {
        this.data[name] = event.replace(/\D/g, '')
      },
      // 返回
      toBack() {
        this.$router.back()
      },
      // 校验手机号
      phoneCheck() {
        if (!this.data.newmobile) {
          Toast('请输入手机号')
          return false
        }
        if (!isMobilePhone(this.data.newmobile)) {
          Toast('您输入的手机号格式不对！')
          return false
        }
        if (this.data.newmobile == this.data.mobile) {
          Toast('该手机号已注册')
          return false
        }
        return true
      },
      //获取验证码之前-校验手机号是否已经被注册
      async startCode() {
        // 校验手机号
        if (!this.phoneCheck()) {
          return
        }
        let params = {
          newmobile: this.data.newmobile,
        }
        try {
          let res = await modifyUserInfo4CheckApp(params)
          if (res.code == 200) {
            if (res.data) {
              Toast(res.data)
            } else {
              this.getCode()
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      //获取验证码
      async getCode() {
        this.sendSms = false
        let params = {
          phone: this.data.newmobile,
          smsCodeType: SMSCODETYPE.modifPhone,
        }
        try {
          let res = await send(params)
          if (res.code != 200 && res.msg) {
            Toast(res.msg)
          }
          this.codeLength = res.data.length || 6
        } catch (error) {
          console.log(error)
        }
      },
      // 更换手机号
      onReplace: debounce(function() {
        // 校验手机号
        if (!this.phoneCheck()) {
          return
        }
        let appData
        try {
          appData = JSON.parse(localStorage.getItem('appData'))
        } catch (e) {
          appData = {}
        }
        let params = {
          ...this.data,
          deviceId: appData.deviceId || '',
        }
        modifyUserInfoApp(params)
          .then((res) => {
            if (res.code === 200) {
              Toast('更换手机号成功')
              setTimeout(() => {
                this.sendSms = true
                this.logoutApp()
              }, 1000)
            } else {
              if (res.msg) {
                Toast(res.msg)
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }),
      // 登出
      async logoutApp() {
        try {
          let res = await logoutApp({})
          if (res.code == 200) {
            this.sharePro()
          }
        } catch (error) {
          console.log(error)
        }
      },
      //判别手机类型调用APP方法
      sharePro() {
        if (window.ws) {
          //安卓 - 返回上一页面
          window.ws.finishActivity()
        } else if (window.webkit) {
          // IOS必须调用一下，告知新的手机号是多少-更新视图
          window.webkit.messageHandlers.changePhoneCallback.postMessage(this.data.newmobile)
          //IOS - 返回上一页面
          window.webkit.messageHandlers.finishActivity.postMessage('')
        } else {
          console.log('页面跳转失败')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .modify-wrap {
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
  }
  .modify-userInfo {
    padding: 28px 16px 16px;
    .modify-userInfo-icon {
      width: 68px;
      height: 68px;
    }
    .modify-userInfo-title {
      margin-top: 19px;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      line-height: 20px;
    }
    .modify-userInfo-info {
      margin-top: 11px;
      font-size: 13px;
      font-weight: 400;
      color: #191919;
      line-height: 17px;
      .modify-userInfo-phone {
        color: #ff450c;
      }
    }
  }
  .modify-phoneInfo {
    flex: 1;
    background: #ffffff;
    border-radius: 12px 12px 0 0;
    .modify-phoneInfo-field {
      border-radius: 12px 12px 0 0;
      padding: 16px 16px 0 16px;
      /deep/.van-field__label {
        width: auto;
        min-width: 64px;
        margin-right: 14px;
        font-size: 16px;
        font-weight: 600;
        color: #191919;
        line-height: 40px;
      }
      /deep/ .van-field__body {
        padding: 0 10px;
        height: 40px;
        background: #f6f6f6;
        border-radius: 10px;
      }
      &::after {
        display: none;
      }
    }
    .modify-phoneInfo-code {
      font-size: 13px;
      font-weight: 400;
      color: #ff450c;
      line-height: 17px;
    }
    .unable-code {
      color: #c3c3c3;
    }
    .modify-phoneInfo-tip {
      padding: 12px 16px 0;
      font-size: 11px;
      font-weight: 400;
      color: #c3c3c3;
      line-height: 15px;
    }
  }
  .modify-footer {
    position: fixed;
    bottom: 0;
    padding: 4px 12px;
    width: 100vw;
    background: #ffffff;
    box-shadow: 0px -2px 10px 0px rgba(189, 194, 204, 0.2);
    font-size: 12px;
    font-weight: 400;
    color: #c3c3c3;
    padding-bottom: 15px;
    // ios安全区域
    padding-bottom: calc(~'constant(safe-area-inset-bottom) + 15px'); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(~'env(safe-area-inset-bottom) + 15px'); /* 兼容 iOS >= 11.2 */
    .modify-footer-btn {
      width: 100%;
      height: 40px;
      font-size: 16px;
      font-weight: 500;
      color: #FFFFFF !important;
      line-height: 20px;
    }
  }
</style>
