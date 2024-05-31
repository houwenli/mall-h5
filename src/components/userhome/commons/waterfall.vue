<template>
  <!-- 瀑布流 -->
  <div class="guess-list">
    <div class="column-container left" ref="col-left">
      <cardItem v-for="(item, index) in leftData" ref="cardItem" :item="item" :key="index" :isEdit="isEdit" @clickSku="clickSku" @goSkuDetail="goSkuDetail"></cardItem>
    </div>
    <div class="column-container right" ref="col-right">
      <cardItem v-for="(item, index) in rightData" ref="cardItem" :item="item" :key="index" :isEdit="isEdit" @clickSku="clickSku" @goSkuDetail="goSkuDetail"></cardItem>
    </div>
  </div>
</template>

<script>
  import cardItem from './cardItem.vue'
  import { Empty } from 'vant'
  export default {
    props: {
      //商品数据
      data: {
        type: Array,
        default: () => [],
      },
      isEdit: {
        type: Boolean,
        default: () => false,
      },
    },
    components: {
      cardItem,
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
        deep: true,
        immediate: true,
      },
    },
    data() {
      return {
        leftData: [],
        rightData: [],
        checkedList: [],
      }
    },
    methods: {
      // 勾选操作
      clickSku(item) {
       this.$emit("clickSku", item);
      },
      //详情
      goSkuDetail(item) {
         this.$emit("goSkuDetail", item);
      },
    },
  }
</script>

<style scoped lang="less">
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
  .left {
    padding-right: 5.5px;
  }
  .right {
    padding-left: 5.5px;
  }
</style>
