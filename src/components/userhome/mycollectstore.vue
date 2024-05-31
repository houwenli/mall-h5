<template>
  <div class="store-collection">
    <van-nav-bar title="店铺关注" left-arrow fixed right-text="清空" @click-left="backCustomerCenter" @click-right="clearStoreCollection" />
    <div class="background-line gray-bg"></div>
    <van-list
      v-if="pageList.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :offset="100"
      :immediate-check="false"
      @load="onLoad"
    >
      <ul v-if="pageList.length > 0" class="store-list clearfix gray-bg">
        <li v-for="item in pageList" :key="item.storeInfo.id" class="store-list-item" @click="toStoreIndex(item.storeInfo.id)">
          <van-swipe-cell @click="RemoveStore($event, item.storeInfo.id, item)">
            <div class="store-info">
              <div class="store-img">
                <img :src="item.storeInfo.avatarPicture" v-if="item.storeInfo.avatarPicture" />
                <img src="@/assets/img/Avatar_default.png" v-else />
              </div>
              <div class="store-info-box">
                <div class="store-name">{{ item.storeInfo.storeName }}</div>
                <div class="store-star">
                  <span class="experience">综合体验</span>
                  <van-rate v-model="starValue" :size="12" :gutter="1" allow-half void-color="#eee" />
                  <span class="attention">{{ item.storeAttentionCount ? item.storeAttentionCount + 10000 : 10000 }}人关注</span>
                </div>
              </div>
            </div>
            <template #right>
              <van-button square type="danger">
                <p>取消</p>
                <p>关注</p>
              </van-button>
            </template>
          </van-swipe-cell>
        </li>
      </ul>
    </van-list>
    <!-- 缺省页 -->
    <div v-if="pageList.length == 0" class="wrap">
      <img style="width: 90px; height: 90px" src="../../assets/img/cat_e@2x.png" alt="" />
      <div class="news-text">没有关注任何店铺~</div>
    </div>
    <!-- <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider> -->
  </div>
</template>

<script>
import { Divider } from 'vux'
import { SwipeCell, Rate, List, Dialog, Toast } from 'vant'
import {
  queryAttentionStore, //查询用户收藏的店铺信息
  removeAttentionStore, // 取消用户收藏的店铺信息
  clearAttentionStore, // 清空用户收藏的店铺信息
} from '@/api/mycollect'

export default {
  components: {
    [SwipeCell.name]: SwipeCell,
    [Rate.name]: Rate,
    [List.name]: List,
    [Toast.name]: Toast,
    Divider,
  },
  data() {
    return {
      listQuery: {
        pageNum: 0, // 当前页码
        pageSize: 10, // 每页显示记录数
      },
      isLoading: false,
      starValue: 5,
      pageList: [], //页面数据源
      loading: false, //正在加载
      finished: false,
      removeStore: {
        storeId: '',
      },
    }
  },
  created() {
    // document.getElementsByTagName('body')[0].className = 'gray-bg'
    document.body.removeAttribute('class', 'gray-bg')
    this.getData()
  },
  filters: {
    price(value) {
      if (value == null || value == undefined) {
        return ''
      }
      let price = parseFloat(value.price).toFixed(2)
      if (value.isBatchSku == '1') {
        price = parseFloat(value.lowestBatchPrice).toFixed(2) + '起'
      }
      return price
    },
  },
  methods: {
    onLoad() {
      this.listQuery.pageNum++
      this.getData()
    },
    clearStoreCollection() {
      Dialog.confirm({
        message: '是否确认清空所有关注？',
      }).then(() => {
        clearAttentionStore().then((res) => {
          this.pageList = []
          this.listQuery.pageNum = 0
          this.getData()
        })
      })
    },
    RemoveStore(position, storeId, item) {
      let params = {
        storeId: storeId,
      }
      switch (position) {
        case 'left':
        case 'cell':
        case 'outside':
          break
        case 'right':
          removeAttentionStore(params).then((res) => {
            let idx = this.pageList.indexOf(item)
            this.pageList.splice(idx, 1)
            Toast({
              message: '取消关注成功',
              position: 'top',
            })
          })
          break
      }
    },
    getData() {
      queryAttentionStore(this.listQuery).then((response) => {
        let list = response.data.list
        if (list.length > 0) {
          this.pageList = this.pageList.concat(list)
        }
        this.loading = false
        if (list.length < 10) {
          this.finished = true //已全部请求完毕
        }
      })
    },
    //跳转商品详情页
    toStoreIndex(id) {
      this.$router.push({ path: '/storeIndex', query: { storeId: id } })
    },
    // 返回用户个人中心页面
    backCustomerCenter() {
      this.$router.push({ path: '/home' })
    },
  },
}
</script>
<style lang="less" scoped>
body {
  overflow: visible;
}
.wrap {
  margin-top: 4.4rem;
  text-align: center;
}
.news-text {
  font-size: 0.56rem;
  line-height: 0.8rem;
  color: #999999;
  margin-top: .2rem;
}
.store-collection {
  // height: 100%;
  .van-nav-bar__left .van-icon {
    color: #6d6d6d;
  }
  .van-nav-bar__right {
    .van-nav-bar__text {
      color: #6d6d6d;
    }
  }
  .background-line {
    height: 58px;
  }
  .store-list li:first-child {
    border-radius: 0.4rem 0.4rem 0 0;
  }
  .store-list {
    .store-list-item {
      background-color: #ffffff;
      .van-swipe-cell__wrapper {
        display: flex;
        .store-info {
          display: flex;
          width: 100%;
          margin: 0.6rem 0.48rem;
          .store-img {
            width: 2.2rem;
            height: 2.2rem;
            margin-right: 0.48rem;
            flex-shrink: 0;
            img {
              border: 1px solid #f6f6f6;
              width: 100%;
              height: 100%;
              border-radius: 0.2rem;
            }
          }
          .store-info-box {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .store-name {
              color: #232326;
              font-size: 0.56rem;
              line-height: 0.8rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-word;
            }
            .store-star {
              margin-top: 7px;
              .experience {
                font-size: 0.48rem;
                display: inline-block;
                margin-left: -0.12rem;
                transform: scale(0.8);
                color: #999999;
              }
              .van-rate {
                font-size: 0.48rem;
                vertical-align: middle;
                transform: scale(0.8);
                margin-left: -0.4rem;
              }
              .attention {
                font-size: 0.48rem;
                margin-left: -0.2rem;
                display: inline-block;
                transform: scale(0.8);
                color: #999999;
              }
            }
          }
        }
        .van-button {
          height: 100%;
        }
        .store-info:after {
          content: '';
          height: 1px;
          width: 185%;
          position: absolute;
          left: 12px;
          top: auto;
          right: auto;
          bottom: 0px;
          background-color: #e3e5e9;
          border: 0px solid transparent;
          border-radius: 0px;
          -webkit-border-radius: 0px;
          transform: scale(0.5);
          -webkit-transform: scale(0.5);
          transform-origin: top left;
          -webkit-transform-origin: top left;
        }
      }
    }
  }
}
.van-dialog {
  .van-dialog__content {
    .van-dialog__message {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .van-hairline--top::after {
    border-top-width: 0px;
  }
  .van-hairline--left::after {
    border-left-width: 0px;
  }
  .van-dialog__footer {
    height: 60px;
    .van-dialog__cancel {
      left: 10px;
      bottom: 0px;
      .van-button__text {
        color: #e60113;
      }
    }
    .van-dialog__confirm {
      left: -10px;
      bottom: 0px;
      .van-button__text {
        background-color: #e60113;
        color: #ffffff;
      }
    }
    .van-button__content {
      .van-button__text {
        border: 1px solid #e60113;
        padding: 7px 35px;
        border-radius: 15px;
        font-size: 12px;
      }
    }
  }
}
</style>