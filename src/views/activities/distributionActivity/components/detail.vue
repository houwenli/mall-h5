<template>
  <!--商品链接存在 -->
  <div v-if="spu" class="boxwrapper" ref="boxwrpper" :class="[returntop ? 'backtopactive' : '']">
    <div v-if="loading">
      <!-- <div v-if="noDetail"> -->
      <nofund :noData="true" :title="'商品详情'" v-if="noDetail"></nofund>
      <div v-if="spu">
        <load-more style="margin: 50% auto" tip="正在加载"></load-more>
      </div>
    </div>
    <div v-else class="details" :style="shelvesStatus == '1'?'padding-bottom:0.8rem':''">
      <div>
        <!-- 商品头部-->
        <div id="headerwrapper" class="headerwrapper defaultimg">
          <header class="headerbox">
            <div class="search-left" @click="toBack">
              <span class="iconback">
                <i class="backimg"></i>
              </span>
            </div>
            <group class="search-group">
              <tab v-model="spuTabIndex" custom-bar-width="2.4rem" class="header-tabBar">
                <tab-item @click.native="toPage">商品</tab-item>
                <tab-item @click.native="toPage">详情</tab-item>
              </tab>
            </group>
          </header>
        </div>
        <!-- 商品内容-->
        <div ref="spuPage" style="margin-bottom: 2rem; padding-top: 0px; position: relative">
          <!-- 商品轮播图 -->
          <van-swipe class="my-swipe" indicator-color="white" @change="onChange" loop style="height:375px">
            <van-swipe-item v-for="(item, index) in carouselPics" :key="index">
              <img
                src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2c523a830be84b6436fa80fffc125a16.png"
                v-if="current == 0 && spu.spuVideo && isPlayer"
                @click="playVideo()"
                alt=""
                class="iconPlay"
              />
              <video
                :controls="controlsShow"
                style="object-fit: unset"
                :src="spu.spuVideo"
                :poster="spu.spuVideoPic"
                webkit-playsinline="true"
                x-webkit-airplay="true"
                playsinline="true"
                x5-video-player-type="h5"
                x5-video-orientation="h5"
                x5-video-player-fullscreen="true"
                preload="none"
                class="bannerVideo"
                v-if="current == 0 && spu.spuVideo"
                @ended="endVideo()"
                id="videoBanner"
              ></video>
              <img :src="item.img" alt="" @click="openImg()" style="width:100%;height:375px" />
            </van-swipe-item>

            <template #indicator>
              <div class="custom-indicator">{{ current + 1 }}/{{ carouselPics.length }}</div>
            </template>
          </van-swipe>

          <!-- 商品简介-->
          <div class="details-colortype">
            <div class="fourth-cells">
              <div class="fourth-cell">
                <!-- 价格 -->
                <div class="product-price price_p">
                  <span class="spu_price" v-if="shelvesStatus == '1'">
                    <!-- <span style="margin-right:10px">首单特惠</span> -->
                    <span style="font-size: 0.72rem; margin-top: 0.28rem">¥</span>
                    <span style="font-size: 1.4rem; line-height: 1.4rem">{{ skuPriceInt(spu.price, 'sku') }}</span>
                    <span style="font-size: 0.8rem; line-height: 0.8rem; display: inline-block; margin-top: 0.28rem">
                      {{ '.' + skuPriceFloat(spu.price, 'sku') }}
                    </span>
                    <span
                      style="margin-left: 10px;padding: 5px 11px;color: #FFFFFF;font-size: 14px;display: inline-block; margin-top: 0.28rem;background: linear-gradient(90deg, #FF5B10 0%, #E60113 100%);border-radius: 13px;"
                    >
                      赚{{ spu.preCommission }}
                    </span>
                  </span>
                  <span class="no-price" v-else>暂无报价</span>
                </div>
                <!-- 名称 -->
                <div class="product-title">
                  {{ spu.name }}
                </div>
                <!-- 描述 -->
                <div class="product-sub">{{ spu.subTitle }}</div>
              </div>
            </div>
          </div>

          <!-- 商品详情分割  -->
          <div ref="detailPage" style="position: relative; top: -1.64rem"></div>

          <!-- 商品详情   min-height: 85vh;-->
          <div class="tab-details" style="margin-top: 0.4rem" ref="detailBox">
            <p class="xq_title">
              <span class="xq"></span>
              <span style="vertical-align: top">详情</span>
            </p>
            <p class="xq_spjs" v-if="spu.video">商品介绍</p>
            <!-- 商品介绍 -->
            <div>
              <div class="clearfix">
                <!-- 视频 -->
                <video
                  controls
                  v-if="spu.video"
                  style="width: 100%; height: 9rem; object-fit: fill"
                  :src="spu.video"
                  :poster="spu.videoPic"
                  webkit-playsinline="true"
                  x-webkit-airplay="true"
                  playsinline="true"
                  x5-video-player-type="h5"
                  x5-video-orientation="h5"
                  x5-video-player-fullscreen="true"
                  preload="auto"
                ></video>
                <!-- 图片 -->
                <div>
                  <template v-for="(item, index) in spu.imageUrlList">
                    <img :src="item" alt="" :key="index" width="100%" />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 商品规格 -->
          <div class="tab-details xq_spgg" style="margin-top: 0.4rem">
            <p class="xq_spjs">商品规格</p>
            <div class="clearfix">
              <table class="table-border" width="100%">
                <tbody v-if="!showup">
                  <tr v-for="(attribute, index) in spuAttributeValuesdata" :key="index">
                    <td style="color: #999">{{ attribute.attributeName }}</td>
                    <td style="color: #666">{{ attribute.attributeValue }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(attribute, index) in allspuAttributeValuesdata" :key="index">
                    <td style="color: #999">{{ attribute.attributeName }}</td>
                    <td style="color: #666">{{ attribute.attributeValue }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="updownBox" v-if="allspuAttributeValuesdata.length > 7">
                <p class="updown">
                  <span class="up" :class="[showup ? 'upimg' : 'downimg']" @click="showdown">{{ downOrup }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- 底部的立刻分享 -->
          <section class="actionbar footerbox">
            <span class="sell-out" v-if="shelvesStatus !== '1'">抱歉，该商品已下架</span>
            <div class="action-list" v-else>
              <a @click="shareComm" class="item footerCommon" style="background: #FFA000;">
                立刻分享
              </a>
            </div>
          </section>
        </div>
      </div>

      <!-- 回到顶部 -->
      <div class="backtop" ref="backtop" v-if="backtopshow" @click="backtop">
        <img src="@/assets/img/top@2x.png" class="imgtop" alt />
      </div>
    </div>
    <!-- 海报图片 -->
    <div v-show="posterShow" class="saveImg">
      <van-image :src="posterImg" />
    </div>
    <!-- 分享面板 -->
    <van-share-sheet
      v-model="showShare"
      class="custome-share"
      title="分享至"
      :close-on-click-overlay="true"
      :lock-scroll="false"
      :options="options"
      @select="onSelect"
      @cancel="clonse"
      @click-overlay="clonse"
    ></van-share-sheet>

    <!-- 加载提示 -->
    <div class="share-poster-loading" v-show="showLoading == true">
      <van-loading color="#fff" size="0.96rem" vertical>加载中...</van-loading>
    </div>
  </div>
  <!-- 商品链接失效 -->
  <div v-else class="empty-page">
    <div class="empty-page-header">
      <i @click="goIndex"></i>
    </div>
    <img class="empty-page-img" :src="emptyImg" mode="" />
    <div class="empty-page-text">抱歉，链接已失效〜</div>
    <div class="empty-page-btn" @click="goIndex">看看其他</div>
  </div>
</template>

<script>
  import { Cell, Group, Swiper, Tab, TabItem, LoadMore } from 'vux'
  import { visit } from '@/api/visit'
  import { Button, Icon, Popup, Rate, Sku, Stepper, Toast, Loading, ImagePreview, Swipe, SwipeItem } from 'vant'
  import emptyImg from '@/assets/img/cat_d@2x.png'
  import nofund from '@/components/commons/nofund'
  import { getQuerySpuDetail } from '@/api/activities/distributionActivity'
  import mixins from '@/mixins/activities/distributionActivity.js'
  export default {
    mixins: [mixins],
    components: {
      Group,
      Cell,
      Tab,
      TabItem,
      Swiper,
      LoadMore,
      [Icon.name]: Icon,
      [Toast.name]: Toast,
      [Rate.name]: Rate,
      [Stepper.name]: Stepper,
      [Sku.name]: Sku,
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Loading.name]: Loading,
      [ImagePreview.name]: ImagePreview,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      nofund,
    },
    data() {
      return {
        isH5: this.$store.state.userSource || 1,
        posterShow: false,
        posterImg: '',
        shareflag: this.$route.query.shareflag ? this.$route.query.shareflag : '',
        showLoading: false, //加载
        emptyImg: emptyImg, //商品链接失效
        postMainImg: null, //海报图片
        postSpuName: null,
        shareImgUrl: '',
        qrCodeImgUrl: '',
        showShareType: -1,
        showShare: false,
        loading: true, // 加载中
        spuTabIndex: 0, // 当前tab的选中  0 商品 1 评价 2 详情
        carouselPics: [], // 轮播图片
        spu: {}, // 商品信息
        specs: [], // 商品下的规格信息
        allskus: [], //商品下所有的单品
        specPathInfo: {}, // 规格值的路径 用于计算规格值的激活
        specSplitter: '\u2299', // 分隔符
        skuDetailTab: 0, //商品详情里面的介绍和规格的切换 0 介绍 1 规格
        isRefreshSpec: true, //是否更新商品规格，默认为true，防止点击规格重新查询并渲染页面造成闪烁
        showup: false, // 显示商品规格展开、收起
        spuAttributeValuesdata: '', // 截取商品规格
        allspuAttributeValuesdata: '', // 所有商品规格
        downOrup: '展开', // 展开收起
        sku: {
          list: [],
        },
        shelvesStatus: '', // 0下架 1上架 2违规下架
        skuId: this.$route.query.id ? this.$route.query.id : '', //商品id
        spuId: this.$route.query.spuId ? this.$route.query.spuId : '',
        flag: false,
        noDetail: false,
        current: 0, // 自定义指示器
        controlsShow: false, // 视频控制器
        isPlayer: true,
        backtopshow: false,
        returntop: false,
        shareType: 1,
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.loading = true
      //获取商品详情
      this.querySpuDetail(this.skuId)
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
      this.handleScroll()
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    watch: {
      backtopshow(value) {
        if (!value) this.returntop = false
      },
    },
    methods: {
      onChange(index) {
        this.current = index
        if (index == 0) {
          this.controlsShow = false
          this.isPlayer = true
        }
      },
      visitFun(properties) {
        let data = {
          route: this.$route.path,
          routeName: '商品详情页',
          userId: this.$store.getters.userId,
        }
        visit(data, properties)
      },
      // 去首页
      goIndex() {
        this.$router.push({ path: '/distributionActivity' })
      },
      // 监听页面滚动
      handleScroll() {
        if (!this.$refs.boxwrpper) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.boxwrpper.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop)
        let headerdom = document.getElementById('headerwrapper')
        if (!headerdom || !headerdom.classList) {
          return
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
        if (scorllTop >= 2200) this.backtopshow = true
        else this.backtopshow = false
      },
      // 回到顶部
      backtop() {
        if (this.backtopshow) this.returntop = true
        else this.returntop = false
      },
      // 展开收起商品规格
      showdown() {
        this.showup = !this.showup
        if (this.showup) {
          this.downOrup = '收起'
        } else {
          this.downOrup = '展开'
        }
      },
      // 查询商品详情信息
      querySpuDetail(id) {
        let params = {
          skuId: id,
        }
        getQuerySpuDetail(params)
          .then((res) => {
            //加载按钮
            this.loading = false
            let { spuId, id, storeId } = res.data
            this.visitFun({ spuId, skuId: id, storeId })

            //详情
            this.spu = res.data
            // 设置轮播图片
            if (this.spu.images) {
              this.carouselPics = this.spu.images.map((image) => {
                image = image.split('?')[0]
                let imgUrl = image.split('/')
                let img = imgUrl.join('/')
                img += '?imageView2/1/w/750'
                return { img }
              })
              //视频
              if (this.spu.spuVideo) {
                let spuPic = this.spu.spuVideoPic ? this.spu.spuVideoPic : this.spu.images[0] //this.spu.images[0]
                this.carouselPics.unshift({ img: spuPic })
                this.spu.spuVideoPic = spuPic
              }
            }
            //是否下架
            this.shelvesStatus = res.data.shelvesStatus

            //商品规格
            this.allspuAttributeValuesdata = res.data.spuAttributeValues || []
            if (this.allspuAttributeValuesdata.length > 7) {
              this.spuAttributeValuesdata = res.data.spuAttributeValues.slice(0, 7)
            } else {
              this.spuAttributeValuesdata = res.data.spuAttributeValues
            }
            return res
          })
          .catch((err) => {
            this.spu = null
          })
      },
      //返回上一页
      toBack() {
        this.$router.go(-1)
      },
      // 顶部tab切换
      toPage() {
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
      },
      //商品图片放大
      openImg() {
        let imgList = this.carouselPics.map((item) => {
          return item.img
        })
        ImagePreview({
          images: imgList,
          closeable: true,
        })
      },
      //商品和促销--测试
      skuPriceInt(data, name) {
        let price = 0
        if (data) {
          price = data
          if (name == 'sku') {
            price = price.toFixed(2).split('.')[0]
          } else if (name == 'spec') {
            sessionStorage.setItem('lastPrice', price)
            price = price && price.split('.')[0]
          }
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice ? lastPrice.split('.')[0] : 0
        }
        return price
      },
      skuPriceFloat(data, name) {
        let price = '00'
        if (data) {
          price = data
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice
        }
        if (name == 'sku') {
          price = price.toFixed(2).split('.')[1]
        } else if (name == 'spec') {
          sessionStorage.setItem('lastPrice', price)
          price = price.split('.')[1]
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice ? lastPrice.split('.')[1] : '00'
        }
        return price
      },
      // 开始播放
      playVideo() {
        document.getElementById('videoBanner').play()
        this.controlsShow = true
        this.isPlayer = false
      },
      // 播放结束
      endVideo() {
        this.controlsShow = true
      },

      // 分享方式入参
      getShareData(key) {
        let share
        switch (key) {
          case 3:
            share = {
              imgUrl: this.posterImg,
              platformTag: 5, //5= 保存图片
            }
            break
          case 4:
            share = {
              imgUrl: this.posterImg,
              platformTag: 3, //3= 微信好友
              shareType: 3, //3=分享图片
            }
            break
          default:
            break
        }
        return { sharePlatformList: [share] }
      },
      //分享商品/列表
      shareComm() {
        this.posterImg = ''
        this.shareType = 1
        this.isShare(this.spu)
      },

      //分享方式  微信  海报
      onSelect(option) {
        switch (option.type) {
          case 2:
            this.getCreateShareCode(this.spu, 2)
            break
          case 3:
          case 4:
            let shareData = this.getShareData(option.type)
            this.sharePro(shareData)
            break
          default:
            break
        }
      },
      clonse() {
        this.showShare = false
        this.posterImg = ''
        this.posterShow = false
      },
    },
    computed: {
      options() {
        if (this.shareType == 1) {
          return [{ name: '分享海报', icon: 'poster', type: 2 }]
        } else if (this.shareType == 2) {
          return [
            { name: '保存图片', icon: require('@/assets/img/icon-save.png'), type: 3 },
            { name: '微信', icon: 'wechat', type: 4 },
          ]
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
  .saveImg {
    width: 100vw;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    .van-image {
      position: absolute;
      top: 10vh;
      width: 65vw;
      height: 50vh;
      border-radius: 10px;
      z-index: 2200;
    }
  }
  .action-list {
    margin: 0.4rem 0;
  }
</style>
