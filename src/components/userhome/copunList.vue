<template>
  <div class="my-copun-list-page">
    <navbartop :title="`优惠券(${(pageList && pageList.length) || 0})`" @clickBack="backLastPage"></navbartop>

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
        <p class="ticket" v-if="pageList.length > 0">{{ typeMap[1] }}({{ pageList.length }})</p>
        <div class="copun-item" v-for="(item, index) in pageList" :key="index">
          <div class="left">
            <img :src="item.url" alt="" class="sku-img" />
            <div class="item-center">
              <div class="name">
                <div class="tag-box">
                  <span>{{ typeMap[1] }}</span>
                </div>
                {{ item.commodityName }}
              </div>
              <p class="time" v-if="item.expireFlag == 1">
                <van-count-down :time="item.expireTimeSeconds * 1000" format="DD 天 HH 时 mm 分后过期">
                  <template slot-scope="timeData">
                    <div>
                      {{ timeData | tiemFilters }}
                    </div>
                  </template>
                </van-count-down>
              </p>
              <p class="time" v-else>{{ item.effectiveStartTime | filterTime }}至{{ item.effectiveEndTime | filterTime }}</p>
            </div>
          </div>
          <div :class="['right', item.receiveFlag == 1 && item.expireFlag != 1 ? 'right-exp' : '', item.expireFlag == 1 ? 'right-rec' : '']">
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
            <span class="to-use" @click="toUse(item)">去使用</span>
          </div>
        </div>
      </van-list>
      <!-- 缺省页 -->
      <div v-if="upFinished && pageList.length == 0" class="wrap">
        <img style="width: 160px; height: 160px" :src="`${$oss}/coupon/empty.png`" alt="" />
        <div class="news-text">暂无优惠券</div>
      </div>
    </van-pull-refresh>

    <div class="record">
      <span @click.stop="toUse('', 1)">使用记录</span>
    </div>
  </div>
</template>

<script>
  import { List, PullRefresh, CountDown } from 'vant'
  import navbartop from '@/components/commons/navBartop' // 导航栏
  import { queryUserCouponList } from '@/api/mycoupon'
  export default {
    data() {
      return {
        pageList: [],
        typeMap: { 1: '平台券' },
        listQuery: {
          pageNo: 0, // 当前页码
          pageSize: 15, // 每页显示记录数
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
      tiemFilters(date) {
        let { days, hours, minutes } = date
        if (days > 0) {
          return `${days}天${hours}时${minutes}分后过期`
        }

        return `${hours}时${minutes}分后过期`
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
      toUse(item, tag) {
        if (tag && tag == 1) {
          this.$router.push({ path: '/copunRecordList' })
          return
        }
        if (item.goodsSource == 4) {
          this.$router.push({ path: '/motorCar/detail', query: { skuId: item.skuId, storeId: item.storeId } })
        } else {
          this.$router.push({ path: '/spudetail', query: { id: item.skuId, sourceType: 1, spuId:item.spuId } })
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
      padding: 10px 12px 76px;
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
        background: linear-gradient(270deg, #f7f8ff 0%, #fffbfb 100%);
        border-radius: 8px;
        .sku-img {
          width: 64px;
          height: 64px;
          background: grey;
          border-radius: 8px;
        }
        .item-center {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding-left: 12px;
          .name {
            color: #000;
            font-size: 13px;
            font-weight: 600;
            /* 超出两行隐藏 */
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-height: 18px;
            .tag-box {
              display: inline-flex;
              align-items: center;
              height: 18px;
              vertical-align: bottom;
              span {
                display: flex;
                align-items: center;
                padding: 0 4px;
                padding-top: 1px;
                height: 15px;
                line-height: 0;
                box-sizing: content-box;
                background: #fbeef3;
                border-radius: 8px;
                font-size: 10px;
                color: #ff0a35;
                font-weight: 400;
              }
            }
          }
          .time {
            font-size: 11px;
            color: #666;
            margin-top: 4px;
            .van-count-down {
              color: #ff0a35;
              font-size: 11px;
            }
          }
        }
      }

      .right {
        position: relative;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        align-items: center;
        padding: 20px 0px 10px;
        width: 96px;
        height: 96px;
        border-radius: 8px;
        background: linear-gradient(270deg, #ffffff 0%, #fff1f3 100%);
        text-align: center;
        .price {
          display: flex;
          justify-content: center;
          align-items: baseline;
          height: 24px;
          line-height: 24px;
          font-weight: bold;
          font-size: 20px;
          color: #ff0a35;
          font-family: 'AlternateBold';
          > span {
            font-size: 20px;
            line-height: 24px;
          }
          .unit {
            font-size: 16px;
            line-height: 20px;
          }
        }

        .condition {
          font-size: 10px;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
        }
        .to-use {
          display: inline-block;
          margin-top: 8px;
          width: 60px;
          height: 20px;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 21px;
          background: linear-gradient(270deg, #ff6518 0%, #ff0a35 99%);
          border-radius: 12px;
        }
      }
      .right-rec::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0px;
        right: 0px;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/overdue.png');
        background-size: 40px;
      }
      .right-exp::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0px;
        right: 0px;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/new.png');
        background-size: 40px;
      }
    }
  }
  .record {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 56px;
    background: #ffffff;
    padding: 8px 12px;
    box-shadow: 0px -2px 10px 0px rgba(189, 194, 204, 0.2);
    span {
      display: inline-block;
      width: 100%;
      height: 40px;
      line-height: 37px;
      text-align: center;
      border-radius: 20px;
      border: 1px solid #c3c3c3;
      font-size: 16px;
      font-weight: 600;
      color: #191919;
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
