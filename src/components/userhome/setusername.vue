<template>
  <div style="height: 100%">

    <van-nav-bar
      title="用户名修改"
      left-arrow
      @click-left="$router.back(-1)"
      @click-right="updateNickName"
      :border="false"
    >
      <template #left>
        <img style="width: 0.96rem;height: 0.96rem" src="../../assets/img/back_1@2x.png" alt="">
      </template>
      <template #right>
        <div>确定</div>
      </template>
    </van-nav-bar>

    <van-field v-model="userName" placeholder="请输入昵称" :clearable="true" />

    <div class="set-tips">不超过20个字符，可由中英文、数字组成</div>
    <div class="set-tips">用户名仅供修改一次，后续不可修改，请谨慎操作 </div>

  </div>
</template>

<script>
import {Group, Popup, XButton, XHeader, XInput} from 'vux'

import {queryCustomerPersonalInfo, editCustomerUserName} from '@/api/personalinfo'

export default {
  components: {XHeader, Group, XInput, XButton, Popup},
  data() {
    return {
      isProcess: false, // 接口是否处理中
      warnTipsVisible: false, // 是否展示错误提示
      msg: '', // 错误提示
      userName: '', // 用户名
      customer: null // 个人信息
    }
  },
  created: function () {
    document.getElementsByTagName('body')[0].className = 'gray-bg';
    this.queryCustomerPersonalInfo();
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
    // 查询用户个人信息
    queryCustomerPersonalInfo() {
      let that = this;
      queryCustomerPersonalInfo().then(res => {
        if (res.flag) {
          that.customer = res.data;
          that.userName = res.data.userName;
        }
      })
    },
    // 更改昵称
    updateNickName() {
      let that = this;
      if (that.customer.userName == that.userName) {
        that.$router.go(-1);
        return;
      }
      if (that.isProcess) {
        return;
      }
      that.isProcess = true;
      editCustomerUserName({id: that.customer.id,userName: that.userName}).then(res => {
        that.customer.userName = that.userName;
        that.isProcess = false;
        if (res.data === 1 || res.code == 200) {
          that.$toast('保存成功')
          that.$router.go(-1);
        } else {
          that.$toast(res.description)
        }
      })
    },
    // 错误提示
    showError(msg) {
      this.warnTipsVisible = true;
      this.msg = msg;
    },
  }
}
</script>

<style scoped>
.set-tips {
  padding: 0 0.72rem;
  font-size: 0.48rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 0.72rem;
  margin-top: 0.48rem;
}
</style>
