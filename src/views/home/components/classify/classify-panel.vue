<template>
  <div data-desc='二级分类' class="second-panel" @click.stop="onClosePanel">
    <div class="second-panel-bg"></div>
    <div class="tag-list" @click.stop="onStopEvent">
      <img class="all-tag" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-secon-catogory-quan-bu-fen-lei.png" alt="" />
      <div
        class="tag-item"
        :class="{ 'active-tag': active === index, 'one-line-last': isLineLastNode(index, item) }"
        v-for="(item, index) in list"
        :key="index"
        @click.stop="onSelect(item, index)"
      >
        <div class="inner" :class="{ 'active-bg': active === index }">
          <div>{{ clipTagText(item.name) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {clipTagText} from './data.js'
// 一级分类-全部
export default {
  name: 'classify-panel',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    /**
     * 当前高亮的索引
     */
    active: {
      type: Number
    }
  },
  data () {
    return {
    }
  },

  methods: {
    onSelect (item, index) {
      this.$emit('update-active', index)
    },

    isLineLastNode (index, text) {
      // 第一行特殊处理
      if (index === 3) return true

      if (index > 3) {
        // 从1开始计数
        let i = index + 1
        let lineSize = 5
        // 行号 - 先剔除掉索引（0-3） 这4个元素
        let lineNo = Math.ceil((i - 4) / lineSize) + 1

        /**
         * 全部 1   2    3    4
         * 5   6    7    8   9    行号：2  Math.ceil(9-4)/5 + 1 = 2
         * 10  11   12  13  14    行号：3
         * 15  16   17  18  19    行号：4
         *
         * lineNo = 2  (2-1) * 5 + 4 = 9
         * lineNo = 3  (3-1) * 5 + 4 = 14
         */
        let isLastNode = (lineNo - 1) * lineSize + (lineSize - 1) === i
        // console.log(isLastNode, 'index---', i,  '-----行号', lineNo, text)
        if (isLastNode) return true
      }

      return false
    },

    onClosePanel () {
      this.$emit('update-active', this.active)
      return false
    },

    onStopEvent () {
      return false
    },

    clipTagText
  }
}
</script>

<style lang="less" scoped>
.second-panel {
  position: absolute;
  left: 0;
  // 这里的距离就是一级分类的高度
  top: 32px;
  width: 100vw;
  // less低版本需要处理兼容问题
  // height: calc(~'100vh - 100px');
  z-index: 100;

  .second-panel-bg {
     background: rgba(0, 13, 29, 0.4);
     position: absolute;
     left: 0;
     // 上面有一个border-radius 需要向上偏移16px的高度
     top: 16px;
     width: 100%;
     height: calc(~'100vh - 116px');
     z-index: -1;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  // 关键，否则因为flex 换行后，2行之间的间距很大
  align-content: flex-start;

  padding-left: 12px;
  padding-right: 12px;
  padding-top: 16px;
  box-sizing: border-box;
  overflow-y: scroll;
  background: #ffffff;
  border-radius: 12px;
  //   min-height: 210px;
  max-height: 462px;
  overflow-y: auto;

  .all-tag {
    width: 67px;
    height: 26px;
    margin-right: 4px;
  }

  // 最外层
  .tag-item {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 67px;
    height: 26px;
    background: #f5f5f8;
    border-radius: 14px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #111111;
    margin-right: 4px;
    margin-bottom: 12px;
    text-align: center;
    padding: 1px;
    // overflow: hidden;

    .inner {
      width: 100%;
      height: 100%;
      // line-height: 24px;
      border-radius: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      // margin-top: -1px;
      >div{
        // margin-top: 0.5px;
        height: 26px;
        line-height: 24px;         
      }
    }
  }

  .active-tag {
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ff0a35;
    background: linear-gradient(270deg, #f03258, #fe8604);
    margin-top: -1px;
  }

  .active-bg {
    background: #fff1f3;
  }

  .one-line-last {
    margin-right: 0;
  }
}
</style>
