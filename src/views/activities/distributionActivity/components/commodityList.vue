<template>
  <div class="wrap-content">
    <div class="top-recommond">
      <div class="first-item" @click="goDetails(firstItem)">
          <img class="product-pic" :src="firstItem.productUrl" alt="">
          <div class="first-item-wrapper">
            <p class="prod-title">{{firstItem.skuName}}</p>
            <div class="prod-price">
              <div class="prod-price-wrapper">
                <span class="coin">￥</span>
                <span class="price">{{ firstItem.finalPrice && firstItem.finalPrice.toFixed(2) }}</span>
                <span class="initPrice" v-if="firstItem.finalPrice < firstItem.price">￥{{firstItem.price && firstItem.price.toFixed(2)}}</span>
              </div>
              <div class="get-money" v-if="!isSharedPage">
                <span class="get-btn">赚￥{{ firstItem.preCommission && firstItem.preCommission.toFixed(2) }}</span>
              </div>
            </div>
            <span class="share-btn" v-if="isSharedPage">立即购买</span>
            <span v-else class="share-btn" @click.stop="shareComm(1, firstItem)">分享</span>
          </div>
      </div>
      <div class="hot-container">
        <p class="hot-title">热 销 榜</p>
        <div class="hot-wrapper">
          <div class="hot-item" v-for="(item,index) in hotList" :key="index" @click="goDetails(item)">
            <div class="prod-img-box">
              <img class="prod-pic" :src="item.productUrl" alt="">
              <img class="grade" src="@/assets/img/distribution/first.png" alt="" v-if="index == 0">
              <img class="grade" src="@/assets/img/distribution/second.png" alt="" v-if="index == 1">
              <img class="grade" src="@/assets/img/distribution/third.png" alt="" v-if="index == 2">
            </div>
            
            <div class="hot-main">
              <div class="prod-price">
                <span class="coin">￥</span>
                <span class="price">{{ item.finalPrice | getPriceInt }}</span>
                <span class="precision">{{ item.finalPrice | getPricePrecision }}</span>
                <span class="initPrice" v-if="item.finalPrice < item.price">￥{{item.price}}</span>
              </div>
              <div class="get-money">
                <span class="get-btn" v-if="!isSharedPage">赚￥{{ item.preCommission && item.preCommission.toFixed(2) }}</span>
                <span class="share-btn" v-if="isSharedPage">立即购买</span>
                <span v-else class="share-btn" @click.stop="shareComm(1, item)">分享</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <p class="all-product-title">精品好物</p>
    <!-- 商品卡片 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="success">
      <div v-if="list.length">
        <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="all-pro-item">
            <van-card :title="item.skuName ? item.skuName : ''" :thumb="item.productUrl ? item.productUrl : defUrl" @click="goDetails(item)">
              <template #price-top>
                <p class="all-price-box">
                  <span class="coin">￥</span>
                  <span class="price">{{ item.finalPrice && item.finalPrice.toFixed(2) }}</span>
                  <span class="initPrice" v-if="item.finalPrice < item.price">￥{{item.price && item.price.toFixed(2)}}</span>
                </p>
              </template>
              <template #bottom>
                <div class="predict_price">
                  <span class="get-btn" v-if="!isSharedPage">赚 ￥{{ item.preCommission && item.preCommission.toFixed(2) }}</span>
                  <span class="share-btn" v-if="isSharedPage">立即购买</span>
                  <span v-else class="share-btn" @click.stop="shareComm(1, item)">分享</span>
                </div>
              </template>
            </van-card>
          </div>
          <!-- 分享面板 -->
          <van-share-sheet v-model="showShare" title="分享至" :options="options" @select="onSelect" @cancel="clonse" @click-overlay="clonse" />
        </van-list>
      </div>
      <div v-else class="noData">
        <img src="@/assets/img/authorizeManagement.png" style="width:10rem;height:10rem;display:block;margin: 0 auto;" alt="" />
        <p class="noData-p">暂无商品</p>
      </div>
    </van-pull-refresh>
    <!-- 分享列表 -->
    <img class="img_top" src="@/assets/img/distribution/weChat.png" @click.stop="shareComm(2)" v-if="!isSharedPage" />
    <img class="img_to_top" src="@/assets/img/distribution/img_to_top.png" v-if="showToTop" @click.stop="toPageTop" />
    <!-- 海报展示 -->
    <div v-show="posterShow" class="saveImg">
      <van-image :src="posterImg" />
    </div>
  </div>
</template>

<script>
  import { getList, getListShareCode, } from '@/api/activities/distributionActivity'
  import { isDistribution } from '@/api/home'
  import mixins from '@/mixins/activities/distributionActivity.js'
  import { Image as VanImage } from 'vant'
  import { throttle } from '@/utils/utils'
  import { getToken } from '@/utils/token'

  export default {
    mixins: [mixins],
    components: {
      [VanImage.name]: VanImage,
    },
    data() {
      return {
        defUrl: require('@/assets/img/shop_default.png'),
        success: '刷新成功',
        isLoading: false, // 是否正在加载中, 下拉刷新
        loading: false,
        finished: false,
        showShare: false, //显示--分享面板
        posterShow: false, //显示--海报展示
        posterImg: '', //海报图片
        list: [],
        firstItem: {},
        hotList: [],
        params: {
          pageNum: 0,
          pageSize: 10,
          isDistribution: 1, //0:非分销商品 1:分销商品 空：查询所有
          sortItems: [
            //排序
            {
              field: 'distributionAuditDate',
              order: null,
            },
          ],
        },
        shareType: 1,
        proList: {
          val: {},
        },
        isH5: this.$store.state.userSource == 3,
        isSharedPage: false,
        isLogin: getToken() ? getToken() : false, // 判断是否登录
        showToTop: false
      }
    },
    computed: {
      // eslint-disable-next-line vue/return-in-computed-property
      options() {
        if (this.shareType == 1 || this.shareType == 2 || this.shareType == 3 || this.shareType == 4) {
          return [
            { name: '微信好友', icon: 'wechat', type: 4 },
            { name: '朋友圈', icon: require('@/assets/img/icon-circle.png'), type: 6 },
            { name: '海报下载', icon: require('@/assets/img/icon-save.png'), type: 3 },
          ]
        } else if (this.shareType == 5 || this.shareType == 6) {
          return [{ name: '复制链接', icon: require('@/assets/img/copy@2x.png'), type: 5 }]
        }
      },
    },
    filters:{
      getPriceInt(val){
        return Math.floor(val)
      },
      getPricePrecision(val) {
        const num = Number(val).toFixed(2)
        return num.substring(num.length-3, num.length)
      }
    },
    created() {
      this.isSharedPage = !!this.$route.query.promoteInfo
      this.getList()
      this.$nextTick(()=>{
        window.addEventListener('scroll',this.scrollHandle, true)
      })
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.scrollHandle)
    },
    methods: {
      //列表海报
      async getListShareCode() {
        let params = {
          scene: 'id=' + this.distrInfo.promoteId,
          page: 'distributionModule/pages/distributionIndex/distributionList',
          recommendId: this.distrInfo.promoteId,
          width: 40,
          autoColor: false,
          lineColor: '',
          isHyaline: false,
        }
        try {
          this.$toast.loading({
            message: '正在生成海报中…',
            forbidClick: true,
            duration: 5000,
          })
          let res = await getListShareCode(params)
          if (res.code == 200 && res.data.wsSunCodeUrl) {
            this.posterImg = res.data.wsSunCodeUrl
            this.posterShow = true
            // 弹出分享方式框
            this.showShare = true
            this.shareType = 4
            this.$toast.clear()
          } else {
            this.$toast('海报生成失败')
          }
        } catch (error) {
          console.log(error)
        }
      },
      //取消
      clonse() {
        this.showShare = false
        this.posterShow = false
        this.posterImg = ''
      },
      // 分享方式入参
      getShareData(key) {
        let share
        /**
        * this.shareType-option.type
          //单品-微信好友-链接 1-1
          单品-分享海报-保存图片 3-3
          单品-分享海报-微信好友 3-4
          //列表-微信好友-链接 2-1
          列表-分享海报-保存图片 4-3
          列表-分享海报-微信好友 4-4
        */
        switch (key) {
          // case 1:
          //   if (this.shareType == 1) {
          //     }
          //   } else {
          //     share = {
          //   }
          //   break
          case 3:
            share = {
              imgUrl: this.posterImg,
              platformTag: 5, //5= 保存图片
              shareType: 3, //3=分享图片
            }
            break
          case 4:
            share = {
              imgUrl: this.posterImg,
              platformTag: 3, //3= 微信好友
              shareType: 3, //3=分享图片
            }
            break
          case 6:
          share ={
            imgUrl: this.posterImg,
            platformTag: 4, // 4=朋友圈
            shareType: 3, //3=分享图片
          }
           break
          default:
            break
        }
        return { sharePlatformList: [share] }
      },
      //分享商品/列表
      async shareComm(isList, val) {
        if(!getToken()) {
          this.$router.push({ path: '/login', query: { url: '/distributionActivity' }})
          return
        }
        if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId || this.$store.getters.distrInfo.customerId != this.$store.getters.userInfo.id) {
          await this.isDistribution()
        } else {
          let data = {
              customerId: this.$store.getters.distrInfo.customerId || '', //关联商城用户ID
              mobile: this.$store.getters.distrInfo.mobile || '', //电话号码
              promoteId: this.$store.getters.distrInfo.promoteId || '', //关联推广员ID
              promoteType: this.$store.getters.distrInfo.promoteType || '', //推广员类型（1-推广员 2-车主）
              id: this.$store.getters.distrInfo.id || '', //分销员ID
            }
            this.distrInfo = data
        }
        
        if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId) {
          this.$router.push({ path: '/promoter', query: { url: '/distributionActivity' }})
          return
        }
        this.proList.val = val || ''
        if(this.isH5) {
          this.shareType = val ? 5: 6
          // 弹出分享方式框
          this.showShare = true
        } else {
          this.posterImg = ''
          this.shareType = isList
          //保存单个商品信息
          this.isShare(val)
        }
        
      },
      //分享方式  微信  海报
      onSelect(option) {
        switch (option.type) {
          // case 1:
          case 3:
          case 6:
          case 4:
            let shareData = this.getShareData(option.type)
            this.sharePro(shareData)
            break
          case 5:
            this.getShareLink()
            break;
          default:
            break
        }
      },
      getShareLink() {
        let baseUrl = window.location.origin
        let shareContent
        if(this.shareType==5) {
          shareContent = `${baseUrl}/spudetail?id=${this.proList.val.skuId}&promoteInfo=${JSON.stringify(this.distrInfo)}&sourceType=1`
        } else {
          shareContent = `${baseUrl}/distributionActivity?promoteInfo=${JSON.stringify(this.distrInfo)}&sourceType=1`
        }
        let input1 = document.createElement('input') // 直接构建input
        input1.value = shareContent // 设置内容
        document.body.appendChild(input1)
        input1.select() // 选择实例内容
        document.execCommand('Copy') // 执行复制
        console.log(input1.value)
        document.body.removeChild(input1) // 删除临时实例
        this.$toast.success('复制成功！')
        this.showShare = false
      },
      //上拉刷新
      onRefresh() {
        this.params.pageNum = 0
        this.finished = false
        setTimeout(() => {
          try {
            this.getList()
              .then((res) => {
                this.isLoading = false
              })
              .catch((err) => {
                this.isLoading = false
                this.success = '刷新失败'
              })
          } catch (error) {
            this.isLoading = false
            this.success = '刷新失败'
          }
        }, 1000)
      },
      //下拉加载
      async onLoad() {
        this.params.pageNum += 1
        try {
          let res = await getList(this.params)
          let data = res.data || []
          if (data.length == 0) {
            // 数据全部加载完成
            this.finished = true
            this.params.pageNum -= 1
          } else {
            this.list = this.list.concat(data)
          }
          this.loading = false
        } catch (error) {
          // 加载状态结束
          this.loading = false
          console.log(error)
        }
      },
      //商品列表
      getList() {
        return new Promise((resolve, reject) => {
          getList(this.params)
            .then((res) => {
              if (res.code == 200) {
                let data = res.data || []
                if(this.params.pageNum == 0) {
                  this.list = data.slice(4)
                  this.firstItem = data[0]
                  this.hotList = data.slice(1,4)
                } else {
                  this.list = data
                }
                
                resolve(res)
              } else {
                reject(res)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      //详情
      goDetails(item) {
        // this.$router.push({ name: 'disDetail', query: { id: item.skuId } })
        // 走通用详情页面
        if (item.skuId !== 0 && !item.skuId) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        } else {
          const isDistribution = !this.isSharedPage
          this.$router.push({ path: '/spudetail', query: { sourceType: item.sourceType || 1,id: item.skuId, isDistribution, promoteInfo: this.$route.query.promoteInfo } })
        }
      },
      async isDistribution() {
        if (!this.$store.getters.userId) {
          await this.$store.dispatch('user/getUserInfo')
        }
        let params = {
          userId: this.$store.getters.userId,
          userPhone: this.$store.getters.userInfo.mobile,
        }
        try {
          let res = await isDistribution(params)
          if (res.data.code == 1) {
            let isDistribution = res.data.isDistribution  
            // if (isDistribution == 1) {
              //是分销-推广员
              let data = {
                customerId: res.data.customerId || '', //关联商城用户ID
                mobile: res.data.mobile || '', //电话号码
                promoteId: res.data.promoteId || '', //关联推广员ID
                promoteType: res.data.promoteType || '', //推广员类型（1-推广员 2-车主）
                id: res.data.id || '', //分销员ID
              }
              this.distrInfo = data
              this.$store.dispatch('setDistrInfo', data)
            // }
            //页面跳转 1 是推销员  0 不是推销员
          } else {
            //-1 接口有误
          }
        } catch (error) {
          //-1 接口有误
        }
      },
      scrollHandle:throttle(function(e){
        this.showToTop = e.target.scrollTop > 500
      }, 500),
      toPageTop() {
        const srcollDom = document.querySelector('.wrap-content-main')
        srcollDom.scrollTo({
          top: 0,
          behavior:"smooth"
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  .wrap-content {
    .top-recommond {
      display: flex;
      padding: 0 12px;
      .first-item {
        background: #fff;
        border-radius: 8px;
        margin-right: 6px;
        width: 172px;
        .product-pic {
          width: 172px;
          height: 172px;
          border-radius: 8px 8px 0px 0px;
          display: block;
        }
        .first-item-wrapper {
          // height: 97px;
          padding-top: 8px;
          padding-bottom: 6px;
          position: relative;
        }
        .prod-title {
          font-size: 13px;
          line-height: 20px;
          color: #000;
          height: 40px;
          line-height: 20px;
          padding: 0 8px;
          margin-bottom: 10px;
          font-weight: bold;
          /* 超出两行隐藏 */
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .prod-price {
          .prod-price-wrapper {
            color: #FD302C;
            display: flex;
            align-items: center;
            padding: 0 8px;
            .coin {
              font-size: 12px;
            }
            .price {
              font-size: 18px;
              font-weight: bold;
              line-height: 15px;
            }
            .initPrice {
              margin-left: 4px;
              font-size: 10px;
              color: #666;
              text-decoration: line-through;
            }
          }
        }
        .share-btn {
          position: absolute;
          right: 8px;
          bottom: 6px;
          background: #FD302C;
          border-radius: 4px;
          font-size: 12px;
          color: #fff;
          padding: 0 6px;
        }
        .get-money {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 8px;
          .get-btn {
            background: linear-gradient(290deg, rgba(254, 103, 128, 0.12) 0%, rgba(255, 22, 61, 0.12) 100%);
            border-radius: 2px;
            color: #FD302C;
            padding: 0 4px;
            line-height: 14px;
            font-size: 10px;
            margin-top: 4px;
          }
          .share-btn {
            background: #FD302C;
            border-radius: 4px;
            font-size: 12px;
            color: #fff;
            padding: 2px 6px;
          }
        }
      }
      .hot-container {
        border-radius: 12px 12px 8px 8px;
        width: 172px;
        position: relative;
        padding-top: 42px;
        .hot-title {
          position: absolute;
          top: 0;
          left: 0;
          color: #fff;
          height: 50px;
          width: 100%;
          background: url('~@/assets/img/distribution/hot-head.png') no-repeat;
          background-size: 100% 100%;
          font-size: 16px;
          font-weight: bold;
          line-height: 22px;
          padding-top: 8px;
          padding-left: 10px;
          z-index: 0;
        }
        .hot-wrapper {
          background: #fff;
          border-radius: 12px 12px 8px 8px;
          padding-top: 24px;
          padding-bottom: 12px;
          position: relative;
          top: 2;
          .hot-item {
            margin-bottom: 22px;
            display: flex;
            padding-left: 10px;
            padding-right: 8px;
            align-items: flex-end;
            &:last-child{
              margin-bottom: 0;
            }
            .prod-img-box {
              width: 50px;
              height: 50px;
              position: relative;
              margin-right: 4px;
              font-size: 0;
              .prod-pic {
                width: 100%;
                height: 100%;
              }
              .grade {
                position: absolute;
                top: -10px;
                left: -4px;
                width: 18px;
                height: 24px;
              }
            }
            .hot-main {
              flex: 1;
              .prod-price {
                color: #FD302C;
                display: flex;
                margin-bottom: 4px;
                .coin {
                  font-size: 12px;
                }
                .price {
                  font-size: 18px;
                  font-weight: bold;
                  line-height: 15px;
                }
                .precision {
                  font-size: 12px;
                  font-weight: bold;
                }
                .initPrice {
                  vertical-align: bottom;
                  margin-left: 4px;
                  font-size: 10px;
                  color: #666;
                  text-decoration: line-through;
                }
              }
              .get-money {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                .get-btn {
                  background: linear-gradient(290deg, rgba(254, 103, 128, 0.12) 0%, rgba(255, 22, 61, 0.12) 100%);
                  border-radius: 2px;
                  color: #FD302C;
                  padding: 0 4px;
                  line-height: 14px;
                  font-size: 10px;
                }
                .share-btn {
                  background: #FD302C;
                  border-radius: 2px;
                  font-size: 10px;
                  color: #fff;
                  padding: 0px 4px;
                }
                
              }
            }
            
          }
        }
      }
    }
    .all-product-title {
      font-size: 16px;
      color: #000;
      font-weight: bold;
      margin-top: 20px;
      padding-left: 12px;
      margin-bottom: 16px;
    }
    .initPrice {
      text-decoration: line-through;
    }
    // overflow: scroll;
    
    .all-pro-item {
      .van-card {
        margin: 12px 12px 0px 12px;
        padding: 0;
        background-color: #ffffff;
        border-radius: 8px;
        .van-card__thumb {
          margin-right: 12px;
          height: 126px;
          width: 126px;
        }
        .van-card__content {
          padding: 10px 8px 0px 0px;
        }
        .van-card__title {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          height: auto;
          max-height: none;
          line-height: 20px;
        }
        .all-price-box {
          .coin {
            font-size: 12px;
            color: #E60113;
          }
          .initPrice {
            margin-right: 6px;
            color: #666;
            font-size: 10px;
            text-decoration: line-through;
          }
          .price {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #e60113;
            line-height: 15px;
          }
        }
        
        .predict_price {
          display: flex;
          position: relative;
          margin-top: 4px;
          padding-bottom: 12px;
          .get-btn {
            background: linear-gradient(290deg, rgba(254, 103, 128, 0.12) 0%, rgba(255, 22, 61, 0.12) 100%);
            border-radius: 2px;
            color: #FD302C;
            padding: 0 4px;
            line-height: 14px;
            font-size: 10px;
          }
          .share-btn {
            position: absolute;
            background: #FD302C;
            border-radius: 4px;
            font-size: 14px;
            color: #fff;
            padding: 4px 16px;
            right: 12px;
            bottom: 10px;
          }
        }
        
      }
      &:first-child .van-card {
        margin-top: 0;
      }
    }
    .noData {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: calc(~'100vh - 50px');
      background: #f5f5f5;
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
    .img_top {
      width: 68px;
      height: 68px;
      position: fixed;
      bottom: 120px;
      right: 0px;
    }
    .img_to_top {
      width: 68px;
      height: 68px;
      position: fixed;
      bottom: 60px;
      right: 0px;
    }
    .saveImg {
      width: 100vw;
      height: 50vh;
      display: flex;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      .van-image {
        position: absolute;
        top: 80px;
        width: 65vw;
        height: 50vh;
        z-index: 2200;
        /deep/.van-image__img {
          border-radius: 10px;
        }
      }
    }
    .van-pull-refresh {
      min-height: calc(~'100vh - 50px');
    }
    /deep/ .van-share-sheet__options {
      justify-content: space-around;
    }
  }
</style>
