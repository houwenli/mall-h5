<template>
  <div style="height:100%;">
    <!-- <x-header :left-options="{backText: ''}">提交试用报告</x-header> -->

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="60" height="60" style="float: left" :src="sku.url" />
          <ul style="float: left; margin: 8px 0 0 10px; line-height: normal">
            <li>试用满意度</li>
            <li>
              <rater
                v-model="tryReport.satisfaction"
                star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                active-color="#f23030"
                :min="1"
              ></rater>
            </li>
          </ul>
        </div>
      </cell>
      <x-textarea
        v-model="tryReport.advice"
        :max="500"
        placeholder="商品是否给力？快分享你的心得及建议吧~"
        :height="50"
        @on-blur="keyboardDown"
      ></x-textarea>
      <x-textarea
        v-model="tryReport.feel"
        :max="500"
        placeholder="商品是否给力？快分享你的使用过程及感受吧~"
        :height="50"
        @on-blur="keyboardDown"
      ></x-textarea>
      <cell style="padding: 0">
        <uploader
          slot="inline-desc"
          title="添加试用过程图片(最多上传五张)"
          :url="uploadApi"
          :headers="headers"
          limit="5"
          name="image"
          v-model="choosePics"
          :multiple="true"
          :withCredentials="true"
          @on-success="onSuccess"
        ></uploader>
      </cell>
    </group>

    <div class="footer_btn">
      <x-button type="primary" @click.native="submitTryReport">提交试用报告</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Group, Cell, XTextarea, Rater } from 'vux'

import Uploader from 'vux-uploader-component'

import { queryTrySkuApplyById, submitTryReport } from '@/api/submittryreport'
import { setToken, getToken, removeToken } from '@/utils/token'

export default {
  components: {
    XHeader,
    XButton,
    Group,
    Cell,
    XTextarea,
    Uploader,
    Rater,
  },
  data() {
    return {
      uploadApi: process.env.UPLOAD_API, // 上传图片api
      headers: {
        Authorization: 'Bearer ' + getToken(),
      }, // 认证的头部
      isProcess: false, // 接口是否处理中
      sku: {}, // 单品信息
      tryReport: {
        tryApplyId: this.$route.query.tryApplyId, // 试用申请id
        satisfaction: '5', // 评分
        advice: '', // 心得及建议
        feel: '', // 试用感受
        pics: '', // 试用报告图片
      }, // 试用报告
      choosePics: [], // 上传图片列表
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.queryTrySkuApplyById(this.$route.query.tryApplyId)
  },
  methods: {
    keyboardDown() {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    },
    // 上传图片成功回调
    onSuccess(res, fileItem) {
      fileItem.picurl = res.url
    },
    // 根据id查找试用申请详情
    queryTrySkuApplyById(tryApplyId) {
      let that = this
      queryTrySkuApplyById(tryApplyId).then((res) => {
        if (res.flag && res.data) {
          that.sku = res.data.sku
        } else {
          that.$router.go(-1)
        }
      })
    },
    // 提交试用报告
    submitTryReport() {
      let that = this
      if (that.isProcess) {
        return
      }
      if (!that.tryReport.advice) {
        that.$vux.toast.text('请填写心得及建议', 'middle')
        return
      }
      if (that.tryReport.advice.length > 500) {
        that.$vux.toast.text('心得及建议字数不能超过500', 'middle')
        return
      }
      if (!that.tryReport.feel) {
        that.$vux.toast.text('请填写试用感受', 'middle')
        return
      }
      if (that.tryReport.feel.length > 500) {
        that.$vux.toast.text('试用感受字数不能超过500', 'middle')
        return
      }
      // 获取图片
      if (that.choosePics && that.choosePics.length > 0) {
        that.tryReport.pics = that.choosePics
          .map((pic) => pic.picurl)
          .join(',')
          .toString()
      }
      that.isProcess = true
      submitTryReport(that.tryReport).then((res) => {
        that.isProcess = false
        if (res == 1) {
          that.$vux.toast.text('提交试用报告成功', 'middle')
          that.$router.go(-1)
        } else if (res == -1) {
          that.$vux.toast.text('您无法提交此商品的试用报告', 'middle')
        } else if (res == -2) {
          that.$vux.toast.text('您还没有购买此商品', 'middle')
        } else if (res == -3) {
          that.$vux.toast.text('确认收货后才能提交试用报告', 'middle')
        } else if (res == -4) {
          that.$vux.toast.text('您已提交过试用报告', 'middle')
        } else {
          that.$vux.toast.text('提交试用报告失败', 'middle')
        }
      })
    },
  },
}
</script>
