<template>
  <div class="page-container">
    <div class="filter-bg">
      <div class="filter-panel">
        <div class="font-600">时间选择</div>
        <div>
          <van-dropdown-menu>
            <van-dropdown-item v-model="date" :options="dateList" @change='onChange'/>
          </van-dropdown-menu>
        </div>
      </div>
    </div>

    <div class="content-container">
      <p class="page-title">为了向您提供相应的产品及服务，并保障系统安全稳定运行，我们可能会收集您的个人信息。</p>

      <div class="card-panel">
        <div class="font-700 card-title">手机号码</div>
        <p>
          <span>使用目的：</span>
          <span>用于注册</span>
        </p>
        <p>
          <span>使用场景：</span>
          <span>注册和登录</span>
        </p>
        <p>
          <span>收集情况：</span>
          <span>已收集{{formModel.mobileCount || 0}}条</span>
        </p>
        <p>
          <span>收集内容：</span>
          <span>{{formModel.mobile || ''}}</span>
        </p>
      </div>
      <div class="card-panel">
        <div class="font-700 card-title">订单信息</div>
        <p>
          <span>使用目的：</span>
          <span>用于订单信息的生成和后续物流和用户使用</span>
        </p>
        <p>
          <span>使用场景：</span>
          <span>用户下单时</span>
        </p>
        <p>
          收集主体：万顺福
        </p>
        <p>
          收集情况：已收集{{formModel.orderCount || 0}}条
        </p>
        <p>
          收集内容：
          <span class="link-text" @click="toOrderList">点击查看</span>
        </p>
      </div>

      <div class="card-panel">
        <div class="font-700 card-title">交易信息</div>

        <p>使用目的：用于支付信息的展示</p>
        <p>使用场景：用户支付时</p>
        <p>收集主体：万顺福</p>
        <p>收集情况：已收集{{formModel.payCount || 0}}条</p>
        <p>
          收集内容：
          <span class="link-text" @click="toOrderList">点击查看</span>
        </p>
      </div>

      <div class="card-panel">
        <div class="font-700 card-title">物流信息</div>
        <p>使用目的：用于用户查看货物的物流进度</p>
        <p>使用场景：商家发货成功后</p>
        <p>收集主体：万顺福</p>
        <p>收集情况：已收集{{formModel.expressCount || 0}}条</p>
        <p>
          收集内容：
          <span class="link-text" @click="toOrderList">点击查看</span>
        </p>
      </div>
      <div class="card-panel">
        <div class="font-700 card-title">操作系统版本</div>
        <p>使用目的：用于兼容性判断和安全保障</p>
        <p>使用场景：使用app过程中</p>
        <p>收集主体：万顺福</p>
        <p>收集情况：已收集{{formModel.oscount || 0}}条</p>
        <p>收集内容：IOS，Android</p>
      </div>

      <!-- <div class="card-panel">
        <div class="font-700 card-title">设备型号</div>
        <p>使用目的：保证产品功能适配各种设备</p>
        <p>使用场景：使用app过程中</p>
        <p>收集主体：万顺福</p>
        <p>收集情况：已收集xx条</p>
        <p>收集内容：iPhone 14pro，iPhone13，小米10，红米note</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { DropdownMenu, DropdownItem } from 'vant';
  import { collectUserInfo4CheckApp } from '@/api/smart/personalInformationList.js'

  Vue.use(DropdownMenu)
  Vue.use(DropdownItem)

  export default {
    name: 'personalInformationList',
    data() {
      return {
        date: 'DAY_SEVEN',
        dateList: [
          {
            text: '最近7天',
            value: 'DAY_SEVEN'
          },
          {
            text: '最近一个月',
            value: 'MONTH_ONE'
          },
          {
            text: '最近三个月',
            value: 'MONTH_THREE'
          },
          {
            text: '最近一年',
            value: 'YEAR_ONE'
          },
          {
            text: '历史所有',
            value: 'FOREVER'
          }
        ],

        formModel: {
          // 物流信息收集条数
          expressCount: '',
          // 物流信息url
          expressUrl: '',
          // 用户手机
          mobile: '',
          // 手机信息收集条数
          mobileCount: '',
          // 订单信息收集条数
          orderCount: '',
          // 订单信息url
          orderUrl: '',
          oscount: '',
          // 交易信息收集条数
          payCount: '',
          // 交易信息url
          payUrl: '',
          // 用户id
          uid: ''
        }
      }
    },
    created() {
      this.collectUserInfo4CheckApp()
    },
    methods: {
      onChange() {
        this.collectUserInfo4CheckApp()
      },
      async collectUserInfo4CheckApp() {
        let appData = localStorage.getItem('appData')

        let data = {
          userId: '',
          dateType4LegalEnums: this.date
        }

        if (appData) {
          appData = JSON.parse(appData)
          data.userId = appData.userId
        }

        try {
          let res = await collectUserInfo4CheckApp(data)

          this.formModel = res.data
        } catch (error) {
          console.log(error)
        }
      },

      // 跳转订单列表
      toOrderList() {
        if (window.ws) {
          //安卓
          window.ws.openDeepLink('wsf://app/orderList')
        } else if (window.webkit) {
          //IOS
          window.webkit.messageHandlers.openDeepLink.postMessage('wsf://app/orderList')
        } else {
          console.log('页面跳转失败')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import './base.less';

  .page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .filter-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding-left: 16px;
    padding-right: 16px;

    /deep/ .van-dropdown-menu__bar {
      box-shadow: none;
    }
  }

  .filter-bg {
    padding-bottom: 12px;
    background: rgb(248, 245, 249);
  }

  .content-container {
    padding: 16px;
    flex: 1;
    overflow: auto;
  }

  .card-panel {
    margin-bottom: 16px;
    p {
      line-height: 1.75;
      font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
    }

    .card-title {
      margin-bottom: 8px;
    }
  }
  .page-title {
    font-size: 14px;
    padding-bottom: 16px;
  }
</style>
