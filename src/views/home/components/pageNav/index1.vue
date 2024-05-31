<template>
  <!-- 页面导航 -->
  <!-- 如果对应的子元素只有文字，没有url 就过滤掉 -->
  <div class="nav">
    <div class="nav-list-container" v-if='getGroupData.length || getSwiperGroupData.length' :class="{'active-bg': classifyActiveTab !== 0}" data-desc="金刚区">
      <div class="inner-list-container" :style="getStyle">
        <!-- <div class="group-1" :style="{width:'calc(100% *' + getGroupData.length +')'}"> -->

          <!-- {{groupStyle}} -->
        <div class="group-1" :style="groupStyle" ref="groupStyle">
          <div class="line" v-for="(lineGroup, lineIndex) in getGroupData" :key="lineIndex" :style="lineStyle(lineIndex)">
            <div class="item" v-for="(item, index) in lineGroup" :key="index" @click="navigate(item, index)" :style="itemStyle(lineIndex)">
              <img class="pic" :src="item.url" alt="" v-if="item.url" />
              <img class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
              <div class="nav-title" :style="{ color: config.textColor }">{{ item.btnText || item.text }}</div>
            </div>
          </div>
        </div>
        <div class="custom-indicator">
          <div class="indicator-wrap" ref='indicatorWrapRef'>
            <div class="progress-line" :style="getActiveProcessPosition"></div>
          </div>
        </div>

      </div>
    </div>

    <!-- 一级分类下面的分类广告 -->
    <categoryAd />
  </div>
</template>

<script>
import { routerPathName, toMiniAppDistribution } from '@/utils/utils.js'
import { Swipe, SwipeItem } from 'vant'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'
// 分类广告
import categoryAd from './category-ad.vue'

// 页面导航-金刚区
export default {
  name: "pageNav",

  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    categoryAd
  },

  data () {
    return {
      swipeIndex: 0,

      // 指示器宽度
      processContainerWidth: 40
    }
  },
  mounted(){

  },
  computed: {
    ...mapState({
      // 一级分类 当前是哪一个高亮
      classifyActiveTab: state => state.HOME_PAGE_CONFIG.classifyActiveTab
    }),
    /**
     * 分组
     */
    getGroupData () {
      let arr = this.config.sildeshowList

      // 过滤掉二级分类没有图片的数据
      if (this.classifyActiveTab !== 0) {
        arr = arr.filter(p => p.url)
      }
      return this.handleData(arr)
    },

    getSwiperGroupData () {
      let arr = this.config.sildeshowList

      if (this.classifyActiveTab !== 0) {
        arr = arr.filter(p => p.url)
      }

      this.getIndicatorWrapWidth()

      return this.getTwoGroup(arr, 10)
    },
    // 仅展示一屏
    showOnePanel () {
      let arr = this.config.sildeshowList || []

      return arr.length < 11
    },
    groupStyle(){
      let styles = {}
      let numGe = this.config.sildeshowList.length % 10
      let sildeshowList = this.handleData(this.config.sildeshowList)
      let len =  sildeshowList.length
      console.log(sildeshowList,len,'dwqw');
      if(this.config.sildeshowList.length<=10){
        styles.width = '100%'
      } else if(numGe<=4){
        let a =  100*(len-1) + '%'
        let b = ((len-1) * 52 + 17) + 'px'
        styles.width = `calc(${a + ' + ' + b})`
      } else {
        styles.width = `calc(100%*' + ${(len-1) * 52 + 17 } + 'px' +')`
      }

      return styles
    },
    getStyle () {
      let styles = {}

      if (String(this.config.backgroundType) === "0") {
        styles.background = this.config.bgColor || '#FFF'
      }

      if (String(this.config.backgroundType) === "1") {
        styles.background = this.config.bgImage ? `url(${this.config.bgImage}) no-repeat` : '#FFF'
      }
      // styles.width = 'calc(100% *' + this.getGroupData.length +')'

      return styles
    },

    /**
     * 获取指示器高亮的位置
     */
    getActiveProcessPosition() {

      if(!this.processContainerWidth) {
        this.getIndicatorWrapWidth()
      }
    　var left = this.$refs.offsetLeft;// 当前元素左边距
      console.log(left,'left');
      let width = this.processContainerWidth / this.handleData(this.config.sildeshowList).length

      // 滑动的距离计算
      let x = (this.swipeIndex * width)

      // 如果滑动到最后一个，直接手动设置滚动距离 - 避免1-2px在不同机型上的差异
      if (this.swipeIndex === this.handleData(this.config.sildeshowList).length -1) {
        x = this.processContainerWidth - width + 1
      }
      return {
        width: `${width}px`,
        transform: `translateX(${x}px)`
      }
    },
  },
  methods: {
    itemStyle(index){
      let styles = {}
      let numGe = this.config.sildeshowList.length % 10
      let sildeshowList = this.handleData(this.config.sildeshowList)
      let len =  sildeshowList.length

      if(index < len -1 ){



      } else {
        styles.marginRight = '17px'
        // styles.marginLeft = '0px'
      }


      return styles
    },
    lineStyle(index){
      let styles = {}
      let numGe = this.config.sildeshowList.length % 10
      let sildeshowList = this.handleData(this.config.sildeshowList)
      let len =  sildeshowList.length

      if(index <= len -1 ){
        // styles.width = `calc(100% - 17px)`
        styles.width = '100%'
      } else {
        // let a = 100*(len - 1) + '%'
        let b = (numGe * 52 - 52) + 'px'
        // let c = 100*(len - 1)
        styles.width = b
      }


      return styles
    },
    handleData(dataList){
      // 处理图片数据，10个为一组
      let newDataList = []
      let current = 0
      if(dataList && dataList.length>0){
        for(let i=0;i<=dataList.length-1;i++){
          if(i%10 !== 0 || i === 0 ){
            if(!newDataList[current]){
              newDataList.push([dataList[i]])
            }else{
              newDataList[current].push(dataList[i])
            }
          }else{
            current++
            newDataList.push([dataList[i]])
          }
        }
      }
      return [...newDataList]
    },
    /**
     * 分2种情况
     * 1、金刚区 直接走链接跳转逻辑
     * 2、点 一级分类下面二级分类， 直接将当前的关键字 + 类目id 跳转到查询商品列表界面
     */
    navigate (data, index) {
      if (this.classifyActiveTab === 0) {
        if (!data || !data.link) return

        this.onTracking(data, index)

        let isLivePage = data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1

        if (isLivePage) {
          toMiniAppDistribution(data.link)
        } else {
          routerPathName(data.link)
        }

        return
      }

      // 当前点击的是二级分类-跳转到商品结果列表页面
      this.$router.push({
        path: '/spulist',
        query: {
          queryString: data.name,
          secondCateId: data.id || ''
        }
      })
    },
    getTwoGroup (array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    },

    onChange (index) {
      this.swipeIndex = index
    },

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
     * 动态获取指示器容器的宽度 - 获取响应像素宽度
     */
    getIndicatorWrapWidth() {
      this.$nextTick(() => {
        if (this.$refs['indicatorWrapRef']) {
          let w = window.getComputedStyle(this.$refs['indicatorWrapRef']).width
          this.processContainerWidth = Number(w.replace(/px/g, ''))
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.nav{
  margin-top: 8px;
  height: 180px;
}
.nav-list-container {
  width: 100vw;
  // padding-top: 12px;
  transition: all 0.8s;
  border-radius: 12px 12px 0 0;
  position: relative;

  .inner-list-container {

    margin: 0 12px;
    background: #fff;
    border-radius: 12px;
    height: 180px;
    overflow-x: auto;
  }
  .inner-list-container::-webkit-scrollbar {
    display: none;
  }
}
// 首页就没有背景颜色， 取配置的，其他一级分类使用如下颜色兜底
.active-bg {
  background: #F5F5F8;
}

// 仅展示一屏
.group-1 {

  box-sizing: border-box;
  padding: 12px 12px 4px 12px;
  height: 180px;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  .line {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;
    width: 100%;
  }
}
.item {
  margin-right: 17px;

  &:nth-of-type(5n) {
    margin-right: 0;
  }
}
.pic {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: block;
}

.nav-title {
  width: 52px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000d1d;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 4px;
}

// 滑动的样式
.group-2 {
  width: 100%;
  box-sizing: border-box;
}

// swipe 指示器颜色
.custom-indicator {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 4px;
  width: 100%;

  // 居中+border-radius
  .indicator-wrap {
    display: flex;
    width: 40px;
    height: 8px;
    border-radius: 4px;
    background: #F4F5F9;
    overflow: hidden;
  }

  // 滑块宽度应为响应式宽度，这里给默认值14兜底使用，因为容器的宽度是固定的，当swipe过多，滑块宽度自然成比例减小
  .progress-line {
    width: calc(40px / 3);
    height: 8px;
    background: #ED5553;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
}

.nav-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 0;

  .item {
    margin-bottom: 8px;
  }
}

.group-2-inner-swipe-container {
  margin-left: 12px;
  margin-right: 12px;
}
</style>
