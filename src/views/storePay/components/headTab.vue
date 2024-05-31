<template>
  <!-- 商品筛选模块 -->
  <div class="wholesale-tabs">
    <div v-for="(item, index) in tabList" ref="tabItem" :key="index" class="tab" @click="changeTab(item)">
      <template v-if="!item.hasSort">
        <span :class="{ active: tabSort == item.sort }">{{ item.name }}</span>
      </template>
      <template v-else>
        <div class="tab-price">
          <span :class="{ active: tabSort == item.sort.up || tabSort == item.sort.down }">{{ item.name }}</span>
          <div class="tab-price-sort">
            <span class="up" :class="{ 'up-active': tabSort == item.sort.up }"></span>
            <span class="down" :class="{ 'down-active': tabSort == item.sort.down }"></span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      tabList: {
        type: Array,
        default: () => [
          {
            sort: 1,
            name: '综合',
            hasSort: false,
          },
          {
            sort: {
              up: 2,
              down: 3,
            },
            name: '价格',
            hasSort: true,
          },
          {
            sort: 4,
            name: '仅看有货',
            hasSort: false,
          },
          {
            sort: 5,
            name: '自己供货',
            hasSort: false,
          },
          {
            sort: 6,
            name: '他人供货',
            hasSort: false,
          },
        ],
      },
      defaultIndex: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        tabFlag: 1,
        tabSort: this.defaultIndex,
      }
    },
    methods: {
      //切换tab
      changeTab(item) {
        if (item.hasSort) {
          if (this.tabSort === item.sort.up) {
            this.tabSort = item.sort.down
          } else {
            this.tabSort = item.sort.up
          }
        } else {
          this.tabSort = item.sort
        }
        this.$emit('resetSearchParams', this.tabSort)
      },
    },
  }
</script>

<style lang="less" scoped>
  .wholesale-tabs {
    padding: 10px 20px;
    width: 100%;
    height: 50px;
    overflow-y: auto;
    background-color: #fff;
    display: flex;
    align-items: center;

    .tab {
      flex: 1;
      white-space: nowrap;
      margin-right: 40px;
      color: #000;
      font-size: 14px;
      position: relative;
      text-align: center;
      &:last-child {
        margin-right: 0;
      }
      .active {
        position: relative;
        font-weight: 600;
        &::after {
          position: absolute;
          bottom: -7px;
          left: 0;
          right: 0;
          margin: 0 auto;
          content: '';
          display: block;
          width: 28px;
          height: 3px;
          background: #e60113;
          border-radius: 2px;
        }
      }
      .slider {
        width: 30px;
        height: 3px;
        background: #ea0213;
        border-radius: 4px;
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
    .tab-price {
      .tab-price-sort {
        display: inline-block;
        position: relative;
        width: 5px;
        .up {
          position: absolute;
          left: 3px;
          top: -11px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 5px solid #999;
        }
        .down {
          position: absolute;
          left: 3px;
          top: -4px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #999;
        }
        .up-active {
          border-bottom: 5px solid #e60113;
        }
        .down-active {
          border-top: 5px solid #e60113;
        }
      }
    }
  }
</style>
