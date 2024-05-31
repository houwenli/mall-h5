<template>
  <div class="classify-container" :style="getStyle" data-desc="一级分类">
    <div class="left home-level-menu-box level_menu_box" ref='homeLevelMenuBoxRef'>
      <!-- id是用来做锚点定位的 -->
      <div
        :id="'classify-' + index"
        class="item home-level-menu-item level_menu"
        :class="activeTab === index ? 'active' : ''"
        v-for="(item, index) in list"
        :key="index"
        @click="onHandle(item, index)"
      >
        {{ clipTagText(item.name) }}
      </div>
    </div>
    <!-- 全部 -->
    <div class="right" @click="openPanel">
      <img :class="showPanel ? 'classify-arrow-active' : ''" class="classify-arrow" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-arrow-2x.png" alt="" />
      <div>{{showPanel ? "收起": "全部" }}</div>
    </div>

    <!-- 二级分类 -->
    <classifyPanel v-show="showPanel"  @update-active="onUpdateActive" :list="list" :active="activeTab" />
  </div>
</template>

<script>
import smoothscroll from 'smoothscroll-polyfill';
import classifyPanel from './classify-panel.vue'
import { defaultConfig, clipTagText } from './data.js'
// 商品分类接口
import { getCategory } from '@/api/goodsCategory'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'

/**
 *  "首页首页首页首页首页",
        "接好运",
        "手机",
        "个护清洁",
        "医药健康",
        "酒水",
        "宠物",
        "爱车",
        "旅游",
        "美食",
        "轮胎", "五金", "三金", "电视", "小米", "华为", "三星", "图片", "多少", "是的",
        "男鞋"
 */

// 分类导航
export default {
  name: 'classify',

  props: {
    config: {
      type: Object,
      default: () => defaultConfig
    }
  },

  components: {
    classifyPanel
  },
  data () {
    return {
      // 一级分类-是查询出来的， 金刚区是配出来的
      list: [],

      showPanel: false,

      activeTab: 0,

      prevActive: 0,

      // 一级分类容器DOM
      homeLevelMenuBoxRef: null,
      // 一级分类每个子元素的宽度
      homeLevelMenuBoxChildren: [],

      // 父元素盒子的宽度
      homeLevelMenuBoxWidth: 0,
      SingleTagMarginRight: 0,
      isLoading: false
    }
  },

  computed: {
    ...mapGetters(['headerData']),
    getStyle () {
      return {
        background: this.config.bgColor,
        color: this.headerData.textColor
      }
    }
  },

  created () {
    this.getCategory()
    smoothscroll.polyfill()
  },

  methods: {
    onHandle (item, index) {
      let prevIndex = this.activeTab
      this.activeTab = index
      this.showPanel = false

      // 更新vuex中的 classifyActiveTab， 在src\views\home\components\pageNav\index.vue 金刚区会使用，判断怎么跳转路径
      this.$store.state.HOME_PAGE_CONFIG.classifyActiveTab = index
      this.$emit('setScrollViewScroll', false, this.activeTab)

      this.rollEffect(index)

      // 切换到首页
      if (index === 0) {
        this.$emit('on-update-goods-list')
        return
      }

      if (prevIndex !== index) {
        // 查询金刚区的接口
        this.isLoading = true
        this.$emit('loadingFun',this.isLoading)
        this.getSecondTagList(item)

        // 根据当前的一级分类id, 重新查询首页的商品
        this.$emit('on-update-goods-list')
      }
    },

    openPanel () {
      this.showPanel = !this.showPanel

      this.$emit('setScrollViewScroll', this.showPanel,this.activeTab)
    },

    /**
     * 点击展开的一级分类面板里面的一个tag
     */
    onUpdateActive (index) {
      let prevIndex = this.activeTab
      this.showPanel = false

      this.activeTab = index
      this.$store.state.HOME_PAGE_CONFIG.classifyActiveTab = index

      let activeDOM = document.getElementById("classify-" + index)

      if (activeDOM) {
        // activeDOM.scrollIntoView({ behavior: 'smooth' })
        // this.scrollToActiveTag(index)
        this.rollEffect(index)
      }

      let item = this.list[index]

      // 点击首页
      if (index === 0) {
        this.onTracking(item, index)
        this.$emit('setScrollViewScroll', this.showPanel,this.activeTab)
         // 根据当前的一级分类id, 重新查询首页的商品
         this.$emit('on-update-goods-list')
        return
      }

      if (prevIndex !== index && index !== 0) {
        // 查询一级分类对应的二级分类和广告
        this.getSecondTagList(item)

        this.onTracking(item, index)
        this.$emit('on-update-goods-list')
      }

      // 关闭弹窗-让滚动条可以滚动
      this.$emit('setScrollViewScroll', this.showPanel,this.activeTab)
    },

    async getList(id = 0) {
       try {
        let res = await getCategory(id)

        return res.data || []
      } catch (error) {
        console.log('查询分类失败', error)
      }
    },
    /**
     * 获取一级分类
     */
    async getCategory () {
      try {
        let list = await this.getList(0)

        if (list.length !== 0) {
          list.unshift({
            name: '首页',
            parentId: null
          })

          this.list = list

          this.$store.state.HOME_PAGE_CONFIG.topCategoryList = list

          // 获取一级分类的DOM并缓存到组件实例上
          this.$nextTick(() => {
            // this.getNodeSize()
          })
        }

      } catch (error) {
        console.log('查询一级分类失败', error)
      }
    },

    /**
     * 获取二级分类
     */
    async getSecondTagList (item) {
      try {
        let list = await this.getList(item.id)
        this.isLoading = false
        this.$emit('loadingFun',this.isLoading)

        this.$store.state.HOME_PAGE_CONFIG.secondCategoryList = list
      } catch (error) {
        console.log('查询二分类失败', error)
      }
    },

    clipTagText,


      /**
     * 埋点
     */
    onTracking (data, index) {
      // 流量分析埋点
      let params = {
        name: '页面导航',
        image: data.url || '',
        url: data.link || '',
        index,
        type: 2,
        channel_source: Cookies.get('_wsf_role')
      }

      // 开启vue-devtools 会导致页面无法跳转- 本地调试，关闭vue-devtools插件即可
      this.$store.dispatch('BURIED_POINT/advertVisitRequest', params)
    },

    /**
     * 点击展开的一级菜单，滚动交互处理
     */
    scrollToActiveTag(index) {
      // 如果一开始没有获取到，就兜底再获取一次
      if(this.homeLevelMenuBoxRef === null ) {
        this.getNodeSize()
      }

      // index === 0 首页
      if (index === 0) {
        this.homeLevelMenuBoxRef.scrollLeft = 0

        return
      }

      console.log('当前点击的索引', index)
      console.log(this.homeLevelMenuBoxChildren)

      let beforeNodeWidths = this.homeLevelMenuBoxChildren.slice(0, index).map(item => item )
      console.log('距离左侧', beforeNodeWidths)

      let totalWidths = beforeNodeWidths.reduce((preValue,curValue) => preValue + curValue)
      console.log('总共需要滚动', totalWidths)
  console.log('homeLevelMenuBoxRef--容器盒子的宽度', this.homeLevelMenuBoxRef.offsetWidth)
      // 元素宽度总和小于父盒子的宽度 （获取父盒子宽度存在小数，会向上取整，故减一）
      if (totalWidths < this.homeLevelMenuBoxWidth ) return this.homeLevelMenuBoxRef.scrollLeft = 0

      this.homeLevelMenuBoxRef.scrollLeft = totalWidths - beforeNodeWidths[index - 1]
      // this.homeLevelMenuBoxRef.scrollTo({
      //   left: totalWidths - beforeNodeWidths[index - 1],
      //   behavior: 'smooth'
      // })
    },

    /**
     * 获取DOM的尺寸大小
     */
    getNodeSize() {
      this.homeLevelMenuBoxRef =  this.$refs['homeLevelMenuBoxRef']

      if (this.homeLevelMenuBoxRef) {
        let nodeList = this.homeLevelMenuBoxRef.querySelectorAll('.home-level-menu-item')

        let homeLevelMenuBoxWidth = window.getComputedStyle(this.homeLevelMenuBoxRef, null).width.replace(/px/g, '')
        homeLevelMenuBoxWidth = Number(homeLevelMenuBoxWidth)

        let marginRight = window.getComputedStyle(nodeList[0], null)['marginRight']

        if (marginRight) {
          marginRight = Number(marginRight.replace(/px/g, ''))
        }

        this.SingleTagMarginRight = marginRight

        let widthList = []

        for(let i=0; i< nodeList.length; i++) {
          let w = window.getComputedStyle(nodeList[i], null).width

          w = Number(w.replace(/px/g, ''))

          widthList.push(w + this.SingleTagMarginRight)
        }

        console.log(widthList)

        this.homeLevelMenuBoxChildren = widthList
      }
    },

    rollEffect(index) {
      this.$nextTick(() => {
        // 获取父盒子元素
        let levelMenusBox = document.getElementsByClassName('level_menu_box')[0]
        // 获取一级菜单dom列表
        let levelMenus = document.getElementsByClassName('level_menu') || []
        // 动态获取元素的margin-right距离
        let marginRight = window.getComputedStyle(levelMenus[0]).marginRight.split('px')[0]

        let levelWidths = []
        // 遍历获取每个一级菜单的宽度
        for(let item of levelMenus) {
          let elWidth = window.getComputedStyle(item).width.split('px')[0]
          levelWidths.push((elWidth * 1 + marginRight * 1).toFixed(4) * 1)
        }

        // 获取第一个元素到当前点击元素的宽度list
        let elWidths = levelWidths.splice(0, index)
        // 计算所有元素的宽度
        let deviation = index > 0 && elWidths.reduce((preValue,curValue) => preValue + curValue)
        // 计算父盒子滚动距离
        let scrollLeft = index === 0 ? 0 : deviation - elWidths[elWidths.length - 1]

        levelMenusBox.scroll({
           top: 0,
           left: scrollLeft,
           behavior: "smooth", //滚动条平滑滚动
        });

      })
    },
  }
}
</script>

<style lang="less" scoped>
.classify-container {
  width: 100%;
  height: 28px;
  position: relative;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 ;
  box-sizing: border-box;
  color: #000;

  .left {
    position: relative;
    display: flex;
    width: 302px;
    overflow-x: scroll;
    // 处理跳转的缓冲
    // scroll-behavior: smooth;
    // transition: all 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);

    // 去掉chrome的滑动条
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }

    .item {
      position: relative;
      text-align: center;
      margin-right: 12px;
      line-height: 28px;

      // padding: 8px 0;
      //  关键不要伸缩
      flex-shrink: 0;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
      }

      // 高亮的灰色阴影
      &::after {
        display: none;
        position: absolute;
        content: "";
        bottom: 0;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-classify-active-icon.png');

        width: 32px;
        height: 8px;
        background-size: 100% 140%;
        background-repeat: no-repeat;
        transition: all .4s;
      }
    }


    .active {
      font-size: 16px;
      font-weight: 600;
      &::after {
        display: block;
      }
    }
  }

  .right {
    height: 28px;
    line-height: 28px;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: inherit;

    &::before {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      height: 136px;
      width: 1px;
      background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-catogry-split-line-2x.png") no-repeat;
    }

    .classify-arrow {
      width: 12px;
      height: 12px;
      margin-right: 4px;
      margin-left: 4px;
      transition: 0.3s;
      transform: rotate(180deg);
    }

    .classify-arrow-active {
      transform: rotate(0);
    }
  }
}
</style>
