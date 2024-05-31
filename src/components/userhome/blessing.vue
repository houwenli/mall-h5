<template>
  <div class="blessing-page">
    <div v-if="isShow">
      <navbartop title="福气值流水" @clickBack="backLastPage"></navbartop>
      <van-pull-refresh v-model="isDownLoading" disabled @refresh="onDownRefresh">
        <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check='false' :offset="300" finished-text="没有更多数据" @load="onLoadList">
          <div class="bless-item" v-for="(item, index) in pageList" :key="index">
            <div>
              <p class="title">{{item.title}}</p>
              <p class="time">{{item.time}}</p>
            </div>
            <div class="money" :class="{'isAdd':item.addFlag ==1}">
              <span>{{item.addFlag == 1?'+':'-'}}</span>
              <span>{{item.fqzPoint}}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      <div class="bottom-container">
        <div class="fqz">
          <span>当前福气值余额：</span>
          <span class="val">{{fqzToal}}</span>
        </div>
        <van-button class="Submit" type="primary" round @click="toHome">马上购物</van-button>
      </div>
    </div>
  </div>
</template>

<script>
const streamStatus = {
  1: '奖励（推荐购买包干）',
  2: '消费',
  3: '退还',
  4: '取消订单',
  5: '调账-年终专项奖',
  6: '调账-补款',
  7: '调账-异常扣款',
  8: '调账-风控扣款'
}
import { getFqzStreamMobile } from '@/api/home'
import { List, PullRefresh } from 'vant'
import navbartop from '@/components/commons/navBartop' // 导航栏
export default {
  components: { [List.name]: List, [PullRefresh.name]: PullRefresh, navbartop },
  data() {
    return {
      pageList: [],
      listQuery: {
        pageNum: 1, // 当前页码
        pageSize: 20 // 每页显示记录数
      },
      isDownLoading: false, //  否处于加载状态
      isUpLoading: false, //  否处于加载状态
      upFinished: false, //  	是否已加载完成
      fqzToal: 0,
      isShow: false
    }
  },
  async mounted() {
    setTimeout(async () => {
      let userInfo = await this.$store.dispatch('user/getUserInfo')
      this.fqzToal = (userInfo.data.fqzPoint / 100).toFixed(2)
      this.getData();
      this.$nextTick(() => {
        this.isShow = true;
      })
    }, 1000)
  },
  methods: {
    onDownRefresh() {
      this.listQuery.pageNum = 1;
      this.isUpLoading = false;
      this.getData(); // 加载数据
    },
    backLastPage() {
      if (this.$route.query && this.$route.query.fromH5) {
        this.$router.back()
      } else {
        if (window.ws) {
          // android环境
          window.ws.finishActivity();
        } else if (window.webkit) {
          // ios环境
          window.webkit.messageHandlers.finishActivity.postMessage('');
        }
      }

    },
    // 滚动条与底部距离小于 offset 时触发
    onLoadList() {
      this.getData();
    },
    getData() {
      console.log(this.listQuery, this.upFinished, '----');
      // setTimeout(
      //   () => {
      let params = { ...this.listQuery };
      getFqzStreamMobile(params)
        .then(res => {
          this.isDownLoading = false;
          this.isUpLoading = false;
          if (res.data) {
            let list = res.data.map(item => {
              return {
                ...item,
                title: item.streamStatusValue,
                time: item.createTime || item.updateTime,
                fqzPoint: Math.abs(item.fqzPoint / 100).toFixed(2)
              };
            });
           
            if (list == null || list.length === 0) {
              // 加载结束
              this.upFinished = true;
            }
            if (list.length < this.listQuery.pageSize) {
              // 最后一页不足10条的情况
              this.upFinished = true;
            }
            if (this.listQuery.pageNum == 1) {
              this.pageList = list;
            } else {
              this.pageList = this.pageList.concat(list);
            }
            this.listQuery.pageNum++;
          } else {
            this.upFinished = true;
          }
        })
        .catch(() => {
          this.isUpLoading = false;
          this.isDownLoading = false;
          this.upFinished = true;
        });
      // },
      //   this.isDownLoading ? 600 : 0
      // );
    },
    toHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less">
.blessing-page {
  background: #fff;
  min-height: 100vh;
  padding: 0 0px 50px;
  .van-pull-refresh {
    padding: 0 18px;
  }
  .bless-item {
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: #000;
      font-size: 14px;
      line-height: 20px;
    }
    .time {
      color: #999;
      font-size: 12px;
      line-height: 17px;
    }
    .money {
      font-size: 16px;
      font-weight: bold;
      color: #666;
      &.isAdd {
        color: #e60113;
      }
    }
  }
  .bottom-container {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 16px;
    border-top: 1px solid #f2f2f2;
    .Submit {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background-color: #e60113;
      border-radius: 19px;
      border: 0;
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
      height: 38px;
      padding: 9px 26px;
    }
    .fqz {
      font-size: 16px;
      color: #000;
      .val {
        color: #e60113;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
</style>