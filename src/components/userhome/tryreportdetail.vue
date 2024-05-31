<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">查看试用报告</x-header> -->

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="60" height="60" style="float: left" :src="tryReport.trySkuApply.sku.url">
          <ul style="float: left; margin: 8px 0 0 10px; line-height: normal">
            <li>试用满意度</li>
            <li>
              <rater v-model="tryReport.satisfaction"
                     star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                     active-color="#f23030" :min="1" disabled></rater>
            </li>
          </ul>
        </div>
      </cell>
      <cell :title="tryReport.advice !== '' ? tryReport.advice : ''">
        <span v-if="tryReport.advice === ''" slot="inline-desc">您没有填写心得及建议</span>
      </cell>
      <cell :title="tryReport.feel !== '' ? tryReport.feel : ''">
        <span v-if="tryReport.feel === ''" slot="inline-desc">您没有填写使用过程及感受</span>
      </cell>
      <cell style="padding: 0">
        <uploader
          slot="inline-desc"
          :readonly=true
          title="试用过程图片"
          v-model="imageList"
          limit="5"
        ></uploader>
      </cell>
    </group>

  </div>
</template>

<script>
  import {XHeader, XButton, Group, Cell, XTextarea, Rater} from 'vux'

  import Uploader from 'vux-uploader-component'

  import {queryTryReport} from '@/api/submittryreport';

  export default {
    components: {
      XHeader, XButton, Group, Cell, XTextarea, Uploader, Rater
    },
    data() {
      return {
        tryReport: {trySkuApply: {sku: {}}}, // 试用报告
        imageList: [], // 试用图片列表
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.queryTryReport(this.$route.query.tryApplyId)
    },
    methods: {
      keyboardDown() {
        window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
      },
      // 根据id查找试用报告详情
      queryTryReport(tryApplyId) {
        let that = this;
        queryTryReport(tryApplyId).then(res => {
          if (res.flag && res.data) {
            that.tryReport = res.data;
            // 获取试用图片列表
            if (that.tryReport.pics && that.tryReport.pics.split(',').length > 0) {
              that.imageList = that.tryReport.pics.split(',').map(image => {
                return {url: image};
              });
            }
          } else {
            that.$router.go(-1);
          }
        })
      },
    }
  }
</script>
