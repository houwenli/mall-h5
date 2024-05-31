<template>
  <div class="gray-bg" ref="backTop" :class="[returntop ? 'backtopactive' : '', userCollectionList.length == 0?'boxWrapper':'']">
    <navbartop
      :title="'交易物流'"
      :isradius="true"
      :isRight="userCollectionList.length>0"
      :rightText="'清空'"
      @clickBack="backLastPage"
      @clickRight="clickRight"
      class="navtop"
    ></navbartop>

    <div class="dataBox">
      <!-- 无数据 -->
      <div v-if="userCollectionList.length == 0" class="flexBox flexBox-center flexBox-column" style="margin-top: 4rem">
        <img
          src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2e447cef0e741d8b4a1018bd4dae451b.png"
          style="width: 90px; height: 90px"
          mode=""
        />
        <span class="no-text">暂无物流消息〜</span>
      </div>

      <template v-if="userCollectionList.length > 0">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" :offset="100" @load="onLoad">
          <div v-for="(item, index) in userCollectionList" :key="item.id" style="margin-bottom: 12px">
            <van-swipe-cell >
              <div class="item">
                <div class="item_header">
                  <!-- <span class="title overline">{{ item.status == 1 ? '您的订单已签收' : '您的订单已发货' }}</span> -->
                  <span class="title overline">{{ item.templateName == 'DELIVER_ORDER' ? '您的订单已发货':'您的订单已收货'}}</span>
                  <span class="time">{{ item.createTime }}</span>
                </div>
                <div class="item_content" @click="goRouter(item)">
                  <img :src="item.extraData&&item.extraData.skuImage" mode="" class="item_img" />
                  <div class="content">
                    <span class="doubleoverline">{{ item.content }}</span>
                  </div>
                </div>
                <!-- <div class="item_store" @click="goRouter(item,'StoreIndex' )">
                  <div class="storeBox overline">
                    <img :src="item.extraData&&item.extraData.storeInfo.avatarPicture" mode="" class="storeimg" />
                    <span class="storeName overline">{{ item.extraData&&item.extraData.storeInfo.storeName }}</span>
                  </div>
                  <img class="gl" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e69ec7b6c7201863bb5954772a61305b.png" mode="" />
                </div> -->
              </div>
              <template #right>
                <van-button square type="danger" text="删除" style="height: 100%; border-radius: 10px;padding: 0 20px;" @click="RemoveSku(item, index)">
                  <p>删除</p>
                </van-button>
              </template>
            </van-swipe-cell>
          </div>
        </van-list>
      </template>

      <!-- 回到顶部 -->
      <div class="returntopBox" v-if="isshowtop">
        <img src="@/assets/img/top@2x.png" class="returntop" @click="backtop" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { SwipeCell, List, Dialog, Toast } from 'vant'
import navbartop from '@/components/commons/navBartop'
import { queryNews, cleanStationNews,deleteStationNews } from '@/api/mynews'
export default {
  components: {
    [SwipeCell.name]: SwipeCell,
    [List.name]: List,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    navbartop,
  },
  data() {
    return {
      queryForm: {
        msgGroup: 5,
        pageNum: 0, // 设置起始页码
        pageSize: 10, //返回每页数据的个数
      },
      userCollectionList: [], //放置返回数据的数组

      skuId: 0, //单品Id

      scrollTop: 0,
      isshowtop: false, // 回到顶部
      returntop: false, // 返回顶部

      loading: false, //正在加载
      finished: false,
    }
  },
  created() {
    this.getData()
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
  methods: {
    // 跳转
    goRouter(item,data) {
      if (data == 'StoreIndex') {
        this.$router.push({
          path:'/storeindex',
          query:{
            storeId:item.extraData.storeInfo.id
          },
        })
      } else {
        if (item.templateName == 'DELIVER_ORDER') {
          this.$router.push({
            path:'/orderdetail',
            query:{
              orderId:item.extraData.orderId,
              backStatus: item.extraData.backStatus
            },
          })
        } else {
          this.$router.push({
            path:'/evaluate',
          })
        }
      }
    },
    onLoad() {
      this.queryForm.pageNum++
      this.getData()
    },
    getData() {
      queryNews(this.queryForm).then((res) => {
        let list = res.data.records
        let page = res.data.pages
        if (list.length > 0) {
          list.forEach((item)=> {
            this.userCollectionList.push(item)
          })
          // this.userCollectionList = this.userCollectionList.concat(list)
        }
        this.loading = false
        // if (list.length < 10) {
        if (page == this.queryForm.pageNum + 1) {
          this.finished = true
        }
      })
    },
    // 监听滚动
    handleScroll() {
      if (!this.$refs.backTop) return
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop) // 取绝对值
      if (scorllTop >= 2500) this.isshowtop = true
      else this.isshowtop = false
    },
    // 回到顶部
    backtop() {
      if (this.isshowtop) this.returntop = true
      else this.returntop = false
    },
    RemoveSku(data, index) {
      let param = {
        msgId:data.id
      }
      deleteStationNews(param).then(res=>{
        if (res.code == 200) {
          this.userCollectionList.splice(index, 1)
          Toast('删除成功')
          // this.getData()
        }
      })
    },
    // 清除未读
    clickRight() {
      Dialog.confirm({
        message: '是否确认清空所有消息？',
      }).then(() => {
        let param = {
          msgGroup:5
        }
        cleanStationNews(param).then((res) => {
          if(res.code == 200) {
            this.userCollectionList = [];
            this.getData()
          }
        })
      })
    },
    // 返回
    backLastPage() {
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
body {
  overflow: visible;
}
.boxWrapper {
  height: 100%;
}
.dataBox {
  width: 100%;
  padding: 12px;
  .item {
    width: 100%;
    // height: 169px;
    background: #ffffff;
    border-radius: 10px;
    padding: 14px 12px 11px;
    .item_header {
      display: flex;
      justify-content: space-between;
      align-content: center;
      margin-bottom: 12px;
      color: #000;
      height: 23px;
      .title {
        font-weight: bold;
        max-width: 238px;
        font-size: 17px;
      }
      .time {
        font-size: 12px;
        color: #bababa;
        line-height: 23px;
      }
    }
    .item_content {
      display: flex;
      padding-bottom: 12px;
      border-bottom: 1px solid #f2f2f2;
      .item_img {
        width: 66px;
        height: 66px;
      }
      .content {
        width: 261px;
        background-color: #f8f8f8;
        padding: 10px;
        color: #999999;
      }
    }
    .item_store {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      line-height: 1.8;
      .storeBox {
        max-width: 300px;
        display: flex;
        align-items: center;
        .storeimg {
          width: 22px;
          height: 22px;
          border-radius: 50%;
        }
        .storeName {
          width: 300px;
          color: #333333;
          font-size: 14px;
          margin-left: 7px;
        }
      }
      .gl {
        width: 5px;
        height: 11px;
      }
    }
  }
}
.no-text {
  color: #999999;
  font-size: 0.56rem;
}
.returntopBox {
  width: 100%;
  .returntop {
    width: 1.6rem;
    height: 1.6rem;
    position: fixed;
    bottom: 2.6rem;
    right: 0.48rem;
  }
}
.backtopactive {
  position: fixed;
  top: 0;
}
</style>
