<template>
  <div class="my-copun-list-page">
    <navbartop :title="`优惠券(${pageList.length})`" @clickBack="backLastPage"></navbartop>
    <van-tabs v-model="active" @change="upFinished = false">
      <van-tab :title="item" :name="index * 1" v-for="(item, index) in typeMap" :key="index"></van-tab>
    </van-tabs>
    <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh">
      <van-list
        v-if="pageList.length > 0"
        v-model="isUpLoading"
        :finished="upFinished"
        :immediate-check="false"
        :offset="300"
        finished-text="没有更多数据"
        @load="onLoadList"
      >
        <p class="ticket" v-if="pageList.length > 0">{{ typeMap[active] }}</p>
        <div class="copun-item" v-for="(item, index) in pageList" :key="index">
          <div class="left">
            <img :src="item.url" alt="" class="sku-img" />
            <div class="item-center">
              <p class="name">
                <span>{{statusMap[1]}}</span>
                {{ item.commodityName }}
              </p>
              <p class="time">{{ item.effectiveStartTime | filterTime }}至{{ item.effectiveEndTime | filterTime }}</p>
            </div>
          </div>
          <div :class="['right', item.status == 2 ? 'right-used' : 'right-expired']">
            <p class="price" v-if="item.couponsType == 1 || item.couponsType == 3">
              <span class="unit">￥</span>
              <span :class="{ scalefont: item.faceValue / 100 > 100 }">{{ item.faceValue / 100 }}</span>
            </p>
            <p class="price" v-else>
              <span>{{ item.faceValue / 100 }}折</span>
            </p>
            <p class="condition" v-if="item.couponsType == 1">满{{ item.amountLimitation / 100 }}元可用</p>
            <p class="condition" v-if="item.couponsType == 2">无门槛</p>
            <p class="condition" v-if="item.couponsType == 3">满{{ item.faceValue / 100 }}元可用</p>
          </div>
        </div>
      </van-list>
      <!-- 缺省页 -->
      <div v-if="upFinished && pageList.length == 0" class="wrap">
        <img style="width: 160px; height: 160px" :src="`${$oss}/coupon/empty.png`" alt="" />
        <div class="news-text">暂无优惠券</div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
  import { List, PullRefresh, CountDown } from 'vant'
  import navbartop from '@/components/commons/navBartop' // 导航栏
  import { queryUserCouponList } from '@/api/mycoupon'
  export default {
    data() {
      return {
        active: 2,
        pageList: [],
        typeMap: { 2: '已使用', 3: '已过期' },
        statusMap: { 1: '平台券' },
        listQuery: {
          pageNo: 0, // 当前页码
          pageSize: 15, // 每页显示记录数
          status: 2,
        },
        isDownLoading: false, //  否处于加载状态
        isUpLoading: false, //  否处于加载状态
        upFinished: false, //  	是否已加载完成
      }
    },
    filters: {
      filterTime(val) {
        return val.split(` `)[0].replace(/-/g, '.')
      },
    },
    watch: {
      active: {
        handler: function(newV, oldV) {
          if (oldV == undefined) return
          this.pageList = []
          this.listQuery = {
            pageNo: 0, // 当前页码
            pageSize: 15, // 每页显示记录数
            status: this.active,
          }
          this.getData()
        },
        immediate: true,
      },
    },
    components: { [List.name]: List, [PullRefresh.name]: PullRefresh, navbartop, [CountDown.name]: CountDown },
    mounted() {
      setTimeout(() => {
        this.getData()
      }, 1000)
    },
    methods: {
      onDownRefresh() {
        this.listQuery.pageNo = 0
        this.isUpLoading = false
        this.getData() // 加载数据
      },
      toUse(item) {
        if (item.goodsSource == 4) {
          this.$router.push({ path: '/motorCar/detail', query: { skuId: item.skuId, storeId: item.storeId } })
        } else {
          this.$router.push({ path: '/spudetail', query: { id: item.skuId, sourceType: 1 } })
        }
      },
      backLastPage() {
        this.$router.back()
      },
      // 滚动条与底部距离小于 offset 时触发
      onLoadList() {
        this.getData()
      },
      getData() {
        let params = { ...this.listQuery }
        queryUserCouponList(params)
          .then((res) => {
            this.isDownLoading = false
            this.isUpLoading = false
            if (res.data) {
              let list = res.data.list.map((item) => {
                return {
                  ...item,
                }
              })

              if (list == null || list.length === 0) {
                // 加载结束
                this.upFinished = true
              }
              if (list.length < this.listQuery.pageSize) {
                // 最后一页不足10条的情况
                this.upFinished = true
              }
              if (this.listQuery.pageNo == 0) {
                this.pageList = list
              } else {
                this.pageList = this.pageList.concat(list)
              }
              this.listQuery.pageNo++
            } else {
              this.upFinished = true
            }
          })
          .catch(() => {
            this.isUpLoading = false
            this.isDownLoading = false
            this.upFinished = true
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  /deep/.van-tabs__wrap {
    height: 38px;
    .van-tab {
      padding-bottom: 9px;
    }
    .van-tab__text {
      font-size: 13px;
      font-weight: 500;
      color: #191919;
    }
    .van-tabs__line {
      margin-bottom: 5px;
      width: 26px;
      height: 4px;
      background: linear-gradient(270deg, #ff5f2e 0%, #ff0a35 100%);
    }
  }
  .my-copun-list-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    .van-pull-refresh {
      flex: 1;
      overflow-y: auto;
    }
    .van-list {
      padding: 10px 12px 0;
      .ticket {
        font-size: 13px;
        color: #444444;
      }
    }
    .copun-item {
      display: flex;
      width: 100%;
      margin-top: 10px;
      background: #fff;
      border-radius: 8px;
      .left {
        display: flex;
        flex: 1;
        padding: 16px 20px 16px 8px;
        background: #ffffff;
        border-radius: 8px;
        .sku-img {
          width: 64px;
          height: 64px;
          background: grey;
          border-radius: 8px;
          // 图片灰色兼容各类浏览器
          filter: grayscale(100%);
          -webkit-filter: grayscale(100%);
          -moz-filter: grayscale(100%);
          -ms-filter: grayscale(100%);
          -o-filter: grayscale(100%);
          filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
          -webkit-filter: grayscale(1);
        }
        .item-center {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding-left: 12px;
          .name {
            color: #6e6e6e;
            font-size: 13px;
            font-weight: 600;
            /* 超出两行隐藏 */
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            span {
              display: inline-block;
              padding: 0 4px;
              height: 16px;
              line-height: 16px;
              background: #f6f6f6;
              border-radius: 8px;
              font-size: 10px;
              color: #6e6e6e;
              font-weight: 400;
            }
          }
          .time {
            font-size: 11px;
            color: #999999;
            margin-top: 4px;
          }
        }
      }

      .right {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 20px 0px 10px;
        width: 96px;
        height: 96px;
        border-radius: 8px;
        background: #ffffff;
        text-align: center;
        .price {
          display: flex;
          justify-content: center;
          align-items: baseline;
          font-weight: bold;
          font-size: 20px;
          color: #6e6e6e;
          font-family: 'AlternateBold';
          line-height: 24px;
          > span {
            font-size: 20px;
            line-height: 24px;
          }
          .unit {
            font-size: 16px;
          }
        }

        .condition {
          margin-top: 2px;
          font-size: 10px;
          font-weight: 400;
          color: #6e6e6e;
          line-height: 14px;
        }
      }
      .right-used{
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/used.png') top right no-repeat;
        background-size: 56px;
      }
      .right-expired{
         background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/expired.png') top right no-repeat;
        background-size: 56px;
      }
    }
  }
  .wrap {
    position: fixed;
    left: 50vw;
    top: 50vh;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .news-text {
    font-size: 13px;
    line-height: 17px;
    color: #444444;
    margin-top: 8px;
  }
</style>
