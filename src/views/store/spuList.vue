<template>
  <div>
    <van-list
      v-model="config.loading"
      :finished="config.finished"
      :error.sync="config.error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <ul class="ul_2">
        <li v-for="item in list" :key="item.id" class="spu_cell" @click="toDetails(item)">
          <div class="spu_cell_image">
            <img :src="item.url" alt="" />
          </div>
          <div class="spu_cell_detail">
            <div>
              <div class="spu_cell_title">
                {{ item.spuName }}
              </div>
              <span v-if="item.performanceScore && item.performanceScore > 0" class="performate-point">绩效分{{ item.performanceScore }}</span>
            </div>
            <div class="spu_cell_jg">
              <div>
                <span class="spu_cell_icon">￥</span>
                <span class="spu_cell_price">{{ item.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>
<script>
  export default {
    props: {
      config: {
        type: Object,
        default() {
          return {
            loading: false,
            finished: false,
            error: false,
          }
        },
      },
      list: {
        type: Array,
        default: () => [],
      },
      listLeft: {
        type: Array,
        default: () => [],
      },
      listRight: {
        type: Array,
        default: () => [],
      },
      // 列表排列方式 false一排一个， true一排两个
      styleCol: {
        type: Boolean,
        default: false,
      },
      isPriceBg: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onLoad() {
        this.$emit('onLoad')
      },
      toDetails(item) {
        this.$emit('toDetails', item)
      },
    },
  }
</script>
<style lang="less" scoped>
  .spu_cell {
    display: flex;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    .spu_cell_detail {
      display: flex;
      flex-direction: column;
      padding: 8px 12px 4px 12px;
      background-color: #fff;
      flex: 1;
      .spu_cell_title {
        position: relative;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        display: -webkit-box;
        /*设置子元素排列方式*/
        -webkit-box-orient: vertical;
        /*设置显示的行数，多出的部分会显示为...*/
        -webkit-line-clamp: 2;
        line-height: 20px;
        font-size: 14px;
        color: #000;
        word-break: break-all;
        // text-indent: 30px;
      }
      .spu_cell_tag {
        font-weight: 600;
        font-size: 10px;
        line-height: 14px;
        border-radius: 2px;
        color: #fff;
        padding: 1px 2px;
        background-color: #e60113;
      }
      .spu_cell_jg {
        margin-top: 4px;
        .spu_cell_icon,
        .spu_cell_price {
          color: #e60113;
        }
        .spu_cell_icon {
          font-size: 12px;
          line-height: 17px;
        }
        .spu_cell_price {
          font-size: 18px;
          line-height: 25px;
          font-weight: 600;
        }
        .pu_cell_discount {
          margin-left: 4px;
          font-size: 10px;
          line-height: 14px;
          color: #666;
          text-decoration: line-through;
        }
        .spu_cell_tips {
          height: 25px;
          vertical-align: bottom;
          margin-left: 6px;
          display: inline-flex;
          align-items: center;
          span {
            border-radius: 2px;
            border: 1px solid #999;
            font-size: 10px;
            color: #999;
            line-height: 14px;
            padding: 1px 2px;
          }
        }
      }
      .performate-point {
        display: inline-block;
        color: #e60113;
        font-size: 10px;
        padding: 1px 4px;
        border-radius: 2px;
        border: 1px solid #e60113;
        margin-top: 5px;
        width: fit-content;
        line-height: 14px;
        box-sizing: border-box;
      }
    }
  }
  .ul_2 {
    .spu_cell {
      border-radius: 10px;
      margin-bottom: 12px;
      padding-left: 12px;
    }
    .spu_cell_detail {
      justify-content: space-between;
      padding: 0 12px 0 14px;
    }
    .spu_cell_image {
      width: 120px;
      height: 120px;
      flex-shrink: 0;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }
  }
</style>
