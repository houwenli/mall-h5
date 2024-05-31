<template>
  <div class="page-content">
    <div v-if="spu" class="boxwrapper" ref="boxwrpper" :class="[returntop ? 'backtopactive' : '']">
      <div v-if="loading">
        <div v-if="spu">
          <load-more class="load-box" tip="正在加载"></load-more>
        </div>
      </div>
      <div v-else>
        <!-- 头部 -->
        <div id="headerwrapper" class="headerwrapper defaultimg">
          <header-top :spuTabIndex="spuTabIndex" :shareflag="shareflag" @toPage="toPage"></header-top>
        </div>
        <!-- 商品部分 -->
        <div ref="spuPage" style="padding-top: 0px; position: relative;">
          <!-- 轮播图 -->
          <swiper-list :spu="spu" :sku="sku" :carouselPics="carouselPics" :skuImgList="skuImgList" @updateSku="updateSku"></swiper-list>
          <!-- 商品信息 -->
          <goods-info :sku="sku" :spu="spu"></goods-info>
          <!-- 商品选项 -->
          <goods-options :spu="spu" :sku="sku" :skuId="skuId" @openShowBase="openShowBase" :skuNum="skuNum"></goods-options>

          <div ref="detailPage" style="position: relative; top: -3.5rem"></div>

          <!-- 商品详情-商品介绍 -->

          <div class="goods-title">
            <img src="@/assets/img/goodsDetail/left_quan_wsf.png" alt="" />
            <span>宝贝详情</span>
            <img src="@/assets/img/goodsDetail/right_quan_wsf.png" alt="" />
          </div>
          <!-- 商品介绍 -->
          <overview-module :sku="sku" :spu="spu"></overview-module>
          <!-- 规格参数 -->
          <specifications-module :spu="spu"></specifications-module>

          <!--商品评价-->
          <div ref="assessPage" style="position: relative; top: -3.5rem"></div>
          <commentModule></commentModule>
        </div>
        <!-- 热销商品 -->
        <div ref="recommend" style="position: relative; top: -3.5rem"></div>
        <div class="xq_wntj" style="margin-top: 20px">
          <shopList :title="'热销商品'" :detailShow="true" :skuId="skuId" :botTip="'见底啦~不如去'"></shopList>
        </div>

        <!-- 底部的购买 -->
        <section class="actionbar footerbox">
          <span class="sell-out" v-if="spu.shopState === 2">抱歉，该商品已下架</span>
          <div class="action-list">
            <ul class="action-other">
              <li class="action-other-li" @click="callUp">
                <img src="@/assets/img/goodsDetail/people.png" alt />
                <span class="action-other-li-text">客服</span>
              </li>

              <li class="action-other-li" @click="handleShare">
                <img src="@/assets/img/goodsDetail/share.png" alt />
                <span class="action-other-li-text">分享</span>
              </li>
            </ul>
            <div class="red-btn" :class="{ 'red-btn-disabled': spu.shopState === 1 }" @click="openShowBase">立即购买</div>
          </div>
        </section>

        <div class="backtop" v-if="backtopshow" @click="backtop">
          <img src="@/assets/img/goodsDetail/go_top.png" alt />
          <span>顶部</span>
        </div>
      </div>
      <share :showSharePopup.sync="showSharePopup" :spu="spu" :showGuide="showGuide" :price="sku.entPurchasePrice"></share>
    </div>

    <div v-else class="empty-page">
      <div class="empty-page-header">
        <i @click="toIndex"></i>
      </div>
      <img class="empty-page-img" src="@/assets/img/cat_d@2x.png" mode="" />
      <div class="empty-page-text">抱歉，链接已失效〜</div>
      <div class="empty-page-btn" @click="toIndex">看看其他</div>
    </div>
    <!-- 商品规格弹窗 -->
    <goods-specifications-popup
      :showBase.sync="showBase"
      :skuData="skuData"
      :sku="sku"
      :storeId="spu && spu.storeId"
      :dialogType="2"
      @skuSelected="skuSelected"
      @getSpudetail="getSpudetail"
      :skuNum="skuNum"
      @updateNumber="updateNumber"
    ></goods-specifications-popup>
  </div>
</template>

<script>
  import { querySpu } from '@/api/collection'
  import { getUsersource } from '@/utils/utils'
  import { getToken } from '@/utils/token'
  import { smartOpenDeepLink } from '@/utils/hybrid'
  import { LoadMore } from 'vux'
  import headerTop from './components/headerTop.vue'
  import swiperList from './components/swiper.vue'
  import goodsInfo from './components/goodsInfo.vue'
  import goodsOptions from './components/goodsOptions.vue'
  import overviewModule from './components/overviewModule.vue'
  import specificationsModule from './components/specificationsModule.vue'
  import commentModule from './components/commentModule.vue'
  import goodsSpecificationsPopup from './components/goodsSpecificationsPopup.vue'
  import share from './components/share.vue'
  import shopList from '@/components/commons/shopList'

  export default {
    components: {
      LoadMore,
      headerTop,
      swiperList,
      goodsInfo,
      goodsOptions,
      overviewModule,
      specificationsModule,
      commentModule,
      goodsSpecificationsPopup,
      share,
      shopList,
    },
    data() {
      return {
        loading: true, // 加载中
        spu: {},
        sku: {}, //当前选中的sku
        skuId: this.$route.query.id,
        skuData: {},
        skuNum: 1, //选择的sku数量
        showBase: false, // 商品规格弹窗
        returntop: false, //回到顶部
        backtopshow: false, // 回到顶部显示隐藏
        carouselPics: [], //轮播图
        shareflag: this.$route.query.shareflag ? this.$route.query.shareflag : false, //是否是分享
        showGuide: false, //微信或者浏览器引导
        spuTabIndex: 0,
        showSharePopup: false,
      }
    },

    created() {
      console.log('父-------------created')
      this.loading = true
      this.getSpudetail()
    },
    mounted() {
      console.log('父-------------mounted')
      window.addEventListener('scroll', this.handleScroll, true)
      this.handleScroll()
    },

    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    // 兼容原生优惠券跳转电动车详情 goodsSource == 4时拦截跳转电动车详情页面
    computed: {
      skuImgList() {
        let list = (this.spu && this.spu.list) || []
        return list
          .filter((item) => item.skuState === 0)
          .map((item) => {
            return {
              url: item.url,
              skuId: item.id,
            }
          })
      },
    },
    watch: {
      backtopshow(value) {
        if (!value) this.returntop = false
      },
    },
    methods: {
      getSpudetail() {
        querySpu({ skuId: this.$route.query.id })
          .then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.spu = res.data || null
              //shopState 0有正常的sku商品可选 1是售罄的 2所有sku都是下架的
              if (this.spu.shopState === 1) {
                this.spu = null
              } else {
                this.getSkuData()
                this.$forceUpdate()
              }
              this.$toast.clear()
            } else {
              this.spu = null
            }
            this.loading = false
          })
          .catch((err) => {
            this.spu = null
          })
      },
      //获取默认选中的sku
      getSkuData() {
        console.log(this.spu, 'spu')

        let tree = this.spu.skuSpecToolList.map((item) => {
          return {
            k: item.specName,
            k_s: item.specIdStr,
            v: item.subToolList.map((subItem) => {
              return {
                id: subItem.specValueId,
                name: subItem.specValueName,
                imgUrl: subItem.url,
                previewImgUrl: subItem.url,
              }
            }),
          }
        })
        let list = this.spu.list.map((item, index) => {
          return {
            ...this.spu.skuList[index],
            ...item,
            //组件通过stock_num字段来区分sku库存，库存0则禁用，这里加上sku状态判断状态为正常取正常库存，否则库存为0 达到禁用效果
            stock_num: item.skuState === 0 ? item.stock : 0,
          }
        })
        this.skuData = {
          tree: tree,
          list: list,
        }
        let sku = list.find((item) => item.id === this.skuId)

        if (sku.skuState !== 0) {
          // 状态为上架 skuState 0正常 1售罄 2下架
          let normalSkuList = list.filter((item) => item.skuState === 0) || []
          //默认为价格最低的sku，后端已排序，直接取
          if (normalSkuList.length > 0) {
            sku = normalSkuList[0]
          }
        }
        this.sku = sku
        this.skuId = sku.skuId

        //当前选中的sku的初始数量--也就是集采最低数量
        this.sku.selectedNum = this.sku.entPurchaseNum
        //找到当前选中的sku
        this.sku = list.find((item) => {
          return item.id === this.skuId
        })

        //当前选中的sku的初始数量--也就是集采最低数量
        this.skuNum = this.sku.entPurchaseNum
        console.log(this.skuData, ' this.skuData')
        //设置sku轮播图
        this.setCarouselPics()
      },
      //切换sku规格属性
      skuSelected(selectedSku) {
        if (!selectedSku) return
        if (this.skuId == selectedSku.id) return
        this.skuId = selectedSku.id
        this.sku = selectedSku
        this.setCarouselPics()
      },
      // 切换sku
      updateSku(skuId) {
        this.skuId = skuId
        this.sku = this.skuData.list.find((item) => {
          return item.skuId === skuId
        })
        this.skuNum = this.sku.entPurchaseNum
        console.log(this.sku)
        this.setCarouselPics()
      },
      // 设置轮播图片
      setCarouselPics() {
        if (this.spu.images) {
          this.carouselPics = this.spu.images.map((image) => {
            image = image.split('?')[0]
            let imgUrl = image.split('/')
            let img = imgUrl.join('/')
            img += '?imageView2/1/w/750'
            return { img }
          })

          //若有视频，则获取sku第一张作为封面
          if (this.spu.spuVideo) {
            let spuVideoPic = this.carouselPics[0] || ''
            this.carouselPics.unshift(spuVideoPic)
          }
        }
      },
      // 显示规格值弹窗
      openShowBase() {
        if (this.spu.shopState !== 0) {
          return
        }
        this.showBase = true
      },
      // 分享
      handleShare() {
        // 方案代号: H1002 用于修复html2canvas的截屏问题
        window.pageYoffset = 0
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

        // 能力检测: 是否为内嵌H5且为新版本系统
        this.showGuide = Boolean(window.webkit && window.webkit.messageHandlers.wsShare) || Boolean(window.ws && window.ws.wsShare)
        this.showSharePopup = true
      },
      // 监听页面滚动
      handleScroll() {
        if (!this.$refs.boxwrpper) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.boxwrpper.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop)
        let headerdom = document.getElementById('headerwrapper')
        let headerbox = document.getElementById('headerbox')

        if (!headerdom || !headerdom.classList) {
          return
        }
        if (scorllTop > 10) {
          headerdom.style.position = 'fixed'
          headerbox.style.display = 'block'
          headerbox.style.height = '38px'
        } else {
          headerdom.style.position = 'fixed'
          headerbox.style.display = 'none'
        }
        if (scorllTop < 10) {
          headerdom.classList.add('headershow0', 'backwhite0', 'carWhite0')
          headerdom.classList.remove(
            'headershow1',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow10',
            'backwhite1',
            'backwhite2',
            'backwhite3',
            'backwhite4',
            'backwhite5',
            'carWhite1',
            'carWhite2',
            'carWhite3',
            'carWhite4',
            'carWhite5',
            'defaultimg'
          )
        } else if (scorllTop >= 10 && scorllTop < 30) {
          headerdom.classList.add('headershow1', 'backwhite1', 'carWhite1')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow10',
            'backwhite0',
            'backwhite2',
            'backwhite3',
            'backwhite4',
            'backwhite5',
            'carWhite0',
            'carWhite2',
            'carWhite3',
            'carWhite4',
            'carWhite5',
            'defaultimg'
          )
        } else if (scorllTop >= 30 && scorllTop < 50) {
          headerdom.classList.add('headershow2', 'backwhite2', 'carWhite2')
          headerdom.classList.remove(
            'headershow0',
            'headershow1',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow10',
            'backwhite0',
            'backwhite1',
            'backwhite3',
            'backwhite4',
            'backwhite5',
            'carWhite0',
            'carWhite1',
            'carWhite3',
            'carWhite4',
            'carWhite5'
          )
        } else if (scorllTop >= 50 && scorllTop < 70) {
          headerdom.classList.add('headershow3', 'backwhite3', 'carWhite3')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow1',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow10',
            'backwhite0',
            'backwhite1',
            'backwhite2',
            'backwhite4',
            'backwhite5',
            'carWhite0',
            'carWhite1',
            'carWhite2',
            'carWhite4',
            'carWhite5'
          )
        } else if (scorllTop >= 70 && scorllTop < 90) {
          headerdom.classList.add('headershow4', 'backwhite4', 'carWhite4')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow1',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow10',
            'backwhite0',
            'backwhite1',
            'backwhite2',
            'backwhite3',
            'backwhite5',
            'carWhite0',
            'carWhite1',
            'carWhite2',
            'carWhite3',
            'carWhite5'
          )
        } else if (scorllTop >= 90 && scorllTop < 110) {
          headerdom.classList.add('headershow5', 'backwhite5', 'carWhite5')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow1',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow10',
            'backwhite0',
            'backwhite1',
            'backwhite2',
            'backwhite3',
            'backwhite4',
            'carWhite0',
            'carWhite1',
            'carWhite2',
            'carWhite3',
            'carWhite4'
          )
        } else if (scorllTop >= 130 && scorllTop < 150) {
          headerdom.classList.add('headershow6')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow1',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow10',
            'backwhite5',
            'carWhite5'
          )
        } else if (scorllTop >= 170 && scorllTop < 190) {
          headerdom.classList.add('headershow7')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow1',
            'headershow8',
            'headershow9',
            'headershow10'
          )
        } else if (scorllTop >= 190 && scorllTop < 210) {
          headerdom.classList.add('headershow8')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow1',
            'headershow9',
            'headershow10'
          )
        } else if (scorllTop >= 210 && scorllTop < 230) {
          headerdom.classList.add('headershow9')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow1',
            'headershow10'
          )
        } else if (scorllTop >= 230) {
          headerdom.classList.add('headershow10')
          headerdom.classList.remove(
            'headershow0',
            'headershow2',
            'headershow3',
            'headershow4',
            'headershow5',
            'headershow6',
            'headershow7',
            'headershow8',
            'headershow9',
            'headershow1',
            'backwhite0',
            'backwhite1',
            'backwhite2',
            'backwhite3',
            'backwhite4',
            'backwhite5',
            'carWhite0',
            'carWhite1',
            'carWhite2',
            'carWhite3',
            'carWhite4',
            'carWhite5'
          )
        }
        // 评价盒子距离顶部的高度
        // let detailBox = this.$refs.detailBox.getBoundingClientRect().top - 44 // 盒子距顶部高度
        // if (detailBox <= 0) this.backtopshow = true
        if (scorllTop >= 2500) this.backtopshow = true
        else this.backtopshow = false

        // 处理顶部tab切换
        this.dealTabChange()
      },
      dealTabChange() {
        // 防止tab事件和滚动事件交叉
        if (this.cancelScroll) {
          return
        }
        if (this.$refs.spuPage.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 0
        }
        if (this.$refs.detailPage.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 1
        }
        if (this.$refs.assessPage.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 2
        }
        if (this.$refs.recommend.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 3
        }
      },
      // 顶部tab切换
      toPage(spuTabIndex) {
        this.$emit('toPage', this.tabIndex)
        this.spuTabIndex = spuTabIndex
        if (this.spuTabIndex === 0) {
          this.$refs.spuPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        if (this.spuTabIndex === 1) {
          this.$refs.detailPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        if (this.spuTabIndex === 2) {
          this.$refs.assessPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        if (this.spuTabIndex === 3) {
          this.$refs.recommend.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }

        // tab缓动大概700ms
        this.cancelScroll = true
        setTimeout(() => {
          this.cancelScroll = false
        }, 700)
      },
      updateNumber(num) {
        this.skuNum = num
      },
      // 回到顶部
      backtop() {
        this.returntop = this.backtopshow
      },
      toIndex() {
        // 跳转智慧生活首页
        let usersource = getUsersource() //判断那个端
        if (!getToken()) {
          //未登录
          if (usersource == 11) {
            //智慧生活APP
            smartOpenDeepLink('wsf://app/login')
          } else {
            this.$router.push({ path: '/login', query: { url: `${location.pathname + location.search}` } })
            return
          }
        } else {
          switch (usersource) {
            case 4:
              //电商H5
              this.$router.push({
                path: '/',
              })
              break
            case 11:
              //智慧生活APP
              smartOpenDeepLink('wsf://app/pagehome?tab=home')
              break
            default:
              //其他APP内嵌智慧生活H5
              window.location.href = `${process.env.SMART_PAGE_DOMAIN}/home`
              break
          }
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
  @import '~@/components/spus/imgUi.less';
  .action_width {
    width: 90px;
  }
  .richText {
    padding: 14px 12px 4px;
    /deep/ img {
      max-width: 100%;
    }
    /deep/ table {
      border-bottom: solid 1px #000;
      border-left: solid 1px #000;
      min-width: 100%;
      td {
        border-top: solid 1px #000;
        border-right: solid 1px #000;
      }
    }
    /deep/ em {
      font-style: italic;
    }
    /deep/ ol {
      li {
        list-style-type: decimal;
        list-style-position: inside;
      }
    }
    /deep/ ul {
      list-style-type: disc;
      li {
        list-style-type: inherit;
        list-style-position: inside;
      }
    }
    /deep/ blockquote {
      display: block;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 40px;
      margin-inline-end: 40px;
    }
    /deep/ video {
      max-width: 100%;
    }
    /deep/ p {
      word-break: break-word;
    }
  }
  .page-content {
    min-height: 100%;
    background: #f6f6f6;
    .load-box {
      margin: 0 auto;
      padding-top: 50%;
    }
  }
  .boxwrapper {
    padding-bottom: 54px;
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
  .left-price-wraaper {
    display: flex;
    align-items: flex-end;
  }
  .performate-point {
    display: inline-block;
    margin-left: 8px;
    margin-bottom: 4px;
    border: 1px solid #fd302c;
    border-radius: 2px;
    padding: 1px 4px;
    color: #fd302c;
    font-size: 10px;
    font-weight: normal;
    line-height: 12px;
    &.isblock {
      // display: block;
      margin-bottom: 15px;
      margin-left: 0;
      width: fit-content;
    }
  }

  .copun-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    .copun-icon {
      height: 24px;
      background: rgba(255, 190, 12, 0.1);
      border-radius: 4px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #ff450c;
      line-height: 17px;
      padding: 0px 6px;
    }
    .right {
      display: flex;
      align-items: center;
      color: #ff450c;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  // .details-colortype .fourth-cell .spu_price {
  .spu_price {
    color: #ff450c;
    font-size: 0.64rem;
    font-weight: bold;
    display: flex;
    .spu_price_btn_yuan {
      display: flex;
      align-items: baseline;
      height: 28px;
      line-height: 28px;
      > .spu_price_btn_icon {
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
      }
      > .spu_price_btn_pre_price {
        font-size: 30px;
        font-family: AlternateBold;
        font-weight: bold;
        white-space: nowrap;
      }
      > .spu_price_btn_dian_price {
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
      }
    }
    .coin {
      font-size: 18px;
      font-weight: bold;
    }
    .spu_price_btn {
      display: flex;
      margin-left: 4px;
      padding: 2px 8px;
      color: #fff;
      font-weight: normal;
      width: fit-content;
      height: 28px;
      line-height: 24px;
      background: #ff450c;
      border-radius: 15px 15px 15px 2px;
      align-items: baseline;
      .spu_price_btn_text {
        font-size: 11px;
        font-weight: bold;
        color: #ffffff;
      }
      .spu_price_btn_icon {
        font-size: 13px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ffffff;
      }
      .spu_price_btn_pre_price {
        font-size: 20px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ffffff;
        // line-height: 26px;
      }
      .spu_price_btn_dian_price {
        font-size: 13px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #ffffff;
      }
    }
    .active-price {
      // color: #999999;
      // font-size: 14px;
      // position: relative;
      // margin-left: 4px;
      // display: block;
      display: flex;
      align-items: baseline;
      height: 20px;
      line-height: 20px;
      margin-top: 8px;
      margin-left: 3px;
      > div {
        display: flex;
        position: relative;
        align-items: baseline;
        .spu_price_btn_icon {
          font-size: 11px;
          font-family: AlternateBold;
          font-weight: bold;
          color: #c3c3c3;
        }
        .spu_price_btn_pre_price {
          font-size: 16px;
          font-family: AlternateBold;
          font-weight: bold;
          color: #c3c3c3;
        }
        .spu_price_btn_dian_price {
          font-size: 11px;
          font-family: AlternateBold;
          font-weight: bold;
          color: #c3c3c3;
        }
        .line {
          width: 100%;
          height: 1px;
          background-color: #999999;
          position: absolute;
          top: 50%;
        }
      }
    }
  }
  .copun-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .copun-list-wrapper {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 12px;
      .copun-detail-box {
        text-align: center;
        .real-price {
          display: inline-block;
          background: #ffe4e7;
          border: 1px solid #ffb1b8;
          border-radius: 4px;
          padding: 10px 16px;
          color: #e60113;
          font-size: 12px;
          margin-top: 24px;
          min-width: 100px;
          > p:first-child {
            font-size: 18px;
            font-weight: bold;
          }
        }
        .choose-detail {
          border: 1px solid #e60113;
          margin-top: 12px;
          border-radius: 14px;
          padding: 24px 52px 32px;
          height: 212px;
          .choose-title {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            margin-bottom: 16px;
          }
          .reduce-detail {
            font-size: 18px;
            color: #e60113;
            font-weight: bold;
            margin-bottom: 16px;
          }
          .choose-detail-wrapper {
            display: flex;
            justify-content: space-between;
            > div {
              background: #ffe4e7;
              border: 1px solid #ffb1b8;
              border-radius: 4px;
              padding: 10px 6px;
              color: #e60113;
              font-size: 12px;
              min-width: 100px;
              margin-right: 12px;
              > p:first-child {
                font-size: 16px;
                font-weight: bold;
              }
            }
          }
          .no-use-tip {
            margin-top: 60px;
            color: #999;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
  .copun-use-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fef4f4;
    margin-top: 12px;
    padding: 30px 18px;
    border-radius: 10px;
    position: relative;
    &.no-use {
      background: #f2f2f2;
      .top-icon {
        color: #fff;
        font-size: 10px;
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 18px;
        background: url('~@/assets/img/copun-gery-icon-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
      }
      .left {
        .cost-money {
          color: #999;
        }
        .use-condition {
          .condition-price {
            color: #999;
          }
          .condition-time {
            color: #999;
          }
          .dis-reson {
            font-size: 11px;
            color: #999;
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
          }
        }
      }
    }
    .top-icon {
      color: #fff;
      font-size: 10px;
      position: absolute;
      top: 0;
      left: 0;
      width: 50px;
      height: 18px;
      background: url('~@/assets/img/copun-icon-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
    }
    .left {
      display: flex;
      align-items: center;
      .cost-money {
        color: #e60113;
        font-size: 14px;
        margin-right: 18px;
        font-weight: bold;
        .price {
          font-size: 32px;
          line-height: 38px;
          &.bigPrice {
            font-size: 22px;
          }
        }
      }
      .use-condition {
        flex: 1;
        overflow: hidden;
        .condition-price {
          font-size: 12px;
          color: #000;
          font-weight: bold;
        }
        .condition-time {
          font-size: 11px;
          color: #666;
        }
      }
    }
    .right {
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .copun-title {
    font-size: 16px;
    color: #000;
    padding-left: 8px;
  }
  .handle-sure-btn {
    font-size: 14px;
    color: #fff;
    background: #e60113;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
  }
  .spu-desc {
    word-break: break-all;
  }
  .addresspop {
    background-color: #f6f6f6;
    height: 522px;
    overflow: hidden;
    position: relative;
    &-close {
      width: 27px;
      height: 20px;
      background-size: 100% 100%;
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
      position: absolute;
      right: 12px;
      top: 12px;
    }
    &-title {
      text-align: center;
      font-size: 16px;
      line-height: 46px;
    }
    &-content {
      position: absolute;
      top: 46px;
      bottom: 82px;
      left: 0;
      right: 0;
      overflow: scroll;
    }
    &-location {
      width: 351px;
      height: 65px;
      background-color: #ffffff;
      margin: 0 auto;
      display: flex;
      align-items: center;
      border-radius: 12px;
      padding: 12px 0;
      &__icon {
        width: 16px;
        height: 16px;
        background-size: 100% 100%;
        background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-location-2x.png);
        margin: 10px;
      }
      &__content {
        width: 257px;
      }
      &__content-top {
        display: flex;
        align-items: center;
      }
      &__desc {
        width: 48px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 2px;
        background-color: rgba(255, 231, 235, 0.5);
        font-size: 10px;
        color: #ff0a35;
        display: flex;
        align-items: center;
      }
      &__address-detail {
        width: 205px;
        line-height: 20px;
        color: #191919;
        font-size: 16px;
        font-weight: bold;
        margin: 0 0 0 4px;
      }
      &__address {
        width: 257px;
        line-height: 17px;
        font-size: 13px;
        color: #999;
        margin: 4px 0 0 0;
      }
      &__retry {
        font-size: 10px;
        color: #ff0a35;
        margin: 0 0 0 10px;
      }
    }
    &-list {
      width: 351px;
      background-color: #ffffff;
      margin: 10px auto 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-radius: 12px;
      padding: 12px 0;
      &__every {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 20px 0 0;
      }
      &__every-first {
        margin-top: 0;
      }
      &__check {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #c3c3c3;
        margin: 10px;
      }
      &__checked {
        width: 16px;
        height: 16px;
        background-size: 100% 100%;
        background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png);
        margin: 10px;
      }
      &__content {
        width: 307px;
      }
      &__address-detail {
        width: 100%;
        line-height: 20px;
        font-size: 16px;
        font-weight: bold;
        color: #191919;
      }
      &__address {
        width: 100%;
        font-size: 13px;
        color: #999999;
        margin-top: 4px;
      }
    }
    &-add {
      width: 100%;
      padding: 4px 0 38px;
      background-color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      &__btn {
        width: 351px;
        height: 40px;
        line-height: 40px;
        background-image: linear-gradient(90deg, rgba(255, 95, 46, 1) 0, rgba(255, 10, 53, 1) 100%);
        border-radius: 20px;
        margin: 0 auto;
        text-align: center;
        color: #fff9e9;
        font-size: 16px;
      }
    }
    &-empty {
      &__flag {
        width: 160px;
        height: 160px;
        margin: 72px auto 0;
        background-size: 100% 100%;
        background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-blank-2x.png);
      }
      &__desc {
        line-height: 17px;
        font-size: 13px;
        text-align: center;
        color: #444444;
        margin-top: 8px;
      }
    }
  }

  .active {
    width: 327px;
    height: 32px;
    background-image: linear-gradient(90deg, #f4faff 0%, #fff2f2 50%, #fff9e9 100%);
    border-radius: 16px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .active-content {
      display: flex;
      align-items: center;
    }
    .active-hot {
      width: 24px;
      height: 24px;
    }
    .active-word {
      color: #ff450c;
      font-size: 13px;
      width: 230px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 8px;
    }
    .active-check {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
  .tag-pannel {
    display: flex;
    margin-bottom: 10px;
    .tag-list {
      display: flex;
    }
    .tag-every {
      // border: 1px solid #FF5F2E;
      border: 1px solid transparent;
      overflow: hidden;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      padding: 1px;

      border-radius: 4px;
      font-size: 10px;
      line-height: 10px;
      margin-right: 4px;
      background: rgba(255, 190, 12, 0.1);
      .tag-inner {
        font-weight: 400;
        padding: 3px 6px;
        border-radius: 4px;
        color: #ff450c;
        line-height: 17px;
        font-size: 13px;
      }
    }
  }
  .performance {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
    border-radius: 4px;
    img {
      width: 16px;
      height: 16px;
    }
    .num-pannel {
      color: #008864;
      font-size: 11px;
      .num {
        font-size: 11px;
        font-weight: bold;
      }
    }
  }

  .boxwrapper /deep/ .van-sku-header__goods-info {
    justify-content: flex-start;
  }
  .sku-box {
    height: 440px;
    /deep/ .van-sku-header__img-wrap {
      img {
        object-fit: fill !important;
      }
    }

    /deep/ .van-sku-header-item {
      font-size: 13px;
      color: #999;
    }
    /deep/.van-sku-row__item-img {
      display: none;
    }
    /deep/ .van-sku-row__title {
      font-size: 13px;
      color: #191919;
      padding-bottom: 8px;
    }

    /deep/ .van-sku-row__item--active {
      box-shadow: 0px 0px 0px 0.5px #ff450c;
      color: #ff450c;
    }
    /deep/ .van-sku-row__item--active::before {
      background: rgba(255, 69, 12, 0.06);
      opacity: 1;
    }

    /deep/ .van-sku-row__item-name {
      font-weight: 400;
      padding: 6px 12px 5px;
      line-height: 17px;
    }

    /deep/ .van-sku-stepper-stock {
      padding: 4px 16px;
    }

    /deep/ .van-popup__close-icon {
      top: 15px;
      right: 12px;
      width: 27px;
      height: 20px;
      background: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png) no-repeat;
      background-size: 100% 100%;

      &::before {
        display: none;
      }
    }
    /deep/ .van-sku-header__img-wrap {
      width: 102px;
      height: 102px;
    }
    /deep/ .van-sku-header__img-wrap img {
      border-radius: 8px;
    }

    /deep/ .van-stepper__minus,
    /deep/ .van-stepper__plus {
      height: 14px;
      width: 14px;
      background-color: transparent;
    }
    /deep/ .van-stepper__input {
      width: 27px;
      height: 22px;
      background-color: #f6f6f6;
      font-size: 13px;
      font-weight: bold;
      color: #191919;
      margin: 0 7px;
      border-radius: 4px;
      font-family: DINAlternate-Bold, DINAlternate;
    }

    /deep/ .van-hairline--bottom::after {
      border: none;
    }
    /deep/.van-button {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #191919;
      line-height: 20px;
    }
    .yellow_car_btn {
      color: #191919;
      background-color: #ffbe0c;
    }
    .white_car_btn {
      border: 1px solid #191919 !important;
      color: #191919 !important;
      background: #fff !important;
    }
    .white_car_btn_disabled {
      border: 1px solid #eeeeee !important;
      color: #c3c3c3 !important;
    }
  }

  .chooseInfo /deep/ .two-line-ellipsis {
    height: auto;
    .van-cell__value {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      white-space: unset;
      height: auto;
      max-height: 34px;
    }
  }

  .get-money,
  .distriCommonBtn {
    span {
      color: #191919 !important;
    }
  }
  .car_shadow {
    box-shadow: 0px 0px 0px 0.5px #191919;
  }
  .red-btn {
    flex: 1;
    background: linear-gradient(270deg, #fe3040 0%, #ff8011 100%);
    border-radius: 20px;
    height: 40px;
    color: #ffffff;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight: 500;
  }

  .red-btn-disabled {
    background: #eeeeee;
    color: #c3c3c3;
  }
</style>
