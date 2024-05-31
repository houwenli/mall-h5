<template>
  <div class="boxwrapper">
    <van-nav-bar :title="isWx ? '登录' : '登录'" left-arrow @click-left="onClickLeft" class="topbox" />
    <ul v-show="isWx" class="reg_tip">
      <li>您正在使用{{ siteName }}购物，请登录账号。登录后，您的商城账号将与微信账号关联，可使用快捷登录{{ siteName }}APP及PC网站。</li>
      <li>{{ siteName }}承诺保障您的手机号码及账号隐私安全。</li>
    </ul>

    <van-form validate-first @failed="onFailed" class="formbox">
      <!-- 通过 pattern 进行正则校验 -->
      <!-- :rules="[{ validator, message: '请输入正确的手机号' }]" -->
      <van-field v-model="username" clearable placeholder="用户名/手机号" @blur="validator(username)" />
      <!-- 通过 validator 进行函数校验 -->
      <van-field v-model="password" :type="passwordText ? 'password' : 'text'" clearable placeholder="请输入密码" class="passwordbox">
        <template #button>
          <img src="../../assets/img/closeeye.png" class="eyebox" alt="" @click="lookpassword" v-if="passwordText" />
          <img src="../../assets/img/openeye.png" class="eyebox" alt="" @click="lookpassword" v-else />
          <van-button size="small" type="primary" @click="toforgetpassword" class="forgetpassword">忘记密码</van-button>
        </template>
      </van-field>
      <!-- <van-field v-model="password" clearable type="password" placeholder="请输入密码" class="passwordbox" />
      <span class="forgetpassword" @click="toforgetpassword">忘记密码</span> -->
      <p class="errorinfo" v-if="loginerror">{{ msg }}</p>
      <div style="margin: 30px 16px 20px" class="loginbox">
        <van-button round block type="danger" native-type="submit" @click.native="login()" v-if="this.username && this.password">登录</van-button>
        <van-button round block type="danger" native-type="submit" @click.native="login()" v-else disabled>登录</van-button>
      </div>
    </van-form>

    <div class="ortherbox">
      <span @click="tophonelogin">短信验证码登录</span>
      <span @click="toregister">新用户注册</span>
    </div>
  </div>
</template>

<script>
  import { NavBar, Form, Field, Button } from 'vant'
  import { isWx } from '@/utils/utils'
  import { setToken, removeToken } from '@/utils/token'
  import { login, bindaccount, getlogininfo } from '@/api/login'
  import Cookies from 'js-cookie'
  import {customerDetail} from '@/api/home'

  export default {
    components: { [NavBar.name]: NavBar, [Form.name]: Form, [Field.name]: Field, [Button.name]: Button },
    data() {
      return {
        isWx: isWx(), // 判断是否是微信
        username: '',
        password: '',
        msg: '', // 错误提示
        backUrl: this.$route.query.url ? this.$route.query.url : '',
        siteName: '万顺福商城',
        errorPhone: false, // 手机号验证是否正确
        loginerror: false, // 登录失败
        passwordText: true,
      }
    },
    created: function() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      if (this.isWx) {
        getlogininfo().then((res) => {
          this.handleResult(res)
        })
      }
    },
    mounted() {},
    watch: {
      warnTipsVisible(val) {
        if (val) {
          setTimeout(() => {
            this.warnTipsVisible = false
          }, 1000)
        }
      },
    },
    methods: {
      // 查看密码
      lookpassword() {
        this.passwordText = !this.passwordText
      },
      //校验手机号
      validator(val) {},
      onFailed(errorInfo) {},
      // 返回
      onClickLeft() {
        if (localStorage.getItem('LOGOUT')) {
          this.$router.replace({ path: '/home' })
          localStorage.removeItem('LOGOUT')
        } else {
          this.$router.go(-1)
        }
      },
      keyboardDown() {
        window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
      },
      login() {
        let loginFrom = {
          username: this.username,
          password: this.password,
        }
        // 微信进行绑定
        if (this.isWx) {
          bindaccount(loginFrom).then((res) => {
            this.handleResult(res)
          })
        } else {
          // 不是微信就登录
          // this.$http.post(`${process.env.LOGIN_API}/login`, { username: this.username, password: this.password }).then((res) => {
          //   this.handleResult(res)
          // })
          login(loginFrom).then((res) => {
            this.handleResult(res)
          })
        }
      },
      // 处理绑定或者登录结果
      handleResult(res) {
        let keyCode = res.code
        if (keyCode != 200) {
          this.loginerror = true
          this.msg = res.description
          // this.showError(res.description)
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
      // 错误提示
      showError(msg) {
        this.warnTipsVisible = true
        this.msg = msg
      },
      tophonelogin() {
        this.$router.push({ path: '/phonelogin' })
      },
      toregister() {
        this.$router.push({ path: '/register' })
      },
      toforgetpassword() {
        this.$router.push({ path: '/forgetpwd' })
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
      .passwordbox {
        display: inline-block;
        .eyebox {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          margin-top: -1px;
          margin-right: 20px;
        }
        /deep/ .van-icon-clear {
          padding-right: 16px;
        }
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
      .forgetpassword {
        padding: 0px 0.76rem;
        color: #999;
        font-size: 0.56rem;
        background-color: #fff;
        border: none;
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
