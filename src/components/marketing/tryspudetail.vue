<template>
  <div>
    <group class="search-group">
      <div class="search-left-arrow" @click="toBack"></div>
      <tab v-model="spuTabIndex" custom-bar-width="60px" class="header-tabBar">
        <tab-item @click.native="toPage">商品</tab-item>
        <tab-item @click.native="toPage">试用报告</tab-item>
        <tab-item @click.native="toPage">详情</tab-item>
      </tab>
      <div class="header-cart-icon" style="background: none"></div>
    </group>

    <!--商品页面-->
    <div ref="spuPage" style="margin-bottom: 50px; padding-top: 51px">
      <!--轮播图片-->
      <swiper :list="carouselPics" :aspect-ratio="1" :show-desc-mask="false" dots-position="center"></swiper>

      <div class="bottom-prompt">{{ getTryTime() }}</div>

      <!--试用促销详情-->
      <div class="details-colortype">
        <div class="fourth-cells">
          <div class="fourth-cell">
            <div class="product-title">
              <i>{{ tryMarketing.type == '1' ? '付邮试用' : '返券试用' }}</i>
              {{ sku.name }}
            </div>
            <div class="product-sub">{{ sku.subTitle }}</div>
            <div class="product-price">
              <span style="font-size: 14px; color: #333">价值：</span>
              ¥{{ formatPrice(sku.price) }}
            </div>
            <ul class="y_sales_info">
              <li>
                提供
                <span style="color: #e4393c">{{ tryMarketing.tryNum }}</span>
                份 / 已有
                <span style="color: #e4393c">{{ tryMarketing.alerdyApplyNum }}</span>
                人申请
              </li>
              <li>
                <div><span>试用规则：</span></div>
                <div class="pingou-rules" style="padding: 0">
                  <ol v-html="tryRule"></ol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!--店铺信息-->
      <div class="shop-detail">
        <div class="shop-main">
          <div class="shop-logo"><img src="../../assets/img/shopIcon.png" /></div>
          <div class="shop-name">
            <p class="name">{{ storeScore.storeInfo ? storeScore.storeInfo.storeName : '' }}</p>
            <p class="slogon">
              描述&nbsp;
              <em>{{ storeScore.descScore ? formatPrice(storeScore.descScore) : '暂无' }}</em>
              &nbsp;&nbsp;服务&nbsp;
              <em>{{ storeScore.sellerScore ? formatPrice(storeScore.sellerScore) : '暂无' }}</em>
              &nbsp;&nbsp;物流&nbsp;
              <em>{{ storeScore.logisticsScore ? formatPrice(storeScore.logisticsScore) : '暂无' }}</em>
            </p>
          </div>
        </div>
        <div class="shop-action">
          <a style="color: #ccc">{{ storeScore.storeInfo ? storeScore.storeInfo.followNum : 0 }}人关注</a>
          <a @click="toStoreIndex">进店逛逛</a>
        </div>
      </div>

      <div ref="assessPage" style="position: relative; top: -50px"></div>
      <group>
        <cell value="查看全部" is-link @click.native="toTryReportList">
          <div slot="title">试用报告</div>
        </cell>
      </group>
      <divider v-if="tryReportList.length === 0" style="padding: 40px; background: #fff">暂无试用报告</divider>
      <div v-if="tryReportList.length !== 0" class="assess-wrapper">
        <group v-for="(tryReport, index) in tryReportList" :key="index" v-if="index <= 1">
          <cell :value="tryReport.submitTime">
            <div slot="title">
              <div style="color: #666; display: inline-block">{{ tryReport.customerName }}</div>
              <div class="commstar commstarList">
                <a class="commstar_star star1" :class="tryReport.satisfaction <= '1' ? 'active' : ''"></a>
                <a class="commstar_star star2" :class="tryReport.satisfaction > '1' && tryReport.satisfaction <= '2' ? 'active' : ''"></a>
                <a class="commstar_star star3" :class="tryReport.satisfaction > '2' && tryReport.satisfaction <= '3' ? 'active' : ''"></a>
                <a class="commstar_star star4" :class="tryReport.satisfaction > '3' && tryReport.satisfaction <= '4' ? 'active' : ''"></a>
                <a class="commstar_star star5" :class="tryReport.satisfaction > '4' && tryReport.satisfaction <= '5' ? 'active' : ''"></a>
              </div>
            </div>
          </cell>
          <cell :title="tryReport.advice"></cell>
          <cell>
            <div slot="title">
              <img
                class="previewerImg"
                v-for="(element, imgIndex) in tryReport.pics.split(',')"
                :key="imgIndex"
                :src="element"
                @click="showImg(tryReport.pics.split(','), index, imgIndex)"
                v-if="index <= 2"
              />
            </div>
          </cell>
        </group>
      </div>

      <div ref="detailPage" style="position: relative; top: -41px"></div>
      <tab v-model="skuDetailTab" style="margin-top: 10px">
        <tab-item>商品介绍</tab-item>
        <tab-item>规格参数</tab-item>
      </tab>
      <div class="tab-details">
        <div v-if="skuDetailTab === 0" class="clearfix">
          <span v-html="sku.mobileDesc"></span>
        </div>
        <div v-if="skuDetailTab === 1" class="clearfix">
          <table class="table-border" width="100%">
            <tbody>
              <tr v-for="(attribute, i) in sku.spuAttributeValues" :key="i">
                <td>{{ attribute.attributeName }}</td>
                <td>{{ attribute.attributeValue }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <section class="actionbar">
      <div class="action-list">
        <a class="item addtocart" :style="isEnd ? 'color: #fff; background: #ccc' : ''" @click="applyTrySku">{{ applyTitle }}</a>
      </div>
    </section>

    <previewer v-if="tryReportList.length !== 0" :list="getImageSrc()" ref="previewer"></previewer>
  </div>
</template>

<script>
  import { Group, Cell, Tab, TabItem, Swiper, SwiperItem, Divider, Previewer } from 'vux'

  import { formatPrice } from '@/utils/utils'

  import { queryTrySpuDetail, queryStoreScore, queryTrySkuApply, applyTrySku, queryTryReportList, queryTryRule } from '@/api/tryspudetail'

  export default {
    components: { Group, Cell, Tab, TabItem, Swiper, SwiperItem, Divider, Previewer },
    data() {
      return {
        spuTabIndex: 0, // 商品tab
        skuDetailTab: 0, // 详情tab
        assessIndex: 0, // 试用报告预览图片index
        tryMarketing: { startTime: '', endTime: '' }, // 促销信息
        sku: {}, // 单品信息
        carouselPics: [], // 轮播图片
        formatPrice: formatPrice, // 格式化金额
        storeScore: {}, // 店铺评分
        tryReportList: [], // 试用报告列表
        applyTitle: '立即申请', // 操作按钮
        isCanApply: true, // 是否可以申请试用
        isCanBuyNow: false, // 是否可以立即购买
        isEnd: false, // 活动是否结束
        isProcess: false, // 接口是否处理中
        tryRule: '', // 试用规则
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryTrySpuDetail(this.$route.query.tryId)
      this.queryTryRule()
    },
    methods: {
      // 查询试用规则
      queryTryRule() {
        queryTryRule().then((res) => {
          if (!!res.flag && res.data) {
            this.tryRule = res.data.tryRule
          }
        })
      },
      // 返回
      toBack() {
        this.$router.go(-1)
      },
      // 预览大图
      showImg(data, index, imgIndex) {
        this.assessIndex = index
        this.$refs.previewer.show(imgIndex)
      },
      // 获取预览图列表
      getImageSrc() {
        return this.tryReportList[this.assessIndex].pics.split(',').map((image) => {
          return { src: image }
        })
      },
      // 切换tab
      toPage() {
        if (this.spuTabIndex === 0) {
          this.$refs.spuPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        if (this.spuTabIndex === 1) {
          this.$refs.assessPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        if (this.spuTabIndex === 2) {
          this.$refs.detailPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      },
      // 查询试用商品详情
      queryTrySpuDetail(tryId) {
        let that = this
        queryTrySpuDetail(tryId).then((res) => {
          if (res.flag) {
            that.tryMarketing = res.data
            that.sku = res.data.sku

            // 查询试用申请状态
            that.queryTrySkuApply(that.tryMarketing.id)

            // 只有试用活动已结束才加载试用报告列表
            if (new Date(that.tryMarketing.endTime.replace(/\-/g, '/')) < new Date()) {
              that.queryTryReportList(tryId)
            }

            // 查询店铺评分
            that.queryStoreScore(that.sku)

            // 设置轮播图片
            that.carouselPics = that.tryMarketing.sku.skuImages.map((image) => {
              let imgUrl = image.url.split('/')
              imgUrl[imgUrl.length - 1] = escape(imgUrl[imgUrl.length - 1])
              console.log(imgUrl)
              let img = imgUrl.join('/')
              return { img }
            })
          } else {
            // 跳转到商品已下架页面
            that.$router.push({ path: '/spunotfind' })
          }
        })
      },
      // 查询试用报告列表
      queryTryReportList(tryId) {
        let that = this
        let query = {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
          tryId: tryId, // 试用促销id
        }
        queryTryReportList(query).then((res) => {
          that.tryReportList = res.data
        })
      },
      // 查询店铺评分
      queryStoreScore(sku) {
        let that = this
        queryStoreScore(sku.storeId).then((res) => {
          if (res.flag) {
            that.storeScore = res.data
          }
        })
      },
      // 查询试用申请状态
      queryTrySkuApply(tryId) {
        let that = this
        queryTrySkuApply(tryId).then((res) => {
          if (new Date(that.tryMarketing.startTime.replace(/\-/g, '/')) > new Date()) {
            // 活动未开始
            that.applyTitle = '敬请期待'
            that.isCanApply = false
          } else if (new Date(that.tryMarketing.endTime.replace(/\-/g, '/')) > new Date()) {
            // 活动已开始
            if (res.flag) {
              // 已申请
              that.applyTitle = '审核中'
              that.isCanApply = false
            } else {
              // 未申请
              that.applyTitle = '立即申请'
              that.isCanApply = true
            }
          } else {
            // 活动已结束
            if (res.flag) {
              if (res.data.status == '0') {
                // 申请审核中
                that.applyTitle = '审核中'
                that.isCanApply = false
              } else if (res.data.status == '1') {
                // 申请审核通过
                that.applyTitle = '立即购买'
                that.isCanApply = false
                that.isCanBuyNow = true
              } else {
                that.applyTitle = '已结束'
                that.isCanApply = false
                that.isEnd = true
              }
            } else {
              that.applyTitle = '已结束'
              that.isCanApply = false
              that.isEnd = true
            }
          }
        })
      },
      // 申请试用
      applyTrySku() {
        let that = this
        if (that.isProcess) {
          return
        }
        // 不可以申请
        if (!that.isCanApply) {
          if (that.isCanBuyNow) {
            // 立即购买
            that.buyNow()
          }
          return
        }
        let trySkuApply = { tryId: that.tryMarketing.id }
        that.isProcess = true
        applyTrySku(trySkuApply).then((res) => {
          that.isProcess = false
          if (res == 1) {
            that.$vux.toast.text('申请成功', 'middle')
            that.queryTrySpuDetail(that.tryMarketing.id)
          } else if (res == -1) {
            that.$vux.toast.text('活动还没有开始', 'middle')
          } else if (res == -2) {
            that.$vux.toast.text('活动已经结束', 'middle')
          } else if (res == -3) {
            that.$vux.toast.text('您已申请过', 'middle')
          } else if (res == -4) {
            that.$vux.toast.text('活动不存在', 'middle')
          } else if (res == -5) {
            that.$vux.toast.text('申请人数已达上限', 'middle')
          } else {
            that.$vux.toast.text('网络错误', 'middle')
          }
        })
      },
      // 立即购买
      buyNow() {
        this.$router.push({
          path: '/settlement',
          query: {
            params: JSON.stringify({
              ids: '',
              addressId: 0,
              skuInfo: this.tryMarketing.skuId + ',1',
              isGroup: 0,
              groupId: 0,
            }),
          },
        })
      },
      // 跳转到试用报告列表
      toTryReportList() {
        // 只有试用活动已结束才加载试用报告列表
        if (new Date(this.tryMarketing.endTime.replace(/\-/g, '/')) < new Date()) {
          this.$router.push({ path: '/tryreportlist', query: { tryId: this.tryMarketing.id } })
        }
      },
      // 获取试用活动时间
      getTryTime() {
        if (new Date(this.tryMarketing.startTime.replace(/\-/g, '/')) > new Date()) {
          return '开始时间:' + this.tryMarketing.startTime.split(' ')[0]
        } else if (new Date(this.tryMarketing.endTime.replace(/\-/g, '/')) > new Date()) {
          return '结束时间:' + this.tryMarketing.endTime.split(' ')[0]
        } else {
          return '已结束'
        }
      },
      // 跳转到店铺首页
      toStoreIndex() {
        if (this.sku.storeId !== 0 && !this.sku.storeId) {
          return
        }
        if (this.sku.storeId == '0') {
          this.$router.push({ path: '/' })
        } else {
          this.$router.push({ path: '/storeindex', query: { storeId: this.sku.storeId } })
        }
      },
    },
  }
</script>
