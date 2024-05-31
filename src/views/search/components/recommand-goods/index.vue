<template>
  <div class="goods-container" v-if="shopList.length > 0">
    <!-- 为您推荐 -->
    <div class="title-pic">
      <img src="@/assets/img/goodsDetail/jxhw.png" alt="" />
    </div>
    <!-- 商品列表 -->
    <waterfall ref="waterfall" :data="shopList"  storeId  :isEmpty="false" :noMore="noMore" />
  </div>
</template>

<script>
  import { getRecommendList } from '@/api/home' //分页查询为您推荐
  import { getSpuDiscountList } from '@/api/seach'
  import waterfall from '@/components/commons/waterfall.vue'
  // 为您推荐
  export default {
    name: 'recommand-goods',
    components: {
      waterfall,
    },
    data() {
      return {
        shopList: [],
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //是否有更多
        loading: false, //正在加载
      }
    },
    created() {
      window.addEventListener('scroll', this.scrollBottom, true)
      this.getData()
    },
    methods: {
      getData() {
        if (this.noMore) {
          return
        }
        let params = {
          orderCode: '',
          skuId: '',
          pageType: 8, //搜索页pageType为8
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize,
        }
        try {
          getRecommendList(params).then((response) => {
            if (response.code === 200) {
              let list = response.data || []
              this.listQuery.pageNum++
              if (list.length > 0) {
                this.shopList = this.shopList.concat(list)
              }
              this.loading = false
              if (list.length < 10) {
                this.noMore = true
              }
            }
          })
        } catch (error) {
          console.log(error)
        }
      },
      scrollBottom() {
        let scorllTop = null
        try {
          if (!this.$refs.waterfall) {
            return
          }
          scorllTop = this.$refs.waterfall.$refs.backTop.getBoundingClientRect().top // 加载盒子距顶部高度
        } catch (error) {
          console.log('scrollBottom: ', error)
        }
        const windowHeight = window.screen.height // 可视区高度
        if (scorllTop > 210 && scorllTop <= windowHeight) {
          if (!this.loading) {
            this.loading = true
            // 请求的数据未加载完成时
            this.getData()
          }
        }
      },
    },
    beforeDestroy() {
      window.removeEventListener('srcoll', this.scrollBottom)
    },
  }
</script>

<style lang="less" scoped>
  .goods-container {
    .title-pic {
      height: 15px;
      margin-bottom:10px;
      img {
        width: 68px;
        height: 100%;
      }
    }
  }
</style>
