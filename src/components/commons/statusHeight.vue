<!-- <template>
  <div :data-desc="dataDesc" v-show="appData.statusHeight" :style="getStyle" ref='statusRef' style="flex-shrink: 0"></div>
</template>
<script>
  export default {
    name: 'statusHeight',
    data() {
      return {
        appData: {},
      }
    },
    computed: {
      dataDesc() {
        return {
          desc: '手机电池高度',
          value: this.appData.statusHeight,
        }
      },

      getStyle() {
        return {
          height: (this.appData.statusHeight || 0) + 'px'
        }
      },
    },
    mounted() {
      this.appData = JSON.parse(localStorage.getItem('appData')) || ''
      let dom = this.$refs['statusRef']
      // 如果外部什么都没有传，则使用白色兜底
      if (!dom.style.backgroundColor && !dom.style.backgroundImage) {
        this.$refs['statusRef'].style.backgroundColor = '#fff'
      }
    },
  }
</script> -->

<template>
  
</template>
