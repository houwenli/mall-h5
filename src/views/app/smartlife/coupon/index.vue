<template>
  <div class="wrap">
    <!-- 头部 -->
    <van-nav-bar :title="title" left-arrow placeholder @click-left="sharePro" class="topbox">
      <template #left>
        <img class="topbox-left" :src="smart" />
      </template>
    </van-nav-bar>
    <!-- 内容 -->
    <div class="smartcoupon">
      <!-- 加载页 -->
      <smartTransition v-if="isPageLoading" />
      <!-- 下拉加载 -->
      <van-pull-refresh v-model="isPageLoading" @refresh="reset">
        <!-- 列表 -->
        <van-list
          v-if="list && list.length != 0"
          v-model="isLoading"
          :finished="isFinished"
          :immediate-check="false"
          :offset="300"
          finished-text="我也是有底线的~"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="getList"
        >
          <!-- 列表 -->
          <list :list="list" @toIndex="toIndex" />
        </van-list>
        <!-- 缺省页 -->
        <smartTransition v-if="!isPageLoading && list && list.length == 0" :typeName="emptyMap[emptyType].type" :text="emptyMap[emptyType].text" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  // 公共组件
  import smartTransition from '../comm/smart-transition/smart-transition.vue'
  import { NavBar } from 'vant'
  // 内部组件
  import list from './comm/list.vue'
  // 公共方法
  import { deepClone } from '@/utils/utils'
  // 接口
  import { QueryUserCouponList } from '@/api/smart/coupon'
  export default {
    components: { [NavBar.name]: NavBar, smartTransition, list },
    data() {
      return {
        smart: `${this.$smartImg}/home/smart_arrow_back.png`,
        isLoading: false, // 是否正在加载(分页)
        isPageLoading: true, // 是否正在加载(主页)
        isFinished: false, // 是否全部加载完成
        error: false, //数据是否加载失败
        queryForm: {
          //页码配置
          pageNum: 0,
          pageSize: 10,
        },
        list: [], //优惠券列表
        total: 0, //优惠券总数
        emptyType: 1, //过度页类型 0 无网络 1 为空
        emptyMap: {
          0: {
            type: 'noNetwork',
            text: '暂无网络',
          },
          1: {
            type: 'noPreferential',
            text: '暂无优惠',
          },
        },
      }
    },
    computed: {
      title() {
        return `优惠券(${this.total || 0})`
      },
    },
    created() {
      this.reset()
    },
    methods: {
      // 数据初始化
      reset() {
        setTimeout(() => {
          this.isFinished = false
          this.isPageLoading = true
          this.isLoading = false
          this.error = false
          this.queryForm = {
            pageNum: 0,
            pageSize: 10,
          }
          this.list = []
          this.getList()
        }, 1000)
      },
      //获取优惠券列表
      async getList() {
        this.emptyType = 1
        this.error = false
        try {
          let res = await QueryUserCouponList(this.queryForm)
          if (res.code == 200) {
            // 处理数据
            let dealData = this.dealData(res.data)
            this.list = this.list.concat(dealData)
            this.total = res.total || 0
            this.queryForm.pageNum++
            this.isFinished = !(res.data.length === 10)
          } else {
            this.error = true
            if (this.queryForm.pageNum === 0) {
              this.emptyType = 0
            }
          }
        } catch (error) {
          this.error = true
          if (this.queryForm.pageNum === 0) {
            this.emptyType = 0
          }
        }
        this.isPageLoading = false
        this.isLoading = false
      },
      // 处理优惠券列表数据
      dealData(data) {
        if (!data || data.length == 0) return []
        let realData = deepClone(data)
        realData.forEach((item) => {
          item._condition = this.dealCondition(item) // 使用条件处理
          item._time = this.dealTime(item) // 时间格式处理
          item._faceValue = (item.faceValue * 100) / 10000 // 价格折扣处理
        })
        return realData
      },
      // 使用条件
      dealCondition(val) {
        let type = val.couponsType || ''
        if (!type) return ''
        // 1 满减  2 折扣  3立减
        let price = type == 1 ? val.amountLimitation : val.faceValue
        let text = ''
        switch (type) {
          case (1, 3):
            text = `满${(price * 100) / 10000}元可用`
            break
          case 2:
            text = `无门槛`
            break
          default:
            break
        }
        return text
      },
      // 时间格式处理
      dealTime(val) {
        let start = val.effectiveStartTime || ''
        let end = val.effectiveEndTime || ''
        if (!val || !start || !end) return ''
        return start.split(' ')[0].replaceAll('-', '.') + '-' + end.split(' ')[0].replaceAll('-', '.')
      },
      // 页面跳转
      toIndex(item) {
        if (item.goodsSource == 4) {
          this.$router.push({ path: '/motorCar/detail', query: { skuId: item.skuId, storeId: item.storeId } })
        } else {
          this.$router.push({ path: '/spudetail', query: { id: item.skuId, sourceType: 1, spuId: item.spuId } })
        }
      },
      //判别手机类型调用APP方法
      sharePro() {
        if (window.ws) {
          //安卓
          window.ws.finishActivity()
        } else if (window.webkit) {
          //IOS
          window.webkit.messageHandlers.finishActivity.postMessage('')
        } else {
          console.log('页面跳转失败')
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .flex {
    display: flex;
    align-items: center;
  }
  .topbox {
    line-height: 44px;
    /deep/.van-nav-bar__title {
      font-size: 18px;
      color: #191919;
    }
    &-left {
      width: 24px;
      height: 24px;
    }
  }
  .wrap {
    background: #f6f6f6;
  }
  .smartcoupon {
    height: calc(~'100vh - 44px');
  }
  /deep/.transition {
    height: calc(~'100vh - 44px') !important;
  }
</style>
