<template>
  <div style="height: 100%">
    <!-- <x-header :left-options="{ backText: '' }">填写回寄信息</x-header> -->

    <group style="margin-top: 1.176em">
      <x-input title="物流公司" placeholder="请输入寄回物流公司名称" :max="45" required v-model="logisCompanyName" ref="logisCompanyName"></x-input>
      <x-input
        title="物流单号"
        placeholder="请输入物流单号"
        keyboard="number"
        :max="64"
        required
        v-model="waybillCode"
        ref="waybillCode"
        :is-type="chineseValidator"
      ></x-input>
    </group>

    <div class="weui-btn-area">
      <x-button type="primary" @click.native="fillTheLogistics">提交</x-button>
    </div>

    <popup v-model="warnTipsVisible" position="top" :show-mask="false">
      <div class="warn-toptips">{{ msg }}</div>
    </popup>
  </div>
</template>

<script>
import { XHeader, Group, XInput, XButton, Popup } from 'vux'

import { chineseValidator } from '@/utils/validate'

import { fillTheLogistics } from '@/api/backorderlist'

export default {
  components: { XHeader, Group, XInput, XButton, Popup },
  data() {
    return {
      isProcess: false, // 接口是否处理中
      warnTipsVisible: false, // 是否展示错误提示
      msg: '', // 错误提示
      logisCompanyName: '', // 物流公司名称
      waybillCode: '', // 物流单号
      chineseValidator: chineseValidator, // 校验中文
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
    },
  },
  methods: {
    fillTheLogistics() {
      let that = this
      if (!that.$refs.logisCompanyName.valid) {
        that.showError('请输入寄回物流公司名称！')
        return
      }
      if (!that.$refs.waybillCode.valid) {
        if (!that.waybillCode) {
          that.showError('请输入物流单号！')
        } else {
          that.showError(this.$refs.waybillCode.errors.format)
        }
        return
      }
      let LogisticsData = {
        id: that.$route.query.id,
        logisCompanyName: that.logisCompanyName,
        waybillCode: that.waybillCode,
      }
      if (that.isProcess) {
        return
      }
      that.isProcess = true
      fillTheLogistics(LogisticsData).then((res) => {
        that.isProcess = false
        if (res == 1) {
          that.$vux.toast.text('填写物流信息成功', 'middle')
          that.$router.go(-1)
        } else if (res == -2) {
          that.showError('填写物流信息失败，物流单号不能含有中文！')
        } else {
          that.showError('填写物流信息失败！')
        }
      })
    },
    // 错误提示
    showError(msg) {
      this.warnTipsVisible = true
      this.msg = msg
    },
  },
}
</script>
