<template>
  <div style="height:100%;">

    <x-header :left-options="{backText: ''}">券使用说明</x-header>

    <group  class="noTopBoderCells">
      <cell title="优惠券类型" :inline-desc=type></cell>
      <cell title="优惠券描述" :inline-desc=desc></cell>
    </group>

  </div>
</template>

<script>
  import {XHeader, Group, Cell} from 'vux'

  export default {
    components: {
      XHeader, Group, Cell
    },
    data() {
      return {
        type: this.$route.query.type,
        desc: this.$route.query.desc,

      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg')
    }
  }
</script>
