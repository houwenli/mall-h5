<template>
  <div class="content" data-desc="常用联系人">
    <div class="left">
      <div
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="selectContacts(index, item)"
        :class="[activeIndex == index && textNum == list[activeIndex].mobile   ? 'active' : '', item.nickName ? 'item1' : '']"
      >
        {{ item.nickName ? simplifyName(item.nickName) : '*' + item.mobile.substr(item.mobile.length - 4, 4) }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      textNum: {
        type: String,
        default: () => ''
      }
    },
    components: {},
    data() {
      return {
        activeIndex: 0,
      }
    },
    created() {},

    methods: {
      selectContacts(index, val) {
        this.activeIndex = index
        this.$emit('selectContacts', val)
      },
      simplifyName(name) {
        return name.length > 2 ? name.substr(0, 2) + '...' : name
      },
    },
  }
</script>

<style lang="less" scoped>
  .content {
    width: auto;
    height: 28px;
    position: relative;
    margin: 12px 10px 0;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    color: #000;

    .left {
      position: relative;
      display: flex;
      width: 100%;
      overflow-x: scroll;
      // 去掉chrome的滑动条
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }
      .item {
        position: relative;
        text-align: center;
        padding: 0 8px;
        width: 56px;
        margin-right: 8px;
        text-align: center;
        line-height: 26px;
        background: rgba(123, 123, 123, 0.07);
        color: #010b2a;
        border-radius: 13px;
        font-size: 14px;

        //  关键不要伸缩
        flex-shrink: 0;
        cursor: pointer;
      }
      .item1 {
        // 超出为...
        text-overflow: ellipsis; /*让截断的文字显示为点点。还有一个值是clip意截断不显示点点*/
        white-space: nowrap; /*让文字不换行*/
        overflow: hidden; /*超出要隐藏*/
      }
      .active {
        background: #ff0a35;
        color: #ffffff;
      }
    }
  }
</style>
