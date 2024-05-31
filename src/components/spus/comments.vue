<template>
  <div style="height: 100%" ref="backTop" :class="[returntop ? 'backtopactive' : '']">
    <div class="header">
      <div class="comments-header">
        <div class="comments-header-left" @click="toBack">
          <img src="../../assets/img/back1@2x.png" alt style="width: 0.96rem; height: 0.96rem" />
        </div>
        <div class="comments-header-title">商品评价</div>
      </div>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- <x-header :left-options="{backText: ''}">商品评价</x-header> -->

      <div style="height: 1.6rem; line-height: 1.6rem; font-size: 0.52rem; padding-left: 0.6rem; background: #fbfbfb; margin-top: 1.76rem">
        好评率{{ commentHandle(commentSummarize.goodCommentCount / commentSummarize.allCommentCount) }}
      </div>
      <!-- 评价 -->
      <div class="comments-tab">
        <div class="comments-btn" :class="{ active: tabValue == 0 }" @click="changeTab(0)">全部{{ commentSummarize.allCommentCount }}</div>
        <div class="comments-btn" :class="{ active: tabValue == 1 }" @click="changeTab(1)" v-if="commentSummarize.allCommentCount">
          好评{{ commentSummarize.goodCommentCount }}
        </div>
        <div class="comments-btn" :class="{ active: tabValue == 2 }" @click="changeTab(2)" v-if="commentSummarize.allCommentCount">
          中评{{ commentSummarize.middleCommentCount }}
        </div>
        <div class="comments-btn" :class="{ active: tabValue == 3 }" @click="changeTab(3)" v-if="commentSummarize.allCommentCount">
          差评{{ commentSummarize.badCommentCount }}
        </div>
      </div>
      <van-list
        v-model="isUpLoading"
        :finished="upFinished"
        :immediate-check="false"
        :offset="300"
        finished-text="我是有底线的"
        @load="onLoad"
        v-if="pageList.length > 0"
      >
        <div class="friends-item" v-for="(item, index) in pageList" :key="index">
        
          <div class="common-eader">
            <img v-if="item.customerImage" :src="item.customerImage" alt />
            <img src="../../assets/img/Avatar_default.png" alt v-else />
          
            <section>   
              <main> 
                <div class="username" v-if="item.isAnonymous == 0">
                  <span v-if="item.relename">
                    {{
                      item.relename.length > 1
                        ? item.relename.charAt(0) + '****' + item.relename.charAt(item.relename.length - 1)
                        : item.relename.charAt(0) + '****'
                    }}
                  </span>
                  <span v-else>
                    {{
                      item.customerName.length > 1
                        ? item.customerName.charAt(0) + '****' + item.customerName.charAt(item.customerName.length - 1)
                        : item.customerName
                        ? item.customerName.charAt(0) + '****'
                        : '******'
                    }}
                  </span>                  
                  <!-- {{ !item.relename ? item.relename : item.customerName.substr(0, 3) + '****' + item.customerName.substr(7) }} -->
                </div>
                <div class="username" v-else>
                  <span v-if="item.relename">
                    {{ '*****' + item.relename.charAt(item.relename.length - 1) }}
                  </span>
                  <span v-else>
                    {{ item.customerName ? '*****' + item.customerName.charAt(item.customerName.length - 1) : '******' }}
                  </span>
                </div>   
                <div class="ping-list">                        
                  <!-- <a class="commstar_star star1" :class="item.score <= '1' ? 'active' : ''"></a>
                  <a class="commstar_star star2" :class="item.score > '1' && item.score <= '2' ? 'active' : ''"></a>
                  <a class="commstar_star star3" :class="item.score > '2' && item.score <= '3' ? 'active' : ''"></a>
                  <a class="commstar_star star4" :class="item.score > '3' && item.score <= '4' ? 'active' : ''"></a>
                  <a class="commstar_star star5" :class="item.score > '4' && item.score <= '5' ? 'active' : ''"></a> -->
                  <img :src="item.score >= '1' ? require('@/assets/img/goodsDetail/ping_1.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                  <img :src="item.score >= '2' ? require('@/assets/img/goodsDetail/ping_2.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                  <img :src="item.score >= '3' ? require('@/assets/img/goodsDetail/ping_3.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                  <img :src="item.score >= '4' ? require('@/assets/img/goodsDetail/ping_4.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                  <img :src="item.score >= '5' ? require('@/assets/img/goodsDetail/ping_5.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                </div>            
              </main>  
              <footer>{{ item.createTime.split(' ')[0] }}</footer>
            </section>   
             
            <!-- <div class="commstar commstarList">
              <a class="commstar_star star1" :class="item.score <= '1' ? 'active' : ''"></a>
              <a class="commstar_star star2" :class="item.score > '1' && item.score <= '2' ? 'active' : ''"></a>
              <a class="commstar_star star3" :class="item.score > '2' && item.score <= '3' ? 'active' : ''"></a>
              <a class="commstar_star star4" :class="item.score > '3' && item.score <= '4' ? 'active' : ''"></a>
              <a class="commstar_star star5" :class="item.score > '4' && item.score <= '5' ? 'active' : ''"></a>
            </div> -->
          </div>

          <div class="comments-content">
            <comment :introduce="item.comment" />
          </div>
          <div class="comments-img" v-if="item.commentPics.length > 0">
            <div class="previewerImg" v-for="(element, imgIndex) in item.commentPics" :key="imgIndex">
              <!-- <img :src="element.url" @click="showImg(index, imgIndex)" /> -->
              <img v-if="element.url" :src="element.url" @click="showImg(item.commentPics, imgIndex)" />
            </div>
          </div>
          <div class="sku_sx">{{ item.skuSpecName }}</div>
          <custom-comment :commentData="item.commentReplies"></custom-comment>
        </div>
      </van-list>
    </van-pull-refresh>

    <div v-for="(item, index) in pageList" :key="index">
      <previewer :list="item.commentPics" ref="previewer" :options="options(index)"></previewer>
    </div>

    <div class="nocomment-box">
      <div class="nocomment" v-if="pageList.length === 0">
        <img src="../../assets/img/bge@2x.png" alt style="width: 3.96rem; height: 3.8rem" />
        <p style="font-size: 0.64rem; color: #666; line-height: 0.72rem; margin-top: 1.24rem">还没人发表评价</p>
        <p style="font-size: 0.56rem; color: #999; line-height: 0.64rem; margin-top: 0.48rem">看看其他的~</p>
      </div>
    </div>

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop">
      <img src="@/assets/img/top@2x.png" class="returntop" @click="backtop" alt="" />
    </div>
  </div>
</template>

<script>
import { XHeader, Divider, Group, Cell, Tab, TabItem, Previewer } from 'vux'
import { List, PullRefresh, ImagePreview } from 'vant'
import comment from '@/components/commons/comment'
import CustomComment from '@/components/commons/CustomComment'

import { queryCommentSummarize, querySkuComments } from '@/api/comments'
import { movePointRight } from '@/utils/number'
export default {
  components: {
    XHeader,
    Divider,
    Group,
    Cell,
    Tab,
    TabItem,
    Previewer,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [ImagePreview.name]: ImagePreview,
    comment,
    CustomComment,
  },
  data() {
    return {
      commentSummarize: {}, // 评价概括
      skuId: this.$route.query.id, //单品id
      tabValue: 0, // 顶部tab 切换值
      listQuery: {
        pageNum: 0, // 当前页码
        pageSize: 10, // 每页显示记录数
      },
      noMore: false, //没有更多
      pageList: [], //页面数据源
      loading: false, //正在加载

      refreshing: false,
      isUpLoading: false,
      upFinished: false,
      isshowtop: false, // 回到顶部
      returntop: false, // 返回顶部
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.queryCommentSummarize()
    this.querySkuComments()
  },
  mounted() {
    // 滚动条的获取
    window.addEventListener('scroll', this.handleScroll, true)
  },
  watch: {
    isshowtop(value) {
      if (!value) this.returntop = false
    },
  },
  computed: {
    // goodComments() {
    //   return this.commentSummarize.allCommentCount
    //     ? (this.commentSummarize.goodCommentCount / this.commentSummarize.allCommentCount).toFixed(2) * 100 + '%'
    //     : '100%'
    // },
    commentHandle() {
      return function(val) {
        let _val = val + ''
        return `${ movePointRight(_val.substring(0, _val.indexOf('.') + 3, 2), 2)}%`
      }
    },
  },
  methods: {
    // 监听滚动
    handleScroll() {
      if (!this.$refs.backTop) return
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop) // 取绝对值
      // console.log('滚动了', scorllTop)
      if (scorllTop >= 2500) this.isshowtop = true
      else this.isshowtop = false
    },
    // 回到顶部
    backtop() {
      if (this.isshowtop) this.returntop = true
      else this.returntop = false
    },
    toBack() {
      this.$router.go(-1)
    },
    onRefresh() {
      this.listQuery.pageNum = 0
      this.pageList = []
      this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.refreshing = true
      // this.isUpLoading = true
      this.querySkuComments() // 加载数据
    },
    onLoad() {
      // this.isUpLoading = true
      this.refreshing = false
      this.listQuery.pageNum++
      this.querySkuComments()
    },
    options(itemIndex) {
      return {
        getThumbBoundsFn(index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.friends-item')[itemIndex].querySelectorAll('.previewerImg')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        },
      }
    },
    // 切换tab
    changeTab(e) {
      this.tabValue = e
      this.pageList = []
      this.noMore = false
      this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.listQuery = {
        pageNum: 0, // 当前页码
        pageSize: 10, // 每页显示记录数
      }
      // this.$refs.scroller.finishInfinite(false)
      this.querySkuComments()
    },
    // 查询单品评价
    querySkuComments() {
      querySkuComments(this.skuId, this.tabValue == 0 ? -1 : this.tabValue, this.listQuery).then((response) => {
        let list = response.data
        this.isUpLoading = false
        this.refreshing = false
        // this.listQuery.pageNum++
        if (list.length == 0) {
          document.getElementsByTagName('body')[0].className = 'white-bg'
        } else {
          document.getElementsByTagName('body')[0].className = 'gray-bg'
        }
        if (list.length > 0) {
          list.forEach((l) => {
            if (l.commentPics && l.commentPics.length > 0) {
              l.commentPics.forEach((pic) => {
                pic.src = pic.url
              })
            }
          })
          this.pageList = this.pageList.concat(list)
        }
        this.loading = false
        if (list.length < 10) {
          // this.noMore = true
          this.upFinished = true
        }
      })
    },
    // 查询评价概括
    queryCommentSummarize() {
      queryCommentSummarize(this.skuId).then((res) => {
        if (res.allCommentCount == 0) {
          document.getElementsByTagName('body')[0].className = 'white-bg'
        }
        this.commentSummarize = res
      })
    },
    // 显示大图
    showImg(list, imgIndex) {
      // showImg(index, imgIndex) {
      // this.$refs.previewer[index].show(imgIndex)
      let imgList = list.map((item) => {
        return item.url
      })
      ImagePreview({
        images: imgList,
        showIndex: true,
        loop: false,
        startPosition: imgIndex,
      })
    },
  },
}
</script>
<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 1.76rem;
  z-index: 999;
}
.comments-header {
  display: flex;
  background: #fff;
  position: relative;
  .comments-header-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 1.76rem;
    height: 1.76rem;
    padding: 0.4rem;
  }
  .comments-header-title {
    width: 100%;
    height: 1.76rem;
    font-size: 0.72rem;
    line-height: 1.76rem;
    text-align: center;
  }
}
.comments-tab {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  width: 100%;
  max-height: 3.52rem;
  padding: 0.4rem 0.6rem 0.48rem;
  font-size: 0.52rem;
  border-radius: 0 0 0.4rem 0.4rem;
}
.comments-btn {
  display: inline-block;
  width: 3.28rem;
  height: 1.12rem;
  line-height: 1.12rem;
  text-align: center;
  background: #fef4f4;
  border-radius: 0.56rem;
  margin-right: 0.4rem;
  margin-bottom: 0.4rem;
}
.friends-item {
  background: #fff;
  margin-top: 0.48rem;
  border-radius: 0.4rem;
}
.active {
  color: #e60113;
}

.comments-content {
  padding: 0.48rem;
  font-size: 0.6rem;
  line-height: 0.88rem;
}
.comments-img {
  height: 4.8rem;
  padding-bottom: 0.64rem;
  overflow: scroll;
  flex-wrap: nowrap;
  display: flex;
  .previewerImg {
    width: 4rem;
    height: 4rem;
    margin-right: 0.12rem;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.2rem;
    }
  }
  .previewerImg:first-child {
    padding-left: 0.72rem;
    width: 4.72rem;
  }
  .previewerImg:last-child {
    padding-right: 0.72rem;
    width: 4.72rem;
  }
}
.sku_sx {
  // height: 0.64rem;
  line-height: 0.64rem;
  box-sizing: content-box;
  color: #999999;
  padding-bottom: 0.64rem;
  padding-left: 12px;
}
.nocomment {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2.4rem;
}
.returntopBox {
  width: 100%;
  .returntop {
    width: 1.6rem;
    height: 1.6rem;
    position: fixed;
    bottom: 2.6rem;
    right: 0.48rem;
    z-index: 1;
  }
}
.backtopactive {
  position: fixed;
  top: 0;
}
.common-eader{
  width: 100%;
  display: flex;        
  align-items: center;
  height: 36px;
  padding: 10px 12px 0;
  >section{
    display: flex;           
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    padding: 2px 0;
    >main{
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 17px;
      .ping-list{       
        width: 12px;
         height: 100%;
        display: flex;
        margin-top: -3px;
       
      }
    }
    >footer{
      height: 15px;
      line-height: 15px;
      font-size: 11px;
      color: #999999;             
    }
    .username {
      display: inline-block;            
      font-weight: 100;          
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-right: 4px;
      font-size: 13px;
      color: #444444;
      height: 15px;
      line-height: 15px;
    }
    >img {
      display: inline-block;
      width: 12px;
      height: 12px;     
    }
    
  }
  >img {
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

</style>
