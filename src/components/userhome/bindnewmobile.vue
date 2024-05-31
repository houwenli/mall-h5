<template>
  <div style="height: 100%">

    <!-- <x-header :left-options="{backText: ''}">绑定新手机</x-header> -->

    <group style="margin-top: 1.176em">
      <x-input title="手机号码" name="mobile" @on-blur="keyboardDown" placeholder="请输入11位手机号码" :max="11" keyboard="number"
               is-type="china-mobile" required v-model="mobile" ref="mobile"></x-input>
      <x-input title="验证码" keyboard="number" placeholder="请输入验证码" :max="6" @on-blur="keyboardDown" required
               v-model="code" ref="code">
        <x-button slot="right" :type="sendSms ? 'primary' : 'default'" :disabled="!sendSms" mini
                  @click.native="sendNewMobileCode" style="overflow: inherit">{{sendSms ? '获取验证码' :
          leftTime(countdown)}}
        </x-button>
      </x-input>
    </group>

    <div class="weui-btn-area">
      <x-button type="primary" @click.native="bindNewMobile">保存</x-button>
    </div>

    <popup v-model="warnTipsVisible" position="top" :show-mask="false">
      <div class="warn-toptips">{{msg}}</div>
    </popup>

  </div>
</template>

<script>
  import {XHeader, Group, XInput, XButton, Popup} from 'vux'

  import {checkMobileExist} from '@/api/register'
  import {sendNewMobileCode, bindNewMobile} from '@/api/bindnewmobile';

  export default {
    components: {XHeader, Group, XInput, XButton, Popup},
    data() {
      return {
        isProcess: false, // 接口是否处理中
        warnTipsVisible: false, // 是否展示错误提示
        sendSms: true, // 是否允许发送验证码
        msg: '', // 错误提示
        countdown: 60, // 倒计时
        mobile: '', // 手机号码
        code: '', // 验证码
      }
    },
    created: function () {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    watch: {
      warnTipsVisible(val) {
        if (val) {
          setTimeout(() => {
            this.warnTipsVisible = false
          }, 1000)
        }
      }
    },
    methods: {
      keyboardDown() {
        window.scrollTo(0,document.documentElement.scrollTop || document.body.scrollTop)
      },
      // 发送验证码
      sendNewMobileCode() {
        if (!this.$refs.mobile.valid) {
          this.showError('请输入正确的手机号码！');
          return;
        }
        checkMobileExist(this.mobile).then(res => {
          if (res > 0) {
            this.showError('您的手机号已经注册过！');
          } else {
            sendNewMobileCode(this.mobile).then(res => {
              if (res === 1) {
                this.showError('发送失败，请重试！')
              } else if (res === 0) {
                this.settime()
              } else {
                this.showError('未知错误！')
              }
            })
          }
        })
      },
      // 绑定新的手机号码
      bindNewMobile() {
        if (!this.$refs.mobile.valid) {
          this.showError('请输入正确的手机号码！');
          return;
        }
        checkMobileExist(this.mobile).then(res => {
          if (res > 0) {
            this.showError('您的手机号已经注册过！');
          } else {
            if (!this.$refs.code.valid) {
              this.showError('请输入验证码！');
              return;
            }
            let bindNewMobileRequest = {
              mobile: this.mobile,
              code: this.code,
            };
            if (this.isProcess) {
              return;
            }
            this.isProcess = true;
            bindNewMobile(bindNewMobileRequest).then(res => {
              this.isProcess = false;
              if (res == -1) {
                this.showError('参数错误！')
              } else if (res == -2) {
                this.showError('没有凭证！')
              } else if (res == -3) {
                this.showError('验证码错误！')
              } else if (res == -4) {
                this.showError('手机号已经注册过！')
              } else if (res == 1) {
                this.$vux.toast.text('保存成功', 'middle');
                this.toPersonalInfo();
              } else {
                this.showError('未知错误！')
              }
            })
          }
        })
      },
      // 倒计时时间
      leftTime(time) {
        return '重新发送(' + time + ')' + '秒';
      },
      // 构造一个倒计时函数叫settime
      settime() {
        // 开始判断倒计时是否为0
        if (this.countdown === 0) {
          this.sendSms = true;
          this.countdown = 60;
          // 立即跳出settime函数，不再执行函数后边的步骤
          return;
        } else {
          this.sendSms = false;
          this.countdown--;
        }
        let _this = this;
        // 过1秒后执行倒计时函数
        setTimeout(function () {
          _this.settime()
        }, 1000)
      },
      // 错误提示
      showError(msg) {
        this.warnTipsVisible = true;
        this.msg = msg;
      },
      // 跳转到个人信息页面
      toPersonalInfo() {
        this.$router.push({path: '/personalinfo'})
      },
    }
  }
</script>
