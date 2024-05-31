<template>
  <div style="height:100%;">

    <x-header :left-options="{backText: ''}">红包使用说明</x-header>

    <group class="noTopBoderCells">
      <cell title="红包描述" :inline-desc='desc'></cell>
      <cell title="使用范围" :inline-desc='stores'></cell>
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
        stores: this.$route.query.stores,
        desc: this.$route.query.desc,
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg')
    }
  }
</script>
