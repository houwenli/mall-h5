<template>
  <div class="columns-container" data-desc='双列图'>
    <div class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" >
      <img v-if="item.url" class="pic" :src="item.url" alt="" />
      <img class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png" />
    </div>
  </div>
</template>

<script>
import { toPage } from './data.js'

// 2列图
export default {
  name: 'style-2',
  props: {
    config: {
      type: Object,
      default: () => { },
    },
  },
  methods: {
    toPage
  }
}
</script>

<style lang="less" scoped>
.columns-container {
  display: flex;
  margin-bottom: 5px;

  .item {
    flex: 1;
    // 这里不可写固定像素，在安卓机上，会表现出2个元素的间距很大
    // width: 158px;
    height: 100px;
    border-radius: 12px;
    overflow: hidden;

    &:first-child {
      margin-right: 11px;
    }

    .pic {
      width: 100%;
      height: 100%;
      border: none;
    }

    img[src=''] {
      opacity: 0;
    }
  }
}
</style>
