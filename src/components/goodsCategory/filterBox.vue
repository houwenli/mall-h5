<template>
  <ul class="result-sort-type">
    <li v-for="(item, index) in filterBoxList" :key="index" class="wbox-flex" :class="{ cur: filterItemIndex === index }" @click="filterChoose(item, index)">
      <div v-if="item.hasSort">
        <dropdown-menu>
          <dropdown-item @change="changePriceSort" :title="item.filterBoxName" v-model="priceSortValue" :options="priceSortOption" />
        </dropdown-menu>
      </div>
      <span v-else>
        {{item.filterBoxName}}
      </span>
      <div class="sort-type" v-if="item.hasSort">
        <img v-show="sortWrapIndex === 0 && filterItemIndex === index" src="../../assets/img/sort_up_select@2x.png" alt="" />
        <img v-show="sortWrapIndex === 0 && filterItemIndex === index" class="mt2" src="../../assets/img/sort_down@2x.png" alt="" />
        <img v-show="sortWrapIndex === 1 && filterItemIndex === index" src="../../assets/img/sort_up@2x.png" alt="" />
        <img v-show="sortWrapIndex === 1 && filterItemIndex === index" class="mt2" src="../../assets/img/sort_down_select@2x.png" alt="" />
        <img v-show="sortWrapIndex == -1 || filterItemIndex !== index" src="../../assets/img/sort_up@2x.png" alt="" />
        <img v-show="sortWrapIndex == -1 || filterItemIndex !== index" class="mt2" src="../../assets/img/sort_down@2x.png" alt="" />
      </div>
    </li>
  </ul>
</template>

<script>
import { DropdownMenu, DropdownItem } from 'vant'

export default {
  components: {
    DropdownMenu,
    DropdownItem
  },
  data() {
    return {
      filterItemIndex: 0, // 过滤的item
      sortWrapIndex: -1, // 综合过滤 -1  价格从低到高 0 价格从高到低1
      priceSortValue: -1,
      priceSortOption: [
        { text: '综合排序', value: -1 },
        { text: '价格从低到高', value: 0 },
        { text: '价格从高到低', value: 1 },
      ],
    }
  },
  props: {
    filterBoxList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    filterChoose(item, index) {
      if (this.loading) return
      if (this.filterItemIndex === index) return
      this.sortWrapIndex = !index ? -1 : 1
      if(!index) this.priceSortValue = this.sortWrapIndex
      this.filterItemIndex = index
      if (!item.hasSort) {
        this.filterItemIndex = index
        this.$emit('setSearchParmas', {
          filterItemIndex: this.filterItemIndex,
          sortWrapIndex: this.sortWrapIndex
        })
      }
    },
    changePriceSort(val) {
      this.sortWrapIndex = val
      this.$emit('setSearchParmas', {
        filterItemIndex: this.filterItemIndex,
        sortWrapIndex: this.sortWrapIndex
      })
    }
  }
}
</script>

<style lang="less" scoped>
.result-sort-type {
  position: unset;
  display: flex;
  li {
    border-bottom: 0;
    color: #000000;
    font-size: 12px;
    &.cur {
      color: #e60113;
      /deep/ .van-ellipsis {
        color: #e60113;
      }
    }
    &.wbox-flex {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sort-type {
      height: 42px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > img {
        width: 8px;
        &.mt2 {
          margin-top: 2px;
        }
      }
    }
  }
}
</style>