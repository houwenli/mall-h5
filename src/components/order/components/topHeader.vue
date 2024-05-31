<template>
    <div class="top-header">
        <div class="search-left" @click="toBack">
            <i class="backimg"></i>
        </div>

        <span class="title-wrapper">{{ title }}</span>
    </div>
</template>

<script>
export default {
    props:{
        title: {
            default: '标题',
            type: String
        }
    },
    data() {
        return {}
    },
    methods: {
        toBack() {
            this.$emit('clickBack')
        }
    }
}
</script>

<style lang="less" scoped>
.top-header {
    width: 100%;
    padding: 6px 12px;
    height: 44px;
    background: #fff;
    position: relative;
    text-align: center;
    line-height: 32px;
    .search-left {
      margin-right: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid rgba(151, 151, 151, 0.2);
      background: rgba(255, 255, 255, 0.9);
      position: absolute;
      left: 12px;
      top: 6px;
        
      .backimg {
        display: block;
        background: url('~@/assets/img/goodsDetail/left_arrow.png') no-repeat center center;
        background-size: 100%;
        width: 16px;
        height: 16px;
      }
    }
    .title-wrapper {
        color: #191919;
        font-size: 16px;
    }
  }
</style>


