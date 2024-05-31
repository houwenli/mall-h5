<template>
  <div data-desc="分类广告" class="categoty-ad-container" v-if="componentList.length">
    <div class="ad-component">
      <div v-for="(com, index) in componentList" :key="index" class="ad-component-item">
        <!-- 金刚区 只是占位符，实际渲染的数据是从接口拿的二级分类 -->
        <secondCategory v-if='com.text === "金刚区"'></secondCategory>

        <component  v-else :is="com.componentName" :config="com"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCategoryAdComponent } from './data.js'
import { getCategoryAd,getCategory } from '@/api/goodsCategory.js'
// 二级分类
import secondCategory from './second-category.vue'

export default {
  name: 'category-ad',

  components: {
    secondCategory
  },

  data () {
    return {
      adList: [],
      componentList: []
    }
  },

  computed: {
    ...mapState({
      activeTab: state=> state.HOME_PAGE_CONFIG.classifyActiveTab
    })
  },
  watch: {
    activeTab: {
      handler(val) {
        this.getAdTemplate(val)
      },
      immediate: true
    }
  },

  methods: {
    getAdTemplate(val) {
      let topCategoryList = this.$store.state.HOME_PAGE_CONFIG.topCategoryList || []

      if (topCategoryList[val] && topCategoryList[val].id !== undefined) {
        this.getCategoryAdList(topCategoryList[val])
      } else {
        // 首页或者一级分类没有id的  一律都不展示分类广告
        this.componentList = []
      }
    },

    /**
     * 回去一级分类下的广告
     */
    async getCategoryAdList (tag) {
      try {
        let res = await getCategoryAd(tag.id)
        let secondData = await getCategory(tag.id)

        // 二级分类数据展示，延用之前逻辑 有url就展示
        let secondCategoryList = secondData.data || []
        let resList = secondCategoryList.filter(item => {
          return item.url
        })
        if(resList.length && !res.data){
          let objData = {
            // 特殊处理-这里其实表达的意思是二级分类（二级分类和金刚区是一模一样的布局和配置）
            text: '金刚区',
            key: 'page-nav',
            list: secondCategoryList
          }
          this.componentList = [objData]
          return
        }


        // // 二级分类数据展示，延用之前逻辑 有url就展示
        // setTimeout(() => {
        //   let secondCategoryList = this.$store.state.HOME_PAGE_CONFIG.secondCategoryList || []
        //   let resList = secondCategoryList.filter(item => {
        //     return item.url
        //   })
        //   if(resList.length && !res.data){
        //     let objData = {
        //       // 特殊处理-这里其实表达的意思是二级分类（二级分类和金刚区是一模一样的布局和配置）
        //       text: '金刚区',
        //       key: 'page-nav',
        //       bgImage: '',
        //       bgColor: '',
        //       list: secondCategoryList
        //     }
        //     this.componentList = [objData]
        //     return
        //   }
        // }, 0);

        if (res.data === null || res.data === '') {
          this.componentList = []
          return
        }

        let data = res.data.indexJson || ''

        if (data.length) {
          try {
            data = JSON.parse(data)

            let contentList = data.contentList || []
            // 二级分类数据不展示，过滤金刚区
            if(Number(resList.length) === 0){
              contentList = contentList.filter(item=>{
                return item.text !== "金刚区"
              })
            }

            if (contentList.length) {
              for (let i = 0; i < contentList.length; i++) {
                let c = getCategoryAdComponent({ ...contentList[i] })
                contentList[i].componentName = c.loader
              }
            }

            contentList = contentList.filter(p => p.componentName)

            this.componentList = contentList
          } catch (error) {
            console.log('一级分类广告-模版解析报错', error)
          }
        }

      } catch (error) {
        console.log('获取一级类目下的分类广告失败', error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.categoty-ad-container {
  width: 100vw;
  overflow: hidden;
  // 让动态组件的子元素中的图片继承这个样式-否则图片会变形
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background: #F5F5F8;
  border-radius: 12px;

  .ad-component-item {
    margin: 12px 0;
    // padding-bottom: 14.5px;
  }
}
</style>
