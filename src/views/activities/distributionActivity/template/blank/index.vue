<template>
    <!-- 辅助空白 -->
  <div class="blank" :style="{'height': `${listData.blankHeight}px`}"></div>
</template>
<script>
export default {
  props: {
    listData: {
        type: Object,
        default:() => {
          return {blankHeight: 10}
        },
        required: true
    }
  },
}
</script>
<style scoped>
.blank {
    width: 100%;
}
</style>
