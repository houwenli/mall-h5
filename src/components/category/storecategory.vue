<template>
  <div class="store-container" ref="container">
    <div class="store-header" :class="{ moveDown: showTitle, moveUp: !showTitle }">
      <div class="store-search">
        <i class="back" @click="toBack"></i>
        <div class="search-input" @click="toSearch">
          <i class="search"></i>
          <input type="text" />
        </div>
        <i class="more" @click="shopTopNavVisible = !shopTopNavVisible"></i>
        <div v-if="shopTopNavVisible" class="mui-global-nav">
          <div class="mui-global-nav-arr"></div>
          <ul>
            <li class="mui-global-nav-tab-home" @click="toIndex">首页</li>
            <li class="mui-global-nav-tab-shop" @click="toStoreIndex">店铺首页</li>
            <li class="mui-global-nav-tab-class" @click="toStoreCategory">店铺分类</li>
            <li class="mui-global-nav-tab-goods" @click="toSpuList">全部商品</li>
            <li class="mui-global-nav-tab-service" @click="callUp">联系客服</li>
          </ul>
        </div>
      </div>
      <div class="store-title">
        <div class="store-info">
          <div class="avatar">
            <img :src="storeInfo.avatarPicture || emptyImage" alt="" />
          </div>
          <div class="name">
            <p class="storeName doubleoverline">{{ storeInfo.storeName }}</p>
            <div class="tag-part">
              <!--              <span class="tag store-type">万顺福自营</span>-->
              <div class="tag">综合体验</div>
              <van-rate style="margin-right: 12px" allow-half readonly size="10px" v-model="rate" />
              <span class="tag">{{ 10000 + storeInfo.followNum }}人关注</span>
            </div>
          </div>
        </div>
        <div class="store-like" :class="{ 'no-attention': !storeInfo.hasAttention, 'is-attention': storeInfo.hasAttention }" @click="attentionStore">
          <i v-show="!storeInfo.hasAttention" class="mark"></i>
          <span>{{ storeInfo.hasAttention ? '已' : '' }}关注</span>
        </div>
      </div>
    </div>
    <div class="category-container">
      <div class="category-group" v-for="(storeCategory, index) in storeCategoryList" :key="index">
        <van-cell title-class="category-group-title" :title="storeCategory.name" is-link :border="false" @click.native="toStoreSpuList(storeCategory.id)">
          <template #right-icon>
            <img src="../../assets/img/Order_more@2x.png" style="width: 5px; height: 11px; margin-top: 6px" alt="" />
          </template>
        </van-cell>
        <div class="category-group-label" v-if="storeCategory.childCateGory.length">
          <template v-for="(element, i) in storeCategory.childCateGory">
            <div :key="i" class="category-group-label-item" @click.stop="toStoreSpuList(element.id)">
              {{ element.name }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, Divider, Flexbox, FlexboxItem, Group } from 'vux'

import { querySortedAllStoreCategory, queryStoreInfo } from '@/api/storecategory'

import { addStoreAttention, cancelStoreAttention } from '@/api/storeindex'

import emptyImage from '@/assets/img/shopIcon.png'

export default {
  components: {
    Divider,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
  },
  data() {
    return {
      shopTopNavVisible: false, // 是否展示顶部菜单栏
      storeInfo: {}, // 店铺信息
      storeCategoryList: [], // 店铺分类列表
      rate: 5, // 店铺评分
      showTitle: false,
      emptyImage: emptyImage,
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.queryStoreInfo(this.$route.query.storeId)
    this.querySortedAllStoreCategory(this.$route.query.storeId)
  },
  methods: {
    // 查询店铺信息
    queryStoreInfo(storeId) {
      let that = this
      queryStoreInfo(storeId).then((res) => {
        if (res.flag && res.data) {
          that.storeInfo = res.data
        }
      })
    },
    // 查询店铺全部分类
    querySortedAllStoreCategory(storeId) {
      let that = this
      querySortedAllStoreCategory(storeId).then((res) => {
        if (res && res.length > 0) {
          that.storeCategoryList = res
        }
      })
    },
    //关注/取关店铺
    attentionStore() {
      if (this.storeInfo.hasAttention) {
        cancelStoreAttention(this.$route.query.storeId).then((res) => {
          if (res.data == 1) {
            this.queryStoreInfo(this.$route.query.storeId)
            this.$vux.toast.text('取关成功', 'middle')
          }
        })
      } else {
        console.log('1221211')
        addStoreAttention(this.$route.query.storeId).then((res) => {
          if (res.data == 1) {
            this.queryStoreInfo(this.$route.query.storeId)
            this.$vux.toast.text('关注成功', 'middle')
          }
        })
      }
    },
    toBack() {
      this.$router.back(-1)
    },
    // 跳转到搜索页面
    toSearch() {
      this.$router.push({ path: '/search' })
    },
    // 跳转到首页
    toIndex() {
      this.$router.push({ path: '/' })
    },
    // 跳转到店铺首页
    toStoreIndex() {
      this.$router.push({ path: '/storeindex', query: { storeId: this.$route.query.storeId } })
    },
    // 跳转到店铺分类页面
    toStoreCategory() {
      this.$router.replace({ path: '/storecategory', query: { storeId: this.$route.query.storeId } })
    },
    // 跳转到全部商品页面
    toSpuList() {
      this.$router.push({ path: '/spulist', query: { storeId: this.$route.query.storeId } })
    },
    // 联系客服
    toService() {
      window.ysf('open')
      // if (!this.storeInfo.serviceQQ) {
      //   this.$vux.toast.text('暂无客服', 'bottom')
      // } else {
      //   if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      //     let newLink = window.open()
      //     newLink.location.href = 'mqqwpa://im/chat?chat_type=wpa&uin=' + this.storeInfo.serviceQQ + '&version=1&src_type=web&web_src=bjhuli.com'
      //   } else {
      //     let newLink = window.open()
      //     newLink.location.href = 'http://wpa.qq.com/msgrd?v=3&uin=' + this.storeInfo.serviceQQ + '&site=qq&menu=yes"'
      //   }
      // }
    },
    // 跳转到店铺分类页面
    toStoreSpuList(cateId) {
      console.log(cateId)
      this.$router.push({
        path: '/spulist',
        query: { queryString: '', storeCateId: cateId, storeId: this.$route.query.storeId },
      })
    },
  },
}
</script>

<style lang="less" scoped>
@keyframes moveDown {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -132px, 0);
  }
}

@-moz-keyframes moveDown /* Firefox */ {
  from {
    -moz-transform: translate3d(0, 0, 0);
  }
  to {
    -moz-transform: translate3d(0, -132px, 0);
  }
}

@-webkit-keyframes moveDown /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -132px, 0);
  }
}

@-o-keyframes moveDown /* Opera */ {
  from {
    -o-transform: translate3d(0, 0, 0);
  }
  to {
    -o-transform: translate3d(0, -132px, 0);
  }
}

@keyframes moveUp {
  from {
    transform: translate3d(0, -132px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@-moz-keyframes moveUp /* Firefox */ {
  from {
    -moz-transform: translate3d(0, -132px, 0);
  }
  to {
    -moz-transform: translate3d(0, 0, 0);
  }
}

@-webkit-keyframes moveUp /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, -132px, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0, 0);
  }
}

@-o-keyframes moveUp /* Opera */ {
  from {
    -o-transform: translate3d(0, -132px, 0);
  }
  to {
    -o-transform: translate3d(0, 0, 0);
  }
}

.store-container {
  background: #f5f5f5;
  padding-top: 136px;
  height: 100%;

  .moveDown {
    transform: translate3d(0, -132px, 0);
    animation: moveDown 0.5s;
  }

  .moveUp {
    transform: translate3d(0, 0, 0);
    animation: moveUp 0.5s;
  }

  .store-header {
    padding: 0 12px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 999;

    .store-search {
      height: 44px;
      display: inline-flex;
      align-items: center;
      width: 100%;

      i {
        width: 24px;
        height: 24px;
        display: inline-block;
        background-size: 100%;

        &.back {
          background-image: url('../../assets/img/store/back.png');
        }

        &.more {
          background-image: url('../../assets/img/store/more.png');
        }

        &.search {
          margin-top: 2px;
          margin-right: 6px;
          background-image: url('../../assets/img/store/search.png');
        }
      }

      .search-input {
        padding-left: 10px;
        display: inline-flex;
        align-items: center;
        width: 273px;
        height: 32px;
        background: #ededed;
        border-radius: 16px;
        margin: 0 auto;
        overflow: hidden;

        input {
          background: #ededed;
          width: 100%;
        }
      }
    }

    .store-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 84px;
      padding-bottom: 10px;
      // height: 70px;

      .store-info {
        display: flex;
        justify-content: center;
        align-items: center;

        .avatar {
          vertical-align: middle;
          display: inline-block;
          width: 42px;
          height: 42px;
          border-radius: 5px;
          border: 1px solid #ddd;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          margin-left: 5px;
          height: 40px;
          display: inline-block;
          // vertical-align: top;
          .storeName {
            max-width: 9.6rem;
            font-size: 18px;
            font-weight: bold;
            color: #000;
            line-height: 20px;
          }
          .tag-part {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            line-height: 26px;

            .tag {
              display: inline-block;
              margin-right: 2px;
              color: #666;
              font-size: 0.4rem;
            }

            .store-type {
              vertical-align: middle;
              background: linear-gradient(277deg, #ffedf1 0%, #ed6f42 0%, #e60113 100%);
              border-radius: 2px;
              color: #fff;
              line-height: 12px;
              padding: 1px 2px;
            }
          }
        }
      }

      .store-like {
        width: 62px;
        height: 26px;
        border-radius: 13px;
        font-size: 13px;

        text-align: center;
        line-height: 26px;

        .mark {
          vertical-align: middle;
          background-image: url('../../assets/img/store/favorite.png');
          background-size: 100%;
          width: 16px;
          height: 16px;
          display: inline-block;
          margin-top: -2px;
        }
      }

      .is-attention {
        background: #fff;
        border: 1px solid #999;
        color: #999;
      }

      .no-attention {
        background: #e60113;
        color: #fff;
      }
    }
  }

  .category-container {
    padding: 0 12px;

    .category-group {
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 12px;

      & /deep/ .van-cell {
        padding: 15px 12px;
      }

      .category-group-title {
        font-size: 14px;
        font-weight: 500;
        color: #000000;
      }

      .category-group-label {
        width: 100%;
        padding: 0 12px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        background-color: #fff;
        .category-group-label-item {
          width: 6.44rem;
          height: 1.8rem;
          line-height: 1.8rem;
          margin-bottom: 5px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          background-color: #f5f5f5;
          box-sizing: border-box;
          padding-left: 10px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
