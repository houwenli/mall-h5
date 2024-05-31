<template>
  <div @click="clickItem" :class="className">
    <img v-if="item.url" :src="item.url" alt="" class="img">
    <div v-else class="img-box">
      <img src="@/assets/img/goodsType/default-type.png" alt="">
    </div>
    <p>{{item.name}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    item: {
      type: Object,
      default: () => { }
    },
    className: {
      type: String,
      default: 'first-level-item'
    }
  },
  methods: {
    clickItem() {
      this.$emit('clickItem')
    }
  }
}
</script>

<style lang="less" scoped>
.first-level-item {
  padding: 8px 0;
  white-space: nowrap;
  font-size: 12px;
  color: #333;
  text-align: center;
  min-width: 60px;
  width: 60px;
  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }
  .img-box {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    margin: auto;
    background: #dbdbdb;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      width: 36px;
    }
  }
  > img {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    display: block;
    margin: auto;
  }
  > p {
    margin-top: 6px;
    width: 100%;
    padding: 0px 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    text-align: center;
  }
  &.active {
    > p {
      background: #e60113;
      border-radius: 8px;
      color: #fff;
    }
  }
}
.all-type-item {
  margin-right: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  margin-bottom: 18px;
  .img-box {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: #dbdbdb;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    > img {
      width: 36px;
    }
  }
  > img {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    margin: auto;
    display: block;
  }
  > p {
    width: 100%;
    padding: 1px 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 6px;
    text-align: center;
  }
  &.active {
    > p {
      background: #e60113;
      border-radius: 8px;
      color: #fff;
    }
  }
}
</style>