<template>
  <div ref="box" class="box">
    <div class="activity" :style="activityStyleObj">
      <div v-for="(floor, index) in floorsArr" :key="index">
        <!-- 轮播广告 -->
        <div v-if="floor.template === '1'" style="position: relative; margin-top: -3.12rem; height: 5.6rem" class="swiper_box">
          <div v-if="floor.adverts.length < 2">
            <img
              :src="formatImgUrlInUnicode(floor.adverts[0].image) + '?imageView2/2/w/750'"
              @click="navigateUrl(floor.adverts[0])"
              width="100%"
              style="border-radius: 0.4rem"
            />
          </div>
          <swiper :show-desc-mask="false" dots-position="center" auto style="height: 5.6rem; border-radius: 0.4rem" v-else>
            <swiper-item v-for="(advert, i) in floor.adverts" :key="i" style="height: 5.6rem; border-radius: 0.4rem">
              <img
                :src="formatImgUrlInUnicode(advert.image) + '?imageView2/2/w/750'"
                @click="navigateUrl(advert)"
                width="100%"
                style="height: 100%; border-radius: 0.4rem"
              />
            </swiper-item>
          </swiper>
        </div>

        <!-- 页面导航 -->
        <div v-if="floor.template === '5'" class="clearfix index_nav" :style="`position: relative;margin-bottom:${floor.adverts.length <= 5 ? '0.6rem' : 0}`">
          <div class="btn_nav" ref="btn_nav" @scroll="slide">
            <div v-for="(advert, i) in floor.adverts" :key="i" class="index_nav_box" @click="navigateUrl(advert)">
              <img :src="advert.image + '?imageView2/1/w/138'" />
              <p :style="navStyleObj">{{ advert.texts.name }}</p>
            </div>
          </div>
          <div class="box_progress" v-if="floor.adverts.length > 5">
            <div style="height: 0.12rem; background: #dddddd; width: 1.44rem; border-radius: 0.1rem">
              <div :style="{ transform: `translate(${progressWidth}%)` }" class="progress_line"></div>
            </div>
          </div>
        </div>

        <!-- 分享赚 - 分销模块  template需要重新给一个  -->
        <!-- <section class="distributionBox" v-if="floor.template === '10' && windowFlag">
        <div v-for="(advert, i) in floor.adverts" :key="i">
          <img :src="advert.image" style="width: 100%; display: block" @click="toDistribution" />
        </div>
      </section> -->

        <!-- 通栏广告 -->
        <div v-if="floor.template === '2'" style="position: relative; margin-bottom: 10px" class="distributionBox">
          <template v-if="getDistribution">
            <div v-for="(advert, i) in floor.adverts" :key="i">
              <img :src="advert.image" style="width: 100%; display: block" @click="toDistribution" />
            </div>
          </template>
        </div>

        <!--   秒杀专区   -->
        <template v-if="floor.template === '4' && seckill.skus.length > 0">
          <div v-if="hasSeckill" class="box-seckill" @click="$router.push({ name: 'Seckill' })">
            <div class="seckill-header">
              <div class="seckill-header-title">限时秒杀</div>
              <div class="seckill-header-count">
                <div class="seckill-header-tips">{{ seckill.secenes[0].secen.split(':')[0] }}点场{{ seckill.secenes[0].countStr }}</div>
                <van-count-down :time="seckill.secenes[0].countTime" style="display: flex; justify-content: center; align-items: center; margin-right: 0.4rem">
                  <template #default="timeData">
                    <span class="block" v-if="timeData.days > 0">{{ timeData.days * 24 + timeData.hours }}</span>
                    <span class="block" v-else>{{ timeData.hours &lt; 10 ? '0' + timeData.hours : timeData.hours }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{ timeData.minutes &lt; 10 ? '0' + timeData.minutes : timeData.minutes }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{ timeData.seconds &lt; 10 ? '0' + timeData.seconds : timeData.seconds }}</span>
                  </template>
                </van-count-down>
                <img src="@/assets/img/cat_more@2x.png" style="width: 0.2rem; height: 0.44rem" alt="" />
              </div>
            </div>
            <div class="seckill-body" v-if="seckill.skus && seckill.skus.length > 0">
              <template v-for="(subEl, x) in seckill.skus">
                <div class="seckill-skus" :key="x">
                  <div class="imgbox">
                    <van-image style="height: 100%; width: 100%" :src="subEl.url + '?imageView2/1/w/150/h/150'" />
                  </div>
                  <div class="seckill-skus-price">
                    <span class="price">
                      <span class="symbol-money" style="margin-top: 0.04rem">¥</span>
                      {{ subEl.seckillPrice.toFixed(2) }}
                    </span>
                    <!-- 由于显示问题，先屏蔽-->
<!--                    <span v-if="subEl.discountPrice.length < 6" class="old-price">-->
<!--                      <span class="symbol-money" style="margin-top: 0.02rem">¥</span>-->
<!--                      {{ subEl.price }}-->
<!--                    </span>-->
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>

        <!-- 广告组合一 -->
        <div v-if="floor.template === '6'" class="clearfix" style="margin-bottom: 10px">
          <!-- <div v-if="floor.template === '6'" class="clearfix" style="position: relative; margin-bottom: 10px"> -->
          <!-- <div v-for="(advert, i) in floor.adverts" :key="i" style="width: 50%; float: left"> -->
          <div v-for="(advert, i) in floor.adverts" :key="i" style="width: 100%; float: left">
            <div style="width: 100%; position: relative; height: auto">
              <!-- <div style="width: 100%; position: relative; height: auto; padding-bottom: 100%"> -->
              <!-- <img :src="advert.image" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0" @click="navigateUrl(advert)" /> -->
              <img :src="advert.image" style="width: 100%; height: auto; border-radius: 10px" @click="navigateUrl(advert)" />
            </div>
          </div>
        </div>

        <!-- 空白占位符 -->
        <!-- <div v-if="floor.template === '4' && hasSeckill" style="position: relative">
        <div v-for="(advert, i) in floor.adverts" :key="i" :style="{ height: advert.texts.height + 'px' }" />
      </div> -->

        <!-- 广告组合二 -->
        <div v-if="floor.template === '7'" class="adv-group-two" :style="advGroupTwoStyle(floor)">
          <div v-for="(advert, i) in floor.adverts" :key="i" class="homeImgBorder" style="width: 6.52rem; height: 6.52rem">
            <div style="width: 100%; height: 100%; padding-bottom: 64%">
              <img :src="advert.image" style="width: 100%; height: 6.52rem; border-radius: 0.2rem" @click="navigateUrl(advert)" />
            </div>
          </div>
        </div>

        <!-- 广告组合三 -->
        <div v-if="floor.template === '8'" class="adv-group-three" :style="advGroupThreeStyle(floor)">
          <div v-for="(advert, i) in floor.adverts" :key="i" class="homeImgBorder" style="width: 4.28rem; height: 4.8rem">
            <div style="width: 100%; position: relative; height: 4.8rem; padding-bottom: 128%">
              <img
                :src="advert.image"
                style="width: 100%; height: 4.8rem; position: absolute; top: 0; left: 0; border-radius: 0.2rem"
                @click="navigateUrl(advert)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shop-list">
      <shopList :title="'热销商品'"></shopList>
    </div>
  </div>
</template>

<script>
  import { Group, Swiper, SwiperItem, Tabbar, TabbarItem, XInput } from 'vux'
  import { CountDown, Image as VanImage } from 'vant'
  import { formatPrice } from '@/utils/utils'
  import { getToken } from '@/utils/token'
  import { querySeckilldetail, querySeckillSceneSpu } from '@/api/activities/seckill'
  import { queryIsAllowDistribution } from '@/api/home'
  import shopList from '../commons/shopList'
  import { encrypt } from '../../utils/sign'
  import { mapGetters } from 'vuex'
  import Cookies from 'js-cookie'
  export default {
    components: {
      Group,
      Tabbar,
      TabbarItem,
      XInput,
      Swiper,
      SwiperItem,
      shopList,
      [CountDown.name]: CountDown,
      VanImage,
    },
    // props: ['floors', 'storeId'], // 父组件传过来的参数 floors 楼层集合 storeId 店铺id
    props: {
      floors: {
        type: Array,
        require: true,
        default: () => [],
      },
      storeId: {
        type: String,
        require: false,
      },
    },
    data() {
      return {
        floorsArr: [],
        formatPrice: formatPrice, // 格式化金额
        progressWidth: 0, //页面导航下面的进度条
        windowFlag: false,
        seckill: {
          // 秒杀场次信息
          secenes: [],
          skus: [],
        },
        hasSeckill: false,
        countTimer: '', // 定时器Id
        miniAppletUserName: process.env.MINI_APPLET_ID, // 小程序原始Id
        activityStyleObj: {
          //活动背景图
          //   background: '#f5f5f5',
        },
      }
    },
    computed: {
      ...mapGetters('MOBILE_INDEX', ['pagesConfig']),
      // 响应式获取是否存在分销权限
      getDistribution() {
        /* Todo 临时方案: 限制车生活入口访问分销专区 */
        // if (sessionStorage.getItem('WSFPORT') == 1) {
        //   return false
        // }
        console.log('sessionStorage.getItem', sessionStorage.getItem('HASDISTRIBUTIONPOWER'))

        let token = getToken() ? getToken() : '' // 判断token是否存在
        let is_distribution = sessionStorage.getItem('HASDISTRIBUTIONPOWER') // 字符串
        is_distribution = is_distribution == 'true'

        let getDistribution = this.$store.getters.getDistribution // 首次免密登陆处理数据不同步问题
        console.log('仓库的状态getDistribution', getDistribution)

        let hasDistribution = getDistribution || is_distribution

        console.log('token---------', token)
        console.log('是否有分销权限getDistribution', hasDistribution)

        if (token && hasDistribution) {
          return hasDistribution
        } else {
          return false
        }
      },
      userId() {
        return this.$store.getters.userId
      },
      //页面导航文字颜色
      navStyleObj() {
        const obj = this.floors && this.floors.find((item) => item.template === '5')
        return {
          color: (obj && obj.texts && obj.texts.color) || '#666',
        }
      },
    },
    watch: {
      floors: {
        handler(newVal) {
          console.log(newVal, '获取到楼层数据')
          this.floorsArr = newVal
        },
        deep: true,
      },
      pagesConfig: {
        handler(nv, ov) {
          if (nv) {
            const { layOutObj } = nv
            const activityStyleObj = layOutObj && layOutObj.find((item) => item.type === 'activityStyle')
            let activityOpacity = (activityStyleObj && activityStyleObj.opacity) || 0
            const dealOpacity = (100 - ~~activityOpacity) / 100
            // this.activityStyleObj = {
            //   background: (activityStyleObj && activityStyleObj.image && `url(${activityStyleObj && activityStyleObj.image}) no-repeat`) || '#f5f5f5',
            //   opacity: dealOpacity || 1,
            // }
            this.activityStyleObj = {
              '--image': `url(${activityStyleObj && activityStyleObj.image}) `,
              '--opacity': dealOpacity || 1,
            }
          }
        },
        immediate: true,
        deep: true,
      },
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg')
      this.querySeckill()
      let token = getToken() ? getToken() : '' // 判断token是否存在
      if (token) {
        this.queryIsAllowDistribution()
      }
    },

    mounted() {
      // this.$refs.box.scrollTop = 0
      // console.log('window.IS_DISTRIBUTION_11111', window.IS_DISTRIBUTION)
    },
    beforeDestroy() {
      clearTimeout(this.countTimer)
    },
    methods: {
      // 查询用户是否有分销权限
      queryIsAllowDistribution() {
        queryIsAllowDistribution().then((res) => {
          console.log('是否分销有权限', res)
          console.log('state.isD-- 前--', this.$store.getters.getDistribution)
          if (res.code == 200) {
            this.$store.commit('OPERATION_DISTRIBUTION', res.data)
            console.log('getDistribution----', this.$store.getters.getDistribution)
          }
        })
      },
      // 查询秒杀场次
      querySeckill() {
        let that = this
        // 查询秒杀场次
        querySeckilldetail().then((res) => {
          // 如果没有场次则直接返回
          if (!res.data.secenes) return
          // 遍历处理场次信息
          let secenes = res.data.secenes.map((el, index) => {
            // 兼容ios的时间计时方法
            el.seckillTime = el.seckillTime.replace(/-/g, '/')
            let nowTime = new Date().getTime()
            let seckillTime = new Date(el.seckillTime).getTime()
            let countTime = seckillTime - nowTime
            el.countStr = countTime < 0 ? '' : '，距离开始'
            // 如果当前时间大于活动开始时间则为负数,此时应该计算该场次还剩余多少时间,因此加上一个小时的毫秒数
            countTime = countTime < 0 ? (countTime += 3600000) : countTime
            el.countTime = countTime
            return el
          })

          // 如果时间仍然小于0,说明该场次时间已经结束,后台接口的数据缓存问题,此时过滤掉该场次
          secenes = secenes.filter((el) => {
            return el.countTime > 0
          })

          // 设置定时器更新数据
          // this.countTimer = setTimeout(function() {
          //   that.querySeckill()
          // }, secenes[0].countTime)

          //设置定时器更新数据.setTimeout不超过1天
          let seckillCountTime = parseInt(secenes[0].countTime)
          if (seckillCountTime > 86400000) {
            seckillCountTime = 86400000
          }
          this.countTimer = setTimeout(function() {
            that.querySeckill()
          }, seckillCountTime)

          // 赋值
          this.seckill.secenes = secenes

          // 查询场次商品
          this.querySceneDetail(this.seckill.secenes[0])

          //用于判断是否还拥有场次
          this.hasSeckill = secenes && secenes.length > 0
        })

        // querySeckillScene().then((res) => {
        //   if (!res.data) return
        //   this.seckill.skus = res.data.map((el) => {
        //     // 计算折扣价, 折扣 discount 为浮点数
        //     el.sku.discountPrice = ((el.sku.price * (el.discount * 100)) / 100).toFixed(2)
        //     return el
        //   })
        // })
      },
      // 查询首页展示Sku
      querySceneDetail(secenes) {
        if (!secenes.seckillSceneId) {
          return
        }
        // 如果正在加载中或已完成
        querySeckillSceneSpu({ pageNum: 0, pageSize: 10, seckillSceneId: secenes.seckillSceneId }).then((res) => {
          if (res.code == 200 && res.data) {
            this.seckill.skus = res.data.list
            // 已改需求，无需算折扣价
          //     .map((el) => {
          //       // 计算折扣价, 折扣 discount 为浮点数
          //       el.discountPrice = ((el.price * (el.discount * 100)) / 100).toFixed(2)
          //       return el
          //     })
          //     .slice(0, 4)
          }
        })
      },
      // 分销模块入口
      toDistribution() {
        // 尝试拉起小程序
        /* Todo 1.8日才放开H5拉起小程序 */
        if (window.ws) {
          this.toMiniAppDistribution(2)
          // return
        } else if (window.webkit) {
          this.toMiniAppDistribution(1)
          // return
        } else {
          if (Cookies.get('_wsf_role') != 1) {
            window.location.href = '/distribution'
            // window.location.href = 'http://172.16.4.79:8081/distribution?token=' + getToken()
          }
        }
      },
      // 唤醒小程序分销
      async toMiniAppDistribution(platform) {
        if (!this.userId) {
          const { data } = await this.$store.dispatch('user/getUserInfo')
        }
        // 准备密钥
        console.log('this.userId: ', this.userId)
        let aesToken = encrypt(this.userId, 'VGrCjJsxus1pXky0').encryptStr
        console.log('aesToken', aesToken)
        let userSource = this.$store.getters.getUserSource,
          // let userSource = localStorage.getItem('userSource'),
          us = ''
        if (userSource && userSource == 1) {
          us = 6
        } else if (userSource && userSource == 2) {
          us = 5
        }
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
              path: `distributionModule/pages/distributionIndex/distributionIndex?k=${aesToken}&us=${us}`, //
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
            if (Cookies.get('_wsf_role') != 1) {
              window.location.href = '/distribution'
            }
          }
        } else if (platform === 1) {
          try {
            window.webkit.messageHandlers.wsShare.postMessage(shareData)
          } catch (err) {
            console.log('ios拉起失败', err)
            if (Cookies.get('_wsf_role') != 1) {
              window.location.href = '/distribution'
            }
          }
        }
        if (Cookies.get('_wsf_role') != 1) {
          window.location.href = '/distribution'
        }
        // 判断是否是开发环境
        // if (process.env.NODE_ENV === 'local') {
        //   window.location.href = 'http://172.16.3.42:8081/distribution?token=' + getToken()
        // } else {
      },
      slide() {
        let that = this
        let left = this.$refs.btn_nav[0].scrollLeft
        let width = this.$refs.btn_nav[0].scrollWidth - this.$refs.btn_nav[0].offsetWidth
        this.progressWidth = (left / width) * 100
      },
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
        } else if (advert.actionType === '8') {
          this.toCustomizeUrl('firstOrder', advert.actionParamId)
        } else if (advert.action === 'storePanicList') {
          this.toStorePanicList()
        }
      },
      // 跳转商品详情页
      toSkuDetail(item) {
        if (item.actionParamId !== 0 && !item.actionParamId) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        }
        this.$router.push({ path: '/spudetail', query: { id: item.actionParamId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
      },
      // 跳转分类搜索页
      toCateSearch(actionParamId) {
        if (actionParamId !== 0 && !actionParamId) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        }
        this.storeId == '0'
          ? this.$router.push({
              path: '/spulist',
              query: { queryString: '', cateId: actionParamId },
            })
          : this.$router.push({ path: '/spulist', query: { queryString: '', storeCateId: actionParamId } })
      },
      // 跳转到专题页面
      toThematicDetail(actionParamId) {
        if (actionParamId !== 0 && !actionParamId) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        }
        this.$router.push({ path: '/thematic', query: { id: actionParamId } })
      },
      // 跳转到优惠券中心页面
      toCoupon() {
        this.storeId == '0'
          ? this.$router.push({ path: '/couponcenter' })
          : this.$router.push({
              path: '/couponcenter',
              query: { storeId: this.storeId },
            })
      },
      // 跳转到红包中心页面
      toRedEnvelope() {
        this.$router.push({ path: '/bonuscenter' })
      },
      // 跳转到限时折扣中心页面
      toPanic() {
        this.$router.push({ path: '/panicbuy' })
      },
      // 跳转到预售中心页面
      toPresale() {
        this.storeId == '0'
          ? this.$router.push({ path: '/presalemarketings' })
          : this.$router.push({
              path: '/presalemarketings',
              query: { storeId: this.storeId },
            })
      },
      // 跳转到试用中心页面
      toTry() {
        this.storeId == '0'
          ? this.$router.push({ path: '/trymarketings' })
          : this.$router.push({
              path: '/trymarketings',
              query: { storeId: this.storeId },
            })
      },
      // 跳转到拼团中心页面
      toGroup() {
        this.storeId == '0'
          ? this.$router.push({ path: '/groupmarketings' })
          : this.$router.push({
              path: '/groupmarketings',
              query: { storeId: this.storeId },
            })
      },
      // 跳转到全部商品列表页面
      toKeySearch() {
        this.storeId == '0'
          ? this.$router.push({ path: '/spulist' })
          : this.$router.push({
              path: '/spulist',
              query: { storeId: this.storeId },
            })
      },
      // 跳转到分类列表页面
      toCateList() {
        this.$router.push({ path: '/category' })
      },
      // 跳转到签到页面
      toSign() {
        this.$router.push({ path: '/mysignin' })
      },
      // 跳转到附近门店页面
      toNearbyStore() {
        this.$router.push({ path: '/nearstorelist' })
      },
      // 跳转到搜索店铺页面
      toStoreList() {
        this.$router.push({ path: '/searchshoplist' })
      },
      // 跳转到附近店铺页面
      toNearShopList() {
        this.$router.push({ path: '/nearshoplist' })
      },
      // 跳转到积分商城页面
      toPointMall() {
        this.$router.push({ path: '/pointskulist' })
      },
      // 跳转到自定义链接
      toCustomizeUrl(customizeUrl, id) {
        if (!customizeUrl) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        }
        if (customizeUrl == 'ThematicActivity') {
          this.$router.push({ name: 'ThematicActivity' })
        } else if (customizeUrl == 'WomensDay') {
          this.$router.push({ name: 'WomenActive' })
        } else if (customizeUrl == 'firstOrder') {
          this.$router.push({
            name: 'FirstOrder',
            query: { id: id },
          })
        } else {
          window.location.href = 'https://' + customizeUrl
        }
      },
      // 跳转到店铺秒杀页面
      toStorePanicList() {
        this.$router.push({
          path: '/storepanicbuy',
          query: { storeId: this.storeId },
        })
      },
      formatImgUrlInUnicode(url) {
        let imgUrl = url.split('/')
        imgUrl[imgUrl.length - 1] = escape(imgUrl[imgUrl.length - 1])
        return imgUrl.join('/')
      },
      advGroupTwoStyle(obj) {
        let opacity = (obj && obj.texts && obj.texts.opacity) || 0
        let dealOpacity = (100 - ~~opacity) / 100
        return {
          '--background': (obj && obj.texts && obj.texts.color) || '#ffffff',
          '--opacity': dealOpacity || 1,
        }
      },
      advGroupThreeStyle(obj) {
        let opacity = (obj && obj.texts && obj.texts.opacity) || 0
        let dealOpacity = (100 - ~~opacity) / 100
        return {
          '--background': (obj && obj.texts && obj.texts.color) || '#ffffff',
          '--opacity': dealOpacity || 1,
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .distributionBox {
    margin: 0.4rem auto 0.4rem;

    img {
      // width: 14.04rem;
      width: 100%;
      height: 3.2rem;
      border-radius: 0.4rem;
    }
  }

  .box {
    background: #f5f5f5;
    //Todo: 临时解决安卓返回刷新
    min-height: 110vh;
    box-sizing: border-box;
    .activity {
      padding: 0.2rem 0.48rem 0.48rem;
      background: '#f5f5f5';
      display: block;
      position: relative;
      z-index: 1; //2020.2.2增加
    }
    .activity::after {
      content: '';
      background: var(--image);
      background-repeat: no-repeat;
      background-size: 100% auto;
      opacity: var(--opacity);
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
    }
    .shop-list {
      padding: 0.2rem 0.48rem 0.48rem;
    }
  }

  .btn_nav {
    margin-top: 0.6rem;
    display: flex;
    width: 100%;
    overflow: scroll;
  }

  .btn_nav::-webkit-scrollbar {
    display: none;
  }

  .box_progress {
    display: flex;
    justify-content: center;
    margin: 0.4rem 0 0.6rem;
  }

  .progress_line {
    height: 0.12rem;
    background: red;
    width: 0.72rem;
    border-radius: 0.1rem;
    will-change: transform;
  }

  .swiper_box /deep/ .vux-slider > .vux-indicator > a > .vux-icon-dot,
  .vux-slider .vux-indicator-right > a > .vux-icon-dot {
    width: 0.32rem !important;
    height: 0.16rem !important;
    border-radius: 0.1rem !important;
  }

  .swiper_box /deep/ .vux-swiper {
    height: 100% !important;
  }

  .swiper_box /deep/ .vux-slider > .vux-indicator,
  .vux-slider .vux-indicator-right {
    bottom: 0.1rem !important;
  }

  // 秒杀功能
  .box-seckill {
    margin-bottom: 0.48rem;
    background-color: #fff;
    border-radius: 0.4rem;
    padding-left: 0.4rem;

    .seckill-header {
      height: 1.84rem;
      padding: 0.48rem 0.4rem 0.48rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .seckill-header-title {
        font-size: 0.68rem;
        font-weight: 500;
        color: #000000;
      }

      .seckill-header-count {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .seckill-header-tips {
          font-size: 0.4rem;
          font-weight: 500;
          color: #000000;
          line-height: 0.56rem;
          margin-right: 0.16rem;
        }

        .colon {
          display: inline-block;
          padding: 0 0.04rem;
          height: 0.64rem;
          line-height: 0.6rem;
          color: #e60113;
        }

        .block {
          display: inline-block;
          width: 0.72rem;
          height: 0.64rem;
          line-height: 0.64rem;
          color: #fff;
          font-size: 0.48rem;
          text-align: center;
          background-color: #e60113;
          border-radius: 0.08rem;
        }
      }
    }

    .seckill-body {
      display: flex;
      // justify-content: flex-start;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 0.36rem;
      width: 100%;
      // overflow-x: scroll;
      overflow-x: hidden;

      .seckill-skus {
        max-width: 3rem;
        margin-right: 0.36rem;
        // width: 3rem;
        .imgbox {
          width: 3rem;
          height: 3rem;
          border-radius: 0.2rem;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .seckill-skus-price {
          // width: 3rem;
          width: 100%;
          height: 1.04rem;
          line-height: 1.04rem;
          overflow: hidden;
          text-align: center;
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;

          .old-price {
            font-size: 0.4rem;
            color: #999999;
            text-decoration: line-through;
            display: flex;
          }

          .price {
            font-weight: 500;
            font-size: 0.56rem;
            color: #e60113;
            display: flex;
            margin-right: 0.08rem;
          }

          .symbol-money {
            font-size: 0.4rem;
          }
        }
      }
      .seckill-skus:nth-child(5){
        display: none;
      }
    }
  }
  .adv-group-two,
  .adv-group-three {
    position: relative;
    display: flex;
    justify-content: space-between;
    // background: #fff;
    box-sizing: border-box;
    z-index: 0;
  }
  .adv-group-two {
    padding: 0.4rem 0.4rem 0.2rem;
    border-radius: 0.4rem 0.4rem 0 0;
    // display: block;
    position: relative;
    display: flex;
    overflow: hidden;
  }
  .adv-group-two::after {
    content: '';
    background: var(--background);
    opacity: var(--opacity);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;
  }
  .adv-group-three {
    padding: 0 0.4rem 0.4rem;
    border-radius: 0 0 0.4rem 0.4rem;
    margin-bottom: 0.2rem;
    position: relative;
    display: flex;
    overflow: hidden;
  }
  .adv-group-three::after {
    content: '';
    background: var(--background);
    opacity: var(--opacity);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;
  }
</style>
