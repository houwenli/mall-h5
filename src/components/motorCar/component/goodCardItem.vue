<template>
    <div class="good-card-item">
        <div class="img-list-wrapper">
            <van-swipe class="my-swipe" indicator-color="white" @change="onChange" loop style="height:351px;" v-if='item.imgList'>
                <van-swipe-item v-for="(item, index) in item.imgList" :key="index">
                    <img :src="item" alt="" style="width:100%;height:351px" />
                </van-swipe-item>

                <template #indicator>
                    <div class="custom-indicator">
                        <span>{{ current + 1 }}/{{ item.imgList.length }}</span>
                    </div>
                </template>
            </van-swipe>
            <div v-else class="img-box">
                <img :src="item.url" alt="">
            </div>
        </div>
        <div class="good-detail-box">
            <div class="price-line">
                <price-box :spu="item"></price-box>
            </div>
            <div class="name">
                <span class="nane-wrapper">{{ item.spuName || item.skuName }}</span>
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
            </div>
            <div class="to-buy" @click="toBuy(item)">立即购买</div>
        </div>

    </div>
</template>

<script>
import PriceBox from './priceBox.vue'
export default {
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    },
    components: {
        PriceBox
    },
    data() {
        return {
            current: 0
        }
    },
    methods: {
        onChange(index) {
            this.current = index
        },
        toBuy(item) {
            this.$router.push({
                path: '/motorCar/detail',
                query: {
                    skuId: item.skuId
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.good-card-item {
  background: #fff;
  border-radius: 24px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  .img-list-wrapper {
    width: 100%;
    height: 351px;
    position: relative;
    .img-box {
      width: 100%;
      height: 100%;
      > img {
        border-radius: 24px;
        width: 100%;
        height: 100%;
      }
    }

    .custom-indicator {
      position: absolute;
      width: 33px;
      height: 20px;
      right: 12px;
      bottom: 12px;
      text-align: center;

      background: rgba(25, 25, 25, 0.8);
      border-radius: 12px;
      span {
        display: block;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        color: #fff;
        margin-top: 4px;
      }
    }
  }
  .good-detail-box {
    padding: 0 14px;
    margin-top: 10px;
    .price-line {
      display: flex;
      align-items: flex-end;
    }
    .name {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .nane-wrapper {
        flex: 1;
        margin-right: 12px;
        color: #111111;
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
      }
      > img {
        width: 16px;
        height: 16px;
      }
    }
    .intro {
      margin-top: 6px;
      padding-right: 30px;
      color: #999;
      font-size: 13px;
      line-height: 17px;
    }
    .to-buy {
      width: 100%;
      height: 40px;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 20px;
      font-size: 16px;
      line-height: 20px;
      color: #fff9e9;
      font-weight: bold;
      padding: 10px 0;
      text-align: center;
      margin-top: 12px;
    }
  }
}
</style>


