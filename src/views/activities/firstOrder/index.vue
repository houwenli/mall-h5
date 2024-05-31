<template>
  <div>
    <div class="first-order-container" v-if="marketingInfo" :style="{ 'background-color': marketingInfo.marketingAttr.backgroundColor }">
      <div class="fixed-header">
        <div class="back" @click="handleClick">
          <img src="@/assets/img/back1@2x.png" alt="" />
        </div>
        <div class="title">{{ marketingInfo.marketingAttr && marketingInfo.marketingAttr.label }}</div>
        <div class="more"></div>
      </div>
      <div class="activity-img">
        <img :src="marketingInfo.marketingAttr.advertPic" alt="" />
        <!-- <img :src="bannerUrl" alt="" class="" /> -->
        <div class="rule-dialog" @click="show = true" v-if="marketingInfo.marketingAttr.ruleDesc">规则</div>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="findList"
        :style="{ 'background-color': marketingInfo.marketingAttr.backgroundColor }"
      >
        <div class="activity-goods-list-second" v-if="marketingInfo.marketingAttr.layout == 1">
          <template v-for="(item, index) in shopList">
            <div class="activity-goods" @click="toDetails(item)" :key="index">
              <div class="goods-img">
                <van-image width="100%" height="100%" :src="`${item.url}?imageView2/1/w/171`" />
              </div>
              <div class="goods-info">
                <div class="goods-name">{{ item.name }}</div>
                <div class="goods-desc">{{ item.subTitle }}</div>

                <div class="goods-activity-type" :class="{ 'is-show': !isShowPriceLabel }">
                  {{ marketingInfo.marketingAttr && marketingInfo.marketingAttr.label }}
                </div>
                <div class="shop-info-price">
                  <div class="price-left">
                    <div>
                      <span class="price-symbol">¥</span>
                      <span class="price">
                        {{
                          formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
                            .toString()
                            .split('.')[0]
                        }}
                      </span>
                      <span style="color: #e60113; margin-left: -0.24rem">
                        .{{
                          formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
                            .toString()
                            .split('.')[1]
                            ? formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
                                .toString()
                                .split('.')[1]
                            : '00'
                        }}
                      </span>
                    </div>
                    <div class="oldPrice" v-if="isShowPriceLabel">¥{{ formatPrice(item.price) }}</div>
                  </div>
                  <div class="price-right">
                    <div class="buy-btn">立即抢购</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="activity-goods-list" v-else>
          <div class="guess-list">
            <template v-for="(item, index) in shopList">
              <div class="shop-card" @click="toDetails(item)" :key="index">
                <div class="shop-img" ref="shopImg">
                  <van-image width="100%" height="100%" :src="`${item.url}?imageView2/1/w/513`" />
                </div>
                <div class="shop-info">
                  <div>
                    <div class="shop-info-name">
                      {{ item.name }}
                    </div>
                    <div class="shop-info-desc" v-if="item.subTitle">
                      {{ item.subTitle }}
                    </div>
                    <div class="activity-type" :class="{ 'is-show': !isShowPriceLabel }">
                      {{ marketingInfo.marketingAttr && marketingInfo.marketingAttr.label }}
                    </div>
                  </div>
                  <div class="shop-info-price">
                    <div class="price-left">
                      <div>
                        <span class="price-symbol">¥</span>
                        <span class="price">
                          {{
                            formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
                              .toString()
                              .split('.')[0]
                          }}
                        </span>
                        <span style="color: #e60113; margin-left: -0.24rem">
                          .{{
                            formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
                              .toString()
                              .split('.')[1]
                              ? formatPrice(isShowPriceLabel ? item.specialPrice : item.price)
                                  .toString()
                                  .split('.')[1]
                              : '00'
                          }}
                        </span>
                      </div>
                      <div class="oldPrice" v-if="isShowPriceLabel">¥{{ formatPrice(item.price) }}</div>
                    </div>
                    <div class="price-right">
                      <div class="buy-btn">立即抢购</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="noData" v-if="!shopList || shopList.length < 1">抱歉，暂无数据〜</div>
      </van-list>

      <van-popup v-model="show" round :close-on-click-overlay="false" closeable close-icon="close">
        <div class="regulation-content">
          <div class="title">活动规则</div>
          <div class="content" v-html="marketingInfo.marketingAttr.ruleDesc"></div>
        </div>
      </van-popup>
      <div class="share-btn" v-if="isShowShareIcon" @click="goShare">
        <span>分享</span>
        <i></i>
      </div>
    </div>
    <div v-else-if="isShowShareIcon || !marketingInfo" class="empty-page">
      <div class="empty-page-header" @click="$router.push({ path: '/' })">
        <img src="@/assets/img/back1@2x.png" alt="" width="24px" />
      </div>
      <img class="empty-page-img" :src="emptyImg" mode="" />
      <div class="empty-page-text">抱歉，活动已失效〜</div>
      <div class="empty-page-btn" @click="goIndex">看看其他</div>
    </div>

    <div class="reminderBoxWrapper" v-if="marketingInfo">
      <van-popup v-model="tipsShow" round :close-on-click-overlay="false">
        <div class="reminderBox">
          <div class="title">温馨提示</div>
          <div class="content">
            <p>活动将于 {{ marketingInfo.startTime }} 开始，</p>
            <p>敬请期待！</p>
          </div>
          <span @click="tipsShow = false" class="border_half">我知道了</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { debounce, formatPrice } from '@/utils/utils'
import emptyImg from '@/assets/img/cat_d@2x.png'
import { getSpuSpeicalAreaList, getMarketingById } from '@/api/activities/firstOrder'
import { visit } from '@/api/visit'
import { Toast, Dialog } from 'vant'
import Cookies from 'js-cookie'

export default {
  name: 'FirstOrder',
  components: { Toast, [Dialog.name]: Dialog, [Dialog.Component.name]: Dialog.Component },
  data() {
    return {
      emptyImg,
      isShowEmpty: true,
      miniAppletUserName: process.env.MINI_APPLET_ID, // 小程序原始Id
      formatPrice,
      imgHeight: 0, // 屏幕宽度
      loading: false,
      finished: false,
      isShowShareIcon: false,
      listQuery: {
        marketingId: '', // 营销id
        pageNum: 0, // 当前页码
        pageSize: 10, // 每页显示记录数
      },
      bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/26d5d0178e3f52c5103ecb5d0490fd5d.jpg',
      // shareIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/171b366b897b653919853d9e4de46276.png',
      shareIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/fc47d3e998cc3cd9bcf0ad7ad6db46ba.png',
      show: false,
      shopList: [],
      marketingInfo: {
        marketingAttr: {},
      },
      isShowPriceLabel: false,
      tipsShow: false,
    }
  },
  created() {
    this.listQuery.marketingId = this.$route.query.id
    this.getMarketingInfo()
    if ((window.ws && window.ws.wsShare) || (window.webkit && window.webkit.messageHandlers.wsShare)) {
      this.isShowShareIcon = true
    }
  },
  mounted() {
    setTimeout(() => {
      this.visitFun({ activityId: this.$route.query.id })
    }, 2000)
  },
  computed: {
    userId() {
      return this.$store.getters.userId
    },
  },
  methods: {
    handleClick(){
      if(location.search.indexOf('pageType')>-1){
        this.$router.go(-1)
      } else {
        this.$router.push({ path: '/' })
      }
    },
    // 去首页
    goIndex() {
      this.$router.push({ path: '/' })
    },
    visitFun(properties) {
      let that = this
      let data = {
        route: that.$route.path,
        routeName: '平台活动专区页',
        userId: that.$store.getters.userId,
      }
      visit(data, properties)
    },
    // 跳转商品/店铺详情
    toDetails(item) {
      if (item.skuId !== 0 && !item.skuId) {
        Toast('缺少参数')
        return
      } else {
        if (this.isDetail) {
          this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
          this.reload()
        } else {
          this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
        }
      }
    },
    getMarketingInfo() {
      let { marketingId } = this.listQuery
      getMarketingById({ marketingId: marketingId }).then((res) => {
        if (res.code == 200) {
          this.marketingInfo = res.data
          if (res.data) {
            let now = Date.parse(new Date())
            let start = Date.parse(new Date(this.marketingInfo.startTime.replace(/\-/g, '/')))
            let end = Date.parse(new Date(this.marketingInfo.endTime.replace(/\-/g, '/')))
            this.isShowPriceLabel = this.marketingInfo.openChannel && start <= now && end >= now
          }
        }
      })
    },
    findList() {
      getSpuSpeicalAreaList(this.listQuery).then((response) => {
        let list = response.data.list
        this.listQuery.pageNum++
        if (list.length > 0) {
          this.shopList = this.shopList.concat(list)
        } else {
          this.finished = true
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (list.length < 10) {
          this.finished = true
        }

        console.log('this.marketingInfo', this.marketingInfo)
        let nowDate = new Date().getTime()
        this.marketingInfo.startTime = this.marketingInfo.startTime && this.marketingInfo.startTime.replace(/\-/g, '/')
        this.marketingInfo.startTime = this.marketingInfo.startTime.slice(0, -3)
        console.log('this.marketingInfo.startTime--------------', this.marketingInfo.startTime)
        let startTime = new Date(this.marketingInfo.startTime).getTime()
        console.log('startTime--------------', startTime)
        console.log('nowDate  --------------', nowDate)

        if (nowDate < startTime && list.length > 0) {
          this.tipsShow = true
        }
      })
    },
    goShare() {
      // 尝试拉起小程序
      if (window.ws) {
        this.toMiniAppDistribution(2)
      } else if (window.webkit) {
        this.toMiniAppDistribution(1)
      } else {
        console.log('app拉起小程序失败')
      }
    },
    // 唤醒小程序分销
    async toMiniAppDistribution(platform) {
      // if (!this.userId) {
      //   const { data } = await this.$store.dispatch('user/getUserInfo')
      // }
      // // 准备密钥
      // console.log('this.userId: ', this.userId)
      // let aesToken = encrypt(this.userId, 'VGrCjJsxus1pXky0').encryptStr
      // console.log('aesToken', aesToken)
      // let userSource = this.$store.getters.getUserSource,
      // let userSource = localStorage.getItem('userSource'),
      //   us = ''
      // if (userSource && userSource == 1) {
      //   us = 6
      // } else if (userSource && userSource == 2) {
      //   us = 5
      // }
      //判断是否为生成环境
      let miniprogramType
      if (process.env.NODE_ENV == 'production') {
        miniprogramType = 0
      } else {
        miniprogramType = 2
      }
      let shareData = {
        sharePlatformList: [
          {
            userName: this.miniAppletUserName, // 分销小程序原始ID
            path: `productModule/pages/firstOrder/firstOrder?id=${this.listQuery.marketingId}`, //
            miniprogramType: miniprogramType,
            platformTag: 7,
          },
        ],
      }
      shareData = JSON.stringify(shareData)

      console.log(`拉起小程序${platform === 1 ? 'ios' : '安卓'},shareData: `, shareData)
      if (platform === 2) {
        try {
          window.ws.wsShare(shareData)
        } catch (err) {
          console.log('安卓拉起失败', err)
        }
      } else if (platform === 1) {
        try {
          window.webkit.messageHandlers.wsShare.postMessage(shareData)
        } catch (err) {
          console.log('ios拉起失败', err)
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.is-show {
  visibility: hidden;
}
/deep/ .van-list__finished-text {
  color: #fff;
}
.empty-page {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 50%;
  position: relative;

  &-header {
    position: absolute;
    left: 0;
    top: 0;
    height: 1.76rem;
    padding-left: 0.4rem;
    display: flex;
    align-items: center;

    i {
      border-radius: 50%;
      display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      background: url('../../../assets/img/back@2x.png') no-repeat center center;
      background-size: 100%;
    }
  }
  &-img {
    width: 3.6rem;
    height: 3.6rem;
  }

  &-text {
    font-size: 0.56rem;
    color: #999;
    line-height: 0.8rem;
    margin: 0.24rem 0 0.6rem;
  }
  &-btn {
    width: 3.6rem;
    height: 1.2rem;
    border-radius: 0.8rem;
    border: 1px solid #666;
    color: #000;
    font-size: 0.56rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.first-order-container {
  height: 100%;
  width: 100%;
  background-repeat: repeat-y;
  background-size: contain;
  margin-top: 44px;
  // background: #fd743a;

  .fixed-header {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      margin-left: 12px;
      img {
        width: 24px;
      }
    }
    .title {
      text-align: center;
      color: #000;
      font-size: 18px;
      line-height: 44px;
    }
    .more {
      width: 36px;
    }
  }
  .activity-img {
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .rule-dialog {
      border-radius: 0.4rem;
      opacity: 0.6;
      padding: 0.12rem 0.4rem;
      position: absolute;
      color: #ffffff;
      font-size: 0.48rem;
      line-height: 0.56rem;
      right: 0.4rem;
      top: 0.4rem;
      text-align: center;
      background-color: #000;
    }
  }
  .activity-goods-list {
    padding: 0rem 0.48rem 0.48rem;
    .guess-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .shop-card {
        display: flex;
        width: 100%;
        border-radius: 0.2rem;
        margin-bottom: 0.48rem;
        overflow: hidden;
        background-color: #fff;
        padding: 0.2rem;
        height: 6rem;
        .shop-img {
          width: 5.6rem;
          height: 5.6rem;
          flex-shrink: 0;
          /deep/ .van-image {
            img {
              border-radius: 0.2rem;
            }
          }
        }
        .shop-info {
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0.28rem 0.64rem 0rem 0.4rem;
          .shop-info-name {
            color: #000000;
            font-size: 0.56rem;
            line-height: 0.76rem;
            // height: 1.52rem;
            text-align: left;
            /* 超出两行隐藏 */
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .shop-info-desc {
            margin-top: 0.24rem;
            color: #666;
            font-size: 0.48rem;
            line-height: 0.56rem;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .activity-type {
            color: #e60113;
            margin-top: 0.4rem;
            margin-bottom: auto;
            font-size: 0.4rem;
            line-height: 0.4rem;
            text-align: center;
            padding: 0.12rem 0.08rem;
            display: inline-block;
            border-radius: 0.08rem;
            background: #fdebeb;
          }
          .shop-info-price {
            text-align: left;
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.2rem;
            .price-left {
              display: flex;
              flex-direction: column;
              margin-top: -0.32rem;
              .price-symbol {
                color: #e60113;
                font-size: 0.56rem;
                display: inline-block;
                height: 0.64rem;
                line-height: 0.64rem;
              }
              .price {
                font-size: 0.8rem;
                color: #e60113;
              }
            }
            .price-right {
              .buy-btn {
                width: 2.8rem;
                height: 1.2rem;
                background: #ffa000 linear-gradient(180deg, #ffa000 0%, #c82b1d 100%);
                border-radius: 0.8rem;
                text-align: center;
                line-height: 1.2rem;
                color: #fff;
              }
            }
          }
          .oldPrice {
            display: inline-block;
            font-size: 0.48rem;
            text-decoration: line-through;
            color: #999;
            transform: scale(0.92);
            margin-top: -0.3rem;
          }
        }
      }
      .shop-card:nth-child(1){
        margin-top: 0.48rem;
      }
    }
  }
  .activity-goods-list-second {
    padding: 0 0.48rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .activity-goods {
      margin-bottom: 0.36rem;
      overflow: hidden;
      border-radius: 0.2rem;
      display: inline-block;
      width: 6.84rem;
      height: 12.08rem;
      background: #fff;
      .goods-img {
        width: 100%;
        height: 6.84rem;
      }
      .goods-info {
        padding: 0.4rem;

        .goods-name {
          line-height: 0.76rem;
          font-size: 0.6rem;
          color: #000;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .goods-desc {
          margin-top: 0.24rem;
          min-height: 0.48rem;
          color: #666;
          font-size: 0.48rem;
          line-height: 0.56rem;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .goods-activity-type {
          color: #e60113;
          margin: 0.4rem 0;
          font-size: 0.4rem;
          line-height: 0.4rem;
          text-align: center;
          padding: 0.12rem 0.08rem;
          display: inline-block;
          border-radius: 0.08rem;
          background: #fdebeb;
        }

        .shop-info-price {
          text-align: left;
          display: flex;
          justify-content: space-between;
          .price-left {
            display: flex;
            flex-direction: column;
            margin-top: -0.32rem;
            .price-symbol {
              color: #e60113;
              font-size: 0.56rem;
              display: inline-block;
              height: 0.64rem;
              line-height: 0.64rem;
            }
            .price {
              font-size: 0.8rem;
              color: #e60113;
            }
          }
          .price-right {
            .buy-btn {
              width: 2.4rem;
              height: 1.2rem;
              background: #ffa000;
              border-radius: 0.8rem;
              text-align: center;
              line-height: 1.2rem;
              color: #fff;
              font-size: 0.44rem;
            }
          }
        }
        .oldPrice {
          display: inline-block;
          font-size: 0.48rem;
          text-decoration: line-through;
          color: #999;
          transform: scale(0.92);
          margin-top: -0.3rem;
        }
      }
    }
  }
  .guess-load-more-tips {
    padding: 0.4rem 0;
    text-align: center;
    color: #888888;
  }
  /deep/ .van-popup {
    padding: 1.36rem 0.72rem;
    width: 80%;
    height: 16.64rem;
  }
  .regulation-content {
    height: 90%;
    .title {
      text-align: center;
      font-size: 0.72rem;
      margin-bottom: 0.8rem;
    }
    .content {
      height: 100%;
      line-height: 0.96rem;
      color: #666666;
      font-size: 0.56rem;
      overflow-y: scroll;
    }
    .content::-webkit-scrollbar {
      display: none;
    }
  }
  .share-btn {
    position: fixed;
    right: 0;
    bottom: 4rem;
    width: 2.4rem;
    height: 1.4rem;
    border-radius: 0.32rem 0px 0px 0.32rem;
    background: #000;
    opacity: 0.7;
    display: flex;
    align-items: center;
    padding-left: 0.28rem;
    flex-direction: row;
    color: #fff;
    font-size: 0.56rem;
    i {
      margin-left: 0.08rem;
      display: inline-block;
      width: 0.52rem;
      height: 0.52rem;
      background: url('../../../assets/img/activity/share@2x.png') no-repeat center center;
      background-size: 100%;
    }
  }

  // 弹框样式
  .confirm-order-notice {
    padding: 0 0.96rem;
    box-sizing: border-box;
    .van-dialog-content {
      .goods-notice {
        width: 100%;
        text-align: center;
        font-size: 0.64rem;
        font-weight: 500;
        color: #000000;
        margin: 1.2rem 0;
      }
      .goods-content {
        max-height: 10.24rem;
        overflow-y: scroll;
        .goods-content-li {
          display: flex;
          margin-bottom: 0.84rem;
          .goods-left {
            width: 2.4rem;
            height: 2.4rem;
            background: #ffffff;
            border-radius: 0.2rem;
            border: 0.04rem solid #eeeeee;
            padding: 0.32rem 0.12rem 0.4rem 0.16rem;
            margin-right: 0.4rem;
          }
          .goods-right {
            font-size: 0.48rem;
            .top {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              color: #666666;
            }
            .bottoom {
              margin-top: 0.52rem;
              color: #e60113;
            }
          }
        }
      }
    }

    .btn-box {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 1rem 0;
      /deep/ .van-button--info {
        color: #e60113;
        background-color: #fff;
        border: 1px solid #e60113;
      }
      /deep/ .van-button--normal {
        padding: 0.2rem 2.48rem;
        font-size: 0.48rem;
      }
    }
  }
}
.reminderBoxWrapper {
  /deep/ .van-popup {
    padding: 1.12rem 0.88rem 0.96rem;
    height: 7.8rem;
    // width: 80%;
    width: 12.64rem;
    box-sizing: border-box;
  }
  .reminderBox {
    height: 90%;
    text-align: center;
    .title {
      text-align: center;
      font-size: 0.64rem;
      margin-bottom: 0.72rem;
      font-weight: bold;
    }
    .content {
      // height: 100%;
      text-align: center;
      line-height: 0.96rem;
      color: #666666;
      font-size: 0.6rem;
      margin-bottom: 0.92rem;
    }
    .content::-webkit-scrollbar {
      display: none;
    }
    .border_half {
      display: inline-block;
      position: relative;
      // border: 1px solid #333;
      width: 4.4rem;
      height: 1.2rem;
      background: #e60113;
      border-radius: 0.6rem;
      line-height: 1.2rem;
      text-align: center;
      color: #fff;
    }
    .border_half::after {
      border: 1px solid #e60113;
    }
  }
}
.noData {
  text-align: center;
  margin-top: 0.8rem;
  font-size: 0.56rem;
  color: #fff;
}
</style>
