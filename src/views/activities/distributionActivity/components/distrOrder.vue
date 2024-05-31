<template>
  <div class="wrap-content">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="success">
      <div v-if="list.length">
        <!-- 商品卡片 -->
        <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="我也是有底线的～" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="content" ref="backTop" @click="toDetail(item)">
            <!-- 业务线 -->
            <div class="content__top flex">
              <p class="content__top--type">
                <img :src="`${oss}/distribution/order_ecommerce_icon.png`" />
                <span class="name">电商</span>
              </p>
              <p class="content__top--receipt" :style="item.orderStatus == '1' ? 'color:00BB8A' : ''">
                {{ item.orderStatusStr }}
              </p>
            </div>
            <!-- 订单详情 -->
            <div class="content__con">
              <p class="content__con--item flex" v-for="(ite, idx) in conList" :key="idx">
                <span>{{ ite.name }}</span>
                <span v-if="ite.formate">{{ ite.formate(item[ite.val]) }}</span>
                <span v-else>{{ item[ite.val] }}</span>
              </p>
            </div>
            <!-- 佣金 -->
            <div class="content__bot">
              <div class="content__bot--comm">
                <span class="name">预估佣金</span>
                <p class="money">
                  <span class="unit">￥</span>
                  <span class="int">{{ item.commission | regFenToYuan | splitPriceYuan }}</span>
                  <span class="dec">.{{ item.commission | regFenToYuan | splitPriceFen }}</span>
                </p>
              </div>
            </div>
            <!-- <template #footer>
                <div class="share" @click="share(item)" v-if="isH5 != 3">查看收益</div>
              </template> -->
          </div>
        </van-list>
      </div>
      <div v-else class="noData">
        <img src="@/assets/img/authorizeManagement.png" style="width:10rem;height:10rem;display:block;margin: 0 auto;" alt="" />
        <p class="noData-p">暂无订单</p>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
  import { findPromoteOrders } from '@/api/activities/distributionActivity'
  import { regFenToYuan, getSplitPrice } from '@/utils/utils'
  export default {
    filters: {
      regFenToYuan(price) {
        return regFenToYuan(price)
      },

      splitPriceYuan(price) {
        return getSplitPrice(price).int
      },

      splitPriceFen(price) {
        return getSplitPrice(price).decimal
      },
    },

    data() {
      return {
        oss: this.$oss,
        defUrl: require('@/assets/img/shop_default.png'),
        success: '刷新成功',
        isH5: this.$store.state.userSource || 1,
        isLoading: false, // 是否正在加载中, 下拉刷新
        loading: false,
        finished: false,
        miniAppletUserName: process.env.POP_APPLET_ID, // 小程序原始Id
        list: [],
        params: {
          pageNo: 1,
          pageSize: 10,
        },
        conList: [
          { name: '订单号码', val: 'orderId' },
          { name: '订单金额', val: 'orderAmount', formate: regFenToYuan },
          { name: '实付金额', val: 'payAmount', formate: regFenToYuan },
        ],
      }
    },
    mounted() {
      setTimeout(this.getDisList, 100)
    },
    methods: {
      //上拉刷新
      onRefresh() {
        this.params.pageNo = 1
        this.loading = true
        setTimeout(() => {
          this.getDisList()
            .then((res) => {
              this.isLoading = false
            })
            .catch((err) => {
              this.isLoading = false
              this.success = '刷新失败'
            })
        }, 1000)
      },
      //下拉加载
      onLoad() {
        this.params.pageNo += 1
        findPromoteOrders(this.params)
          .then((res) => {
            // 加载状态结束
            let data = res.data || []
            
            this.list = this.list.concat(data)
         
            if (data.length < this.params.pageSize) {
              // 数据全部加载完成
              this.finished = true
            } 
            this.loading = false
          })
          .catch((err) => {
            // 加载状态结束
            this.loading = false
            console.log(err)
          })
        // }
      },
      toDetail(item) {
        // this.$router.push({
        //   path: '/distributionOrderDetail',
        //   query: {
        //     id: item.id,
        //     distributionOrderCode: item.distributionOrderCode,
        //   },
        // })
      },
      //查看收益
      share() {
        // 尝试拉起小程序
        if (window.ws) {
          this.toMiniApp(2)
        } else if (window.webkit) {
          this.toMiniApp(1)
        } else {
          console.log('APP拉起小程序失败')
        }
      },
      // 分享H5
      async toMiniApp(platform) {
        //判断是否为生成环境
        let miniprogramType
        if (process.env.NODE_ENV == 'production') {
          miniprogramType = 0
        } else {
          miniprogramType = 2
        }
        //APP分享方法得入参
        let shareData = {
          sharePlatformList: [
            {
              userName: this.miniAppletUserName, // 分销小程序原始ID
              path: `pages/index/index`, //小程序路径
              miniprogramType: miniprogramType, //小程序 —— 0=正式版，1=测试版，2=体验版
              platformTag: 7, //7 =启动小程序
            },
          ],
        }
        shareData = JSON.stringify(shareData)

        if (platform === 2) {
          try {
            window.ws.wsShare(shareData)
          } catch (err) {
            console.log('安卓分享失败', err)
          }
        } else if (platform === 1) {
          try {
            window.webkit.messageHandlers.wsShare.postMessage(shareData)
          } catch (err) {
            console.log('ios分享失败', err)
          }
        }
      },
      //商品列表
      getDisList() {
        return new Promise((resolve, reject) => {
          findPromoteOrders(this.params)
            .then((res) => {
              if (res.code == 200) {
                let data = res.data || []
                this.list = data
                resolve(res)
              } else {
                reject(res.msg)
              }
            })
            .catch((err) => {
              reject(err)
            })
            .finally(() => {
              this.finished = false
              this.loading = false
            })
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .wrap-content {
    background: linear-gradient(180deg, #ffffff 0%, #f6f6f6 100%) no-repeat;
    background-size: 100% 94px;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
    padding: 0 8px;
    padding-top: 4px;
    margin-top: 12px;
  }
  .content {
    padding: 0 8px 8px;
    border-radius: 12px;
    background: #ffffff;
    margin-top: 8px;
  }
  .content__top {
    padding: 0 2px 0 4px;
    height: 45px;
    &--type {
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin-left: 6px;
        font-size: 16px;
        font-weight: 600;
        color: #191919;
      }
    }
    &--receipt {
      font-size: 13px;
      font-weight: 400;
      color: #ff450c;
    }
  }
  .content__con {
    padding: 0 8px;
    &--item {
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 13px;
      font-weight: 400;
      color: #191919;
    }
  }
  .content__bot {
    border-top: 1px solid #eeeeee;
    &--comm {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 8px;
      height: 36px;
      line-height: 36px;
      .name {
        font-size: 13px;
        font-weight: 400;
        color: #191919;
      }
      .money {
        padding-left: 4px;
        display: flex;
        align-items: baseline;
      }
      .unit,
      .dec {
        font-size: 11px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #ff0a35;
      }
      .int {
        font-size: 20px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #ff0a35;
      }
    }
  }
  .noData {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(~'100vh - 196px');
    // background: #f5f5f5;
    img {
      width: 180px !important;
      height: 170px !important;
    }
    .noData-p {
      font-size: 15px;
      font-weight: 500;
      text-align: center;
      color: #999999;
    }
  }
  .van-pull-refresh {
    min-height: calc(~'100vh - 196px');
  }
</style>
