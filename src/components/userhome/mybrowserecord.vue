<template>
  <div class="goods-sku-collection" ref="backTop" :class="[returntop ? 'backtopactive' : '']">
    <van-nav-bar title="浏览记录" left-arrow fixed @click-left="backCustomerCenter"></van-nav-bar>
    <div class="background-line gray-bg"></div>

    <!-- 头部描述以及操作按钮 -->
    <div class="header flexLay" v-if="pageList && pageList.length > 0">
      <div class="msg">为您展示最多100个浏览记录商品哟</div>
      <div class="btns flexLay">
        <span class="cls flexLay" @click="close(1)" v-show="isEdit">
          <img :src="`${$oss}/browse-records/close.png`" />
          清空
        </span>
        <span :class="['edit', 'flexLay', isEdit ? '' : 'ok']" @click="edit()">{{ isEdit ? '编辑' : '完成' }}</span>
      </div>
    </div>

    <!-- 商品列表 -->
    <van-list
      v-if="pageList && pageList.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="我也是有底线的~"
      :immediate-check="false"
      :offset="100"
      @load="onLoad"
    >
      <div v-for="(item, index) in pageList" :key="index">
        <div class="waterfall_data">{{ item.dateStr }}</div>
        <waterfall :data="item.browseRecordList" :selectList="selectList" :isEdit="isEdit" @goSkuDetail="goSkuDetail" @clickSku="clickSku"></waterfall>
      </div>
    </van-list>

    <!-- 缺省页 -->
    <div v-if="finished && pageList.length == 0" class="wrap">
      <img style="width: 160px; height: 160px" :src="`${$oss}/browse-records/empty.png`" alt="" />
      <div class="news-text">你还没有浏览记录哦~</div>
    </div>

    <!-- 全选 -->
    <div class="allChecked flexLay" v-if="!isEdit">
      <span class="allBtn" @click.stop="pageList.length > 0 ? clickAll() : ''">
        <i :class="isALL ? 'icon_select_ok' : 'icon_select_out'"></i>
        <span>全选</span>
      </span>
      <span class="cls  flexLay" :class="{ isCls: selectListLength }" @click.stop="selectListLength ? close(2) : ''">删除</span>
    </div>

    <!-- 回到顶部  -->
    <returnTop v-if="isshowtop" @click.native="backtop()" />

    <!-- 二次确认 -->
    <SecondConfirm
      :title="titieTextMap[isType]"
      :cancleText="'取消'"
      :sureText="'确定'"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
      class="SecondConfirmbox"
    ></SecondConfirm>
  </div>
</template>

<script>
  import { SwipeCell, List, Dialog, Toast, Divider } from 'vant'
  import { queryBrowseRecords, deleteBrowseRecords, deleteBrowse } from '@/api/mybrowserecord'
  import productList from '@/components/commons/productList.vue'
  import waterfall from './commons/waterfall.vue'
  import returnTop from './commons/returnTop.vue'
  import SecondConfirm from '@/components/commons/SecondConfirm'

  export default {
    components: {
      [SwipeCell.name]: SwipeCell,
      [List.name]: List,
      [Dialog.name]: Dialog,
      [Toast.name]: Toast,
      [Divider.name]: Divider,
      productList,
      waterfall,
      returnTop,
      SecondConfirm,
    },
    provide() {
      return {
        selectList: this.selectList,
      }
    },
    data() {
      return {
        selectList: [], //勾选的数据
        pageList: [], //页面数据源
        loading: true, //正在加载
        finished: false,
        isEdit: true, //是否是编辑
        isshowtop: false, // 回到顶部
        returntop: false, // 返回顶部
        dialogshow: false, //弹窗显示隐藏
        isType: 1,
        titieTextMap: {
          1: '确定清空浏览记录？',
          2: '确定删除所选浏览记录？',
        },
      }
    },
    computed: {
      selectListLength() {
        return this.selectList.length > 0
      },
      list() {
        return this.pageList.reduce((list, item) => {
          return list.concat(
            item.browseRecordList.map((val) => {
              return val.id
            })
          )
        }, [])
      },
      isALL() {
        return this.selectList.length == this.list.length
      },
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg')
      this.getData()
    },
    filters: {
      price(value) {
        if (!value) {
          return ''
        }
        let price = parseFloat(value).toFixed(2)
        return price
      },
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
    },
    watch: {
      isshowtop(value) {
        if (!value) this.returntop = false
      },
      pageList: {
        handler(newVal, oldVal) {
          this.pageList.map((item, index) => {
            item.browseRecordList.map((val, idx) => {
              this.pageList[index].browseRecordList[idx].status = val.sku.status
            })
          })
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      // 勾选
      clickSku(item) {
        let index = this.selectList.findIndex((val) => {
          return item.id === val
        })
        if (index >= 0) {
          this.selectList.splice(index, 1)
        } else {
          this.selectList.push(item.id)
        }
      },
      // 全选
      clickAll() {
        // 全选
        if (!this.isALL) {
          this.list.forEach((id) => {
            !this.selectList.includes(id) && this.selectList.push(id)
          })
        } else {
          this.selectList.splice(0, this.selectList.length)
        }
      },
      //编辑
      edit() {
        this.isEdit = !this.isEdit
        this.selectList.splice(0, this.selectList.length)
      },
      //删除
      close(type) {
        this.isType = type
        this.dialogshow = true
      },
      //确认删除
      rightEvent() {
        let type = this.isType
        switch (type) {
          case 1: //清空
            deleteBrowseRecords().then((res) => {
              if (res.code == 200) {
                this.closeBack()
                this.selectList.splice(0, this.selectList.length)
                this.pageList = []
                this.getData()
              }
            })
            break
          case 2: //单个多个删除
            let params = {
              ids: this.selectList,
            }
            deleteBrowse(params).then((res) => {
              if (res.code == 200) {
                this.closeBack()
                this.pageList = []
                this.getData()
              }
            })
            break
          default:
            break
        }
      },
      //取消删除
      closeBack() {
        this.dialogshow = false
      },
      //获取数据
      getData() {
        try {
          this.finished = false
          queryBrowseRecords().then((response) => {
            this.selectList.splice(0, this.selectList.length)
            this.clickList = []
            let list = response.data
            this.pageList = list
            this.loading = false
            this.finished = true
            this.isEdit = true
          })
        } catch (error) {
          console.log(error)
        }
      },
      //跳转商品详情页
      goSkuDetail(data) {
        if (data.sku.status == '4') {
          return false
        } else {
          this.$router.push({ path: '/spudetail', query: { id: data.skuId, storeId: data.storeId, sourceType: data.sourceType || 1 } })
        }
      },
      // 返回
      backCustomerCenter() {
        this.$router.go(-1)
      },
      // 回到顶部
      backtop() {
        if (this.isshowtop) this.returntop = true
        else this.returntop = false
      },
      // 监听滚动
      handleScroll() {
        if (!this.$refs.backTop) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop) // 取绝对值
        if (scorllTop >= 2500) this.isshowtop = true
        else this.isshowtop = false
      },
      onLoad() {
        this.getData()
      },
    },
  }
</script>
<style lang="less" scoped>
  body {
    overflow: visible;
  }
  .flexLay {
    display: flex;
    align-items: center;
  }
  .header {
    justify-content: space-between;
    margin: 10px 12px 0;
    height: 22px;
    font-size: 11px;
    color: #999999;
    .btns {
      .cls {
        justify-content: center;
        margin-right: 8px;
        width: 52px;
        height: 22px;
        line-height: 22px;
        background: #ffffff;
        border-radius: 14px;
        img {
          width: 16px;
          height: 16px;
          margin-right: 2px;
        }
      }
      .edit {
        justify-content: center;
        color: #444444;
        width: 38px;
        height: 22px;
        background: #ffffff;
        border-radius: 14px;
      }
      .ok {
        color: #ff0a35;
      }
    }
  }
  .van-list {
    padding: 0px 12px 70px;
    min-height: 100vh;
    background-color: #f6f6f6;
    /deep/.van-list__finished-text {
      color: #c3c3c3 !important;
      line-height: 14px;
      padding: 10px 0 40px;
      font-size: 11px;
    }
    .waterfall_data {
      margin-top: 10px;
      font-size: 16px;
      color: #111111;
      font-weight: 600;
      line-height: 20px;
    }
  }
  .goods-sku-collection {
    height: 100%;
    background-color: #f6f6f6;
    .wrap {
      position: fixed;
      left: 50vw;
      top: 50vh;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    .news-text {
      font-size: 13px;
      line-height: 17px;
      color: #444444;
      margin-top: 8px;
    }
    /deep/ .van-nav-bar__left .van-icon {
      color: #6d6d6d;
    }
  }

  .goods-sku-collection {
    height: 100%;
    .van-nav-bar__left .van-icon {
      color: #6d6d6d;
    }
    /deep/ .van-nav-bar__right {
      font-size: 11px;
      color: #999999;
      img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
      }
    }
    .background-line {
      height: 46px;
    }
    .sku-list {
      .sku-list-item {
        margin-bottom: 10px;
        border-radius: 8px;
        .van-swipe-cell__wrapper {
          .shop-card {
            margin: 0;
          }
          .van-button {
            margin-left: 8px;
            width: 70px;
            height: 100%;
            border-radius: 12px;
          }
        }
      }
    }
  }
  .backtopactive {
    position: fixed;
    top: 0;
  }
  .allChecked {
    position: fixed;
    justify-content: space-between;
    bottom: -1px;
    width: 100%;
    height: 60px;
    background: #ffffff;
    padding: 10px 12px;
    font-size: 16px;
    box-shadow: 0px -2px 10px 0px rgba(189, 194, 204, 0.2);
    .allBtn {
      position: relative;
      line-height: 16px;
      font-size: 13px;
      span {
        padding-left: 24px;
        line-height: 17px;
      }
    }
    .icon_select_ok::after,
    .icon_select_out::after {
      position: absolute;
      top: 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
    }
    //勾选
    .icon_select_ok::after {
      background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png');
      background-size: 16px;
      background-repeat: no-repeat;
    }
    // 未勾选
    .icon_select_out::after {
      background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/browse-records/no.png');
      background-size: 16px;
      background-repeat: no-repeat;
    }
    .cls {
      justify-content: center;
      width: 130px;
      height: 100%;
      background: #eeeeee;
      border-radius: 20px;
      font-weight: 500;
      color: #c3c3c3;
    }
    .isCls {
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      color: #fff9e9;
    }
  }
  .SecondConfirmbox{
    /deep/.dialog-title{
      font-weight: 400;
    }
    /deep/.van-button__text{
      font-size: 15px;
    }
  }
</style>
