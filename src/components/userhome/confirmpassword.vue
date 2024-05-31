<template>
  <div class="boxwrapper">
    <van-nav-bar title="忘记密码" left-arrow @click-left="onClickLeft" class="topbox" />

    <van-form validate-first class="formbox">
      <!-- 通过 pattern 进行正则校验 -->
      <van-field
        v-model.trim="password"
        clearable
        placeholder="请输入新密码"
        maxlength="20"
        @blur="validatorpassword(password)"
        :class="{ phoneshow: errorPhone }"
      />
      <!-- 通过 validator 进行函数校验 -->
      <van-field v-model.trim="passwordsure" clearable placeholder="确认密码" :disabled="passwordshow" />
      <p class="passwordtips">必须由6-20字母、数字、下划线组成，至少包含两种</p>
      <div style="margin: 20px 16px 20px;" class="loginbox">
        <van-button round block type="danger" native-type="submit" @click.native="confirmpassword()" :disabled="sureconfirm">
          确认
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  import { NavBar, Form, Field, Button, Toast } from 'vant'
  import { login, bindaccount, getlogininfo } from '@/api/login'
  import { updatePassword } from '@/api/forgetpwd'

  export default {
    components: { [NavBar.name]: NavBar, [Form.name]: Form, [Field.name]: Field, [Button.name]: Button, [Toast.name]: Toast },
    data() {
      return {
        code: this.$route.query.code, // 验证码
        mobile: this.$route.query.mobile, // 手机号
        password: '',
        passwordsure: '',
        // warnTipsVisible: false, // 控制错误提示
        msg: '', // 错误提示
        backUrl: this.$route.query.url,
        errorPhone: false, // 手机号验证是否正确
        passwordshow: true,
        sureconfirm: true,
      }
    },
    created: function() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    mounted() {},
    watch: {
      password(value) {
        let val = value.replace(/\s/g, '') //去除空格
        if (val && this.passwordsure) {
          this.sureconfirm = false
        } else {
          this.sureconfirm = true
        }
      },
      passwordsure(value) {
        let val = value.replace(/\s/g, '') //去除空格
        if (val && this.password) {
          this.sureconfirm = false
        } else {
          this.sureconfirm = true
        }
      },
    },
    methods: {
      //校验密码
      validatorpassword(val) {
        let value = val.replace(/\s/g, '') //去除空格
        let regs = /^(?!^[\d]+$)(?!^[_]+$)(?!^[a-zA-Z]+$)[\w-]{6,20}$/
        if (value.length > 0) {
          if (!regs.test(value)) {
            Toast('必须由6-20字母、数字、下划线组成，至少包含两种')
            return false
          } else {
            this.passwordshow = false
          }
        } else {
          Toast('请输入密码')
          return false
        }
      },
      // 确认密码
      confirmpassword() {
        let data = {
          code: this.code,
          originCode: this.code,
          mobile: this.mobile,
          password: this.password,
        }
        if (this.passwordsure != this.password) {
          // this.sureconfirm = true
          Toast('输入的密码不一致，请重新输入')
          return false
        } else {
          updatePassword(data).then((res) => {
            if (res.code == 200) {
              Toast('设置成功')
              setTimeout(() => {
                this.toLogin()
              }, 700)
            } else {
              Toast(res.description)
              return false
            }
          })
        }
      },
      // 返回
      onClickLeft() {
        if (this.backUrl) {
          this.$router.push({ path: this.backUrl })
        } else {
          this.$router.go(-1)
        }
      },
      // 跳转到登录页面
      toLogin() {
        this.$router.push({ path: '/login', query: { url: '/home' } })
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
      /deep/ .van-cell {
        padding: 0.52rem 0.64rem;
        font-size: 0.64rem;
      }
      .phoneshow {
        /deep/ .van-field__error-message {
          position: relative;
          bottom: -0.52rem;
        }
        /deep/ .van-cell::after {
          bottom: 0.96rem;
        }
      }
      .passwordtips {
        font-size: 0.56rem;
        color: #bababa;
        margin-top: 0.72rem;
        padding: 0 0.64rem;
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
