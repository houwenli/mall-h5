<template>
  <div class="content">
    <div class="header">
      <img class="logo" src="@/assets/img/wsf_mall_logo.png" alt="" />
      <div class="title">
        <p class="ftc fts">欢迎使用</p>
        <h2 class="ftw">万顺福商城</h2>
      </div>
    </div>
    <div class="ftw fts tips">授权万顺福商城获取以下信息为您服务：</div>
    <div class="ftc search-tips">
      <i class="icon"></i>
      <span>查询到你的尾号{{ $route.query.phone.substr(-4) }}为万顺叫车用户，可授权绑定使用</span>
      <span class="tips ftw">万顺宝余额</span>
      购买商品
    </div>
    <div class="footer">
      <div class="agree" :class="{ shake: shake }">
        <span class="check" @click="agreeProtocol = !agreeProtocol" :class="{ agreeProtocol: agreeProtocol }"></span>
        <span>同意</span>
        <span class="protocol" @click="$router.push('userRegisterAreement')">《万顺福用户注册协议》</span>
        <span>和</span>
        <span class="protocol" @click="$router.push('privacyAgreement')">《用户隐私协》</span>
      </div>
      <van-button type="primary" block @click="agree">同意授权绑定</van-button>
      <div class="no-agree" v-if="!$route.query.isApp" @click="noAgree">不同意直接登录商城</div>
    </div>
  </div>
</template>
<script>
  import { addCustomerEmpowern , addCustomerEmpower } from '@/api/personalinfo'
  import { checkFreeSignIn } from '@/utils/hybrid'
  export default {
    name: 'userAuthorize',
    data() {
      return {
        agreeProtocol: false,
        shake: false,
        loading: false
      }
    },
    methods: {
      async agree() {
        this.shake = false
        if(this.loading) {
          return
        }
        this.loading = true
        if (!this.agreeProtocol) {
          this.shake = true
          setTimeout(() => {
            this.shake = false
          }, 800)
          return
        }
        let params = this.$route.query.isApp? { phone: this.$store.getters.userInfo.mobile || this.$route.query.phone, empowerType: 1, source: 2 ,passengerId:this.$route.query.passengerId}: { phone: this.$store.getters.userInfo.mobile || this.$route.query.phone, empowerType: 1, source: 2 }
        let data = this.$store.state.userSource == 2 ? await addCustomerEmpower(params) : await addCustomerEmpowern(params)
        this.loading = false
        if (data.code === 200) {
          this.$toast('授权成功')
          if(this.$store.state.userSource != 3) {
            await checkFreeSignIn()
          }
          // this.$router.replace('/')
          if(this.$route.query.backUrl) {
            this.$router.replace(this.$route.query.backUrl)
          }else {
            this.$router.replace('/')
          }
        }
      },
      noAgree() {
        this.$router.replace('/')
      },
    },
  }
</script>
<style lang="less" scoped>
  .content {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
    padding: 28px 20px 130px 15px;
    .ftw {
      font-weight: 500;
    }
    .fts {
      font-size: 16px;
      line-height: 22px;
    }
    .ftc {
      color: #666666;
    }
    .header {
      display: flex;
      .logo {
        width: 66px;
        height: 66px;
      }
      .title {
        margin-left: 7px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        h2 {
          color: #333;
          font-size: 24px;
          line-height: 33px;
        }
      }
    }
    .tips {
      margin-top: 33px;
      margin-bottom: 16px;
      padding-left: 9px;
      color: #000d1d;
    }
    .search-tips {
      padding-left: 9px;
      font-size: 13px;
      line-height: 24px;
      span {
        vertical-align: middle;
      }
      .icon {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        vertical-align: middle;
        background-color: #b4b7ba;
      }
    }
    .footer {
      position: absolute;
      bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 340px;
      span {
        vertical-align: middle;
      }
      .check {
        display: inline-block;
        width: 13px;
        height: 13px;
        border: 1px solid #e60113;
        border-radius: 50%;
      }
      .agree {
        font-size: 13px;
        color: #333;
      }
      .no-agree {
        font-size: 14px;
        line-height: 19px;
        color: #646a72;
      }
      .agreeProtocol {
        border: 0;
        background: url('../../assets/img/cat_Selected@2x.png') no-repeat;
        background-size: contain;
      }
      .protocol {
        color: rgb(73, 97, 225);
      }
      .van-button {
        margin: 15px 0 12px 0;
        width: 327px;
      }
    }
    .shake {
      animation: shake 800ms ease-in-out;
    }
    @keyframes shake {
      /* 垂直抖动，核心代码 */
      10%,
      90% {
        transform: translate3d(0, -1px, 0);
      }
      20%,
      80% {
        transform: translate3d(0, +2px, 0);
      }
      30%,
      70% {
        transform: translate3d(0, -4px, 0);
      }
      40%,
      60% {
        transform: translate3d(0, +4px, 0);
      }
      50% {
        transform: translate3d(0, -4px, 0);
      }
    }
  }
</style>
