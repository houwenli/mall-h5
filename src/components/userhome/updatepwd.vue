<template>
  <div style="min-height: 100vh; background-color:#fff">

    <van-nav-bar
      title="修改密码"
      left-arrow
      :border="false"
      @click-left="$router.back(-1)"
      style="margin-bottom: 1.84rem"
    >
      <template #left>
        <img style="width: 0.96rem;height: 0.96rem" src="../../assets/img/back_1@2x.png" alt="">
      </template>
    </van-nav-bar>
    <div style="padding-left: 0.36rem">
      <div class="hide-mobile-num">{{ hideMobile }}</div>
      <div class="line"></div>
      <van-field
        v-model="code"
        clearable
        type="number"
        style="padding: 0 24px;height: 48px"
        center
        placeholder="请输入收到的短信验证码"
        maxlength="6"
      >
        <template #button>
          <div class="get-code-btn" :style="{color: sendSms? '#999999' : '#E60113'}"
               @click.stop="sendSmsCode">{{ sendSms ? leftTime(countdown) : '获取验证码' }}
          </div>
        </template>
      </van-field>

      <div class="line"></div>
      <van-field
        center
        style="padding: 0 24px;height: 48px"
        :border="false"
        v-model="password"
        placeholder="输入新密码"
        type="password"
        :min="6"
        :max="20"
      />
      <div class="line"></div>
      <div class="mobile-password-tips">必须由6-20字母、数字、下划线组成，至少包含两种</div>
      <div style="padding: 0 24px">
        <van-button color="#E60113" :disabled="code.length !== 6 || !sendSms || password.length < 6 || password.length > 20" style="width: 100%;border-radius: 25px;height: 50px" @click="updatePassword">确认</van-button>
      </div>
    </div>


  </div>
</template>

<script>
import {Group, Popup, XButton, XHeader, XInput} from 'vux'
import {checkPassword} from '@/utils/validate'
import {queryCustomerPersonalInfo} from '@/api/personalinfo'
import {sendSmsCode, updatePassword} from '@/api/updatepwd';

export default {
  components: {XHeader, Group, XInput, XButton, Popup},
  data() {
    return {
      isProcess: false, // 接口是否处理中
      sendSms: false, // 是否已经发送验证码
      msg: '', // 错误提示
      countdown: 60, // 倒计时
      mobile: '', // 手机号码
      code: '', // 验证码
      password: '', // 密码
      hideMobile: '', // 展示的手机号码
      checkPassword: checkPassword // 验证密码
    }
  },
  created: function () {
    this.queryCustomerPersonalInfo();
  },
  methods: {
    keyboardDown() {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    },
    // 查询用户个人信息
    queryCustomerPersonalInfo() {
      let that = this;
      queryCustomerPersonalInfo().then(res => {
        if (res.flag) {
          that.mobile = res.data.mobile;
          that.hideMobile = res.data.mobile.substring(0, 3) + "****" + res.data.mobile.substring(7);
        }
      })
    },
    // 发送验证码
    sendSmsCode() {
      if (!this.mobile) {
        this.$toast('请输入正确的手机号码！');
        return;
      }
      if (this.sendSms) {
        this.$toast('验证码已发送,请稍后再试!');
        return
      }
      sendSmsCode(this.mobile).then(res => {
        if (res === 1) {
          this.$toast('发送失败，请重试！')
        } else if (res === 0) {
          this.settime()
        } else {
          this.$toast('未知错误！')
        }
      })
    },
    // 修改密码
    updatePassword() {
      if (this.isProcess) {
        return;
      }
      if (!this.mobile) {
        this.$toast('请输入正确的手机号码！');
        return;
      }
      if (!this.code || this.code.length < 6) {
        this.$toast('请输入验证码！');
        return;
      }
      let validate = this.checkPassword(this.password)
      if (!validate.valid) {
        if (!this.password) {
          this.$toast('请输入密码！');
        } else {
          this.$toast(validate.msg);
        }
        return;
      }
      let updatePwdBean = {
        mobile: this.mobile,
        code: this.code,
        password: this.password,
      };
      this.isProcess = true;
      updatePassword(updatePwdBean).then(res => {
        this.isProcess = false;
        if (res == -1) {
          this.$toast('参数错误！')
        } else if (res == -2) {
          this.$toast('验证码错误！')
        } else if (res == -3) {
          this.$toast('用户不匹配！')
        } else if (res == 0) {
          this.$toast('保存失败，请刷新后重试！')
        } else if (res == 1) {
          this.$toast('保存成功', 'middle');
          this.$router.go(-1);
        } else {
          this.$toast('未知错误！')
        }
      })
    },
    // 倒计时时间
    leftTime(time) {
      return '重新发送(' + time + 's)' ;
    },
    // 构造一个倒计时函数叫settime
    settime() {
      // 开始判断倒计时是否为0
      if (this.countdown === 0) {
        this.sendSms = false;
        this.countdown = 60;
        // 立即跳出settime函数，不再执行函数后边的步骤
        return;
      } else {
        this.sendSms = true;
        this.countdown--;
      }
      let _this = this;
      // 过1秒后执行倒计时函数
      setTimeout(function () {
        _this.settime()
      }, 1000)
    },
  }
}
</script>

<style scoped>
.hide-mobile-num {
  padding: 0.4rem 24px;
  overflow: hidden;
  color: #323233;
  font-size: 0.64rem;
  line-height: 0.96rem;
}

.get-code-btn {
  color: #E60113;
  font-size: 0.56rem;
  line-height: 0.96rem;
  padding: 0 0.8rem;
  margin: 0.08rem 0;
  border-left: 1px solid #DDDDDD;
}

.line {
  margin: 0 24px 20px;
  height: 0.02rem;
  background-color: #E0E0E0;
}
.mobile-password-tips {
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #BABABA;
  line-height: 22px;
}
</style>
