<template>
  <div class="wrap-content">
    <div v-if="list.length">
      <div v-for="item in list" :key="item.id">
        <van-card class="vant-card" :title="item.title" :thumb="item.thumb" @click="goDetails(item)">
          <template #tags>
            <p class="price"><span>￥</span>{{ item.price }}</p>
          </template>
        </van-card>
      </div>
      <!-- <div class="button">
        加入推广
      </div> -->
    </div>
    <div v-else class="noData">
      <img src="@/assets/img/authorizeManagement.png" style="width:10rem;height:10rem;display:block;margin: 0 auto;" alt="" />
      <p class="noData-p">暂无商品</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [
        ],
      }
    },
    methods: {
      // goDetails(val){
      //     this.$router.push({name:'SpuDetail',query:{id:16646155884047560,sourceType:1,isCommodityList:false}})
      // }
    }
  }
</script>

<style lang="less" scoped>
  .wrap-content {
    background: #ffffff;
    height: calc(~'100vh - 50px');
    overflow: auto;
    .van-card {
      margin: 12px 12px 0px 12px;
      padding: 0;
      background-color: #ffffff;
      .van-card__thumb {
        margin-right: 12px;
        height: 126px;
        width: 126px;
      }
      .van-card__content {
        padding: 10px 8px 0px 0px;
      }
      .van-card__title {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        height: auto;
        max-height: none;
        line-height: 20px;
      }
      .price {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #e60113;
        line-height: 15px;
        padding-top: 20px;
        span{
            font-size: 12px;
        }
      }
    }
    .button{
        position:absolute;
        bottom: 0px;
        width: calc(~'100vw - 32px');
        padding: 10px 0px;
        margin:5px 16px;
        font-size: 14px;
        text-align: center;
        color: #FFFFFF;
        background-color: #E60618;
        border-radius: 20px;
    }
    .noData {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100vh;
      background: #f5f5f5;
      img {
        width: 180px !important;
        height: 170px !important;
      }
      .noData-p {
        font-size: 15px;
        font-weight: 500;
        text-align: center;
        color: #999999;
      }
    }
  }
</style>
