<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">发表评价</x-header> -->

    <group style="margin-top: 10px">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="60" height="60" style="float: left" :src="storeInfo.avatarPicture">
          <ul style="float: left; margin: 8px 0 0 10px; line-height: normal">
            <li>{{storeInfo.storeName}}</li>
            <li>
              <rater v-model="storeInfo.aveScore"
                     star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                     active-color="#f23030" :min="1" disabled></rater>
            </li>
          </ul>
        </div>
      </cell>
      <cell>
        <div slot="title">门店地址：{{storeInfo.companyAddress?storeInfo.companyAddress:'暂无'}}</div>
      </cell>
      <cell>
        <div slot="title">联系电话：{{storeInfo.contactPhone?storeInfo.contactPhone:'暂无'}}</div>
      </cell>
      <cell>
        <div slot="title">营业时间：{{storeInfo.businessTime?storeInfo.businessTime:'暂无'}}</div>
      </cell>
      <cell>
        <div slot="title">公交线路：{{storeInfo.busRoutes?storeInfo.busRoutes:'暂无'}}</div>
      </cell>
    </group>

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <ul slot="title">
          <li>门店满意度</li>
          <li>
            <rater v-model="storeEvaluation.score"
                   star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                   active-color="#f23030" :min="1"></rater>
          </li>
        </ul>
      </cell>
      <x-textarea v-model="storeEvaluation.desc" :max="250" placeholder="请输入要评价的内容，不要超过250个字符。" :height="50"
                  @on-blur="keyboardDown"></x-textarea>
    </group>

    <div class="footer_btn">
      <x-button type="primary" @click.native="addStoreEvaluation">发表评价</x-button>
    </div>

  </div>
</template>

<script>
  import {XHeader, XButton, Group, Cell, XTextarea, Rater} from 'vux'

  import {queryStoreInfo, addStoreEvaluation} from '@/api/storeorderevaluate';

  export default {
    components: {
      XHeader, XButton, Group, Cell, XTextarea, Rater
    },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        storeInfo: {}, // 门店信息
        storeEvaluation: {
          orderCode: this.$route.query.orderCode, // 订单编号
          storeId: this.$route.query.storeId, // 门店id
          score: '5', // 门店评分
          desc: '' // 评价内容
        }
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.queryStoreInfo(this.$route.query.storeId)
    },
    methods: {
      keyboardDown() {
        window.scrollTo(0,document.documentElement.scrollTop || document.body.scrollTop)
      },
      // 查询门店信息详情
      queryStoreInfo(storeId) {
        let that = this;
        queryStoreInfo(storeId).then(res => {
          if (res.flag && res.data) {
            that.storeInfo = res.data;
          }
        })
      },
      // 新增门店评分
      addStoreEvaluation() {
        let that = this;
        if (that.isProcess) {
          return;
        }
        that.isProcess = true;
        addStoreEvaluation(that.storeEvaluation).then(res => {
          that.isProcess = false;
          if (res == 1) {
            that.$vux.toast.text('评价成功', 'middle');
            that.$router.go(-1);
          } else {
            that.$vux.toast.text('评价失败', 'middle');
          }
        })
      }
    }
  }
</script>

<style scoped>
.noTopBoderCells {
  margin-bottom: 70px;
}
</style>
