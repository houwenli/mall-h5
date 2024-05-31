<template>
  <div class="store-container" ref="container" :class="[returntop ? 'backtopactive' : '']" v-if="!isClose">
    <div class="store-header" :class="{ moveDown: showTitle, moveUp: !showTitle }">
      <div class="store-search">
        <i class="back" @click="toBack"></i>
        <div v-if="type == 1" class="store-name">我的小店</div>
        <div v-else class="store-name">{{ storeInfo.storeName || '' }}</div>
        
        <i v-if="type != 1" class="more" @click="shopTopNavVisible = !shopTopNavVisible"></i>
        <div v-if="shopTopNavVisible" class="mui-global-nav">
          <div class="mui-global-nav-arr"></div>
          <ul>
            <li class="mui-global-nav-tab-home" @click="toIndex">首页</li>
            <!-- <li class="mui-global-nav-tab-shop" @click="toStoreIndex">店铺首页</li>
            <li class="mui-global-nav-tab-class" @click="toStoreCategory">店铺分类</li>
            <li class="mui-global-nav-tab-goods" @click="toSpuList">全部商品</li> -->
            <li class="mui-global-nav-tab-service" @click="callUp">联系客服</li>
          </ul>
        </div>
      </div>
      <!-- <ul class="store-categories">
        <div>
          <li v-for="(item, index) in tabList" :key="index" class="categories" :class="[{ active: tabIndex == item.id }]" @click="changeTab(item.id)">
            <span>{{ item.name }}</span>
            <i v-show="tabIndex == item.id"></i>
          </li>
        </div>
        <div class="store-categories-btn" @click="toStoreCategory">
          <img style="height: 18px; width: 19px; margin-right: 3px" src="../../assets/img/filter@2x.png" alt="" />
          <div>分类</div>
        </div>
      </ul> -->
    </div>
    <van-search v-if="type != 1" v-model="searchValue" placeholder="请输入搜索关键词" @focus="onSearch">
        <template #left-icon>
            <div class="search-icon-img">
                <img src="@/assets/img/search_goods.png" alt="" />
            </div>
        </template>
        <template #label>
            <div class="search-logo">
                <img src="@/assets/img/wsf_logo_img.png" alt="" />
            </div>
        </template>
    </van-search>
    <div class="store-box">
      <div class="store-title">
      <div class="store-info">
        <div class="avatar">
          <img :src="storeInfo.avatarPicture || storeInfo.imageUrl || 'https://wanshunjiaoche-file-public-1301582899.cos.ap-guangzhou.myqcloud.com/oaOrgWebManager/5/1672105155880_koUFV.png'" alt="" />
        </div>
        <div class="name">
          <p class="storeName doubleoverline">{{ storeInfo.storeName || '' }}</p>
          <!-- <div class="tag-part">
                         <span class="tag store-type">万顺福自营</span>
            <div class="tag">综合体验</div>
            <van-rate style="margin-right: 12px" allow-half readonly size="10px" v-model="rate" />
            <span class="tag">{{ 10000 + storeInfo.followNum }}人关注</span>
          </div> -->
          <span class="fans-num" v-if="type == 1">粉丝数：{{ (storeInfo.followNum || storeInfo.fans || 0) | fansFilters }}</span>
          <template v-else>
            <div v-if="!attention" class="concern-bt" @click="attentionStore"><van-icon  name="plus" />订阅</div>
            <div v-else class="concern-bt in-concern" @click="noAttentionShow = true">取消订阅</div>
          </template>
          
        </div>
      </div>
      
      <!-- <div class="store-like" :class="{ 'no-attention': !storeInfo.hasAttention, 'is-attention': storeInfo.hasAttention }" @click="attentionStore">
        <i v-show="!storeInfo.hasAttention" class="mark"></i>
        <span>{{ storeInfo.hasAttention ? '已' : '' }}关注</span>
      </div> -->
    </div>
    <div class="description" v-if="storeInfo.storeDescription">
      {{storeInfo.storeDescription}}
    </div>
    </div>
    <div class="product-container">
      <shopList ref="shopListModule" :store-id="storeId" :search-new-spu="tabIndex" :filterShow="true" @resetRecommendData="isStoreAttention" :isOld="true"></shopList>
    </div>
    <!-- <SecondConfirm
      title="用户注册协议"
      cancleText="先浏览看看"
      sureText="同意"
      :dialogshow="registrationProtocolIsShow"
      @closeBack="$store.commit('SET_REGISTRATIONPROTOCOL', false)"
      @rightEvent="hasPayPasswordDialogFun"
    >
      <div slot="textp">
        <div class="registration-protocol">
          <div v-html="protocol"></div>
        </div>
      </div>
    </SecondConfirm> -->
    <!-- 分享面板 -->
    <van-share-sheet v-model="showShare" title="分享至" :options="options" @select="onSelect" @cancel="clonse" @click-overlay="clonse" />
    <div v-show="posterShow" class="saveImg">
      <van-image :src="posterImg" />
    </div>
    <img class="img_top" src="@/assets/img/distribution/weChat.png" @click.stop="shareComm" />
    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop">
      <img src="@/assets/img/top@2x.png" class="returntop" @click="backtop" alt="" />
    </div>
    <van-action-sheet class="no-attention-sheet" v-model="noAttentionShow" title="订阅管理">
      <div>
        <div class="no-attention-action" @click="attentionStore">
        取消订阅
        </div>
        <div class="cancel-box">
          <van-button type="primary" block plain @click="noAttentionShow = false">取消</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
  <div v-else class="store-container store-empty">
    <navbartop title="店铺首页" @clickBack="backLastPage"></navbartop>
    <img :src="storeEmptyImg" class="store-empty-img" />
    <p class="store-empty-text">店铺不存在或已关闭</p>
  </div>
</template>
<script>
  import { mobileIndex, queryStoreInfo, queryAgencyStore, newAddStoreAttention, newCancelStoreAttention, isStoreAttention, storeShareCode } from '@/api/storeindex'
  import { querySpu } from '@/api/spudetail'
  import { formatPrice } from '@/utils/utils'
  import shopList from '../commons/shopList'
  import { getToken } from '@/utils/token'
  import { visit } from '@/api/visit'
  import storeEmptyImg from '@/assets/img/empty/store-empty.png'
  import Cookies from 'js-cookie'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
  import navbartop from '@/components/commons/navBartop'
  import { Search, Image as VanImage, ActionSheet } from 'vant'
  export default {
    mixins: [userRegistrationProtocol],
    computed: {
      registrationProtocolIsShow() {
        return this.$store.getters.getRegistrationProtocol
      },
      options() {
        if (!this.isH5) {
          return [
            { name: '微信好友', icon: 'wechat', type: 4 },
            { name: '朋友圈', icon: require('@/assets/img/icon-circle.png'), type: 6 },
            { name: '海报下载', icon: require('@/assets/img/icon-save.png'), type: 3 },
          ]
        } else {
          return [{ name: '复制链接', icon: require('@/assets/img/copy@2x.png'), type: 5 }]
        }
      },
      isH5() {
        return this.$store.state.userSource == 3
      }
    },
    components: { shopList, SecondConfirm, navbartop, [Search.name]: Search, [VanImage.name]: VanImage, [ActionSheet.name]: ActionSheet},
    filters: {
        fansFilters: function (num) {
            let val = Number(num)
            if (!num) {
                return 0
            } else {
                if (val <= 9999) {
                    return val
                } else {
                    if ((parseInt(val) / 10000).toFixed(2) <= 9999.99) {
                        return (parseInt(val) / 10000).toFixed(2) + 'w'
                    } else {
                        return '9999.99w'
                    }
                }
            }
        }
    },
    data() {
      return {
        noAttentionShow: false, // 取消订阅弹窗
        searchValue: '',
        storeEmptyImg,
        isClose: false,
        documentScrollTop: 0,
        showTitle: false,
        formatPrice: formatPrice, // 格式化金额
        shopTopNavVisible: false, // 是否展示顶部菜单栏
        floors: [], // 店铺首页楼层集合
        storeId: this.$route.query.storeId, // 店铺id
        tabIndex: 0,
        storeInfo: {}, // 店铺信息
        tabList: [
          {
            id: 0,
            name: '商品',
          },
          {
            id: 1,
            name: '新品',
          },
          // {
          //   id: 2,
          //   name: '活动',
          // },
        ],
        rate: 5,
        isshowtop: false, // 回到顶部
        returntop: false, // 返回顶部
        showShare: false, //显示--分享面板
        posterShow: false, //显示--海报展示
        posterImg: '', //海报图片
        type: this.$route.query.type || 2,
        attention: false
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg')
      // this.queryMobileIndex(this.storeId)
      
      this.queryStoreInfo(this.storeId)
      this.isStoreAttention(this.storeId)
    },
    watch: {
      isshowtop(value) {
        if (!value) this.returntop = false
      },
    },
    mounted() {
      let data = {
        route: this.$route.path,
        routeName: '店铺主页',
        userId: this.$store.getters.userId,
      }
      visit(data, { storeId: this.storeId })
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      //分享商品/列表
      async shareComm() {
        if(!getToken() && !this.isH5) {
          this.$router.push({ path: '/login', query: { url: window.location.pathname + window.location.search }})
          return
        }
        // 弹出分享方式框
        this.showShare = true
        if(!this.isH5) {
          this.getListShareCode()
        }
      },
      //列表海报
      async getListShareCode() {
        let params = {
          scene: `storeId=${this.storeId}`,
          page: 'productModule/pages/store/storeIndex',
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
          let res = await storeShareCode(params)
          if (res.code == 200 && res.data) {
            this.posterImg = res.data
            this.posterShow = true
            // 弹出分享方式框
            this.showShare = true
            this.$toast.clear()
          } else {
            this.$toast('海报生成失败')
          }
        } catch (error) {
          this.$toast.clear()
          console.log(error)
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
        let shareContent = window.location.origin + window.location.pathname + '?storeId=' + this.$route.query.storeId
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
      //APP分享方法--判别手机类型
      sharePro(shareData) {
        if (window.ws) {
          //安卓
          this.toMiniH5(2, shareData)
        } else if (window.webkit) {
          //IOS
          this.toMiniH5(1, shareData)
        } else {
          console.log('APP分享失败')
        }
      },
      // APP分享方法--分享H5
      async toMiniH5(platform, shareData) {
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
        this.clonse()
      },
      //取消
      clonse() {
        this.showShare = false
        this.posterShow = false
        this.posterImg = ''
      },
      onSearch() {
        this.$router.push({
              path: '/shopSearch',
              query: {
                  path: `/storeSearch?storeId=${this.storeId}`,
                  from: '/storeIndex',
              }
          });
      },
      // 返回
      backLastPage() {
        this.$router.back()
      },
      handleScroll() {
        if (!this.$refs.container) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.container.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop)

        if (scorllTop >= 2500) {
          this.isshowtop = true
        } else {
          this.isshowtop = false
        }

        if (scorllTop > 125) {
          if (scorllTop > this.documentScrollTop) {
            this.showTitle = true
          } else {
            this.showTitle = false
          }
        } else {
          this.showTitle = false
        }

        this.documentScrollTop = JSON.parse(JSON.stringify(scorllTop))
      },
      // 回到顶部
      backtop() {
        if (this.isshowtop) this.returntop = true
        else this.returntop = false
      },
      //关注/取关店铺
      attentionStore() {
        if (getToken()) {
          // if (this.storeInfo.hasAttention) {
          if(this.attention) {
              newCancelStoreAttention(this.storeId).then((res) => {
              if (res.code == 200) {
                this.isStoreAttention(this.storeId)
                this.$vux.toast.text('取消订阅成功', 'middle')
                this.noAttentionShow = false
              }
            })
          } else {
            newAddStoreAttention(this.storeId).then((res) => {
              if (res.code == 200) {
                this.isStoreAttention(this.storeId)
                this.$vux.toast.text('订阅成功', 'middle')
              }
            })
          }
        } else {
          if (Cookies.get('_wsf_role') == 1) {
            this.$store.commit('SET_REGISTRATIONPROTOCOL', true)
            return
          }
          this.$router.push('/login?url=' + location.pathname + location.search)
        }
      },
      isStoreAttention() {
        if(getToken()) {
          isStoreAttention(this.storeId).then(res => {
            if(res.code == 200) {
              let data = res.data == 0 ? true : false
              this.attention = data
            }
          })
        }
      },
      // 获取跳转地址
      navigateUrl(advert) {
        if (advert.action === 'skuDetail') {
          this.toSkuDetail(advert)
        } else if (advert.action === 'cateSearch') {
          this.toCateSearch(advert.actionParamId)
        } else if (advert.action === 'thematicDetail') {
          this.toThematicDetail(advert.actionParamId)
        } else if (advert.action === 'couponList') {
          this.toCoupon()
        } else if (advert.action === 'redEnvelopeList') {
          this.toRedEnvelope()
        } else if (advert.action === 'panicList') {
          this.toPanic()
        } else if (advert.action === 'preSaleList') {
          this.toPresale()
        } else if (advert.action === 'tryList') {
          this.toTry()
        } else if (advert.action === 'groupList') {
          this.toGroup()
        } else if (advert.action === 'keySearch') {
          this.toKeySearch()
        } else if (advert.action === 'cateList') {
          this.toCateList()
        } else if (advert.action === 'sign') {
          this.toSign()
        } else if (advert.action === 'nearbyStore') {
          this.toNearbyStore()
        } else if (advert.action === 'storeList') {
          this.toStoreList()
        } else if (advert.action === 'nearStoreList') {
          this.toNearShopList()
        } else if (advert.action === 'pointMall') {
          this.toPointMall()
        } else if (advert.action === 'customizeUrl') {
          this.toCustomizeUrl(advert.texts.url)
        } else if (advert.action === 'storePanicList') {
          this.toStorePanicList()
        } else {
          this.$router.push({ path: '/spunotfind' })
          return
        }
      },
      // 跳转商品详情页
      toSkuDetail(item) {
        if (item.actionParamId !== 0 && !item.actionParamId) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        }
        let path = '/spudetail'
        let query = { id: item.actionParamId, storeId: item.storeId, sourceType: item.sourceType || 1 }
        this.$router.push({ path, query })
      },
      // 查询店铺首页配置
      queryMobileIndex(storeId) {
        let that = this
        mobileIndex(storeId).then((res) => {
          that.floors = res
        })
      },
      // 查询店铺信息
      queryStoreInfo(storeId) {
        let that = this
        let postMethod = this.$route.query.isAgencyStore ? queryStoreInfo : queryAgencyStore
        postMethod(storeId).then((res) => {
          if (res.data) {
            that.storeInfo = res.data
            if (that.storeInfo.status == 4) {
              that.isClose = true
            } else {
              that.isClose = false
            }
          }
        })
      },
      // 切换分类
      changeTab(index) {
        this.tabIndex = index
        this.$nextTick(() => {
          this.$refs.shopListModule.resetData()
        })
      },
      toBack() {
        // isBack字段记录是否内部跳转进来的，后续有内部跳转需携带此参数
        if (window.history.state) {
          this.$router.back(-1)
        } else {
          if (this.$store.getters.phoneType == 'IOS') {
            window.webkit.messageHandlers.finishActivity.postMessage('')
          } else {
            window.ws.finishActivity()
          }
        }
      },
      // 跳转到搜索页面
      toSearch() {
        this.$router.push({ path: '/search', query: { storeId: this.storeId } })
      },
      // 跳转到首页
      toIndex() {
        this.$router.push({ path: '/' })
      },
      // 跳转到店铺首页
      toStoreIndex() {
        this.$router.replace({ path: '/storeindex', query: { storeId: this.$route.query.storeId } })
      },
      // 跳转到店铺分类页面
      toStoreCategory() {
        this.$router.push({ path: '/storecategory', query: { storeId: this.storeId } })
      },
      // 跳转到全部商品页面
      toSpuList() {
        this.$router.push({ path: '/spulist', query: { storeId: this.storeId } })
      },
      // 联系客服
      toService() {
        let that = this
        let storeServiceConfig = undefined,
          options = {},
          data = undefined
        data = that.storeInfo
        storeServiceConfig = data.storeServiceConfig
        //  过滤值为空的字段
        Object.keys(storeServiceConfig).forEach((key) => {
          if (storeServiceConfig[key]) {
            if (key == 'staffId') {
              options.staffid = storeServiceConfig[key]
            } else {
              options[key] = storeServiceConfig[key]
            }
          }
        })
        //  options.staffid = '6014114' //指定客服
        console.log(options, '👩')
        ysf('config', {
          ...options,
          success: function() {
            ysf('open') //打开客服窗口
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  @keyframes moveDown {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, -125px, 0);
    }
  }

  @-moz-keyframes moveDown /* Firefox */ {
    from {
      -moz-transform: translate3d(0, 0, 0);
    }
    to {
      -moz-transform: translate3d(0, -125px, 0);
    }
  }

  @-webkit-keyframes moveDown /* Safari 和 Chrome */ {
    from {
      -webkit-transform: translate3d(0, 0, 0);
    }
    to {
      -webkit-transform: translate3d(0, -125px, 0);
    }
  }

  @-o-keyframes moveDown /* Opera */ {
    from {
      -o-transform: translate3d(0, 0, 0);
    }
    to {
      -o-transform: translate3d(0, -125px, 0);
    }
  }

  @keyframes moveUp {
    from {
      transform: translate3d(0, -125px, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @-moz-keyframes moveUp /* Firefox */ {
    from {
      -moz-transform: translate3d(0, -125px, 0);
    }
    to {
      -moz-transform: translate3d(0, 0, 0);
    }
  }

  @-webkit-keyframes moveUp /* Safari 和 Chrome */ {
    from {
      -webkit-transform: translate3d(0, -125px, 0);
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
    }
  }

  @-o-keyframes moveUp /* Opera */ {
    from {
      -o-transform: translate3d(0, -125px, 0);
    }
    to {
      -o-transform: translate3d(0, 0, 0);
    }
  }
  .store-empty {
    height: 100%;
    padding-top: 70px;
    .store-empty-img {
      height: 90px;
      width: 90px;
      margin: 0 auto;
      display: block;
    }
    .store-empty-text {
      font-size: 16px;
      margin-top: 6px;
      color: #666;
      line-height: 18px;
      text-align: center;
    }
  }
  .store-container {
    min-height: 100%;
    padding-top: 44px;
    background: #f5f5f5;
    // padding-top: 170px;
    // height: 100%;
    .moveDown {
      transform: translate3d(0, -125px, 0);
      animation: moveDown 0.5s;
    }
    .moveUp {
      transform: translate3d(0, 0, 0);
      animation: moveUp 0.5s;
    }
    .store-header {
      padding: 0 12px;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: #fff;
      z-index: 999;
      .store-search {
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        .store-name {
          font-size: 18px;
          color: #333;
          font-weight: 600;
          width: 130px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        i {
          width: 24px;
          height: 24px;
          display: inline-block;
          background-size: 100%;
          &.back {
            position: absolute;
            left: 12px;
            background-image: url('../../assets/img/store/back.png');
          }
          &.more {
            background-image: url('../../assets/img/store/more.png');
            position: absolute;
            right: 12px;
          }
          &.search {
            margin-top: 2px;
            margin-right: 6px;
            background-image: url('../../assets/img/store/search.png');
          }
        }
        .search-input {
          padding-left: 10px;
          display: inline-flex;
          align-items: center;
          width: 273px;
          height: 32px;
          background: #ededed;
          border-radius: 16px;
          margin: 0 auto;
          overflow: hidden;
          input {
            background: #ededed;
            width: 100%;
          }
        }
        .inputBox {
          position: relative;
          flex: 1;
          height: 1.28rem;
          border-radius: 16px;
          padding-left: 1.44rem;
          background: url('../../assets/img/search_goods.png') no-repeat 0.32rem center;
          background-size: 0.96rem;
          background-color: #ededed;
          .input {
            background-color: #ededed;
            width: 8.76rem;
            height: 100%;
          }
          input::-webkit-input-placeholder {
            color: #9d9d9d;
            font-size: 0.56rem;
          }
          input:-moz-placeholder {
            color: #9d9d9d;
            font-size: 0.56rem;
          }
          input::-moz-placeholder {
            color: #9d9d9d;
            font-size: 0.56rem;
          }
          input::-ms-input-placeholder {
            /* Internet Explorer 10+ */
            color: #9d9d9d;
            font-size: 0.56rem;
          }
        }
      }
      
      .store-categories {
        height: 45px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .categories {
          height: 100%;
          margin-right: 50px;
          position: relative;
          font-size: 16px;
          color: #000;
          display: inline-block;
          line-height: 45px;

          i {
            position: absolute;
            bottom: 6px;
            left: 0;
            width: 32px;
            height: 3px;
            background: #e60113;
            border-radius: 2px;
            overflow: hidden;
          }
        }
        .active {
          font-weight: bold;
        }
        .store-categories-btn {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .product-container {
      margin-top: -1px;
      padding: 0;
      background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 20%);
      /deep/ .guess-list {
        padding: 0 12px;
      }
    }
    .store-product-list {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
      padding-bottom: 10px;
      .store-product {
        background: #fff;
        display: inline-block;
        width: 171px;
        height: 262px;
        border-radius: 5px;
        overflow: hidden;
        margin-top: 9px;
        img {
          height: 171px;
          width: 100%;
          display: block;
        }
        .content {
          height: 91px;
          padding: 8px 10px;
          .name {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 19px;
          }
          .price {
            padding-top: 5px;
            color: #e60113;
            em {
              font-size: 12px;
            }
            span {
              font-size: 17px;
              font-weight: 500;
            }
          }
          .go-store {
            color: #888888;
            .shop {
              padding-right: 10px;
            }
          }
        }
      }
    }
  }
  .store-box {
    margin: 12px;
    padding: 12px;
    border-radius: 8px;
    background-color: #fff;
    .description {
      padding-top: 8px;
      font-size: 14px;
      color: #666666;
      line-height: 20px;
    }
  } 
  .store-title {
        
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        // height: 70px;
        
        .store-info {
          width: 100%;
          display: flex;
          align-items: center;
          .avatar {
            vertical-align: middle;
            display: inline-block;
            width: 42px;
            height: 42px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .name {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-left: 12px;
            height: 40px;
            // vertical-align: top;
            .storeName {
              font-size: 18px;
              font-weight: bold;
              color: #000;
              line-height: 20px;
            }
            .fans-num {
              padding-left: 10px;
              flex-shrink: 0;
              font-size: 14px;
              line-height: 20px;
              color: #999;
            }
            .concern-bt {
              flex-shrink: 0;
              margin-left: 10px;
              padding: 5px 8px;
              border-radius: 14px;
              font-weight: 600;
              font-size: 14px;
              line-height: 18px;
              color: #FD302C;
              border: 1px solid #FD302C;
              .van-icon-plus {
                margin-right: 4px;
              }
            }
            .in-concern {
              border-color: #999;
              color: #999;
            }
            .tag-part {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              line-height: 26px;
              .tag {
                display: inline-block;
                margin-right: 2px;
                color: #666;
                font-size: 0.4rem;
              }
              .store-type {
                vertical-align: middle;
                background: linear-gradient(277deg, #ffedf1 0%, #ed6f42 0%, #e60113 100%);
                border-radius: 2px;
                color: #fff;
                line-height: 12px;
                padding: 1px 2px;
              }
            }
          }
        }
        .store-like {
          width: 62px;
          height: 26px;
          border-radius: 13px;
          font-size: 13px;

          text-align: center;
          line-height: 26px;
          .mark {
            vertical-align: middle;
            background-image: url('../../assets/img/store/favorite.png');
            background-size: 100%;
            width: 16px;
            height: 16px;
            display: inline-block;
            margin-top: -2px;
          }
        }
        .is-attention {
          background: #fff;
          border: 1px solid #999;
          color: #999;
        }
        .no-attention {
          background: #e60113;
          color: #fff;
        }
      }
  .returntopBox {
    z-index: 3000;
    position: absolute;
    width: 100%;
    .returntop {
      width: 1.6rem;
      height: 1.6rem;
      position: fixed;
      bottom: 2.6rem;
      right: 0.48rem;
    }
  }
  .backtopactive {
    position: fixed;
    top: 0;
  }
  .img_top {
    width: 68px;
    height: 68px;
    position: fixed;
    z-index: 3;
    bottom: 120px;
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
  /deep/ .van-search__content {
    border-radius: 16px;
    padding-left: 16px;
    .van-field__control {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      &::-webkit-input-placeholder {
          color: #999;
      }
    }
      .search-icon-img {
      width: 24px;
      height: 24px;
      img {
          width: 100%;
      }
    }
    .van-search__label {
      padding: 0;
        .search-logo {
          height: 100%;
          display: flex;
          align-items: center;
          img {
              width: 40px;
              height: 15px;
          }
          &::after {
              margin: 0 11px 0 15px;
              content: '';
              display: block;
              width: 1px;
              height: 18px;
              background-color: #d8d8d8;
        }
      }
    }
  }
  .no-attention-sheet {
    padding-top: 20px;
    .van-action-sheet__header {
      position: relative;
      padding-bottom: 40px;
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      .van-action-sheet__close {
        color: #333;
        font-size: 18px;
      }
    }
    .no-attention-action {
      margin-left: 27px;
      padding-left: 39px;
      background: url(~@/assets/img/store/attention.png) no-repeat left center;
      background-size: 24px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #000;
    }
    .cancel-box {
      box-sizing: content-box;
      margin-top: 40px;
      border-top: 1px solid #F2F2F2;
      text-align: center;
      .van-button {
        border: 0;
        border: none;
        font-size: 16px;
        color: #000;
      }

    }
  }
  
</style>
