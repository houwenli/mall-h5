<template>
  <div style="height: 100%">

    <van-nav-bar
      title="昵称修改"
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

    <van-field v-model="nickName" maxlength="20" placeholder="请输入昵称" :clearable="true" />


    <div class="set-tips">不超过20个字符,可由英文、数字、-和_组成</div>


    <popup v-model="warnTipsVisible" position="top" :show-mask="false">
      <div class="warn-toptips">错误提示</div>
    </popup>

  </div>
</template>

<script>
import {Group, Popup, XButton, XHeader, XInput} from 'vux'

import {queryCustomerPersonalInfo, updateCustomerPersonalInfo} from '@/api/personalinfo'

export default {
  components: {XHeader, Group, XInput, XButton, Popup},
  data() {
    return {
      isProcess: false, // 接口是否处理中
      warnTipsVisible: false, // 是否展示错误提示
      msg: '', // 错误提示
      nickName: '', // 昵称
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
          that.nickName = res.data.nickName;
        }
      })
    },
    // 更改昵称
    updateNickName() {
      let that = this;
      if (that.customer.nickName == that.nickName) {
        that.$router.go(-1);
        return;
      }
      if (that.isProcess) {
        return;
      }
      that.customer.nickName = that.nickName;
      that.isProcess = true;
      updateCustomerPersonalInfo(that.customer).then(res => {
        that.isProcess = false;
        if (res === 1) {
          that.$toast('保存成功', 'middle')
          that.$router.go(-1);
        } else {
          that.$toast('保存失败', 'middle')
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
