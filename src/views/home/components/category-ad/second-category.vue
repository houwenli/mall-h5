<template>
  <!-- 二级分类 -->
  <div class="nav">
    <div class="nav-list-container"  v-if='getGroupData.length || getSwiperGroupData.length'  data-desc="二级分类">
      <div class="inner-list-container" >
        <!-- 0-10个，一种样式 -->
        <div class="group-1" v-if="showOnePanel" :style="getStyle">
          <div class="line" v-for="(lineGroup, lineIndex) in getGroupData" :key="lineIndex">
            <div class="item" v-for="(item, index) in lineGroup" :key="index" @click="navigate(item, index)">
              <img class="pic" :src="item.url" alt="" v-if="item.url" />
              <img class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
              <div class="nav-title" :style="{ color: config.textColor }">{{ item.name }}</div>
            </div>
          </div>
        </div>

        <!-- 超过一屏， 滑动 -->
        <div class="group-2" v-else>
          <!-- 包一层  避免下面的金刚区滑动的时候，元素最左侧和最右侧是贴着外面的边滑动的 -->
          <div class="group-2-inner-swipe-container">
            <van-swipe   indicator-color="#FD302C" @change="onChange">
              <!-- 指示器样式 -->
              <template #indicator>
                <div class="custom-indicator">
                  <div class="indicator-wrap" ref='indicatorWrapRef'>
                    <div class="progress-line" :style="getActiveProcessPosition"></div>
                  </div>
                </div>
              </template>

              <van-swipe-item v-for="(lineGroup, index) in getSwiperGroupData" :key="index">
                <div class="nav-wrapper">
                  <div class="item" v-for="(advert, childIndex) in lineGroup" :key="advert.id" @click="navigate(advert, childIndex)">
                    <img class="pic" v-if="advert.url" :src="advert.url" />
                    <img class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
                    <div class="nav-title" :style="{ color: config.textColor }">{{ advert.name }}</div>
                  </div>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

// 二级分类
export default {
  name: "second-category",

  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },

  data () {
    return {
      swipeIndex: 0,

      // 指示器宽度
      processContainerWidth: 40
    }
  },

  computed: {
    ...mapState({
      list: state => state.HOME_PAGE_CONFIG.secondCategoryList || [],
      config: state => {
        let list = state.HOME_PAGE_CONFIG.contentList || []

        // 从金刚区里面拿到 背景颜色等其他配置

        let item = list.filter(p => p._key === 'page-nav')

        return item[0]
      }
    }),
    /**
     * 分组
     */
    getGroupData () {
      return this.getTwoGroup(this.list, 5)
    },

    getSwiperGroupData () {
      this.getIndicatorWrapWidth()

      return this.getTwoGroup(this.list, 10)
    },
    // 仅展示一屏
    showOnePanel () {
      let arr = this.list || []

      return arr.length < 11
    },

    getStyle () {
      let styles = {}

      if (String(this.config.backgroundType) === "0") {
        styles.background = this.config.bgColor || '#FFF'
      }

      if (String(this.config.backgroundType) === "1") {
           styles.background = this.config.bgImage ? `url(${this.config.bgImage}) no-repeat` : '#FFF'
      }

      return styles
    },


    /**
     * 获取指示器高亮的位置
     */
    getActiveProcessPosition() {
      // 如果存在computed中没获取到的情况，再兜底获取一次指示器容器宽度
      if(!this.processContainerWidth) {
        this.getIndicatorWrapWidth()
      }

      // 单个滑块的宽度 - 响应式宽度
      let width = this.processContainerWidth / this.getSwiperGroupData.length

      // 滑动的距离计算
      let x = (this.swipeIndex * width)

      // 如果滑动到最后一个，直接手动设置滚动距离 - 避免1-2px在不同机型上的差异
      if (this.swipeIndex === this.getSwiperGroupData.length -1) {
        x = this.processContainerWidth - width + 1
      }
      return {
        width: `${width}px`,
        transform: `translateX(${x}px)`
      }
    }
  },
  methods: {
    /**
     * 1、点 一级分类下面二级分类， 直接将当前的关键字 + 类目id 跳转到查询商品列表界面
     */
    navigate (data) {
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
.nav-list-container {
  margin-bottom: 10px;
  .inner-list-container {
    margin: 0 12px;
    background: #fff;
    border-radius: 12px;
  }
}


// 仅展示一屏
.group-1 {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 12px 4px 12px;
  border-radius: 12px;

  .line {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
}
.item {
  margin-right: 16px;

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
