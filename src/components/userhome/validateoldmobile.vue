<template>
  <div style="min-height: 100vh; background-color: #fff" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <van-nav-bar :title="isChange ? '更换绑定手机号' : '绑定手机号'" left-arrow @click-left="$router.back(-1)" :border="false">
      <template #left>
        <img style="width: 0.96rem; height: 0.96rem" src="../../assets/img/back_1@2x.png" alt="" />
      </template>
    </van-nav-bar>
    <template v-if="!isChange">
      <div class="mobile-notice-bar">绑定后可提高账号安全性，下次还可以用该手机登录万顺福</div>
      <div class="mobile-bind-phone">{{ hideMobile }}</div>
      <div class="mobile-bind-tips">你已绑定手机</div>
      <div class="mobile-change-bind-btn">
        <van-button color="#E60113" style="width: 100%; border-radius: 25px; height: 50px" @click="isChange = true">更换绑定</van-button>
      </div>
    </template>
    <template v-else>
      <van-swipe ref="vanSwipe" style="height: 100%" :show-indicators="false" :loop="false" :touchable="false">
        <!--    校验绑定手机号    -->
        <van-swipe-item>
          <div class="mobile-get-bind-code">
            <div class="mobile-original-phone">
              {{ `原绑定手机号码： ${hideMobile}` }}
            </div>
            <div class="line"></div>
            <van-field v-model="code" clearable type="number" style="padding: 0 24px; height: 50px" center placeholder="请输入收到的短信验证码" maxlength="6">
              <template #button>
                <div class="get-code-btn" :style="{ color: sendSms ? '#999999' : '#E60113' }" @click.stop="sendOldMobileCode">
                  {{ sendSms ? leftTime(countdown) : '获取验证码' }}
                </div>
              </template>
            </van-field>

            <div class="line" style="margin-bottom: 30px"></div>
            <div class="mobile-change-bind-btn">
              <van-button
                color="#E60113"
                :disabled="code.length !== 6 || !sendSms"
                style="width: 100%; border-radius: 25px; height: 50px"
                @click="validateOldMobileCode"
              >
                下一步
              </van-button>
            </div>
            <div class="mobile-change-bind-tips">更换绑定后可使用新手机号登录万顺福</div>
          </div>
        </van-swipe-item>
        <!--    验证新手机    -->
        <van-swipe-item>
          <div class="mobile-get-bind-code">
            <van-field
              v-model="newMobile"
              clearable
              type="number"
              style="padding: 0 24px; height: 50px"
              center
              :border="false"
              placeholder="请输入新手机号"
              maxlength="11"
            ></van-field>
            <div class="line"></div>
            <van-field v-model="code" clearable type="number" style="padding: 0 24px; height: 50px" center placeholder="请输入收到的短信验证码" maxlength="6">
              <template #button>
                <div class="get-code-btn" :style="{ color: sendSms ? '#999999' : '#E60113' }" @click.stop="sendNewMobileCode">
                  {{ sendSms ? leftTime(countdown) : '获取验证码' }}
                </div>
              </template>
            </van-field>

            <div class="line" style="margin-bottom: 30px"></div>
            <div class="mobile-change-bind-btn">
              <van-button
                color="#E60113"
                :disabled="code.length !== 6 || !sendSms"
                style="width: 100%; border-radius: 25px; height: 50px"
                @click="bindNewMobile"
              >
                立即绑定
              </van-button>
            </div>
            <div class="mobile-change-bind-tips">更换绑定后可使用新手机号登录万顺福</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </template>

    <!--  二次确认弹窗  -->
    <!-- 二次确认 -->
    <SecondConfirm
      title="绑定成功"
      cancleText="知道了"
      :textshow="true"
      textp="您可使用此手机号登录当前万顺福账号"
      :dialogshow="dialogShow"
      :hideConfirmBtn="true"
      @closeBack="$router.back(-1)"
    ></SecondConfirm>
  </div>
</template>

<script>
import { queryCustomerPersonalInfo } from '@/api/personalinfo'
import { bindNewMobile, sendNewMobileCode, sendOldMobileCode, validateOldMobileCode } from '@/api/bindnewmobile'

import { checkMobileExist } from '@/api/register'

import SecondConfirm from '@/components/commons/SecondConfirm'

export default {
  components: {
    SecondConfirm,
  },
  data() {
    return {
      isProcess: false, // 接口是否处理中
      sendSms: false, // 是否已发送验证码
      msg: '', // 错误提示
      countdown: 60, // 倒计时
      mobile: '', // 手机号码
      code: '', // 验证码
      hideMobile: '', // 展示的手机号码
      isChange: false, // 是否修改手机号码
      newMobile: '', // 新手机号码
      dialogShow: false, // 是否显示确认弹窗
    }
  },
  created: function () {
    this.queryCustomerPersonalInfo()
  },
  methods: {
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
    // 发送验证码
    sendOldMobileCode() {
      if (!this.mobile) {
        this.$toast('请输入正确的手机号码！')
        return
      }
      if (this.sendSms) {
        this.$toast('请稍后再试')
        return
      }
      sendOldMobileCode(this.mobile).then((res) => {
        if (res === 1) {
          this.$toast('发送失败，请重试！')
        } else if (res === 0) {
          this.settime()
        } else {
          this.$toast('未知错误！')
        }
      })
    },
    // 发送新绑定手机的验证码
    sendNewMobileCode() {
      if (!this.newMobile) {
        this.$toast('请输入正确的手机号码！')
        return
      }
      checkMobileExist(this.newMobile).then((res) => {
        if (res > 0) {
          this.$toast('您的手机号已经注册过！')
        } else {
          sendNewMobileCode(this.newMobile).then((res) => {
            if (res === 1) {
              this.$toast('发送失败，请重试！')
            } else if (res === 0) {
              this.settime()
            } else {
              this.$toast('未知错误！')
            }
          })
        }
      })
    },
    // 验证旧手机
    validateOldMobileCode() {
      if (!this.code || this.code.length < 6) {
        this.$toast('请输入验证码！')
        return
      }
      if (this.isProcess) {
        return
      }
      this.isProcess = true
      validateOldMobileCode(this.code, this.mobile).then((res) => {
        this.isProcess = false
        if (res == -1) {
          this.$toast('验证码错误！')
        } else if (res == 0) {
          this.toBindNewMobile()
        } else {
          this.$toast('未知错误！')
        }
      })
    },
    // 绑定新的手机号码
    bindNewMobile() {
      if (!this.newMobile) {
        this.$toast('请输入正确的手机号码！')
        return
      }
      checkMobileExist(this.newMobile).then((res) => {
        if (res > 0) {
          this.$toast('您的手机号已经注册过！')
        } else {
          if (!this.code || this.code.length < 6) {
            this.$toast('请输入验证码！')
            return
          }
          let bindNewMobileRequest = {
            mobile: this.newMobile,
            code: this.code,
          }
          if (this.isProcess) {
            return
          }
          this.isProcess = true
          bindNewMobile(bindNewMobileRequest).then((res) => {
            this.isProcess = false
            if (res == -1) {
              this.$toast('参数错误！')
            } else if (res == -2) {
              this.$toast('没有凭证！')
            } else if (res == -3) {
              this.$toast('验证码错误！')
            } else if (res == -4) {
              this.$toast('手机号已经注册过！')
            } else if (res == 1) {
              // this.refs.vanSwipe.swipeTo(0,true)
              this.isChange = false
              this.queryCustomerPersonalInfo()
              this.dialogShow = true
            } else {
              this.$toast('未知错误！')
            }
          })
        }
      })
    },
    // 倒计时时间
    leftTime(time) {
      return '重新发送(' + time + 's)'
    },
    // 构造一个倒计时函数叫settime
    settime() {
      // 开始判断倒计时是否为0
      if (this.countdown === 0) {
        this.sendSms = false
        this.countdown = 60
        // 立即跳出settime函数，不再执行函数后边的步骤
        return
      } else {
        this.sendSms = true
        this.countdown--
      }
      let _this = this
      // 过1秒后执行倒计时函数
      setTimeout(function () {
        _this.settime()
      }, 1000)
    },
    // 跳转到绑定新手机号码页面
    toBindNewMobile() {
      this.sendSms = false
      this.countdown = 0
      this.code = ''
      this.$refs.vanSwipe.next()
    },
  },
}
</script>

<style lang="less" scoped>
.mobile-notice-bar {
  height: 38px;
  line-height: 38px;
  background-color: #eefbeb;
  color: #56ad3f;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 400;
  color: #56ad3f;
  margin-bottom: 80px;
}

.mobile-bind-phone {
  font-size: 24px;
  font-weight: 400;
  color: #000000;
  line-height: 26px;
  text-align: center;
  margin-bottom: 12px;
}

.mobile-bind-tips {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 14px;
  text-align: center;
  margin-bottom: 32px;
}

.mobile-change-bind-btn {
  padding: 0 24px;
}

// 验证原有绑定手机号
.mobile-get-bind-code {
  padding-top: 60px;
  background-color: #fff;
  .mobile-original-phone {
    padding: 0 24px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
  }

  .line {
    margin: 0 24px 20px;
    height: 0.02rem;
    background-color: #e0e0e0;
  }

  .get-code-btn {
    font-size: 0.56rem;
    line-height: 0.96rem;
    padding: 0 0.8rem;
    margin: 0.08rem 0;
    border-left: 1px solid #dddddd;
  }

  .mobile-change-bind-tips {
    text-align: center;
    margin-top: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
  }
}
</style>
