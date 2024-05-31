<template>
  <div style="height:100%">

    <x-header :left-options="{backText: ''}">{{thematicName}}</x-header>

    <mobiletemplate :floors="floors" :storeId="storeId"/>

  </div>
</template>

<script>
  import {XHeader, Swiper} from 'vux'

  import {mobileThematic} from '@/api/thematic';

  import mobiletemplate from '@/components/index/mobiletemplate'

  export default {
    components: {XHeader, Swiper, mobiletemplate},
    data() {
      return {
        thematicName: '', // 专题页面名称
        floors: [], // 专题楼层集合
        storeId: '', // 店铺id
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg');
      this.queryMobileThematic(this.$route.query.id);
    },
    methods: {
      // 查询专题配置
      queryMobileThematic(id) {
        let that = this;
        mobileThematic(id).then(res => {
          that.thematicName = res.name;
          that.floors = res.floors;
          that.storeId = res.storeId;
        })
      },
    }
  }
</script>
