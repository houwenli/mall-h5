<template>
  <div class="personal-setting">
    <van-nav-bar title="设置" left-arrow @click-left="backCustomerCenter" />
    <div class="setting-item">
      <van-cell-group style="border-raduis: 10px">
        <van-cell style="border-radius: 0 0 0.4rem 0.4rem" title="地址管理" is-link @click="$router.push({ path: '/customeraddresslist?toaddresstype=2' })" />
        <van-cell style="border-raduis: 10px" title="服务协议" is-link to="/app/smartlife/serviceagreement?jumpFrom=setting" />
        <van-cell title="隐私政策" is-link to="/app/smartlife/privacypolicy?jumpFrom=setting" />
        <!-- <van-cell title="支付设置" is-link to="updatepaypwd" /> -->
        <van-cell v-if="$store.state.userSource!=2" title="授权管理" is-link to="authorizeManagement" />
        <van-cell title="版本号" :value="version" />
      </van-cell-group>
    </div>
    <div class="setting-item">
      <van-cell-group>
        <van-cell title="退出登录" title-class="login-out" v-if="is_disTshow" @click="toLogOut" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton } from 'vux'
  import { Cell, CellGroup, NavBar } from 'vant'

  import { isWx } from '@/utils/utils'
  import { setToken, getToken, removeToken } from '@/utils/token'
  import { logout, unbindAccount, getVersion } from '@/api/personalinfo'

  export default {
    components: {
      XHeader,
      XButton,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [NavBar.name]: NavBar,
    },
    data() {
      return {
        isWx: isWx(), // 判断是否是微信
        headers: {
          Authorization: 'Bearer ' + getToken(),
        }, // 认证的头部
        // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
        platform: '',
        is_disTshow: true, // 分销展示退出按钮
        version: 'V1.0.0',
      }
    },
    created() {
      // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
      // this.platform = window.platform || ''
      this.platform = (window.ws && window.ws.wsShare) || (window.webkit && window.webkit.messageHandlers.wsShare)
      document.getElementsByTagName('body')[0].className = 'gray-bg'

      let is_distribution = sessionStorage.getItem('HASDISTRIBUTIONPOWER') // 字符串

      if (is_distribution == 'true') is_distribution = true
      else is_distribution = false

      if (this.platform || is_distribution) this.is_disTshow = false
      else this.is_disTshow = true
      // console.log(this.platform, 'this.platform')
      this.getVersion()
    },
    methods: {
      // 获取版本号
      getVersion() {
        getVersion().then((res) => {
          if (res.code == 200) {
            this.version = res.data
          }
        })
      },
      // 退出登录
      toLogOut() {
        if (this.isWx) {
          unbindAccount().then(() => {
            // window.isLogin = false
            removeToken()
            this.$router.push({ path: '/home' })
          })
        } else {
          // this.$http.get(`${process.env.LOGIN_API}/logout`).then((res) => {
          //   removeToken()
          //   this.$router.push({ path: '/home' })
          // })
          logout().then(() => {
            // window.isLogin = false
            localStorage.removeItem('LOG888')
            localStorage.setItem('LOGOUT', true)
            removeToken()
            this.$router.push({ path: '/home' })
          })
        }
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({ path: '/home' })
      },
    },
  }
</script>
<style lang="less" scoped>
  .personal-setting {
    height: 100%;
    .van-nav-bar__left .van-icon {
      color: #6d6d6d;
    }
    .setting-item {
      margin: 12px 0;
      .van-cell-group {
        border-radius: 10px;
        .van-cell {
          padding: 13px 18px;
          border-radius: 10px;
        }
      }
      .login-out {
        text-align: center;
      }
    }
  }
</style>
