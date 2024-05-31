<template>
  <div style="height:100%;">
    <div class="shopfixedtop">
      <div class="fll">
        <div>{{ storeInfo.storeName }}</div>
        <div style="font-size: 12px">
          <div class="commstar view_commstar">
            <a title="非常不满意" :class="getStarClass(1)"></a>
            <a title="不满意" :class="getStarClass(2)"></a>
            <a title="一般" :class="getStarClass(3)"></a>
            <a title="满意" :class="getStarClass(4)"></a>
            <a title="非常满意" :class="getStarClass(5)"></a>
          </div>
          关注数{{ storeInfo.followNum }}
        </div>
      </div>
      <div class="flr">
        <div class="shop-search-box" @click="toSearch">
          <span class="search-form-icon"></span>
          <span class="search-box-text">搜索</span>
        </div>
        <div class="shop-search-box" style="padding: 0 10px" @click="shopTopNavVisible = !shopTopNavVisible">
          <img
            style="height: 24px"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAABGdBTUEAALGPC/xhBQAAAKtQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANDW0RAAAADh0Uk5Ty9nY6szBIEho4KFuAQ6nB1AqEJEUCBop1c4+YGQFU4r3G3Xbk+xx5xlJEfKGGNHz67BCuKtS8AByeVHrAAAA/0lEQVRIx+2U1xKCMBBFsVcUewEVsXekxPv/X6amoIw+mRmfNi/cObuHYZIsxk1jGSSTTDLJJP8sb5cLNxda6dLEyx8OhjdJUyvMuYvl9iXHK/BVNd+6BiMBR4M3aFYFXMVKjoEoaLdqDIV60tZnGE7n8+kQrJ/AegGs1moHERALeb/BmpeKFZSTviuuveez9wgJLKNS5GGNzZ7LR4SyVgJryjiG3xWp62MsYZOhJGOII5fP2Kk3ZxDINENHwQ5mMgXIKrjDmcsXnBRqwJEpgq2gjUgmBw0FT7joy1qfrbVhWkeldUn0rqcYDP/rYOQ/B8NPDwb9hkgmmWSS/ynfAW6W75Mo5ZuCAAAAAElFTkSuQmCC"
          />
          <div v-if="shopTopNavVisible" class="mui-global-nav">
            <div class="mui-global-nav-arr"></div>
            <ul>
              <li class="mui-global-nav-tab-home" @click="toIndex">首页</li>
              <li class="mui-global-nav-tab-shop" @click="toStoreIndex">店铺首页</li>
              <li class="mui-global-nav-tab-class" @click="toStoreCategory">店铺分类</li>
              <li class="mui-global-nav-tab-goods" @click="toSpuList">全部商品</li>
              <a class="mui-global-nav-tab-service" href="tel:0755-23061865">联系客服</a>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 61px">
      <group v-for="(storeCategory, index) in storeCategoryList" :key="index" class="noTopBoderCells categoryCells">
        <cell :title="storeCategory.name" is-link @click.native="toStoreSpuList(storeCategory.id)"></cell>
        <cell v-if="storeCategory.childCateGory.length !== 0" class="sortMenuCell">
          <flexbox slot="inline-desc" :gutter="0" wrap="wrap" style="padding: 0 10px">
            <flexbox-item
              v-for="(element, i) in storeCategory.childCateGory"
              :key="i"
              :span="1 / 2"
              style="padding: 5px"
              @click.native="toStoreSpuList(element.id)"
            >
              <div class="sort-menu-li">{{ element.name }}</div>
            </flexbox-item>
          </flexbox>
        </cell>
      </group>
    </div>

    <divider v-if="storeCategoryList.length === 0" class="dividerCenter">暂无数据</divider>
  </div>
</template>

<script>
  import { Divider, Group, Cell, Flexbox, FlexboxItem } from 'vux'

  import { queryStoreInfo, querySortedAllStoreCategory } from '@/api/storecategory'

  export default {
    components: {
      Divider,
      Group,
      Cell,
      Flexbox,
      FlexboxItem,
    },
    data() {
      return {
        shopTopNavVisible: false, // 是否展示顶部菜单栏
        storeInfo: {}, // 店铺信息
        storeCategoryList: [], // 店铺分类列表
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryStoreInfo(this.$route.query.storeId)
      this.querySortedAllStoreCategory(this.$route.query.storeId)
    },
    methods: {
      // 查询店铺信息
      queryStoreInfo(storeId) {
        let that = this
        queryStoreInfo(storeId).then((res) => {
          if (res.flag && res.data) {
            that.storeInfo = res.data
          }
        })
      },
      // 查询店铺全部分类
      querySortedAllStoreCategory(storeId) {
        let that = this
        querySortedAllStoreCategory(storeId).then((res) => {
          if (res && res.length > 0) {
            that.storeCategoryList = res
          }
        })
      },
      // 获取评价样式
      getStarClass(num) {
        return 'commstar_star star' + num + ' ' + (this.storeInfo.aveScore == num ? 'active' : '')
      },
      // 跳转到搜索页面
      toSearch() {
        this.$router.push({ path: '/search' })
      },
      // 跳转到首页
      toIndex() {
        this.$router.push({ path: '/' })
      },
      // 跳转到店铺首页
      toStoreIndex() {
        this.$router.push({ path: '/storeindex', query: { storeId: this.$route.query.storeId } })
      },
      // 跳转到店铺分类页面
      toStoreCategory() {
        this.$router.replace({ path: '/storecategory', query: { storeId: this.storeId } })
      },
      // 跳转到全部商品页面
      toSpuList() {
        this.$router.push({ path: '/spulist', query: { storeId: this.$route.query.storeId } })
      },
      // 联系客服
      toService() {
        if (!this.storeInfo.serviceQQ) {
          this.$vux.toast.text('暂无客服', 'bottom')
        } else {
          if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            let newLink = window.open()
            newLink.location.href = 'mqqwpa://im/chat?chat_type=wpa&uin=' + this.storeInfo.serviceQQ + '&version=1&src_type=web&web_src=bjhuli.com'
          } else {
            let newLink = window.open()
            newLink.location.href = 'http://wpa.qq.com/msgrd?v=3&uin=' + this.storeInfo.serviceQQ + '&site=qq&menu=yes"'
          }
        }
      },
      // 跳转到店铺分类页面
      toStoreSpuList(cateId) {
        this.$router.push({
          path: '/spulist',
          query: { queryString: '', storeCateId: cateId, storeId: this.$route.query.storeId },
        })
      },
    },
  }
</script>
