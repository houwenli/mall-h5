<template>
  <div class="gray-bg" ref="backTop" :class="[returntop ? 'backtopactive' : '', userCollectionList.length == 0?'boxWrapper':'']" 
  :style="{'height':userCollectionList.length <= 2 ? '100%':''}">
    <navbartop
      :title="'优惠促销'"
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
          src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/a6dcf296efd0e95b2349e8f332ae19c8.png"
          style="width: 90px; height: 90px"
          mode=""
        />
        <span class="no-text">暂无优惠促销〜</span>
      </div>

      <template v-if="userCollectionList.length > 0">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" :offset="100" @load="onLoad">
          <div v-for="(item, index) in userCollectionList" :key="item.id" style="margin-bottom: 15px; text-align: center">
            <span class="active_time">{{ item.createTime }}</span>
            <van-swipe-cell>
              <div class="item" @click="goRouter('active',item)">
                <img :src="item.extraData&&item.extraData.activitySharePic" mode="" class="item_image" />
                <img src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f2fbaca471aefdf11fcc3fa8d453a7dd.png" mode="" class="engImg" v-if="item.extraData.status == 4" />
                <div class="item_content">
                  <div class="item_header">
                    <span class="title overline">{{ item.title }}</span>
                  </div>
                  <div class="content">
                    <span class="doubleoverline" style="text-align: left">
                      {{ item.content }}
                    </span>
                  </div>
                </div>
              </div>
              <template #right>
                <van-button square type="danger" text="删除" style="height: 100%; border-radius: 10px;padding: 0 20px;" @click="RemoveSku(item,index)">
                  <p>删除</p>
                </van-button>
              </template>
            </van-swipe-cell>
          </div>
        </van-list>
      </template>

      <!-- 领券 -->
      <div class="couponsBox">
        <div class="flexBox flexBox-center">
          <img style="width: 20px; height: 20px" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2471878d3a92bd36f1c9c0f828c15bd4.png" />
          <span class="coupon_t" @click="goRouter('couponCenter')">领券</span>
          <img style="width: 18px; height: 12px" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/4d7f6b3f7c164688e033de1bd992b93c.png" />
        </div>
      </div>

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
        msgGroup: 7,
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
    goRouter(data, item) {
      // console.log(data, 'data', item)
      if (data == 'active') {
        let id = item.extraData.marketingId
        if (id) {
          this.$router.push('firstOrder?id=' + id)
        }
      } else if (data == 'couponCenter') {
        this.$router.push('couponCenter')
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
          msgGroup:7
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
}
.dataBox {
  width: 100%;
  padding: 12px;
  .active_time {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    background: #dfdfdf;
    border-radius: 12px;
    font-size: 12px;
    padding: 0 11px;
    margin: 0 auto;
    color: #ffffff;
    margin-bottom: 10px;
  }
  .item {
    width: 100%;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
    .item_image {
      width: 100%;
      height: 140px;
      border-radius: 10px 10px 0 0;
    }
    .engImg {
      position: absolute;
      top: 24px;
      left: 50%;
      margin-left: -46px;
      width: 92px;
      height: 92px;
    }
    .item_header {
      margin-bottom: 12px;
      color: #000;
      .title {
        font-weight: bold;
        font-size: 17px;
        width: 327px;
        text-align: left;
        display: block;
      }
      .time {
        font-size: 12px;
        color: #bababa;
        line-height: 23px;
      }
    }
    .item_content {
      padding: 13px 12px 14px;
      .content {
        width: 100%;
        color: #999999;
      }
    }
  }
}
.couponsBox {
  width: 100%;
  height: 46px;
  line-height: 46px;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  .coupon_t {
    margin: 0 6px;
    color: #000;
    font-size: 14px;
    font-weight: bold;
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
