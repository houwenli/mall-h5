<template>
  <div>
    <div v-if="!isEmpty">
      <!-- 瀑布流 -->
      <div class="guess-list">    
        <div class="column-container left" ref="col-left">
          <goodList v-for="(item, index) in leftData" ref="goodList" :item="item" :key="index" :detailShow="detailShow" @shareComm="(val) => $emit('shareComm', val)"></goodList>
        </div>
        <div class="column-container right" ref="col-right">
          <goodList v-for="(item, index) in rightData" ref="goodList" :item="item" :key="index" :detailShow="detailShow" @shareComm="(val) => $emit('shareComm', val)"></goodList>
        </div>
      </div>
      <!-- 底部标识 -->
      <div v-if="isbot">
        <div class="guess-load-more-tips" v-if="noMore" ref="backTop" :style="botTip=='见底啦~不如去'?'font-size: 13px;':''">
          {{ botTip }}
          <div class="go-home" @click="goIndex" v-if="botTip=='见底啦~不如去'"> 
              首页逛逛
          </div>
        </div>
        <div class="guess-load-more-tips" v-else ref="backTop">正在加载中...</div>
      </div>
    </div>
    <van-empty
      v-else
      image="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/img_blank_page.png"
      image-size="160px"
      description="没有找到相关宝贝"
      class="no-valid"
    ></van-empty>
  </div>
</template>

<script>
  import goodList from './goodList.vue'
  import { Empty } from 'vant'
  export default {
    props: {
      storeId: {
        default: '',
      },
      // 列表是否为空
      isEmpty: {
        type: Boolean,
        default: false,
      },
      // 列表是否加载完成
      noMore: {
        type: Boolean,
        default: false,
      },
      //商品数据
      data: {
        type: Array,
        default: () => [],
      },
      detailShow: {
        type: Boolean,
      },
      // 底部提示
      botTip: {
        type: String,
        default: '我也是有底线的~',
      },
      // 是否需要底部标识
      isbot: {
        type: Boolean,
        default: true,
      },

      // 分销商品详情
      isDistribution: {
        type: Boolean,
        default: false
      }
    },
    components: {
      goodList,
      [Empty.name]: Empty,
    },
    watch: {
      // 数据处理
      data: {
        handler() {
          let data = this.data
          let i = 0
          this.leftData = []
          this.rightData = []
          while (i < data.length) {
            this.leftData.push(data[i++])
            if (i < data.length) {
              this.rightData.push(data[i++])
            }
          }
        },
        immediate: true,
      },
    },
    data() {
      return {
        leftData: [],
        rightData: [],
      }
    },
    methods: {
      goIndex() {
        if(this.isDistribution) {
          this.$router.push({
            path: '/distributionActivity'
          })
        } 
        else {
          this.$router.push({ path: '/' })
        }
      }
    },
  }
</script>

<style scoped lang="less">
  .go-home {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 98px;
    height: 25px;
    line-height: 26px;
    background: #ffe7eb;
    border-radius: 15px;
    // border: 0.5px solid #ff0a35;
    margin: 0 auto;
    margin-top: 4px;
    text-align: center;
    font-size: 13px;
    color: #ff0a35;
    position: relative;
    // box-shadow: 0 0 0 0.5px red; 
  }

  .go-home:before{
    content: "";
    position: absolute;
    top: -50%;
    bottom: -50%;
    left: -50%;
    right: -50%;
    transform: scale(0.5);
    border: solid 1px #ff0a35;
    border-radius: 30px;
    box-sizing:border-box;
  }
  .guess-list {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    // margin-top: 8px;
    .column-container {
      width: 50%;
      // flex: 1;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    &.store-index {
      margin-top: 0;
    }
    &.store-index::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      height: 64px;
      width: 100%;
      background-image: linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }
  }

  .guess-load-more-tips {
    position: relative;
    z-index: 2;
    font-size: 11px;
    text-align: center;
    color: #999999;
    padding: 6px 0 54px 0;

    // 没有数据的场景
    .no-data-pic {
      display: inline-block;
      width: 95px;
      height: 99px;
    }
    .no-result-text {
      color: #666;
      font-size: 16px;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    .no-goods-text {
      font-size: 14px;
      color: #999;
    }
  }
</style>
